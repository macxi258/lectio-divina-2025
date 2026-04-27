import { getLiturgicalDay, type LiturgicalDay } from './liturgicalCalendar';
import { LECTIONARY, WEEKDAYS } from '../data/lectionary';

export type ReadingType = 'first' | 'psalm' | 'second' | 'gospel';

export interface DailyReading {
  type: ReadingType;
  title: string;
  ref: string;
  bookApiName: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

export interface DailyReadingsResult {
  day: LiturgicalDay | null;
  readings: DailyReading[];
}

export function getDailyReadings(date: Date): DailyReadingsResult {
  const day = getLiturgicalDay(date);
  if (!day) return { day: null, readings: [] };

  // Sunday → look up cycle-specific table.
  // Weekday → look up the WEEKDAYS table (which contains Year I/II suffixed keys for OT).
  const entry = day.isSunday
    ? LECTIONARY[day.cycle][day.key]
    : WEEKDAYS[day.key];

  if (!entry) return { day, readings: [] };

  const readings: DailyReading[] = [];

  const [firstRef, firstBook, firstCh, firstVs, firstVe] = entry.first;
  readings.push({ type: 'first', title: 'First Reading', ref: firstRef, bookApiName: firstBook, chapter: firstCh, verseStart: firstVs, verseEnd: firstVe });

  const [psalmRef, psalmBook, psalmCh, psalmVs, psalmVe] = entry.psalm;
  readings.push({ type: 'psalm', title: 'Responsorial Psalm', ref: psalmRef, bookApiName: psalmBook, chapter: psalmCh, verseStart: psalmVs, verseEnd: psalmVe });

  if (entry.second) {
    const [secRef, secBook, secCh, secVs, secVe] = entry.second;
    readings.push({ type: 'second', title: 'Second Reading', ref: secRef, bookApiName: secBook, chapter: secCh, verseStart: secVs, verseEnd: secVe });
  }

  const [gospelRef, gospelBook, gospelCh, gospelVs, gospelVe] = entry.gospel;
  readings.push({ type: 'gospel', title: 'Gospel', ref: gospelRef, bookApiName: gospelBook, chapter: gospelCh, verseStart: gospelVs, verseEnd: gospelVe });

  return { day, readings };
}
