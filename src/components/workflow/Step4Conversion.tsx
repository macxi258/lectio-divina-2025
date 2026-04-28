import { useRef } from 'react';
import StepHeader from '../shared/StepHeader';
import Button from '../shared/Button';
import { useStore } from '../../store/useStore';
import { useKeyboardVisible } from '../../utils/useKeyboardVisible';

interface Props {
  sessionId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Conversion({ sessionId, onNext, onBack }: Props) {
  const session = useStore((s) => s.getSession(sessionId));
  const updateSession = useStore((s) => s.updateSession);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const keyboardVisible = useKeyboardVisible();

  if (!session) return null;

  function handleFocus() {
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  const subFields = [
    { label: 'Mind', description: 'How is the Lord asking me to think differently?', color: 'border-blue-300' },
    { label: 'Life', description: 'What change in my habits or actions is being asked?', color: 'border-green-300' },
    { label: 'Heart', description: 'What shift in my desires, fears, or loves is invited?', color: 'border-rose-300' },
  ];

  return (
    <div className="flex flex-col h-full bg-cream">
      <div className="flex-shrink-0">
        <StepHeader
          step={4}
          total={6}
          title=""
          subtitle="Oratio — Pray"
          onBack={onBack}
        />
      </div>

      {/* Fixed prompt + Mind/Life/Heart cards. Hidden while the keyboard
          is open so the textarea fills the visible area. */}
      {!keyboardVisible && (
        <>
          <div className="flex-shrink-0 px-5 pt-6 pb-3 bg-cream">
            <div className="bg-navy/5 rounded-2xl px-5 py-4 border-l-4 border-gold">
              <p className="font-serif text-navy text-base leading-relaxed italic">
                "What conversion of mind, life, and heart is the Lord asking of you today?"
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 px-5 pb-3 flex flex-col gap-2">
            {subFields.map(({ label, description, color }) => (
              <div key={label} className={`bg-white rounded-xl border-l-4 ${color} px-4 py-2 shadow-sm`}>
                <h3 className="font-serif text-navy font-medium text-sm">{label}</h3>
                <p className="text-warm-500 text-xs italic leading-snug">{description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Single reflection box for all three */}
      <div className={`flex-1 min-h-0 px-5 pb-2 flex flex-col ${keyboardVisible ? 'pt-3' : ''}`}>
        <textarea
          ref={textareaRef}
          value={session.step4Mind}
          onChange={(e) => updateSession(sessionId, { step4Mind: e.target.value })}
          onFocus={handleFocus}
          placeholder="Write your reflection on Mind, Life, and Heart…"
          className="flex-1 min-h-0 w-full resize-none bg-white border border-warm-200 rounded-xl px-4 py-3 text-navy text-base placeholder-warm-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors font-serif leading-relaxed overflow-y-auto shadow-sm"
        />
        <p className="text-xs text-warm-400 text-right mt-1">Auto-saved</p>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-cream border-t border-warm-100 pb-safe">
        <Button className="w-full" size="lg" onClick={onNext}>
          Continue to Silence
        </Button>
      </div>
    </div>
  );
}
