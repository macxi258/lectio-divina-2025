import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StepHeader from '../shared/StepHeader';
import Button from '../shared/Button';
import { useStore } from '../../store/useStore';

interface Props {
  sessionId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Conversion({ sessionId, onNext, onBack }: Props) {
  const session = useStore((s) => s.getSession(sessionId));
  const updateSession = useStore((s) => s.updateSession);
  const [showPrompts, setShowPrompts] = useState(false);

  if (!session) return null;

  const subFields = [
    { label: 'Mind', description: 'How is the Lord asking me to think differently?', color: 'border-blue-300' },
    { label: 'Life', description: 'What change in my habits or actions is being asked?', color: 'border-green-300' },
    { label: 'Heart', description: 'What shift in my desires, fears, or loves is invited?', color: 'border-rose-300' },
  ];

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Pinned StepHeader */}
      <div className="flex-shrink-0">
        <StepHeader
          step={4}
          total={6}
          title=""
          subtitle="Oratio — Pray"
          onBack={onBack}
        />
      </div>

      {/* Pinned collapsible prompt — header always visible, body shows
          Mind / Life / Heart questions when expanded */}
      <div className="flex-shrink-0 px-5 pt-4 pb-2">
        <div className="bg-navy/5 rounded-2xl border-l-4 border-gold overflow-hidden">
          <button
            onClick={() => setShowPrompts((v) => !v)}
            className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left hover:bg-navy/10 transition-colors"
          >
            <p className="font-serif text-navy text-sm leading-snug italic flex-1">
              "What conversion of mind, life, and heart is the Lord asking of you today?"
            </p>
            {showPrompts
              ? <ChevronUp size={18} className="text-navy flex-shrink-0 mt-0.5" />
              : <ChevronDown size={18} className="text-navy flex-shrink-0 mt-0.5" />}
          </button>
          {showPrompts && (
            <div className="border-t border-navy/10 px-3 py-2 flex flex-col gap-1.5 bg-cream/50">
              {subFields.map(({ label, description, color }) => (
                <div key={label} className={`bg-white rounded-lg border-l-4 ${color} px-3 py-1.5 shadow-sm`}>
                  <h3 className="font-serif text-navy font-medium text-sm">{label}</h3>
                  <p className="text-warm-500 text-xs italic leading-snug">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reflection textarea — fills the space saved by collapsing the prompts */}
      <div className="flex-1 min-h-0 px-5 pb-2 flex flex-col">
        <textarea
          value={session.step4Mind}
          onChange={(e) => updateSession(sessionId, { step4Mind: e.target.value })}
          placeholder="Write your reflection on Mind, Life, and Heart…"
          className="flex-1 min-h-0 w-full resize-none bg-white border border-warm-200 rounded-xl px-4 py-3 text-navy text-base placeholder-warm-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors font-serif leading-relaxed overflow-y-auto shadow-sm"
        />
        <p className="text-xs text-warm-400 text-right mt-1">Auto-saved</p>
      </div>

      {/* Pinned Continue button */}
      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-cream border-t border-warm-100 pb-safe">
        <Button className="w-full" size="lg" onClick={onNext}>
          Continue to Silence
        </Button>
      </div>
    </div>
  );
}
