import { useNavigate } from 'react-router-dom';
import { BookOpen, BookMarked, ArrowRight, Star } from 'lucide-react';
import Button from '../components/shared/Button';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);
  const activeSessionId = useStore((s) => s.activeSessionId);

  const recentSessions = sessions.filter((s) => s.isCompleted).slice(0, 3);
  const inProgressSession = activeSessionId
    ? sessions.find((s) => s.id === activeSessionId)
    : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="h-full flex flex-col max-w-lg mx-auto w-full">
      {/* Fixed top section */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4 flex flex-col gap-5 bg-cream">
        {/* Greeting */}
        <div>
          <p className="text-warm-500 text-sm">{greeting()},</p>
          <h1 className="font-serif text-navy text-2xl font-medium">{user?.displayName}</h1>
        </div>

        {/* Resume in-progress session */}
        {inProgressSession && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-700 text-xs font-medium uppercase tracking-wide mb-1">In progress</p>
            <p className="font-serif text-amber-900 font-medium mb-3">{inProgressSession.scriptureRef}</p>
            <Button
              size="sm"
              onClick={() => navigate(`/session/${inProgressSession.id}`)}
              className="bg-amber-700 text-white hover:bg-amber-800"
            >
              Resume Session <ArrowRight size={14} />
            </Button>
          </div>
        )}

        {/* Start new session */}
        <div className="bg-navy rounded-2xl p-6 text-white">
          <div className="text-gold text-2xl mb-3">✝</div>
          <h2 className="font-serif text-xl font-medium mb-1">Begin Lectio Divina</h2>
          <p className="text-white/60 text-sm mb-5">
            Choose a passage and enter into sacred reading, meditation, and prayer.
          </p>
          <Button
            className="bg-gold text-white hover:bg-gold/90 font-medium"
            size="md"
            onClick={() => navigate('/bible')}
          >
            <BookOpen size={16} color="white" /> Choose a Passage
          </Button>
        </div>
      </div>

      {/* Scrollable bottom section */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-6 pt-2 flex flex-col gap-6">
        {/* Streak / stats */}
        {sessions.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: sessions.filter((s) => s.isCompleted).length },
            { label: 'Favourites', value: sessions.filter((s) => s.isFavourite).length },
            { label: 'This week', value: sessions.filter((s) => {
              if (!s.dateCompleted) return false;
              const d = new Date(s.dateCompleted);
              const now = new Date();
              return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
            }).length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-warm-100">
              <p className="text-2xl font-serif text-navy font-medium">{value}</p>
              <p className="text-xs text-warm-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-navy font-medium">Recent Sessions</h2>
            <button
              onClick={() => navigate('/journal')}
              className="text-sm text-warm-400 hover:text-navy transition-colors flex items-center gap-1"
            >
              All <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/journal/${s.id}`)}
                className="w-full bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-warm-100 hover:border-warm-300 transition-colors text-left shadow-sm"
              >
                <BookMarked size={16} className="text-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-navy text-sm font-medium truncate">{s.scriptureRef}</p>
                  <p className="text-xs text-warm-400 mt-0.5">
                    {s.dateCompleted ? format(new Date(s.dateCompleted), 'MMM d, yyyy') : ''}
                  </p>
                </div>
                {s.isFavourite && <Star size={14} className="text-gold fill-gold flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
          <div className="text-center py-8">
            <p className="font-serif text-warm-400 italic">
              Your journey with Scripture begins with the first step.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
