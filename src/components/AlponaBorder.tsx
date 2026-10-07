import React from 'react';

export const AlponaBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full h-3 md:h-3.5 my-2 flex items-center justify-center overflow-hidden border-y border-amber-500/40 select-none shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${className}`}
      style={{
        background: 'linear-gradient(to right, #6b4412 0%, #d4af37 20%, #f6e27a 45%, #ffd700 50%, #f6e27a 55%, #d4af37 80%, #6b4412 100%)',
      }}
    >
      {/* Repeating etched Alpona rice-paste floral motif pattern */}
      <svg
        className="w-full h-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat"
      >
        <defs>
          <pattern id="alpona-strip" width="36" height="14" patternUnits="userSpaceOnUse">
            {/* Center lotus blossom */}
            <path
              d="M18 2 C16 5 15 8 18 12 C21 8 20 5 18 2 Z"
              fill="#3a1d04"
            />
            {/* Left curved petal */}
            <path
              d="M18 8 C14 5 10 7 8 10 C12 11 15 10 18 8 Z"
              fill="#3a1d04"
            />
            {/* Right curved petal */}
            <path
              d="M18 8 C22 5 26 7 28 10 C24 11 21 10 18 8 Z"
              fill="#3a1d04"
            />
            {/* Connecting vine scroll */}
            <path
              d="M0 7 Q9 12 18 7 Q27 2 36 7"
              stroke="#3a1d04"
              strokeWidth="0.8"
              fill="none"
            />
            {/* Small decorative seed pearl dots */}
            <circle cx="18" cy="7" r="1" fill="#fffbe8" />
            <circle cx="4" cy="7" r="0.8" fill="#fffbe8" />
            <circle cx="32" cy="7" r="0.8" fill="#fffbe8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#alpona-strip)" />
      </svg>

      {/* Center engraved insignia highlight */}
      <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent pointer-events-none" />
    </div>
  );
};
