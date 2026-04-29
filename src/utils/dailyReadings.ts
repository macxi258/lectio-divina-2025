import { getLiturgicalDay, type LiturgicalDay } from './liturgicalCalendar';
import { LECTIONARY, WEEKDAYS } from '../data/lectionary';

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

export function getDailyReadings(date: Date): DailyReadingsResult {
  const day = getLiturgicalDay(date);
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
