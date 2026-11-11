import { getLiturgicalDay, type LiturgicalDay } from './liturgicalCalendar';
import { LECTIONARY, WEEKDAYS } from '../data/lectionary';
import feedData from '../data/dailyReadingsFeed.json';
import { fetchPassage, fetchPassageSegments, type PassageSegment } from './bibleApi';
import type { ScripturePassage, TranslationId } from '../types';

export type ReadingType = 'first' | 'psalm' | 'second' | 'gospel';

export interface DailyReading {
  type: ReadingType;
  title: string;
  ref: string;
  bookApiName: string;
  /** Start chapter. */
  chapter: number;
  verseStart?: number;
  /** End verse — interpreted in the end chapter when `endChapter` is set. */
  verseEnd?: number;
  /** Set when the passage spans two chapters, e.g. Acts 12:24–13:5. */
  endChapter?: number;
  /** Exact verse ranges when the reading skips verses (from the daily feed). */
  segments?: readonly PassageSegment[];
  /** True when the lectionary verse numbering could not be matched to the
   *  available text, so the text is not shown (link to USCCB instead). */
  unverified?: boolean;
}

export interface DailyReadingsResult {
  day: LiturgicalDay | null;
  readings: DailyReading[];
}

/**
 * Read a lectionary tuple. The tuple shape is:
 *   [displayRef, bookApiName, chapter, verseStart, verseEnd]               (single-chapter)
 *   [displayRef, bookApiName, chapter, verseStart, verseEnd, endChapter]   (cross-chapter)
 */
function pick(t: readonly (string | number)[]): {
  ref: string;
  bookApiName: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  endChapter?: number;
} {
  return {
    ref: t[0] as string,
    bookApiName: t[1] as string,
    chapter: t[2] as number,
    verseStart: t[3] as number,
    verseEnd: t[4] as number,
    endChapter: t[5] as number | undefined,
  };
}

// 4th element = 1 when the verse numbering could not be verified (text withheld).
type FeedReading = [string, string, PassageSegment[], number?];
type FeedDay = { f: FeedReading; p?: FeedReading; s?: FeedReading; g: FeedReading };
// Built by scripts/build-daily-readings.mjs from the cpbjr/catholic-readings-api
// dataset (MIT). Covers 2026-2027; other dates use the built-in lectionary.
const FEED = feedData as unknown as Record<string, FeedDay>;

function dateKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function feedReading(type: ReadingType, title: string, r: FeedReading): DailyReading {
  const [ref, bookApiName, segments, withheld] = r;
  const first = segments[0];
  const last = segments[segments.length - 1];
  return {
    type,
    title,
    ref,
    bookApiName,
    segments,
    unverified: withheld === 1 ? true : undefined,
    chapter: first[0],
    verseStart: first[1] ?? undefined,
    verseEnd: last[2] ?? undefined,
    endChapter: last[3] ?? undefined,
  };
}

/** Fetch the scripture text for one daily reading in the user's translation. */
export async function fetchReadingPassage(
  reading: DailyReading,
  translation: TranslationId,
): Promise<ScripturePassage> {
  if (reading.unverified) throw new Error('Verse numbering for this reading is unverified');
  // Douay-Rheims numbers psalms differently (Vulgate), so lectionary psalm
  // references would land on the wrong psalm; use the WEB for those.
  const tr: TranslationId = reading.type === 'psalm' && translation === 'dra' ? 'web' : translation;
  if (reading.segments) {
    return fetchPassageSegments(reading.bookApiName, reading.segments, tr, reading.ref);
  }
  return fetchPassage(
    reading.bookApiName,
    reading.chapter,
    reading.verseStart,
    reading.verseEnd,
    tr,
    reading.endChapter,
  );
}

export function getDailyReadings(date: Date): DailyReadingsResult {
  const day = getLiturgicalDay(date);

  const feed = FEED[dateKey(date)];
  if (feed) {
    const readings: DailyReading[] = [feedReading('first', 'First Reading', feed.f)];
    if (feed.p) readings.push(feedReading('psalm', 'Responsorial Psalm', feed.p));
    if (feed.s) readings.push(feedReading('second', 'Second Reading', feed.s));
    readings.push(feedReading('gospel', 'Gospel', feed.g));
    return { day, readings };
  }

  if (!day) return { day: null, readings: [] };

  const entry = day.isSunday
    ? LECTIONARY[day.cycle][day.key]
    : WEEKDAYS[day.key];

  if (!entry) return { day, readings: [] };

  const readings: DailyReading[] = [];

  const f = pick(entry.first);
  readings.push({ type: 'first', title: 'First Reading', ...f });

  const p = pick(entry.psalm);
  readings.push({ type: 'psalm', title: 'Responsorial Psalm', ...p });

  if (entry.second) {
    const s = pick(entry.second);
    readings.push({ type: 'second', title: 'Second Reading', ...s });
  }

  const g = pick(entry.gospel);
  readings.push({ type: 'gospel', title: 'Gospel', ...g });

  return { day, readings };
}
