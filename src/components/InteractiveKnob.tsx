import React, { useRef, useState, useCallback, useEffect } from 'react';

interface InteractiveKnobProps {
  label: string;
  sublabel?: string;
  value: number; // 0 to 1
  min?: number;
  max?: number;
  step?: number;
  isCenter?: boolean;
  icon?: 'dhak' | 'diya' | 'power' | 'tune' | 'tone';
  onChange: (val: number) => void;
  onClick?: () => void;
}

export const InteractiveKnob: React.FC<InteractiveKnobProps> = ({
  label,
  sublabel,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  isCenter = false,
  icon,
  onChange,
  onClick,
}) => {
  const knobRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const startVal = useRef(value);

  // Map value (0 to 1) to angle (-140deg to +140deg)
  const normVal = (value - min) / (max - min);
  const angle = -140 + normVal * 280;

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartY.current = e.clientY;
    startVal.current = value;
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const deltaY = dragStartY.current - e.clientY;
      const sensitivity = 0.005;
      let nextVal = startVal.current + deltaY * sensitivity * (max - min);
      if (step) {
        nextVal = Math.round(nextVal / step) * step;
      }
      nextVal = Math.max(min, Math.min(max, nextVal));
      onChange(nextVal);
    },
    [isDragging, min, max, step, onChange]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * ((max - min) * 0.04);
    let nextVal = value + delta;
    if (step) nextVal = Math.round(nextVal / step) * step;
    nextVal = Math.max(min, Math.min(max, nextVal));
    onChange(nextVal);
  };

  const sizeClass = isCenter ? 'w-16 h-16 md:w-20 md:h-20' : 'w-12 h-12 md:w-14 md:h-14';

  return (
    <div className="flex flex-col items-center select-none group">
      {/* Knob outer bezel */}
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onClick={onClick}
        title={`${label}: ${Math.round(normVal * 100)}% (Click or drag up/down)`}
        className={`relative ${sizeClass} cursor-grab active:cursor-grabbing rounded-full transition-transform active:scale-95`}
        style={{
          boxShadow: `
            0 8px 16px rgba(0,0,0,0.6),
            0 2px 4px rgba(0,0,0,0.8),
            inset 0 2px 3px rgba(255,240,180,0.4),
            inset 0 -3px 6px rgba(40,20,5,0.8)
          `,
        }}
      >
        {/* Knurled outer brass ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #b8860b 0deg, #d4af37 45deg, #8a6508 90deg, #ffd700 135deg, #996515 180deg, #daa520 225deg, #785207 270deg, #e6ca65 315deg, #b8860b 360deg)',
            padding: '2px',
          }}
        >
          {/* Subtle knurl ticks on perimeter */}
          <div className="w-full h-full rounded-full border border-amber-900/60 overflow-hidden relative">
            {/* Rotating dial body */}
            <div
              className="w-full h-full rounded-full flex items-center justify-center relative shadow-inner"
              style={{
                transform: `rotate(${angle}deg)`,
                background: 'radial-gradient(circle at 35% 35%, #e8ca68 0%, #c4992b 40%, #875c12 85%, #5a3c05 100%)',
              }}
            >
              {/* Pointer indicator line */}
              <div
                className="absolute top-1 w-1 rounded-full bg-red-600 shadow-[0_0_4px_#ef4444]"
                style={{ height: isCenter ? '14px' : '9px' }}
              />

              {/* Center icon / medallion */}
              {isCenter && (
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  style={{
                    background: 'radial-gradient(circle, #784805 0%, #422602 100%)',
                    border: '1px solid #d4af37',
                  }}
                >
                  {icon === 'dhak' ? (
                    // Embossed Bengali Dhak icon
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] fill-current">
                      <path d="M5 6c0-1.66 3.13-3 7-3s7 1.34 7 3v12c0 1.66-3.13 3-7 3s-7-1.34-7-3V6zm2 .4v2.5l3.5 1.5L7 11.9v2.5l3.5 1.5L7 17.4v.2c1.1.5 3 .9 5 .9s3.9-.4 5-.9v-.2l-3.5-1.5 3.5-1.5v-2.5l-3.5-1.5 3.5-1.5V6.4C15.9 5.9 14 5.5 12 5.5s-3.9.4-5 .9z" />
                    </svg>
                  ) : (
                    // Diya lamp icon
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] fill-current">
                      <path d="M12 2c.5 1.5 1.5 3.5 1.5 5 0 1.38-.62 2.5-1.5 3.2-.88-.7-1.5-1.82-1.5-3.2 0-1.5 1-3.5 1.5-5zm-7 13c0-3.3 3.13-6 7-6s7 2.7 7 6H5zm-1 2h16c0 2.2-3.6 4-8 4s-8-1.8-8-4z" />
                    </svg>
                  )}
                </div>
              )}

              {/* Smaller non-center brass cap */}
              {!isCenter && (
                <div
                  className="w-5 h-5 rounded-full shadow-inner"
                  style={{
                    background: 'radial-gradient(circle at 40% 40%, #ffdf80 0%, #aa771c 70%, #4a2f03 100%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Label and Sublabel */}
      <div className="mt-2 text-center pointer-events-none">
        <span className="block text-[11px] md:text-xs font-serif font-bold text-amber-200 tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {label}
        </span>
        {sublabel && (
          <span className="block text-[9px] text-amber-400/80 font-sans tracking-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
