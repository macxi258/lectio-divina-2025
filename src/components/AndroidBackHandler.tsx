import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import Button from './shared/Button';
import { useStore } from '../store/useStore';

/**
 * Listens for the hardware back button on Android (and similar gestures).
 *
 *  - On the home page (`/`): show a "Do you want to exit?" confirm dialog
 *  - Inside a Lectio Divina session: step back one workflow step, or exit the
 *    session if already at step 1
 *  - Anywhere else: navigate to the previous page in history
 */
export default function AndroidBackHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessions = useStore((s) => s.sessions);
  const updateSession = useStore((s) => s.updateSession);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | null = null;
    const subscribe = async () => {
      const handle = await App.addListener('backButton', () => {
        const path = location.pathname;

        // Home → ask to exit
        if (path === '/') {
          setShowExit(true);
          return;
        }

        // Session workflow → step back, or leave session at step 1
        const sessionMatch = path.match(/^\/session\/([^/]+)$/);
        if (sessionMatch) {
          const id = sessionMatch[1];
          const session = sessions.find((s) => s.id === id);
          if (session && session.currentStep > 1) {
            updateSession(id, { currentStep: session.currentStep - 1 });
            return;
          }
          navigate('/');
          return;
        }

        // Any other route → previous history entry, or fall back to home
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/');
        }
      });

      cleanup = () => { handle.remove(); };
    };

    subscribe();
    return () => { if (cleanup) cleanup(); };
  }, [location.pathname, navigate, sessions, updateSession]);

  if (!showExit) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="font-serif text-navy text-lg font-medium mb-2">Exit Lectio Divina?</h2>
        <p className="text-warm-500 text-sm mb-6">
          Are you sure you want to close the app?
        </p>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="md"
            className="flex-1"
            onClick={() => setShowExit(false)}
          >
            No
          </Button>
          <Button
            size="md"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {
              setShowExit(false);
              App.exitApp();
            }}
          >
            Yes, Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
