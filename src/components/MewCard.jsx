import { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const CARD_DATA = {
  standard: {
    name: "Mew ex (Standard)",
    number: "151/165",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/151_hires.png",
    accentColor: "rgba(0, 240, 255, 0.4)",
    themeGlow: "shadow-[0_0_40px_rgba(0,240,255,0.25)]",
    bgColor: "from-cyan-950/40 to-slate-900/40"
  },
  gold: {
    name: "Mew ex (Gold)",
    number: "205/165",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/205_hires.png",
    accentColor: "rgba(251, 191, 36, 0.4)",
    themeGlow: "shadow-[0_0_40px_rgba(251,191,36,0.25)]",
    bgColor: "from-amber-950/30 to-slate-900/40"
  }
};

export default function MewCard() {
  const [selectedCard, setSelectedCard] = useState('standard');
  const [isFlipped, setIsFlipped] = useState(false);
  
  const cardRef = useRef(null);

  const currentCard = CARD_DATA[selectedCard];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Reverse tilt direction on Y axis if flipped so it tilts naturally
    const tiltMultiplier = isFlipped ? -1 : 1;
    
    const rotateX = ((y - centerY) / centerY) * -18; // Max 18deg tilt
    const rotateY = ((x - centerX) / centerX) * 18 * tiltMultiplier; // Max 18deg tilt
    
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
    
    // Map coords to percentage
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;
    card.style.setProperty('--mx', `${sheenX}%`);
    card.style.setProperty('--my', `${sheenY}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  };

  return (
    <section id="mew-mascot" className="relative py-16 md:py-24 px-4 max-w-lg mx-auto z-10 select-none text-center flex flex-col items-center">
      {/* Background ambient glowing spot */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full filter blur-[100px] pointer-events-none transition-all duration-700 ${selectedCard === 'gold' ? 'bg-amber-500/5' : 'bg-cyan-500/5'}`} />

      {/* Styled inline classes */}
      <style dangerouslySetInnerHTML={{__html: `
        .tcg-perspective {
          perspective: 1200px;
        }
        .tcg-card-inner {
          position: relative;
          width: 250px;
          height: 350px;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) ${isFlipped ? 'rotateY(180deg)' : ''};
        }
        .tcg-card-front, .tcg-card-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .tcg-card-front {
          background-color: #0b1524;
        }
        .tcg-card-back {
          transform: rotateY(180deg);
          background-color: #121c2c;
        }
      `}} />

      {/* Section Title */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 text-cyan-soft mb-3 opacity-60">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] tracking-[0.35em] uppercase font-sans font-semibold">
            Cute Mascot
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light font-serif text-slate-100 mb-2">
          A Tiny Companion
        </h2>
        <div className="h-[1px] w-8 bg-cyan-glow/30 mx-auto mb-4" />
        <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
          A holographic Mew ex card to keep you company. Hover to shine, click to flip.
        </p>
      </div>

      {/* 3D Pokemon Card Container */}
      <div className="tcg-perspective relative group cursor-pointer mb-8">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsFlipped(!isFlipped)}
          className={`tcg-card-inner rounded-[14px] ${currentCard.themeGlow} hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]`}
        >
          {/* Card Front Face */}
          <div className="tcg-card-front select-none">
            {/* Holographic Sheen Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-45 group-hover:opacity-75 transition-opacity duration-300 z-10"
              style={{
                background: selectedCard === 'gold' 
                  ? `linear-gradient(
                      115deg,
                      transparent 20%,
                      rgba(255, 223, 0, 0.25) 30%,
                      rgba(251, 191, 36, 0.35) 45%,
                      rgba(255, 255, 255, 0.2) 55%,
                      transparent 70%
                    )`
                  : `linear-gradient(
                      115deg,
                      transparent 20%,
                      rgba(0, 240, 255, 0.25) 30%,
                      rgba(100, 255, 218, 0.35) 45%,
                      rgba(244, 63, 94, 0.25) 55%,
                      transparent 70%
                    )`,
                backgroundSize: '200% 200%',
                backgroundPosition: `calc(var(--mx, 50%) * 2) calc(var(--my, 50%) * 2)`,
              }}
            />

            {/* Micro Glitter Texture */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* High-res Front Image */}
            <img
              src={currentCard.imageUrl}
              alt={currentCard.name}
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="lazy"
            />
          </div>

          {/* Card Back Face */}
          <div className="tcg-card-back select-none flex flex-col justify-between p-1 bg-gradient-to-b from-[#111c2e] to-[#080f1a]">
            {/* We overlay a high-quality Pokemon cardback image */}
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/a4/Pokemon_all_card_back.png"
              alt="Pokemon Card Back"
              className="w-full h-full object-cover select-none pointer-events-none rounded-[12px] opacity-95 group-hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />

            {/* Overlay a cute micro heart decoration on the back's center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-slate-900/90 border border-slate-700/60 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-xs flex items-center justify-center">
              <span className="text-[10px] font-sans tracking-widest text-cyan-soft font-semibold uppercase">MIKA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="flex items-center gap-3 p-1 glass border border-slate-800/40 rounded-full select-none text-[10px] tracking-wider uppercase">
        <button
          onClick={() => {
            setSelectedCard('standard');
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${selectedCard === 'standard' ? 'bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
        >
          Mew ex 151
        </button>
        <button
          onClick={() => {
            setSelectedCard('gold');
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${selectedCard === 'gold' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
        >
          Gold ex 205
        </button>
      </div>
    </section>
  );
}
