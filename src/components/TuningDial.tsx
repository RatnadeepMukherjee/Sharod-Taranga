import React, { useRef } from 'react';
import { PUJA_STATIONS, StationData } from '../utils/audioEngine';

interface TuningDialProps {
  frequency: number;
  isPowered: boolean;
  onFrequencyChange: (freq: number) => void;
  activeStation: StationData;
  tuningClarity: number;
}

export const TuningDial: React.FC<TuningDialProps> = ({
  frequency,
  isPowered,
  onFrequencyChange,
  activeStation,
  tuningClarity,
}) => {
  const dialRef = useRef<HTMLDivElement | null>(null);

  // Frequency range: 87.0 MHz to 108.5 MHz
  const minFreq = 87.0;
  const maxFreq = 108.5;

  // Convert freq to percentage position 0 - 100%
  const needlePercent = Math.max(0, Math.min(100, ((frequency - minFreq) / (maxFreq - minFreq)) * 100));

  const handleDialClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newFreq = Number((minFreq + percent * (maxFreq - minFreq)).toFixed(1));
    onFrequencyChange(newFreq);
  };

  const handleStationClick = (stationFreq: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onFrequencyChange(stationFreq);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 select-none">
      {/* Outer smoked-glass frame */}
      <div
        ref={dialRef}
        onClick={handleDialClick}
        className="relative w-full h-full rounded-md border-2 border-amber-900/80 cursor-crosshair overflow-hidden transition-all duration-300"
        style={{
          background: isPowered
            ? 'radial-gradient(ellipse at 50% 50%, rgba(60, 30, 8, 0.94) 0%, rgba(20, 10, 3, 0.98) 100%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(25, 15, 6, 0.98) 0%, rgba(12, 6, 2, 1) 100%)',
          boxShadow: isPowered
            ? 'inset 0 0 25px rgba(251, 191, 36, 0.28), inset 0 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(217, 119, 6, 0.2)'
            : 'inset 0 0 15px rgba(0,0,0,0.9)',
        }}
      >
        {/* Subtle glass reflection sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-100/[0.04] to-transparent pointer-events-none" />

        {/* Dial Scale Area */}
        <div className="relative w-full h-full flex flex-col justify-between px-3 py-2 z-10">
          
          {/* Top band: AM Frequency scale */}
          <div className="flex justify-between items-center text-[10px] md:text-xs font-mono tracking-widest text-amber-500/70 border-b border-amber-900/50 pb-1">
            <span className="font-serif font-bold text-amber-400/90 text-[10px]">AM (KHz)</span>
            <span>550</span>
            <span>700</span>
            <span>900</span>
            <span>1200</span>
            <span>1600</span>
          </div>

          {/* Puja Days Primary Indicator Bar */}
          <div className="relative my-2 py-1">
            {/* Horizontal guideline */}
            <div className="w-full h-[2px] bg-gradient-to-r from-amber-900/40 via-amber-600/70 to-amber-900/40 relative">
              {/* Ticks for each Puja Day */}
              {PUJA_STATIONS.map((st) => {
                const stPercent = ((st.frequency - minFreq) / (maxFreq - minFreq)) * 100;
                const isSelected = activeStation.id === st.id && tuningClarity > 0.4;
                return (
                  <div
                    key={st.id}
                    onClick={(e) => handleStationClick(st.frequency, e)}
                    className="absolute -top-3 -bottom-3 flex flex-col items-center cursor-pointer group/tick"
                    style={{ left: `${stPercent}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Tick mark */}
                    <div
                      className={`w-[2px] h-3 transition-colors ${
                        isSelected ? 'bg-amber-300 shadow-[0_0_8px_#f59e0b]' : 'bg-amber-600/70 group-hover/tick:bg-amber-400'
                      }`}
                    />

                    {/* Puja Day Name label */}
                    <div
                      className={`mt-1 whitespace-nowrap text-center transition-all ${
                        isSelected
                          ? 'text-amber-200 font-bold scale-110 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
                          : 'text-amber-500/80 group-hover/tick:text-amber-300 text-[10px] md:text-xs'
                      }`}
                    >
                      <div className="font-serif text-[11px] md:text-xs tracking-tight">{st.name.replace('Maha ', '')}</div>
                      <div className="text-[9px] text-amber-400/75 hidden md:block">{st.bengaliName}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom band: FM Frequency scale with MHz */}
          <div className="flex justify-between items-center text-[10px] md:text-xs font-mono tracking-widest text-amber-500/70 border-t border-amber-900/50 pt-1">
            <span className="font-serif font-bold text-amber-400/90 text-[10px]">FM (MHz)</span>
            <span>88</span>
            <span>92</span>
            <span>96</span>
            <span>100</span>
            <span>104</span>
            <span>108</span>
          </div>

          {/* Red Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none transition-all duration-75 ease-out z-20"
            style={{
              left: `${needlePercent}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* The vertical red needle body */}
            <div
              className="w-[2.5px] h-full shadow-[0_0_10px_#ef4444]"
              style={{
                background: isPowered
                  ? 'linear-gradient(to bottom, #ff4444, #dc2626, #b91c1c)'
                  : '#7f1d1d',
                boxShadow: isPowered ? '0 0 8px rgba(239, 68, 68, 0.9), 0 0 2px #fff' : 'none',
              }}
            />
            {/* Top needle head flag */}
            <div
              className="w-2 h-2 -ml-[2.75px] rotate-45"
              style={{
                background: isPowered ? '#ef4444' : '#991b1b',
              }}
            />
          </div>
        </div>

        {/* Ambient warm amber glow layer when powered */}
        {isPowered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 60%, rgba(245, 158, 11, 0.15) 0%, transparent 75%)',
            }}
          />
        )}
      </div>

      {/* Real-time Frequency Readout Badge */}
      <div className="mt-2 flex justify-between items-center text-xs text-amber-300/90 font-mono px-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isPowered
                ? tuningClarity > 0.7
                  ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                  : tuningClarity > 0.3
                  ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                  : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                : 'bg-stone-700'
            }`}
          />
          <span className="text-[11px] text-amber-400/80">
            {isPowered ? (tuningClarity > 0.6 ? 'LOCKED' : 'TUNING...') : 'OFF'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-200/90 font-bold tracking-wider">{frequency.toFixed(1)} MHz</span>
          <span className="text-[10px] text-amber-400/60 uppercase">Akashvani Band</span>
        </div>
      </div>
    </div>
  );
};
