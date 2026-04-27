import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'app',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      // Shrinks the webview body when the keyboard appears, so our flex
      // layout (h-dvh + flex-1 scroll area) automatically lifts the
      // Continue button above the keyboard.
      resize: KeyboardResize.Body,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
