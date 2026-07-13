import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const MESSAGES = [
  "gathering stardust...",
  "connecting under the same sky...",
  "building a quiet space...",
  "almost there..."
];

export default function LoadingScreen({ onComplete }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    // Complete loading after 3.8s
    const loadTimeout = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        onComplete();
      }, 800); // Wait for AnimatePresence exit animations
    }, 3800);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(loadTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 w-full h-full min-h-[100dvh] z-[9999] flex flex-col items-center justify-center select-none"
          style={{ background: 'radial-gradient(circle at center, #083c20 0%, #020f09 100%)' }}
        >
          {/* Glowing Ambient Background Spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-glow/5 rounded-full filter blur-[60px]" />

          {/* Central Pulsing Star */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.9, 1.15, 0.9],
              opacity: [0.4, 1, 0.4],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 3.5,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity
            }}
            className="relative z-10 text-cyan-glow cursor-default drop-shadow-[0_0_15px_rgba(0,240,255,0.7)]"
          >
            <Star size={44} strokeWidth={1.5} fill="rgba(0, 240, 255, 0.15)" />
          </motion.div>

          {/* Sincere comfort captions */}
          <div className="mt-8 text-center h-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.65, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-slate-300 font-light text-sm tracking-[0.2em] font-sans"
              >
                {MESSAGES[currentMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
