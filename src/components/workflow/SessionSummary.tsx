import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, CheckCircle } from 'lucide-react';
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

  if (!session) return null;

  const affirmation = CLOSING_AFFIRMATIONS[
    Math.abs(sessionId.charCodeAt(0) - 48) % CLOSING_AFFIRMATIONS.length
  ];

  const sections = [
    { title: 'What the Lord Said', text: session.step3Text, color: 'border-blue-200' },
    { title: 'Conversion of Mind, Life & Heart', text: session.step4Mind, color: 'border-blue-300' },
    { title: 'Giving to Others', text: session.step6Text, color: 'border-amber-300' },
  ].filter((s) => s.text.trim());

  return (
    <div className="h-full overflow-y-auto bg-cream">
      {/* Top affirmation banner */}
      <div className="bg-navy text-white px-6 py-10 text-center">
        <div className="text-gold text-4xl mb-4">✝</div>
        <h1 className="font-serif text-2xl font-medium mb-3">{affirmation}</h1>
        <p className="text-white/60 text-sm">
          {session.dateCompleted
            ? format(new Date(session.dateCompleted), 'EEEE, MMMM d, yyyy')
            : 'Session completed'}
        </p>
      </div>

      <div className="px-5 py-6 flex flex-col gap-5 max-w-lg mx-auto">
        {/* Scripture reference */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-warm-100">
          <BookOpen size={20} className="text-gold flex-shrink-0" />
          <div>
            <p className="text-xs text-warm-400 uppercase tracking-wide mb-0.5">Scripture</p>
            <p className="font-serif text-navy font-medium">{session.scriptureRef}</p>
          </div>
        </div>

        {/* Reflections summary */}
        {sections.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-serif text-navy font-medium text-lg">Your Reflections</h2>
            {sections.map(({ title, text, color }) => (
              <div key={title} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} min-w-0`}>
                <p className="text-xs text-warm-400 uppercase tracking-wide mb-2">{title}</p>
                <p className="font-serif text-warm-700 text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Intentions */}
        {session.intentions.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-gold" />
              <h3 className="font-serif text-navy font-medium">Intentions</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {session.intentions.map((i) => (
                <li key={i.id} className="flex items-start gap-2 text-sm font-serif text-warm-700">
                  <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  {i.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
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
    </div>
  );
}
