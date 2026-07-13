import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ambient Backgrounds
import StarryBackground from './components/StarryBackground';
import CursorGlow from './components/CursorGlow';
import LoadingScreen from './components/LoadingScreen';

// Sections
import Hero from './components/Hero';
import ThingsAboutYou from './components/ThingsAboutYou';
import AcrossDistance from './components/AcrossDistance';
import OurLittleSpace from './components/OurLittleSpace';
import LateNightThoughts from './components/LateNightThoughts';
import HiddenFeature from './components/HiddenFeature';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';

// Soothing Spotify playlists tracks
const TRACKS = [
  {
    title: "Talking (Miss Westie)",
    artist: "North West",
    url: "/talking.m4a"
  },
  {
    title: "Goggles",
    artist: "North West",
    url: "/goggles.m4a"
  },
  {
    title: "Matthew",
    artist: "North West",
    url: "/matthew.m4a"
  }
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [entered, setEntered] = useState(false);

  // --- Music Playlist State Management ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // --- Web Audio API Rain Synthesizer State ---
  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const rainAudioContextRef = useRef(null);
  const rainSourceNodeRef = useRef(null);

  // Initialize and manage persistent background music audio element
  useEffect(() => {
    const audio = new Audio(TRACKS[currentTrackIndex].url);
    audio.volume = volume;
    audio.loop = false; // Auto-advance to next song
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleNextTrack();

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  // Sync volume adjustments
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser:", err));
    }
  };

  const handlePrevTrack = () => {
    if (!audioRef.current) return;
    const isPlayingBefore = isPlaying;
    audioRef.current.pause();
    
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setCurrentTime(0);

    setTimeout(() => {
      if (isPlayingBefore && audioRef.current) {
        audioRef.current.play().catch(err => console.log(err));
      }
    }, 150);
  };

  const handleNextTrack = () => {
    if (!audioRef.current) return;
    const isPlayingBefore = isPlaying;
    audioRef.current.pause();
    
    setCurrentTrackIndex((prev) => (prev === TRACKS.length - 1 ? 0 : prev + 1));
    setCurrentTime(0);

    setTimeout(() => {
      if (isPlayingBefore && audioRef.current) {
        audioRef.current.play().catch(err => console.log(err));
      }
    }, 150);
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // --- Rain sound synthesis via Web Audio API ---
  const toggleRainSound = () => {
    if (isRainPlaying) {
      // Stop the rain loop
      if (rainSourceNodeRef.current) {
        try {
          rainSourceNodeRef.current.stop();
        } catch (e) {
          // already stopped
        }
        rainSourceNodeRef.current = null;
      }
      if (rainAudioContextRef.current) {
        rainAudioContextRef.current.close();
        rainAudioContextRef.current = null;
      }
      setIsRainPlaying(false);
    } else {
      // Start/Synthesize rain loop
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        rainAudioContextRef.current = ctx;

        // Generate 2 seconds of stereo white noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
          const nowBuffering = noiseBuffer.getChannelData(channel);
          for (let i = 0; i < bufferSize; i++) {
            nowBuffering[i] = Math.random() * 2 - 1;
          }
        }

        // Noise source
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        // Low-pass Biquad Filter to mimic deep soothing rain rumble
        const lowpassFilter = ctx.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(450, ctx.currentTime);

        // Volume Gain Node for comfort levels
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime); // keep it soft and subtle

        // Connect nodes: source -> filter -> volume -> speaker
        noiseSource.connect(lowpassFilter);
        lowpassFilter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Start the synthesizer node
        noiseSource.start(0);
        rainSourceNodeRef.current = noiseSource;
        setIsRainPlaying(true);
      } catch (err) {
        console.error("Failed to initialize Web Audio rain synthesizer:", err);
      }
    }
  };

  // Lock scrolling before entering
  useEffect(() => {
    if (!entered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [entered]);

  // When Enter clicked
  const handleEnter = () => {
    setEntered(true);
    
    // 1. Play background lo-fi music automatically (safely triggered by active click)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Play blocked:", e));
      }
    }, 300);

    // 2. Smoothly scroll down from the full screen landing page
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }, 500);
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] text-slate-100 bg-transparent font-sans selection:bg-cyan-glow/20 selection:text-cyan-glow">
      {/* 1. Cinematic Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* 2. Drifting Twinlkling Stars Canvas Backdrop */}
      <StarryBackground />

      {/* 3. Ambient Cursor Spotlight flashlight effect */}
      <CursorGlow />

      {!isLoading && (
        <div className="relative w-full flex flex-col items-center">
          
          {/* Landing page Hero: occupies full viewport height initially */}
          <Hero onEnter={handleEnter} />

          {/* Sub-sections unlocked and displayed beautifully */}
          <AnimatePresence>
            {entered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full relative z-10 flex flex-col items-center"
              >
                {/* Visual Section dividing overlay gradients */}
                <div className="w-full h-24 bg-gradient-to-b from-[#030712] to-transparent pointer-events-none" />

                {/* 1. Things About You Cards */}
                <ThingsAboutYou />

                {/* 2. Across The Distance LDR Connection Chart */}
                <AcrossDistance />

                {/* 3. Our Little Space Polaroid Scrapbook */}
                <OurLittleSpace />

                {/* 4. Late Night Thoughts Cinematic Message Box */}
                <LateNightThoughts />

                {/* 5. Playful Hidden Feature Warning Button */}
                <HiddenFeature />

                {/* 6. Spotify Inspired Music Controller */}
                <MusicPlayer
                  isPlaying={isPlaying}
                  currentTrackIndex={currentTrackIndex}
                  tracks={TRACKS}
                  volume={volume}
                  currentTime={currentTime}
                  duration={duration}
                  onPlayPause={handlePlayPause}
                  onPrev={handlePrevTrack}
                  onNext={handleNextTrack}
                  onVolumeChange={setVolume}
                  onSeek={handleSeek}
                  isRainPlaying={isRainPlaying}
                  onToggleRain={toggleRainSound}
                />

                {/* 7. Minimal Ending Scene Footer */}
                <Footer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
