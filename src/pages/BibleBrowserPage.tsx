import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, Search, Loader2, CalendarDays, BookOpen } from 'lucide-react';
import { BIBLE_BOOKS, OLD_TESTAMENT, NEW_TESTAMENT } from '../data/bibleBooks';
import type { BibleBook } from '../types';
import { fetchPassage, buildReference, formatVerseText } from '../utils/bibleApi';
import { getDailyReadings, type DailyReading } from '../utils/dailyReadings';
import { useStore } from '../store/useStore';
import Button from '../components/shared/Button';
import { OPENING_PRAYERS } from '../data/prayers';
import { format } from 'date-fns';

type Step = 'testament' | 'book' | 'chapter' | 'verse' | 'confirm';

// ─── Reading of the Day panel ─────────────────────────────────────────────────

const READING_COLORS: Record<string, string> = {
  first: 'border-blue-300 bg-blue-50',
  psalm: 'border-purple-300 bg-purple-50',
  second: 'border-green-300 bg-green-50',
  gospel: 'border-gold bg-amber-50',
  other: 'border-warm-200 bg-warm-50',
};

const READING_LABEL_COLORS: Record<string, string> = {
  first: 'text-blue-600',
  psalm: 'text-purple-600',
  second: 'text-green-600',
  gospel: 'text-amber-700',
  other: 'text-warm-500',
};

interface DailyPanelProps {
  onSelectReading: (reading: DailyReading) => void;
}

function DailyReadingsPanel({ onSelectReading }: DailyPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [loadingRef, setLoadingRef] = useState<string | null>(null);

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const { day, readings } = getDailyReadings(new Date());

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-warm-100 hover:border-gold/50 hover:shadow-md transition-all shadow-sm text-left group"
      >
        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-navy/10 transition-colors">
          <CalendarDays size={20} className="text-navy" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-navy font-medium">Reading of the Day</p>
          <p className="text-warm-400 text-sm truncate">{today}</p>
        </div>
        <ChevronRight size={18} className="text-warm-300 group-hover:text-navy transition-colors" />
      </button>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="bg-white rounded-2xl px-5 py-4 border border-warm-100 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-navy" />
            <p className="font-serif text-navy font-medium text-sm">Reading of the Day</p>
          </div>
          <button onClick={() => setExpanded(false)} className="text-xs text-warm-400 hover:text-navy transition-colors">✕</button>
        </div>
        {day && <p className="text-warm-600 text-sm font-medium mb-2">{day.label}</p>}
        <p className="text-warm-500 text-sm leading-relaxed mb-3">
          Readings for this day are not yet in the local lectionary. You can find them at:
        </p>
        <div className="flex flex-col gap-1.5">
          <a
            href="https://bible.usccb.org/bible/readings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-navy underline hover:text-gold"
          >
            USCCB Daily Readings →
          </a>
          <a
            href="https://universalis.com/mass.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-navy underline hover:text-gold"
          >
            Universalis →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
      <div className="bg-navy/5 border-b border-warm-100 px-5 py-3 flex items-center gap-2">
        <CalendarDays size={16} className="text-navy" />
        <div className="flex-1">
          <p className="font-serif text-navy font-medium text-sm">{day?.label ?? 'Mass Readings'}</p>
          <p className="text-warm-400 text-xs">{today}</p>
        </div>
        <button onClick={() => setExpanded(false)} className="text-xs text-warm-400 hover:text-navy transition-colors">✕</button>
      </div>

      <div className="divide-y divide-warm-100">
        {readings.map((reading) => (
          <div
            key={reading.ref}
            className={`px-4 py-3 border-l-4 ${READING_COLORS[reading.type]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium uppercase tracking-wide mb-0.5 ${READING_LABEL_COLORS[reading.type]}`}>
                  {reading.title}
                </p>
                <p className="font-serif text-navy text-sm font-medium">{reading.ref}</p>
              </div>
              <button
                disabled={loadingRef === reading.ref}
                onClick={async () => {
                  setLoadingRef(reading.ref);
                  try {
                    await onSelectReading(reading);
                  } finally {
                    setLoadingRef(null);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-gold rounded-lg text-xs font-medium hover:bg-navy-light transition-colors flex-shrink-0 disabled:opacity-60"
              >
                {loadingRef === reading.ref ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <BookOpen size={12} />
                )}
                Use
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BibleBrowserPage() {
  const navigate = useNavigate();
  const createSession = useStore((s) => s.createSession);
  const user = useStore((s) => s.user);

  const [step, setStep] = useState<Step>('testament');
  const [testament, setTestament] = useState<'old' | 'new' | null>(null);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verseStart, setVerseStart] = useState<number | null>(null);
  const [verseEnd, setVerseEnd] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passageText, setPassageText] = useState('');
  const [passageRef, setPassageRef] = useState('');
  const [totalVerses, setTotalVerses] = useState(0);
  const [showPassagePreview, setShowPassagePreview] = useState(false);

  const books = testament === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT;
  const filteredBooks = searchQuery
    ? BIBLE_BOOKS.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : books;

  async function loadChapter(book: BibleBook, chapter: number) {
    setLoading(true);
    setError('');
    try {
      const translation = user?.preferredTranslation ?? 'dra';
      const passage = await fetchPassage(book.apiName, chapter, undefined, undefined, translation);
      const text = formatVerseText(passage);
      setPassageText(text);
      setPassageRef(passage.reference || buildReference(book.id, chapter));
      setTotalVerses(passage.verses?.length ?? 0);
      setStep('verse');
    } catch {
      setError('Could not load this passage. Please try another.');
    } finally {
      setLoading(false);
    }
  }

  async function loadPassage(vStart?: number, vEnd?: number) {
    if (!selectedBook || !selectedChapter) return;
    setLoading(true);
    setError('');
    try {
      const translation = user?.preferredTranslation ?? 'dra';
      const passage = await fetchPassage(selectedBook.apiName, selectedChapter, vStart, vEnd, translation);
      const text = formatVerseText(passage);
      setPassageText(text);
      setPassageRef(passage.reference || buildReference(selectedBook.id, selectedChapter, vStart, vEnd));
      setStep('confirm');
    } catch {
      setError('Could not load this passage. Please try another.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDailyReading(reading: DailyReading) {
    setLoading(true);
    setError('');
    try {
      const translation = user?.preferredTranslation ?? 'dra';
      const passage = await fetchPassage(
        reading.bookApiName,
        reading.chapter,
        reading.verseStart,
        reading.verseEnd,
        translation,
      );
      const text = formatVerseText(passage);
      setPassageText(text);
      setPassageRef(passage.reference || reading.ref);
      setStep('confirm');
    } catch {
      setError('Could not load this passage from the Bible API. Please try browsing manually.');
    } finally {
      setLoading(false);
    }
  }

  function startSession() {
    if (!passageRef || !passageText) return;
    const id = createSession(passageRef, passageText, OPENING_PRAYERS[0].id);
    navigate(`/session/${id}`);
  }

  const breadcrumb = () => {
    const parts: { label: string; onClick: () => void }[] = [];
    if (testament) parts.push({ label: testament === 'old' ? 'Old Testament' : 'New Testament', onClick: () => { setStep('testament'); setSelectedBook(null); setSelectedChapter(null); } });
    if (selectedBook) parts.push({ label: selectedBook.name, onClick: () => { setStep('chapter'); setSelectedChapter(null); } });
    if (selectedChapter) parts.push({ label: `Chapter ${selectedChapter}`, onClick: () => setStep('verse') });
    return parts;
  };

  return (
    <div className="h-full bg-cream flex flex-col">
      <div className="bg-navy text-white px-5 pt-4 pb-5 flex-shrink-0">
        <h1 className="font-serif text-xl font-medium mb-3">Choose a Passage</h1>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) setStep('book'); }}
            placeholder="Search books (e.g., John, Psalms…)"
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
          />
        </div>

        {breadcrumb().length > 0 && (
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            {breadcrumb().map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-white/30" />}
                <button onClick={b.onClick} className="text-xs text-gold/80 hover:text-gold transition-colors">
                  {b.label}
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="text-warm-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="mx-5 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && step === 'testament' && (
          <div className="p-5 flex flex-col gap-3">
            {/* Reading of the Day */}
            <DailyReadingsPanel onSelectReading={handleDailyReading} />

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-warm-200" />
              <span className="text-warm-400 text-xs uppercase tracking-wide">or browse</span>
              <div className="flex-1 h-px bg-warm-200" />
            </div>

            <h2 className="text-warm-500 text-xs uppercase tracking-wide font-medium">Select Testament</h2>
            {(['old', 'new'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTestament(t); setStep('book'); setSearchQuery(''); }}
                className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-warm-100 hover:border-warm-300 transition-colors shadow-sm text-left"
              >
                <div>
                  <p className="font-serif text-navy font-medium">
                    {t === 'old' ? 'Old Testament' : 'New Testament'}
                  </p>
                  <p className="text-warm-400 text-sm">
                    {t === 'old' ? '46 books including deuterocanonicals' : '27 books'}
                  </p>
                </div>
                <ChevronRight size={18} className="text-warm-300" />
              </button>
            ))}
          </div>
        )}

        {!loading && (step === 'book' || searchQuery) && (
          <div className="p-5">
            <h2 className="text-warm-500 text-xs uppercase tracking-wide font-medium mb-3">
              {searchQuery ? 'Search Results' : (testament === 'old' ? 'Old Testament' : 'New Testament')}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setSelectedChapter(null);
                    setSearchQuery('');
                    setStep('chapter');
                    if (book.testament !== testament) setTestament(book.testament);
                  }}
                  className="flex items-center justify-between bg-white rounded-xl px-3 py-3 border border-warm-100 hover:border-warm-300 transition-colors shadow-sm text-left"
                >
                  <div>
                    <p className="font-serif text-navy text-sm font-medium leading-tight">{book.name}</p>
                    <p className="text-warm-400 text-xs">{book.chapters} ch.</p>
                  </div>
                  {book.isDeutorocanonical && (
                    <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-medium">DC</span>
                  )}
                </button>
              ))}
            </div>
            {filteredBooks.length === 0 && (
              <p className="text-warm-400 text-sm text-center py-8">No books found.</p>
            )}
          </div>
        )}

        {!loading && step === 'chapter' && selectedBook && (
          <div className="p-5">
            <h2 className="text-warm-500 text-xs uppercase tracking-wide font-medium mb-3">
              {selectedBook.name} — Select Chapter
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  onClick={() => { setSelectedChapter(ch); loadChapter(selectedBook, ch); }}
                  className="bg-white rounded-xl py-3 text-navy font-medium text-sm border border-warm-100 hover:bg-navy hover:text-white hover:border-navy transition-colors shadow-sm"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && step === 'verse' && selectedBook && selectedChapter && (
          <div className="p-5 flex flex-col gap-4">
            <h2 className="text-warm-500 text-xs uppercase tracking-wide font-medium">
              {selectedBook.name} {selectedChapter} — Select Verses
            </h2>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
              <h3 className="font-serif text-navy font-medium mb-4">Read entire chapter</h3>
              <Button className="w-full" onClick={() => { setVerseStart(undefined!); setVerseEnd(undefined!); loadPassage(); }}>
                Use Full Chapter
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
              <h3 className="font-serif text-navy font-medium mb-4">Or select a verse range</h3>
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                {Array.from({ length: totalVerses || 30 }, (_, i) => i + 1).map((v) => {
                  const isStart = verseStart === v;
                  const isEnd = verseEnd === v;
                  const inRange = verseStart && verseEnd && v >= verseStart && v <= verseEnd;
                  return (
                    <button
                      key={v}
                      onClick={() => {
                        if (!verseStart || (verseStart && verseEnd)) {
                          setVerseStart(v); setVerseEnd(null!);
                        } else {
                          if (v >= verseStart) setVerseEnd(v);
                          else { setVerseStart(v); setVerseEnd(null!); }
                        }
                      }}
                      className={`rounded-lg py-2 text-sm font-medium transition-colors border ${
                        isStart || isEnd ? 'bg-navy text-white border-navy' :
                        inRange ? 'bg-navy/20 text-navy border-navy/20' :
                        'bg-warm-50 text-navy border-warm-200 hover:bg-warm-100'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              {verseStart && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-warm-500">
                    {verseEnd ? `Verses ${verseStart}–${verseEnd}` : `Verse ${verseStart} selected`}
                  </p>
                  <Button size="sm" disabled={!verseStart} onClick={() => loadPassage(verseStart, verseEnd ?? verseStart)}>
                    Use Selection
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && step === 'confirm' && (
          <div className="h-full flex flex-col">
            {/* Collapsible passage area */}
            <div className="flex-1 min-h-0 flex flex-col p-5 pb-3 gap-3">
              <div className="bg-white rounded-2xl shadow-sm border border-warm-100 flex flex-col min-h-0 flex-shrink-0" style={showPassagePreview ? { flex: '1 1 0%' } : undefined}>
                <button
                  onClick={() => setShowPassagePreview((v) => !v)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-warm-50 transition-colors rounded-t-2xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gold font-medium uppercase tracking-widest">Selected Passage</p>
                    <p className="font-serif text-navy font-medium mt-1">{passageRef}</p>
                  </div>
                  {showPassagePreview ? (
                    <ChevronUp size={18} className="text-warm-400 flex-shrink-0 ml-3" />
                  ) : (
                    <ChevronDown size={18} className="text-warm-400 flex-shrink-0 ml-3" />
                  )}
                </button>

                {showPassagePreview && (
                  <div className="border-t border-warm-100 px-6 py-4 overflow-y-auto min-h-0">
                    <p className="font-serif text-navy leading-loose text-base whitespace-pre-wrap">{passageText}</p>
                  </div>
                )}
              </div>

              {!showPassagePreview && (
                <p className="text-warm-400 text-xs text-center italic">
                  Tap above to preview the passage, or begin your prayer below.
                </p>
              )}
            </div>

            {/* Fixed action buttons */}
            <div className="flex-shrink-0 px-5 pt-3 pb-6 bg-cream border-t border-warm-100 flex flex-col gap-3">
              <Button size="lg" className="w-full" onClick={startSession}>
                Begin Lectio Divina
              </Button>
              <Button variant="ghost" size="md" className="w-full" onClick={() => { setStep('testament'); setShowPassagePreview(false); }}>
                Choose Different Passage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
