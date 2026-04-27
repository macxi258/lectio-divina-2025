import { useEffect, useRef, useState } from 'react';
import { Volume2, Pause, Play, Square, ChevronDown } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

interface Props {
  text: string;
  className?: string;
  /** Optional override for the BCP-47 voice language. Defaults to 'en-US'. */
  lang?: string;
}

interface VoiceOption {
  /** Friendly label shown in the picker, e.g. "English (US)" */
  label: string;
  /** Stable id used as React key + persisted in localStorage */
  id: string;
  lang: string;
  /** native = Capacitor TTS voice index, web = SpeechSynthesisVoice ref */
  nativeIndex?: number;
  webVoice?: SpeechSynthesisVoice;
}

const isNative = Capacitor.isNativePlatform();

// Voice families likely to sound more "human". Higher score = preferred.
function scoreVoiceName(name: string, lang: string): number {
  const n = name.toLowerCase();
  let score = 0;
  if (n.includes('natural')) score += 100;
  if (n.includes('neural')) score += 90;
  if (n.includes('premium')) score += 80;
  if (n.includes('enhanced')) score += 70;
  if (n.includes('network')) score += 65; // Android: -network voices are higher quality
  if (n.includes('online')) score += 60;
  if (/(samantha|daniel|karen|tessa|moira|google uk|google us|aria|jenny|guy|ryan|libby|sonia)/i.test(name)) score += 50;
  if (n.includes('compact')) score -= 30;
  if (n.includes('eloquence')) score -= 30;
  if (n.includes('local')) score -= 5; // Prefer network over local on Android
  if (lang === 'en-US') score += 10;
  else if (lang === 'en-GB') score += 8;
  else if (lang.startsWith('en')) score += 5;
  return score;
}

// Friendly label for a BCP-47 language tag, e.g. "en-US" → "English (US)".
function languageLabel(lang: string): string {
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'language' });
    const friendly = dn.of(lang);
    if (friendly) return friendly;
  } catch { /* DisplayNames not available — fall through */ }
  return lang;
}

/**
 * Collapse a list of raw voices into one entry per BCP-47 language,
 * keeping the highest-scoring voice for each language.
 */
function dedupeByLang<T extends { name: string; lang: string }>(
  voices: T[],
): { voice: T; label: string }[] {
  const bestByLang = new Map<string, T>();
  for (const v of voices) {
    const existing = bestByLang.get(v.lang);
    if (!existing || scoreVoiceName(v.name, v.lang) > scoreVoiceName(existing.name, existing.lang)) {
      bestByLang.set(v.lang, v);
    }
  }
  return [...bestByLang.entries()]
    .map(([lang, voice]) => ({ voice, label: languageLabel(lang) }))
    .sort((a, b) => {
      // English first, then alphabetical by label
      const aEn = a.voice.lang.startsWith('en') ? 0 : 1;
      const bEn = b.voice.lang.startsWith('en') ? 0 : 1;
      if (aEn !== bEn) return aEn - bEn;
      return a.label.localeCompare(b.label);
    });
}

export default function ReadAloud({ text, className = '', lang = 'en-US' }: Props) {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('lectio-tts-voice') ?? '';
  });
  const [showPicker, setShowPicker] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (isNative) {
      // Native plugin is always available on Android/iOS
      setSupported(true);
      return;
    }
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // Load voices from whichever engine we're using
  useEffect(() => {
    let cancelled = false;

    async function loadNativeVoices() {
      try {
        const result = await TextToSpeech.getSupportedVoices();
        if (cancelled) return;
        const all = (result.voices ?? []).map((v, i) => ({
          name: v.name,
          lang: v.lang,
          nativeIndex: i,
        }));
        const deduped = dedupeByLang(all).map(({ voice, label }) => ({
          label,
          id: voice.lang, // one entry per language
          lang: voice.lang,
          nativeIndex: voice.nativeIndex,
        }));
        setVoices(deduped);
        if (!selectedVoiceName && deduped.length > 0) {
          setSelectedVoiceName(deduped[0].id);
        }
      } catch (e) {
        console.warn('Native TTS getSupportedVoices failed', e);
      }
    }

    function loadWebVoices() {
      const synth = window.speechSynthesis;
      const all = synth.getVoices();
      const deduped = dedupeByLang(all).map(({ voice, label }) => ({
        label,
        id: voice.lang,
        lang: voice.lang,
        webVoice: voice,
      }));
      setVoices(deduped);
      if (!selectedVoiceName && deduped.length > 0) {
        setSelectedVoiceName(deduped[0].id);
      }
    }

    if (isNative) {
      loadNativeVoices();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      loadWebVoices();
      window.speechSynthesis.onvoiceschanged = loadWebVoices;
      return () => { window.speechSynthesis.onvoiceschanged = null; };
    }

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop on unmount or text change
  useEffect(() => {
    return () => { stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  function chooseVoice(name: string) {
    setSelectedVoiceName(name);
    localStorage.setItem('lectio-tts-voice', name);
    setShowPicker(false);
    if (speaking) {
      stop();
      setTimeout(() => play(), 100);
    }
  }

  async function play() {
    if (!supported) return;

    // Strip verse-number markers like "[14]" so they don't get read out.
    const cleaned = text.replace(/\[(\d+)\]/g, ' verse $1, ');

    if (isNative) {
      try {
        const voice = voices.find((v) => v.id === selectedVoiceName);
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text: cleaned,
          lang: voice?.lang ?? lang,
          voice: voice?.nativeIndex,
          rate: 0.9,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });
        setSpeaking(false);
        setPaused(false);
      } catch (e) {
        console.warn('Native TTS speak failed', e);
        setSpeaking(false);
        setPaused(false);
      }
      setSpeaking(true);
      setPaused(false);
      return;
    }

    // Web fallback
    const synth = window.speechSynthesis;
    if (paused) {
      synth.resume();
      setPaused(false);
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(cleaned);
    const voice = voices.find((v) => v.id === selectedVoiceName)?.webVoice;
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? lang;
    u.rate = 0.9;
    u.pitch = 1.0;
    u.onend = () => { setSpeaking(false); setPaused(false); };
    u.onerror = () => { setSpeaking(false); setPaused(false); };
    utteranceRef.current = u;
    synth.speak(u);
    setSpeaking(true);
    setPaused(false);
  }

  function pause() {
    if (!supported || !speaking) return;
    if (isNative) {
      // Capacitor TTS doesn't have a true pause; treat as stop.
      stop();
      return;
    }
    window.speechSynthesis.pause();
    setPaused(true);
  }

  function stop() {
    if (isNative) {
      TextToSpeech.stop().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setPaused(false);
  }

  if (!supported) return null;

  const currentVoice = voices.find((v) => v.id === selectedVoiceName);

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {!speaking && (
        <button
          onClick={play}
          aria-label="Read aloud"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy/5 text-navy text-xs font-medium hover:bg-navy/10 transition-colors"
        >
          <Volume2 size={14} />
          Read aloud
        </button>
      )}
      {voices.length > 1 && (
        <button
          onClick={() => setShowPicker((v) => !v)}
          aria-label="Choose voice"
          title={currentVoice ? `Voice: ${currentVoice.label}` : 'Choose voice'}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-navy/5 text-navy/60 text-xs hover:bg-navy/10 transition-colors"
        >
          <span className="max-w-[110px] truncate">{currentVoice?.label ?? 'Voice'}</span>
          <ChevronDown size={12} />
        </button>
      )}
      {showPicker && voices.length > 0 && (
        <div className="absolute top-full right-0 mt-1 z-20 bg-white rounded-xl border border-warm-200 shadow-lg w-64 max-h-64 overflow-y-auto">
          <p className="text-xs text-warm-500 px-3 pt-2 pb-1 sticky top-0 bg-white border-b border-warm-100">
            Pick a language ({voices.length} available)
          </p>
          {voices.map((v) => (
            <button
              key={v.id}
              onClick={() => chooseVoice(v.id)}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-warm-50 transition-colors border-b border-warm-50 last:border-0 ${
                v.id === selectedVoiceName ? 'text-navy font-medium bg-warm-50' : 'text-warm-600'
              }`}
            >
              <span className="block truncate">{v.label}</span>
              <span className="text-warm-400 text-[10px]">{v.lang}</span>
            </button>
          ))}
        </div>
      )}
      {speaking && !paused && !isNative && (
        <button
          onClick={pause}
          aria-label="Pause reading"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy/10 text-navy text-xs font-medium hover:bg-navy/20 transition-colors"
        >
          <Pause size={14} />
          Pause
        </button>
      )}
      {speaking && paused && !isNative && (
        <button
          onClick={play}
          aria-label="Resume reading"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy/10 text-navy text-xs font-medium hover:bg-navy/20 transition-colors"
        >
          <Play size={14} />
          Resume
        </button>
      )}
      {speaking && (
        <button
          onClick={stop}
          aria-label="Stop reading"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-100 text-warm-600 text-xs font-medium hover:bg-warm-200 transition-colors"
        >
          <Square size={12} />
          Stop
        </button>
      )}
    </div>
  );
}
