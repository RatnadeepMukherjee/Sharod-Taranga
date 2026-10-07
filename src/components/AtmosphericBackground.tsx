import React from 'react';
import { TimeOfDay, StationData } from '../types/radio';
import dawnBg from '../assets/images/bengali_puja_dawn_1790530679559.jpg';
import eveningBg from '../assets/images/sandhi_puja_evening_1790531555702.jpg';

interface AtmosphericBackgroundProps {
  timeOfDay: TimeOfDay;
  activeStation: StationData;
  isRadioOn: boolean;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  timeOfDay,
  activeStation,
  isRadioOn,
}) => {
  // Select hero scenic based on timeOfDay and active festival day
  const getBackgroundImage = () => {
    if (timeOfDay === 'dusk' || timeOfDay === 'night' || activeStation.id === 'ashtami') {
      return eveningBg;
    }
    return dawnBg;
  };

  // Preset lighting tint and scrim overlays
  const getAtmosphereScrim = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'linear-gradient(180deg, rgba(20, 10, 32, 0.72) 0%, rgba(68, 24, 38, 0.45) 45%, rgba(140, 58, 28, 0.65) 100%)';
      case 'day':
        return 'linear-gradient(180deg, rgba(14, 28, 48, 0.62) 0%, rgba(38, 70, 98, 0.38) 45%, rgba(65, 45, 30, 0.65) 100%)';
      case 'dusk':
        return 'linear-gradient(180deg, rgba(22, 10, 26, 0.78) 0%, rgba(78, 25, 35, 0.52) 45%, rgba(125, 48, 18, 0.72) 100%)';
      case 'night':
      default:
        return 'linear-gradient(180deg, rgba(6, 6, 12, 0.85) 0%, rgba(16, 12, 24, 0.72) 50%, rgba(10, 8, 18, 0.88) 100%)';
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Underlying High-Res Bengali Durga Puja Scenic Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-out transform scale-102"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
          filter: timeOfDay === 'night' ? 'brightness(0.6) saturate(0.85)' : timeOfDay === 'day' ? 'brightness(0.85) saturate(1.1)' : 'brightness(0.75) saturate(1.15)',
        }}
      />

      {/* 2. Dynamic Time-of-Day Gradient Scrim */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{
          background: getAtmosphereScrim(),
        }}
      />

      {/* 3. Subtle Day/Festival Day Color Wash Accent */}
      <div
        className="absolute inset-0 w-full h-full mix-blend-color transition-colors duration-700"
        style={{
          backgroundColor: activeStation.themeColor,
          opacity: 0.12,
        }}
      />

      {/* 4. Analog Film Grain Noise Overlay */}
      <div
        className="absolute inset-0 w-full h-full opacity-18 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.35'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 5. Deep Cinematic Vignette Shadows */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(10, 5, 12, 0.75) 85%, rgba(5, 2, 8, 0.94) 100%)',
        }}
      />

      {/* 6. Dynamic Valve Tube Warm Glow from Console */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[110px] pointer-events-none transition-opacity duration-1000"
        style={{
          background: isRadioOn
            ? 'radial-gradient(circle, rgba(255, 170, 70, 0.18) 0%, rgba(220, 80, 40, 0.08) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(200, 120, 50, 0.03) 0%, transparent 70%)',
          opacity: isRadioOn ? 1 : 0.2,
        }}
      />
    </div>
  );
};
