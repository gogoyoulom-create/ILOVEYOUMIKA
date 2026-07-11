import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Hero({ onEnter }) {
  
  const handleEnterClick = () => {
    // Soft starburst effect when clicking Enter
    const end = Date.now() + 0.6 * 1000;
    const colors = ['#64ffda', '#00f0ff', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    onEnter();
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden z-10 select-none">
      {/* Decorative background ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-glow/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-2xl flex flex-col items-center justify-center">
        {/* Soft, beautiful floating crown star icon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 1.5, delay: 0.2 },
            y: { duration: 4, ease: "easeInOut", repeat: Infinity }
          }}
          className="text-cyan-soft mb-6"
        >
          <Heart size={28} strokeWidth={1} fill="rgba(100, 255, 218, 0.05)" />
        </motion.div>

        {/* Cinematic Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="text-6xl md:text-8xl font-light font-serif tracking-wide text-slate-100 mb-6 text-glow"
        >
          For Mika
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1.0 }}
          className="text-sm md:text-base font-light tracking-[0.15em] text-slate-300 max-w-lg leading-relaxed mb-12 font-sans"
        >
          A small place on the internet where distance feels a little smaller.
        </motion.p>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 1.6 }}
        >
          <button
            onClick={handleEnterClick}
            className="group relative px-8 py-3.5 rounded-full text-xs font-medium tracking-[0.25em] uppercase text-cyan-glow bg-cyan-glow/5 border border-cyan-glow/20 hover:border-cyan-glow/60 transition-all duration-500 overflow-hidden cursor-pointer"
            style={{
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.04)',
            }}
          >
            {/* Hover sliding glass shimmer effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-glow/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            {/* Soft inner shadow glow */}
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-cyan-glow/5 filter blur-sm" />

            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              Enter Mika's Space
            </span>
          </button>
        </motion.div>
      </div>

      {/* Aesthetic bottom indicator for smooth scroll nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3, delay: 2.5, repeat: Infinity }}
        className="absolute bottom-8 text-[10px] tracking-[0.3em] uppercase text-slate-500 pointer-events-none"
      >
        Scroll to drift
      </motion.div>
    </div>
  );
}
