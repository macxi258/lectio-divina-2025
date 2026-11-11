// Psalm verse-number offsets: the lectionary (USCCB/NABRE) numbers a psalm's
// title line as verse 1 (or 1-2); the WEB / KJV texts leave titles unnumbered.
// Subtract the offset from a lectionary verse number to get the WEB/KJV verse.
// Derived by comparing verse counts of every psalm in NABRE vs WEB Catholic.
// Psalms not listed need no shift.
const OFFSETS: Record<number, number> = {3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 12: 1, 18: 1, 19: 1, 20: 1, 21: 1, 22: 1, 30: 1, 31: 1, 34: 1, 36: 1, 38: 1, 39: 1, 40: 1, 41: 1, 42: 1, 44: 1, 45: 1, 46: 1, 47: 1, 48: 1, 49: 1, 51: 2, 52: 2, 53: 1, 54: 2, 55: 1, 56: 1, 57: 1, 58: 1, 59: 1, 60: 2, 61: 1, 62: 1, 63: 1, 64: 1, 65: 1, 67: 1, 68: 1, 69: 1, 70: 1, 75: 1, 76: 1, 77: 1, 80: 1, 81: 1, 83: 1, 84: 1, 85: 1, 88: 1, 89: 1, 92: 1, 102: 1, 108: 1, 140: 1, 142: 1};

export function psalmTitleOffset(psalm: number): number {
  return OFFSETS[psalm] ?? 0;
}
