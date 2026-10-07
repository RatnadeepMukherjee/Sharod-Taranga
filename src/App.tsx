/**
 * আগমনী বেতার • Agomoni Betar — 1970s Akashvani Durga Pujo Radio
 * A single-viewport interactive vintage Calcutta valve radio journeying
 * through the 6 sacred days of Durga Puja.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TimeOfDay, Language, RadioBand, StationData, CuratedTrack } from './types/radio';
import { PUJA_STATIONS, getAtmosphereByTime } from './data/pujaStations';
import { LiquidGlassFilter } from './components/LiquidGlassFilter';
import { FallingShiuliCanvas } from './components/FallingShiuliCanvas';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { AkashvaniHeader } from './components/AkashvaniHeader';
import { VintageRadioConsole } from './components/VintageRadioConsole';
import { NostalgiaQuoteCard } from './components/NostalgiaQuoteCard';
import { DynamicCornerPlaylist } from './components/DynamicCornerPlaylist';
import { YouTubeAudioPlayer } from './components/YouTubeAudioPlayer';
import { CustomPlaylistModal } from './components/CustomPlaylistModal';
import { RadioInfoModal } from './components/RadioInfoModal';
import {
  ProceduralStaticHissGenerator,
  ProceduralPujaSynth,
  playPotentiometerCrunchClick,
} from './utils/proceduralAudio';

export default function App() {
  // 1. Atmosphere Engine (Dawn, Day, Dusk, Night)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getAtmosphereByTime());
  const [isAutoAtmosphere, setIsAutoAtmosphere] = useState<boolean>(true);

  // 2. Language Toggle (Bengali / English)
  const [language, setLanguage] = useState<Language>('bn');

  // 3. Radio State (6 Sacred Days: Mahalaya to Dashami)
  const [isPowered, setIsPowered] = useState<boolean>(true);
  const [activeBand, setActiveBand] = useState<RadioBand>('FM');
  const [activeStationIndex, setActiveStationIndex] = useState<number>(0);
  const activeStation = PUJA_STATIONS[activeStationIndex] || PUJA_STATIONS[0];

  // Frequency in MHz (88.0 to 108.0)
  const [frequency, setFrequency] = useState<number>(activeStation.frequency);

  // Track selection inside active day's dynamic playlist
  const [activeTrackId, setActiveTrackId] = useState<string>(
    activeStation.playlist[0]?.id || ''
  );

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioSource, setAudioSource] = useState<'broadcast' | 'synth'>('broadcast');

  // Modals
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // Custom YouTube map from localStorage
  const [customYoutubeMap, setCustomYoutubeMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('agomoni_custom_playlist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Procedural Static Hiss Engine Ref
  const staticHissRef = useRef<ProceduralStaticHissGenerator | null>(null);

  // Initialize Static Hiss Generator on mount
  useEffect(() => {
    staticHissRef.current = new ProceduralStaticHissGenerator();
    return () => {
      staticHissRef.current?.stop();
      ProceduralPujaSynth.stop();
    };
  }, []);

  // Update static hiss power & volume
  useEffect(() => {
    if (staticHissRef.current) {
      staticHissRef.current.setPower(isPowered);
      staticHissRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [isPowered, volume, isMuted]);

  // Compute tuning accuracy (closeness to active station)
  const tuningAccuracy = Math.max(
    0,
    1 - Math.min(1, Math.abs(frequency - activeStation.frequency) / 0.7)
  );

  // Auto-sync atmosphere with real local time
  useEffect(() => {
    if (!isAutoAtmosphere) return;
    const checkTime = () => {
      setTimeOfDay(getAtmosphereByTime());
    };
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, [isAutoAtmosphere]);

  // Handle station selection
  const handleSelectStation = useCallback(
    (station: StationData) => {
      const index = PUJA_STATIONS.findIndex((s) => s.id === station.id);
      if (index !== -1) {
        setActiveStationIndex(index);
        setFrequency(station.frequency);
        // Switch to the first track of the new station
        setActiveTrackId(station.playlist[0]?.id || '');

        // Stimulate static sweep
        staticHissRef.current?.reportTuningVelocity(0.7);

        // If synth mode, update preset
        if (audioSource === 'synth' && isPlaying && isPowered) {
          ProceduralPujaSynth.start(station.synthPreset, isMuted ? 0 : volume * 0.7);
        }
      }
    },
    [audioSource, isPlaying, isPowered, isMuted, volume]
  );

  // Handle track selection from corner dynamic playlist
  const handleSelectTrack = useCallback((track: CuratedTrack) => {
    setActiveTrackId(track.id);
    setIsPlaying(true);
    if (!isPowered) {
      setIsPowered(true);
    }
  }, [isPowered]);

  // Handle frequency change from tuning knob or dial drag
  const handleFrequencyChange = useCallback(
    (newFreq: number, velocity: number = 0.5) => {
      setFrequency(newFreq);
      staticHissRef.current?.reportTuningVelocity(velocity);

      // Snap or find closest station if within snap threshold
      const closest = PUJA_STATIONS.reduce((prev, curr) =>
        Math.abs(curr.frequency - newFreq) < Math.abs(prev.frequency - newFreq) ? curr : prev
      );

      if (Math.abs(closest.frequency - newFreq) < 0.45) {
        const index = PUJA_STATIONS.findIndex((s) => s.id === closest.id);
        if (index !== activeStationIndex) {
          setActiveStationIndex(index);
          setActiveTrackId(closest.playlist[0]?.id || '');
          if (audioSource === 'synth' && isPlaying && isPowered) {
            ProceduralPujaSynth.start(closest.synthPreset, isMuted ? 0 : volume * 0.7);
          }
        }
      }
    },
    [activeStationIndex, audioSource, isPlaying, isPowered, isMuted, volume]
  );

  // Handle Power toggle
  const handleTogglePower = useCallback(() => {
    setIsPowered((prev) => {
      const next = !prev;
      if (!next) {
        setIsPlaying(false);
        ProceduralPujaSynth.stop();
      }
      return next;
    });
  }, []);

  // Handle Play/Pause
  const handleTogglePlay = useCallback(() => {
    if (!isPowered) {
      setIsPowered(true);
    }
    setIsPlaying((prev) => {
      const nextState = !prev;
      if (nextState) {
        if (audioSource === 'synth') {
          ProceduralPujaSynth.start(activeStation.synthPreset, isMuted ? 0 : volume * 0.7);
        }
      } else {
        ProceduralPujaSynth.stop();
      }
      return nextState;
    });
  }, [isPowered, audioSource, activeStation, isMuted, volume]);

  // Navigate stations (Next / Previous day)
  const handlePrevDay = useCallback(() => {
    const nextIdx = (activeStationIndex - 1 + PUJA_STATIONS.length) % PUJA_STATIONS.length;
    handleSelectStation(PUJA_STATIONS[nextIdx]);
  }, [activeStationIndex, handleSelectStation]);

  const handleNextDay = useCallback(() => {
    const nextIdx = (activeStationIndex + 1) % PUJA_STATIONS.length;
    handleSelectStation(PUJA_STATIONS[nextIdx]);
  }, [activeStationIndex, handleSelectStation]);

  // Audio source switcher (Broadcast vs Synth)
  const handleToggleAudioSource = useCallback(() => {
    setAudioSource((prev) => {
      const nextSource = prev === 'broadcast' ? 'synth' : 'broadcast';
      if (nextSource === 'synth' && isPlaying && isPowered) {
        ProceduralPujaSynth.start(activeStation.synthPreset, isMuted ? 0 : volume * 0.7);
      } else {
        ProceduralPujaSynth.stop();
      }
      return nextSource;
    });
  }, [isPlaying, isPowered, activeStation, isMuted, volume]);

  // Fallback to Synth if YouTube fails or is blocked
  const handleYouTubePlaybackError = useCallback(() => {
    console.warn('YouTube broadcast stream error. Seamlessly switching to Procedural Puja Synth.');
    setAudioSource('synth');
    if (isPlaying && isPowered) {
      ProceduralPujaSynth.start(activeStation.synthPreset, isMuted ? 0 : volume * 0.7);
    }
  }, [isPlaying, isPowered, activeStation, isMuted, volume]);

  // Save custom playlist
  const handleSaveCustomMap = (newMap: Record<string, string>) => {
    setCustomYoutubeMap(newMap);
    try {
      localStorage.setItem('agomoni_custom_playlist', JSON.stringify(newMap));
    } catch {}
  };

  const handleResetDefaults = () => {
    setCustomYoutubeMap({});
    try {
      localStorage.removeItem('agomoni_custom_playlist');
    } catch {}
  };

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        playPotentiometerCrunchClick(0.6);
        handleTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        playPotentiometerCrunchClick(0.5);
        handlePrevDay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        playPotentiometerCrunchClick(0.5);
        handleNextDay();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        playPotentiometerCrunchClick(0.4);
        setIsMuted((prev) => !prev);
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        playPotentiometerCrunchClick(0.8);
        handleTogglePower();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handlePrevDay, handleNextDay, handleTogglePower]);

  // Active track youtube ID resolution
  const currentTrack = activeStation.playlist?.find((t) => t.id === activeTrackId);
  const activeVideoId =
    customYoutubeMap[activeStation.id] || currentTrack?.youtubeId || activeStation.youtubeId;

  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-between overflow-hidden select-none bg-[#0a0503] text-amber-100 font-sans">
      {/* ════════════ BACKGROUND ATMOSPHERIC STACK ════════════ */}
      <AtmosphericBackground
        timeOfDay={timeOfDay}
        activeStation={activeStation}
        isRadioOn={isPowered}
      />

      {/* SVG Liquid Glass Refraction Filter Definition */}
      <LiquidGlassFilter />

      {/* Slow Autumn Shiuli Petals & Bottom Dhunuchi Smoke Plumes */}
      <FallingShiuliCanvas />

      {/* Sandboxed Declarative YouTube Audio Stream Engine */}
      <YouTubeAudioPlayer
        videoId={activeVideoId}
        isPlaying={isPlaying && isPowered && audioSource === 'broadcast'}
        volume={volume}
        isMuted={isMuted}
        onPlaybackError={handleYouTubePlaybackError}
        onTrackEnd={handleNextDay}
      />

      {/* ════════════ TOP SECTION (Flex: None) ════════════ */}
      <div className="flex-none w-full relative z-30">
        <AkashvaniHeader
          timeOfDay={timeOfDay}
          onTimeOfDayChange={(t) => {
            setIsAutoAtmosphere(false);
            setTimeOfDay(t);
          }}
          isAutoAtmosphere={isAutoAtmosphere}
          onToggleAutoAtmosphere={() => setIsAutoAtmosphere(!isAutoAtmosphere)}
          language={language}
          onLanguageChange={setLanguage}
          activeStation={activeStation}
          activeBand={activeBand}
          isPowered={isPowered}
          onOpenPlaylistModal={() => setIsPlaylistModalOpen(true)}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
        />

        {/* Hero Title & Sub-heading (Compact Profile) */}
        <div className="hero-typography text-center pt-1 px-3">
          <h1 className="font-tiro font-bold text-base sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-200 drop-shadow-md">
            {language === 'bn'
              ? 'আগমনী বেতার • ১৯৭০-এর কলকাতার আকাশবাণী'
              : 'Agomoni Betar • 1970s Akashvani Calcutta Radio'}
          </h1>
          <p className="text-[9.5px] sm:text-[11px] text-amber-300/80 font-serif italic">
            {language === 'bn'
              ? 'শারদোৎসবের ছয়টি পবিত্র দিন ও আগমনী সুর • মহালয়া থেকে দশমী'
              : 'Journey through the 6 sacred days of Durga Puja with vintage valve receiver tuning'}
          </p>
        </div>
      </div>

      {/* ════════════ CENTER RADIO WRAPPER (Compact, Centered) ════════════ */}
      <main className="flex-1 min-h-0 w-full flex items-center justify-center relative z-20 px-2 sm:px-4 py-1">
        <VintageRadioConsole
          activeStation={activeStation}
          onSelectStation={handleSelectStation}
          frequency={frequency}
          onFrequencyChange={handleFrequencyChange}
          isPowered={isPowered}
          onTogglePower={handleTogglePower}
          volume={volume}
          onVolumeChange={setVolume}
          activeBand={activeBand}
          onBandChange={setActiveBand}
          language={language}
          isPlaying={isPlaying}
          tuningAccuracy={tuningAccuracy}
          audioSource={audioSource}
        />
      </main>

      {/* ════════════ BOTTOM SECTION (Flex: None) ════════════ */}
      <footer className="flex-none w-full relative z-20">
        {/* Curated Literature Nostalgia Quote Card (Sleek Compact Bar) */}
        <NostalgiaQuoteCard
          activeStation={activeStation}
          language={language}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
        />
      </footer>

      {/* ════════════ DYNAMIC CORNER MUSIC PLAYLIST ════════════ */}
      <DynamicCornerPlaylist
        activeStation={activeStation}
        language={language}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        volume={volume}
        onVolumeChange={setVolume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        isPowered={isPowered}
        activeTrackId={activeTrackId}
        onSelectTrack={handleSelectTrack}
      />

      {/* ════════════ MODALS ════════════ */}
      <CustomPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        stations={PUJA_STATIONS}
        customYoutubeMap={customYoutubeMap}
        onSaveCustomMap={handleSaveCustomMap}
        onResetDefaults={handleResetDefaults}
        language={language}
      />

      <RadioInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        language={language}
      />
    </div>
  );
}
