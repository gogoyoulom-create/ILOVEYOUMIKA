import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX, CloudRain } from 'lucide-react';
import { useState } from 'react';

export default function MusicPlayer({
  isPlaying,
  currentTrackIndex,
  tracks,
  volume,
  currentTime,
  duration,
  onPlayPause,
  onPrev,
  onNext,
  onVolumeChange,
  onSeek,
  isRainPlaying,
  onToggleRain
}) {
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isIOS] = useState(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    return false;
  });

  const currentTrack = tracks[currentTrackIndex];

  // Helper to format time
  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    onSeek(percentage * duration);
  };

  return (
    <section id="music-section" className="relative py-16 md:py-24 px-4 max-w-4xl mx-auto z-10 select-none">
      {/* Background ambient radial glowing spots */}
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-glow/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.3em] uppercase text-cyan-soft mb-3"
        >
          Cozy Soundscapes
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-light font-serif text-slate-100 mb-4"
        >
          Our Late Night Playlist
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "40px" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[1px] bg-cyan-glow/40 mx-auto"
        />
      </div>

      {/* Spotify Inspired Player Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl mx-auto glass glass-glow border border-slate-800/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient neon side highlight */}
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-glow/20 to-transparent pointer-events-none" />

        {/* Left Side: Artwork & Visualizer */}
        <div className="relative w-44 h-44 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex-shrink-0 group">
          {/* Animated vinyl or color gradient rotating disk */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-navy-light via-slate-900 to-cyan-glow/15 flex items-center justify-center`}>
            {/* Spinning disc texture */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 12, ease: "linear", repeat: Infinity }}
              className="w-36 h-36 rounded-full border border-slate-800/40 flex items-center justify-center bg-[radial-gradient(#050b14_2px,transparent_2px)] relative shadow-inner"
              style={{ backgroundSize: '10px 10px' }}
            >
              {/* Disc Center */}
              <div className="w-10 h-10 rounded-full bg-slate-950 border border-cyan-glow/30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-glow" />
              </div>
            </motion.div>
          </div>

          {/* Album artwork cover (Optional fallback text style) */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent text-left pointer-events-none select-none">
            <span className="text-[10px] tracking-[0.2em] font-sans text-cyan-soft font-medium uppercase mb-0.5">
              Playing Now
            </span>
            <h4 className="text-xs font-light text-slate-200 tracking-wide truncate">
              {currentTrack.title}
            </h4>
          </div>

          {/* Floating animated visualizer bar system overlay */}
          {isPlaying && (
            <div className="absolute top-3 right-3 flex items-end gap-[3px] h-5 px-2 py-1 rounded bg-slate-950/70 border border-slate-900/60">
              <span className="w-[2px] bg-cyan-glow rounded-full animate-[float_1.2s_infinite_alternate]" style={{ height: '60%' }} />
              <span className="w-[2px] bg-cyan-glow rounded-full animate-[float_0.8s_infinite_alternate_0.2s]" style={{ height: '90%' }} />
              <span className="w-[2px] bg-cyan-glow rounded-full animate-[float_1.5s_infinite_alternate_0.1s]" style={{ height: '40%' }} />
              <span className="w-[2px] bg-cyan-glow rounded-full animate-[float_1s_infinite_alternate_0.3s]" style={{ height: '70%' }} />
            </div>
          )}
        </div>

        {/* Right Side: Details & Controls */}
        <div className="flex-1 w-full flex flex-col justify-between h-full">
          {/* Metadata */}
          <div className="text-center md:text-left mb-6">
            <h3 className="text-xl md:text-2xl font-light text-slate-100 tracking-wide mb-1">
              {currentTrack.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 font-light tracking-wider">
              {currentTrack.artist}
            </p>
          </div>

          {/* Sound wave details (Progress slider) */}
          <div className="w-full mb-4">
            <div 
              onClick={handleProgressBarClick}
              className="py-3 cursor-pointer group"
            >
              <div className="h-1 w-full bg-slate-800 rounded-full relative transition-all duration-300 group-hover:h-1.5">
                {/* Completed Bar */}
                <div 
                  className="h-full bg-gradient-to-r from-cyan-soft to-cyan-glow rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Thumb pointer */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                </div>
              </div>
            </div>
            
            {/* Time labels */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans tracking-wide mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-4">
              {/* Shuffle button */}
              <button 
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition-colors p-3 cursor-pointer -m-2 ${isShuffle ? 'text-cyan-glow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Shuffle size={14} />
              </button>

              {/* Prev button */}
              <button 
                onClick={onPrev}
                className="text-slate-300 hover:text-white transition-colors p-3 cursor-pointer -m-2"
              >
                <SkipBack size={18} strokeWidth={2} />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={onPlayPause}
                className="w-12 h-12 rounded-full bg-white text-navy flex items-center justify-center hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer"
              >
                {isPlaying ? (
                  <Pause size={20} strokeWidth={2.5} fill="#050b14" className="text-slate-950 translate-x-[0px]" />
                ) : (
                  <Play size={20} strokeWidth={2.5} fill="#050b14" className="text-slate-950 translate-x-[1px]" />
                )}
              </button>

              {/* Next button */}
              <button 
                onClick={onNext}
                className="text-slate-300 hover:text-white transition-colors p-3 cursor-pointer -m-2"
              >
                <SkipForward size={18} strokeWidth={2} />
              </button>

              {/* Repeat button */}
              <button 
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition-colors p-3 cursor-pointer -m-2 ${isRepeat ? 'text-cyan-glow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Repeat size={14} />
              </button>
            </div>

            {/* Bottom Accessories: Volume & Rain Overlay */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900/60 pt-5">
              {/* Volume sliders */}
              {!isIOS ? (
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-3 cursor-pointer -m-2"
                  >
                    {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-glow h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 tracking-wide font-sans py-2 text-center sm:text-left">
                  Use device volume buttons to adjust sound
                </div>
              )}

              {/* Cozy Rain Ambient Sound Switch */}
              <button
                onClick={onToggleRain}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] tracking-[0.15em] uppercase transition-all duration-500 cursor-pointer ${
                  isRainPlaying
                    ? 'border-cyan-glow/60 bg-cyan-glow/10 text-cyan-glow hover:bg-cyan-glow/20'
                    : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`}
                style={{
                  boxShadow: isRainPlaying ? '0 0 10px rgba(0, 240, 255, 0.05)' : 'none'
                }}
              >
                <CloudRain size={12} className={isRainPlaying ? 'animate-bounce' : ''} />
                <span>{isRainPlaying ? "Rain: Playing" : "Rain: Cozy Layer"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
