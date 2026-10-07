import React, { useState, useEffect } from 'react';
import { TuningDial } from './TuningDial';
import { RadioGrille } from './RadioGrille';
import { InteractiveKnob } from './InteractiveKnob';
import { AlponaBorder } from './AlponaBorder';
import { ShiuliPetals } from './ShiuliPetals';
import { audioEngine, PUJA_STATIONS, StationData } from '../utils/audioEngine';
import { Volume2, VolumeX, Radio as RadioIcon, Music, Bell, Flame } from 'lucide-react';

interface InteractiveRadioDeviceProps {
  onOpenStory: () => void;
}

export const InteractiveRadioDevice: React.FC<InteractiveRadioDeviceProps> = ({ onOpenStory }) => {
  const [isPowered, setIsPowered] = useState(false);
  const [frequency, setFrequency] = useState(92.4); // Maha Shashthi default
  const [volume, setVolume] = useState(0.75);
  const [bass, setBass] = useState(0.65);
  const [treble, setTreble] = useState(0.55);
  const [dhakIntensity, setDhakIntensity] = useState(0.7);
  const [isDhakActive, setIsDhakActive] = useState(true);
  const [activeStation, setActiveStation] = useState<StationData>(PUJA_STATIONS[1]);
  const [clarity, setClarity] = useState(1);

  // Shiuli flowers resting naturally on top of the radio
  const [flowers, setFlowers] = useState([
    { id: 1, xPercent: 18, yOffset: -8, rotation: -14, scale: 0.95 },
    { id: 2, xPercent: 24, yOffset: -2, rotation: 28, scale: 1.1 },
    { id: 3, xPercent: 32, yOffset: -6, rotation: 85, scale: 0.9 },
    { id: 4, xPercent: 78, yOffset: -7, rotation: -42, scale: 1.05 },
    { id: 5, xPercent: 84, yOffset: -1, rotation: 18, scale: 0.88 },
  ]);

  // Handle frequency changes
  useEffect(() => {
    audioEngine.setFrequency(frequency);
    const status = audioEngine.getTuningStatus();
    setActiveStation(status.station);
    setClarity(status.clarity);
  }, [frequency]);

  const handleTogglePower = () => {
    const next = !isPowered;
    setIsPowered(next);
    audioEngine.setPower(next);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  };

  const handleBassChange = (b: number) => {
    setBass(b);
    audioEngine.setBass(b);
  };

  const handleTrebleChange = (t: number) => {
    setTreble(t);
    audioEngine.setTreble(t);
  };

  const handleDhakKnobChange = (val: number) => {
    setDhakIntensity(val);
    if (!isDhakActive && val > 0.1) {
      setIsDhakActive(true);
      audioEngine.toggleDhak(true);
    }
  };

  const handleToggleDhakDrum = () => {
    const next = !isDhakActive;
    setIsDhakActive(next);
    audioEngine.toggleDhak(next);
  };

  const handleTuningKnob = (val: number) => {
    // Map knob value 0-1 to 87.0 - 108.5 MHz
    const freq = Number((87.0 + val * (108.5 - 87.0)).toFixed(1));
    setFrequency(freq);
  };

  const handleFlowerClick = (id: number) => {
    // Randomize petal rotation on click
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, rotation: f.rotation + 45 } : f))
    );
  };

  const addMoreShiuli = () => {
    if (flowers.length >= 12) return;
    const newFlower = {
      id: Date.now(),
      xPercent: 15 + Math.random() * 70,
      yOffset: -12 + Math.random() * 14,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4,
    };
    setFlowers((prev) => [...prev, newFlower]);
  };

  const normFreqKnobVal = (frequency - 87.0) / (108.5 - 87.0);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Radio Unit Container with realistic top handle & antenna */}
      <div className="relative w-full max-w-4xl pt-10 select-none">
        
        {/* Short Chrome Antenna angled up-right */}
        <div className="absolute top-2 right-16 md:right-28 pointer-events-none z-10 flex flex-col items-center origin-bottom rotate-[28deg]">
          {/* Antenna tip sphere */}
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-stone-200 via-white to-stone-400 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          {/* Telescopic chrome mast */}
          <div
            className="w-1.5 h-24 md:h-32 rounded-t-sm shadow-md"
            style={{
              background: 'linear-gradient(to right, #94a3b8, #f8fafc 50%, #64748b)',
            }}
          />
        </div>

        {/* Fold-down Brass Carrying Handle */}
        <div className="absolute top-4 inset-x-0 mx-auto w-56 md:w-80 h-10 pointer-events-none z-20 flex justify-center">
          {/* Curved Brass bar */}
          <div
            className="w-full h-full rounded-t-2xl border-t-8 border-x-8 border-amber-600/90 shadow-xl"
            style={{
              background: 'transparent',
              borderColor: '#c6922b',
              boxShadow: '0 -4px 10px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        {/* Fresh Shiuli Flowers resting naturally on top edge */}
        <ShiuliPetals flowers={flowers} onFlowerClick={handleFlowerClick} />

        {/* Radio Chassis Body:
            Rectangular body with rounded corners, antique brass metal panels,
            and deep vermilion-red (sindoor) enamel trim */}
        <div
          className="relative w-full rounded-3xl p-3 md:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),_0_0_20px_rgba(180,83,9,0.3)] transition-all duration-300"
          style={{
            // Deep vermilion-red sindoor enamel outer rim with antique brass inner bevel
            backgroundColor: '#871a17',
            backgroundImage: `
              radial-gradient(circle at 50% 0%, #a82320 0%, #6d1311 70%, #460b09 100%)
            `,
            border: '5px solid #d4af37',
            boxShadow: `
              inset 0 0 16px rgba(0,0,0,0.8),
              0 20px 40px rgba(0,0,0,0.85),
              0 0 0 2px #53100f
            `,
          }}
        >
          {/* Top brass panel header & model badge */}
          <div className="flex items-center justify-between px-3 pb-3 border-b border-amber-800/60">
            <div className="flex items-center gap-2">
              {/* Embossed vintage brand mark */}
              <div
                className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/50 shadow-inner flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_4px_#ef4444]" />
                <span className="font-serif font-black tracking-widest text-amber-200 text-xs md:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  SHAROD-TARANGA
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">1974 MK-IV</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-serif tracking-wider text-amber-300/80 hidden sm:inline">
                আকাশবাণী কলকাতা সম্প্রচার
              </span>

              {/* Power Indicator Light */}
              <button
                onClick={handleTogglePower}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-600/60 hover:border-amber-400 transition-all cursor-pointer shadow-md"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isPowered
                      ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b,0_0_4px_#fff]'
                      : 'bg-stone-800'
                  }`}
                />
                <span className="text-[11px] font-mono font-bold text-amber-200">
                  {isPowered ? 'PWR ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

          {/* Upper Section:
              Left half: Woven cane speaker grille (dhunuchi texture)
              Right half: Dark smoked-glass frequency display window with glowing amber dial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 my-3 h-52 md:h-64">
            
            {/* Left: Speaker Grille */}
            <div className="w-full h-full">
              <RadioGrille isPlaying={isPowered && clarity > 0.3} intensity={dhakIntensity} />
            </div>

            {/* Right: Smoked Glass Dial */}
            <div className="w-full h-full">
              <TuningDial
                frequency={frequency}
                isPowered={isPowered}
                onFrequencyChange={(f) => setFrequency(f)}
                activeStation={activeStation}
                tuningClarity={clarity}
              />
            </div>
          </div>

          {/* Thin brass trim line with delicate alpona (rice-paste floral pattern) engraved border */}
          <AlponaBorder />

          {/* Lower Section:
              Row of five round brass knobs.
              The center knob is slightly larger and embossed with a small dhak (drum) icon */}
          <div className="pt-3 pb-2 px-2 md:px-6 bg-gradient-to-b from-stone-950/60 to-black/80 rounded-2xl border border-amber-900/40 shadow-inner">
            <div className="flex items-center justify-around gap-2 md:gap-4">
              
              {/* Knob 1: Power & Volume */}
              <InteractiveKnob
                label="Volume"
                sublabel="শব্দ"
                value={volume}
                icon="power"
                onChange={handleVolumeChange}
                onClick={handleTogglePower}
              />

              {/* Knob 2: Bass Warmth */}
              <InteractiveKnob
                label="Bass"
                sublabel="গম্ভীর"
                value={bass}
                icon="tone"
                onChange={handleBassChange}
              />

              {/* Knob 3: Center Dhak / Diya Drum Knob (Embossed & Slightly Larger) */}
              <div className="relative group">
                <InteractiveKnob
                  label="Dhak Rhythm"
                  sublabel="ঢাকের বোল"
                  value={dhakIntensity}
                  isCenter={true}
                  icon="dhak"
                  onChange={handleDhakKnobChange}
                  onClick={handleToggleDhakDrum}
                />
                {/* Active pulse aura around center knob */}
                {isPowered && isDhakActive && (
                  <div className="absolute -inset-1 rounded-full border border-amber-400/40 pointer-events-none animate-ping opacity-30" />
                )}
              </div>

              {/* Knob 4: Treble / Filter */}
              <InteractiveKnob
                label="Treble"
                sublabel="তীক্ষ্ণ"
                value={treble}
                icon="tone"
                onChange={handleTrebleChange}
              />

              {/* Knob 5: Tuning */}
              <InteractiveKnob
                label="Tuning"
                sublabel="টিউনিং"
                value={normFreqKnobVal}
                icon="tune"
                onChange={handleTuningKnob}
              />

            </div>
          </div>

          {/* Bottom subtle brass feet & vent slits */}
          <div className="mt-3 flex justify-between items-center text-[10px] text-amber-500/60 font-mono px-3">
            <span>CALCUTTA ALL INDIA RADIO CO. LTD.</span>
            <span>SOLID STATE 12-TRANSISTOR DUAL CONE</span>
            <span>SHARODOTSAV 1974</span>
          </div>
        </div>

        {/* Realistic radio wooden/brass pedestal feet */}
        <div className="flex justify-between px-12 md:px-20 -mt-2 pointer-events-none">
          <div className="w-12 h-3 rounded-b-md bg-stone-900 border-x-2 border-b-2 border-amber-700/80 shadow-lg" />
          <div className="w-12 h-3 rounded-b-md bg-stone-900 border-x-2 border-b-2 border-amber-700/80 shadow-lg" />
        </div>
      </div>

      {/* Broadcast Info & Ritual Sound Card */}
      <div className="w-full max-w-4xl mt-6 p-4 md:p-5 rounded-2xl bg-stone-900/90 border border-amber-800/60 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
              <RadioIcon className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg md:text-xl text-amber-100">
                  {activeStation.name}
                </h3>
                <span className="font-serif text-sm text-amber-400/90 font-medium">
                  ({activeStation.bengaliName})
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/80 text-red-300 border border-red-800/60">
                  {activeStation.frequency} MHz
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-serif italic mt-0.5">
                {activeStation.bengaliDesc}
              </p>
            </div>
          </div>

          {/* Quick Action Sound Triggers */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Shankha blow trigger */}
            <button
              onClick={() => {
                if (!isPowered) handleTogglePower();
                audioEngine.triggerShankha();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 border border-amber-600/60 text-amber-200 text-xs font-serif font-semibold shadow-sm transition-all active:scale-95"
              title="Blow the auspicious Shankha (conch shell)"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Blow Shankha (শঙ্খ)</span>
            </button>

            {/* Dhak drum roll trigger */}
            <button
              onClick={() => {
                if (!isPowered) handleTogglePower();
                audioEngine.triggerDhakDhom(0, 1.0);
                audioEngine.triggerDhakKiti(0.12, 540, 0.8);
                audioEngine.triggerDhakKiti(0.24, 520, 0.8);
                audioEngine.triggerKashorGhanta(0);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-red-700/60 text-amber-100 text-xs font-serif font-semibold shadow-sm transition-all active:scale-95"
              title="Hit a heavy Dhak drum stroke"
            >
              <Music className="w-3.5 h-3.5 text-red-400" />
              <span>Dhak Beat (ঢাক)</span>
            </button>

            {/* Add Shiuli flower */}
            <button
              onClick={addMoreShiuli}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 text-xs transition-all"
              title="Place another fresh night jasmine on the radio"
            >
              <span>+ Shiuli (ফুল)</span>
            </button>
          </div>
        </div>

        {/* Detailed Ritual Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs text-amber-200/90 font-sans">
          <div className="space-y-1">
            <span className="font-serif font-bold text-amber-400 text-xs uppercase tracking-wider block">
              Sacred Ritual
            </span>
            <p className="text-stone-300 leading-relaxed">{activeStation.ritual}</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif font-bold text-amber-400 text-xs uppercase tracking-wider block">
              Cultural Significance
            </span>
            <p className="text-stone-300 leading-relaxed">{activeStation.significance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
