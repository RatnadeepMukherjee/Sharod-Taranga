import React from 'react';

/**
 * Apple Liquid Glass Corner Refraction SVG Filter
 * Optically warps and bends the background scenics through the curved glass edges
 * using feTurbulence and feDisplacementMap.
 */
export const LiquidGlassFilter: React.FC = () => {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden"
      aria-hidden="true"
      style={{ position: 'fixed', left: -9999, top: -9999 }}
    >
      <defs>
        <filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%">
          {/* Subtle smooth organic fluid turbulence */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028 0.032"
            numOctaves="2"
            result="noise"
          />
          {/* Edge displacement map for curved glass refraction index */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Gaussian blur to diffuse interior caustics */}
          <feGaussianBlur in="displaced" stdDeviation="2.5" result="blurred" />
          <feComposite in="SourceGraphic" in2="blurred" operator="over" />
        </filter>

        {/* Ambient CRT Scanline Pattern */}
        <pattern id="crt-scanlines" width="100%" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(0, 0, 0, 0.22)" strokeWidth="1" />
        </pattern>
      </defs>
    </svg>
  );
};
