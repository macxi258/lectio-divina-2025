// Release notes shown on the About page.
//
// To ship a new version:
//   1. Add a new entry at the TOP of CHANGELOG (newest first).
//   2. Set the same number in package.json ("version") — the app reads its
//      displayed version from there, and the entry whose version matches is
//      marked "Current".
// Versions before 0.4.0 were reconstructed from the project's commit history.

export type ChangeType = 'new' | 'improved' | 'fixed';

export interface Release {
  version: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  title: string;
  changes: { type: ChangeType; text: string }[];
  /** Optional caveat shown under the list. */
  note?: string;
}

export const CHANGELOG: Release[] = [
  {
    version: '0.4.0',
    date: '2026-11-11',
    title: 'Daily Mass readings',
    changes: [
      { type: 'new', text: 'Reading of the Day now opens automatically and shows the full text of today’s readings: first reading, psalm, second reading and Gospel.' },
      { type: 'new', text: 'Daily Mass readings for every day of 2026 and 2027, following the Catholic lectionary.' },
      { type: 'new', text: 'Bible text now comes from a free public-domain source with the complete Catholic canon (Tobit, Judith, Wisdom, Sirach, Baruch and Maccabees included). The previous sources remain as a backup.' },
      { type: 'improved', text: 'Readings that skip verses, such as Genesis 2:7-9; 3:1-7, now show only the verses actually read at Mass.' },
      { type: 'improved', text: 'Psalm verse numbers now match the lectionary, so the right verses appear.' },
      { type: 'improved', text: 'Corrected verse numbering for readings where Hebrew and English Bibles differ (Hosea, Joel, Malachi, Zechariah, Jonah, Nahum, Micah and others).' },
      { type: 'fixed', text: 'A few readings opened in the wrong chapter (Matthew 9:35–10:8, 2 Corinthians 3:15–4:6, Numbers 13–14 and Jonah 1–2).' },
      { type: 'fixed', text: '“33th Week” now reads “33rd Week” (and likewise for 21st, 22nd, 23rd and so on).' },
    ],
    note: 'A small number of readings (the Daniel canticle, some Sirach, Tobit and the Romans 16 doxology) show a link to USCCB instead of text until their verse numbering can be verified.',
  },
  {
    version: '0.3.0',
    date: '2026-05-02',
    title: 'Catholic Bible books',
    changes: [
      { type: 'new', text: 'The deuterocanonical books are now available through a secure Cloudflare service that keeps the Bible API key out of the app.' },
      { type: 'improved', text: 'Fixed how books and verses are matched, so passages open at the right place.' },
      { type: 'improved', text: 'Updated the About page.' },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-04-28',
    title: 'Journal, About and mobile polish',
    changes: [
      { type: 'new', text: 'Journal page with expandable entries.' },
      { type: 'new', text: 'About page.' },
      { type: 'new', text: 'The app is now served from its own domain.' },
      { type: 'improved', text: 'Better layout and visibility on Android and in the installed app.' },
      { type: 'improved', text: 'Refined the Reflection, Conversion and Giving steps, including an expandable menu in Conversion.' },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-04-27',
    title: 'First release',
    changes: [
      { type: 'new', text: 'Guided Lectio Divina sessions: opening prayer, Bible reading, reflection, conversion, silence and giving.' },
      { type: 'new', text: 'Installable app that works on phones and in the browser.' },
    ],
  },
];
