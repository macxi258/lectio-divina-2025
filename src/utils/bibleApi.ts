import type { ScripturePassage, TranslationId } from '../types';
import { BIBLE_BOOKS } from '../data/bibleBooks';

const BASE = 'https://bible-api.com';

/**
 * Fetch a Bible passage. Supports passages that span two chapters
 * (e.g. Acts 12:24–13:5) when `endChapter` is provided and differs
 * from `chapter`. bible-api.com natively accepts the cross-chapter
 * format `book+startChapter:startVerse-endChapter:endVerse`.
 */
export async function fetchPassage(
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
      // Cross-chapter range: e.g. acts+12:24-13:5
      ref += `-${endChapter}:${verseEnd ?? ''}`;
    } else if (verseEnd && verseEnd !== verseStart) {
      ref += `-${verseEnd}`;
    }
  } else if (endChapter && endChapter !== chapter) {
    // Whole-chapters range without verse markers
    ref += `-${endChapter}`;
  }
  const url = `${BASE}/${ref}?translation=${translation}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Bible API error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as ScripturePassage;
}

export function buildReference(
  bookId: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number
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
