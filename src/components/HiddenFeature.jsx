import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldAlert, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HiddenFeature() {
  const [isGlitched, setIsGlitched] = useState(false);
  const [showConfession, setShowConfession] = useState(false);

  const handlePress = () => {
    setIsGlitched(true);

    // 1. Play glitch / screen shake sound simulation (visually)
    setTimeout(() => {
      setIsGlitched(false);
      setShowConfession(true);

      // 2. Heart confetti burst
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const heartDefaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 100,
        colors: ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#ffffff']
      };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      (function frame() {
        const timeLeft = end - Date.now();

        if (timeLeft <= 0) return;

        const particleCount = 50 * (timeLeft / duration);
        // Confetti hearts
        confetti({
          ...heartDefaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...heartDefaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });

        requestAnimationFrame(frame);
      }());
    }, 450);
  };

  return (
    <section id="hidden-feature" className="relative py-12 md:py-20 px-4 max-w-lg mx-auto z-10 select-none text-center">
      {/* Visual background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-rose-500/5 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="glass border border-slate-800/40 p-6 md:p-10 rounded-3xl relative overflow-hidden">
        {/* Soft decorative warning symbol */}
        <div className="text-slate-600 mb-6 flex justify-center opacity-60">
          <ShieldAlert size={24} strokeWidth={1} />
        </div>

        {/* Playful prompt */}
        <h3 className="text-base tracking-[0.15em] uppercase text-slate-400 mb-2 font-sans font-light">
          Secret Vault
        </h3>
        <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed mb-8">
          A small corner meant for keeping secrets locked away.
        </p>

        {/* The Playful Trigger Button */}
        <button
          onClick={handlePress}
          className="group relative px-7 py-3 rounded-full text-[10px] tracking-[0.25em] uppercase text-rose-400 bg-rose-950/20 border border-rose-900/30 hover:border-rose-500/50 hover:bg-rose-950/40 hover:text-rose-300 transition-all duration-500 overflow-hidden cursor-pointer"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Do not press
          </span>
          <span className="absolute inset-0 rounded-full bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 filter blur-sm" />
        </button>
      </div>

      {/* Screen Glitch Overlay */}
      <AnimatePresence>
        {isGlitched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.4, 0.95, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 w-full h-full z-[999] pointer-events-none border-4 border-rose-500/10 flex flex-col justify-center items-center"
            style={{ background: 'radial-gradient(circle at center, #083c20 0%, #020f09 100%)' }}
          >
            {/* Scanline visual overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none animate-pulse" />
            <span className="text-rose-500 font-mono tracking-widest text-xs uppercase animate-glitch">
              ACCESSING MEMORY VAULT...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Romantic Confession Modal Overlay */}
      <AnimatePresence>
        {showConfession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full bg-slate-950/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: { type: "spring", damping: 25, stiffness: 200 }
              }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              className="relative max-w-md w-full glass glass-glow border border-slate-800/40 p-6 md:p-12 rounded-3xl text-center shadow-2xl overflow-hidden"
            >
              {/* Internal pink ambient bloom */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-rose-500/10 rounded-full filter blur-[60px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowConfession(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors p-2 cursor-pointer"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              {/* Heart Badge */}
              <div className="text-rose-500 mb-6 flex justify-center animate-float">
                <Heart size={32} strokeWidth={1.5} fill="rgba(244, 63, 94, 0.2)" className="filter drop-shadow-[0_0_8px_#f43f5e]" />
              </div>

              {/* Confession content */}
              <h3 className="text-sm tracking-[0.2em] uppercase text-rose-400 mb-4 font-sans font-light">
                Vault Unlocked
              </h3>
              <p className="text-2xl md:text-3xl font-light font-handwritten text-slate-100 leading-[1.6em] mb-8">
                “Okay maybe I miss you more than I admit.”
              </p>

              {/* Action Button */}
              <button
                onClick={() => setShowConfession(false)}
                className="px-6 py-2 rounded-full text-[10px] tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200 transition-all duration-300 cursor-pointer"
              >
                Keep it between us
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
