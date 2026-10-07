import React from 'react';
import { Language } from '../types/radio';
import { X, Radio, Sparkles, BookOpen, Heart } from 'lucide-react';

interface RadioInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RadioInfoModal: React.FC<RadioInfoModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-[#170e0a] border-2 border-amber-900/80 shadow-2xl text-amber-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/50 bg-gradient-to-r from-amber-950 via-[#26130b] to-amber-950">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base text-amber-200">
                {language === 'bn'
                  ? 'আকাশবাণী কলকাতা ও ১৯৭০-এর আগমনী বেতার'
                  : 'Akashvani Kolkata & The 1970s Valve Radio Heritage'}
              </h3>
              <p className="text-[10px] text-amber-400/80 font-mono">
                1 Garstin Place & Eden Gardens • Calcutta Broadcasting Station
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs leading-relaxed text-amber-100/90 custom-scrollbar">
          {/* Section 1: The Magic of Mahalaya & Akashvani */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40">
            <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4>
                {language === 'bn'
                  ? 'আশ্বিনের শারদপ্রাতে: বীরেন্দ্রকৃষ্ণ ভদ্র ও মহিষাসুরমর্দিনী'
                  : 'Dawn of Ashwin: Birendra Krishna Bhadra & Mahishasuramardini'}
              </h4>
            </div>
            <p className="text-amber-200/80">
              {language === 'bn'
                ? '১৯৩১ সালের মহালয়ার ভোরে ১ নম্বর গার্স্টিন প্লেসের স্টুডিও থেকে প্রথম সরাসরি সম্প্রচারিত হয় "মহিষাসুরমর্দিনী"। বাণীকুমারের রচনা, পঙ্কজ মল্লিকের সুরারোপ এবং বীরেন্দ্রকৃষ্ণ ভদ্রের অনবদ্য চণ্ডীপাঠ— এই অমর সৃষ্টি বাঙালিকে আজও ভোর চারটায় বিছানা ছাড়িয়ে রেডিওর পাশে এনে জড়ো করে।'
                : 'First broadcast live at 4:00 AM on Mahalaya dawn in 1931 from the 1 Garstin Place studio in Calcutta, "Mahishasuramardini" remains timeless. Penned by Bani Kumar, orchestrated by Pankaj Mullick, and recited with divine thunder by Birendra Krishna Bhadra, it remains the eternal emotional signal of Durga Puja.'}
            </p>
          </div>

          {/* Section 2: 1970s Teakwood Valve Radio & EM84 Magic Eye */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-stone-800">
            <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-serif font-bold text-sm">
              <Radio className="w-4 h-4 text-amber-400" />
              <h4>
                {language === 'bn'
                  ? 'বার্মা টিকউড ক্যাবিনেট ও সবুজ ম্যাজিক আই ভালভ (EM84)'
                  : 'Burma Teak Cabinet & The Green "Magic Eye" Valve (EM84)'}
              </h4>
            </div>
            <p className="text-stone-300">
              {language === 'bn'
                ? '১৯৭০-এর দশকে কলকাতার মধ্যবিত্ত বসার ঘরের গৌরব ছিল টিক কাঠের ভারী ক্যাবিনেট রেডিও। কাঁচের ডায়ালে জ্বলত মৃদু অ্যাম্বার আলো। উপরে বসানো টিউব "EM84 Magic Eye"— সুর মেলালে সবুজ ফসফর আলো দুটি দুপাশ থেকে এসে মিলে যেত মাঝখানে।'
                : 'In 1970s Calcutta, a polished Burma teakwood radio was the sacred centerpiece of the living room. The smoked-glass frequency dial glowed with warm vacuum tube amber. The green EM84 "Magic Eye" tube visually closed its emerald phosphor wings as the listener tuned dead-center onto the station.'}
            </p>
          </div>

          {/* Section 3: Keyboard & Interactive Controls */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30">
            <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-serif font-bold text-sm">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h4>
                {language === 'bn' ? 'ব্যবহারবিধি ও কীবোর্ড শর্টকাট' : 'Interactive Controls & Shortcuts'}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-black/40 border border-stone-800">
                <span className="text-amber-400 font-bold">Spacebar</span>: Play / Pause
              </div>
              <div className="p-2 rounded bg-black/40 border border-stone-800">
                <span className="text-amber-400 font-bold">Left / Right Arrow</span>: Tune Stations
              </div>
              <div className="p-2 rounded bg-black/40 border border-stone-800">
                <span className="text-amber-400 font-bold">M</span>: Mute / Unmute
              </div>
              <div className="p-2 rounded bg-black/40 border border-stone-800">
                <span className="text-amber-400 font-bold">P</span>: Power On / Off
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-amber-900/50 bg-[#120a07] flex items-center justify-between text-xs text-amber-400/80">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>{language === 'bn' ? 'বাঙালির শারদীয় নস্টালজিয়া' : 'Celebrating Bengali Autumn Nostalgia'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
