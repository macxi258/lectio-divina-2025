import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, UserProfile, ActionIntention, TranslationId } from '../types';
import { CLOSING_AFFIRMATIONS } from '../data/prayers';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function pickAffirmation(): string {
  return CLOSING_AFFIRMATIONS[Math.floor(Math.random() * CLOSING_AFFIRMATIONS.length)];
}

interface AppState {
  user: UserProfile | null;
  sessions: Session[];
  activeSessionId: string | null;

  // Auth
  signIn: (displayName: string, translation?: TranslationId) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  deleteAccount: () => void;

  // Sessions
  createSession: (scriptureRef: string, scriptureText: string, openingPrayerId: string) => string;
  updateSession: (id: string, patch: Partial<Session>) => void;
  completeSession: (id: string) => void;
  deleteSession: (id: string) => void;
  toggleFavourite: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  addIntention: (sessionId: string, text: string) => void;
  toggleIntention: (sessionId: string, intentionId: string) => void;
  removeIntention: (sessionId: string, intentionId: string) => void;

  getActiveSession: () => Session | undefined;
  getSession: (id: string) => Session | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      sessions: [],
      activeSessionId: null,

      signIn: (displayName, translation = 'dra') => {
        set({
          user: {
            id: generateId(),
            displayName,
            preferredTranslation: translation,
            createdAt: new Date().toISOString(),
          },
        });
      },

      signOut: () => set({ user: null, activeSessionId: null }),

      updateProfile: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),

      deleteAccount: () => set({ user: null, sessions: [], activeSessionId: null }),

      createSession: (scriptureRef, scriptureText, openingPrayerId) => {
        const id = generateId();
        const session: Session = {
          id,
          createdAt: new Date().toISOString(),
          scriptureRef,
          scriptureText,
          openingPrayerId,
          step3Text: '',
          step4Mind: '',
          step4Life: '',
          step4Heart: '',
          step6Text: '',
          intentions: [],
          isFavourite: false,
          tags: [],
          currentStep: 1,
          isCompleted: false,
        };
        set((s) => ({ sessions: [session, ...s.sessions], activeSessionId: id }));
        return id;
      },

      updateSession: (id, patch) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id ? { ...sess, ...patch } : sess
          ),
        })),

      completeSession: (id) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id
              ? {
                  ...sess,
                  isCompleted: true,
                  currentStep: 7,
                  dateCompleted: new Date().toISOString(),
                  closingAffirmation: pickAffirmation(),
                }
              : sess
          ),
          activeSessionId: null,
        })),

      deleteSession: (id) =>
        set((s) => ({
          sessions: s.sessions.filter((sess) => sess.id !== id),
          activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        })),

      toggleFavourite: (id) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id ? { ...sess, isFavourite: !sess.isFavourite } : sess
          ),
        })),

      addTag: (id, tag) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id && !sess.tags.includes(tag)
              ? { ...sess, tags: [...sess.tags, tag] }
              : sess
          ),
        })),

      removeTag: (id, tag) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id
              ? { ...sess, tags: sess.tags.filter((t) => t !== tag) }
              : sess
          ),
        })),

      addIntention: (sessionId, text) => {
        const intention: ActionIntention = { id: generateId(), text, completed: false };
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId
              ? { ...sess, intentions: [...sess.intentions, intention] }
              : sess
          ),
        }));
      },

      toggleIntention: (sessionId, intentionId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId
              ? {
                  ...sess,
                  intentions: sess.intentions.map((i) =>
                    i.id === intentionId ? { ...i, completed: !i.completed } : i
                  ),
                }
              : sess
          ),
        })),

      removeIntention: (sessionId, intentionId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId
              ? { ...sess, intentions: sess.intentions.filter((i) => i.id !== intentionId) }
              : sess
          ),
        })),

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId);
      },

      getSession: (id) => get().sessions.find((s) => s.id === id),
    }),
    { name: 'lectio-divina-store' }
  )
);
