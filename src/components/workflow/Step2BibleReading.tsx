import { useState } from 'react';
import { Type, Minus, Plus } from 'lucide-react';
import StepHeader from '../shared/StepHeader';
import Button from '../shared/Button';
import ReadAloud from '../shared/ReadAloud';
import { useStore } from '../../store/useStore';

interface Props {
  sessionId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2BibleReading({ sessionId, onNext, onBack }: Props) {
  const session = useStore((s) => s.getSession(sessionId));
  const [fontSize, setFontSize] = useState(18);

  if (!session) return null;

  const verses = session.scriptureText
    ? session.scriptureText.split(/(?=\[\d+\])/).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col h-full bg-cream">
      <div className="flex-shrink-0">
        <StepHeader
          step={2}
          total={6}
          title=""
          subtitle={session.scriptureRef}
          onBack={onBack}
        />
      </div>

      {/* Fixed font size controls + read-aloud */}
      <div className="flex-shrink-0 px-5 pt-6 pb-3 flex items-center justify-between gap-2 bg-cream">
        <ReadAloud text={`${session.scriptureRef}. ${session.scriptureText}`} />
        <div className="flex items-center gap-2">
          <Type size={14} className="text-warm-400" />
          <button
            onClick={() => setFontSize((s) => Math.max(14, s - 2))}
            className="p-1.5 rounded-lg bg-white border border-warm-200 text-warm-500 hover:text-navy transition-colors"
            aria-label="Decrease font size"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => setFontSize((s) => Math.min(26, s + 2))}
            className="p-1.5 rounded-lg bg-white border border-warm-200 text-warm-500 hover:text-navy transition-colors"
            aria-label="Increase font size"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable scripture passage card */}
      <div className="flex-1 min-h-0 px-5 pb-3">
        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 h-full overflow-y-auto p-6">
          <p className="text-xs text-gold font-medium uppercase tracking-widest mb-4">
            {session.scriptureRef}
          </p>

          {verses.length > 0 ? (
            <div
              className="font-serif text-navy leading-loose"
              style={{ fontSize: `${fontSize}px` }}
            >
              {verses.map((v, i) => {
                const match = v.match(/^\[(\d+)\]\s*(.*)/s);
                if (match) {
                  return (
                    <span key={i} className="block mb-3">
                      <sup className="text-xs text-warm-400 mr-1 font-sans select-none">{match[1]}</sup>
                      {match[2]}
                    </span>
                  );
                }
                return <span key={i}>{v}</span>;
              })}
            </div>
          ) : (
            <p className="font-serif text-navy leading-loose" style={{ fontSize: `${fontSize}px` }}>
              {session.scriptureText || 'Scripture passage will appear here.'}
            </p>
          )}
        </div>
      </div>

      {/* Fixed lectio hint */}
      <div className="flex-shrink-0 px-5 pb-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-amber-700 text-sm leading-relaxed">
            <span className="font-medium">Lectio — Read slowly.</span> Let the words wash over you.
            If a word or phrase catches your attention, pause and stay with it.
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-cream border-t border-warm-100">
        <Button className="w-full" size="lg" onClick={onNext}>
          Continue to Reflection
        </Button>
      </div>
    </div>
  );
}
