import { useState } from 'react';
import { Shield, Bell, LogOut, Trash2, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from '../components/shared/Button';

const TRANSLATIONS = [
  { id: 'dra', label: 'Douay-Rheims (Public Domain)', description: 'Traditional Catholic translation (1899)' },
  { id: 'web', label: 'World English Bible', description: 'Modern public domain translation' },
] as const;

export default function ProfilePage() {
  const user = useStore((s) => s.user);
  const updateProfile = useStore((s) => s.updateProfile);
  const signOut = useStore((s) => s.signOut);
  const deleteAccount = useStore((s) => s.deleteAccount);
  const sessions = useStore((s) => s.sessions);

  const [reminderTime, setReminderTime] = useState(user?.reminderTime ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName ?? '');

  if (!user) return null;

  return (
    <div className="h-full flex flex-col bg-cream max-w-lg mx-auto w-full">
      {/* Fixed top: profile header with name + sessions/favourites */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4 bg-cream">
      <div className="bg-navy text-white rounded-2xl p-6 text-center">
        <div className="text-gold text-4xl mb-3">✝</div>
        {editName ? (
          <div className="flex gap-2 items-center justify-center">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-center text-lg font-serif w-40 focus:outline-none focus:ring-1 focus:ring-gold"
              autoFocus
            />
            <button
              onClick={() => { updateProfile({ displayName: newName.trim() || user.displayName }); setEditName(false); }}
              className="text-gold text-sm hover:text-white transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          <button onClick={() => setEditName(true)} className="group">
            <h2 className="font-serif text-xl font-medium group-hover:text-gold transition-colors">{user.displayName}</h2>
            <p className="text-white/40 text-xs mt-1">Tap to edit name</p>
          </button>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-serif">{sessions.filter((s) => s.isCompleted).length}</p>
            <p className="text-white/50 text-xs">Sessions</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-serif">{sessions.filter((s) => s.isFavourite).length}</p>
            <p className="text-white/50 text-xs">Favourites</p>
          </div>
        </div>
      </div>
      </div>

      {/* Scrollable bottom section */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 pt-2 pb-6 flex flex-col gap-5">
      {/* Translation preference */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-warm-400" />
          <h3 className="font-serif text-navy font-medium">Bible Translation</h3>
        </div>
        <div className="flex flex-col gap-2">
          {TRANSLATIONS.map(({ id, label, description }) => (
            <button
              key={id}
              onClick={() => updateProfile({ preferredTranslation: id })}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors text-left ${
                user.preferredTranslation === id
                  ? 'border-navy bg-navy/5'
                  : 'border-warm-100 hover:border-warm-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                user.preferredTranslation === id ? 'border-navy bg-navy' : 'border-warm-300'
              }`} />
              <div>
                <p className="text-sm font-medium text-navy">{label}</p>
                <p className="text-xs text-warm-400">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} className="text-warm-400" />
          <h3 className="font-serif text-navy font-medium">Daily Reminder</h3>
        </div>
        <p className="text-warm-400 text-sm mb-3">Set a daily time for your Lectio Divina practice.</p>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="bg-warm-50 border border-warm-200 rounded-xl px-3 py-2 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => updateProfile({ reminderTime })}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-warm-400" />
          <h3 className="font-serif text-navy font-medium">Privacy</h3>
        </div>
        <p className="text-warm-500 text-sm leading-relaxed">
          Your reflections are stored locally on this device and are never shared, sold, or
          used for any purpose other than your personal spiritual practice.
        </p>
      </div>

      {/* Sign out / Delete */}
      <div className="flex flex-col gap-3 pb-4">
        <button
          onClick={signOut}
          className="flex items-center justify-center gap-2 text-sm text-warm-500 hover:text-navy transition-colors py-2"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <button
          onClick={() => { if (confirmDelete) deleteAccount(); else setConfirmDelete(true); }}
          className="flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors py-2"
        >
          <Trash2 size={16} />
          {confirmDelete ? 'Tap again to permanently delete account and all data' : 'Delete Account'}
        </button>
      </div>
      </div>
    </div>
  );
}
