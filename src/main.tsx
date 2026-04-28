import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.tsx'

// Tag the root element so CSS can apply safe-area padding only when we're
// actually inside the Capacitor WebView (browser/PWA users don't need it
// — the browser already reserves space for the system gesture bar).
if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add('native');
}

// ── Visual viewport tracking for browsers / PWAs ───────────────────────────
// On the web, `100dvh` doesn't always shrink reliably when the on-screen
// keyboard appears — especially in installed PWAs. The Visual Viewport API
// gives us the *actually visible* height in real time. We expose it as a
// CSS custom property that the layout consumes, so the page resizes to
// match the visible area (and the StepHeader stays pinned, the textarea
// shrinks, etc.).
if (!Capacitor.isNativePlatform() && typeof window !== 'undefined') {
  const setVvh = () => {
    const h = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--vvh', `${h}px`);
  };
  setVvh();
  window.visualViewport?.addEventListener('resize', setVvh);
  window.visualViewport?.addEventListener('scroll', setVvh);
  window.addEventListener('resize', setVvh);
  window.addEventListener('orientationchange', setVvh);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
