// Tiny Web Audio synth: ambient pad, sound effects and a music-box "Happy Birthday".
// Everything is generated live, so there are no audio files to load.

type Sfx = "click" | "success" | "error" | "burp" | "unlock" | "reveal" | "coin" | "whoosh" | "chime";

const NOTE = (n: string) => {
  const m = /^([A-G])(#|b)?(\d)$/.exec(n)!;
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1] as "C"]!;
  const acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
  const midi = 12 * (Number(m[3]) + 1) + base + acc;
  return 440 * Math.pow(2, (midi - 69) / 12);
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private music!: GainNode;
  private sfx!: GainNode;
  private padTimer: ReturnType<typeof setInterval> | null = null;
  private sparkleTimer: ReturnType<typeof setInterval> | null = null;
  private padVoices: { osc: OscillatorNode; gain: GainNode }[] = [];
  muted = false;
  /** The player's choice for the ambient music (what the HUD toggle shows). */
  ambientOn = false;
  private padPlaying = false;
  private holds = 0;
  private listeners = new Set<() => void>();

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp).connect(this.ctx.destination);
      this.music = this.ctx.createGain();
      this.music.gain.value = 0.32;
      this.music.connect(this.master);
      this.sfx = this.ctx.createGain();
      this.sfx.gain.value = 0.5;
      this.sfx.connect(this.master);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.05);
    this.emit();
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    opts: { type?: OscillatorType; gain?: number; attack?: number; dest?: AudioNode; glideTo?: number } = {},
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(freq, start);
    if (opts.glideTo) osc.frequency.exponentialRampToValueAtTime(opts.glideTo, start + dur);
    const peak = opts.gain ?? 0.3;
    const attack = opts.attack ?? 0.01;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(opts.dest ?? this.sfx);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  /** A soft bell, used for melodies and the element pads. */
  bell(freq: number, when = 0, dur = 1.2, gain = 0.25, dest?: AudioNode) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    this.tone(freq, t, dur, { type: "sine", gain, dest });
    this.tone(freq * 2, t, dur * 0.6, { type: "sine", gain: gain * 0.35, dest });
    this.tone(freq * 3.01, t, dur * 0.3, { type: "triangle", gain: gain * 0.12, dest });
  }

  play(name: Sfx) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    switch (name) {
      case "click":
        this.tone(880, t, 0.08, { type: "triangle", gain: 0.12 });
        break;
      case "success":
        ["C5", "E5", "G5", "C6"].forEach((n, i) => this.bell(NOTE(n), i * 0.09, 0.9, 0.22));
        break;
      case "error":
        this.tone(330, t, 0.35, { type: "sawtooth", gain: 0.08, glideTo: 140 });
        this.tone(220, t + 0.12, 0.4, { type: "square", gain: 0.05, glideTo: 90 });
        break;
      case "burp": {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const g = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.5);
        lfo.frequency.value = 28;
        lfoGain.gain.value = 25;
        lfo.connect(lfoGain).connect(osc.frequency);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 600;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        osc.connect(lp).connect(g).connect(this.sfx);
        osc.start(t);
        lfo.start(t);
        osc.stop(t + 0.6);
        lfo.stop(t + 0.6);
        break;
      }
      case "unlock":
        ["G5", "B5", "D6", "G6", "B6"].forEach((n, i) => this.bell(NOTE(n), i * 0.06, 0.7, 0.14));
        break;
      case "reveal":
        ["C4", "G4", "C5", "E5", "G5", "B5", "D6"].forEach((n, i) => this.bell(NOTE(n), i * 0.11, 2.6, 0.16));
        break;
      case "coin":
        this.tone(NOTE("B5"), t, 0.08, { type: "square", gain: 0.07 });
        this.tone(NOTE("E6"), t + 0.08, 0.35, { type: "square", gain: 0.07 });
        break;
      case "whoosh": {
        const ctx = this.ctx;
        const len = 0.6;
        const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(300, t);
        bp.frequency.exponentialRampToValueAtTime(3000, t + len);
        const g = ctx.createGain();
        g.gain.value = 0.35;
        src.connect(bp).connect(g).connect(this.sfx);
        src.start(t);
        break;
      }
      case "chime":
        this.bell(NOTE("E6"), 0, 1.4, 0.12);
        this.bell(NOTE("B6"), 0.05, 1.2, 0.08);
        break;
    }
  }

  /** Pentatonic note for index i (used by the element-sequence puzzle). */
  elementTone(i: number) {
    const notes = ["C4", "D4", "E4", "G4", "A4", "C5"];
    this.bell(NOTE(notes[i % notes.length]), 0, 1.0, 0.3);
  }

  startAmbient() {
    if (!this.ctx) return;
    this.ambientOn = true;
    if (this.holds === 0) this.playPad();
    this.emit();
  }

  stopAmbient() {
    this.ambientOn = false;
    this.stopPad();
    this.emit();
  }

  /**
   * Pause the ambient music while something else plays (a YouTube song, the birthday tune).
   * Returns a release function. Once every hold is released, the music resumes if the player still wants it.
   */
  hold() {
    this.holds++;
    this.stopPad();
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.holds--;
      if (this.holds === 0 && this.ambientOn) this.playPad();
    };
  }

  private playPad() {
    if (!this.ctx || this.padPlaying) return;
    this.padPlaying = true;
    const chords = [
      ["C3", "G3", "B3", "E4"],
      ["A2", "E3", "G3", "C4"],
      ["F2", "C3", "E3", "A3"],
      ["G2", "D3", "A3", "B3"],
    ];
    const pent = ["C5", "D5", "E5", "G5", "A5", "C6", "E6"];
    let i = 0;
    const playChord = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.padVoices.forEach(({ osc, gain }) => {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0.0001, now, 1.2);
        osc.stop(now + 5);
      });
      this.padVoices = [];
      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      lp.connect(this.music);
      chords[i % chords.length].forEach((n) => {
        [-6, 6].forEach((detune) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = "triangle";
          osc.frequency.value = NOTE(n);
          osc.detune.value = detune;
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.setTargetAtTime(0.05, now, 1.5);
          osc.connect(gain).connect(lp);
          osc.start(now);
          this.padVoices.push({ osc, gain });
        });
      });
      i++;
    };
    playChord();
    this.padTimer = setInterval(playChord, 7000);
    this.sparkleTimer = setInterval(() => {
      if (Math.random() < 0.55) this.bell(NOTE(pent[Math.floor(Math.random() * pent.length)]), 0, 2.2, 0.05, this.music);
    }, 1400);
  }

  private stopPad() {
    if (!this.ctx || !this.padPlaying) return;
    this.padPlaying = false;
    if (this.padTimer) clearInterval(this.padTimer);
    if (this.sparkleTimer) clearInterval(this.sparkleTimer);
    const now = this.ctx.currentTime;
    this.padVoices.forEach(({ osc, gain }) => {
      gain.gain.setTargetAtTime(0.0001, now, 0.6);
      osc.stop(now + 4);
    });
    this.padVoices = [];
  }

  /** Music-box "Happy Birthday" (public domain melody). Returns duration in seconds. */
  happyBirthday() {
    if (!this.ctx) return 0;
    const beat = 0.42;
    const melody: [string, number][] = [
      ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
      ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
      ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
      ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
    ];
    const bass: [string, number][] = [
      ["C3", 3], ["G2", 3], ["G2", 3], ["C3", 3], ["C3", 3], ["F2", 3], ["C3", 1.5], ["G2", 1.5], ["C3", 3],
    ];
    let t = 0.5;
    melody.forEach(([n, d]) => {
      this.bell(NOTE(n), t, Math.max(0.8, d * beat * 1.6), 0.26);
      t += d * beat;
    });
    let tb = 0.5 + beat; // melody starts on the pickup
    bass.forEach(([n, d]) => {
      this.bell(NOTE(n), tb, d * beat * 1.2, 0.12);
      tb += d * beat;
    });
    return t;
  }
}

export const sound = new SoundEngine();
