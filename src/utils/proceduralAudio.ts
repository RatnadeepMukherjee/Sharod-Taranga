/**
 * Procedural Audio Synthesis & Hardware Feedback Engine
 * 1970s Calcutta Valve Radio (Akashvani Kolkata)
 */

export class AudioContextManager {
  private static instance: AudioContext | null = null;
  private static analyser: AnalyserNode | null = null;

  public static getContext(): AudioContext | null {
    try {
      if (typeof window === 'undefined') return null;
      if (!AudioContextManager.instance) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        AudioContextManager.instance = new AudioCtx();
      }
      if (AudioContextManager.instance && AudioContextManager.instance.state === 'suspended') {
        AudioContextManager.instance.resume().catch(() => {
          // Autoplay policy prevents audio context until user interaction
        });
      }
      return AudioContextManager.instance;
    } catch {
      return null;
    }
  }

  public static getAnalyser(): AnalyserNode | null {
    try {
      const ctx = AudioContextManager.getContext();
      if (!ctx) return null;
      if (!AudioContextManager.analyser) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64; // 32 frequency bins
        analyser.smoothingTimeConstant = 0.82;
        try {
          analyser.connect(ctx.destination);
        } catch {}
        AudioContextManager.analyser = analyser;
      }
      return AudioContextManager.analyser;
    } catch {
      return null;
    }
  }

  public static getMasterDestination(): AudioNode {
    const ctx = AudioContextManager.getContext();
    const analyser = AudioContextManager.getAnalyser();
    if (analyser) {
      return analyser;
    }
    return ctx ? ctx.destination : ({} as AudioNode);
  }

  public static getLiveFrequencyData(binCount: number = 12): number[] {
    const analyser = AudioContextManager.getAnalyser();
    if (!analyser) return new Array(binCount).fill(0);
    try {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const result: number[] = [];
      const step = Math.max(1, Math.floor(bufferLength / binCount));
      for (let i = 0; i < binCount; i++) {
        let sum = 0;
        let count = 0;
        for (let j = 0; j < step && i * step + j < bufferLength; j++) {
          sum += dataArray[i * step + j];
          count++;
        }
        result.push(count > 0 ? (sum / count) / 255 : 0);
      }
      return result;
    } catch {
      return new Array(binCount).fill(0);
    }
  }
}


/**
 * Triple-layer synthesized tactile feedback for vintage potentiometer clicks
 * 1. 15ms high-pass carbon-wiper scraper crunch
 * 2. randomized 880–1100 Hz triangle wave detent impulse
 * 3. 160 Hz low-frequency cabinet resonance thump
 */
export function playPotentiometerCrunchClick(volumeScale: number = 1.0) {
  try {
    const ctx = AudioContextManager.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Carbon wiper scraper crunch (15ms high-passed noise burst)
    const noiseBufferSize = Math.floor(ctx.sampleRate * 0.015);
    const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseBufferSize * 0.3));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(2200, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28 * volumeScale, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    noiseSource.connect(hpFilter);
    hpFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    // 2. Randomized 880–1100 Hz triangle wave detent impulse
    const detentOsc = ctx.createOscillator();
    detentOsc.type = 'triangle';
    const randomFreq = 880 + Math.random() * 220;
    detentOsc.frequency.setValueAtTime(randomFreq, now);
    detentOsc.frequency.exponentialRampToValueAtTime(randomFreq * 0.45, now + 0.022);

    const detentGain = ctx.createGain();
    detentGain.gain.setValueAtTime(0.35 * volumeScale, now);
    detentGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    detentOsc.connect(detentGain);
    detentGain.connect(ctx.destination);
    detentOsc.start(now);
    detentOsc.stop(now + 0.03);

    // 3. 160 Hz low-frequency teakwood cabinet resonance thump
    const cabinetOsc = ctx.createOscillator();
    cabinetOsc.type = 'sine';
    cabinetOsc.frequency.setValueAtTime(160, now);
    cabinetOsc.frequency.exponentialRampToValueAtTime(55, now + 0.045);

    const cabinetGain = ctx.createGain();
    cabinetGain.gain.setValueAtTime(0.42 * volumeScale, now);
    cabinetGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    cabinetOsc.connect(cabinetGain);
    cabinetGain.connect(ctx.destination);
    cabinetOsc.start(now);
    cabinetOsc.stop(now + 0.055);
  } catch (err) {
    // Gracefully ignore audio glitches
  }
}

/**
 * Procedural Analog Static Hiss Generator (ProceduralStaticHissGenerator)
 * Real-time Web Audio API pink noise and atmospheric micro-grit loop.
 * Sweeps a resonant bandpass filter (900 Hz – 3200 Hz) and dynamically scales
 * hiss amplitude proportional to rotary knob angular velocity.
 */
export class ProceduralStaticHissGenerator {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private noiseNode: AudioBufferSourceNode | null = null;
  private bandpassFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private hissGain: GainNode | null = null;
  private baseGain: GainNode | null = null;
  private targetVelocity: number = 0;
  private currentVelocity: number = 0;
  private decayInterval: number | null = null;
  private isPowered: boolean = true;
  private masterVolume: number = 0.8;

  constructor() {
    // Lazily initialized on user interaction
  }

  public init() {
    if (this.isRunning) return;
    try {
      this.ctx = AudioContextManager.getContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Create 2-second looped pink noise buffer with micro-grit
      const bufferLength = this.ctx.sampleRate * 2.0;
      const buffer = this.ctx.createBuffer(1, bufferLength, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise filter algorithm (Paul Kellet's filter)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;

        // Add periodic micro-grit ticks like vintage atmospheric ionization
        const grit = (Math.random() > 0.997 ? (Math.random() * 2 - 1) * 0.3 : 0);
        data[i] = (pink * 0.11 + grit) * 0.4;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Sweeping resonant bandpass filter (900 Hz – 3200 Hz)
      this.bandpassFilter = this.ctx.createBiquadFilter();
      this.bandpassFilter.type = 'bandpass';
      this.bandpassFilter.frequency.setValueAtTime(1400, now);
      this.bandpassFilter.Q.setValueAtTime(2.8, now);

      // Dynamic velocity-sensitive hiss gain
      this.hissGain = this.ctx.createGain();
      this.hissGain.gain.setValueAtTime(0.015, now);

      // Ambient receiver noise floor (constant subtle warmth when on)
      this.baseGain = this.ctx.createGain();
      this.baseGain.gain.setValueAtTime(0.008, now);

      // Master output gain
      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(this.isPowered ? this.masterVolume : 0, now);
      this.masterGain = mainGain;

      // Connections
      this.noiseNode.connect(this.bandpassFilter);
      this.bandpassFilter.connect(this.hissGain);
      this.noiseNode.connect(this.baseGain);

      this.hissGain.connect(mainGain);
      this.baseGain.connect(mainGain);
      mainGain.connect(AudioContextManager.getMasterDestination());

      this.noiseNode.start(0);
      this.isRunning = true;

      // Smooth decay animation loop
      this.startDecayLoop();
    } catch {
      // Ignored
    }
  }

  private startDecayLoop() {
    if (this.decayInterval) clearInterval(this.decayInterval);
    this.decayInterval = window.setInterval(() => {
      try {
        if (!this.isRunning || !this.ctx || !this.hissGain || !this.bandpassFilter) return;

        // Smoothly approach target velocity and decay toward 0
        this.currentVelocity += (this.targetVelocity - this.currentVelocity) * 0.28;
        this.targetVelocity *= 0.72; // natural air decay

        const now = this.ctx.currentTime;
        // Resonant filter frequency sweeps between 900 Hz and 3200 Hz based on velocity & tuning
        const targetFilterFreq = 950 + this.currentVelocity * 1900;
        this.bandpassFilter.frequency.setTargetAtTime(
          Math.min(3200, Math.max(900, targetFilterFreq)),
          now,
          0.04
        );

        // Gain scales dynamically with velocity
        const dynamicGain = 0.015 + Math.min(0.24, this.currentVelocity * 0.18);
        this.hissGain.gain.setTargetAtTime(this.isPowered ? dynamicGain : 0, now, 0.04);
      } catch {}
    }, 30);
  }

  /**
   * Stimulate tuning velocity when knob turns or dial moves
   * @param velocity Normalized angular / delta velocity (0.0 to 1.5)
   */
  public reportTuningVelocity(velocity: number) {
    if (!this.isRunning) this.init();
    this.targetVelocity = Math.max(this.targetVelocity, Math.min(1.5, velocity));
  }

  public setPower(powered: boolean) {
    this.isPowered = powered;
    try {
      if (this.ctx && this.masterGain && this.masterGain instanceof GainNode) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setTargetAtTime(powered ? this.masterVolume : 0, now, 0.08);
      }
    } catch {}
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    try {
      if (this.ctx && this.masterGain && this.masterGain instanceof GainNode && this.isPowered) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setTargetAtTime(this.masterVolume, now, 0.05);
      }
    } catch {}
  }

  public stop() {
    if (this.decayInterval) {
      clearInterval(this.decayInterval);
      this.decayInterval = null;
    }
    try {
      this.noiseNode?.stop();
      this.noiseNode?.disconnect();
    } catch {}
    this.isRunning = false;
  }
}

/**
 * Procedural Puja Acoustic Synthesizer
 * Provides rich Bengali acoustic instruments (Dhak drums, Shankha conch shell, Kashor bell, Sanai melody)
 * as an instant, zero-dependency offline acoustic experience.
 */
export class ProceduralPujaSynth {
  private static synthInterval: number | null = null;
  private static isPlaying: boolean = false;
  private static currentPreset: string = 'conch-drone';
  private static masterGain: GainNode | null = null;

  public static start(preset: string = 'conch-drone', volume: number = 0.6) {
    this.stop();
    const ctx = AudioContextManager.getContext();
    if (!ctx) return;
    this.isPlaying = true;
    this.currentPreset = preset;

    try {
      const master = ctx.createGain();
      master.gain.setValueAtTime(volume, ctx.currentTime);
      master.connect(AudioContextManager.getMasterDestination());
      this.masterGain = master;

      // Trigger initial signature sound
      this.playSignatureIntro(preset);

      // Set up rhythmic or atmospheric loop based on preset
      let beat = 0;
      const tempoMs = preset === 'dhunuchi-fast' ? 240 : preset === 'sandhi-aarti' ? 280 : 360;

      this.synthInterval = window.setInterval(() => {
        if (!this.isPlaying) return;
        beat++;

        try {
          if (preset === 'conch-drone') {
            // Mahalaya: periodic holy conch shell trill and subtle tanpura drone
            if (beat % 24 === 1) this.playConchShell(3.2);
            if (beat % 4 === 1) this.playTanpuraPluck(130.81); // C3
            if (beat % 4 === 3) this.playTanpuraPluck(196.00); // G3
          } else if (preset === 'bodhon-flute') {
            // Shashthi: gentle dhak bol (dha-khi-tak-dha) + bell
            const step = beat % 8;
            if (step === 0 || step === 4) this.playDhakBass();
            if (step === 2 || step === 3 || step === 6) this.playDhakRim();
            if (step === 0) this.playKashorChime(880);
          } else if (preset === 'saptami-dhak') {
            // Saptami: lively festive Dhaak
            const step = beat % 8;
            if (step === 0 || step === 3 || step === 6) this.playDhakBass();
            if (step === 1 || step === 2 || step === 4 || step === 5 || step === 7) this.playDhakRim();
            if (step === 0 || step === 4) this.playKashorChime(1174);
          } else if (preset === 'sandhi-aarti') {
            // Ashtami Sandhi: 108 lamps, intense rolling dhak and conch
            const step = beat % 16;
            if (step % 2 === 0) this.playDhakBass();
            this.playDhakRim();
            if (step === 0) this.playKashorChime(987);
            if (step === 8) this.playKashorChime(1318);
            if (beat % 32 === 1) this.playConchShell(2.8);
          } else if (preset === 'dhunuchi-fast') {
            // Nabami: ecstatic feverish Dhunuchi dance
            const step = beat % 6;
            if (step === 0 || step === 3) this.playDhakBass();
            this.playDhakRim();
            if (step === 0) this.playKashorChime(1046);
            if (beat % 20 === 1) this.playConchShell(2.2);
          } else if (preset === 'sindoor-boron') {
            // Dashami: celebratory yet bittersweet rhythm
            const step = beat % 8;
            if (step === 0 || step === 4) this.playDhakBass();
            if (step % 2 === 1) this.playDhakRim();
            if (step === 0) this.playKashorChime(784);
          } else if (preset === 'bijoya-sanai') {
            // Bijoya: haunting Shehnai notes in Bhairavi
            const step = beat % 12;
            if (step === 0) this.playShehnaiNote(440, 1.2);
            if (step === 4) this.playShehnaiNote(466.16, 1.0);
            if (step === 8) this.playShehnaiNote(392, 1.4);
            if (step % 4 === 0) this.playKashorChime(659);
          }
        } catch {}
      }, tempoMs);
    } catch {}
  }

  private static playSignatureIntro(preset: string) {
    try {
      if (preset === 'conch-drone' || preset === 'sandhi-aarti') {
        this.playConchShell(3.5);
      } else if (preset === 'bijoya-sanai') {
        this.playShehnaiNote(440, 2.0);
      } else {
        this.playDhakBass();
        setTimeout(() => this.playDhakRim(), 120);
        setTimeout(() => this.playKashorChime(1174), 220);
      }
    } catch {}
  }

  public static playConchShell(durationSec: number = 3.0) {
    try {
      const ctx = AudioContextManager.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const subOsc = ctx.createOscillator();

      // Fundamental frequency of Bengal Shankha ~ 440–520 Hz with natural breath swell
      const baseFreq = 466.16; // Bb4
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      subOsc.type = 'sine';

      // Pitch envelope: gentle scoop up, stable tone with micro-vibrato, tapering off
      osc1.frequency.setValueAtTime(baseFreq * 0.92, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.4);
      osc1.frequency.setTargetAtTime(baseFreq * 1.01, now + durationSec * 0.6, 0.2);

      osc2.frequency.setValueAtTime(baseFreq * 0.92 * 2, now);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.4);

      subOsc.frequency.setValueAtTime(baseFreq * 0.5, now);

      // Low pass to simulate bone/shell acoustic cavity
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(3.5, now);

      // Breath amplitude envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.6);
      gain.gain.setValueAtTime(0.26, now + durationSec * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc1.connect(filter);
      osc2.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc1.start(now);
      osc2.start(now);
      subOsc.start(now);

      osc1.stop(now + durationSec + 0.1);
      osc2.stop(now + durationSec + 0.1);
      subOsc.stop(now + durationSec + 0.1);
    } catch {}
  }

  public static playDhakBass() {
    try {
      const ctx = AudioContextManager.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy goat-skin barrel drum low punch (Dhak Dhung)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.18);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  public static playDhakRim() {
    try {
      const ctx = AudioContextManager.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Bamboo stick sharp slap on tight parchment rim (Taak / Dhi)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.06);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  public static playDhakRoll() {
    try {
      this.playDhakBass();
      setTimeout(() => this.playDhakRim(), 110);
      setTimeout(() => this.playDhakRim(), 220);
      setTimeout(() => {
        this.playDhakBass();
        this.playKashorChime(1174);
      }, 330);
      setTimeout(() => this.playDhakRim(), 440);
      setTimeout(() => {
        this.playDhakBass();
        this.playKashorChime(1318);
      }, 550);
    } catch {}
  }

  public static playKashorChime(freq: number = 1046) {
    try {
      const ctx = AudioContextManager.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Metallic brass plate (Kashor) strike with bell overtones
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const overtone = ctx.createOscillator();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2.76, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.65);
      overtone.stop(now + 0.65);
    } catch {}
  }

  public static playTanpuraPluck(freq: number) {
    try {
      const ctx = AudioContextManager.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start(now);
      osc.stop(now + 1.45);
    } catch {}
  }

  public static playShehnaiNote(freq: number, duration: number = 1.0) {
    try {
      const ctx = AudioContextManager.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 0.98, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.15);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.8, now);
      filter.Q.setValueAtTime(4.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {}
  }

  public static setVolume(vol: number) {
    if (this.masterGain && this.isPlaying) {
      try {
        const ctx = AudioContextManager.getContext();
        if (ctx) {
          this.masterGain.gain.setTargetAtTime(vol, ctx.currentTime, 0.05);
        }
      } catch {}
    }
  }

  public static stop() {
    this.isPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
  }
}
