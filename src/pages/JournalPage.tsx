import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Star, StarOff, Tag, Trash2, ChevronLeft, Search, CheckCircle, Circle,
  BookMarked, Heart
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import Button from '../components/shared/Button';

// ─── Journal List ────────────────────────────────────────────────────────────
export function JournalListPage() {
  const navigate = useNavigate();
  const sessions = useStore((s) => s.sessions);
  const [search, setSearch] = useState('');
  const [filterFav, setFilterFav] = useState(false);
  const [filterTag, setFilterTag] = useState('');

  const completedSessions = sessions.filter((s) => s.isCompleted);

  const allTags = Array.from(
    new Set(completedSessions.flatMap((s) => s.tags))
  ).sort();

  const filtered = completedSessions.filter((s) => {
    if (filterFav && !s.isFavourite) return false;
    if (filterTag && !s.tags.includes(filterTag)) return false;
    if (search) {
      const q = search.toLowerCase();
      const matches =
        s.scriptureRef.toLowerCase().includes(q) ||
        s.step3Text.toLowerCase().includes(q) ||
        s.step4Mind.toLowerCase().includes(q) ||
        s.step4Life.toLowerCase().includes(q) ||
        s.step4Heart.toLowerCase().includes(q) ||
        s.step6Text.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-cream">
      <div className="bg-navy text-white px-5 pt-4 pb-5 flex-shrink-0">
        <h1 className="font-serif text-xl font-medium mb-3">Journal</h1>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reflections, references…"
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterFav((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterFav ? 'bg-gold text-navy' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Star size={12} />
            Favourites
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag((t) => (t === tag ? '' : tag))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterTag === tag ? 'bg-gold text-navy' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Tag size={10} />
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-5 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookMarked size={40} className="text-warm-200 mx-auto mb-3" />
            <p className="font-serif text-warm-400 italic">
              {completedSessions.length === 0
                ? 'Your completed sessions will appear here.'
                : 'No entries match your filter.'}
            </p>
          </div>
        )}

        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/journal/${s.id}`)}
            className="w-full bg-white rounded-2xl px-5 py-4 border border-warm-100 hover:border-warm-300 transition-colors shadow-sm text-left"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-serif text-navy font-medium">{s.scriptureRef}</p>
              {s.isFavourite && <Star size={14} className="text-gold fill-gold flex-shrink-0 mt-0.5" />}
            </div>
            <p className="text-warm-400 text-xs mb-2">
              {s.dateCompleted ? format(new Date(s.dateCompleted), 'MMMM d, yyyy') : ''}
            </p>
            {s.step3Text && (
              <p className="text-warm-600 text-sm font-serif italic leading-relaxed line-clamp-2 break-words">
                "{s.step3Text}"
              </p>
            )}
            {s.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-2">
                {s.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-warm-100 text-warm-500 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Journal Entry Detail ─────────────────────────────────────────────────────
export function JournalEntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = useStore((s) => (id ? s.getSession(id) : undefined));
  const toggleFavourite = useStore((s) => s.toggleFavourite);
  const addTag = useStore((s) => s.addTag);
  const removeTag = useStore((s) => s.removeTag);
  const deleteSession = useStore((s) => s.deleteSession);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!session || !id) {
    return (
      <div className="h-full flex items-center justify-center bg-cream">
        <p className="text-warm-500 font-serif">Entry not found.</p>
      </div>
    );
  }

  function handleAddTag() {
    const t = newTag.trim().toLowerCase();
    if (t) { addTag(id!, t); setNewTag(''); setShowTagInput(false); }
  }

  function handleDelete() {
    if (confirmDelete) { deleteSession(id!); navigate('/journal'); }
    else setConfirmDelete(true);
  }

  const sections = [
    { title: 'What the Lord Said to Me', text: session.step3Text, color: 'border-blue-200' },
    { title: 'Conversion of Mind, Life & Heart', text: session.step4Mind, color: 'border-blue-300' },
    { title: 'Giving to Others', text: session.step6Text, color: 'border-amber-300' },
  ].filter((s) => s.text.trim());

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="bg-navy text-white px-5 pt-4 pb-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/journal')}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => toggleFavourite(id)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={session.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            {session.isFavourite ? (
              <Star size={20} className="text-gold fill-gold" />
            ) : (
              <StarOff size={20} className="text-white/50" />
            )}
          </button>
        </div>
        <p className="text-gold/80 text-xs uppercase tracking-widest mb-1 font-medium">Scripture</p>
        <h1 className="font-serif text-2xl font-medium">{session.scriptureRef}</h1>
        <p className="text-white/50 text-sm mt-1">
          {session.dateCompleted ? format(new Date(session.dateCompleted), 'EEEE, MMMM d, yyyy') : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-5 flex flex-col gap-5 max-w-lg mx-auto w-full">
        {/* Scripture text */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
          <p className="text-xs text-warm-400 uppercase tracking-wide mb-3">Passage</p>
          <p className="font-serif text-warm-700 text-sm leading-loose whitespace-pre-wrap break-words">{session.scriptureText}</p>
        </div>

        {/* Reflections */}
        {sections.map(({ title, text, color }) => (
          <div key={title} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} min-w-0`}>
            <p className="text-xs text-warm-400 uppercase tracking-wide mb-2">{title}</p>
            <p className="font-serif text-warm-700 text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
          </div>
        ))}

        {/* Intentions */}
        {session.intentions.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-gold" />
              <p className="text-xs text-warm-400 uppercase tracking-wide">Intentions</p>
            </div>
            <ul className="flex flex-col gap-2">
              {session.intentions.map((i) => (
                <li key={i.id} className="flex items-start gap-2 text-sm font-serif text-warm-700">
                  {i.completed ? (
                    <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle size={16} className="text-warm-300 mt-0.5 flex-shrink-0" />
                  )}
                  {i.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-warm-400" />
              <p className="text-xs text-warm-400 uppercase tracking-wide">Tags</p>
            </div>
            <button
              onClick={() => setShowTagInput((v) => !v)}
              className="text-xs text-navy hover:text-gold transition-colors"
            >
              + Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {session.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-warm-100 text-warm-600 text-xs px-2.5 py-1 rounded-full">
                {tag}
                <button onClick={() => removeTag(id, tag)} className="hover:text-red-400 transition-colors ml-0.5">×</button>
              </span>
            ))}
            {session.tags.length === 0 && !showTagInput && (
              <p className="text-warm-300 text-sm italic">No tags yet</p>
            )}
          </div>
          {showTagInput && (
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="e.g., Advent, retreat…"
                className="flex-1 bg-warm-50 border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-navy placeholder-warm-300 focus:outline-none focus:ring-1 focus:ring-gold/40"
                autoFocus
              />
              <Button size="sm" onClick={handleAddTag}>Add</Button>
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors py-2"
        >
          <Trash2 size={16} />
          {confirmDelete ? 'Tap again to confirm deletion' : 'Delete this entry'}
        </button>
      </div>
    </div>
  );
}
