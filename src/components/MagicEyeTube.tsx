import React, { useMemo } from 'react';

interface MagicEyeTubeProps {
  isPowered: boolean;
  tuningAccuracy: number; // 0.0 (off-station) to 1.0 (dead center on station)
  isPlaying: boolean;
  band: string;
}

export const MagicEyeTube: React.FC<MagicEyeTubeProps> = ({
  isPowered,
  tuningAccuracy,
  isPlaying,
  band,
}) => {
  // Compute phosphor ribbon deflection:
  // Off-station: small deflection (bars are wide apart, dark gap in middle ~ 60% of width)
  // On-station: high deflection (bars close inward, leaving narrow slit ~ 10-15% of width)
  // Audio playback adds rhythmic bounce
  const barWidthPercent = useMemo(() => {
    if (!isPowered) return 5;
    const base = 15 + tuningAccuracy * 30; // 15% to 45% width each
    const audioBounce = isPlaying && tuningAccuracy > 0.4 ? Math.sin(Date.now() / 150) * 4 : 0;
    return Math.min(48, Math.max(8, base + audioBounce));
  }, [isPowered, tuningAccuracy, isPlaying]);

  return (
    <div
      className="relative flex items-center justify-center px-2 py-1 rounded bg-[#0b0c0d] border border-amber-900/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
      title={`EM84 Magic Eye Vacuum Tube (${band}) • Signal: ${Math.round(tuningAccuracy * 100)}%`}
    >
      {/* Label */}
      <span className="text-[8px] font-mono text-stone-400 mr-2 uppercase tracking-wider hidden xs:inline">
        VALVE EM84
      </span>

      {/* Tube Glass Housing */}
      <div className="relative w-24 sm:w-28 h-4 rounded-sm bg-[#050906] overflow-hidden border border-emerald-950 flex items-center justify-between px-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
        {/* Filament orange micro-glow at cathodes */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 transition-opacity duration-1000 ${
            isPowered ? 'bg-orange-500/70 shadow-[0_0_6px_#ff6600]' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-1.5 transition-opacity duration-1000 ${
            isPowered ? 'bg-orange-500/70 shadow-[0_0_6px_#ff6600]' : 'opacity-0'
          }`}
        />

        {/* Left Phosphor Green Bar */}
        <div
          className="h-2 rounded-xs transition-all duration-150 ease-out"
          style={{
            width: `${barWidthPercent}%`,
            background: isPowered
              ? 'linear-gradient(90deg, #10b981 0%, #34d399 70%, #6ee7b7 100%)'
              : 'rgba(16, 50, 25, 0.2)',
            boxShadow: isPowered
              ? '0 0 8px #10b981, 0 0 14px rgba(52, 211, 153, 0.6)'
              : 'none',
          }}
        />

        {/* Center Gap Shadow (Closes as signal strengthens) */}
        <div className="flex-1 h-full mx-0.5" />

        {/* Right Phosphor Green Bar */}
        <div
          className="h-2 rounded-xs transition-all duration-150 ease-out"
          style={{
            width: `${barWidthPercent}%`,
            background: isPowered
              ? 'linear-gradient(270deg, #10b981 0%, #34d399 70%, #6ee7b7 100%)'
              : 'rgba(16, 50, 25, 0.2)',
            boxShadow: isPowered
              ? '0 0 8px #10b981, 0 0 14px rgba(52, 211, 153, 0.6)'
              : 'none',
          }}
        />

        {/* Glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Signal indicator percentage */}
      <span className="text-[9px] font-mono text-emerald-400/90 ml-1.5 w-6 text-right">
        {isPowered ? `${Math.round(tuningAccuracy * 100)}%` : 'OFF'}
      </span>
    </div>
  );
};
