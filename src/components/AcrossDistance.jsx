import { motion } from 'framer-motion';
import { Heart, Compass, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AcrossDistance() {
  const [isHovered, setIsHovered] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [germanyTime, setGermanyTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
      setGermanyTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Europe/Berlin',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="across-the-distance" className="relative py-16 md:py-28 px-4 max-w-5xl mx-auto z-10 select-none">
      {/* Background radial soft light blobs */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.3em] uppercase text-cyan-soft mb-3"
        >
          Unseen Connection
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-light font-serif text-slate-100 mb-4"
        >
          Across The Distance
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "40px" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[1px] bg-cyan-glow/40 mx-auto"
        />
      </div>

      {/* Connection Chart Map */}
      <div className="relative w-full max-w-3xl mx-auto h-[350px] md:h-[400px] rounded-3xl glass glass-glow border border-slate-800/40 overflow-hidden flex flex-col justify-between p-5 md:p-12">
        {/* Constellation grid backdrop */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)]"
          style={{ backgroundSize: '24px 24px' }}
        />

        {/* Floating background Moon icon */}
        <div className="absolute top-8 right-8 text-slate-700 pointer-events-none animate-float-slow">
          <Moon size={36} strokeWidth={1} />
        </div>

        {/* Interactive connection chart */}
        <div 
          className="relative w-full h-[180px] md:h-[220px] flex items-center justify-between cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Connecting glowing bezier line (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Ambient background glow path */}
            <motion.path
              d="M 50 100 Q 300 0 550 100"
              fill="transparent"
              stroke="#00f0ff"
              strokeWidth={isHovered ? 4 : 2}
              className="transition-all duration-500 opacity-20 filter blur-[4px]"
            />
            {/* Crisp connection path */}
            <motion.path
              d="M 50 100 Q 300 0 550 100"
              fill="transparent"
              stroke="url(#gradient-cyan-blue)"
              strokeWidth={1.5}
              strokeDasharray="4 6"
              className="opacity-60"
            />
            {/* Sliding stardust particles */}
            <motion.path
              id="connector-path"
              d="M 50 100 Q 300 0 550 100"
              fill="transparent"
              stroke="transparent"
            />
            {/* Slide 1 */}
            <circle r="4" fill="#00f0ff" className="filter drop-shadow-[0_0_6px_#00f0ff]">
              <animateMotion dur="6s" repeatCount="indefinite">
                <mpath href="#connector-path" />
              </animateMotion>
            </circle>
            {/* Slide 2 (delayed) */}
            <circle r="3" fill="#64ffda" className="filter drop-shadow-[0_0_4px_#64ffda]">
              <animateMotion dur="6s" begin="3s" repeatCount="indefinite">
                <mpath href="#connector-path" />
              </animateMotion>
            </circle>

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient-cyan-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64ffda" />
                <stop offset="50%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Left Node (You) */}
          <div className="relative z-10 flex flex-col items-center translate-y-4">
            <motion.div
              animate={{ scale: isHovered ? 1.15 : 1 }}
              className="w-10 h-10 rounded-full bg-slate-900 border border-cyan-soft/40 flex items-center justify-center relative cursor-default"
            >
              {/* Outer Pulsing Star Beacon */}
              <div className="absolute inset-0 rounded-full bg-cyan-soft/20 beacon-glowing" />
              
              <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-cyan-soft drop-shadow-[0_0_8px_#64ffda]" />
            </motion.div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-400 mt-3 font-medium whitespace-nowrap">
              Your Sky
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 mt-1 select-none whitespace-nowrap">
              {localTime}
            </span>
          </div>

          {/* Connected floating note */}
          <div className="absolute left-1/2 top-[10%] md:top-[5%] -translate-x-1/2 text-center pointer-events-none select-none">
            <motion.div
              animate={{ 
                opacity: isHovered ? 1 : 0.4, 
                y: isHovered ? -5 : 0 
              }}
              transition={{ duration: 0.4 }}
              className="px-4 py-1.5 rounded-full glass border border-slate-800/60 flex items-center gap-2"
            >
              <Heart size={10} className="text-cyan-glow animate-pulse flex-shrink-0" fill="#00f0ff" />
              <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-wider text-slate-300 font-sans uppercase whitespace-nowrap">
                {isHovered ? "Distance feels like zero" : "Under the same stars"}
              </span>
            </motion.div>
          </div>

          {/* Right Node (Mika) */}
          <div className="relative z-10 flex flex-col items-center translate-y-4">
            <motion.div
              animate={{ scale: isHovered ? 1.15 : 1 }}
              className="w-10 h-10 rounded-full bg-slate-900 border border-blue-400/40 flex items-center justify-center relative cursor-default"
            >
              {/* Outer Pulsing Star Beacon */}
              <div className="absolute inset-0 rounded-full bg-blue-500/20 beacon-glowing" />
              
              <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#3b82f6] drop-shadow-[0_0_8px_#3b82f6]" />
            </motion.div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-cyan-glow mt-3 font-semibold whitespace-nowrap">
              Mika
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-cyan-soft mt-1 select-none whitespace-nowrap">
              Germany • {germanyTime}
            </span>
          </div>
        </div>

        {/* Emotion Typography Text */}
        <div className="text-center mt-6">
          <p className="text-2xl md:text-3xl font-light text-slate-200 tracking-wide font-sans">
            Different places, <span className="font-handwritten text-4xl md:text-5xl text-cyan-glow font-normal ml-1">same sky.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
