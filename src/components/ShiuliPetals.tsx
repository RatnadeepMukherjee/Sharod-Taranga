import React from 'react';

interface FlowerPosition {
  id: number;
  xPercent: number; // 0 to 100%
  yOffset: number; // px from top edge
  rotation: number; // deg
  scale: number;
}

interface ShiuliPetalsProps {
  flowers: FlowerPosition[];
  onFlowerClick?: (id: number) => void;
  className?: string;
}

// Single authentic Shiuli (Shefali / Night Jasmine) flower SVG:
// Pure white pinwheel petals with distinctive vibrant saffron/orange central tube & stem
export const SingleShiuliSVG: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 5-7 Delicate white petals radiating outwards */}
      <g>
        {/* Petal 1 */}
        <path
          d="M50 50 C45 28 35 15 50 5 C65 15 55 28 50 50"
          fill="#fafafa"
          stroke="#f0ece4"
          strokeWidth="1"
        />
        {/* Petal 2 */}
        <path
          d="M50 50 C45 28 35 15 50 5 C65 15 55 28 50 50"
          fill="#fafafa"
          stroke="#f0ece4"
          strokeWidth="1"
          transform="rotate(60 50 50)"
        />
        {/* Petal 3 */}
        <path
          d="M50 50 C45 28 35 15 50 5 C65 15 55 28 50 50"
          fill="#fafafa"
          stroke="#f0ece4"
          strokeWidth="1"
          transform="rotate(120 50 50)"
        />
        {/* Petal 4 */}
        <path
          d="M50 50 C45 28 35 15 50 5 C65 15 55 28 50 50"
          fill="#fbfbfb"
          stroke="#f0ece4"
          strokeWidth="1"
          transform="rotate(180 50 50)"
        />
        {/* Petal 5 */}
        <path
          d="M50 50 C45 28 35 15 50 5 C65 15 55 28 50 50"
          fill="#fbfbfb"
          stroke="#f0ece4"
          strokeWidth="1"
          transform="rotate(240 50 50)"
        />
        {/* Petal 6 */}
        <path
          d="M50 50 C45 28 35 15 50 5 C65 15 55 28 50 50"
          fill="#fafafa"
          stroke="#f0ece4"
          strokeWidth="1"
          transform="rotate(300 50 50)"
        />
      </g>

      {/* Vibrant orange tubular stem stalk trailing underneath */}
      <path
        d="M50 50 Q56 68 62 82"
        stroke="#ea580c"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Vibrant saffron-orange floral eye center (characteristic of Shiuli) */}
      <circle cx="50" cy="50" r="7.5" fill="#f97316" />
      <circle cx="50" cy="50" r="4" fill="#c2410c" />
    </svg>
  );
};

export const ShiuliPetals: React.FC<ShiuliPetalsProps> = ({ flowers, onFlowerClick, className = '' }) => {
  return (
    <div className={`absolute top-0 left-0 right-0 h-10 pointer-events-none z-30 ${className}`}>
      {flowers.map((fl) => (
        <div
          key={fl.id}
          onClick={() => onFlowerClick && onFlowerClick(fl.id)}
          className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-125 active:scale-95"
          style={{
            left: `${fl.xPercent}%`,
            top: `${fl.yOffset}px`,
            transform: `translate(-50%, -50%) rotate(${fl.rotation}deg) scale(${fl.scale})`,
          }}
          title="Fresh Shiuli flower (শিউলি ফুল) - Click to scatter fragrance"
        >
          <SingleShiuliSVG size={32} />
        </div>
      ))}
    </div>
  );
};
