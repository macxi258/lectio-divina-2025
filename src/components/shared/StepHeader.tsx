import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const STEP_LABELS = ['Opening Prayer', 'Reading', 'Reflection', 'Conversion', 'Silence', 'Giving'];

export default function StepHeader({ step, total, title, subtitle, onBack }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-navy text-white px-5 pt-safe pb-4">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={onBack ?? (() => navigate(-1))}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex gap-1 flex-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i + 1 < step ? 'bg-gold' : i + 1 === step ? 'bg-gold/70' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-white/60 font-medium whitespace-nowrap">
          {step} / {total}
        </span>
      </div>
      <p className="text-xs text-gold/80 uppercase tracking-widest mb-0.5 font-medium">
        {STEP_LABELS[step - 1]}
      </p>
      <h1 className="text-xl font-serif font-medium leading-snug">{title}</h1>
      {subtitle && <p className="text-sm text-white/60 mt-1">{subtitle}</p>}
    </div>
  );
}
