import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BookMarked, Home, User } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const location = useLocation();
  const user = useStore((s) => s.user);

  const nav = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/bible', icon: BookOpen, label: 'Bible' },
    { to: '/journal', icon: BookMarked, label: 'Journal' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const isSession = location.pathname.startsWith('/session');

  return (
    <div className="h-dvh bg-cream flex flex-col">
      {!isSession && (
        <header className="bg-navy text-gold px-6 pt-safe py-4 flex items-center justify-between flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gold text-xl">✝</span>
            <span className="font-serif text-lg tracking-wide">Lectio Divina</span>
          </Link>
          {user && (
            <span className="text-sand text-sm opacity-75">{user.displayName}</span>
          )}
        </header>
      )}

      <main className="flex-1 overflow-hidden min-h-0">
        {children}
      </main>

      {!isSession && user && (
        <nav className="bg-white border-t border-warm-200 flex flex-shrink-0 pb-safe">
          {nav.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                  active ? 'text-navy font-medium' : 'text-warm-400 hover:text-navy'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
