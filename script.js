/**
 * AGOMONI BETAR • DEVI PAKSHA MINIMALIST REDESIGN
 * Plain JavaScript — No inline scripts, robust audio synthesis, smooth transitions
 */

// ==========================================================================
// 6-DAY SACRED PUJA BROADCAST STATIONS (Mahalaya, Shasthi, Saptami, Ashtami, Nabami, Dashami)
// ==========================================================================
// ==========================================================================
// INTRO VIDEO
// ==========================================================================
(function introVideo() {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const video = document.getElementById('intro-video');
  const startBtn = document.getElementById('intro-start');
  const skipBtn = document.getElementById('intro-skip');

  // 1. Video files (add portrait/landscape versions in /videos/). Falls back to a single file.
 const SRC = {
  portrait:  '/videos/landing-portrait.mp4',
  landscape: '/videos/landing-landscape.mp4',
  fallback:  '/videos/landing-landscape.mp4',   // used if the chosen file fails to load
};
  // poster that matches the screen shape (fixes the cropped title on phones)
  video.poster = window.innerHeight > window.innerWidth
    ? '/images/poster-portrait.jpg'
    : '/images/durga_sharod_taranga_1791114431998.jpg';

  // ---- loader: real buffering progress + a time-based creep so it never sticks ----
  startBtn.disabled = true;
  const ring = document.getElementById('ld-progress');
  const pctEl = document.getElementById('ld-pct');
  const bnEl = document.getElementById('ld-bn');
  const enEl = document.getElementById('ld-en');
  const CIRC = 402.12, MIN_MS = 2200, MAX_MS = 7000, t0 = performance.now();
  const STATUS = ['Tuning the valves', 'Finding the frequency', 'Lighting the diyas', 'Almost there'];
  let real = 0, shown = 0, ready = false;

  const bufPct = () => {
    try { return video.duration && video.buffered.length
      ? Math.min(1, video.buffered.end(video.buffered.length - 1) / video.duration) : 0; } catch { return 0; }
  };
  ['progress', 'loadedmetadata', 'loadeddata', 'canplay'].forEach((e) => video.addEventListener(e, () => { real = Math.max(real, bufPct()); }));
  video.addEventListener('canplaythrough', () => { real = 1; });

  function setReady() {
    if (ready) return; ready = true;
    if (ring) ring.style.strokeDashoffset = 0;
    startBtn.disabled = false;
    startBtn.classList.remove('is-loading'); startBtn.classList.add('is-ready');
    setTimeout(() => window.__introBegin && window.__introBegin(), 600);
  }
  (function tick() {
    if (ready) return;
    const el = performance.now() - t0;
    let goal = real >= 1 ? 1 : Math.max(real, Math.min(0.9, el / MAX_MS));
    goal = Math.min(goal, el / MIN_MS);
    shown += (goal - shown) * 0.1;
    if (ring) ring.style.strokeDashoffset = CIRC * (1 - shown);
    if (pctEl) pctEl.textContent = Math.round(shown * 100);
    if (enEl) enEl.textContent = STATUS[Math.min(3, Math.floor(shown * 4))];
    if ((real >= 1 && shown > 0.985) || el > MAX_MS) { setReady(); return; }
    requestAnimationFrame(tick);
  })();
  const SHOW_ONCE_PER_SESSION = false;   // true = skip on repeat visits in the same tab

  try { if (SHOW_ONCE_PER_SESSION && sessionStorage.getItem('st_intro_seen')) { intro.classList.add('is-gone'); return; } } catch {}

  document.body.classList.add('intro-lock');
    if (skipBtn) skipBtn.hidden = false;

  function pickSrc() {
    return window.innerHeight > window.innerWidth ? SRC.portrait : SRC.landscape;
  }
  video.src = pickSrc();
  video.addEventListener('error', () => {
    if (!video.src.endsWith(SRC.fallback)) { video.src = SRC.fallback; video.load(); }
    else finish();   // no video found, go straight to the site
  }, { once: false });

// 2. Start playback (auto when ready, or on tap)
let started = false;
const soundBtn = document.getElementById('intro-sound');
async function begin() {
  if (started) return;
  started = true;
  startBtn.classList.add('is-hidden');
  video.muted = false;
  video.volume = 1;
  try {
    await video.play();                 // with sound (works if the browser allows it)
  } catch {
    video.muted = true;                 // blocked → autoplay muted
    try { await video.play(); } catch { started = false; startBtn.classList.remove('is-hidden'); return; }
    if (soundBtn) soundBtn.hidden = false;
    const unmute = () => {
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
      if (soundBtn) soundBtn.hidden = true;
      ['click', 'touchend', 'keydown'].forEach(ev => window.removeEventListener(ev, unmute, true));
    };
    ['click', 'touchend', 'keydown'].forEach(ev => window.addEventListener(ev, unmute, true));
  }
  if (skipBtn) skipBtn.hidden = false;
}
startBtn.addEventListener('click', begin);
window.__introBegin = begin;            // so the loader can call it

  // 3. End -> fade out -> landing page
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    try { sessionStorage.setItem('st_intro_seen', '1'); } catch {}
    // fade the audio out smoothly while the screen fades
    const fade = setInterval(() => {
      video.volume = Math.max(0, video.volume - 0.1);
      if (video.volume <= 0) { clearInterval(fade); video.pause(); }
    }, 100);
    intro.classList.add('is-leaving');
    document.body.classList.remove('intro-lock');
    setTimeout(() => { intro.classList.add('is-gone'); video.removeAttribute('src'); video.load(); }, 1300);
  }
  video.addEventListener('ended', finish);
  if (skipBtn) skipBtn.addEventListener('click', finish);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !intro.classList.contains('is-gone')) finish(); });

  // 4. If the phone is rotated before playback starts, switch to the right file
  window.addEventListener('resize', () => {
    if (video.paused && !done && video.currentTime === 0) {
      const next = pickSrc();
      if (!video.src.endsWith(next)) { video.src = next; }
    }
  });
})();

const PUJA_DAYS = [
  {
    id: 'mahalaya',
    nameBn: 'মহালয়া',
    nameEn: 'Mahalaya',
    shortEn: 'Maha',
    frequencyPercent: 0,
    bgImage: '/images/mahalaya_dawn_ghat_1790532860844.jpg',
    trackTitleBn: 'মহিষাসুরমর্দিনী • চণ্ডীপাঠ ও স্তোত্র',
    trackTitleEn: 'Mahishasuramardini • Chandi Path',
    artistBn: 'বীরেন্দ্রকৃষ্ণ ভদ্র ও পঙ্কজ মল্লিক',
    artistEn: 'Birendra Krishna Bhadra & Pankaj Mullick',
    preset: 'flute'
  },
  {
    id: 'shashthi',
    nameBn: 'ষষ্ঠী',
    nameEn: 'Shasthi',
    shortEn: 'Shas',
    frequencyPercent: 20,
    bgImage: '/images/shashthi_rajbari_courtyard_1790532879160.jpg',
    trackTitleBn: 'বাজল তোমার আলোর বেণু',
    trackTitleEn: 'Bajlo Tomar Alor Benu',
    artistBn: 'সুপ্রীতি ঘোষ ও দ্বিজেন মুখোপাধ্যায়',
    artistEn: 'Supriti Ghosh & Dwijen Mukherjee',
    preset: 'flute'
  },
  {
    id: 'saptami',
    nameBn: 'সপ্তমী',
    nameEn: 'Saptami',
    shortEn: 'Sapt',
    frequencyPercent: 40,
    bgImage: '/images/bengali_puja_dawn_1790530679559.jpg',
    trackTitleBn: 'নবপত্রিকা স্নান • রাগ ভৈরবী',
    trackTitleEn: 'Nabapatrika Snan • Raga Bhairavi',
    artistBn: 'আকাশবাণী সমবেত বাদ্যবৃন্দ',
    artistEn: 'Akashvani Calcutta Orchestra',
    preset: 'shehnai'
  },
  {
    id: 'ashtami',
    nameBn: 'অষ্টমী',
    nameEn: 'Ashtami',
    shortEn: 'Asht',
    frequencyPercent: 60,
    bgImage: '/images/ashtami_sandhi_puja_1790532891664.jpg',
    trackTitleBn: 'সন্ধিপূজা ১০৮ প্রদীপ আরতি',
    trackTitleEn: 'Sandhi Puja 108 Deepam Arati',
    artistBn: 'কাশী বোস লেন ঢাক ও কাঁসি বাদকদল',
    artistEn: 'North Calcutta Dhak & Bells',
    preset: 'dhak-bells'
  },
  {
    id: 'nabami',
    nameBn: 'নবমী',
    nameEn: 'Nabami',
    shortEn: 'Naba',
    frequencyPercent: 80,
    bgImage: '/images/sandhi_puja_evening_1790531555702.jpg',
    trackTitleBn: 'ধুনুচি নাচের কাঠি ও উলুধ্বনি',
    trackTitleEn: 'Dhunuchi Dance Rhythms',
    artistBn: 'বাগবাজার সর্বজনীন ঢাক সম্প্রদায়',
    artistEn: 'Baghbazar Sarbojanin Dhaki Troupe',
    preset: 'dhak-bells'
  },
  {
    id: 'dashami',
    nameBn: 'দশমী',
    nameEn: 'Dashami',
    shortEn: 'Dash',
    frequencyPercent: 100,
    bgImage: '/images/dashami_bisarjan_ghat_1790532907517.jpg',
    trackTitleBn: 'বিসর্জন সানাই সুর • ভৈরবী',
    trackTitleEn: 'Bisarjan Shehnai • Bhairavi',
    artistBn: 'উস্তাদ বিসমিল্লাহ খান স্মৃতি বাদন',
    artistEn: 'Ustad Bismillah Khan Legacy',
    preset: 'bisarjan'
  }
];

// ==========================================================================
// YOUTUBE PLAYLISTS: 1. SHAROD TARANGA, 2. MAHALAYA, 3. PUJO DAYS, 4. DHAK
// ==========================================================================
const PLAYLISTS = {
  mahalaya: {
    key: 'mahalaya',
    titleBn: 'মহালয়া • চণ্ডীপাঠ ও আগমনী গান',
    titleEn: 'Mahalaya • Chandi Path & Agomoni Songs',
    tagBn: 'মহালয়া',
    tagEn: 'Mahalaya',
    tracks: [
      {
        id: 'mah-1',
        src: '/audio/chandi-path.mp3',   // LOCAL FILE (put it in public/audio/). Only this track uses a file.
        titleBn: 'মহিষাসুরমর্দিনী (মূল চণ্ডীপাঠ ও স্তোত্র)',
        titleEn: 'Mahishasuramardini (Original Chandi Path)',
        artistBn: 'বীরেন্দ্রকৃষ্ণ ভদ্র ও পঙ্কজ মল্লিক',
        artistEn: 'Birendra Krishna Bhadra & Pankaj Mullick',
        duration: '1:29:18'
      },
      {
        id: 'mah-2',
        src: '/audio/Jago Durga Dashapraharanadharinee.mp3',
        titleBn: 'জাগো তুমি জাগো',
        titleEn: 'Jaago Tumi Jaago',
        artistBn: 'দ্বিজেন মুখোপাধ্যায়',
        artistEn: 'Dwijen Mukherjee',
        duration: '1:48'
      },
      {
        id: 'mah-3',
        src: '/audio/Bajlo Tomar Aalor Benu.mp3',
        titleBn: 'বাজল তোমার আলোর বেণু',
        titleEn: 'Bajlo Tomar Alor Benu',
        artistBn: 'শিপ্রা বসু',
        artistEn: 'Sipra Basu',
        duration: '3:24'
      },
      {
        id: 'mah-4',
        src: '/audio/Tabo Achintya RupaCharita Mahima.mp3',
        titleBn: 'তব অচিন্ত্য রূপচরিত মহিমা',
        titleEn: 'Tabo Achintya Rupacharita Mahima',
        artistBn: 'পঙ্কজ মল্লিক',
        artistEn: 'Pankaj Mullick',
        duration: '3:59'
      },
      {
        id: 'mah-5',
        src: '/audio/Ogo Amar Agamani Alo.mp3',
        titleBn: 'ওগো আমার আগমনী',
        titleEn: 'Ogo Amar Agomoni',
        artistBn: 'শিপ্রা বসু',
        artistEn: 'Sipra Basu',
        duration: '3:20'
      },
      {
        id: 'mah-6',
        src: '/audio/Rupang Dehi Jayang Dehi Stotra.mp3',
        titleBn: 'রূপং দেহি জয়ং দেহি • স্তোত্রপাঠ',
        titleEn: 'Rupang Dehi Jayang Dehi Stotra',
        artistBn: 'আকাশবাণী সমবেত শিল্পী দল',
        artistEn: 'Akashvani Classical Chorus',
        duration: '4:40'
      },
       {
        id: 'mah-7',
        src: '/audio/Ya Chandi.mp3',
        titleBn: 'য়া চণ্ডী',
        titleEn: 'Ya Chandi',
        artistBn: 'আকাশবাণী সমবেত শিল্পী দল',
        artistEn: 'Akashvani Classical Chorus',
        duration: '4:40'
      },
       {
        id: 'mah-8',
        src: '/audio/Jaya Jaya Japyajaye.mp3',
        titleBn: 'জয় জয় জপ্যজয়',
        titleEn: 'Jaya Jaya Japyajaye',
        artistBn: 'আকাশবাণী সমবেত শিল্পী দল',
        artistEn: 'Akashvani Classical Chorus',
        duration: '2:49'
      },
       {
        id: 'mah-9',
        src: '/audio/Simhasta Sashishekhara.mp3',
        titleBn: 'সিংহস্থা শশিশেখরা ',
        titleEn: 'Simhasta Sashishekhara',
        artistBn: 'আকাশবাণী সমবেত শিল্পী দল',
        artistEn: 'Akashvani Classical Chorus',
        duration: '0:55'
      },
       {
        id: 'mah-10',
        src: '/audio/Aham Rudrebhirvasubhischara.mp3',
        titleBn: 'অহম রুদ্রভীরবসুভিশ্চরা',
        titleEn: 'Aham Rudrebhirvasubhischara',
        artistBn: 'আকাশবাণী সমবেত শিল্পী দল',
        artistEn: 'Akashvani Classical Chorus',
        duration: '3:59'
      },
       {
        id: 'mah-11',
        src: '/audio/Akhila-Bimane Taba Jaya.mp3',
        titleBn: 'অখিল-বিমান তব জয়',
        titleEn: 'Akhila-Bimane Taba Jaya',
        artistBn: 'আকাশবাণী সমবেত শিল্পী দল',
        artistEn: 'Akashvani Classical Chorus',
        duration: '4:02'
      },
       {
        id: 'mah-12',
        src: '/audio/Jatajutasamayuktamardhendukrita-Sekharam.mp3',
        titleBn: 'জটাযুত সামযুক্তমর্ধেন্দুকৃত-শেখরম',
        titleEn: 'Jatajutasamayuktamardhendukrita-Sekharam',
        artistBn: 'আকাশবাণী সমবেত শিল্পী দল',
        artistEn: 'Akashvani Classical Chorus',
        duration: '4:27'
      },

    ]
  },
    pujoDays: {
    key: 'pujoDays',
    titleBn: 'পুজোর গান',
    titleEn: 'Pujo Songs',
    tagBn: 'পুজোর গান',
    tagEn: 'Pujo Songs',
    tracks: [
      {
        id: 'pujo-playlist',
        playlistId: 'PLMqKtTPxSl7k',   // the part after list= in the playlist link
        titleBn: 'পুজোর গান • প্লেলিস্ট',
        titleEn: 'Pujo Songs • Playlist',
        artistBn: 'শারদোৎসব',
        artistEn: 'Durga Puja',
        duration: '—'
      }
    ]
  },
      

  dhak: {
    key: 'dhak',
    titleBn: 'ঢাকের বাদ্যি (Dhak Beats)',
    titleEn: 'Durga Puja Dhak Beats',
    tagBn: 'ঢাক',
    tagEn: 'Dhak',
    tracks: [
      { id: 'dhak-1', youtubeId: 'DZ21CSg22nc', titleBn: 'শারদোৎসবের খাঁটি ঢাকের বাদ্যি', titleEn: 'Durga Puja Authentic Dhak Beats',   artistBn: 'ঢাকী দল', artistEn: 'Dhaki Troupe', duration: '6:29'},
      { id: 'dhak-2', youtubeId: 'i1r8247faTY', titleBn: 'উন্মাতাল ধুনুচি নাচের দ্রুত ত্রিতাল ঢাক', titleEn: 'Ecstatic Fast Dhunuchi Naach Dhak',   artistBn: 'ঢাকী দল', artistEn: 'Dhaki Troupe', duration: '4:07'},
    ]
  },
};

// ==========================================================================
// STATE
// ==========================================================================
let currentDayIndex = 0;
let isPlaying = false;
let currentLanguage = 'bn'; // 'bn' | 'en'
let isDraggingDial = false;
let atmosphereActive = true;

let currentPlaylistKey = 'sharod'; // 'sharod' | 'mahalaya' | 'pujoDays' | 'dhak'
let currentTrackIndex = 0;
let lastMahalayaIndex = 0;   // 0 = Chandi Path; remembers the last Mahalaya song
let isDhakMode = false;
let isRadioPowered = true;
let activeDrawerTab = 'mahalaya';
let ytPlayer = null;
let ytReady = false;
let pendingTrackToPlay = null;

// Local audio file player (used only for tracks that have a `src`, e.g. the Mahalaya Chandi Path)
const localAudio = new Audio();
localAudio.preload = 'auto';
function isLocalTrack() {
  const t = PLAYLISTS[currentPlaylistKey]?.tracks[currentTrackIndex];
  return !!(t && t.src);
}
localAudio.addEventListener('ended', () => playNextTrack());
localAudio.addEventListener('playing', () => { audio.stopDayMusic(); setPlaybackState(true); setSignalMeter('full'); });
localAudio.addEventListener('pause', () => { if (!localAudio.ended && isLocalTrack()) setPlaybackState(false); });
localAudio.addEventListener('waiting', () => setSignalMeter('weak'));
localAudio.addEventListener('error', () => { if (isLocalTrack()) playNextTrack(); });  // missing file -> skip
let currentVolumeRatio = 0.7; // 70% default volume

// Preload Images
PUJA_DAYS.forEach((day) => {
  const img = new Image();
  img.src = day.bgImage;
});

// ==========================================================================
// PROCEDURAL WEB AUDIO SYNTHESIZER & SOUND EFFECTS
// ==========================================================================
class AgomoniAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.activeNodes = [];
    this.musicTimer = null;
    this.volume = 0.7;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    localAudio.volume = this.volume;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  getFrequencyData() {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // Brief, soft, analog tuning static burst (~180ms)
  playTuningStatic() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.45;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.18);
      filter.Q.value = 2.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.18);
    } catch {
      // Audio fallback silent
    }
  }

  // Festive Dhak drum roll (dha-khi-tak-dha)
  playDhak() {
    this.init();
    if (!this.ctx) return;
    const hits = [0, 0.12, 0.24, 0.38, 0.52, 0.68, 0.82];
    hits.forEach((t, i) => {
      const now = this.ctx.currentTime + t;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const isBass = i % 2 === 0;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isBass ? 110 : 220, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

      gain.gain.setValueAtTime(isBass ? 0.6 : 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  // Start continuous ambient musical movements for the tuned day
  startDayMusic(dayIndex) {
    this.stopDayMusic();
    if (!isPlaying) return;
    this.init();
    if (!this.ctx) return;

    const day = PUJA_DAYS[dayIndex];
    const baseFreqs = [130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94];
    const root = baseFreqs[dayIndex % baseFreqs.length];

    // Ambient Drone Layers (Tanpura & Harmonium warmth)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(root, this.ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(root * 1.5, this.ctx.currentTime); // Perfect fifth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.value = 1.8;

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();

    this.activeNodes.push(osc1, osc2, gain);

    // Dynamic procedural melodic movements
    const notes = [root, root * 1.125, root * 1.25, root * 1.333, root * 1.5, root * 1.667, root * 1.875];
    const playNote = () => {
      if (!isPlaying || !this.ctx) return;
      const noteOsc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const noteFilter = this.ctx.createBiquadFilter();

      const note = notes[Math.floor(Math.random() * notes.length)] * (Math.random() > 0.4 ? 2 : 1);
      const startTime = this.ctx.currentTime;
      const duration = 1.4 + Math.random() * 1.8;

      noteOsc.type = day.preset === 'flute' ? 'sine' : day.preset === 'shehnai' ? 'sawtooth' : 'triangle';
      noteOsc.frequency.setValueAtTime(note, startTime);
      noteOsc.frequency.linearRampToValueAtTime(note * (1 + (Math.random() * 0.03 - 0.015)), startTime + duration);

      noteFilter.type = 'bandpass';
      noteFilter.frequency.setValueAtTime(note * 1.2, startTime);
      noteFilter.Q.value = 3.0;

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.14, startTime + 0.3);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      noteOsc.connect(noteFilter);
      noteFilter.connect(noteGain);
      noteGain.connect(this.masterGain);

      noteOsc.start(startTime);
      noteOsc.stop(startTime + duration);

      const nextInterval = (1.5 + Math.random() * 2.2) * 1000;
      this.musicTimer = setTimeout(playNote, nextInterval);
    };

    this.musicTimer = setTimeout(playNote, 900);
  }

  stopDayMusic() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // Node cleanup safe
      }
    });
    this.activeNodes = [];
  }
}

const audio = new AgomoniAudioEngine();

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const bgLayer1 = document.getElementById('bg-layer-1');
const bgLayer2 = document.getElementById('bg-layer-2');
const heroDayName = document.getElementById('hero-day-name');
const landingTitleBlock = document.getElementById('landing-title-block');
const landingVintageTagline = document.getElementById('landing-vintage-tagline');
const radioTimeBadge = document.getElementById('radio-time-badge');
const btnHome = document.getElementById('btn-home');
const homeBtnLabel = document.getElementById('home-btn-label');
const btnInstructions = document.getElementById('btn-instructions');
const instructionBtnLabel = document.getElementById('instruction-btn-label');
const instructionsModal = document.getElementById('instructions-modal');
const instructionsBackdrop = document.getElementById('instructions-backdrop');
const btnCloseInstructions = document.getElementById('btn-close-instructions');
const instructionsBody = document.getElementById('instructions-body');

// Popup Instruction Note Elements
const popupInstructionNote = document.getElementById('popup-instruction-note');
const btnCloseNote = document.getElementById('btn-close-note');
const btnNoteDismiss = document.getElementById('btn-note-dismiss');
const btnNoteFullGuide = document.getElementById('btn-note-full-guide');
const noteTitle = document.getElementById('note-title');
const noteSubtitle = document.getElementById('note-subtitle');
const noteTxt1 = document.getElementById('note-txt-1');
const noteTxt2 = document.getElementById('note-txt-2');
const noteTxt3 = document.getElementById('note-txt-3');
const noteTxt4 = document.getElementById('note-txt-4');
const noteFullLabel = document.getElementById('note-full-label');
const noteDismissLabel = document.getElementById('note-dismiss-label');

const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const radioDayBadge = document.getElementById('radio-day-badge');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const frequencyTrack = document.getElementById('frequency-track');
const frequencyProgress = document.getElementById('frequency-progress');
const frequencyNeedle = document.getElementById('frequency-needle');
const dayTicksLabels = document.getElementById('day-ticks-labels');
const ticksContainer = document.getElementById('ticks-container');
const clockTime = document.getElementById('clock-time');
const countdownText = document.getElementById('countdown-text');
const langToggle = document.getElementById('lang-toggle');
const btnDhak = document.getElementById('btn-dhak');
const embersCanvas = document.getElementById('embers-canvas');
const shiuliCanvas = document.getElementById('shiuli-canvas');

// In-Radio Dedicated Dhak & Playlist Selectors
const btnDhakMode = document.getElementById('btn-dhak-mode');
const dhakBtnLabel = document.getElementById('dhak-btn-label');
const btnPlaylistDrawer = document.getElementById('btn-playlist-drawer');
const playlistBtnLabel = document.getElementById('playlist-btn-label');
const playlistDrawer = document.getElementById('playlist-drawer');
const playlistBackdrop = document.getElementById('playlist-drawer-backdrop');
const btnCloseDrawer = document.getElementById('btn-close-drawer');
const playlistTracksContainer = document.getElementById('playlist-tracks-container');
const btnToggleVideo = document.getElementById('btn-toggle-video');
const videoToggleLabel = document.getElementById('video-toggle-label');
const ytPlayerDock = document.getElementById('yt-player-dock');
const btnHideVideo = document.getElementById('btn-hide-video');

// Radio Track Bar Elements
const radioTrackBar = document.getElementById('radio-track-bar');
const btnPrevTrack = document.getElementById('btn-prev-track');
const btnNextTrack = document.getElementById('btn-next-track');
const trackPlaylistTag = document.getElementById('track-playlist-tag');
const trackTitleText = document.getElementById('track-title-text');
const trackArtistText = document.getElementById('track-artist-text');

// Signal Bar & Power Button
const radioPowerBtn = document.getElementById('radio-power-btn');
const radioSignalMeter = document.getElementById('radio-signal-meter');
const signalReadout = document.getElementById('signal-readout');

// Vintage Radio Motif Elements: Top Equalizer & Dual Rotary Tuners
const equalizerCanvas = document.getElementById('equalizer-canvas');
const volKnob = document.getElementById('vol-knob');
const volBadge = document.getElementById('vol-badge');
const channelKnob = document.getElementById('channel-knob');
const channelBadge = document.getElementById('channel-badge');

// 6 Sacred Day Channel Angles (-125deg to +125deg)
const CHANNEL_ANGLES = [-125, -75, -25, 25, 75, 125];

let isLandingPage = true; // Starts on Sharod Taranga landing page
let isRotatingChannel = false;
let isRotatingVol = false;
let currentChannelAngle = CHANNEL_ANGLES[0];
let currentVolAngle = -135 + 270 * 0.7; // +54deg for 70% default volume

let currentActiveBgLayer = bgLayer1;
let currentInactiveBgLayer = bgLayer2;
let currentBgUrl = '';

// ==========================================================================
// INITIAL SETUP: DAY TICKS & DIAL NEEDLE
// ==========================================================================
function buildFrequencyDialTicks() {
  ticksContainer.innerHTML = '';
  dayTicksLabels.innerHTML = '';

  PUJA_DAYS.forEach((day, index) => {
    // 1. Tick point dot on frequency track
    const tick = document.createElement('div');
    tick.className = `tick-dot ${index === currentDayIndex ? 'active' : ''}`;
    tick.style.left = `${day.frequencyPercent}%`;
    tick.dataset.index = index;
    ticksContainer.appendChild(tick);

    // 2. Day label below frequency line
    const labelBtn = document.createElement('button');
    labelBtn.className = `day-tick-button ${index === currentDayIndex ? 'active' : ''}`;
    const fullText = currentLanguage === 'bn' ? day.nameBn : day.nameEn;
    const shortText = currentLanguage === 'bn' ? day.nameBn : (day.shortEn || day.nameEn);
    labelBtn.innerHTML = `<span class="day-tick-full">${fullText}</span><span class="day-tick-short">${shortText}</span>`;
    labelBtn.title = currentLanguage === 'bn' ? `${day.nameBn} নির্বাচন করুন` : `Tune to ${day.nameEn}`;
    labelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tuneToDay(index);
    });
    dayTicksLabels.appendChild(labelBtn);
  });
}

// Update Active Day Across UI
function updateUIForDay(dayIndex, isInitial = false) {
  const day = PUJA_DAYS[dayIndex];
  document.body.classList.toggle('is-landing-active', isLandingPage);

  // 1. Hero Text & Landing Title Writeup (400ms)
  heroDayName.classList.remove('rise-animation');
  // Trigger reflow
  void heroDayName.offsetWidth;
  if (isLandingPage) {
    heroDayName.textContent = '';
    heroDayName.classList.add('hidden');
    if (landingTitleBlock) {
      landingTitleBlock.classList.remove('hidden');
      if (landingVintageTagline) {
        landingVintageTagline.textContent = currentLanguage === 'bn' 
          ? 'আগমণী সুর ও বেতার ঐতিহ্য • ১৯৭০-এর স্মৃতিধারা' 
          : 'Vintage Akashvani Radiowaves • 1970s Nostalgia';
      }
    }
  } else {
    if (landingTitleBlock) landingTitleBlock.classList.add('hidden');
    heroDayName.classList.remove('hidden');
    heroDayName.textContent = currentLanguage === 'bn' ? day.nameBn : day.nameEn;
    heroDayName.className = `hero-day-name rise-animation ${currentLanguage === 'en' ? 'lang-en' : ''}`;
  }

  // 2. Radio Track Meta & Badges
  if (radioDayBadge) radioDayBadge.textContent = currentLanguage === 'bn' ? day.nameBn : day.nameEn;
  if (channelBadge) channelBadge.textContent = currentLanguage === 'bn' ? day.nameBn : day.nameEn;
  if (trackTitle) trackTitle.textContent = currentLanguage === 'bn' ? day.trackTitleBn : day.trackTitleEn;
  if (trackArtist) trackArtist.textContent = currentLanguage === 'bn' ? day.artistBn : day.artistEn;

  // 3. Frequency Needle & Progress Slide (400ms ease-out)
  frequencyNeedle.style.left = `${day.frequencyPercent}%`;
  frequencyProgress.style.width = `${day.frequencyPercent}%`;

  // 4. Update Tick States
  document.querySelectorAll('.tick-dot').forEach((tick, idx) => {
    tick.classList.toggle('active', idx === dayIndex);
  });
  document.querySelectorAll('.day-tick-button').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === dayIndex);
    const d = PUJA_DAYS[idx];
    btn.title = currentLanguage === 'bn' ? `${d.nameBn} নির্বাচন করুন` : `Tune to ${d.nameEn}`;
    const fullText = currentLanguage === 'bn' ? d.nameBn : d.nameEn;
    const shortText = currentLanguage === 'bn' ? d.nameBn : (d.shortEn || d.nameEn);
    btn.innerHTML = `<span class="day-tick-full">${fullText}</span><span class="day-tick-short">${shortText}</span>`;
  });

  // 5. Update Channel Knob Position if not currently being manually dragged
  if (channelKnob && !isRotatingChannel) {
    const dialPlate = channelKnob.querySelector('.knob-dial-plate');
    currentChannelAngle = CHANNEL_ANGLES[dayIndex];
    if (dialPlate) {
      dialPlate.style.transform = `rotate(${currentChannelAngle}deg)`;
    }
    channelKnob.setAttribute('aria-valuenow', dayIndex);
  }

    // 6. Background Cross-Fade (800ms) with Subtle Tuning Flicker
  const targetBg = isLandingPage ? '/images/durga_sharod_taranga_1791114431998.jpg' : day.bgImage;
  if (isInitial) {
    currentActiveBgLayer.style.backgroundImage = `url("${targetBg}")`;
    currentActiveBgLayer.style.setProperty('--bg-url', `url("${targetBg}")`);
    currentActiveBgLayer.classList.remove('prev');
    currentActiveBgLayer.classList.add('active');
    currentInactiveBgLayer.classList.remove('active');
    currentInactiveBgLayer.classList.add('prev');
    currentBgUrl = targetBg;
  } else if (targetBg !== currentBgUrl) {          // same image (e.g. language switch) → no fade needed
    currentBgUrl = targetBg;
    currentActiveBgLayer.classList.add('tuning-flicker');

    // Prepare and show the next layer
    currentInactiveBgLayer.style.backgroundImage = `url("${targetBg}")`;
    currentInactiveBgLayer.style.setProperty('--bg-url', `url("${targetBg}")`);
    currentInactiveBgLayer.classList.remove('prev');
    currentInactiveBgLayer.classList.add('active');
    currentActiveBgLayer.classList.remove('active');
    currentActiveBgLayer.classList.add('prev');

    const fadingOut = currentActiveBgLayer;
    const fadingIn = currentInactiveBgLayer;
    setTimeout(() => {
      fadingOut.classList.remove('tuning-flicker');
      currentActiveBgLayer = fadingIn;
      currentInactiveBgLayer = fadingOut;
    }, 800);
  }
}

// Return to Sharod Taranga Landing Page
function goToHomePage() {
  isLandingPage = true;
  if (btnHome) btnHome.classList.add('active-landing');
  updateUIForDay(currentDayIndex);
}

// Transition from Landing Page to Radio Playback
function leaveLandingPage(andPlay = true) {
  isLandingPage = false;
  if (btnHome) btnHome.classList.remove('active-landing');
  updateUIForDay(currentDayIndex);

  if (andPlay) {
    audio.init();
    if (!isRadioPowered) {
      toggleRadioPower();
    } else {
      if (!isPlaying) {
        togglePlay();
      }
    }
  }
}

// ==========================================================================
// YOUTUBE PLAYLIST ENGINE & TRACK SYNCHRONIZATION
// ==========================================================================

function updateTrackBarUI() {
  const pl = PLAYLISTS[currentPlaylistKey];
  if (!pl) return;
  const track = pl.tracks[currentTrackIndex];
  if (!track) return;

  if (trackPlaylistTag) {
    trackPlaylistTag.textContent = currentLanguage === 'bn' ? pl.tagBn : pl.tagEn;
    trackPlaylistTag.classList.toggle('tag-dhak', currentPlaylistKey === 'dhak');
  }
  if (trackTitleText) {
    trackTitleText.textContent = currentLanguage === 'bn' ? track.titleBn : track.titleEn;
  }
  if (trackArtistText) {
trackArtistText.textContent = `• ${(currentLanguage === 'bn' ? track.artistBn : track.artistEn) || ''}`;  }

  const ytDockTitle = document.getElementById('yt-dock-title');
  if (ytDockTitle) {
    ytDockTitle.textContent = currentLanguage === 'bn' ? `${track.titleBn} (${track.artistBn})` : `${track.titleEn} (${track.artistEn})`;
  }
}

function setSignalMeter(state) {
  if (!radioSignalMeter) return;
  radioSignalMeter.classList.remove('is-full-signal', 'is-weak-signal', 'is-power-off');

  if (state === 'full') {
    radioSignalMeter.classList.add('is-full-signal');
    if (signalReadout) signalReadout.textContent = 'TUNED';
  } else if (state === 'weak') {
    radioSignalMeter.classList.add('is-weak-signal');
    if (signalReadout) signalReadout.textContent = 'SEEK';
  } else if (state === 'off') {
    radioSignalMeter.classList.add('is-power-off');
    if (signalReadout) signalReadout.textContent = 'OFF';
  }
}

function setPlaybackState(playing) {
  isPlaying = playing;
  if (playBtn) {
    playBtn.classList.toggle('is-playing', playing);
  }
  if (playIcon) playIcon.style.display = playing ? 'none' : 'block';
  if (pauseIcon) pauseIcon.style.display = playing ? 'block' : 'none';

  // Update track rows active indicator in drawer if visible
  document.querySelectorAll('.playlist-track-row').forEach((row) => {
    row.classList.toggle('is-playing', playing && row.classList.contains('active'));
  });
}

function playTrack(playlistKey, trackIndex, autoPlay = true) {
  if (!isRadioPowered) {
    isRadioPowered = true;
    if (radioPowerBtn) radioPowerBtn.classList.add('is-powered');
    const radioMotif = document.querySelector('.vintage-radio-motif');
    if (radioMotif) radioMotif.classList.remove('is-power-off');
  }
  const pl = PLAYLISTS[playlistKey];
  if (!pl || !pl.tracks[trackIndex]) return;

  currentPlaylistKey = playlistKey;
    if (playlistKey === 'mahalaya') lastMahalayaIndex = trackIndex;
  currentTrackIndex = trackIndex;
  const track = pl.tracks[trackIndex];

  // When Dhak Beats is selected, ensure video is strictly hidden (only audio plays)
  if (playlistKey === 'dhak' && ytPlayerDock) {
    ytPlayerDock.classList.add('hidden');
  }

  updateTrackBarUI();
  renderPlaylistTracks(activeDrawerTab);

  // Local audio file (only tracks that have `src`, i.e. the Mahalaya Chandi Path)
  if (track.src) {
    if (ytPlayer && ytReady) { try { ytPlayer.pauseVideo(); } catch {} }
    if (ytPlayerDock) ytPlayerDock.classList.add('hidden');
    audio.stopDayMusic();
    if (!localAudio.src.endsWith(track.src)) localAudio.src = track.src;
    localAudio.volume = currentVolumeRatio;
    if (autoPlay) {
      localAudio.play().catch(() => {});
      setPlaybackState(true);
      setSignalMeter('full');
    } else {
      localAudio.pause();
    }
    return;
  }
  localAudio.pause();   // YouTube track -> make sure the local file is stopped

  if (ytPlayer && ytReady) {
    setSignalMeter('weak');
    try {
      if (autoPlay) {
        audio.stopDayMusic(); // Stop procedural audio synth so only the YouTube audio plays
        ytPlayer.loadVideoById(track.youtubeId);
        setPlaybackState(true);
      } else {
        ytPlayer.cueVideoById(track.youtubeId);
      }
    } catch {
      audio.startDayMusic(currentDayIndex);
      setPlaybackState(true);
      setSignalMeter('full');
    }
  } else if (autoPlay) {
    pendingTrackToPlay = { playlistKey, trackIndex };
    audio.startDayMusic(currentDayIndex);
    setPlaybackState(true);
    setSignalMeter('full');
  }
}

function playNextTrack() {
  const pl = PLAYLISTS[currentPlaylistKey];
  if (!pl) return;
  const nextIdx = (currentTrackIndex + 1) % pl.tracks.length;
  playTrack(currentPlaylistKey, nextIdx, true);
}

function playPrevTrack() {
  const pl = PLAYLISTS[currentPlaylistKey];
  if (!pl) return;
  const prevIdx = (currentTrackIndex - 1 + pl.tracks.length) % pl.tracks.length;
  playTrack(currentPlaylistKey, prevIdx, true);
}

// Dedicated Dhak Button Handler
function toggleDhakMode() {
  audio.init();
  if (isLandingPage) {
    isLandingPage = false;
    if (btnHome) btnHome.classList.remove('active-landing');
    updateUIForDay(currentDayIndex);
  }
  isDhakMode = !isDhakMode;

  if (btnDhakMode) {
    btnDhakMode.classList.toggle('active', isDhakMode);
  }

  // Ensure video player dock is hidden: ONLY audio should be played and video should NOT be played
  if (ytPlayerDock) {
    ytPlayerDock.classList.add('hidden');
  }

  if (isDhakMode) {
    // Switch to Dhak Beats Playlist and play track 0 (youtubeId: 'i1r8247faTY') immediately
    playTrack('dhak', 0, true);
  } else {
    // Return to current day's radio frequency & playlist
    const dayKey = currentDayIndex === 0 ? 'mahalaya' : 'pujoDays';
    let trackIdx = dayKey === 'mahalaya' ? lastMahalayaIndex : 0;    if (dayKey === 'pujoDays') {
      trackIdx = Math.max(0, Math.min(currentDayIndex - 1, PLAYLISTS.pujoDays.tracks.length - 1));
    }
  playTrack(dayKey, trackIdx, true);
  }
}

// Power Button Toggle
function toggleRadioPower() {
  audio.init();
  isRadioPowered = !isRadioPowered;

  const radioMotif = document.querySelector('.vintage-radio-motif');

  if (isRadioPowered) {
    if (radioPowerBtn) radioPowerBtn.classList.add('is-powered');
    if (radioMotif) radioMotif.classList.remove('is-power-off');
    audio.playTuningStatic();
    setSignalMeter('full');
    playTrack(currentPlaylistKey, currentTrackIndex, true);
  } else {
    if (radioPowerBtn) radioPowerBtn.classList.remove('is-powered');
    if (radioMotif) radioMotif.classList.add('is-power-off');
    localAudio.pause();
    if (ytPlayer && ytReady) {
      try { ytPlayer.pauseVideo(); } catch {}
    }
    audio.stopDayMusic();
    setPlaybackState(false);
    setSignalMeter('off');
  }
}

// Tune to Day Function with Sound, Playlists and Animations
function tuneToDay(dayIndex) {
  if (dayIndex < 0 || dayIndex >= PUJA_DAYS.length) return;
  if (currentDayIndex === dayIndex && !isDhakMode && !isLandingPage) return;

  if (isLandingPage) {
    isLandingPage = false;
    if (btnHome) btnHome.classList.remove('active-landing');
  }

  currentDayIndex = dayIndex;

  // Turning the radio dial restores normal day broadcast
  isDhakMode = false;
  if (btnDhakMode) btnDhakMode.classList.remove('active');

  // 1. Play Soft Tuning Static
  audio.playTuningStatic();

  // 2. Update UI & Cross-Fade Artwork
    if (dayIndex === 0) {
    playTrack('mahalaya', lastMahalayaIndex, true);
  } else {
    const trackIdx = Math.min(dayIndex - 1, PLAYLISTS.pujoDays.tracks.length - 1);
    playTrack('pujoDays', trackIdx, true);
  }
}

// Play / Pause Logic (Integrated into Center of Volume Knob)
function togglePlay() {
  audio.init();

  if (isLandingPage) {
    leaveLandingPage(true);
    return;
  }

  if (!isRadioPowered) {
    toggleRadioPower();
    return;
  }

  isPlaying = !isPlaying;

  if (isLocalTrack()) {
    if (isPlaying) { localAudio.play().catch(() => {}); setPlaybackState(true); setSignalMeter('full'); }
    else { localAudio.pause(); setPlaybackState(false); }
    return;
  }

  if (isPlaying) {
    setPlaybackState(true);
    if (ytPlayer && ytReady) {
      try {
        ytPlayer.playVideo();
      } catch {
        audio.startDayMusic(currentDayIndex);
      }
    } else {
      audio.startDayMusic(currentDayIndex);
    }
    setSignalMeter('full');
  } else {
    setPlaybackState(false);
    if (ytPlayer && ytReady) {
      try {
        ytPlayer.pauseVideo();
      } catch {}
    }
    audio.stopDayMusic();
  }
}

// Setup YouTube Player via IFrame API
function setupYouTubePlayer() {
  const initYT = () => {
    if (window.YT && window.YT.Player) {
      ytPlayer = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: PLAYLISTS.mahalaya.tracks.find(t => t.youtubeId)?.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            ytReady = true;
            try {
              ytPlayer.setVolume(Math.round(currentVolumeRatio * 100));
            } catch {}
            if (pendingTrackToPlay) {
              const p = pendingTrackToPlay;
              pendingTrackToPlay = null;
              audio.stopDayMusic();
              playTrack(p.playlistKey, p.trackIndex, true);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              audio.stopDayMusic(); // Stop procedural synth when YouTube audio is streaming
              setPlaybackState(true);
              setSignalMeter('full');
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setPlaybackState(false);
            } else if (event.data === window.YT.PlayerState.BUFFERING) {
              setSignalMeter('weak');
            } else if (event.data === window.YT.PlayerState.ENDED) {
              playNextTrack();
            }
          },
                    onError: () => {
            setSignalMeter('weak');
            if (isPlaying) {
              audio.startDayMusic(currentDayIndex);
            }
          }
        }
      });
    } else {
      setTimeout(initYT, 150);
    }
  };

  initYT();
}

window.onYouTubeIframeAPIReady = setupYouTubePlayer;
// The YouTube script can finish loading before this file runs. If so, the callback above
// is never called and the player is never created. Start it ourselves in that case.
if (window.YT && window.YT.Player) setupYouTubePlayer();
// Playlist Drawer Rendering & Navigation
function renderPlaylistTracks(tabKey) {
  if (!playlistTracksContainer) return;
  activeDrawerTab = tabKey;
  playlistTracksContainer.innerHTML = '';

  document.querySelectorAll('.playlist-tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabKey);
  });

  const pl = PLAYLISTS[tabKey];
  if (!pl) return;

  pl.tracks.forEach((track, idx) => {
    const isThisTrackActive = currentPlaylistKey === tabKey && currentTrackIndex === idx;
    const row = document.createElement('div');
    row.className = `playlist-track-row ${isThisTrackActive ? 'active' : ''} ${isThisTrackActive && isPlaying ? 'is-playing' : ''}`;
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');

    row.innerHTML = `
      <div class="track-row-left">
        <span class="track-index-num">${String(idx + 1).padStart(2, '0')}</span>
        <div class="track-meta-group">
          <span class="track-name-main">${currentLanguage === 'bn' ? track.titleBn : track.titleEn}</span>
<span class="track-artist-sub">${(currentLanguage === 'bn' ? track.artistBn : track.artistEn) || ''}</span>
        </div>
      </div>
      <div class="track-row-right">
        <span class="track-duration">${track.duration}</span>
        <div class="track-mini-bars" aria-hidden="true">
          <span class="track-mini-bar"></span>
          <span class="track-mini-bar"></span>
          <span class="track-mini-bar"></span>
        </div>
      </div>
    `;

    row.addEventListener('click', () => {
      audio.init();
      if (tabKey === 'dhak') {
        isDhakMode = true;
        if (btnDhakMode) btnDhakMode.classList.add('active');
        if (ytPlayerDock) ytPlayerDock.classList.add('hidden'); // Ensure video is NOT shown
      } else {
        isDhakMode = false;
        if (btnDhakMode) btnDhakMode.classList.remove('active');
        if (track.dayIndex !== undefined) {
          tuneToDay(track.dayIndex);
        } else if (tabKey === 'mahalaya') {
          tuneToDay(0);
        }
      }
      playTrack(tabKey, idx, true);
    });

    playlistTracksContainer.appendChild(row);
  });
}
// Show only the playlist that belongs to the current day (Dhak tab stays available)
function syncDrawerToDay() {
  const own = currentDayIndex === 0 ? 'mahalaya' : 'pujoDays';
  document.querySelectorAll('.playlist-tab-btn').forEach((btn) => {
    const t = btn.dataset.tab;
    btn.style.display = (t === own || t === 'dhak') ? '' : 'none';
  });
  renderPlaylistTracks(isDhakMode ? 'dhak' : own);
}
function openPlaylistDrawer() {
  if (playlistDrawer) playlistDrawer.classList.add('open');
  if (playlistBackdrop) playlistBackdrop.classList.add('open');
  if (btnPlaylistDrawer) btnPlaylistDrawer.classList.add('drawer-open');
  syncDrawerToDay();}

function closePlaylistDrawer() {
  if (playlistDrawer) playlistDrawer.classList.remove('open');
  if (playlistBackdrop) playlistBackdrop.classList.remove('open');
  if (btnPlaylistDrawer) btnPlaylistDrawer.classList.remove('drawer-open');
}

// Top Bar Home Button (Returns to Sharod Taranga Landing Page)
if (btnHome) {
  btnHome.addEventListener('click', (e) => {
    e.stopPropagation();
    goToHomePage();
  });
}

// ==========================================================================
// WEBSITE INSTRUCTION BOX MODAL (শারদ তরঙ্গ ব্যবহার বিধি)
// ==========================================================================
const INSTRUCTIONS_DATA = {
  bn: {
    title: 'শারদ তরঙ্গ • বেতার ব্যবহারের নির্দেশিকা',
    subtitle: 'ওয়েবসাইটের সহজ নিয়মাবলী ও আনন্দময় অভিজ্ঞতার উপায়',
    cards: [
      {
        icon: '📻',
        heading: '১. রেডিও অন/অফ ও গান চালানো (Power & Play)',
        text: 'বাঁদিকের <strong>VOLUME</strong> নবের কেন্দ্রে থাকা <strong>Play/Pause</strong> বোতামটি স্পর্শ করুন অথবা উপরের <strong>PWR</strong> সুইচটিতে চাপ দিন। ল্যান্ডিং পেজে <strong>"Turn on radio or play"</strong> বোতামেও গান শুরু হবে।'
      },
      {
        icon: '🎛️',
        heading: '২. দিন পরিবর্তন ও সুর সন্ধান (Tuning Sacred Days)',
        text: 'ডানদিকের বড় <strong>TUNING</strong> নবটি ঘুরিয়ে অথবা কাঁচের ফ্রিকোয়েন্সি স্কেলের <strong>মহালয়া, ষষ্ঠী, সপ্তমী, অষ্টমী, নবমী, দশমী</strong> দাগে ক্লিক বা ড্র্যাগ করে যেকোনো দিনের সুর ও পরিবেশ উপভোগ করুন।'
      },
      {
        icon: '🔊',
        heading: '৩. শব্দমাত্রা নিয়ন্ত্রণ (Volume Knob)',
        text: 'বাঁদিকের <strong>VOLUME</strong> নবটি মাউস দিয়ে টেনে অথবা স্ক্রোল হুইল ঘুরিয়ে সুবিধাজনক শব্দমাত্রায় (০% থেকে ১০০%) গান শুনুন।'
      },
      {
        icon: '🥁',
        heading: '৪. ঢাকের বাদ্যি বোতাম (Festive Dhak Mode)',
        text: 'রেডিওর মেকানিক্যাল <strong>🥁 ঢাকের বাদ্যি</strong> সুইচে চাপ দিলে লাল জেম ল্যাম্প জ্বলে উঠবে এবং সাথে সাথে পুজো মণ্ডপের খাঁটি ঢাকের বোল বাজবে।'
      },
      {
        icon: '📜',
        heading: '৫. পূজার প্লেলিস্ট ড্রয়ার (Puja Playlists)',
        text: '<strong>📻 শারদ প্লেলিস্ট</strong> কী অথবা ফ্রিকোয়েন্সি মার্কারের <strong>মহালয়া ▾</strong> ট্যাগে ক্লিক করলে সম্পূর্ণ ইউটিউব প্লেলিস্টের তালিকা খুলবে।'
      },
      {
        icon: '🏠',
        heading: '৬. শারদ তরঙ্গ হোম পেজ (Home Option)',
        text: 'যেকোনো সময় ওপরের বারের বাঁদিকের <strong>🏠 হোম</strong> বোতামে ক্লিক করলেই আপনি প্রারম্ভিক "শারদ তরঙ্গ" চিত্রালঙ্কারে ফিরে যেতে পারবেন।'
      },
      {
        icon: '🌐',
        heading: '৭. ভাষা পরিবর্তন (Language Toggle)',
        text: 'ওপরের <strong>বাংলা / ENG</strong> বোতামে ক্লিক করে সমগ্র প্ল্যাটফর্মের বিবরণী বাংলা অথবা ইংরেজিতে পাঠ করতে পারেন।'
      }
    ],
    understood: 'বুঝেছি • বন্ধ করুন'
  },
  en: {
    title: 'Sharod Taranga • Website Guide',
    subtitle: 'How to experience the vintage Durga Puja acoustic radio',
    cards: [
      {
        icon: '📻',
        heading: '1. Power & Play/Pause',
        text: 'Click the central <strong>Play/Pause</strong> button inside the left <strong>VOLUME</strong> knob, press the <strong>PWR</strong> switch, or click the <strong>"Turn on radio or play"</strong> button on the landing page.'
      },
      {
        icon: '🎛️',
        heading: '2. Tuning the Sacred Days',
        text: 'Rotate the large right <strong>TUNING</strong> knob (or click/drag across the illuminated frequency dial) to journey from <strong>Mahalaya</strong> dawn to <strong>Dashami</strong>.'
      },
      {
        icon: '🔊',
        heading: '3. Volume Control',
        text: 'Drag or scroll the outer ring of the left <strong>VOLUME</strong> knob to seamlessly adjust audio levels from 0% to 100%.'
      },
      {
        icon: '🥁',
        heading: '4. Dedicated Dhak Beats Mode',
        text: 'Press the in-radio <strong>🥁 Dhak Beats</strong> piano key to illuminate the ruby jewel lamp and tune directly to resonant festival drum rolls.'
      },
      {
        icon: '📜',
        heading: '5. Puja Playlists Drawer',
        text: 'Click the <strong>📻 Puja Playlists</strong> selector key or the dial marquee tag (<strong>মহালয়া ▾</strong>) to browse classic Akashvani recordings and festival songs.'
      },
      {
        icon: '🏠',
        heading: '6. Home Option (Sharod Taranga)',
        text: 'Click the <strong>🏠 Home</strong> button in the top bar at any time to return to the opening Sharod Taranga artwork screen.'
      },
      {
        icon: '🌐',
        heading: '7. Language Toggle',
        text: 'Switch effortlessly between Bengali and English anytime using the <strong>বাংলা / ENG</strong> toggle in the top bar.'
      }
    ],
    understood: 'Got It • Close'
  }
};

function renderInstructions() {
  if (!instructionsBody) return;
  const data = INSTRUCTIONS_DATA[currentLanguage] || INSTRUCTIONS_DATA.bn;
  const mainTitle = document.getElementById('instr-main-title');
  const subTitle = document.getElementById('instr-sub-title');
  if (mainTitle) mainTitle.textContent = data.title;
  if (subTitle) subTitle.textContent = data.subtitle;

  instructionsBody.innerHTML = '';
  data.cards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'instr-card';
    cardEl.innerHTML = `
      <div class="instr-icon" aria-hidden="true">${card.icon}</div>
      <div class="instr-content">
        <h3 class="instr-heading">${card.heading}</h3>
        <p class="instr-text">${card.text}</p>
      </div>
    `;
    instructionsBody.appendChild(cardEl);
  });
}

function openInstructions() {
  renderInstructions();
  hidePopupInstructionNote();
  if (instructionsModal) instructionsModal.classList.add('open');
  if (instructionsBackdrop) instructionsBackdrop.classList.add('open');
}

function closeInstructions() {
  if (instructionsModal) instructionsModal.classList.remove('open');
  if (instructionsBackdrop) instructionsBackdrop.classList.remove('open');
}

// ==========================================================================
// POPUP INSTRUCTION NOTE (পপআপ নির্দেশিকা চিরকুট)
// ==========================================================================
const POPUP_NOTE_DATA = {
  bn: {
    title: 'বেতার ব্যবহারের নির্দেশিকা নোট',
    subtitle: 'Agomoni Betar • Quick Instruction Note',
    t1: '<strong>রেডিও চালান:</strong> মাঝের <em>"Turn on radio or play"</em> বোতামে চাপুন বা Volume নবের কেন্দ্রে স্পর্শ করুন।',
    t2: '<strong>সুর সন্ধান:</strong> ডায়ালে <em>মহালয়া থেকে দশমী</em> স্পর্শ করুন বা Tuning নব ঘুরিয়ে দিন পাল্টান।',
    t3: '<strong>ঢাকের বাদ্যি:</strong> নিচের <em>🥁 ঢাকের বাদ্যি</em> পুশ-কী চাপলে উৎসবের খাঁটি ঢাক বাজবে।',
    t4: '<strong>শারদ তরঙ্গ হোম:</strong> ওপরের বাঁদিকের <em>🏠 হোম</em> বোতামে চাপলেই শারদ তরঙ্গ পেজে ফিরবেন।',
    fullLabel: 'সম্পূর্ণ গাইড ↗',
    dismissLabel: 'বুঝেছি • Got it'
  },
  en: {
    title: 'Website Instruction Note',
    subtitle: 'Agomoni Betar • Quick Experience Guide',
    t1: '<strong>Turn On Radio:</strong> Click the central <em>"Turn on radio or play"</em> button or the Volume knob center.',
    t2: '<strong>Tune Sacred Days:</strong> Tap any station on the dial from <em>Mahalaya to Dashami</em> or rotate the Tuning knob.',
    t3: '<strong>Dhak Beats:</strong> Press the mechanical <em>🥁 Dhak Beats</em> key to broadcast festive temple drums.',
    t4: '<strong>Home Option:</strong> Tap the <em>🏠 Home</em> button in the top bar anytime to return to the opening page.',
    fullLabel: 'Full Guide ↗',
    dismissLabel: 'Got It • Close'
  }
};

function renderPopupInstructionNote() {
  if (!popupInstructionNote) return;
  const d = POPUP_NOTE_DATA[currentLanguage] || POPUP_NOTE_DATA.bn;
  if (noteTitle) noteTitle.textContent = d.title;
  if (noteSubtitle) noteSubtitle.textContent = d.subtitle;
  if (noteTxt1) noteTxt1.innerHTML = d.t1;
  if (noteTxt2) noteTxt2.innerHTML = d.t2;
  if (noteTxt3) noteTxt3.innerHTML = d.t3;
  if (noteTxt4) noteTxt4.innerHTML = d.t4;
  if (noteFullLabel) noteFullLabel.textContent = d.fullLabel;
  if (noteDismissLabel) noteDismissLabel.textContent = d.dismissLabel;
}

function showPopupInstructionNote() {
  if (!popupInstructionNote) return;
  renderPopupInstructionNote();
  popupInstructionNote.classList.remove('hidden');
}

function hidePopupInstructionNote() {
  if (!popupInstructionNote) return;
  popupInstructionNote.classList.add('hidden');
}

if (btnInstructions) {
  btnInstructions.addEventListener('click', openInstructions);   // opens the full guide directly
}

if (btnCloseNote) {
  btnCloseNote.addEventListener('click', hidePopupInstructionNote);
}

if (btnNoteDismiss) {
  btnNoteDismiss.addEventListener('click', hidePopupInstructionNote);
}

if (btnNoteFullGuide) {
  btnNoteFullGuide.addEventListener('click', () => {
    hidePopupInstructionNote();
    openInstructions();
  });
}

if (btnCloseInstructions) {
  btnCloseInstructions.addEventListener('click', closeInstructions);
}

if (instructionsBackdrop) {
  instructionsBackdrop.addEventListener('click', closeInstructions);
}

// Wire Event Handlers
if (btnDhakMode) {
  btnDhakMode.addEventListener('click', toggleDhakMode);
}

if (btnPlaylistDrawer) {
  btnPlaylistDrawer.addEventListener('click', openPlaylistDrawer);
}

if (trackPlaylistTag) {
  trackPlaylistTag.addEventListener('click', (e) => {
    e.stopPropagation();
    openPlaylistDrawer();
  });
  trackPlaylistTag.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPlaylistDrawer();
    }
  });
}

if (btnCloseDrawer) {
  btnCloseDrawer.addEventListener('click', closePlaylistDrawer);
}

if (playlistBackdrop) {
  playlistBackdrop.addEventListener('click', closePlaylistDrawer);
}

// Drawer Category Tabs
document.querySelectorAll('.playlist-tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    if (tab) renderPlaylistTracks(tab);
  });
});

// Radio Track Navigation (Prev / Next)
if (btnPrevTrack) {
  btnPrevTrack.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.init();
    playPrevTrack();
  });
}

if (btnNextTrack) {
  btnNextTrack.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.init();
    playNextTrack();
  });
}

// Radio Power Button
if (radioPowerBtn) {
  radioPowerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleRadioPower();
  });
}

// Video Player Frame Toggle
if (btnToggleVideo) {
  btnToggleVideo.addEventListener('click', () => {
    if (ytPlayerDock) {
      ytPlayerDock.classList.toggle('hidden');
    }
  });
}

if (btnHideVideo) {
  btnHideVideo.addEventListener('click', () => {
    if (ytPlayerDock) {
      ytPlayerDock.classList.add('hidden');
    }
  });
}

// Center Push Button on Volume Knob
if (playBtn) {
  playBtn.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });
}

// ==========================================================================
// FREQUENCY LINE CLICK & DRAG TUNING
// ==========================================================================
function handleDialInteraction(clientX) {
  const rect = frequencyTrack.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const clickPercent = ratio * 100;

  // Find nearest day tick
  let closestIndex = 0;
  let minDiff = 100;
  PUJA_DAYS.forEach((day, idx) => {
    const diff = Math.abs(day.frequencyPercent - clickPercent);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = idx;
    }
  });

  tuneToDay(closestIndex);
}

const dialContainer = document.getElementById('dial-container');

dialContainer.addEventListener('click', (e) => {
  handleDialInteraction(e.clientX);
});

// Dragging along the frequency track
dialContainer.addEventListener('mousedown', (e) => {
  isDraggingDial = true;
  dialContainer.classList.add('is-dragging');
  handleDialInteraction(e.clientX);

  const onMouseMove = (moveEvent) => {
    if (!isDraggingDial) return;
    handleDialInteraction(moveEvent.clientX);
  };

  const onMouseUp = () => {
    isDraggingDial = false;
    dialContainer.classList.remove('is-dragging');
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});

// Touch support for mobile dragging
dialContainer.addEventListener('touchstart', (e) => {
  if (!e.touches[0]) return;
  isDraggingDial = true;
  handleDialInteraction(e.touches[0].clientX);
}, { passive: true });

dialContainer.addEventListener('touchmove', (e) => {
  if (!isDraggingDial || !e.touches[0]) return;
  handleDialInteraction(e.touches[0].clientX);
}, { passive: true });

dialContainer.addEventListener('touchend', () => {
  isDraggingDial = false;
});

// Quick Action Buttons (if present)
if (btnDhak) {
  btnDhak.addEventListener('click', () => {
    btnDhak.classList.add('active-pulse');
    setTimeout(() => btnDhak.classList.remove('active-pulse'), 350);
    audio.playDhak();
  });
}

// ==========================================================================
// ROTARY KNOB CONTROLS (VOLUME TUNER & CHANNEL TUNER)
// ==========================================================================

// Setup Channel Knob (Right Tuner) - ROTATING CHANGES CHANNELS
function setupChannelKnob() {
  if (!channelKnob) return;
  const dialPlate = channelKnob.querySelector('.knob-dial-plate');
  if (dialPlate) {
    dialPlate.style.transform = `rotate(${CHANNEL_ANGLES[currentDayIndex]}deg)`;
  }

  let startPointerAngle = 0;
  let startKnobAngle = CHANNEL_ANGLES[currentDayIndex];
  let startClientY = 0;

  function onPointerDown(e) {
    audio.init();
    isRotatingChannel = true;
    channelKnob.classList.add('is-rotating');
    channelKnob.classList.remove('snapping');
    if (channelKnob.setPointerCapture) {
      try { channelKnob.setPointerCapture(e.pointerId); } catch {}
    }

    const rect = channelKnob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    startPointerAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    startKnobAngle = currentChannelAngle;
    startClientY = e.clientY;
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isRotatingChannel) return;
    const rect = channelKnob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // 1. Calculate rotational angle around knob center
    const currentPointerAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    let deltaAngle = currentPointerAngle - startPointerAngle;
    
    // Normalize delta across the ±180 wrap
    if (deltaAngle > 180) deltaAngle -= 360;
    else if (deltaAngle < -180) deltaAngle += 360;

    // 2. Also incorporate vertical drag for effortless gesture response
    const deltaY = (startClientY - e.clientY) * 0.75;
    
    // Use the primary movement mode
    const effectiveDelta = Math.abs(deltaAngle) > Math.abs(deltaY) ? deltaAngle : deltaY;

    currentChannelAngle += effectiveDelta;
    startPointerAngle = currentPointerAngle;
    startClientY = e.clientY;

    // Clamp with mechanical bounce limits (-145deg to +145deg)
    currentChannelAngle = Math.max(-145, Math.min(145, currentChannelAngle));

    if (dialPlate) {
      dialPlate.style.transform = `rotate(${currentChannelAngle}deg)`;
    }

    // Determine closest channel based on angle
    let closestIndex = 0;
    let minDistance = Infinity;
    CHANNEL_ANGLES.forEach((ang, idx) => {
      const dist = Math.abs(ang - currentChannelAngle);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== currentDayIndex) {
      tuneToDay(closestIndex);
    }
  }

  function onPointerUp(e) {
    if (!isRotatingChannel) return;
    isRotatingChannel = false;
    channelKnob.classList.remove('is-rotating');
    channelKnob.classList.add('snapping');
    if (channelKnob.releasePointerCapture && e.pointerId !== undefined) {
      try { channelKnob.releasePointerCapture(e.pointerId); } catch {}
    }

    // Snap to exact channel detent angle
    currentChannelAngle = CHANNEL_ANGLES[currentDayIndex];
    if (dialPlate) {
      dialPlate.style.transform = `rotate(${currentChannelAngle}deg)`;
    }
  }

  channelKnob.addEventListener('pointerdown', onPointerDown);
  channelKnob.addEventListener('pointermove', onPointerMove);
  channelKnob.addEventListener('pointerup', onPointerUp);
  channelKnob.addEventListener('pointercancel', onPointerUp);

  // Wheel to rotate knob and step through channels
  channelKnob.addEventListener('wheel', (e) => {
    e.preventDefault();
    audio.init();
    if (e.deltaY < 0 && currentDayIndex < PUJA_DAYS.length - 1) {
      tuneToDay(currentDayIndex + 1);
    } else if (e.deltaY > 0 && currentDayIndex > 0) {
      tuneToDay(currentDayIndex - 1);
    }
    currentChannelAngle = CHANNEL_ANGLES[currentDayIndex];
    channelKnob.classList.add('snapping');
    if (dialPlate) {
      dialPlate.style.transform = `rotate(${currentChannelAngle}deg)`;
    }
  }, { passive: false });

  // Keyboard navigation
  channelKnob.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentDayIndex < PUJA_DAYS.length - 1) tuneToDay(currentDayIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentDayIndex > 0) tuneToDay(currentDayIndex - 1);
    }
  });
}

// Setup Volume Knob (Left Tuner) - ROTATING ALTERS VOLUME
function setupVolumeKnob() {
  if (!volKnob) return;
  const dialPlate = volKnob.querySelector('.knob-dial-plate');
  if (dialPlate) {
    dialPlate.style.transform = `rotate(${currentVolAngle}deg)`;
  }
  if (volBadge) {
    volBadge.textContent = '70%';
  }

  let startPointerAngle = 0;
  let startClientY = 0;

  function onPointerDown(e) {
    audio.init();
    isRotatingVol = true;
    volKnob.classList.add('is-rotating');
    if (volKnob.setPointerCapture) {
      try { volKnob.setPointerCapture(e.pointerId); } catch {}
    }

    const rect = volKnob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    startPointerAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    startClientY = e.clientY;
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isRotatingVol) return;
    const rect = volKnob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const currentPointerAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    let deltaAngle = currentPointerAngle - startPointerAngle;
    if (deltaAngle > 180) deltaAngle -= 360;
    else if (deltaAngle < -180) deltaAngle += 360;

    const deltaY = (startClientY - e.clientY) * 0.75;
    const effectiveDelta = Math.abs(deltaAngle) > Math.abs(deltaY) ? deltaAngle : deltaY;

    currentVolAngle += effectiveDelta;
    startPointerAngle = currentPointerAngle;
    startClientY = e.clientY;

    // Range: -135deg (0% volume) to +135deg (100% volume)
    currentVolAngle = Math.max(-135, Math.min(135, currentVolAngle));

    if (dialPlate) {
      dialPlate.style.transform = `rotate(${currentVolAngle}deg)`;
    }

    const volRatio = (currentVolAngle - (-135)) / 270;
    currentVolumeRatio = volRatio;
    audio.setVolume(volRatio);
    const volPercent = Math.round(volRatio * 100);
    if (volBadge) {
      volBadge.textContent = `${volPercent}%`;
    }
    volKnob.setAttribute('aria-valuenow', volPercent);
    if (ytPlayer && ytReady) {
      try { ytPlayer.setVolume(volPercent); } catch {}
    }
  }

  function onPointerUp(e) {
    if (!isRotatingVol) return;
    isRotatingVol = false;
    volKnob.classList.remove('is-rotating');
    if (volKnob.releasePointerCapture && e.pointerId !== undefined) {
      try { volKnob.releasePointerCapture(e.pointerId); } catch {}
    }
  }

  volKnob.addEventListener('pointerdown', onPointerDown);
  volKnob.addEventListener('pointermove', onPointerMove);
  volKnob.addEventListener('pointerup', onPointerUp);
  volKnob.addEventListener('pointercancel', onPointerUp);

  // Wheel to alter volume
  volKnob.addEventListener('wheel', (e) => {
    e.preventDefault();
    audio.init();
    const step = e.deltaY < 0 ? 12 : -12;
    currentVolAngle = Math.max(-135, Math.min(135, currentVolAngle + step));
    if (dialPlate) {
      dialPlate.style.transform = `rotate(${currentVolAngle}deg)`;
    }
    const volRatio = (currentVolAngle - (-135)) / 270;
    currentVolumeRatio = volRatio;
    audio.setVolume(volRatio);
    const volPercent = Math.round(volRatio * 100);
    if (volBadge) {
      volBadge.textContent = `${volPercent}%`;
    }
    volKnob.setAttribute('aria-valuenow', volPercent);
    if (ytPlayer && ytReady) {
      try { ytPlayer.setVolume(volPercent); } catch {}
    }
  }, { passive: false });

  volKnob.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      currentVolAngle = Math.min(135, currentVolAngle + 13.5);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      currentVolAngle = Math.max(-135, currentVolAngle - 13.5);
    }
    if (dialPlate) dialPlate.style.transform = `rotate(${currentVolAngle}deg)`;
    const volRatio = (currentVolAngle - (-135)) / 270;
    currentVolumeRatio = volRatio;
    audio.setVolume(volRatio);
    const volPercent = Math.round(volRatio * 100);
    if (volBadge) volBadge.textContent = `${volPercent}%`;
    volKnob.setAttribute('aria-valuenow', volPercent);
    if (ytPlayer && ytReady) {
      try { ytPlayer.setVolume(volPercent); } catch {}
    }
  });
}

// ==========================================================================
// SMALL EQUALIZER CANVAS (TOP OF RADIO BAR)
// ==========================================================================
function startEqualizerVisualizer() {
  if (!equalizerCanvas) return;
  const ctx = equalizerCanvas.getContext('2d');
  if (!ctx) return;

  const barCount = 26;
  const peakValues = new Array(barCount).fill(0);
  const barHeights = new Array(barCount).fill(1.5);

  function draw() {
    requestAnimationFrame(draw);

    const width = equalizerCanvas.width;
    const height = equalizerCanvas.height;
    ctx.clearRect(0, 0, width, height);

    const freqData = audio.getFrequencyData();
    // YouTube audio can't be analysed (it plays inside an iframe), so the analyser is silent then.
    // Use real data only when it actually has energy; otherwise animate a music-like pattern.
    const hasRealAudio = !!(freqData && freqData.some((v) => v > 4));
    const t = Date.now() * 0.001;
    const beat = Math.pow(Math.sin(t * 6.8) * 0.5 + 0.5, 2);          // kick-drum pulse
    const totalGaps = (barCount - 1) * 2.5;
    const barWidth = Math.max(3, (width - totalGaps) / barCount);

    for (let i = 0; i < barCount; i++) {
      let targetHeight = 1.5;

      if (isPlaying && hasRealAudio) {
        const binIndex = Math.min(freqData.length - 1, Math.floor((i / barCount) * (freqData.length * 0.75)));
        const rawVal = freqData[binIndex] / 255;
        targetHeight = Math.max(1.5, rawVal * (height - 2));
      } else if (isPlaying) {
        const shape = 1 - (i / barCount) * 0.5;                          // bass bars taller
        const w1 = Math.sin(t * 3.1 + i * 0.7) * 0.5 + 0.5;
        const w2 = Math.sin(t * 5.3 - i * 1.3) * 0.5 + 0.5;
        const v = (0.32 * w1 + 0.28 * w2 + 0.3 * beat + 0.1 * Math.random()) * shape;
        targetHeight = 2 + Math.min(1, v) * (height - 3);
      } else {
        const idleWave = Math.sin(Date.now() * 0.002 + i * 0.3) * 0.5 + 0.5;
        targetHeight = 1.5 + idleWave * 1.5;
      }

      barHeights[i] += (targetHeight - barHeights[i]) * 0.35;

      if (barHeights[i] >= peakValues[i]) {
        peakValues[i] = barHeights[i];
      } else {
        peakValues[i] = Math.max(0, peakValues[i] - 0.22);
      }

      const x = i * (barWidth + 2);
      const h = Math.max(1.5, barHeights[i]);
      const y = height - h;

      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, 'rgba(224, 122, 60, 0.45)');
      grad.addColorStop(0.65, 'rgba(245, 166, 35, 0.85)');
      grad.addColorStop(1, 'rgba(255, 235, 150, 0.95)');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, h);

      if (peakValues[i] > 2.5) {
        const peakY = Math.max(0, height - peakValues[i] - 1);
        ctx.fillStyle = 'rgba(255, 245, 190, 0.95)';
        ctx.fillRect(x, peakY, barWidth, 1.2);
      }
    }
  }

  draw();
}

// ==========================================================================
// TOP BAR: CLOCK & DURGA PUJO COUNTDOWN
// ==========================================================================

// 1. Live 12-Hour Clock with IST Label (Hours and Minutes only — No seconds)
function updateClock() {
  const now = new Date();
  // Format in IST (Indian Standard Time: UTC+5:30) strictly without seconds
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  const timeString = now.toLocaleTimeString('en-US', options);
  if (clockTime) clockTime.textContent = timeString;
  const radioTimeBadge = document.getElementById('radio-time-badge');
  if (radioTimeBadge) radioTimeBadge.textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// 2. Durga Pujo Countdown
const MAHALAYA_DATES = { 2026: '2026-10-10' };   // add future years here, YYYY-MM-DD
const toBn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

function updateCountdown() {
  if (!countdownText) return;
  const istNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const today = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());

  let target = null;
  for (const y of Object.keys(MAHALAYA_DATES).sort()) {
    const [Y, M, D] = MAHALAYA_DATES[y].split('-').map(Number);
    const d = new Date(Y, M - 1, D);
    if (d >= today) { target = d; break; }
  }

  let bn, en;
  if (!target) {
    bn = 'শুভ শারদীয়া'; en = 'Shubho Sharodiya';
  } else {
    const days = Math.round((target - today) / 86400000);
    if (days === 0)      { bn = 'আজ মহালয়া 🪔'; en = 'Mahalaya is today'; }
    else if (days === 1) { bn = 'মহালয়ার আর ১ দিন বাকি'; en = '1 day until Mahalaya'; }
    else                 { bn = `মহালয়ার আর ${toBn(days)} দিন বাকি`; en = `${days} days until Mahalaya`; }
  }
  countdownText.textContent = currentLanguage === 'bn' ? bn : en;
}
setInterval(updateCountdown, 3600000);   // refresh hourly so it flips at midnight

updateCountdown();

// 3. Language Switcher (বাংলা / ENG)
langToggle.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'bn' ? 'en' : 'bn';
  langToggle.textContent = currentLanguage === 'bn' ? 'বাংলা' : 'ENG';
  document.body.classList.toggle('lang-en', currentLanguage === 'en');

  // Update hero text, radio badges, countdown, day labels, track bar, and drawer
  updateUIForDay(currentDayIndex);
  updateCountdown();
  updateTrackBarUI();
  renderPlaylistTracks(activeDrawerTab);

  if (cueText) {
    cueText.textContent = currentLanguage === 'bn' ? 'বেতার চালু করুন বা বাজান • Turn on radio or play' : 'Turn on radio or play';
  }
  if (homeBtnLabel) homeBtnLabel.textContent = currentLanguage === 'bn' ? 'হোম' : 'Home';
  if (instructionBtnLabel) instructionBtnLabel.textContent = currentLanguage === 'bn' ? 'নির্দেশিকা' : 'Guide';
  if (instructionsModal && instructionsModal.classList.contains('open')) {
    renderInstructions();
  }
  if (dhakBtnLabel) dhakBtnLabel.textContent = currentLanguage === 'bn' ? 'ঢাকের বাদ্যি' : 'Dhak Beats';
  if (playlistBtnLabel) playlistBtnLabel.textContent = currentLanguage === 'bn' ? 'শারদ প্লেলিস্ট' : 'Puja Playlists';
  if (videoToggleLabel) videoToggleLabel.textContent = currentLanguage === 'bn' ? 'ভিডিও দেখুন (Video)' : 'Watch Video';
  if (btnDhak) btnDhak.textContent = currentLanguage === 'bn' ? 'ঢাক' : 'Dhak';
  renderPopupInstructionNote();
});

// ==========================================================================
// SUBTLE WARM EMBERS CANVAS ANIMATION (Atmospheric particle field)
// ==========================================================================
const ctx = embersCanvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 32;

function resizeEmbersCanvas() {
  embersCanvas.width = window.innerWidth;
  embersCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeEmbersCanvas);
resizeEmbersCanvas();

class EmberParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * embersCanvas.width;
    this.y = embersCanvas.height + Math.random() * 40;
    this.size = Math.random() * 2.2 + 0.8;
    this.speedY = Math.random() * 0.45 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.fadeSpeed = Math.random() * 0.003 + 0.001;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    this.alpha -= this.fadeSpeed;
    if (this.alpha <= 0 || this.y < -10) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 209, 102, ${this.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#f5a623';
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = new EmberParticle();
  p.y = Math.random() * embersCanvas.height;
  particles.push(p);
}

function renderEmbers() {
  if (atmosphereActive) {
    ctx.clearRect(0, 0, embersCanvas.width, embersCanvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
  }
  requestAnimationFrame(renderEmbers);
}

renderEmbers();

// ==========================================================================
// FALLING SHIULI FLOWERS ENGINE (শরতের শিউলি ফুল ঝরা • Drops gently from the top)
// ==========================================================================
const shiuliCtx = shiuliCanvas ? shiuliCanvas.getContext('2d') : null;
let shiuliFlowers = [];
const SHIULI_COUNT = window.innerWidth < 640 ? 24 : 40;

let shiuliMousePos = { x: -1000, y: -1000 };
window.addEventListener('pointermove', (e) => {
  shiuliMousePos.x = e.clientX;
  shiuliMousePos.y = e.clientY;
});
window.addEventListener('pointerleave', () => {
  shiuliMousePos.x = -1000;
  shiuliMousePos.y = -1000;
});

function resizeShiuliCanvas() {
  if (!shiuliCanvas) return;
  shiuliCanvas.width = window.innerWidth;
  shiuliCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeShiuliCanvas);
resizeShiuliCanvas();

class ShiuliFlower {
  constructor(isInitial = false) {
    this.reset(isInitial);
  }

  reset(isInitial = false) {
    const width = shiuliCanvas ? shiuliCanvas.width : window.innerWidth;
    const height = shiuliCanvas ? shiuliCanvas.height : window.innerHeight;

    // Distributed across the top (with extra horizontal margin for wind sway)
    this.x = Math.random() * (width + 120) - 60;
    this.y = isInitial ? Math.random() * height : -30 - Math.random() * 70;

    // Authentic Shiuli floral characteristics (5 or 6 white petals with vibrant orange center)
    this.petalCount = Math.random() > 0.35 ? 5 : 6;
    this.radius = Math.random() * 6.5 + 8.5; // Radius ~8.5 to 15px (diameter 17-30px)

    // Gentle vertical descent (autumn morning breeze)
    this.speedY = (Math.random() * 0.85 + 0.75) * (this.radius / 11);
    this.driftX = (Math.random() - 0.46) * 0.45;
    this.baseX = this.x;

    // Harmonic horizontal swaying
    this.swayAmp = Math.random() * 24 + 12;
    this.swayFreq = Math.random() * 0.015 + 0.008;
    this.swayPhase = Math.random() * Math.PI * 2;

    // Planar 2D twirling rotation
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.024;

    // 3D perspective tumbling (flipping end-over-end)
    this.flipAngle = Math.random() * Math.PI * 2;
    this.flipSpeed = Math.random() * 0.018 + 0.011;

    // Opacity
    this.alpha = Math.random() * 0.22 + 0.78;
  }

  update(time) {
    const height = shiuliCanvas ? shiuliCanvas.height : window.innerHeight;
    const width = shiuliCanvas ? shiuliCanvas.width : window.innerWidth;

    this.y += this.speedY;
    this.baseX += this.driftX;
    this.x = this.baseX + Math.sin(time * this.swayFreq + this.swayPhase) * this.swayAmp;

    this.rotation += this.rotSpeed;
    this.flipAngle += this.flipSpeed;

    // Interactive deflection when mouse cursor or touch finger approaches
    const dx = this.x - shiuliMousePos.x;
    const dy = this.y - shiuliMousePos.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < 7200) { // ~85px proximity
      const dist = Math.sqrt(distSq) || 1;
      const force = (85 - dist) / 85;
      this.baseX += (dx / dist) * force * 1.8;
      this.y += (dy / dist) * force * 0.9;
      this.rotation += 0.04 * force;
    }

    // When flower falls past bottom or out of screen, recycle to the top
    if (this.y > height + 40 || this.x < -80 || this.x > width + 80) {
      this.reset(false);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // 3D perspective tumbling: compress vertically along axis
    const flipScale = Math.cos(this.flipAngle);
    ctx.scale(1, Math.max(0.16, Math.abs(flipScale)));

    const r = this.radius;
    const petals = this.petalCount;
    const angleStep = (Math.PI * 2) / petals;

    // Subtle drop shadow for petal separation
    ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    for (let i = 0; i < petals; i++) {
      const angle = i * angleStep;
      ctx.save();
      ctx.rotate(angle);

      // Curved pinwheel-like tear-drop petal with rounded tip
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const pw = r * 0.38;
      const pl = r;
      ctx.bezierCurveTo(pw, -pl * 0.35, pw * 0.88, -pl, 0, -pl);
      ctx.bezierCurveTo(-pw * 0.88, -pl, -pw, -pl * 0.35, 0, 0);
      ctx.closePath();

      // Soft ivory to pure white gradient
      const petalGrad = ctx.createLinearGradient(0, 0, 0, -pl);
      petalGrad.addColorStop(0, `rgba(255, 248, 240, ${this.alpha})`);
      petalGrad.addColorStop(0.35, `rgba(255, 255, 255, ${this.alpha})`);
      petalGrad.addColorStop(1, `rgba(250, 248, 242, ${this.alpha * 0.94})`);

      ctx.fillStyle = petalGrad;
      ctx.fill();

      // Delicate center vein
      ctx.strokeStyle = `rgba(235, 225, 210, ${this.alpha * 0.45})`;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.15);
      ctx.lineTo(0, -r * 0.68);
      ctx.stroke();

      ctx.restore();
    }

    // Reset shadow for radiant Shiuli center hub
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 1. Center fiery orange halo
    const coreGrad = ctx.createRadialGradient(0, 0, r * 0.04, 0, 0, r * 0.34);
    coreGrad.addColorStop(0, '#ffa726');
    coreGrad.addColorStop(0.65, '#ff5722');
    coreGrad.addColorStop(1, 'rgba(230, 81, 0, 0.88)');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // 2. Inner deep saffron mouth
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    // 3. Iconic Shiuli orange tubular stem (বোঁটা) visible when tumbling on its underside
    if (flipScale < 0) {
      ctx.fillStyle = '#e65100';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.22, r * 0.14, r * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Populate initial Shiuli flowers
if (shiuliCtx) {
  for (let i = 0; i < SHIULI_COUNT; i++) {
    shiuliFlowers.push(new ShiuliFlower(true));
  }
}

function renderShiuli(timestamp) {
  if (shiuliCtx && shiuliFlowers.length > 0) {
    shiuliCtx.clearRect(0, 0, shiuliCanvas.width, shiuliCanvas.height);
    const time = timestamp * 0.001;
    for (let i = 0; i < shiuliFlowers.length; i++) {
      const flower = shiuliFlowers[i];
      flower.update(time);
      flower.draw(shiuliCtx);
    }
  }
  requestAnimationFrame(renderShiuli);
}

requestAnimationFrame(renderShiuli);

// ==========================================================================
// KEYBOARD NAVIGATION
// ==========================================================================
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  } else if (e.code === 'ArrowRight' || e.code === 'ArrowUp') {
    e.preventDefault();
    tuneToDay(Math.min(PUJA_DAYS.length - 1, currentDayIndex + 1));
  } else if (e.code === 'ArrowLeft' || e.code === 'ArrowDown') {
    e.preventDefault();
    tuneToDay(Math.max(0, currentDayIndex - 1));
  }
});

// ==========================================================================
// INITIALIZE APP
// ==========================================================================
buildFrequencyDialTicks();
setupChannelKnob();
setupVolumeKnob();
startEqualizerVisualizer();
if (btnHome) btnHome.classList.add('active-landing');
updateUIForDay(currentDayIndex, true);
updateTrackBarUI();
renderPlaylistTracks('mahalaya');
setSignalMeter('full');


function fitBgToFreeArea() {
  const dock = document.querySelector('.radio-dock');
  if (!dock) return;
  document.documentElement.style.setProperty('--bg-h', dock.getBoundingClientRect().top + 'px');
}
fitBgToFreeArea();
window.addEventListener('resize', fitBgToFreeArea);
window.addEventListener('orientationchange', fitBgToFreeArea);
const dockEl = document.querySelector('.radio-dock');
if (dockEl && window.ResizeObserver) new ResizeObserver(fitBgToFreeArea).observe(dockEl);

// ==========================================================================
// REMINDERS (Mahalaya etc.)
// ==========================================================================
const REMINDERS = [
  {
    id: 'mahalaya',
    month: 10, day: 10, hour: 4, minute: 0,   // 10 Oct, 4:00 AM local time (change as you like)
    titleBn: 'মহালয়া আসছে! 🪔',
    titleEn: 'Mahalaya is coming!',
    bodyBn: 'ভোর ৪টায় মহিষাসুরমর্দিনী শুনতে রেডিও চালু রাখুন।',
    bodyEn: 'Tune in to Mahishasuramardini at 4 AM.',
  },
];

const remindBtn = document.getElementById('btn-remind');
const remindToast = document.getElementById('remind-toast');
const REMIND_KEY = 'st_reminders_on';
const FIRED_KEY = 'st_reminders_fired';

const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function showRemindToast(msg, ms = 6000) {
  if (!remindToast) return;
  remindToast.textContent = msg;
  remindToast.hidden = false;
  clearTimeout(showRemindToast._t);
  showRemindToast._t = setTimeout(() => (remindToast.hidden = true), ms);
}

function reminderDate(r, year) {
  return new Date(year, r.month - 1, r.day, r.hour, r.minute, 0);
}

function fireReminder(r) {
  const title = `${r.titleBn} • ${r.titleEn}`;
  const body = `${r.bodyBn}\n${r.bodyEn}`;
  showRemindToast(`${title}\n${r.bodyBn}`, 10000);
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification(title, { body, icon: '/images/sharod_taranga_landing.jpg', tag: 'st-' + r.id }); } catch {}
  }
}

function checkReminders() {
  if (!lsGet(REMIND_KEY, false)) return;
  const now = new Date();
  const fired = lsGet(FIRED_KEY, {});
  REMINDERS.forEach((r) => {
    const t = reminderDate(r, now.getFullYear());
    const key = `${r.id}-${now.getFullYear()}`;
    // fire if the time has passed, within the following 24 h, and not already fired this year
    if (now >= t && now - t < 24 * 3600 * 1000 && !fired[key]) {
      fired[key] = true;
      lsSet(FIRED_KEY, fired);
      fireReminder(r);
    }
  });
}

async function enableReminders() {
  let perm = 'default';
  if ('Notification' in window) perm = await Notification.requestPermission();
  lsSet(REMIND_KEY, true);
  remindBtn?.classList.add('is-on');
  const r = REMINDERS[0];
  const d = reminderDate(r, new Date().getFullYear());
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  showRemindToast(
    perm === 'granted'
      ? `🔔 রিমাইন্ডার চালু • Reminder set for ${dateStr}`
      : `🔔 Reminder set for ${dateStr} (browser notifications blocked, you will see an in-page alert)`
  );
  downloadReminderICS();   // also offer the calendar file
}

function disableReminders() {
  lsSet(REMIND_KEY, false);
  remindBtn?.classList.remove('is-on');
  showRemindToast('🔕 রিমাইন্ডার বন্ধ • Reminder off');
}

// Calendar file: this works even when the site is closed
function downloadReminderICS() {
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const events = REMINDERS.map((r) => {
    let d = reminderDate(r, new Date().getFullYear());
    if (d < new Date()) d = reminderDate(r, d.getFullYear() + 1);   // next occurrence
    const end = new Date(d.getTime() + 30 * 60000);
    return [
      'BEGIN:VEVENT',
      `UID:${r.id}-sharod-taranga@local`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(d)}`, `DTEND:${fmt(end)}`,
      'RRULE:FREQ=YEARLY',
      `SUMMARY:${r.titleEn} ${r.titleBn}`,
      `DESCRIPTION:${r.bodyEn} ${r.bodyBn}`,
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', `DESCRIPTION:${r.titleEn}`, 'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sharod Taranga//EN', ...events, 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'sharod-taranga-reminders.ics';
  document.body.appendChild(a); a.click(); a.remove();
}

remindBtn?.addEventListener('click', () => (lsGet(REMIND_KEY, false) ? disableReminders() : enableReminders()));
if (lsGet(REMIND_KEY, false)) remindBtn?.classList.add('is-on');
checkReminders();
setInterval(checkReminders, 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkReminders(); });

// ===== "Click here" hint for the instructions button (5s after landing page appears) =====
(function () {
  const btn = document.getElementById('btn-instructions');
  if (!btn) return;

  const hint = document.createElement('div');
  hint.className = 'instr-hint';
  hint.setAttribute('aria-hidden', 'true');
  document.body.appendChild(hint);

  // Shows only ONE language, following the language toggle
  const TEXT = {
    bn: 'দ্রুত নির্দেশিকার জন্য এখানে ক্লিক করুন',
    en: 'Click here for quick instructions'
  };
    function lang() {
    return document.body.classList.contains('lang-en') ? 'en' : 'bn';
  }
  function render() { hint.textContent = TEXT[lang()]; requestAnimationFrame(place); }
  
    // Place the hint under the 📜 button and aim the arrow at its centre
  function place() {
    const r = btn.getBoundingClientRect();
    const w = hint.offsetWidth;
    const cx = r.left + r.width / 2;
    let left = cx - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    hint.style.left = left + 'px';
    hint.style.right = 'auto';
    hint.style.top = (r.bottom + 10) + 'px';
    hint.style.setProperty('--arrow-x', (cx - left) + 'px');
  }
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.addEventListener('click', () => setTimeout(render, 0));
  

  let shown = false, timer = null;
  function hide() { clearTimeout(timer); hint.classList.remove('show'); }
  function show() {
    if (shown) return;
    shown = true;
    render();    
    place();
    hint.classList.add('show');

    hint.classList.add('show');
    timer = setTimeout(hide, 15000);              // gone 5 seconds after the landing page appears
  }
    window.addEventListener('resize', place);
  btn.addEventListener('click', hide);

  const intro = document.getElementById('intro');
  if (!intro || intro.classList.contains('is-gone')) {
    setTimeout(show, 600);
  } else {
    const mo = new MutationObserver(() => {
      if (intro.classList.contains('is-leaving') || intro.classList.contains('is-gone')) {
        mo.disconnect();
        setTimeout(show, 700);
      }
    });
    mo.observe(intro, { attributes: true, attributeFilter: ['class'] });
  }
})();

// ===== Tip above the radio (follows the page language) =====
(function () {
  const dock = document.querySelector('.radio-dock');
  if (!dock) return;

  const tip = document.createElement('div');
  tip.className = 'radio-tip';
  tip.setAttribute('aria-hidden', 'true');
  dock.insertBefore(tip, dock.firstChild);

  const TEXT = {
    bn: 'রেডিওর দিনগুলিতে ক্লিক করে দিন বদলান, আর ডান দিকের নব ঘুরিয়ে আপনার প্রিয় গান বেছে নিন',
    en: 'Click a day on the radio bar to navigate, and rotate the right knob to tune your favourite song'
  };
  function render() {
    tip.textContent = document.body.classList.contains('lang-en') ? TEXT.en : TEXT.bn;
  }
  render();

  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.addEventListener('click', () => setTimeout(render, 0));
})();