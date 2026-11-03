/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - PROCEDURAL ELECTRONIC SOUNDTRACK & SFX
   100% Client-Side Web Audio API Synthesis.
   Melodic electronic background loop + interactive gaming fanfares & chimes.
   ========================================================================== */

class AudioController {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.isMuted = true;
    this.masterGain = null;
    this.bgmGain = null;
    this.bgmLoopTimer = null;
    this.melodyStep = 0;
    this.isPlayingBgm = false;

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

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
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
      this.startElectronicBgm();
      this.playChime(587.33);
    } else {
      this.stopElectronicBgm();
    }

    if (typeof onStateChange === "function") {
      onStateChange(!this.isMuted);
    }

    return !this.isMuted;
  }

  // =========================================================================
  // CONTINUOUS ELECTRONIC LO-FI MELODIC BGM
  // =========================================================================
  startElectronicBgm() {
    if (this.isMuted || !this.ctx || this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(0.001, now);
    this.bgmGain.gain.linearRampToValueAtTime(0.08, now + 2);

    // Progression: Fmaj7 -> G6 -> Am7 -> Em7 (Warm, romantic, dreamy electronic loop)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // F3, A3, C4, E4 (Fmaj7)
      [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4 (G6)
      [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4 (Am7)
      [164.81, 196.00, 246.94, 329.63]  // E3, G3, B3, E4 (Em7)
    ];

    // Melodic sequence on top
    const melody = [
      [523.25, 659.25, 783.99], // C5, E5, G5
      [587.33, 783.99, 880.00], // D5, G5, A5
      [659.25, 880.00, 1046.50], // E5, A5, C6
      [587.33, 659.25, 783.99]  // D5, E5, G5
    ];

    let chordIndex = 0;

    const playChordStep = () => {
      if (!this.isPlayingBgm || !this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Play Soft Synth Pad Chord
      const curChord = chords[chordIndex % chords.length];
      curChord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.025, t + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);

        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 4.0);
      });

      // 2. Play Gentle Arpeggiated Melody Notes
      const curMelody = melody[chordIndex % melody.length];
      curMelody.forEach((freq, idx) => {
        const noteTime = t + idx * 0.9;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.035, noteTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start(noteTime);
        osc.stop(noteTime + 1.3);
      });

      chordIndex++;
    };

    playChordStep();
    this.bgmLoopTimer = setInterval(playChordStep, 4000);
  }

  stopElectronicBgm() {
    this.isPlayingBgm = false;
    if (this.bgmLoopTimer) {
      clearInterval(this.bgmLoopTimer);
      this.bgmLoopTimer = null;
    }
    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
      this.bgmGain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    }
  }

  // =========================================================================
  // SOUND EFFECTS: REWARDS, FANFARE, CHIMES
  // =========================================================================

  // Free Fire Style Loot Fanfare
  playCrateFanfare() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High-energy electronic celebration fanfare: C5, E5, G5, C6 (staccato -> sustained)
      const notes = [
        { f: 523.25, t: 0.00, d: 0.12 },
        { f: 659.25, t: 0.10, d: 0.12 },
        { f: 783.99, t: 0.20, d: 0.15 },
        { f: 1046.50, t: 0.35, d: 0.80 }
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.0001, now + t);
        gain.gain.linearRampToValueAtTime(0.08, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + t);
        osc.stop(now + t + d + 0.1);
      });
    } catch (e) {}
  }

  // Item Unbox Pop Sound
  playItemPop() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  // Soft Chime
  playChime(freq = 523.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.9);
    } catch (e) {}
  }

  // Envelope Open Sound
  playEnvelopeOpen() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.001, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.05, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 1.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 1.6);
      });
    } catch (e) {}
  }

  // YES Celebration Chord
  playYesCelebration() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chord = [392.00, 493.88, 587.33, 783.99, 987.77];
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 3.1);
      });
    } catch (e) {}
  }

  // Gentle NO sound
  playNoGentle() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [329.63, 392.00, 493.88];
      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.9);
      });
    } catch (e) {}
  }

  playCelestialArpeggio() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq), idx * 220);
    });
  }
}

// Global instance
window.audioController = new AudioController();
