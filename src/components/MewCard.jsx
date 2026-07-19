import { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const CARD_DATA = {
  name: "Mew ex (Standard)",
  number: "151/165",
  imageUrl: "https://images.pokemontcg.io/sv3pt5/151_hires.png",
  accentColor: "rgba(0, 240, 255, 0.4)",
  themeGlow: "shadow-[0_0_40px_rgba(0,240,255,0.25)]",
  bgColor: "from-cyan-950/40 to-slate-900/40"
};

export default function MewCard() {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -18; // Max 18deg tilt
    const rotateY = ((x - centerX) / centerX) * 18;  // Max 18deg tilt
    
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full filter blur-[100px] pointer-events-none bg-cyan-500/5" />

      {/* Styled inline classes */}
      <style dangerouslySetInnerHTML={{__html: `
        .tcg-perspective {
          perspective: 1200px;
        }
        .tcg-card-inner {
          position: relative;
          width: 250px;
          height: 350px;
          transition: transform 0.15s ease-out, box-shadow 0.3s ease;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
        }
        .tcg-card-front {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background-color: #0b1524;
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
          A holographic Mew ex card to keep you company. Hover to shine.
        </p>
      </div>

      {/* 3D Pokemon Card Container */}
      <div className="tcg-perspective relative group cursor-default mb-8">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`tcg-card-inner rounded-[14px] ${CARD_DATA.themeGlow} hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]`}
        >
          {/* Card Front Face */}
          <div className="tcg-card-front select-none">
            {/* Holographic Sheen Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-45 group-hover:opacity-75 transition-opacity duration-300 z-10"
              style={{
                background: `linear-gradient(
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
              src={CARD_DATA.imageUrl}
              alt={CARD_DATA.name}
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
