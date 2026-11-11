import type { ScripturePassage, TranslationId } from '../types';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { psalmTitleOffset } from '../data/psalmVerseOffsets';

const BIBLE_API_BASE = 'https://bible-api.com';
// All API.Bible traffic routes through our Cloudflare Worker proxy. The
// Worker holds the API.Bible secret on its server-side env; the client
// bundle never embeds it. See `worker/README.md` for deployment.
const API_BIBLE_BASE =
  (import.meta.env.VITE_BIBLE_PROXY_URL ?? '').replace(/\/+$/, '') + '/v1';
const API_BIBLE_ID = import.meta.env.VITE_BIBLE_API_BIBLE_ID;

// ─── Book routing ──────────────────────────────────────────────────────────
// bible-api.com only ships the 66-book Protestant canon. The seven
// deuterocanonical books we list below must hit API.Bible (rest.api.bible)
// instead. Map our internal slug → the 3-letter book id API.Bible uses.
const API_BIBLE_BOOK_IDS: Record<string, string> = {
  'tobit':             'TOB',
  'judith':            'JDT',
  'wisdom+of+solomon': 'WIS',
  'sirach':            'SIR',
  'baruch':            'BAR',
  '1+maccabees':       '1MA',
  '2+maccabees':       '2MA',
};

// Fallback mapping — used when bible-api.com 404s on a book whose
// Catholic-canon counterpart on API.Bible exposes more chapters/verses
// (Daniel 13 = Susanna, Daniel 14 = Bel & the Dragon, Esther's Greek
// additions). The Douay-Rheims on API.Bible files these under the regular
// `DAN`/`EST` book ids.
const API_BIBLE_FALLBACK_IDS: Record<string, string> = {
  daniel: 'DAN',
  esther: 'EST',
};

function isPrimarilyDeutero(bookSlug: string): boolean {
  return bookSlug in API_BIBLE_BOOK_IDS;
}

function apiBibleIdFor(bookSlug: string, fallback = false): string | null {
  return API_BIBLE_BOOK_IDS[bookSlug]
    ?? (fallback ? API_BIBLE_FALLBACK_IDS[bookSlug] ?? null : null);
}

// ─── Public entry point ────────────────────────────────────────────────────

/**
 * Fetch a Bible passage. Routes to API.Bible for deuterocanonical books
 * (Tobit, Judith, Wisdom, Sirach, Baruch, 1/2 Maccabees) and to
 * bible-api.com for everything else. If bible-api.com 404s on a book that
 * has a Catholic-canon counterpart on API.Bible (Daniel/Esther additions),
 * we try API.Bible as a second pass.
 */
export async function fetchPassage(
  bookApiName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
  translation: TranslationId = 'dra',
  endChapter?: number,
): Promise<ScripturePassage> {
  // Primary: HelloAO (free, keyless, full Catholic canon). On any failure
  // fall through to the previous bible-api.com / API.Bible routing.
  try {
    return await fetchFromHelloAo(bookApiName, chapter, verseStart, verseEnd, translation, endChapter);
  } catch {
    // fall through to legacy providers
  }
  return fetchLegacy(bookApiName, chapter, verseStart, verseEnd, translation, endChapter);
}

/** [chapter, verseStart|null, verseEnd|null, endChapter|null] */
export type PassageSegment = readonly [number, number | null, number | null, number | null];

/**
 * Fetch a reading made of several verse ranges (e.g. Gen 2:7-9; 3:1-7) and
 * join them, so verses the lectionary skips are not shown.
 */
export async function fetchPassageSegments(
  bookApiName: string,
  segments: readonly PassageSegment[],
  translation: TranslationId,
  displayRef: string,
): Promise<ScripturePassage> {
  const verses: ScripturePassage['verses'] = [];
  const isPsalm = bookApiName === 'psalms';
  for (const [ch, vs, ve, endCh] of segments) {
    // Lectionary psalm verses count the title line; the WEB/KJV texts don't.
    const startShift = isPsalm ? psalmTitleOffset(ch) : 0;
    const endShift = isPsalm ? psalmTitleOffset(endCh ?? ch) : 0;
    const start = vs != null ? Math.max(1, vs - startShift) : undefined;
    // Only compare against the start verse when both are in the same chapter.
    const end = ve != null
      ? (endCh == null ? Math.max(start ?? 1, ve - endShift) : Math.max(1, ve - endShift))
      : undefined;
    const p = await fetchPassage(bookApiName, ch, start, end, translation, endCh ?? undefined);
    verses.push(...p.verses);
  }
  return { reference: displayRef, text: verses.map((v) => v.text).join(' '), verses };
}

// ─── HelloAO Free Use Bible API (primary) ──────────────────────────────────

const HELLOAO_BASE = 'https://bible.helloao.org/api';

// Our translation ids → HelloAO translation ids.
const HELLOAO_TRANSLATIONS: Record<TranslationId, string> = {
  dra: 'eng_dra',   // Douay-Rheims 1899 (73 books)
  web: 'eng_webc',  // World English Bible, Catholic edition (73 books)
  kjv: 'eng_kja',   // King James Version + Apocrypha
};

// Our book ids mostly match HelloAO's USFM ids when upper-cased; these differ.
const HELLOAO_ID_OVERRIDES: Record<string, string> = { eze: 'EZK', joe: 'JOL', nah: 'NAM' };

interface HelloAoChapter {
  book: { id: string; name: string; numberOfChapters: number };
  chapter: { number: number; content: unknown[] };
}

const helloAoCache = new Map<string, Promise<HelloAoChapter>>();

function loadHelloAoChapter(translationId: string, bookCode: string, chapter: number): Promise<HelloAoChapter> {
  const url = `${HELLOAO_BASE}/${translationId}/${bookCode}/${chapter}.json`;
  let p = helloAoCache.get(url);
  if (!p) {
    p = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`HelloAO error: ${res.status}`);
      return res.json() as Promise<HelloAoChapter>;
    });
    p.catch(() => helloAoCache.delete(url)); // don't cache failures
    helloAoCache.set(url, p);
  }
  return p;
}

// Verse content is a mix of strings, {text, poem} runs, footnote refs and
// inline headings/line breaks. Keep only the readable text.
function flattenVerseContent(content: unknown[]): string {
  const parts: string[] = [];
  for (const c of content) {
    if (typeof c === 'string') parts.push(c);
    else if (c && typeof (c as { text?: unknown }).text === 'string') parts.push((c as { text: string }).text);
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

async function fetchFromHelloAo(
  bookApiName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
  translation: TranslationId = 'dra',
  endChapter?: number,
): Promise<ScripturePassage> {
  const book = BIBLE_BOOKS.find((b) => b.apiName === bookApiName);
  if (!book) throw new Error(`Unknown book "${bookApiName}"`);
  const translationId = HELLOAO_TRANSLATIONS[translation] ?? HELLOAO_TRANSLATIONS.web;

  // The WEB Catholic edition splits Daniel and Esther into Hebrew/Greek
  // books. Greek Daniel (DAG) uses Catholic numbering (3:52, 13, 14); Greek
  // Esther is numbered differently from the lectionary, so defer to legacy.
  let code = HELLOAO_ID_OVERRIDES[book.id] ?? book.id.toUpperCase();
  if (translationId === 'eng_webc') {
    if (book.id === 'est') throw new Error('Esther numbering differs in WEBC');
    if (book.id === 'dan') code = 'DAG';
  }

  const lastChapter = endChapter && endChapter > chapter ? endChapter : chapter;
  // A start verse with no end verse in a single chapter means just that verse
  // (matches the previous bible-api.com behaviour for e.g. "John 3:16").
  if (verseStart != null && verseEnd == null && lastChapter === chapter) verseEnd = verseStart;
  const verses: ScripturePassage['verses'] = [];
  let bookName = book.name;

  for (let ch = chapter; ch <= lastChapter; ch++) {
    const data = await loadHelloAoChapter(translationId, code, ch);
    bookName = book.name;
    for (const item of data.chapter.content as { type: string; number?: number; content?: unknown[] }[]) {
      if (item.type !== 'verse' || item.number == null) continue;
      const n = item.number;
      if (verseStart != null) {
        if (ch === chapter && n < verseStart) continue;
        if (verseEnd != null && ch === lastChapter && n > verseEnd) continue;
      } else if (verseEnd != null && ch === lastChapter && n > verseEnd) {
        continue;
      }
      const text = flattenVerseContent(item.content ?? []);
      if (text) verses.push({ book_id: code, book_name: bookName, chapter: ch, verse: n, text });
    }
  }

  if (verses.length === 0) throw new Error('HelloAO returned no verses');

  let reference = `${bookName} ${chapter}`;
  if (verseStart != null) {
    reference += `:${verseStart}`;
    if (lastChapter !== chapter) reference += `–${lastChapter}:${verseEnd ?? verses[verses.length - 1].verse}`;
    else if (verseEnd != null && verseEnd !== verseStart) reference += `–${verseEnd}`;
  } else if (lastChapter !== chapter) {
    reference += `–${lastChapter}`;
  }

  return { reference, text: verses.map((v) => v.text).join(' '), verses };
}

// ─── Legacy routing (fallback) ─────────────────────────────────────────────

async function fetchLegacy(
  bookApiName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
  translation: TranslationId = 'dra',
  endChapter?: number,
): Promise<ScripturePassage> {
  if (isPrimarilyDeutero(bookApiName)) {
    return fetchFromApiBible(bookApiName, chapter, verseStart, verseEnd, endChapter);
  }
  try {
    return await fetchFromBibleApi(bookApiName, chapter, verseStart, verseEnd, translation, endChapter);
  } catch (err) {
    // Daniel ch 13/14 or chapter 3 deutero verses, Esther 14 etc. live in
    // API.Bible's expanded book ids; try once more with the fallback id.
    if (apiBibleIdFor(bookApiName, /* fallback */ true)) {
      return fetchFromApiBible(bookApiName, chapter, verseStart, verseEnd, endChapter, /* fallback */ true);
    }
    throw err;
  }
}

// ─── bible-api.com (66-book canon) ─────────────────────────────────────────

async function fetchFromBibleApi(
  bookApiName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
  translation: TranslationId = 'dra',
  endChapter?: number,
): Promise<ScripturePassage> {
  let ref = `${bookApiName}+${chapter}`;
  if (verseStart) {
    ref += `:${verseStart}`;
    if (endChapter && endChapter !== chapter) {
      ref += `-${endChapter}:${verseEnd ?? ''}`;
    } else if (verseEnd && verseEnd !== verseStart) {
      ref += `-${verseEnd}`;
    }
  } else if (endChapter && endChapter !== chapter) {
    ref += `-${endChapter}`;
  }
  const url = `${BIBLE_API_BASE}/${ref}?translation=${translation}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Bible API error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as ScripturePassage;
}

// ─── API.Bible (Catholic canon w/ deuterocanonicals) ───────────────────────

async function fetchFromApiBible(
  bookApiName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
  endChapter?: number,
  useFallbackId = false,
): Promise<ScripturePassage> {
  if (!import.meta.env.VITE_BIBLE_PROXY_URL || !API_BIBLE_ID) {
    throw new Error('Bible proxy URL or Bible ID is not configured.');
  }
  const code = apiBibleIdFor(bookApiName, useFallbackId);
  if (!code) throw new Error(`No API.Bible id for book "${bookApiName}"`);

  const start = `${code}.${chapter}.${verseStart ?? 1}`;
  const end =
    endChapter && endChapter !== chapter
      ? `${code}.${endChapter}.${verseEnd ?? 1}`
      : verseEnd && verseEnd !== verseStart
        ? `${code}.${chapter}.${verseEnd}`
        : null;
  const passageId = end ? `${start}-${end}` : start;

  const params = new URLSearchParams({
    'content-type': 'text',
    'include-verse-numbers': 'true',
    'include-chapter-numbers': 'false',
    'include-titles': 'false',
    'include-notes': 'false',
  });
  const url = `${API_BIBLE_BASE}/bibles/${API_BIBLE_ID}/passages/${passageId}?${params}`;
  // No api-key header — the Cloudflare Worker injects it server-side.
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`API.Bible error: ${res.status}`);
  const json = await res.json();
  if (json.statusCode && json.statusCode >= 400) throw new Error(json.message ?? 'API.Bible error');
  return normalizeApiBibleResponse(json.data);
}

// API.Bible returns a single `content` string with bracketed verse markers
// like `"[30] text  [31] text"`. We split it back into the same `verses[]`
// shape our existing UI expects from bible-api.com so nothing downstream
// needs to change.
interface ApiBibleData {
  reference: string;
  content: string;
  bookId: string;
  chapterIds: string[]; // e.g. ['SIR.27', 'SIR.28']
}

function normalizeApiBibleResponse(d: ApiBibleData): ScripturePassage {
  // Pull a clean book name from "Sirach 27:30-28:7" → "Sirach"
  const bookName = (d.reference.split(/\s+\d/)[0] ?? d.bookId).trim();

  const verses: ScripturePassage['verses'] = [];
  const re = /\[(\d+)\]\s*([\s\S]*?)(?=\s*\[\d+\]|\s*$)/g;

  let chapterIdx = 0;
  let prevVerse = -Infinity;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d.content)) !== null) {
    const verse = parseInt(m[1], 10);
    const text = m[2].replace(/\s+/g, ' ').trim();
    if (!text) continue;

    // Verse numbers reset when crossing into a new chapter.
    if (verse < prevVerse && chapterIdx + 1 < d.chapterIds.length) chapterIdx++;
    prevVerse = verse;

    const chapterId = d.chapterIds[chapterIdx] ?? d.chapterIds[0];
    const chapter = parseInt(chapterId.split('.').pop() ?? '0', 10);

    verses.push({
      book_id: d.bookId,
      book_name: bookName,
      chapter,
      verse,
      text,
    });
  }

  return {
    reference: d.reference,
    text: verses.map((v) => v.text).join(' '),
    verses,
  };
}

// ─── Reference & display helpers (unchanged) ───────────────────────────────

export function buildReference(
  bookId: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
): string {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) return '';
  let ref = `${book.name} ${chapter}`;
  if (verseStart) {
    ref += `:${verseStart}`;
    if (verseEnd && verseEnd !== verseStart) ref += `–${verseEnd}`;
  }
  return ref;
}

export function formatVerseText(passage: ScripturePassage): string {
  if (!passage.verses || passage.verses.length === 0) return passage.text || '';
  return passage.verses
    .map((v) => `[${v.verse}] ${v.text.trim()}`)
    .join(' ');
}
