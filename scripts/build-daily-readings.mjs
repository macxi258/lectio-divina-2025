#!/usr/bin/env node
/**
 * Builds src/data/dailyReadingsFeed.json from the cpbjr/catholic-readings-api
 * dataset (MIT, https://github.com/cpbjr/catholic-readings-api).
 *
 * The feed contains Mass-reading REFERENCES only (no scripture text). The app
 * turns each reference into verse ranges and fetches the text from HelloAO.
 *
 * Usage:
 *   git clone --depth 1 https://github.com/cpbjr/catholic-readings-api.git /tmp/feed
 *   node scripts/build-daily-readings.mjs /tmp/feed/readings [year ...]
 *
 * Output shape (compact):
 *   { "YYYY-MM-DD": { f: R, p?: R, s?: R, g: R } }
 *   R = [displayRef, bookApiName, segments, withheld?]
 *   segment = [chapter, verseStart|null, verseEnd|null, endChapter|null]
 *   withheld = 1 when the verse numbering could not be verified against the
 *              WEB text (see scripts/versification.json)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// Feed book name → apiName used by src/data/bibleBooks.ts (built from that file).
const booksSrc = readFileSync(join(root, 'src/data/bibleBooks.ts'), 'utf8');
const BOOKS = {};
for (const m of booksSrc.matchAll(/name: '([^']+)', apiName: '([^']+)'/g)) BOOKS[m[1]] = m[2];
BOOKS['Psalm'] = 'psalms';
BOOKS['Wisdom'] = 'wisdom+of+solomon';

// Greek Esther additions are cited by letter; the Catholic chapter numbering
// puts addition C at chapter 14.
const LETTER_CHAPTERS = { C: 14 };

const BOOK_RE = /^((?:[1-3] )?[A-Za-z]+(?: of [A-Za-z]+)?) (.+)$/;

function chapterNum(s) {
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (s in LETTER_CHAPTERS) return LETTER_CHAPTERS[s];
  throw new Error(`bad chapter "${s}"`);
}

/** Parse one reference string into { book, segments }. First alternative only. */
export function parseRef(raw) {
  // Normalise whitespace (the feed contains non-breaking spaces and CRs).
  let s = raw.replace(/\s+/g, ' ').trim().replace(/\.$/, '').replace(/\s*:\s*/g, ':');
  s = s.split(/\s+or\s+/)[0]; // "A or B" → take the first (long) form
  s = s
    .replace(/[—–]/g, '-')
    .replace(/\s*-\s*/g, '-')                          // "3:15 - 4:1", "6c- 7"
    .replace(/\s*&\s*/g, ', ')                         // "78:3 & 4bc"
    .replace(/(\d)\s+([a-z]{1,3})(?=[-,;]|$)/gi, '$1$2') // "12 cd-20"
    .replace(/(\d)([a-z]+)(\d)/gi, '$1$2-$3')          // "3b4" typo for "3b-4"
    .replace(/(\d+)-\d+-\d+-(\d+)/, '$1-$2')           // "9-10-11-12" typo
    .replace(/(\d+):(\d+)-(\d+):\d+-(\d+)/, '$1:$2-$3:$4'); // "1:1-2:1-2"
  const m = BOOK_RE.exec(s);
  if (!m) throw new Error(`cannot split book from "${raw}"`);
  const bookName = m[1];
  const apiName = BOOKS[bookName];
  if (!apiName) throw new Error(`unknown book "${bookName}" in "${raw}"`);

  const segments = [];
  // Single-chapter books are cited by verse only ("Jude 17, 20b-25").
  const SINGLE_CHAPTER = new Set(['obadiah', 'philemon', '2+john', '3+john', 'jude']);
  let chapter = SINGLE_CHAPTER.has(apiName) && !m[2].includes(':') ? 1 : null;
  for (const part of m[2].split(';')) {
    const items = part.split(/,| and /).map((x) => x.trim()).filter(Boolean);
    items.forEach((item, idx) => {
      // "C:12" / "63:16b-17" start a chapter context; bare verse items continue it.
      const head = /^([0-9A-Z]+):(.*)$/.exec(item);
      let body = item;
      if (head) {
        chapter = chapterNum(head[1]);
        body = head[2];
      } else if (idx === 0 && chapter === null && /^\d+(-\d+)?$/.test(item)) {
        // Whole-chapter reference, e.g. "Psalm 117" (no colon anywhere).
        const [a, b] = item.split('-').map(Number);
        segments.push([a, null, null, b && b !== a ? b : null]);
        return;
      }
      // body: "16b-17" | "24-25a" | "30-19:3" | "5" | "3bc-4"
      const r = /^(\d+)[a-z]*(?:-(?:(\d+):)?(\d+)[a-z]*)?$/i.exec(body);
      if (!r) throw new Error(`cannot parse "${item}" in "${raw}"`);
      const vs = parseInt(r[1], 10);
      if (r[3] == null) {
        segments.push([chapter, vs, vs, null]);
      } else if (r[2] != null) {
        const endChapter = parseInt(r[2], 10);
        segments.push([chapter, vs, parseInt(r[3], 10), endChapter]);
        chapter = endChapter; // later bare verses (", 11") continue in the end chapter
      } else {
        segments.push([chapter, vs, parseInt(r[3], 10), null]);
      }
    });
  }

  // Merge adjacent/overlapping single-chapter segments (e.g. 3a, 3bc-4, 5, 6 → 3-6).
  const merged = [];
  for (const seg of segments) {
    const prev = merged[merged.length - 1];
    if (
      prev && prev[3] == null && seg[3] == null && prev[0] === seg[0] &&
      prev[1] != null && seg[1] != null && seg[1] <= prev[2] + 1
    ) {
      prev[2] = Math.max(prev[2], seg[2]);
    } else {
      merged.push([...seg]);
    }
  }
  return { apiName, segments: merged };
}

const failures = [];

// Verse-numbering audit (see scripts/versification.json): the lectionary uses
// NABRE/Hebrew numbering, the WEB text uses English numbering in places.
const VERS = JSON.parse(readFileSync(join(here, 'versification.json'), 'utf8'));
const FLAGGED = new Map(Object.entries(VERS.flaggedChapters).map(([b, c]) => [b, new Set(c)]));
const unverified = [];

function touchesFlagged(apiName, segments) {
  const set = FLAGGED.get(apiName);
  if (!set) return false;
  return segments.some(([ch, , , endCh]) => {
    for (let c = ch; c <= (endCh ?? ch); c++) if (set.has(c)) return true;
    return false;
  });
}

function reading(raw) {
  try {
    const { apiName, segments } = parseRef(raw);
    const ref = raw.replace(/\s+/g, ' ').trim().replace(/\.$/, '');
    const key = `${apiName}|${ref}`;
    if (VERS.overrides[key]) return [ref, apiName, VERS.overrides[key]];
    if (touchesFlagged(apiName, segments) && !VERS.identity.includes(key)) {
      unverified.push(ref);
      // 4th element = 1: numbering unverified, the app withholds the text.
      return [ref, apiName, segments, 1];
    }
    return [ref, apiName, segments];
  } catch (e) {
    failures.push(e.message);
    return null;
  }
}

// ─── main ────────────────────────────────────────────────────────────────────
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [dir, ...years] = process.argv.slice(2);
  if (!dir) {
    console.error('usage: node scripts/build-daily-readings.mjs <readings-dir> [year ...]');
    process.exit(1);
  }
  const wanted = years.length ? years : readdirSync(dir).filter((d) => /^\d{4}$/.test(d));
  const out = {};
  let n = 0;
  for (const year of wanted) {
    for (const file of readdirSync(join(dir, year)).sort()) {
      if (!file.endsWith('.json')) continue;
      const j = JSON.parse(readFileSync(join(dir, year, file), 'utf8'));
      const r = j.readings;
      if (!r?.firstReading || !r?.gospel) continue;
      const day = { f: reading(r.firstReading) };
      if (r.psalm) day.p = reading(r.psalm);
      if (r.secondReading) day.s = reading(r.secondReading);
      day.g = reading(r.gospel);
      // A day with any unparseable reading is dropped so the app falls back
      // to its built-in lectionary rather than showing a partial set.
      if (Object.values(day).some((v) => v === null)) continue;
      out[j.date] = day;
      n++;
    }
  }
  if (unverified.length) {
    console.log(`${new Set(unverified).size} reading(s) withheld (unverified verse numbering):`);
    for (const r of new Set(unverified)) console.log('  - ' + r);
  }
  if (failures.length) {
    console.error(`${failures.length} reference(s) could not be parsed:`);
    for (const f of [...new Set(failures)]) console.error('  - ' + f);
  }
  const dest = join(root, 'src/data/dailyReadingsFeed.json');
  writeFileSync(dest, JSON.stringify(out));
  console.log(`wrote ${n} days → ${dest}`);
}
