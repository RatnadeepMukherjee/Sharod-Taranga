import React, { useState } from 'react';
import { StationData, Language } from '../types/radio';
import { X, RotateCcw, Check, Youtube, Music2 } from 'lucide-react';

interface CustomPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: StationData[];
  customYoutubeMap: Record<string, string>;
  onSaveCustomMap: (newMap: Record<string, string>) => void;
  onResetDefaults: () => void;
  language: Language;
}

export const CustomPlaylistModal: React.FC<CustomPlaylistModalProps> = ({
  isOpen,
  onClose,
  stations,
  customYoutubeMap,
  onSaveCustomMap,
  onResetDefaults,
  language,
}) => {
  const [tempMap, setTempMap] = useState<Record<string, string>>(customYoutubeMap);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Extract YouTube ID or URL
  const extractVideoId = (input: string) => {
    const trimmed = input.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = trimmed.match(regExp);
    return match && match[2].length === 11 ? match[2] : trimmed;
  };

  const handleInputChange = (stationId: string, value: string) => {
    const cleanId = extractVideoId(value);
    setTempMap((prev) => ({
      ...prev,
      [stationId]: cleanId,
    }));
  };

  const handleSave = () => {
    onSaveCustomMap(tempMap);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-[#160d09] border-2 border-amber-900/80 shadow-2xl text-amber-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-900/50 bg-gradient-to-r from-amber-950 via-[#22120b] to-amber-950">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            <h3 className="font-serif font-bold text-base text-amber-200">
              {language === 'bn' ? 'কাস্টম প্লেলিস্ট সম্পাদনা' : 'Custom Broadcast Playlist'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-5 py-2.5 bg-amber-950/40 border-b border-amber-900/30 text-xs text-amber-300/90 flex items-center gap-2">
          <Music2 className="w-4 h-4 text-amber-400 flex-none" />
          <span>
            {language === 'bn'
              ? 'প্রতিটি পূজার দিনের জন্য আপনার পছন্দের YouTube ভিডিও লিংক বা আইডি দিন।'
              : 'Paste your favorite YouTube video URL or ID for each sacred Durga Puja day.'}
          </span>
        </div>

        {/* List of Stations */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
          {stations.map((st) => {
            const currentVal = tempMap[st.id] ?? st.youtubeId;
            return (
              <div
                key={st.id}
                className="p-2.5 rounded-lg bg-black/50 border border-stone-800/80 hover:border-amber-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.themeColor }} />
                    <span className="text-xs font-serif font-bold text-amber-200">
                      {language === 'bn' ? st.nameBn : st.nameEn}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/80">{st.frequency} MHz</span>
                  </div>
                  <span className="text-[10px] text-stone-400 truncate max-w-[150px]">
                    {language === 'bn' ? st.trackTitleBn : st.trackTitleEn}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => handleInputChange(st.id, e.target.value)}
                    placeholder="YouTube ID or URL (e.g. N7c1V26Z3pY)"
                    className="flex-1 px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono text-amber-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  {currentVal !== st.youtubeId && (
                    <button
                      onClick={() => handleInputChange(st.id, st.youtubeId)}
                      className="text-[10px] text-stone-400 hover:text-amber-300 font-mono px-1.5 py-1 rounded bg-stone-800"
                      title="Reset this day to default"
                    >
                      {language === 'bn' ? 'আসল' : 'Reset'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-amber-900/50 bg-[#120a07]">
          <button
            onClick={() => {
              onResetDefaults();
              setTempMap({});
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সব ডিফল্ট করুন' : 'Restore All Defaults'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded hover:bg-white/5 text-xs text-stone-300 transition-colors"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {savedSuccess
                  ? language === 'bn'
                    ? 'সংরক্ষিত!'
                    : 'Saved!'
                  : language === 'bn'
                  ? 'সংরক্ষণ করুন'
                  : 'Save Playlist'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
