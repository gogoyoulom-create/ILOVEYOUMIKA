import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-12 px-4 w-full text-center overflow-hidden z-10 select-none">
      {/* Background ambient radial glowing spots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-cyan-glow/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Main minimal visual space */}
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
        {/* Soft breathing lighthouse beacon star */}
        <div className="relative mb-12 flex justify-center items-center w-12 h-12">
          {/* Pulsing ring circles */}
          <motion.div
            animate={{
              scale: [0.8, 1.4, 0.8],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity
            }}
            className="absolute w-8 h-8 rounded-full border border-cyan-glow/20 bg-cyan-glow/5 filter blur-xs"
          />
          <motion.div
            animate={{
              scale: [1, 1.7, 1],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 1.5
            }}
            className="absolute w-10 h-10 rounded-full border border-cyan-glow/10 bg-cyan-glow/2 filter blur-sm"
          />
          {/* Small core star */}
          <div className="relative z-10 w-2 h-2 rounded-full bg-cyan-glow shadow-[0_0_10px_#00f0ff]" />
        </div>

        {/* Ending statement */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.9, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl font-light text-slate-200 tracking-wider max-w-lg leading-relaxed mb-16 font-sans"
        >
          “No pressure. No expectations. I just really like having you in my life.”
        </motion.p>

        {/* Minimal divider */}
        <div className="w-8 h-[1px] bg-slate-800/40 mb-8 mx-auto" />

        {/* Intimate copyright signature tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.35 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="flex flex-col items-center gap-1.5 cursor-default"
        >
          <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-slate-400 font-sans">
            <span>Made with genuine care for Mika</span>
            <Heart size={8} className="text-cyan-soft inline" />
          </div>
          <span className="text-[9px] tracking-wider text-slate-500 font-handwritten text-xs">
            a quiet place on the internet
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
