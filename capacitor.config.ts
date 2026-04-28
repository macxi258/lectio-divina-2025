import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'app',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      // Resize the entire native WebView frame when the keyboard appears.
      // This makes 100dvh / h-full / flex-1 all shrink correctly so the
      // step header stays pinned at the top and the textarea simply gets
      // shorter — instead of the page scrolling and the header sliding up.
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
