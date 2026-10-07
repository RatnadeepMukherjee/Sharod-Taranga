import React from 'react';
import { X, Sparkles, Music, Radio, Sun, Flame, Flower2 } from 'lucide-react';

interface CulturalNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CulturalNotesModal: React.FC<CulturalNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#1c120c] border-2 border-amber-600/70 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-amber-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 border border-amber-800 text-amber-300 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 pb-4 border-b border-amber-800/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-serif text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design Blueprint & Cultural Iconography</span>
          </div>
          <h2 className="font-serif font-black text-2xl md:text-3xl text-amber-200">
            The Bengali Durga Puja Radio (1970s)
          </h2>
          <p className="font-serif italic text-amber-400/80 text-sm mt-1">
            শারদোৎসবের প্রভাতী স্মৃতি ও ট্রানজিস্টার রেডিওর অমর সুর
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-4 text-sm leading-relaxed">
          
          {/* Card 1: Woven Cane Grille & Dhunuchi Clay Texture */}
          <div className="p-4 rounded-xl bg-black/40 border border-amber-900/60 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-600/50 text-amber-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-200 text-base">
                Dhunuchi Perforated Clay & Woven Cane Grille
              </h3>
              <p className="text-stone-300 mt-1">
                The speaker grille reflects the earthy, perforated bowl of a traditional terracotta <span className="text-amber-300 font-semibold">dhunuchi</span>—used during the ecstatic evening <span className="italic">Dhunuchi Naach</span> to burn glowing coconut husks, camphor, and fragrant resin (<span className="italic">dhuno</span>). The woven natural cane evokes rural Bengal craftsmanship.
              </p>
            </div>
          </div>

          {/* Card 2: Smoked Glass Dial with Puja Days */}
          <div className="p-4 rounded-xl bg-black/40 border border-amber-900/60 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-600/50 text-amber-400 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-200 text-base">
                Puja Day Frequency Scale & Amber Glow
              </h3>
              <p className="text-stone-300 mt-1">
                Rather than generic megahertz numbers alone, the dial scale marks the sacred progression of the festival: <span className="text-amber-300 font-semibold">Mahalaya, Shashthi, Saptami, Ashtami, Nabami,</span> and <span className="text-amber-300 font-semibold">Dashami</span>. Tuning smoothly sweeps the thin red needle under warm amber backlighting reminiscent of vintage vacuum tube and early solid-state radios.
              </p>
            </div>
          </div>

          {/* Card 3: Five Knobs & Dhak Centerpiece */}
          <div className="p-4 rounded-xl bg-black/40 border border-amber-900/60 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-600/50 text-amber-400 shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-200 text-base">
                Row of 5 Brass Knobs & Embossed Dhak Drum
              </h3>
              <p className="text-stone-300 mt-1">
                Five tactile round knobs allow precise adjustment of Volume, Bass warmth, Dhak rhythm accompaniment, Treble clarity, and Frequency tuning. The centerpiece knob is enlarged and stamped with a <span className="text-amber-300 font-semibold">Bengali Dhak</span> drum icon, triggering the resonant skin-and-cane pulse of pandal celebration.
              </p>
            </div>
          </div>

          {/* Card 4: Alpona Border & Sindoor Enamel */}
          <div className="p-4 rounded-xl bg-black/40 border border-amber-900/60 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-600/50 text-amber-400 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-200 text-base">
                Sindoor Vermilion Enamel & Engraved Alpona Trim
              </h3>
              <p className="text-stone-300 mt-1">
                The deep vermilion red echoes <span className="text-amber-300 font-semibold">sindoor</span>, the sacred symbol of marriage, strength, and the spirited celebration of <span className="italic">Sindoor Khela</span> on Dashami. Separating the sections is a laser-fine brass strip etched with traditional <span className="text-amber-300 font-semibold">Alpona</span>—the sacred rice-paste floor motifs hand-painted at dawn.
              </p>
            </div>
          </div>

          {/* Card 5: Shiuli Flowers & Dawn Nostalgia */}
          <div className="p-4 rounded-xl bg-black/40 border border-amber-900/60 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-600/50 text-amber-400 shrink-0">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-200 text-base">
                Fresh Shiuli Blossoms Resting on Top
              </h3>
              <p className="text-stone-300 mt-1">
                Freshly gathered <span className="text-amber-300 font-semibold">Shiuli (Shefali / Night-flowering Jasmine)</span> with pure white pinwheel petals and vibrant orange stalks rest on the brass handle and top casing, evoking the misty autumn mornings when children gather flowers before the conch blows at dawn.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-amber-900/60 flex justify-between items-center text-xs text-amber-400/80">
          <span>Designed with Bengali Heritage & 1970s Industrial Aesthetic</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors cursor-pointer"
          >
            Back to Radio
          </button>
        </div>

      </div>
    </div>
  );
};
