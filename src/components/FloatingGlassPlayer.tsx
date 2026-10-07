import React, { useState } from 'react';
import { StationData, Language } from '../types/radio';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, Radio, Music } from 'lucide-react';
import { playPotentiometerCrunchClick } from '../utils/proceduralAudio';

interface FloatingGlassPlayerProps {
  activeStation: StationData;
  language: Language;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  audioSource: 'broadcast' | 'synth';
  onToggleAudioSource: () => void;
  isPowered: boolean;
  onFrequencyChange: (freq: number) => void;
}

export const FloatingGlassPlayer: React.FC<FloatingGlassPlayerProps> = ({
  activeStation,
  language,
  isPlaying,
  onTogglePlay,
  onPrevDay,
  onNextDay,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  audioSource,
  onToggleAudioSource,
  isPowered,
  onFrequencyChange,
}) => {
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  return (
    <div
      className="fixed-glass-player fixed bottom-1.5 inset-x-2 sm:inset-x-6 max-w-4xl mx-auto z-40 select-none"
      style={{ willChange: 'transform' }}
    >
      <div className="relative rounded-2xl bg-[#120a07]/85 border border-amber-900/60 backdrop-blur-xl px-3 sm:px-5 py-2 shadow-2xl flex items-center justify-between gap-3 text-amber-100">
        {/* Subtle glass edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

        {/* Left: Cassette Tape Spools Animation & Track Metadata */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Animated Cassette Spool Wheels */}
          <div
            className="flex-none relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-950 border border-amber-800/60 flex items-center justify-center overflow-hidden shadow-inner group cursor-pointer"
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {/* Spinning Cassette Cog Wheel 1 */}
            <Disc
              className={`w-6 h-6 text-amber-500/80 transition-transform ${
                isPlaying && isPowered ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
            {/* Center magnetic tape hub indicator */}
            <div className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-tiro font-bold text-amber-200 truncate">
                {language === 'bn' ? activeStation.trackTitleBn : activeStation.trackTitleEn}
              </h4>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-600/30 text-amber-400 hidden xs:inline">
                {activeStation.frequency} MHz
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-sans text-amber-400/80 truncate">
              {language === 'bn' ? activeStation.artistBn : activeStation.artistEn}
            </p>
          </div>
        </div>

        {/* Center: Audio Source Switcher & Transport Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Broadcast vs Synth Mode Switcher */}
          <button
            onClick={() => {
              playPotentiometerCrunchClick(0.5);
              onToggleAudioSource();
            }}
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono border transition-all bg-black/40 hover:bg-amber-950/80"
            title={
              audioSource === 'broadcast'
                ? 'Currently Akashvani Airwaves. Click for Synthetic Acoustic Instrument Ensemble'
                : 'Currently Synthesized Instruments. Click for Akashvani Airwaves'
            }
          >
            {audioSource === 'broadcast' ? (
              <>
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                <span className="text-amber-300">
                  {language === 'bn' ? 'আকাশবাণী প্রচার' : 'Akashvani Feed'}
                </span>
              </>
            ) : (
              <>
                <Music className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">
                  {language === 'bn' ? 'বাদ্যযন্ত্র বাদ্য' : 'Synth Orchestra'}
                </span>
              </>
            )}
          </button>

          {/* Previous Station */}
          <button
            onClick={() => {
              playPotentiometerCrunchClick(0.4);
              onPrevDay();
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-amber-950/60 text-amber-300 hover:text-amber-100 transition-colors"
            title="Previous Station (Left Arrow)"
          >
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={() => {
              playPotentiometerCrunchClick(0.7);
              onTogglePlay();
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
              isPlaying && isPowered
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white'
            }`}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying && isPowered ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next Station */}
          <button
            onClick={() => {
              playPotentiometerCrunchClick(0.4);
              onNextDay();
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-amber-950/60 text-amber-300 hover:text-amber-100 transition-colors"
            title="Next Station (Right Arrow)"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Right: Volume & Shortcuts Tooltip */}
        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            onClick={() => {
              playPotentiometerCrunchClick(0.3);
              onToggleMute();
            }}
            className="p-1.5 rounded-full hover:bg-amber-950/60 text-amber-400 hover:text-amber-200 transition-colors"
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Volume Slider (Hidden on smallest mobile screen) */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              if (isMuted) onToggleMute();
              onVolumeChange(parseFloat(e.target.value));
            }}
            className="hidden sm:inline-block w-16 sm:w-20 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            aria-label="Master Volume"
          />

          {/* Keyboard shortcut hint icon */}
          <span className="hidden xl:inline text-[9px] font-mono text-stone-400 border border-stone-800 px-1 py-0.5 rounded">
            SPACE • ⇄ • M
          </span>
        </div>
      </div>
    </div>
  );
};
