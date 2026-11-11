import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { CHANGELOG, type ChangeType, type Release } from '../data/changelog';
import { APP_VERSION } from '../utils/version';

const BADGES: Record<ChangeType, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-green-50 text-green-700 border-green-200' },
  improved: { label: 'Improved', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  fixed: { label: 'Fixed', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return format(new Date(y, m - 1, d), 'MMMM d, yyyy');
}

function ReleaseBlock({ release }: { release: Release }) {
  const isCurrent = release.version === APP_VERSION;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <p className="font-serif text-navy font-medium text-sm">
          Version {release.version} — {release.title}
        </p>
        {isCurrent && (
          <span className="text-[10px] uppercase tracking-wide font-medium bg-navy text-gold rounded-full px-2 py-0.5">
            Current
          </span>
        )}
      </div>
      <p className="text-warm-400 text-xs mb-2">{formatDate(release.date)}</p>
      <ul className="flex flex-col gap-1.5">
        {release.changes.map((c, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex-shrink-0 text-[10px] font-medium border rounded px-1.5 py-0.5 ${BADGES[c.type].cls}`}
            >
              {BADGES[c.type].label}
            </span>
            <span className="text-warm-700 text-sm leading-relaxed font-serif">{c.text}</span>
          </li>
        ))}
      </ul>
      {release.note && (
        <p className="text-warm-500 text-xs leading-relaxed mt-2 italic">{release.note}</p>
      )}
    </div>
  );
}

export default function ReleaseNotes() {
  const [showAll, setShowAll] = useState(false);
  const [latest, ...earlier] = CHANGELOG;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-navy">
        <Sparkles size={18} className="text-gold" />
        <h3 className="font-serif font-medium text-base">What’s new</h3>
      </div>

      <ReleaseBlock release={latest} />

      {showAll &&
        earlier.map((r) => (
          <div key={r.version} className="border-t border-warm-100 pt-4">
            <ReleaseBlock release={r} />
          </div>
        ))}

      {earlier.length > 0 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="flex items-center justify-center gap-1 text-xs text-navy hover:text-gold transition-colors"
        >
          {showAll ? (
            <>Hide earlier versions <ChevronUp size={14} /></>
          ) : (
            <>Show earlier versions ({earlier.length}) <ChevronDown size={14} /></>
          )}
        </button>
      )}
    </div>
  );
}
