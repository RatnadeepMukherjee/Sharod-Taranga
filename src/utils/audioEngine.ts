// Web Audio API Synthesizer Engine for Vintage Bengali Durga Puja Radio

export interface StationData {
  id: string;
  name: string;
  bengaliName: string;
  frequency: number; // in MHz (e.g. 92.4)
  description: string;
  bengaliDesc: string;
  ritual: string;
  significance: string;
  soundscapeType: 'mahalaya' | 'shashthi' | 'saptami' | 'ashtami' | 'nabami' | 'dashami';
  dhakPattern: 'slow' | 'bodhon' | 'aarti' | 'sandhi' | 'dhunuchi' | 'bisarjan';
  tempo: number;
}

export const PUJA_STATIONS: StationData[] = [
  {
    id: 'mahalaya',
    name: 'Mahalaya Dawn',
    bengaliName: 'মহালয়া ভোর',
    frequency: 88.0,
    description: 'The auspicious dawn invitation. Sacred chanting, conch shells blowing, and the nostalgic crackle of early 4:00 AM radio broadcasts.',
    bengaliDesc: 'আশ্বিনের শারদপ্রাতে জেগে ওঠা পুজো আসার বার্তা ও শঙ্খধ্বনি',
    ritual: 'Tarpan & Invocation of Devi Durga (মহিষাসুরমর্দিনী)',
    significance: 'Marking the beginning of Devi Paksha and invoking the Goddess to Earth.',
    soundscapeType: 'mahalaya',
    dhakPattern: 'slow',
    tempo: 72,
  },
  {
    id: 'shashthi',
    name: 'Maha Shashthi',
    bengaliName: 'মহা ষষ্ঠী',
    frequency: 92.4,
    description: 'Bodhon & Amontron. The opening of Devi eyes (Chokhudan), welcoming Maa Durga into the pandal with soft auspicious dhak beats.',
    bengaliDesc: 'বোধনে দেবীর আবাহন ও আগমনী সুরের কলতান',
    ritual: 'Bodhon, Amontron & Adhibas',
    significance: 'Unveiling the face of the deity and awakening the cosmic motherly force.',
    soundscapeType: 'shashthi',
    dhakPattern: 'bodhon',
    tempo: 84,
  },
  {
    id: 'saptami',
    name: 'Maha Saptami',
    bengaliName: 'মহা সপ্তমী',
    frequency: 96.8,
    description: 'Nabapatrika Snan. Kola Bou bathed at dawn at the sacred river ghat, accompanied by joyous dhak beats and morning aarti bells.',
    bengaliDesc: 'নবপত্রিকা স্নান ও কলাবউ বরণ, শারদ সকালের উলুধ্বনি',
    ritual: 'Nabapatrika Snan & Prana Pratishtha',
    significance: 'Nine plants representing the nine forms of Durga bathed in holy water.',
    soundscapeType: 'saptami',
    dhakPattern: 'aarti',
    tempo: 96,
  },
  {
    id: 'ashtami',
    name: 'Maha Ashtami',
    bengaliName: 'মহা অষ্টমী',
    frequency: 100.2,
    description: 'Pushpanjali and Sandhi Puja. The rhythmic fury of 108 lotus offerings, 108 earthen lamps (diyas), and thunderous dhak rolls.',
    bengaliDesc: 'সন্ধিপূজার ১০৮ প্রদীপ, অঞ্জলি ও উদাত্ত ঢাকের বোল',
    ritual: 'Kumari Puja & Sandhi Puja (Conjunction of Ashtami & Nabami)',
    significance: 'The moment Devi Durga transformed into Chamunda to vanquish Chanda and Munda.',
    soundscapeType: 'ashtami',
    dhakPattern: 'sandhi',
    tempo: 120,
  },
  {
    id: 'nabami',
    name: 'Maha Nabami',
    bengaliName: 'মহা নবমী',
    frequency: 104.6,
    description: 'Dhunuchi Naach and Maha Aarti. Fragrant smoke of dhuno coconut husks in clay pots, swirling dancers to ecstatic percussion.',
    bengaliDesc: 'ধুনুচি নাচ, সুবাসিত ধুনোর ধোঁয়া আর প্রাণবন্ত উৎসবের উল্লাস',
    ritual: 'Maha Aarti, Dhunuchi Naach & Hom / Yajna',
    significance: 'Celebration of the final victory of good over evil before the farewell.',
    soundscapeType: 'nabami',
    dhakPattern: 'dhunuchi',
    tempo: 128,
  },
  {
    id: 'dashami',
    name: 'Bijoya Dashami',
    bengaliName: 'বিজয়া দশমী',
    frequency: 107.9,
    description: 'Sindoor Khela & Bisarjan. Tearful and sweet farewell to the Mother, vermilion celebrations, and exchanging "Shubho Bijoya" love.',
    bengaliDesc: 'সিঁদুর খেলা, মায়ের বিদায় ও শুভ বিজয়ার আন্তরিক প্রীতি',
    ritual: 'Sindoor Khela, Aparajita Puja & Visarjan',
    significance: 'Devi Durga returns to Mount Kailash, leaving blessings of peace and harmony.',
    soundscapeType: 'dashami',
    dhakPattern: 'bisarjan',
    tempo: 80,
  },
];

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private isPoweredOn: boolean = false;
  private masterGain: GainNode | null = null;
  private staticGain: GainNode | null = null;
  private whistleGain: GainNode | null = null;
  private melodyGain: GainNode | null = null;
  private dhakGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private highpassFilter: BiquadFilterNode | null = null;

  // Nodes for continuous noise / static
  private staticSource: AudioBufferSourceNode | null = null;
  private whistleOsc1: OscillatorNode | null = null;
  private whistleOsc2: OscillatorNode | null = null;

  // Rhythms / sequencer timer
  private dhakInterval: number | null = null;
  private melodyInterval: number | null = null;
  private dhakStep: number = 0;
  private melodyStep: number = 0;

  // State parameters
  private currentFrequency: number = 92.4;
  private volume: number = 0.75;
  private bassAmount: number = 0.6;
  private trebleAmount: number = 0.5;
  private isDhakEnabled: boolean = true;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    // Warm tube filters
    this.lowpassFilter = this.ctx.createBiquadFilter();
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.setValueAtTime(4500, this.ctx.currentTime);

    this.highpassFilter = this.ctx.createBiquadFilter();
    this.highpassFilter.type = 'highpass';
    this.highpassFilter.frequency.setValueAtTime(110, this.ctx.currentTime);

    // Sub-buses
    this.staticGain = this.ctx.createGain();
    this.staticGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.whistleGain = this.ctx.createGain();
    this.whistleGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.melodyGain = this.ctx.createGain();
    this.melodyGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    this.dhakGain = this.ctx.createGain();
    this.dhakGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // Connect buses
    this.staticGain.connect(this.highpassFilter);
    this.whistleGain.connect(this.highpassFilter);
    this.melodyGain.connect(this.highpassFilter);
    this.dhakGain.connect(this.highpassFilter);

    this.highpassFilter.connect(this.lowpassFilter);
    this.lowpassFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.startRadioStaticLoop();
    this.startHeterodyneWhistle();
  }

  public setPower(on: boolean) {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPoweredOn = on;
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    if (on) {
      // Play a vintage power-on click and subtle warm-up surge
      this.playSwitchClick(true);
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(this.volume, now + 0.35);

      this.updateTuningAudio();
      this.startSequencers();
    } else {
      this.playSwitchClick(false);
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.15);
      this.stopSequencers();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.isPoweredOn && this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.volume, now, 0.05);
    }
  }

  public setBass(val: number) {
    this.bassAmount = Math.max(0, Math.min(1, val));
    if (this.ctx && this.highpassFilter) {
      // Highpass frequency lowers with higher bass, giving warm low-end thud
      const hpFreq = 50 + (1 - this.bassAmount) * 200;
      this.highpassFilter.frequency.setTargetAtTime(hpFreq, this.ctx.currentTime, 0.05);
    }
  }

  public setTreble(val: number) {
    this.trebleAmount = Math.max(0, Math.min(1, val));
    if (this.ctx && this.lowpassFilter) {
      const lpFreq = 1800 + this.trebleAmount * 5500;
      this.lowpassFilter.frequency.setTargetAtTime(lpFreq, this.ctx.currentTime, 0.05);
    }
  }

  public toggleDhak(enabled?: boolean) {
    this.isDhakEnabled = enabled !== undefined ? enabled : !this.isDhakEnabled;
    if (this.dhakGain && this.ctx) {
      const target = this.isDhakEnabled ? 0.35 : 0;
      this.dhakGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isDhakEnabled;
  }

  public setFrequency(freq: number) {
    this.currentFrequency = freq;
    if (this.isPoweredOn) {
      this.updateTuningAudio();
    }
  }

  // Find nearest station and tuning error
  public getTuningStatus() {
    let nearest: StationData = PUJA_STATIONS[0];
    let minDiff = 999;
    for (const station of PUJA_STATIONS) {
      const diff = Math.abs(this.currentFrequency - station.frequency);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = station;
      }
    }
    // Clarity is 1.0 when exact, drops to 0 when > 1.2 MHz away
    const clarity = Math.max(0, 1 - minDiff / 1.2);
    return { station: nearest, diff: minDiff, clarity };
  }

  private updateTuningAudio() {
    if (!this.ctx || !this.staticGain || !this.whistleGain || !this.melodyGain) return;
    const { clarity, diff } = this.getTuningStatus();
    const now = this.ctx.currentTime;

    // Static increases as radio drifts away from station
    const staticLevel = 0.02 + (1 - clarity) * 0.15;
    this.staticGain.gain.setTargetAtTime(staticLevel, now, 0.04);

    // Whistle heterodyne effect when close to frequency but not quite centered
    if (diff > 0.08 && diff < 1.0) {
      const whistleLevel = (1 - diff / 1.0) * 0.08;
      this.whistleGain.gain.setTargetAtTime(whistleLevel, now, 0.03);
      if (this.whistleOsc1 && this.whistleOsc2) {
        const pitch = 300 + diff * 1400;
        this.whistleOsc1.frequency.setTargetAtTime(pitch, now, 0.04);
        this.whistleOsc2.frequency.setTargetAtTime(pitch * 1.5, now, 0.04);
      }
    } else {
      this.whistleGain.gain.setTargetAtTime(0, now, 0.03);
    }

    // Melodic music signal is clearer with higher clarity
    const musicLevel = clarity * 0.28;
    this.melodyGain.gain.setTargetAtTime(musicLevel, now, 0.05);

    // Dhak volume also tracks clarity
    if (this.dhakGain) {
      const dhakTarget = this.isDhakEnabled ? (0.08 + clarity * 0.32) : 0;
      this.dhakGain.gain.setTargetAtTime(dhakTarget, now, 0.05);
    }
  }

  // Vintage mechanical switch sound
  private playSwitchClick(turningOn: boolean) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = turningOn ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(turningOn ? 180 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Continuous synthesized static (crackling noise buffer)
  private startRadioStaticLoop() {
    if (!this.ctx || !this.staticGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pinkish noise filter
      output[i] = (lastOut * 0.7) + (white * 0.3);
      lastOut = output[i];
      // Occasional burst/crackle
      if (Math.random() < 0.001) {
        output[i] += (Math.random() - 0.5) * 1.5;
      }
    }

    this.staticSource = this.ctx.createBufferSource();
    this.staticSource.buffer = noiseBuffer;
    this.staticSource.loop = true;

    // Subtle bandpass for AM/FM radio sound
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.9, this.ctx.currentTime);

    this.staticSource.connect(bandpass);
    bandpass.connect(this.staticGain);
    this.staticSource.start();
  }

  // Heterodyne tuning whistle
  private startHeterodyneWhistle() {
    if (!this.ctx || !this.whistleGain) return;
    this.whistleOsc1 = this.ctx.createOscillator();
    this.whistleOsc2 = this.ctx.createOscillator();

    this.whistleOsc1.type = 'sine';
    this.whistleOsc2.type = 'triangle';

    this.whistleOsc1.frequency.setValueAtTime(650, this.ctx.currentTime);
    this.whistleOsc2.frequency.setValueAtTime(980, this.ctx.currentTime);

    this.whistleOsc1.connect(this.whistleGain);
    this.whistleOsc2.connect(this.whistleGain);

    this.whistleOsc1.start();
    this.whistleOsc2.start();
  }

  // Sequencers for Dhak and Melodic Raag Motifs
  private startSequencers() {
    this.stopSequencers();
    const intervalMs = 150; // master tick
    this.dhakInterval = window.setInterval(() => {
      this.tickDhak();
    }, intervalMs);

    this.melodyInterval = window.setInterval(() => {
      this.tickMelody();
    }, 450);
  }

  private stopSequencers() {
    if (this.dhakInterval !== null) {
      clearInterval(this.dhakInterval);
      this.dhakInterval = null;
    }
    if (this.melodyInterval !== null) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
  }

  // Real Dhak Drum Voice Synthesis:
  // Dhak has two heads: heavy resonant bass head ("Dhom") struck with thick cane,
  // and thin snappy treble rim/head ("Kiti-kiti-ta") struck with thin sticks!
  public triggerDhakDhom(timeOffset = 0, intensity = 0.8) {
    if (!this.ctx || !this.dhakGain || !this.isPoweredOn) return;
    const now = this.ctx.currentTime + timeOffset;

    // Resonant low drum oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Deep Bengali Dhak fundamental pitch sweep (135Hz -> 58Hz)
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(56, now + 0.18);

    gain.gain.setValueAtTime(0.7 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.dhakGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  public triggerDhakKiti(timeOffset = 0, pitch = 480, intensity = 0.6) {
    if (!this.ctx || !this.dhakGain || !this.isPoweredOn) return;
    const now = this.ctx.currentTime + timeOffset;

    // Sharp stick crackle / cane slap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, now + 0.05);

    gain.gain.setValueAtTime(0.4 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.dhakGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public triggerKashorGhanta(timeOffset = 0) {
    if (!this.ctx || !this.dhakGain || !this.isPoweredOn) return;
    const now = this.ctx.currentTime + timeOffset;

    // Traditional brass bell / plate struck in puja rituals
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(1860, now);
    osc2.frequency.setValueAtTime(2440, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.dhakGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.65);
    osc2.stop(now + 0.65);
  }

  // Conch shell (Shankha) sacred blow
  public triggerShankha() {
    if (!this.ctx || !this.isPoweredOn) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    // Natural conch blowing fundamental with subtle vibrato
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.linearRampToValueAtTime(328, now + 0.4);
    osc.frequency.linearRampToValueAtTime(322, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(295, now + 1.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.5);
    filter.frequency.linearRampToValueAtTime(700, now + 1.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
    gain.gain.linearRampToValueAtTime(0.28, now + 1.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

    osc.connect(filter);
    filter.connect(gain);
    if (this.melodyGain) gain.connect(this.melodyGain);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  // Sequenced Dhak rhythm step
  private tickDhak() {
    if (!this.isDhakEnabled || !this.isPoweredOn) return;
    const { station } = this.getTuningStatus();
    this.dhakStep = (this.dhakStep + 1) % 16;

    // Pattern variations according to Puja Day
    if (station.dhakPattern === 'sandhi' || station.dhakPattern === 'dhunuchi') {
      // Fast, celebratory 16-step polyrhythm
      if (this.dhakStep === 0 || this.dhakStep === 6 || this.dhakStep === 10) {
        this.triggerDhakDhom(0, 0.9);
      }
      if ([2, 3, 5, 8, 9, 12, 13, 14, 15].includes(this.dhakStep)) {
        this.triggerDhakKiti(0, 520 + (this.dhakStep % 3) * 60, 0.7);
      }
      if (this.dhakStep % 4 === 0) {
        this.triggerKashorGhanta(0);
      }
    } else if (station.dhakPattern === 'aarti') {
      // Classic Durga Puja Aarti rhythmic cycle (Dha Kiti Ta, Dha Dha Kiti Ta)
      if (this.dhakStep === 0 || this.dhakStep === 4 || this.dhakStep === 8) {
        this.triggerDhakDhom(0, 0.85);
      }
      if ([2, 3, 6, 7, 10, 11, 14, 15].includes(this.dhakStep)) {
        this.triggerDhakKiti(0, 490, 0.6);
      }
      if (this.dhakStep === 0 || this.dhakStep === 8) {
        this.triggerKashorGhanta(0);
      }
    } else {
      // Bodhon / Slow sacred majestic pulse
      if (this.dhakStep === 0 || this.dhakStep === 8) {
        this.triggerDhakDhom(0, 0.9);
      }
      if (this.dhakStep === 4 || this.dhakStep === 12) {
        this.triggerDhakKiti(0, 460, 0.5);
      }
      if (this.dhakStep === 0) {
        this.triggerKashorGhanta(0);
      }
    }
  }

  // Raag Bhairavi & Agomoni melodious vintage radio broadcast tones
  private tickMelody() {
    if (!this.ctx || !this.melodyGain || !this.isPoweredOn) return;
    const { clarity, station } = this.getTuningStatus();
    if (clarity < 0.25) return;

    this.melodyStep = (this.melodyStep + 1) % 16;

    // Classic Raag Bhairavi / Agomoni scale notes (Sa, Re Komal, Ga Komal, Ma, Pa, Dha Komal, Ni Komal, Sa')
    // e.g. base frequency C4 = 261.63Hz
    const scale = [
      261.63, // Sa
      277.18, // Komal Re
      311.13, // Komal Ga
      349.23, // Ma
      392.00, // Pa
      415.30, // Komal Dha
      466.16, // Komal Ni
      523.25, // High Sa
    ];

    let noteIdx = 0;
    if (station.id === 'mahalaya') {
      // Nostalgic rising chant pattern of "Jago Tumi Jago"
      const mahalayaMelody = [0, 2, 4, 3, 4, 5, 4, 2, 0, 1, 0, 4, 5, 7, 5, 4];
      noteIdx = mahalayaMelody[this.melodyStep];
    } else if (station.id === 'ashtami') {
      const ashtamiMelody = [4, 5, 7, 5, 4, 3, 2, 4, 0, 2, 4, 5, 4, 2, 1, 0];
      noteIdx = ashtamiMelody[this.melodyStep];
    } else {
      const generalAgomoni = [0, 1, 2, 3, 4, 2, 1, 0, 4, 5, 4, 3, 2, 1, 0, 0];
      noteIdx = generalAgomoni[this.melodyStep];
    }

    const noteFreq = scale[noteIdx] || 261.63;
    const now = this.ctx.currentTime;

    // Vintage harmonium / flute reed synth
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(noteFreq, now);

    // Warm radio bandpass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12 * clarity, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.melodyGain);

    osc.start(now);
    osc.stop(now + 0.44);
  }
}

export const audioEngine = new RadioAudioEngine();
