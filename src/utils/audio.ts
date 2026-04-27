// Generates a soft bell/chime tone using the Web Audio API
export function playSoftChime(): void {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 — a gentle major chord

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5);

      osc.start(startTime);
      osc.stop(startTime + 2.5);
    });
  } catch {
    // Silently ignore if Web Audio is unavailable
  }
}
