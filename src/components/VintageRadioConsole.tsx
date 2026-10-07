import React, { useRef, useCallback, useEffect, useState } from 'react';
import { StationData, RadioBand, Language } from '../types/radio';
import { PUJA_STATIONS } from '../data/pujaStations';
import { playPotentiometerCrunchClick } from '../utils/proceduralAudio';
import { Play, Pause } from 'lucide-react';

interface VintageRadioConsoleProps {
  activeStation: StationData;
  onSelectStation: (station: StationData) => void;
  frequency: number;
  onFrequencyChange: (freq: number, velocity?: number) => void;
  isPowered: boolean;
  onTogglePower: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  activeBand: RadioBand;
  onBandChange: (band: RadioBand) => void;
  language: Language;
  isPlaying: boolean;
  tuningAccuracy: number;
  audioSource?: 'broadcast' | 'synth';
}

const CHANNEL_ANGLES = [-125, -75, -25, 25, 75, 125];

export const VintageRadioConsole: React.FC<VintageRadioConsoleProps> = ({
  activeStation,
  onSelectStation,
  onTogglePower,
  volume,
  onVolumeChange,
  language,
  isPlaying,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const eqCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const channelKnobRef = useRef<HTMLDivElement | null>(null);
  const volKnobRef = useRef<HTMLDivElement | null>(null);

  // Find index of current station in the 6 sacred days
  const currentIndex = Math.max(
    0,
    PUJA_STATIONS.findIndex((s) => s.id === activeStation.id)
  );

  const needlePercent = (currentIndex / Math.max(1, PUJA_STATIONS.length - 1)) * 100;

  // Knob rotation angles
  const [channelAngle, setChannelAngle] = useState(CHANNEL_ANGLES[currentIndex] || -125);
  const [isRotatingChannel, setIsRotatingChannel] = useState(false);

  // Volume: -135deg to +135deg (total 270deg)
  const volAngle = -135 + Math.max(0, Math.min(1, volume)) * 270;
  const [isRotatingVol, setIsRotatingVol] = useState(false);

  // Sync channel angle when activeStation changes externally
  useEffect(() => {
    if (!isRotatingChannel) {
      setChannelAngle(CHANNEL_ANGLES[currentIndex] || -125);
    }
  }, [currentIndex, isRotatingChannel]);

  // Handle tuning to day
  const handleSelectDay = useCallback(
    (index: number) => {
      if (index < 0 || index >= PUJA_STATIONS.length) return;
      playPotentiometerCrunchClick(0.6);
      onSelectStation(PUJA_STATIONS[index]);
    },
    [onSelectStation]
  );

  // Frequency line click / drag
  const handleTrackInteraction = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetIndex = Math.round(ratio * (PUJA_STATIONS.length - 1));
      handleSelectDay(targetIndex);
    },
    [handleSelectDay]
  );

  // Equalizer visualizer animation on canvas
  useEffect(() => {
    const canvas = eqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const barCount = 26;
    const barHeights = new Array(barCount).fill(1.5);
    const peakValues = new Array(barCount).fill(0);

    const render = () => {
      animId = requestAnimationFrame(render);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const totalGaps = (barCount - 1) * 2.5;
      const barWidth = Math.max(3, (w - totalGaps) / barCount);

      for (let i = 0; i < barCount; i++) {
        let targetH = 1.5;
        if (isPlaying) {
          const wave = Math.sin(Date.now() * 0.007 + i * 0.55) * 0.5 + 0.5;
          targetH = 2 + wave * (h * 0.7);
        } else {
          const idle = Math.sin(Date.now() * 0.002 + i * 0.3) * 0.5 + 0.5;
          targetH = 1.5 + idle * 1.5;
        }

        barHeights[i] += (targetH - barHeights[i]) * 0.35;
        if (barHeights[i] >= peakValues[i]) {
          peakValues[i] = barHeights[i];
        } else {
          peakValues[i] = Math.max(0, peakValues[i] - 0.2);
        }

        const x = i * (barWidth + 2.5);
        const barH = Math.max(1.5, barHeights[i]);
        const y = h - barH;

        const grad = ctx.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0, 'rgba(224, 122, 60, 0.4)');
        grad.addColorStop(0.65, 'rgba(245, 166, 35, 0.85)');
        grad.addColorStop(1, 'rgba(255, 235, 150, 0.95)');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barH);

        if (peakValues[i] > 2.5) {
          const peakY = Math.max(0, h - peakValues[i] - 1);
          ctx.fillStyle = 'rgba(255, 245, 190, 0.95)';
          ctx.fillRect(x, peakY, barWidth, 1.2);
        }
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // ROTARY KNOB 1: CHANNEL TUNER (Right side) - Rotating changes channels!
  const handleChannelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsRotatingChannel(true);
    const knob = channelKnobRef.current;
    if (knob && knob.setPointerCapture) {
      try { knob.setPointerCapture(e.pointerId); } catch {}
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let lastAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    let currAngle = channelAngle;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - cy, moveEvent.clientX - cx) * (180 / Math.PI);
      let delta = currentAngle - lastAngle;
      if (delta > 180) delta -= 360;
      else if (delta < -180) delta += 360;

      currAngle = Math.max(-145, Math.min(145, currAngle + delta));
      lastAngle = currentAngle;
      setChannelAngle(currAngle);

      // Determine closest channel
      let closestIdx = 0;
      let minDistance = Infinity;
      CHANNEL_ANGLES.forEach((ang, idx) => {
        const d = Math.abs(ang - currAngle);
        if (d < minDistance) {
          minDistance = d;
          closestIdx = idx;
        }
      });

      if (closestIdx !== currentIndex) {
        handleSelectDay(closestIdx);
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      setIsRotatingChannel(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (knob && knob.releasePointerCapture) {
        try { knob.releasePointerCapture(upEvent.pointerId); } catch {}
      }
      setChannelAngle(CHANNEL_ANGLES[currentIndex]);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // ROTARY KNOB 2: VOLUME TUNER (Left side) - Rotating alters volume!
  const handleVolPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsRotatingVol(true);
    const knob = volKnobRef.current;
    if (knob && knob.setPointerCapture) {
      try { knob.setPointerCapture(e.pointerId); } catch {}
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let lastAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    let currAngle = volAngle;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - cy, moveEvent.clientX - cx) * (180 / Math.PI);
      let delta = currentAngle - lastAngle;
      if (delta > 180) delta -= 360;
      else if (delta < -180) delta += 360;

      currAngle = Math.max(-135, Math.min(135, currAngle + delta));
      lastAngle = currentAngle;

      const newVol = (currAngle - (-135)) / 270;
      onVolumeChange(Math.max(0, Math.min(1, newVol)));
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      setIsRotatingVol(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (knob && knob.releasePointerCapture) {
        try { knob.releasePointerCapture(upEvent.pointerId); } catch {}
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div className="relative select-none flex items-center justify-center p-2 w-full max-w-[700px]">
      {/* Aesthetic Vintage Radio Cabinet Console */}
      <div
        className="w-full relative flex flex-col items-center gap-2 rounded-[28px] px-4 sm:px-6 py-2.5 sm:py-3.5 transition-all duration-300 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 12%, #2a1a11 0%, #1c1109 50%, #110905 100%)',
          border: '1.8px solid rgba(245, 166, 35, 0.45)',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.78), inset 0 1.5px 2px rgba(255, 230, 160, 0.26), inset 0 -3px 6px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 166, 35, 0.1)',
        }}
      >
        {/* Brass Corner Rivets/Screws */}
        <span className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 border border-white/40 shadow pointer-events-none opacity-80" />
        <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 border border-white/40 shadow pointer-events-none opacity-80" />
        <span className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 border border-white/40 shadow pointer-events-none opacity-80" />
        <span className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 border border-white/40 shadow pointer-events-none opacity-80" />

        {/* Top Deck: Speaker Grille Vents & Vintage Radio Emblem */}
        <div className="w-full flex items-center justify-between px-1 mb-0.5">
          <div className="hidden sm:flex flex-col gap-0.5 opacity-60">
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>

          <div className="flex items-center gap-1.5 text-amber-200/90 text-[8.5px] sm:text-[9.5px] font-bold tracking-widest uppercase user-select-none mx-auto">
            <span className="text-[7px] text-amber-400">✦</span>
            <span>AGOMONI BETAR</span>
            <span className="text-[7.5px] text-amber-400/80 font-normal tracking-wider">• 108.5 kHz</span>
            <span className="text-[7px] text-amber-400">✦</span>
          </div>

          <div className="hidden sm:flex flex-col gap-0.5 opacity-60">
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
        </div>

        {/* Recessed Equalizer Display Screen */}
        <div className="w-full flex items-center justify-center bg-[#080503]/90 border border-amber-500/25 rounded-md px-1.5 py-0.5 shadow-inner">
          <canvas
            ref={eqCanvasRef}
            width={360}
            height={20}
            className="w-[360px] max-w-[92%] h-4 sm:h-5 rounded"
            aria-hidden="true"
          />
        </div>

        {/* Radio Controls Row: Left Volume Knob, Play Button, Center Dial, Right Channel Knob */}
        <div className="w-full flex items-center gap-2 sm:gap-4 mt-0.5">
          {/* Left Large Rotary Tuner: Volume Control */}
          <div
            className="flex flex-col items-center justify-center flex-shrink-0 cursor-grab active:cursor-grabbing"
            title="Rotate to alter volume (drag or scroll)"
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY < 0 ? 0.05 : -0.05;
              onVolumeChange(Math.max(0, Math.min(1, volume + delta)));
            }}
          >
            <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-amber-300/80 uppercase mb-0.5">
              VOLUME
            </span>
            <div className="p-0.5 rounded-full bg-black/40 border border-amber-500/20">
              <div
                ref={volKnobRef}
                onPointerDown={handleVolPointerDown}
                className={`w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full relative flex items-center justify-center transition-shadow ${
                  isRotatingVol
                    ? 'ring-2 ring-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.7)]'
                    : 'hover:border-amber-300 shadow-[0_5px_14px_rgba(0,0,0,0.65)]'
                }`}
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #352115 0%, #1e130b 60%, #0d0704 100%)',
                  border: '1.8px solid rgba(245, 158, 11, 0.65)',
                  touchAction: 'none',
                }}
              >
                <div
                  className="w-full h-full rounded-full relative flex items-center justify-center"
                  style={{ transform: `rotate(${volAngle}deg)` }}
                >
                  {/* Pointer Notch */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[3px] h-[9px] rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b]" />
                  {/* Brass Center Core */}
                  <div
                    className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #ffd369 0%, #d4881a 50%, #754407 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </div>
              </div>
            </div>
            <span className="text-[8.5px] sm:text-[9.5px] font-semibold text-amber-200/90 bg-black/50 border border-amber-500/30 rounded px-1.5 py-0.5 mt-0.5 min-w-[32px] text-center">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Single Pulse-Glowing Play Button */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playPotentiometerCrunchClick(0.4);
                onTogglePower();
              }}
              type="button"
              aria-label={isPlaying ? 'Pause radio' : 'Play radio'}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500/30 border-2 border-amber-400 text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.65)] animate-pulse'
                  : 'bg-gradient-to-br from-amber-950/70 via-stone-900 to-black border-2 border-amber-600/40 text-amber-400/80 hover:border-amber-400 hover:text-amber-200 hover:scale-105 shadow-md'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              )}
            </button>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-amber-950/80 border border-amber-600/30'
              }`}
            />
          </div>

          {/* Center: Illuminated Glass Radio Dial Window with Frequency Needle */}
          <div className="flex-1 min-w-0 flex flex-col bg-gradient-to-b from-[#0e0906] to-[#1a110a] border border-amber-500/35 rounded-xl p-1.5 sm:p-2 shadow-inner">
            {/* Vintage Frequency Scale */}
            <div className="flex justify-between items-center text-[7px] sm:text-[7.5px] font-mono text-amber-400/70 px-1 mb-1 select-none">
              <span className="font-bold text-amber-300/80">MW kHz</span>
              <span className="tracking-wider">530 • 700 • 900 • 1150 • 1400 • 1600</span>
              <span className="font-bold text-amber-300/80">KOLKATA</span>
            </div>

            <div
              onClick={(e) => handleTrackInteraction(e.clientX)}
              className="relative w-full cursor-pointer py-1"
              title="Slide along frequency line or rotate right knob to tune"
            >
              {/* Thin Frequency Track */}
              <div
                ref={trackRef}
                className="relative w-full h-[3px] sm:h-[3.5px] bg-white/20 rounded-full overflow-visible transition-colors hover:bg-white/30"
              >
                {/* Amber Progress Accent Line */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-400 ease-out"
                  style={{
                    width: `${needlePercent}%`,
                    background: 'linear-gradient(90deg, #e07a3c, #f59e0b)',
                  }}
                />

                {/* 6 Sacred Day Tick Marks */}
                {PUJA_STATIONS.map((station, idx) => {
                  const tickPos = (idx / (PUJA_STATIONS.length - 1)) * 100;
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={station.id}
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all duration-300 pointer-events-none ${
                        isActive
                          ? 'w-2 h-2 bg-amber-200 shadow-[0_0_8px_#f59e0b] scale-125'
                          : 'w-1.5 h-1.5 bg-white/35'
                      }`}
                      style={{ left: `${tickPos}%` }}
                    />
                  );
                })}

                {/* Sliding Glowing Needle (400ms ease) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-amber-400 shadow-[0_0_16px_#f59e0b,0_0_4px_#fff] cursor-grab transition-all duration-400 ease-out z-10"
                  style={{ left: `${needlePercent}%` }}
                  role="slider"
                  aria-label="Frequency needle"
                  aria-valuemin={0}
                  aria-valuemax={PUJA_STATIONS.length - 1}
                  aria-valuenow={currentIndex}
                >
                  <div className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping opacity-60" />
                </div>
              </div>

              {/* 6 Day Tick Labels Below */}
              <div className="flex justify-between items-center mt-1.5 px-0 overflow-x-auto scrollbar-none">
                {PUJA_STATIONS.map((station, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={station.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDay(idx);
                      }}
                      className={`text-[9.5px] sm:text-[11.5px] font-sans tracking-tight px-1 sm:px-1.5 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'text-amber-200 font-bold bg-amber-950/70 shadow-[0_0_8px_rgba(245,158,11,0.35)]'
                          : 'text-stone-400/80 hover:text-amber-300'
                      }`}
                    >
                      {language === 'bn' ? station.nameBn : station.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Large Rotary Tuner: Channel Tuning Knob */}
          <div
            className="flex flex-col items-center justify-center flex-shrink-0 cursor-grab active:cursor-grabbing"
            title="Rotate to change channel (drag or scroll)"
            onWheel={(e) => {
              e.preventDefault();
              if (e.deltaY < 0 && currentIndex < PUJA_STATIONS.length - 1) {
                handleSelectDay(currentIndex + 1);
              } else if (e.deltaY > 0 && currentIndex > 0) {
                handleSelectDay(currentIndex - 1);
              }
            }}
          >
            <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-amber-300/80 uppercase mb-0.5">
              TUNING
            </span>
            <div className="p-0.5 rounded-full bg-black/40 border border-amber-500/20">
              <div
                ref={channelKnobRef}
                onPointerDown={handleChannelPointerDown}
                className={`w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full relative flex items-center justify-center transition-shadow ${
                  isRotatingChannel
                    ? 'ring-2 ring-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.7)]'
                    : 'hover:border-amber-300 shadow-[0_5px_14px_rgba(0,0,0,0.65)]'
                }`}
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #352115 0%, #1e130b 60%, #0d0704 100%)',
                  border: '1.8px solid rgba(245, 158, 11, 0.65)',
                  touchAction: 'none',
                }}
              >
                <div
                  className={`w-full h-full rounded-full relative flex items-center justify-center ${
                    isRotatingChannel ? '' : 'transition-transform duration-300 ease-out'
                  }`}
                  style={{ transform: `rotate(${channelAngle}deg)` }}
                >
                  {/* Pointer Notch */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[3px] h-[9px] rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b]" />
                  {/* Brass Center Core */}
                  <div
                    className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #ffd369 0%, #d4881a 50%, #754407 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </div>
              </div>
            </div>
            <span className="text-[8.5px] sm:text-[9.5px] font-semibold text-amber-200/90 bg-black/50 border border-amber-500/30 rounded px-1.5 py-0.5 mt-0.5 max-w-[56px] truncate text-center">
              {language === 'bn' ? activeStation.nameBn : activeStation.nameEn}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
