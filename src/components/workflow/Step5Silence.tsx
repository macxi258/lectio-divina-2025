import { useState, useEffect, useRef } from 'react';
import { Plus, RotateCcw, Play } from 'lucide-react';
import StepHeader from '../shared/StepHeader';
import Button from '../shared/Button';
import { playSoftChime } from '../../utils/audio';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Silence({ onNext, onBack }: Props) {
  const [durationMin, setDurationMin] = useState(1);
  const [originalMin, setOriginalMin] = useState(1); // The preset the user chose; survives addTime
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-start on mount
  useEffect(() => {
    startTimer(1, true);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Internal helper that schedules a fresh countdown.
  function startTimer(minutes: number, setOriginal = true) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const total = minutes * 60;
    setDurationMin(minutes);
    if (setOriginal) setOriginalMin(minutes);
    setSecondsLeft(total);
    setRunning(true);
    setFinished(false);

    let remaining = total;
    const id = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        if (intervalRef.current === id) intervalRef.current = null;
        setRunning(false);
        setFinished(true);
        playSoftChime();
      }
    }, 1000);
    intervalRef.current = id;
  }

  function resetTimer() {
    // Stop any running countdown and snap back to the original duration, paused.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDurationMin(originalMin);
    setSecondsLeft(originalMin * 60);
    setRunning(false);
    setFinished(false);
  }

  function startCountdown() {
    // If already running, do nothing.
    if (running) return;

    // If finished or at zero, restart from full original duration.
    let target = secondsLeft;
    if (finished || target <= 0) {
      target = originalMin * 60;
      setDurationMin(originalMin);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSecondsLeft(target);
    setRunning(true);
    setFinished(false);

    let remaining = target;
    const id = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        if (intervalRef.current === id) intervalRef.current = null;
        setRunning(false);
        setFinished(true);
        playSoftChime();
      }
    }, 1000);
    intervalRef.current = id;
  }

  function addTime(minutes: number) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const newDuration = durationMin + minutes;
    const newSeconds = (running ? secondsLeft : durationMin * 60) + minutes * 60;
    setDurationMin(newDuration);
    setFinished(false);
    setSecondsLeft(newSeconds);
    setRunning(true);

    let remaining = newSeconds;
    const id = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        if (intervalRef.current === id) intervalRef.current = null;
        setRunning(false);
        setFinished(true);
        playSoftChime();
      }
    }, 1000);
    intervalRef.current = id;
  }

  const total = durationMin * 60;
  const progress = 1 - secondsLeft / total;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * (1 - progress);

  return (
    <div className="flex flex-col h-full bg-navy">
      <div className="flex-shrink-0">
        <StepHeader
          step={5}
          total={6}
          title=""
          subtitle="Contemplatio — Rest in God's presence"
          onBack={onBack}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-5 py-3 gap-4 overflow-hidden">
        {/* Breathing circle / timer */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing ambient ring */}
          <div
            className={`absolute rounded-full bg-gold/10 ${running ? 'animate-ping' : ''}`}
            style={{ width: 180, height: 180 }}
          />
          <svg width="160" height="160" className="-rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#C4A052"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-white text-3xl font-light font-serif">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
            {finished && (
              <span className="text-gold text-xs mt-0.5 animate-fade-in">✦</span>
            )}
          </div>
        </div>

        {/* Cross */}
        <div className="text-white/30 text-3xl font-serif select-none leading-none">✝</div>

        {finished ? (
          <p className="text-white/70 text-center font-serif italic text-sm">
            Rest a moment longer if you wish.
          </p>
        ) : (
          <p className="text-white/50 text-center font-serif italic text-xs">
            Be still and know that I am God. — Psalm 46:10
          </p>
        )}

        {/* Add time controls */}
        {!finished && (
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs mr-1">
              <Plus size={12} className="inline" /> minutes:
            </span>
            {[1, 5, 10].map((m) => (
              <button
                key={m}
                onClick={() => addTime(m)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
              >
                +{m}
              </button>
            ))}
          </div>
        )}

        {/* Start + Reset controls */}
        <div className="flex gap-3">
          <button
            onClick={startCountdown}
            disabled={running}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gold/20 text-gold border border-gold/30 text-sm hover:bg-gold/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Start timer"
          >
            <Play size={14} />
            Start
          </button>
          <button
            onClick={resetTimer}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-white/10 text-white/70 border border-white/20 text-sm hover:bg-white/20 transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-navy border-t border-white/10 pb-safe">
        <Button
          className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30"
          size="lg"
          onClick={onNext}
        >
          {finished ? 'Continue' : 'Skip to Next Step'}
        </Button>
      </div>
    </div>
  );
}
