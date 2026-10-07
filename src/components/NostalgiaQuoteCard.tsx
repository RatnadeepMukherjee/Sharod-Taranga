import React from 'react';
import { StationData, Language } from '../types/radio';
import { Sparkles, ChevronLeft, ChevronRight, Flame } from 'lucide-react';

interface NostalgiaQuoteCardProps {
  activeStation: StationData;
  language: Language;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const NostalgiaQuoteCard: React.FC<NostalgiaQuoteCardProps> = ({
  activeStation,
  language,
  onPrevDay,
  onNextDay,
}) => {
  return (
    <section className="nostalgia-quote-section flex-none w-full max-w-2xl mx-auto px-3 sm:px-6 mb-2 sm:mb-3 select-none z-20">
      <div className="nostalgia-card relative rounded-xl bg-[#140b08]/80 border border-amber-900/50 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-xl flex items-center justify-between gap-2.5 overflow-hidden">
        {/* Amber edge aura */}
        <div
          className="absolute -left-10 top-0 bottom-0 w-24 blur-xl pointer-events-none opacity-40 transition-colors duration-700"
          style={{ backgroundColor: activeStation.themeColor }}
        />

        {/* Previous Day Nav Button */}
        <button
          onClick={onPrevDay}
          className="flex-none p-1 sm:p-1.5 rounded-full bg-black/40 hover:bg-amber-950/80 text-amber-400 hover:text-amber-200 border border-stone-800 transition-colors"
          title="Previous Puja Day / আগের দিন"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Center: Quote & Attribution */}
        <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 text-center sm:text-left">
          {/* Animated Incense Smoke / Holy Flame Icon */}
          <div className="hidden xs:flex flex-none w-8 h-8 rounded-full bg-gradient-to-tr from-amber-950 to-orange-950 border border-amber-600/40 items-center justify-center shadow-inner">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Day Title & Date Badge */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-0.5">
              <span className="text-xs font-serif font-bold text-amber-300">
                {language === 'bn' ? activeStation.nameBn : activeStation.nameEn}
              </span>
              <span className="text-[10px] text-amber-500/80 font-mono">
                • {language === 'bn' ? activeStation.dateBn : activeStation.dateEn}
              </span>
            </div>

            {/* Quote excerpt */}
            <p className="text-[11px] sm:text-xs font-serif italic text-amber-100/90 line-clamp-1 leading-snug">
              &ldquo;{language === 'bn' ? activeStation.quoteBn : activeStation.quoteEn}&rdquo;
            </p>

            {/* Author */}
            <p className="text-[9px] sm:text-[10px] font-mono text-amber-400/80 truncate mt-0.5">
              — {language === 'bn' ? activeStation.quoteAuthorBn : activeStation.quoteAuthorEn}
            </p>
          </div>
        </div>

        {/* Next Day Nav Button */}
        <button
          onClick={onNextDay}
          className="flex-none p-1 sm:p-1.5 rounded-full bg-black/40 hover:bg-amber-950/80 text-amber-400 hover:text-amber-200 border border-stone-800 transition-colors"
          title="Next Puja Day / পরের দিন"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
