import StepHeader from '../shared/StepHeader';
import Button from '../shared/Button';
import { useStore } from '../../store/useStore';

interface Props {
  sessionId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step6Giving({ sessionId, onNext, onBack }: Props) {
  const session = useStore((s) => s.getSession(sessionId));
  const updateSession = useStore((s) => s.updateSession);

  if (!session) return null;

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Pinned StepHeader */}
      <div className="flex-shrink-0">
        <StepHeader
          step={6}
          total={6}
          title=""
          subtitle="Actio — Live the Word"
          onBack={onBack}
        />
      </div>

      {/* Pinned prompt — always visible, even with keyboard open */}
      <div className="flex-shrink-0 px-5 pt-4 pb-2 bg-cream">
        <div className="bg-navy/5 rounded-2xl px-4 py-2 border-l-4 border-gold">
          <p className="font-serif text-navy text-sm leading-snug italic">
            "How will you give to others today in light of this Word?"
          </p>
        </div>
      </div>

      {/* Pinned concrete-intentions hint */}
      <div className="flex-shrink-0 px-5 pb-2">
        <div className="bg-white rounded-xl border border-warm-100 px-3 py-1.5 shadow-sm">
          <h3 className="font-serif text-navy font-medium text-sm">Concrete Intentions</h3>
          <p className="text-warm-500 text-xs italic leading-snug">
            Name one or more specific actions you will take today.
          </p>
        </div>
      </div>

      {/* Reflection textarea — shrinks to fit when keyboard opens */}
      <div className="flex-1 min-h-0 px-5 pb-2 flex flex-col">
        <textarea
          value={session.step6Text}
          onChange={(e) => updateSession(sessionId, { step6Text: e.target.value })}
          placeholder="Write the concrete actions you will take today…"
          className="flex-1 min-h-0 w-full resize-none bg-white border border-warm-200 rounded-xl px-4 py-3 text-navy text-base placeholder-warm-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors font-serif leading-relaxed overflow-y-auto shadow-sm whitespace-pre-wrap break-words"
        />
        <p className="text-xs text-warm-400 text-right mt-1">Auto-saved</p>
      </div>

      {/* Pinned Complete button */}
      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-cream border-t border-warm-100 pb-safe">
        <Button className="w-full" size="lg" onClick={onNext}>
          Complete Session
        </Button>
      </div>
    </div>
  );
}
