import React, { useState } from 'react';
import { StationData, Language, CuratedTrack } from '../types/radio';
import { Play, Pause, Volume2, VolumeX, ListMusic, ChevronDown, ChevronUp, Disc, Music } from 'lucide-react';
import { playPotentiometerCrunchClick } from '../utils/proceduralAudio';

interface DynamicCornerPlaylistProps {
  activeStation: StationData;
  language: Language;
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isPowered: boolean;
  activeTrackId: string;
  onSelectTrack: (track: CuratedTrack) => void;
}

export const DynamicCornerPlaylist: React.FC<DynamicCornerPlaylistProps> = ({
  activeStation,
  language,
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isPowered,
  activeTrackId,
  onSelectTrack,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const playlist = activeStation.playlist || [];

  return (
    <div
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 select-none animate-fadeIn"
      style={{ willChange: 'transform' }}
    >
      <div className="relative rounded-2xl bg-[#120a07]/90 border border-amber-900/70 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden w-[290px] sm:w-[330px] text-amber-100 transition-all duration-300">
        {/* Subtle amber glass rim highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

        {/* ─── Header: Day Title & Collapse Toggle ─── */}
        <div
          onClick={() => {
            playPotentiometerCrunchClick(0.3);
            setIsCollapsed(!isCollapsed);
          }}
          className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-amber-950/90 via-[#1e100a]/90 to-amber-950/90 border-b border-amber-900/50 cursor-pointer hover:bg-amber-900/30 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-6 h-6 rounded-md bg-stone-950 border border-amber-800/80 flex items-center justify-center flex-none">
              <Disc
                className={`w-4 h-4 text-amber-500 ${
                  isPlaying && isPowered ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '4s' }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeStation.themeColor }} />
                <h4 className="text-xs font-serif font-bold text-amber-200 truncate">
                  {language === 'bn' ? `${activeStation.nameBn}র গান ও পাঠ` : `${activeStation.nameEn} Playlist`}
                </h4>
              </div>
              <p className="text-[9px] font-mono text-amber-400/70 truncate">
                {playlist.length} {language === 'bn' ? 'টি সুর ও পাঠ' : 'Curated Tracks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-stone-400 hover:text-amber-300">
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {/* ─── Dynamic Playlist Tracks (Collapsible) ─── */}
        {!isCollapsed && (
          <div className="max-h-44 sm:max-h-52 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
            {playlist.map((track, idx) => {
              const isActive = track.id === activeTrackId || (!activeTrackId && idx === 0);
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    playPotentiometerCrunchClick(0.5);
                    onSelectTrack(track);
                  }}
                  className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-amber-950/80 border border-amber-600/50 shadow-sm'
                      : 'hover:bg-black/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-none transition-all ${
                        isActive && isPlaying && isPowered
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-900 border border-amber-900/60 text-amber-400 group-hover:border-amber-500'
                      }`}
                    >
                      {isActive && isPlaying && isPowered ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-tiro truncate ${
                          isActive ? 'text-amber-200 font-bold' : 'text-stone-300 group-hover:text-amber-200'
                        }`}
                      >
                        {language === 'bn' ? track.titleBn : track.titleEn}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {language === 'bn' ? track.artistBn : track.artistEn}
                      </p>
                    </div>
                  </div>

                  {track.duration && (
                    <span className="text-[9px] font-mono text-stone-500 group-hover:text-stone-300 flex-none ml-2">
                      {track.duration}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Compact Transport & Volume Dock ─── */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#0c0604]/90 border-t border-amber-950/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playPotentiometerCrunchClick(0.6);
                onTogglePlay();
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isPlaying && isPowered
                  ? 'bg-amber-500 text-stone-950 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                  : 'bg-gradient-to-b from-amber-600 to-amber-800 text-white hover:from-amber-500 hover:to-amber-700'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying && isPowered ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
            <span className="text-[9px] font-mono text-amber-400">
              {isPlaying && isPowered ? (language === 'bn' ? 'বাজছে' : 'PLAYING') : (language === 'bn' ? 'থামানো' : 'PAUSED')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playPotentiometerCrunchClick(0.3);
                onToggleMute();
              }}
              className="p-1 rounded text-stone-400 hover:text-amber-300 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-14 sm:w-16 h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-amber-500"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
