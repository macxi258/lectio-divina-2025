import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Step1OpeningPrayer from '../components/workflow/Step1OpeningPrayer';
import Step2BibleReading from '../components/workflow/Step2BibleReading';
import Step3Reflection from '../components/workflow/Step3Reflection';
import Step4Conversion from '../components/workflow/Step4Conversion';
import Step5Silence from '../components/workflow/Step5Silence';
import Step6Giving from '../components/workflow/Step6Giving';
import SessionSummary from '../components/workflow/SessionSummary';

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = useStore((s) => (id ? s.getSession(id) : undefined));
  const updateSession = useStore((s) => s.updateSession);
  const completeSession = useStore((s) => s.completeSession);

  if (!id || !session) {
    return (
      <div className="h-full bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-warm-500 font-serif">Session not found.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-navy underline text-sm">
            Return home
          </button>
        </div>
      </div>
    );
  }

  const currentStep = session.currentStep;

  function goToStep(step: number) {
    updateSession(id!, { currentStep: step });
  }

  if (session.isCompleted || currentStep === 7) {
    return <SessionSummary sessionId={id} />;
  }

  if (currentStep === 1) {
    return <Step1OpeningPrayer sessionId={id} onNext={() => goToStep(2)} />;
  }
  if (currentStep === 2) {
    return <Step2BibleReading sessionId={id} onNext={() => goToStep(3)} onBack={() => goToStep(1)} />;
  }
  if (currentStep === 3) {
    return <Step3Reflection sessionId={id} onNext={() => goToStep(4)} onBack={() => goToStep(2)} />;
  }
  if (currentStep === 4) {
    return <Step4Conversion sessionId={id} onNext={() => goToStep(5)} onBack={() => goToStep(3)} />;
  }
  if (currentStep === 5) {
    return <Step5Silence onNext={() => goToStep(6)} onBack={() => goToStep(4)} />;
  }
  if (currentStep === 6) {
    return (
      <Step6Giving
        sessionId={id}
        onNext={() => completeSession(id)}
        onBack={() => goToStep(5)}
      />
    );
  }

  return null;
}
