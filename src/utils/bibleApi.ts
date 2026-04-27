import type { ScripturePassage, TranslationId } from '../types';
import { BIBLE_BOOKS } from '../data/bibleBooks';

const BASE = 'https://bible-api.com';

export async function fetchPassage(
  bookApiName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
  translation: TranslationId = 'dra'
): Promise<ScripturePassage> {
  let ref = `${bookApiName}+${chapter}`;
  if (verseStart) {
    ref += `:${verseStart}`;
    if (verseEnd && verseEnd !== verseStart) ref += `-${verseEnd}`;
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
