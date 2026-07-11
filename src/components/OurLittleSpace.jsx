import { motion } from 'framer-motion';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const SNIPPETS = [
  {
    text: "Even the oceans are just water. We'll cross them soon.",
    position: "top-[-5%] left-[2%] md:left-[12%]",
    rotate: "-5deg",
    delay: 0.1
  },
  {
    text: "My favorite hour is when my screen lights up with your name.",
    position: "bottom-[2%] left-[5%] md:left-[8%]",
    rotate: "4deg",
    delay: 0.3
  },
  {
    text: "Your voice is my favorite sound.",
    position: "top-[-8%] right-[2%] md:right-[15%]",
    rotate: "3deg",
    delay: 0.2
  },
  {
    text: "Same moon, different windows.",
    position: "bottom-[-5%] right-[5%] md:right-[10%]",
    rotate: "-3deg",
    delay: 0.4
  }
];

const POLAROID_DEFAULTS = [
  {
    id: 1,
    caption: "counting down the days...",
    tilt: "hover:rotate-[-5deg] rotate-[-2deg]",
    animationClass: "animate-float",
    aspect: "aspect-[4/5]",
    size: "w-[240px] md:w-[280px]"
  },
  {
    id: 2,
    caption: "cozy late night calls...",
    tilt: "hover:rotate-[4deg] rotate-[1deg]",
    animationClass: "animate-float-slow",
    aspect: "aspect-[4/5]",
    size: "w-[250px] md:w-[290px]"
  },
  {
    id: 3,
    caption: "under the same sky...",
    tilt: "hover:rotate-[-3deg] rotate-[-1deg]",
    animationClass: "animate-float-slower",
    aspect: "aspect-[4/5]",
    size: "w-[240px] md:w-[280px]"
  }
];

export default function OurLittleSpace() {
  const [images, setImages] = useState({ 1: null, 2: null, 3: null });
  const fileInputRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null)
  };

  // Load photos from LocalStorage on mount
  useEffect(() => {
    const loadedImages = {};
    for (let id = 1; id <= 3; id++) {
      const stored = localStorage.getItem(`mika_polaroid_${id}`);
      if (stored) {
        loadedImages[id] = stored;
      }
    }
    setImages((prev) => ({ ...prev, ...loadedImages }));
  }, []);

  const handleCardClick = (id) => {
    if (fileInputRefs[id].current) {
      fileInputRefs[id].current.click();
    }
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImages((prev) => ({ ...prev, [id]: base64String }));
      localStorage.setItem(`mika_polaroid_${id}`, base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = (e, id) => {
    e.stopPropagation(); // Avoid triggering file selection
    setImages((prev) => ({ ...prev, [id]: null }));
    localStorage.removeItem(`mika_polaroid_${id}`);
  };

  return (
    <section id="our-little-space" className="relative py-16 md:py-28 px-4 max-w-6xl mx-auto z-10 select-none">
      {/* Background ambient radial glowing spots */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-glow/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-blue-900/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.3em] uppercase text-cyan-soft mb-3"
        >
          Cozy Scrapbook
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-light font-serif text-slate-100 mb-4"
        >
          Our Little Space
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "40px" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[1px] bg-cyan-glow/40 mx-auto"
        />
      </div>

      {/* Scrapbook Board Container */}
      <div className="relative w-full max-w-5xl mx-auto py-12 px-2">
        
        {/* Floating Handwritten Cute Message Snippets */}
        {SNIPPETS.map((snippet, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            whileInView={{ 
              opacity: 0.75, 
              scale: 1,
              rotate: snippet.rotate
            }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: snippet.delay }}
            className={`absolute ${snippet.position} hidden sm:block z-20 px-5 py-3 rounded-lg border border-slate-800/40 glass glass-glow text-[11px] md:text-[12px] tracking-wide text-slate-300 pointer-events-none max-w-[200px] leading-relaxed text-center font-handwritten shadow-md`}
          >
            {/* Soft decorative pin clip */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-soft/20 border border-cyan-soft/40 shadow-sm" />
            {snippet.text}
          </motion.div>
        ))}

        {/* Polaroid Photos Collage Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 relative z-10">
          {POLAROID_DEFAULTS.map((p) => {
            const uploadedPhoto = images[p.id];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: p.id * 0.15 }}
                className={`${p.size} ${p.animationClass} flex-shrink-0 transition-transform duration-500`}
              >
                {/* File input (hidden) */}
                <input
                  type="file"
                  ref={fileInputRefs[p.id]}
                  onChange={(e) => handleFileChange(e, p.id)}
                  accept="image/*"
                  className="hidden"
                />

                {/* Polaroid Frame Container */}
                <div 
                  onClick={() => handleCardClick(p.id)}
                  className={`w-full p-4 pb-6 rounded-lg glass border border-slate-700/30 shadow-2xl relative transition-all duration-500 ${p.tilt} group overflow-hidden cursor-pointer`}
                  style={{
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(0,240,255,0.02) inset'
                  }}
                >
                  {/* Washi Tape Accent */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 tape-accent z-20 pointer-events-none" />

                  {/* Polaroid Photo Wrapper */}
                  <div className={`relative w-full ${p.aspect} bg-slate-950/80 rounded-sm overflow-hidden mb-4 border border-slate-900/60`}>
                    {uploadedPhoto ? (
                      <>
                        {/* Display uploaded image */}
                        <img 
                          src={uploadedPhoto} 
                          alt={p.caption} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                        />
                        
                        {/* Hover Clear/Delete Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                          <button
                            onClick={(e) => handleClearPhoto(e, p.id)}
                            className="p-2 rounded-full bg-slate-900/90 text-rose-400 border border-slate-800 hover:scale-110 transition-transform shadow-lg cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 size={16} />
                          </button>
                          <span className="text-[9px] tracking-wider text-slate-300 uppercase font-sans">
                            Replace
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Display Dreamy Neon star fallback with Upload Prompt */
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-glow/10 text-slate-500 gap-3 overflow-hidden">
                        {/* Glowing background blooms */}
                        <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-cyan-glow/5 filter blur-xl animate-pulse-slow" />
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-blue-500/5 filter blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                        
                        <Camera size={22} strokeWidth={1.2} className="text-cyan-soft/40 group-hover:text-cyan-glow transition-colors duration-500 animate-float-slow" />
                        
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0 text-slate-400 group-hover:text-slate-200">
                          <Upload size={10} />
                          <span className="text-[9px] tracking-[0.2em] uppercase font-sans font-medium">
                            Add memory
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Dark photo inner glow shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                  </div>

                  {/* Polaroid Handwritten Caption */}
                  <div className="text-center">
                    <p className="text-lg md:text-xl font-light font-handwritten text-slate-200 tracking-wide">
                      {p.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

