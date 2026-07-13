import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, Cloud, CloudOff, X, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, getSupabaseConfig, reloadSupabaseClient } from '../lib/supabase';

// Helper defined in module scope to satisfy React 19 purity rules
const getCacheBuster = () => new Date().getTime();

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
  const [config, setConfig] = useState(() => getSupabaseConfig());
  const [images, setImages] = useState({ 1: null, 2: null, 3: null });
  const [isCloudConnected, setIsCloudConnected] = useState(() => !!(supabase && config.url && config.key));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [inputUrl, setInputUrl] = useState(() => config.url);
  const [inputKey, setInputKey] = useState(() => config.key);

  const fileInputRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null)
  };

  const loadLocalPhotos = useCallback(() => {
    const loadedImages = {};
    for (let id = 1; id <= 3; id++) {
      const stored = localStorage.getItem(`mika_polaroid_${id}`);
      loadedImages[id] = stored || null;
    }
    setImages(loadedImages);
  }, []);

  const loadCloudPhotos = useCallback(async (client) => {
    setIsLoading(true);
    try {
      // List files in the 'polaroids' bucket
      const { data: files, error } = await client.storage
        .from('polaroids')
        .list('', { sortBy: { column: 'name', order: 'asc' } });
      
      if (error) {
        console.error('Error listing Supabase files:', error);
        setIsCloudConnected(false);
        loadLocalPhotos();
        return;
      }

      setIsCloudConnected(true);
      const cloudImages = {};
      for (let id = 1; id <= 3; id++) {
        const fileExists = files.some(f => f.name === `polaroid_${id}`);
        if (fileExists) {
          const { data } = client.storage
            .from('polaroids')
            .getPublicUrl(`polaroid_${id}`);
          
          if (data?.publicUrl) {
            cloudImages[id] = `${data.publicUrl}?t=${getCacheBuster()}`;
          }
        } else {
          cloudImages[id] = null;
        }
      }
      setImages(cloudImages);
    } catch (e) {
      console.error('Failed to load photos from cloud:', e);
      setIsCloudConnected(false);
      loadLocalPhotos();
    } finally {
      setIsLoading(false);
    }
  }, [loadLocalPhotos]);

  // Load photos on mount / config change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (supabase && config.url && config.key) {
        loadCloudPhotos(supabase);
      } else {
        setIsCloudConnected(false);
        loadLocalPhotos();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [config.url, config.key, loadCloudPhotos, loadLocalPhotos]);

  const handleCardClick = (id) => {
    if (isLoading) return;
    if (fileInputRefs[id].current) {
      fileInputRefs[id].current.click();
    }
  };

  const handleFileChange = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isCloudConnected && supabase) {
      setIsLoading(true);
      try {
        // Upload to Supabase Storage (upsert = true allows overwriting)
        const { error } = await supabase.storage
          .from('polaroids')
          .upload(`polaroid_${id}`, file, {
            contentType: file.type,
            upsert: true
          });

        if (error) throw error;

        // Fetch new public URL
        const { data } = supabase.storage
          .from('polaroids')
          .getPublicUrl(`polaroid_${id}`);

        if (data?.publicUrl) {
          const freshUrl = `${data.publicUrl}?t=${getCacheBuster()}`;
          setImages((prev) => ({ ...prev, [id]: freshUrl }));
        }
      } catch (err) {
        console.error('Supabase upload error:', err);
        alert(`Failed to upload to cloud: ${err.message || err}. Make sure you created a public bucket named 'polaroids' and added policies!`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // LocalStorage fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImages((prev) => ({ ...prev, [id]: base64String }));
        localStorage.setItem(`mika_polaroid_${id}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = async (e, id) => {
    e.stopPropagation(); // Avoid triggering file selection
    if (isLoading) return;
    
    if (isCloudConnected && supabase) {
      setIsLoading(true);
      try {
        const { error } = await supabase.storage
          .from('polaroids')
          .remove([`polaroid_${id}`]);
        
        if (error) throw error;
        setImages((prev) => ({ ...prev, [id]: null }));
      } catch (err) {
        console.error('Supabase delete error:', err);
        alert(`Failed to delete from cloud: ${err.message || err}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setImages((prev) => ({ ...prev, [id]: null }));
      localStorage.removeItem(`mika_polaroid_${id}`);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (inputUrl.trim() && inputKey.trim()) {
      localStorage.setItem('mika_supabase_url', inputUrl.trim());
      localStorage.setItem('mika_supabase_anon_key', inputKey.trim());
    } else {
      localStorage.removeItem('mika_supabase_url');
      localStorage.removeItem('mika_supabase_anon_key');
    }

    // Reload client
    const newClient = reloadSupabaseClient();
    const newConfig = getSupabaseConfig();
    
    setConfig(newConfig);
    setInputUrl(newConfig.url);
    setInputKey(newConfig.key);

    if (newClient && newConfig.url && newConfig.key) {
      await loadCloudPhotos(newClient);
    } else {
      setIsCloudConnected(false);
      loadLocalPhotos();
    }
    
    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleClearConfig = () => {
    localStorage.removeItem('mika_supabase_url');
    localStorage.removeItem('mika_supabase_anon_key');
    setInputUrl('');
    setInputKey('');
    
    reloadSupabaseClient();
    const newConfig = getSupabaseConfig();
    setConfig(newConfig);
    setIsCloudConnected(false);
    loadLocalPhotos();
    setIsModalOpen(false);
  };

  return (
    <section id="our-little-space" className="relative py-16 md:py-28 px-4 max-w-6xl mx-auto z-10 select-none">
      {/* Background ambient radial glowing spots */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-glow/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-blue-900/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-20 flex flex-col items-center">
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
          className="h-[1px] bg-cyan-glow/40 mx-auto mb-4"
        />

        {/* Cloud Sync Status Indicator */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase border transition-all duration-300 backdrop-blur-sm cursor-pointer select-none ${
            isCloudConnected 
              ? 'text-cyan-soft border-cyan-soft/30 hover:border-cyan-soft/60 bg-cyan-glow/5 hover:bg-cyan-glow/10 shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
              : 'text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200 bg-slate-950/40'
          }`}
        >
          {isCloudConnected ? (
            <>
              <Cloud size={12} className="text-cyan-soft animate-pulse" />
              <span>Cloud Connected</span>
            </>
          ) : (
            <>
              <CloudOff size={12} className="text-slate-500" />
              <span>Local Storage (Offline)</span>
            </>
          )}
        </motion.button>
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
                  disabled={isLoading}
                />

                {/* Polaroid Frame Container */}
                <div 
                  onClick={() => handleCardClick(p.id)}
                  className={`w-full p-4 pb-6 rounded-lg glass border border-slate-700/30 shadow-2xl relative transition-all duration-500 ${p.tilt} group overflow-hidden ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
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
                            disabled={isLoading}
                            className="p-2 rounded-full bg-slate-900/90 text-rose-400 border border-slate-800 hover:scale-110 transition-transform shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Cloud loading indicator overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-30">
                        <div className="w-5 h-5 rounded-full border-2 border-cyan-glow/20 border-t-cyan-glow animate-spin" />
                      </div>
                    )}
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

      {/* Cloud Connection Configuration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-xl border border-slate-800/80 glass glass-glow p-6 text-slate-100 flex flex-col gap-5 overflow-y-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Cloud className="text-cyan-glow animate-pulse" size={20} />
                  <h3 className="font-serif text-lg font-light tracking-wide text-slate-200">
                    Sync to Cloud Space
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-lg border text-xs leading-relaxed ${
                isCloudConnected
                  ? 'bg-cyan-950/10 border-cyan-500/20 text-cyan-200/90'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400'
              }`}>
                {isCloudConnected ? (
                  <p>
                    ✨ <strong>Connected!</strong> Your pictures are stored in the cloud. Changes made here will instantly sync and display when you or Mika open the site on any phone, tablet, or laptop.
                  </p>
                ) : (
                  <p>
                    🔒 <strong>Currently Offline (Local Mode).</strong> Photos are saved only on this browser/device. To sync them across all devices, follow the guide below to set up a free Supabase server.
                  </p>
                )}
              </div>

              {/* Step-by-Step Guide */}
              <div className="text-xs text-slate-400 flex flex-col gap-3">
                <span className="font-semibold uppercase tracking-wider text-slate-300 font-sans text-[10px]">
                  Setup Guide (Takes 3 mins)
                </span>
                <ol className="list-decimal list-inside flex flex-col gap-2 leading-relaxed">
                  <li>
                    Create a free account at{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-soft hover:underline inline-flex items-center gap-0.5"
                    >
                      supabase.com <ExternalLink size={10} />
                    </a>{' '}
                    and spin up a new project.
                  </li>
                  <li>
                    Go to <strong>Storage</strong> in the left sidebar, click <strong>New Bucket</strong>, name it exactly <code className="text-cyan-glow px-1.5 py-0.5 rounded bg-slate-950/60 font-mono">polaroids</code>, and make it <strong>Public</strong>.
                  </li>
                  <li>
                    Click on your new bucket, go to <strong>Policies</strong>, click <strong>New Policy</strong>, and choose **Allow access to everyone** (Select, Insert, Update, Delete) to allow public access.
                  </li>
                  <li>
                    Copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong> from Project Settings → API, and enter them below:
                  </li>
                </ol>
              </div>

              {/* Configuration Form */}
              <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    required
                    disabled={config.isEnv}
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xxxxxx.supabase.co"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-800/80 bg-slate-950/60 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-glow/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                    Supabase Anon API Key
                  </label>
                  <input
                    type="text"
                    required
                    disabled={config.isEnv}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-800/80 bg-slate-950/60 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-glow/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                  />
                </div>

                {config.isEnv && (
                  <p className="text-[10px] text-cyan-soft/60 italic leading-snug">
                    ℹ️ Keys are locked because they are loaded from your system's .env file.
                  </p>
                )}

                {/* Form Buttons */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800/60 mt-2">
                  {!config.isEnv && (config.url || config.key) ? (
                    <button
                      type="button"
                      onClick={handleClearConfig}
                      className="px-3 py-2 rounded text-xs text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      Disconnect Cloud
                    </button>
                  ) : (
                    <div />
                  )}
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-2 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    {!config.isEnv && (
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 rounded text-xs font-medium text-slate-950 bg-cyan-soft hover:bg-cyan-glow transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(100,255,218,0.25)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Connecting...' : 'Save & Connect'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
