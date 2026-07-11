import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LateNightThoughts() {
  return (
    <section id="late-night-thoughts" className="relative py-16 md:py-28 px-4 max-w-4xl mx-auto z-10 select-none">
      {/* Background ambient radial glowing spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-glow/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.3em] uppercase text-cyan-soft mb-3"
        >
          Sincere Words
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-light font-serif text-slate-100 mb-4"
        >
          Late Night Thoughts
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "40px" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[1px] bg-cyan-glow/40 mx-auto"
        />
      </div>

      {/* Cinematic Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative glass glass-glow border border-slate-800/40 rounded-3xl p-6 md:p-14 overflow-hidden"
      >
        {/* Soft decorative neon side highlights */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-cyan-glow/30 via-cyan-soft/10 to-transparent pointer-events-none" />
        
        {/* Intimate floating heart background graphic */}
        <div className="absolute bottom-6 right-8 text-cyan-glow/5 pointer-events-none transform rotate-12">
          <Heart size={140} strokeWidth={0.5} />
        </div>

        {/* Message Body */}
        <div className="relative z-10 flex flex-col items-center md:items-start">
          <blockquote className="w-full text-center md:text-left">
            <p className="text-xl md:text-3xl font-light font-handwritten text-slate-200 leading-[1.7em] tracking-wide mb-8">
              “I know things got confusing for a moment, but I’m glad we’re still here talking and trying. I just wanted to make something that would make you smile.”
            </p>
          </blockquote>

          {/* Sincere Signature */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center gap-3 text-cyan-soft mt-2 cursor-default"
          >
            <div className="w-6 h-[1px] bg-cyan-soft/40" />
            <span className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-sans font-medium">
              Made for you
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
