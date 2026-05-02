import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft } from 'lucide-react';
import Button from '../components/shared/Button';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* Page header — small back row */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors text-navy"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-serif text-navy text-lg font-medium">About</h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-6 max-w-lg mx-auto w-full flex flex-col gap-5">
        {/* Hero card */}
        <div className="bg-navy text-white rounded-2xl p-6 text-center">
          <div className="text-gold text-5xl mb-3">✝</div>
          <h2 className="font-serif text-2xl font-medium mb-1">Lectio Divina</h2>
          <p className="text-white/60 text-sm italic">
            Sacred reading, meditation, and prayer.
          </p>
        </div>

        {/* What is Lectio Divina */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-navy">
            <BookOpen size={18} className="text-gold" />
            <h3 className="font-serif font-medium text-base">What is Lectio Divina?</h3>
          </div>
          <p className="text-warm-700 text-sm leading-relaxed font-serif">
            <span className="font-medium text-navy">Lectio Divina</span>, Latin for
            "divine reading," is an ancient Christian practice of meditative prayer
            with Sacred Scripture. It invites us to read slowly, listen with the
            heart, and let God speak to us through His Word.
          </p>
          <ul className="text-warm-700 text-sm font-serif leading-relaxed pl-4 list-disc marker:text-gold">
            <li><span className="font-medium text-navy">Lectio</span> — Reading</li>
            <li><span className="font-medium text-navy">Meditatio</span> — Meditation</li>
            <li><span className="font-medium text-navy">Oratio</span> — Prayer</li>
            <li><span className="font-medium text-navy">Contemplatio</span> — Contemplation</li>
            <li><span className="font-medium text-navy">Actio</span> — Action</li>
          </ul>
        </div>

        {/* Closing blessing */}
        <div className="text-center py-2">
          <p className="font-serif text-warm-500 italic text-sm">
            "May the peace of Christ guard your heart and mind."
          </p>
          <p className="font-serif text-warm-500 bold text-sm">
            Mary and Andres
          </p>
        </div>

        <Button
          size="md"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/')}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
