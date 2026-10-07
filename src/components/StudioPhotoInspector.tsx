import React, { useState, useRef } from 'react';
import { ZoomIn, Download, Maximize2, Sparkles, Layers, Sliders, Info } from 'lucide-react';

interface StudioPhotoInspectorProps {
  onOpenStory: () => void;
}

export const StudioPhotoInspector: React.FC<StudioPhotoInspectorProps> = ({ onOpenStory }) => {
  const [activeShot, setActiveShot] = useState<'front' | 'square' | 'dawn'>('front');
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, relX: 50, relY: 50 });
  const [warmthLevel, setWarmthLevel] = useState<'golden' | 'studio' | 'night'>('golden');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const images = {
    front: '/src/assets/images/vintage_puja_radio_1790530644846.jpg',
    square: '/src/assets/images/puja_radio_square_1790530658952.jpg',
    dawn: '/src/assets/images/bengali_puja_dawn_1790530679559.jpg',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isMagnifierActive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setLensPos({
        x,
        y,
        relX: (x / rect.width) * 100,
        relY: (y / rect.height) * 100,
      });
    }
  };

  const currentImg = images[activeShot];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-900/40 text-sm">
        {/* Shot selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-lg border border-amber-950/60">
          <button
            onClick={() => setActiveShot('front')}
            className={`px-3 py-1.5 rounded-md font-serif text-xs font-semibold transition-all ${
              activeShot === 'front'
                ? 'bg-amber-700/80 text-amber-100 shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
                : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            4:3 Studio Elevation
          </button>
          <button
            onClick={() => setActiveShot('square')}
            className={`px-3 py-1.5 rounded-md font-serif text-xs font-semibold transition-all ${
              activeShot === 'square'
                ? 'bg-amber-700/80 text-amber-100 shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
                : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            1:1 Macro Focus
          </button>
          <button
            onClick={() => setActiveShot('dawn')}
            className={`px-3 py-1.5 rounded-md font-serif text-xs font-semibold transition-all ${
              activeShot === 'dawn'
                ? 'bg-amber-700/80 text-amber-100 shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
                : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            Pandal Dawn Ambience
          </button>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          {/* Magnifier toggle */}
          <button
            onClick={() => setIsMagnifierActive(!isMagnifierActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isMagnifierActive
                ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold'
                : 'bg-stone-800/80 text-amber-200 border-amber-900/60 hover:bg-stone-800'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{isMagnifierActive ? '2.5x Loupe On' : 'Inspect Details'}</span>
          </button>

          {/* Lighting mood */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-stone-800/80 rounded-lg border border-amber-900/50 text-xs text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={warmthLevel}
              onChange={(e) => setWarmthLevel(e.target.value as 'golden' | 'studio' | 'night')}
              className="bg-transparent text-amber-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="golden" className="bg-stone-900">Golden Hour Dawn</option>
              <option value="studio" className="bg-stone-900">Neutral Studio Master</option>
              <option value="night" className="bg-stone-900">Warm Sandhi Puja</option>
            </select>
          </div>

          {/* Design Notes button */}
          <button
            onClick={onOpenStory}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/50 hover:bg-amber-900/50 text-xs"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Design Spec</span>
          </button>

          {/* Download Original Photo */}
          <a
            href={currentImg}
            download={`vintage_durga_puja_radio_${activeShot}.jpg`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save HD</span>
          </a>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => isMagnifierActive && null}
        className={`relative w-full rounded-2xl overflow-hidden bg-black/90 border border-amber-900/50 shadow-2xl flex items-center justify-center min-h-[380px] md:min-h-[520px] select-none ${
          isMagnifierActive ? 'cursor-none' : 'cursor-default'
        }`}
      >
        {/* Photorealistic image presentation */}
        <div
          className={`relative max-w-full max-h-[640px] flex items-center justify-center transition-all duration-300 ${
            warmthLevel === 'golden'
              ? 'sepia-[0.12] contrast-[1.04]'
              : warmthLevel === 'night'
              ? 'brightness-[0.92] saturate-[1.25]'
              : ''
          }`}
        >
          <img
            src={currentImg}
            alt="Vintage 1970s Bengali Durga Puja Radio Studio Photograph"
            referrerPolicy="no-referrer"
            className="max-h-[600px] w-auto object-contain rounded-lg shadow-2xl"
          />

          {/* Subtle studio floor reflection gradient */}
          <div className="absolute -bottom-8 inset-x-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        {/* 2.5x Loupe Magnifier */}
        {isMagnifierActive && (
          <div
            className="pointer-events-none absolute w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-amber-300 shadow-[0_0_25px_rgba(0,0,0,0.8),_inset_0_0_15px_rgba(251,191,36,0.3)] overflow-hidden z-40"
            style={{
              left: `${lensPos.x}px`,
              top: `${lensPos.y}px`,
              transform: 'translate(-50%, -50%)',
              backgroundImage: `url(${currentImg})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${lensPos.relX}% ${lensPos.relY}%`,
              backgroundSize: '280%',
            }}
          >
            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-4 h-[1px] bg-amber-200" />
              <div className="h-4 w-[1px] bg-amber-200 absolute" />
            </div>
            {/* Label inside loupe */}
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="text-[9px] font-mono font-bold bg-black/70 px-2 py-0.5 rounded text-amber-300">
                2.5X MACRO
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Caption & Specs note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-amber-400/80 px-2">
        <p className="font-serif italic">
          Straight-on orthographic studio photograph of the vintage 1970s Puja radio with antique brass panels, sindoor-red enamel trim, dhunuchi woven cane grille, and fresh morning shiuli blossoms.
        </p>
        <span className="text-amber-500/70 font-mono text-[11px] whitespace-nowrap mt-1 sm:mt-0">
          Studio Spec: 8K Photorealistic Elevation
        </span>
      </div>
    </div>
  );
};
