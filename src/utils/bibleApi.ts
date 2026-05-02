import type { ScripturePassage, TranslationId } from '../types';
import { BIBLE_BOOKS } from '../data/bibleBooks';

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
