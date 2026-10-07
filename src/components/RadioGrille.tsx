import React from 'react';

interface RadioGrilleProps {
  isPlaying: boolean;
  intensity?: number;
}

export const RadioGrille: React.FC<RadioGrilleProps> = ({ isPlaying, intensity = 0.5 }) => {
  return (
    <div className="relative w-full h-full rounded-md overflow-hidden border border-amber-950/70 p-1 bg-[#23150d] shadow-inner select-none flex items-center justify-center">
      {/* Woven cane and dhunuchi-perforated texture backdrop */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundColor: '#321c10',
          backgroundImage: `
            radial-gradient(#d49b4b 15%, transparent 16%),
            radial-gradient(#b0722e 15%, transparent 16%),
            linear-gradient(45deg, rgba(82, 45, 18, 0.4) 25%, transparent 25%, transparent 75%, rgba(82, 45, 18, 0.4) 75%),
            linear-gradient(-45deg, rgba(82, 45, 18, 0.4) 25%, transparent 25%, transparent 75%, rgba(82, 45, 18, 0.4) 75%)
          `,
          backgroundSize: '16px 16px, 16px 16px, 8px 8px, 8px 8px',
          backgroundPosition: '0 0, 8px 8px, 0 0, 0 0',
        }}
      />

      {/* Speaker driver dark silhouette beneath the cane mesh */}
      <div
        className={`w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-amber-950/80 transition-transform duration-100 flex items-center justify-center ${
          isPlaying ? 'scale-[1.01]' : 'scale-100'
        }`}
        style={{
          background: 'radial-gradient(circle at 45% 45%, #190e06 0%, #0c0602 65%, #2a1608 100%)',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
        }}
      >
        {/* Speaker dust cap */}
        <div
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-amber-900/60 shadow-inner"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #3d210f 0%, #150a04 100%)',
          }}
        />
      </div>

      {/* Dhunuchi clay bowl perforated concentric rings overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <pattern id="dhunuchi-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="3" fill="#e6a85c" />
          <circle cx="2" cy="2" r="1.5" fill="#99582a" />
          <circle cx="18" cy="2" r="1.5" fill="#99582a" />
          <circle cx="2" cy="18" r="1.5" fill="#99582a" />
          <circle cx="18" cy="18" r="1.5" fill="#99582a" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dhunuchi-mesh)" />
      </svg>

      {/* Subtle warm cloth vintage shading around edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.85), inset 0 2px 4px rgba(230,168,92,0.1)',
        }}
      />

      {/* Audio pulse indicator badge */}
      {isPlaying && (
        <div className="absolute bottom-2 left-2 flex items-end gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-amber-500/30">
          <span className="text-[9px] font-mono text-amber-300 font-bold">ACOUSTIC TUBE</span>
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 bg-amber-400 animate-pulse h-full" />
            <span className="w-0.5 bg-amber-400 animate-pulse h-2/3" style={{ animationDelay: '0.1s' }} />
            <span className="w-0.5 bg-amber-400 animate-pulse h-4/5" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      )}
    </div>
  );
};
