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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
