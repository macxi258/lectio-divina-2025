import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StepHeader from '../shared/StepHeader';
import Button from '../shared/Button';
import ReadAloud from '../shared/ReadAloud';
import { OPENING_PRAYERS } from '../../data/prayers';
import { useStore } from '../../store/useStore';

interface Props {
  sessionId: string;
  onNext: () => void;
}

export default function Step1OpeningPrayer({ sessionId, onNext }: Props) {
  const session = useStore((s) => s.getSession(sessionId));
  const updateSession = useStore((s) => s.updateSession);

  const currentPrayerId = session?.openingPrayerId ?? OPENING_PRAYERS[0].id;
  const [showSelector, setShowSelector] = useState(false);

  const selectedPrayer = OPENING_PRAYERS.find((p) => p.id === currentPrayerId) ?? OPENING_PRAYERS[0];

  function selectPrayer(id: string) {
    updateSession(sessionId, { openingPrayerId: id });
    setShowSelector(false);
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      <div className="flex-shrink-0">
        <StepHeader
          step={1}
          total={6}
          title=""
          subtitle="Quiet your heart and invite the Holy Spirit"
        />
      </div>

      {/* Fixed prayer selector + read-aloud */}
      <div className="flex-shrink-0 px-5 pt-6 pb-3 bg-cream">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowSelector((v) => !v)}
            className="flex items-center gap-2 text-sm text-warm-500 hover:text-navy transition-colors"
          >
            <span>Prayer: {selectedPrayer.title}</span>
            {showSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <ReadAloud text={selectedPrayer.text} />
        </div>

        {showSelector && (
          <div className="mt-2 bg-white rounded-xl border border-warm-200 overflow-hidden shadow-sm">
            {OPENING_PRAYERS.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPrayer(p.id)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-warm-50 transition-colors border-b border-warm-100 last:border-0 ${
                  p.id === currentPrayerId ? 'text-navy font-medium' : 'text-warm-600'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable prayer text card */}
      <div className="flex-1 min-h-0 px-5 pb-3">
        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 h-full overflow-y-auto p-6">
          <div className="font-serif text-warm-700 leading-loose text-base whitespace-pre-line">
            {selectedPrayer.text}
          </div>
        </div>
      </div>

      {/* Fixed gentle instruction */}
      <div className="flex-shrink-0 px-5 pb-3">
        <p className="text-center text-warm-400 text-sm italic">
          Read slowly. Let the words settle in your heart.
        </p>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-cream border-t border-warm-100 pb-safe">
        <Button className="w-full" size="lg" onClick={onNext}>
          Continue to Reading
        </Button>
      </div>
    </div>
  );
}
