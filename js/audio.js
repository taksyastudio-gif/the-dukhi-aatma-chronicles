/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - PROCEDURAL WEB AUDIO SOUNDSCAPE
   100% Client-Side Web Audio API Synthesis.
   Zero external audio files, zero copyright dependencies, zero network latency.
   ========================================================================== */

class AudioController {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.ambientGain = null;
    this.droneOscillators = [];
    this.chimeInterval = null;
    this.isMuted = true;
    
    // Check saved preference
    const saved = localStorage.getItem(CONFIG.storageKeys.audioEnabled);
    if (saved === "true") {
      this.isMuted = false;
    }
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio API not supported in this environment", e);
    }
  }

  toggleSound(onStateChange) {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    localStorage.setItem(CONFIG.storageKeys.audioEnabled, (!this.isMuted).toString());

    if (!this.isMuted) {
      this.startAmbient();
      this.playChime();
    } else {
      this.stopAmbient();
    }

    if (typeof onStateChange === "function") {
      onStateChange(!this.isMuted);
    }

    return !this.isMuted;
  }

  startAmbient() {
    if (this.isMuted || !this.ctx) return;
    if (this.droneOscillators.length > 0) return; // Already running

    try {
      const now = this.ctx.currentTime;

      // Master Ambient Bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.045, now + 3); // Soft fade-in
      this.ambientGain.connect(this.ctx.destination);

      // Lowpass Filter for warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);
      filter.connect(this.ambientGain);

      // Frequencies for a soft celestial triad in F major / D minor (warm, dreamy, intimate)
      // F3 (174.6Hz), A3 (220.0Hz), C4 (261.6Hz), E4 (329.6Hz)
      const freqs = [174.61, 220.00, 261.63, 329.63];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        // Individual slight detune for cosmic shimmer
        osc.detune.setValueAtTime((idx - 1.5) * 4, now);

        // Sub gain node
        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.2, now);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();

        this.droneOscillators.push(osc);
      });

      // Schedule occasional soft celestial wind-chimes every 9-16 seconds
      this.chimeInterval = setInterval(() => {
        if (!this.isMuted && Math.random() > 0.3) {
          this.playCelestialArpeggio();
        }
      }, 11000);

    } catch (e) {
      console.warn("Could not start ambient synthesizer", e);
    }
  }

  stopAmbient() {
    if (!this.ctx || this.droneOscillators.length === 0) return;

    try {
      const now = this.ctx.currentTime;
      if (this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      }

      setTimeout(() => {
        this.droneOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (err) {}
        });
        this.droneOscillators = [];
        if (this.chimeInterval) {
          clearInterval(this.chimeInterval);
          this.chimeInterval = null;
        }
      }, 1300);
    } catch (e) {
      console.warn("Error stopping ambient", e);
    }
  }

  // Soft single chime note (pentatonic scale)
  playChime(freq = 523.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    } catch (e) {}
  }

  // Gentle celestial arpeggio
  playCelestialArpeggio() {
    if (this.isMuted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq);
      }, idx * 260);
    });
  }

  // Sound effect: Opening the wax-sealed envelope
  playEnvelopeOpen() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Shimmer sweep
      const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.04, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.9);
      });
    } catch (e) {}
  }

  // Sound effect: YES celebration chord
  playYesCelebration() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Uplifting sparkling major chord with harmonic overtones
      const chord = [392.00, 493.88, 587.33, 783.99, 987.77]; // G major 7
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.6);
      });
    } catch (e) {}
  }

  // Sound effect: Gentle warm wistful chord for NO stages
  playNoGentle() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [329.63, 392.00, 493.88]; // E minor mellow
      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.1);
      });
    } catch (e) {}
  }
}

// Global instance
window.audioController = new AudioController();
