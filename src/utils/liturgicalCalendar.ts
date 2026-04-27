// Computes which liturgical day a date falls on (Catholic Roman Rite).
// Handles both Sundays and weekdays.

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function daysBetween(a: Date, b: Date) {
  const ad = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bd = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((bd - ad) / 86_400_000);
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

// Anonymous Gregorian algorithm
export function getEaster(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// First Sunday of Advent = Sunday nearest Nov 30
function getAdvent1(year: number): Date {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay();
  const d = new Date(nov30);
  d.setDate(30 + (dow <= 3 ? -dow : 7 - dow));
  return d;
}

// Epiphany observed on Sunday between Jan 2–8 (US calendar)
function getEpiphany(year: number): Date {
  const jan6 = new Date(year, 0, 6);
  const dow = jan6.getDay();
  if (dow === 0) return jan6;
  return addDays(jan6, dow <= 3 ? -dow : 7 - dow);
}

export type LiturgicalCycle = 'A' | 'B' | 'C';
export type WeekdayCycle = 'I' | 'II';

export interface LiturgicalDay {
  key: string;
  label: string;
  cycle: LiturgicalCycle;
  weekdayCycle: WeekdayCycle;
  isSunday: boolean;
}

const DAY_CODES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export function getLiturgicalDay(date: Date): LiturgicalDay | null {
  const year = date.getFullYear();
  const advent1This = getAdvent1(year);
  const endYear = date >= advent1This ? year + 1 : year;
  const startYear = endYear - 1;

  const cycleMap: Record<number, LiturgicalCycle> = { 1: 'A', 2: 'B', 0: 'C' };
  const cycle = cycleMap[endYear % 3];
  const weekdayCycle: WeekdayCycle = year % 2 === 1 ? 'I' : 'II';

  const advent1 = getAdvent1(startYear);
  const christmas = new Date(startYear, 11, 25);
  const newYear = new Date(endYear, 0, 1);
  const epiphany = getEpiphany(endYear);
  const baptism = addDays(epiphany, 7);
  const easter = getEaster(endYear);
  const ashWed = addDays(easter, -46);
  const palmSun = addDays(easter, -7);
  const holyThu = addDays(easter, -3);
  const goodFri = addDays(easter, -2);
  const holySat = addDays(easter, -1);
  const pentecost = addDays(easter, 49);
  const trinity = addDays(pentecost, 7);
  const corpus = addDays(trinity, 7);
  const adventNext = getAdvent1(endYear);
  const christKing = addDays(adventNext, -7);

  const dow = date.getDay();
  const isSunday = dow === 0;
  const dayCode = DAY_CODES[dow];
  const dayName = DAY_NAMES[dow];

  const make = (key: string, label: string): LiturgicalDay => ({
    key, label, cycle, weekdayCycle, isSunday,
  });

  // ─── Holy Week / Triduum ──────────────────────────────────────────────────
  if (sameDay(date, palmSun)) return make('palm-sunday', 'Palm Sunday');
  if (sameDay(date, addDays(palmSun, 1))) return make('holyweek-mon', 'Monday of Holy Week');
  if (sameDay(date, addDays(palmSun, 2))) return make('holyweek-tue', 'Tuesday of Holy Week');
  if (sameDay(date, addDays(palmSun, 3))) return make('holyweek-wed', 'Wednesday of Holy Week');
  if (sameDay(date, holyThu)) return make('holy-thu', 'Holy Thursday');
  if (sameDay(date, goodFri)) return make('good-fri', 'Good Friday');
  if (sameDay(date, holySat)) return make('holy-sat', 'Holy Saturday');

  // ─── Advent ───────────────────────────────────────────────────────────────
  if (date >= advent1 && date < christmas) {
    if (date.getMonth() === 11 && date.getDate() >= 17 && date.getDate() <= 24) {
      const dayNum = date.getDate();
      if (isSunday) {
        for (let i = 1; i <= 4; i++) {
          if (sameDay(date, addDays(advent1, (i - 1) * 7)))
            return make(`advent-${i}`, `${ord(i)} Sunday of Advent`);
        }
      }
      return make(`advent-late-dec${dayNum}`, `December ${dayNum} (Advent)`);
    }
    const week = Math.floor(daysBetween(advent1, date) / 7) + 1;
    if (isSunday && week >= 1 && week <= 4)
      return make(`advent-${week}`, `${ord(week)} Sunday of Advent`);
    if (week >= 1 && week <= 4)
      return make(`advent-w${week}-${dayCode}`, `${dayName} of the ${ord(week)} Week of Advent`);
  }

  // ─── Christmas Octave ─────────────────────────────────────────────────────
  if (sameDay(date, christmas)) return make('christmas-day', 'Christmas Day');
  if (date > christmas && date < newYear) {
    if (isSunday) return make('holy-family', 'The Holy Family');
    const dayNum = date.getDate();
    return make(`christmas-oct-dec${dayNum}`, `December ${dayNum} (Christmas Octave)`);
  }
  if (sameDay(date, newYear)) return make('mary-mother', 'Mary, Mother of God');

  // ─── Days between Jan 2 and Epiphany ──────────────────────────────────────
  if (date > newYear && date < epiphany) {
    const dayNum = date.getDate();
    return make(`epiphany-pre-jan${dayNum}`, `January ${dayNum} (before Epiphany)`);
  }
  if (sameDay(date, epiphany)) return make('epiphany', 'Epiphany');

  if (date > epiphany && date < baptism) {
    return make(`epiphany-post-${dayCode}`, `${dayName} after Epiphany`);
  }
  if (sameDay(date, baptism)) return make('baptism-lord', 'Baptism of the Lord');

  // ─── Ordinary Time (pre-Lent) ─────────────────────────────────────────────
  if (date > baptism && date < ashWed) {
    const daysFromBaptism = daysBetween(baptism, date);
    if (isSunday) {
      const n = Math.floor(daysFromBaptism / 7) + 2;
      if (n >= 2 && n <= 9) return make(`ot-${n}`, `${ord(n)} Sunday in Ordinary Time`);
    }
    const week = Math.floor((daysFromBaptism - 1) / 7) + 1;
    return make(`ot-w${week}-${dayCode}-${weekdayCycle}`, `${dayName} of the ${ord(week)} Week in Ordinary Time`);
  }

  // ─── Ash Wednesday and days after ─────────────────────────────────────────
  if (sameDay(date, ashWed)) return make('ash-wed', 'Ash Wednesday');
  if (sameDay(date, addDays(ashWed, 1))) return make('ash-thu', 'Thursday after Ash Wednesday');
  if (sameDay(date, addDays(ashWed, 2))) return make('ash-fri', 'Friday after Ash Wednesday');
  if (sameDay(date, addDays(ashWed, 3))) return make('ash-sat', 'Saturday after Ash Wednesday');

  // ─── Lent (week 1 starts the Sunday after Ash Wed) ────────────────────────
  if (date > addDays(ashWed, 3) && date < palmSun) {
    const lent1Sun = addDays(ashWed, 4);
    const daysFromLent1 = daysBetween(lent1Sun, date);
    const week = Math.floor(daysFromLent1 / 7) + 1;
    if (isSunday && week >= 1 && week <= 5) return make(`lent-${week}`, `${ord(week)} Sunday of Lent`);
    if (week >= 1 && week <= 5) return make(`lent-w${week}-${dayCode}`, `${dayName} of the ${ord(week)} Week of Lent`);
  }

  // ─── Easter Octave ────────────────────────────────────────────────────────
  if (sameDay(date, easter)) return make('easter-1', 'Easter Sunday');
  if (date > easter && date < addDays(easter, 7)) {
    return make(`easter-oct-${dayCode}`, `${dayName} of the Easter Octave`);
  }

  // ─── Easter weeks 2-7 ─────────────────────────────────────────────────────
  if (date >= addDays(easter, 7) && date < pentecost) {
    const week = Math.floor(daysBetween(easter, date) / 7) + 1;
    if (isSunday && week >= 2 && week <= 7) return make(`easter-${week}`, `${ord(week)} Sunday of Easter`);
    if (week >= 2 && week <= 7) return make(`easter-w${week}-${dayCode}`, `${dayName} of the ${ord(week)} Week of Easter`);
  }

  if (sameDay(date, pentecost)) return make('pentecost', 'Pentecost Sunday');

  // ─── Ordinary Time (post-Pentecost) ───────────────────────────────────────
  if (sameDay(date, trinity)) return make('trinity', 'The Most Holy Trinity');
  if (sameDay(date, corpus)) return make('corpus-christi', 'The Most Holy Body and Blood of Christ');
  if (sameDay(date, christKing)) return make('christ-king', 'Christ the King');

  if (date > pentecost && date <= christKing) {
    const weeksToChristKing = Math.floor(daysBetween(date, christKing) / 7);
    const week = 34 - weeksToChristKing;
    if (isSunday && week >= 9 && week <= 33)
      return make(`ot-${week}`, `${ord(week)} Sunday in Ordinary Time`);
    if (!isSunday && week >= 8 && week <= 34)
      return make(`ot-w${week}-${dayCode}-${weekdayCycle}`, `${dayName} of the ${ord(week)} Week in Ordinary Time`);
  }

  return null;
}

function ord(n: number): string {
  if (n === 1) return '1st'; if (n === 2) return '2nd';
  if (n === 3) return '3rd'; return `${n}th`;
}
