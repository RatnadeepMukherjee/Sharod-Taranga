import React, { useState, useEffect } from 'react';
import { TimeOfDay, Language, StationData, RadioBand } from '../types/radio';
import { ATMOSPHERE_PRESETS } from '../data/pujaStations';
import { Radio, Clock, Sun, Moon, Sunrise, Sunset, Globe, ListMusic, Info } from 'lucide-react';

interface AkashvaniHeaderProps {
  timeOfDay: TimeOfDay;
  onTimeOfDayChange: (time: TimeOfDay) => void;
  isAutoAtmosphere: boolean;
  onToggleAutoAtmosphere: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeStation: StationData;
  activeBand: RadioBand;
  isPowered: boolean;
  onOpenPlaylistModal: () => void;
  onOpenInfoModal: () => void;
}

export const AkashvaniHeader: React.FC<AkashvaniHeaderProps> = ({
  timeOfDay,
  onTimeOfDayChange,
  isAutoAtmosphere,
  onToggleAutoAtmosphere,
  language,
  onLanguageChange,
  activeStation,
  activeBand,
  isPowered,
  onOpenPlaylistModal,
  onOpenInfoModal,
}) => {
  // Current real-time clock
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Festive Durga Puja Countdown Ticker
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(language === 'bn' ? 'bn-IN' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );

      // Target Durga Puja date: October 10th of current year (or next year if passed)
      const currentYear = now.getFullYear();
      let targetDate = new Date(currentYear, 9, 10, 6, 0, 0); // Oct 10, 6:00 AM
      if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(currentYear + 1, 9, 10, 6, 0, 0);
      }

      const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const getTimeIcon = (preset: TimeOfDay) => {
    switch (preset) {
      case 'dawn':
        return <Sunrise className="w-3.5 h-3.5 text-amber-300" />;
      case 'day':
        return <Sun className="w-3.5 h-3.5 text-yellow-300" />;
      case 'dusk':
        return <Sunset className="w-3.5 h-3.5 text-orange-400" />;
      case 'night':
        return <Moon className="w-3.5 h-3.5 text-indigo-300" />;
    }
  };

  const toBengaliNumber = (num: number | string): string => {
    if (language !== 'bn') return num.toString().padStart(2, '0');
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .padStart(2, '0')
      .split('')
      .map((d) => (/\d/.test(d) ? bnDigits[parseInt(d, 10)] : d))
      .join('');
  };

  return (
    <header className="akashvani-header flex-none w-full border-b border-amber-900/35 bg-[#140b08]/85 backdrop-blur-md px-3 sm:px-6 py-1.5 sm:py-2 text-amber-100 z-30 select-none shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Vintage Radio Station Badge & Frequency */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-600/40 shadow-inner">
            <Radio className={`w-3.5 h-3.5 ${isPowered ? 'text-amber-400 animate-pulse' : 'text-stone-500'}`} />
            <span className="font-serif tracking-wider font-bold text-xs sm:text-sm text-amber-200">
              {language === 'bn' ? 'আকাশবাণী কলকাতা' : 'AKASHVANI KOLKATA'}
            </span>
            <span className="text-[10px] font-mono text-amber-400/80 hidden xs:inline border-l border-amber-800/80 pl-1.5">
              ১৯৭৫
            </span>
          </div>

          {/* Active Band & Frequency Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 border border-stone-700/60 text-[11px] font-mono text-amber-300">
            <span className="text-amber-500 font-bold">{activeBand}</span>
            <span>
              {activeBand === 'FM' ? `${activeStation.frequency} MHz` : `${activeStation.mwFrequency} kHz`}
            </span>
          </div>
        </div>

        {/* Center: Festive Durga Puja Countdown Ticker */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-950/70 via-amber-950/80 to-red-950/70 border border-amber-600/30 text-xs shadow-inner">
          <span className="text-amber-300/90 font-medium">
            {language === 'bn' ? 'শারদোৎসব আগমনী কাউন্টডাউন:' : 'Durga Puja Countdown:'}
          </span>
          <div className="flex items-center gap-1 font-mono font-bold text-amber-200 tracking-wider">
            <span className="bg-black/50 px-1.5 py-0.5 rounded text-amber-400">
              {toBengaliNumber(countdown.days)}
              <span className="text-[9px] font-normal text-amber-300/70 ml-0.5">{language === 'bn' ? 'দিন' : 'd'}</span>
            </span>
            <span className="text-amber-500 animate-pulse">:</span>
            <span className="bg-black/50 px-1.5 py-0.5 rounded text-amber-400">
              {toBengaliNumber(countdown.hours)}
              <span className="text-[9px] font-normal text-amber-300/70 ml-0.5">{language === 'bn' ? 'ঘ' : 'h'}</span>
            </span>
            <span className="text-amber-500 animate-pulse">:</span>
            <span className="bg-black/50 px-1.5 py-0.5 rounded text-amber-400">
              {toBengaliNumber(countdown.minutes)}
              <span className="text-[9px] font-normal text-amber-300/70 ml-0.5">{language === 'bn' ? 'মি' : 'm'}</span>
            </span>
            <span className="text-amber-500 animate-pulse">:</span>
            <span className="bg-black/50 px-1.5 py-0.5 rounded text-amber-400">
              {toBengaliNumber(countdown.seconds)}
              <span className="text-[9px] font-normal text-amber-300/70 ml-0.5">{language === 'bn' ? 'সে' : 's'}</span>
            </span>
          </div>
        </div>

        {/* Right: Atmosphere Presets, Language Toggle, and Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Atmosphere Preset Dropdown / Pill */}
          <div className="flex items-center bg-black/45 border border-stone-700/60 rounded px-1.5 py-0.5 text-xs">
            <div className="mr-1">{getTimeIcon(timeOfDay)}</div>
            <select
              value={timeOfDay}
              onChange={(e) => {
                onTimeOfDayChange(e.target.value as TimeOfDay);
              }}
              className="bg-transparent text-amber-200 text-xs focus:outline-none cursor-pointer pr-1"
              aria-label="Time of Day Atmospheric Preset"
            >
              {ATMOSPHERE_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-stone-900 text-amber-100">
                  {language === 'bn' ? p.labelBn : p.labelEn}
                </option>
              ))}
            </select>
            <button
              onClick={onToggleAutoAtmosphere}
              title={isAutoAtmosphere ? 'Synced to real local time' : 'Click to auto-sync with local time'}
              className={`text-[9px] font-mono px-1 rounded transition-colors ${
                isAutoAtmosphere
                  ? 'bg-amber-600/60 text-amber-100'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              AUTO
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-black/40 border border-stone-700/70 hover:border-amber-600/60 text-xs text-amber-200 transition-colors"
            title="Toggle Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span className="font-semibold">{language === 'bn' ? 'ENG' : 'বাংলা'}</span>
          </button>

          {/* Custom Playlist Modal Trigger */}
          <button
            onClick={onOpenPlaylistModal}
            className="p-1 sm:px-2 sm:py-1 rounded bg-black/40 border border-stone-700/70 hover:border-amber-500/60 text-amber-200 hover:text-amber-100 transition-colors flex items-center gap-1 text-xs"
            title="Custom YouTube Playlist / গান যোগ করুন"
          >
            <ListMusic className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">{language === 'bn' ? 'সঙ্গীতসূচী' : 'Playlist'}</span>
          </button>

          {/* Historical Info Modal Trigger */}
          <button
            onClick={onOpenInfoModal}
            className="p-1 sm:px-2 sm:py-1 rounded bg-black/40 border border-stone-700/70 hover:border-amber-500/60 text-amber-200 hover:text-amber-100 transition-colors flex items-center gap-1 text-xs"
            title="About Akashvani Kolkata 1970s Radio"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">{language === 'bn' ? 'ইতিহাস' : 'History'}</span>
          </button>

          {/* Live Clock */}
          <div className="hidden xl:flex items-center gap-1 pl-1 text-xs font-mono text-amber-400/90">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
