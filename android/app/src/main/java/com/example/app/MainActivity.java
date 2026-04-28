package com.example.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Enable edge-to-edge layout so the WebView can render behind the
        // system status bar and gesture/navigation bar. This is what makes
        // CSS env(safe-area-inset-top / bottom) return non-zero values, which
        // our .pt-safe / .pb-safe utilities use to keep buttons reachable.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
