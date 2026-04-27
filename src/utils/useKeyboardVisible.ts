import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

/**
 * Returns `true` when the on-screen keyboard is visible.
 *
 *  - On Capacitor (Android/iOS) it uses the native keyboard events for
 *    accurate, frame-perfect timing.
 *  - In the browser it falls back to focus/blur on inputs and textareas
 *    so dev/preview also gets the same behaviour (approximate).
 */
export function useKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      let cleanup1: (() => void) | null = null;
      let cleanup2: (() => void) | null = null;

      Keyboard.addListener('keyboardWillShow', () => setVisible(true)).then((h) => {
        cleanup1 = () => { h.remove(); };
      });
      Keyboard.addListener('keyboardWillHide', () => setVisible(false)).then((h) => {
        cleanup2 = () => { h.remove(); };
      });

      return () => {
        if (cleanup1) cleanup1();
        if (cleanup2) cleanup2();
      };
    }

    // Browser fallback — track focus on text inputs.
    const isTextInput = (t: EventTarget | null): boolean => {
      if (!(t instanceof HTMLElement)) return false;
      const tag = t.tagName;
      if (tag === 'TEXTAREA') return true;
      if (tag === 'INPUT') {
        const type = (t as HTMLInputElement).type;
        return ['text', 'email', 'password', 'search', 'tel', 'url', 'number'].includes(type);
      }
      return t.isContentEditable;
    };

    const onFocusIn = (e: FocusEvent) => { if (isTextInput(e.target)) setVisible(true); };
    const onFocusOut = (e: FocusEvent) => { if (isTextInput(e.target)) setVisible(false); };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return visible;
}
