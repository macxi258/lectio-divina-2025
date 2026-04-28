import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../shared/Button';
import { useStore } from '../../store/useStore';
import { CLOSING_AFFIRMATIONS } from '../../data/prayers';
import { format } from 'date-fns';

interface Props {
  sessionId: string;
}

export default function SessionSummary({ sessionId }: Props) {
  const navigate = useNavigate();
  const session = useStore((s) => s.getSession(sessionId));
  // Track which reflection sections are expanded by their title.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!session) return null;

  const affirmation = CLOSING_AFFIRMATIONS[
    Math.abs(sessionId.charCodeAt(0) - 48) % CLOSING_AFFIRMATIONS.length
  ];

  const sections = [
    { title: 'What the Lord Said', text: session.step3Text, color: 'border-blue-200' },
    { title: 'Conversion of Mind, Life & Heart', text: session.step4Mind, color: 'border-blue-300' },
    { title: 'Giving to Others', text: session.step6Text, color: 'border-amber-300' },
  ].filter((s) => s.text.trim());

  function toggle(title: string) {
    setExpanded((e) => ({ ...e, [title]: !e[title] }));
  }

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Fixed top affirmation banner */}
      <div className="flex-shrink-0 bg-navy text-white px-6 py-6 text-center">
        <div className="text-gold text-3xl mb-2">✝</div>
        <h1 className="font-serif text-xl font-medium mb-1">{affirmation}</h1>
        <p className="text-white/60 text-xs">
          {session.dateCompleted
            ? format(new Date(session.dateCompleted), 'EEEE, MMMM d, yyyy')
            : 'Session completed'}
        </p>
      </div>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-5 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Scripture reference */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-warm-100 flex-shrink-0">
          <BookOpen size={20} className="text-gold flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-warm-400 uppercase tracking-wide mb-0.5">Scripture</p>
            <p className="font-serif text-navy font-medium break-words">{session.scriptureRef}</p>
          </div>
        </div>

        {/* Collapsible reflections */}
        {sections.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-serif text-navy font-medium text-lg">Your Reflections</h2>
            {sections.map(({ title, text, color }) => {
              const isOpen = expanded[title] ?? false;
              return (
                <div
                  key={title}
                  className={`bg-white rounded-2xl shadow-sm border-l-4 ${color} min-w-0 flex-shrink-0 overflow-hidden`}
                >
                  <button
                    onClick={() => toggle(title)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-warm-50 transition-colors"
                  >
                    <p className="text-xs text-navy uppercase tracking-wide font-semibold">{title}</p>
                    {isOpen
                      ? <ChevronUp size={18} className="text-navy" />
                      : <ChevronDown size={18} className="text-navy" />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-warm-100 px-5 py-3 max-h-64 overflow-y-auto">
                      <p className="font-serif text-warm-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Intentions */}
        {session.intentions.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-gold" />
              <h3 className="font-serif text-navy font-medium">Intentions</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {session.intentions.map((i) => (
                <li key={i.id} className="flex items-start gap-2 text-sm font-serif text-warm-700">
                  <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{i.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Fixed bottom action buttons */}
      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-cream border-t border-warm-100 flex flex-col gap-2 max-w-lg mx-auto w-full pb-safe">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => navigate(`/journal/${sessionId}`)}
        >
          View in Journal
        </Button>
        <Button size="lg" className="w-full" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
