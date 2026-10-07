import React, { useEffect, useRef, useState } from 'react';
import { AudioContextManager } from '../utils/proceduralAudio';

interface VacuumTubeVisualizerProps {
  isPowered: boolean;
  isPlaying: boolean;
  volume: number;
  audioSource?: 'broadcast' | 'synth';
  compact?: boolean;
  className?: string;
}

type TubeGlowTheme = 'amber' | 'emerald' | 'tungsten';

export const VacuumTubeVisualizer: React.FC<VacuumTubeVisualizerProps> = ({
  isPowered,
  isPlaying,
  volume,
  audioSource = 'broadcast',
  compact = false,
  className = '',
}) => {
  const [theme, setTheme] = useState<TubeGlowTheme>('amber');
  const numTubes = compact ? 8 : 10;

  // Real-time animated bar levels (0.0 to 1.0) and peak levels
  const barLevelsRef = useRef<number[]>(new Array(numTubes).fill(0));
  const peakLevelsRef = useRef<number[]>(new Array(numTubes).fill(0));
  const peakDecayRef = useRef<number[]>(new Array(numTubes).fill(0));
  const [displayLevels, setDisplayLevels] = useState<{ bars: number[]; peaks: number[] }>({
    bars: new Array(numTubes).fill(0),
    peaks: new Array(numTubes).fill(0),
  });

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();

    const updateFrame = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const liveFreqs = AudioContextManager.getLiveFrequencyData(numTubes);
      const hasLiveSignal = liveFreqs.some((val) => val > 0.02);

      const targetLevels: number[] = new Array(numTubes).fill(0);

      if (isPowered && isPlaying) {
        if (hasLiveSignal) {
          for (let i = 0; i < numTubes; i++) {
            const freqBoost = 1.0 + (i / numTubes) * 0.45;
            targetLevels[i] = Math.min(1.0, liveFreqs[i] * freqBoost * (volume > 0 ? 1 : 0));
          }
        } else {
          const t = now * 0.003;
          const beat = Math.sin(t * 3.8);
          const subBeat = Math.cos(t * 7.6);
          const vocalSwell = Math.sin(t * 1.4);

          for (let i = 0; i < numTubes; i++) {
            let val = 0;
            if (i < 2) {
              val = 0.35 + Math.max(0, beat) * 0.55 + Math.max(0, subBeat) * 0.25;
            } else if (i < 6) {
              val = 0.25 + Math.sin(t * 4.2 + i * 0.8) * 0.35 + Math.max(0, vocalSwell) * 0.35;
            } else {
              val = 0.18 + Math.abs(Math.sin(t * 6.5 + i * 1.2)) * 0.45;
            }
            targetLevels[i] = Math.max(0.05, Math.min(0.96, val * volume));
          }
        }
      } else if (isPowered && !isPlaying) {
        for (let i = 0; i < numTubes; i++) {
          targetLevels[i] = 0.04 + Math.sin(now * 0.002 + i) * 0.02;
        }
      } else {
        for (let i = 0; i < numTubes; i++) {
          targetLevels[i] = 0;
        }
      }

      const currentBars = [...barLevelsRef.current];
      const currentPeaks = [...peakLevelsRef.current];
      const currentPeakDecay = [...peakDecayRef.current];

      for (let i = 0; i < numTubes; i++) {
        const target = targetLevels[i];
        if (target > currentBars[i]) {
          currentBars[i] += (target - currentBars[i]) * 0.45;
        } else {
          currentBars[i] += (target - currentBars[i]) * 0.16;
        }

        if (currentBars[i] >= currentPeaks[i]) {
          currentPeaks[i] = currentBars[i];
          currentPeakDecay[i] = 0;
        } else {
          currentPeakDecay[i] += dt;
          if (currentPeakDecay[i] > 0.22) {
            currentPeaks[i] = Math.max(currentBars[i], currentPeaks[i] - dt * 0.7);
          }
        }
      }

      barLevelsRef.current = currentBars;
      peakLevelsRef.current = currentPeaks;
      peakDecayRef.current = currentPeakDecay;

      setDisplayLevels({
        bars: currentBars,
        peaks: currentPeaks,
      });

      animFrameRef.current = requestAnimationFrame(updateFrame);
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPowered, isPlaying, volume, audioSource, numTubes]);

  const getThemeColors = () => {
    switch (theme) {
      case 'emerald':
        return {
          glow: 'rgba(16, 185, 129, 0.45)',
          barBase: '#059669',
          barMid: '#10b981',
          barPeak: '#34d399',
          peakDot: '#6ee7b7',
          overload: '#ef4444',
          accent: '#10b981',
          name: 'EM84',
        };
      case 'tungsten':
        return {
          glow: 'rgba(251, 191, 36, 0.42)',
          barBase: '#d97706',
          barMid: '#f59e0b',
          barPeak: '#fde047',
          peakDot: '#fef08a',
          overload: '#ef4444',
          accent: '#f59e0b',
          name: 'Tungsten',
        };
      case 'amber':
      default:
        return {
          glow: 'rgba(249, 115, 22, 0.45)',
          barBase: '#c2410c',
          barMid: '#ea580c',
          barPeak: '#fb923c',
          peakDot: '#fed7aa',
          overload: '#ef4444',
          accent: '#f97316',
          name: 'Amber',
        };
    }
  };

  const colors = getThemeColors();

  // Compact dimensions
  const svgWidth = 240;
  const svgHeight = compact ? 26 : 38;
  const tubeWidth = compact ? 12 : 14;
  const tubeGap = (svgWidth - numTubes * tubeWidth) / (numTubes + 1);
  const tubeHeight = svgHeight - (compact ? 6 : 10);
  const tubeRadius = 3;

  const cycleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTheme((prev) => {
      if (prev === 'amber') return 'emerald';
      if (prev === 'emerald') return 'tungsten';
      return 'amber';
    });
  };

  return (
    <div
      className={`relative select-none rounded bg-[#080504]/90 border border-amber-950/80 px-1.5 py-0.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.95)] flex flex-col items-center overflow-hidden cursor-pointer ${className}`}
      title="Vacuum Tube Audio Spectrum • Click to change phosphor glow"
      onClick={cycleTheme}
    >
      <div className="w-full flex items-center justify-between px-0.5 mb-0.5 pointer-events-none">
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            style={{
              backgroundColor: isPowered ? colors.accent : '#57534e',
              boxShadow: isPowered ? `0 0 5px ${colors.accent}` : 'none',
            }}
          />
          <span className="text-[6.5px] font-mono tracking-wider font-bold text-amber-300/80 uppercase">
            VALVE SPECTRUM
          </span>
        </div>

        <span
          className="text-[6px] font-mono font-medium px-1 rounded border transition-colors"
          style={{
            borderColor: `${colors.accent}66`,
            color: colors.accent,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          {colors.name}
        </span>
      </div>

      <div className="relative w-full flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[26px] overflow-visible"
          style={{
            filter: isPowered && isPlaying ? `drop-shadow(0 0 4px ${colors.glow})` : 'none',
          }}
        >
          <defs>
            <linearGradient id="tube-glass-grad-compact" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.03)" />
              <stop offset="70%" stopColor="rgba(0,0,0,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
            </linearGradient>

            <radialGradient id="tube-getter-compact" cx="50%" cy="20%" r="50%">
              <stop offset="0%" stopColor="rgba(240, 245, 255, 0.55)" />
              <stop offset="60%" stopColor="rgba(180, 190, 210, 0.25)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <linearGradient id="tube-phosphor-compact" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={colors.barBase} />
              <stop offset="65%" stopColor={colors.barMid} />
              <stop offset="88%" stopColor={colors.barPeak} />
              <stop offset="100%" stopColor={colors.overload} />
            </linearGradient>
          </defs>

          {Array.from({ length: numTubes }).map((_, i) => {
            const x = tubeGap + i * (tubeWidth + tubeGap);
            const y = 3;
            const barLevel = displayLevels.bars[i] || 0;
            const peakLevel = displayLevels.peaks[i] || 0;

            const barHeight = Math.max(1, (tubeHeight - 3) * barLevel);
            const barY = y + (tubeHeight - 2) - barHeight;
            const peakY = y + (tubeHeight - 2) - Math.max(1, (tubeHeight - 3) * peakLevel);

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={tubeWidth}
                  height={tubeHeight}
                  rx={tubeRadius}
                  ry={tubeRadius}
                  fill="#0d0907"
                  stroke="#3e2718"
                  strokeWidth="0.8"
                />

                <rect
                  x={x + 1}
                  y={y}
                  width={tubeWidth - 2}
                  height={tubeHeight * 0.3}
                  rx={tubeRadius - 0.5}
                  fill="url(#tube-getter-compact)"
                  opacity={isPowered ? 0.8 : 0.3}
                />

                {isPowered && (
                  <circle
                    cx={x + tubeWidth / 2}
                    cy={y + tubeHeight - 2}
                    r={1.2}
                    fill={isPlaying ? colors.accent : '#d97706'}
                    opacity={isPlaying ? 0.9 : 0.4}
                  />
                )}

                {isPowered && barLevel > 0.02 && (
                  <rect
                    x={x + 1.5}
                    y={barY}
                    width={tubeWidth - 3}
                    height={barHeight}
                    rx={1.5}
                    fill="url(#tube-phosphor-compact)"
                    opacity={0.9}
                  />
                )}

                {isPowered && peakLevel > 0.05 && (
                  <rect
                    x={x + 1.5}
                    y={peakY}
                    width={tubeWidth - 3}
                    height={1.5}
                    rx={0.7}
                    fill={colors.peakDot}
                    opacity={0.95}
                  />
                )}

                <rect
                  x={x}
                  y={y}
                  width={tubeWidth}
                  height={tubeHeight}
                  rx={tubeRadius}
                  fill="url(#tube-glass-grad-compact)"
                  pointerEvents="none"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
