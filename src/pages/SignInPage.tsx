import { useState } from 'react';
import Button from '../components/shared/Button';
import { useStore } from '../store/useStore';

export default function SignInPage() {
  const signIn = useStore((s) => s.signIn);
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) signIn(trimmed);
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="text-center">
          <div className="text-gold text-6xl mb-4">✝</div>
          <h1 className="font-serif text-white text-3xl font-medium tracking-wide">Lectio Divina</h1>
          <p className="text-white/50 text-sm mt-2 font-serif italic">
            "Speak, Lord, for your servant is listening."
          </p>
          <p className="text-white/30 text-xs mt-1">— 1 Samuel 3:9</p>
        </div>

        {/* Sign in form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="bg-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-white font-serif text-lg text-center">Begin your journey</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!name.trim()}
          >
            Enter
          </Button>
        </form>

        <p className="text-white/30 text-xs text-center max-w-xs leading-relaxed">
          Your reflections are stored privately on this device.
          No account required.
        </p>
      </div>
    </div>
  );
}
