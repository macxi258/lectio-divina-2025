import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StepHeader from '../shared/StepHeader';
import Button from '../shared/Button';
import { useStore } from '../../store/useStore';

interface Props {
  sessionId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Reflection({ sessionId, onNext, onBack }: Props) {
  const session = useStore((s) => s.getSession(sessionId));
  const updateSession = useStore((s) => s.updateSession);
  const [showPassage, setShowPassage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!session) return null;

  // When the textarea gains focus on mobile, the keyboard appears and may
  // cover it. Scroll it into view after a short delay so the focused element
  // stays visible above the keyboard.
  function handleFocus() {
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }


  return (
    <div className="flex flex-col h-full bg-cream">
      <div className="flex-shrink-0">
        <StepHeader
          step={3}
          total={6}
          title=""
          subtitle="Meditatio — Meditate"
          onBack={onBack}
        />
      </div>

      {/* Fixed prompt + collapsible passage */}
      <div className="flex-shrink-0 px-5 pt-6 pb-3 flex flex-col gap-3 bg-cream">
        <div className="bg-navy/5 rounded-2xl px-5 py-3 border-l-4 border-gold">
          <p className="font-serif text-navy text-sm leading-relaxed italic">
            "What word, image, or phrase has the Lord spoken to you in this passage?"
          </p>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
          <button
            onClick={() => setShowPassage((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-warm-500 hover:text-navy transition-colors"
          >
            <span>{session.scriptureRef}</span>
            {showPassage ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showPassage && (
            <div className="px-4 pb-3 border-t border-warm-100 max-h-40 overflow-y-auto">
              <p className="font-serif text-warm-700 text-sm leading-loose pt-3 whitespace-pre-wrap">
                {session.scriptureText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable reflection textarea fills remaining space */}
      <div className="flex-1 min-h-0 px-5 pb-2 flex flex-col">
        <textarea
          ref={textareaRef}
          value={session.step3Text}
          onChange={(e) => updateSession(sessionId, { step3Text: e.target.value })}
          onFocus={handleFocus}
          placeholder="Write what the Lord has spoken to you…"
          className="flex-1 min-h-0 w-full resize-none bg-white border border-warm-200 rounded-xl px-4 py-3 text-navy text-base placeholder-warm-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors font-serif leading-relaxed overflow-y-auto shadow-sm"
        />
        <p className="text-xs text-warm-400 text-right mt-1">Auto-saved</p>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-cream border-t border-warm-100 pb-safe">
        <Button className="w-full" size="lg" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
