// Main Game Loop, Scene Controller, Particles & Audio Synthesizer

// List of memory photos from provided directory
const PIC_PATHS = [
  "pics/IMG_20260309_203950_667.jpg",
  "pics/IMG_20260418_173942_201.jpg",
  "pics/IMG_20260418_173943_824.jpg",
  "pics/Screenshot_20260324_001242_Instagram.jpg",
  "pics/Screenshot_20260325_202637_Instagram.jpg",
  "pics/Screenshot_20260409_214648_Instagram.jpg",
  "pics/Screenshot_20260418_235232_Instagram.jpg"
];

// Lyrics Database
const LYRICS = {
  smiths: `[Verse 1]
Take me out tonight
Where there's music and there's people
And they're young and alive

[Chorus]
And if a double-decker bus
Crashes into us
To die by your side
Is such a heavenly way to die

And if a ten-ton truck
Kills the both of us
To die by your side
Well, the pleasure, the privilege is mine

[Outro]
There is a light that never goes out
There is a light that never goes out`,
  cure: `[Verse 2]
Whenever I'm alone with you
You make me feel like I am young again
Whenever I'm alone with you
You make me feel like I am fun again

[Chorus]
However far away
I will always love you
However long I stay
I will always love you
Whatever words I say
I will always love you
I will always love you`
};

// Song Data Queue
const SONGS_QUEUE = [
  {
    id: 'smiths',
    title: 'There Is a Light That Never Goes Out',
    artist: 'The Smiths',
    lyrics: LYRICS.smiths,
    duration: 242,
    src: 'smiths.mp3',
    cinematicStartOffset: 64 // Start time (in seconds) for the animation segment
  },
  {
    id: 'cure',
    title: 'Lovesong',
    artist: 'The Cure',
    lyrics: LYRICS.cure,
    duration: 210,
    src: 'cure.mp3',
    cinematicStartOffset: 78 // Start time (in seconds) for the animation segment
  }
];

// Game State Enum
const STATE = {
  INTRO: 0,
  CAULDRON: 1,
  GIRL_APPEARS: 2,
  BOY_ARRIVES: 3,
  SINGING_SMITHS: 4,
  BUS_CRASH: 5,
  SINGING_CURE: 6,
  BLACK_OUT: 7
};

// Global App State
const APP = {
  state: STATE.INTRO,
  canvas: null,
  ctx: null,
  images: [],
  loadedImagesCount: 0,
  time: 0,
  camera: { x: 0, y: 0, shakeTime: 0, shakeIntensity: 0 },
  stars: [],
  particles: [],
  sceneTimer: 0,
  
  // Audio state
  audioMode: 'synth',
  audioCtx: null,
  synthInterval: null,
  synthSequenceIndex: 0,
  currentSongIndex: 0,
  isMuted: false,
  volume: 0.8,
  
  // Player state
  isPlaying: false,
  timelineProgress: 0,
  timelineTimer: null,
  audioElement: null,
  audioSource: null,
  analyser: null,
  frequencyData: null,
  endingFadeAlpha: 0, // Opacity of ending black overlay
  
  // Characters and props coordinates/states
  girl: { x: 256, y: 210, breathing: true, blinking: false, surprised: false, blush: false, blinkTimer: 120 },
  boy: { x: -30, y: 210, breathing: true, singing: false, walking: false, holdingMic: false, flip: false },
  cauldron: { x: 240, y: 210, glowColor: 'rgba(0, 240, 255, 0.4)', glowIntensity: 0.2 },
  bus: { x: 600, y: 214, active: false, speed: 0, wheelsFrame: 0 },
  
  // Scene 1: Floating Photos variables
  fallingPhotos: [],
  nextPhotoIndex: 0,
  photoSpawnTimer: 0,
  cauldronErupted: false,
  eruptionProgress: 0
};

// Pre-define note sheet frequencies in Am for the chiptunes
const CHIPTUNE_THEMES = {
  smiths: {
    tempo: 140,
    chords: [
      ['F3', 'A3', 'C4'], // F maj
      ['G3', 'B3', 'D4'], // G maj
      ['A3', 'C4', 'E4'], // A min
      ['C3', 'E3', 'G3']  // C maj
    ],
    melody: [
      'C4', 'B3', 'A3', 'B3', 'C4', 'D4', 'C4', 'B3', 'A3', 'B3', 'C4', 'B3', 'A3', 'B3', 'E4', 'E4',
      'C4', 'B3', 'A3', 'B3', 'C4', 'D4', 'C4', 'B3', 'A3', 'B3', 'C4', 'B3', 'A3', 'G3', 'A3', 'A3'
    ]
  },
  cure: {
    tempo: 110,
    chords: [
      ['A3', 'C4', 'E4'], // Am
      ['G3', 'B3', 'D4'], // G
      ['F3', 'A3', 'C4'], // F
      ['E3', 'G3', 'B3']  // Em
    ],
    melody: [
      'A4', 'B4', 'C5', 'B4', 'A4', 'E4', 'E4', 'E4',
      'A4', 'B4', 'C5', 'B4', 'A4', 'G4', 'G4', 'G4',
      'F4', 'G4', 'A4', 'G4', 'F4', 'C4', 'C4', 'C4',
      'E4', 'F4', 'G4', 'F4', 'E4', 'D4', 'E4', 'E4'
    ]
  }
};

const NOTE_FREQS = {
  'C3': 130.81, 'E3': 164.81, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00,
  'A4': 440.00, 'B4': 493.88, 'C5': 523.25
};

// INITIALIZATION
window.addEventListener('DOMContentLoaded', async () => {
  setupUI();
  initStars();
  preloadImages();
  await checkAudioAvailability();
});

// Setup DOM elements and event listeners
function setupUI() {
  APP.canvas = document.getElementById('game-canvas');
  APP.ctx = APP.canvas.getContext('2d');

  const btnStart = document.getElementById('btn-start-game');

  // Start button triggers experience
  btnStart.addEventListener('click', () => {
    startExperience();
  });
}

// Preloads all picture assets
function preloadImages() {
  let loaded = 0;
  PIC_PATHS.forEach((path, i) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      APP.images[i] = img;
      loaded++;
      if (loaded === PIC_PATHS.length) {
        console.log("All memory images preloaded successfully.");
      }
    };
    img.onerror = () => {
      console.warn(`Could not load image: ${path}. Creating dynamic fallback placeholder.`);
      // Dynamic fallback canvas (colored pixel block)
      const placeholder = document.createElement('canvas');
      placeholder.width = 32; placeholder.height = 32;
      const pctx = placeholder.getContext('2d');
      // Create interesting retro abstract block
      pctx.fillStyle = `hsl(${i * 50}, 80%, 60%)`;
      pctx.fillRect(0, 0, 32, 32);
      pctx.fillStyle = '#fff';
      pctx.fillRect(8, 8, 16, 16);
      pctx.fillStyle = '#222';
      pctx.fillRect(12, 12, 8, 8);
      
      APP.images[i] = placeholder;
      loaded++;
      if (loaded === PIC_PATHS.length) {
        console.log("All memory images preloaded (with placeholders).");
      }
    };
  });
}

// Initializes starry sky coordinates
function initStars() {
  APP.stars = [];
  for (let i = 0; i < 45; i++) {
    APP.stars.push({
      x: Math.random() * 480,
      y: Math.random() * 85,
      size: Math.random() > 0.85 ? 2 : 1,
      phase: Math.random() * Math.PI * 2
    });
  }
}

// Triggers the transition to start the animation loop and play audio
function startExperience() {
  // Initialize Web Audio context
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  APP.audioCtx = new AudioContextClass();

  // Hide Intro landing screen
  document.getElementById('landing-screen').classList.add('hidden');

  // Set initial state
  APP.state = STATE.CAULDRON;
  APP.sceneTimer = 0;
  APP.isPlaying = true;

  // Run the core loops
  requestAnimationFrame(loop);
}

// ----------------------------------------------------
// AUDIO ENGINE (Retro synth & MP3 processing)
// ----------------------------------------------------

function startSynthPlayback() {
  if (APP.synthInterval) clearInterval(APP.synthInterval);
  APP.synthSequenceIndex = 0;

  const currentTheme = CHIPTUNE_THEMES[SONGS_QUEUE[APP.currentSongIndex].id];
  const tempo = currentTheme.tempo;
  const beatTimeMs = (60 / tempo) * 1000 * 0.5; // Eighth note tempo ticks

  // Set timeline tracking
  APP.timelineProgress = 0;
  
  APP.synthInterval = setInterval(() => {
    if (!APP.isPlaying || APP.isMuted) return;

    // Play next note step in the theme
    const melodyNote = currentTheme.melody[APP.synthSequenceIndex % currentTheme.melody.length];
    const chords = currentTheme.chords[Math.floor(APP.synthSequenceIndex / 8) % currentTheme.chords.length];

    playSynthTone(melodyNote, chords);
    APP.synthSequenceIndex++;
  }, beatTimeMs);
}

function playSynthTone(melodyNote, chordNotes) {
  if (!APP.audioCtx || APP.audioCtx.state === 'suspended') {
    APP.audioCtx.resume();
  }

  const now = APP.audioCtx.currentTime;

  // 1. Play Lead Melody (Square Wave - retro chiptune lead)
  if (melodyNote && NOTE_FREQS[melodyNote]) {
    const osc = APP.audioCtx.createOscillator();
    const gain = APP.audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(NOTE_FREQS[melodyNote], now);
    
    // Envelope
    gain.gain.setValueAtTime(0.08 * APP.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(APP.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    // Trigger visual music note particles during singing scenes
    if (APP.boy.singing && Math.random() > 0.4) {
      spawnMusicNoteParticle(APP.boy.x - 8, APP.boy.y - 42);
    }
  }

  // 2. Play Background Chords (Triangle Wave - warm retro base)
  chordNotes.forEach(note => {
    if (NOTE_FREQS[note]) {
      const osc = APP.audioCtx.createOscillator();
      const gain = APP.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(NOTE_FREQS[note], now);

      gain.gain.setValueAtTime(0.06 * APP.volume, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(APP.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    }
  });
}

async function checkFileExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function checkAudioAvailability() {
  const smithsOk = await checkFileExists(SONGS_QUEUE[0].src);
  const cureOk = await checkFileExists(SONGS_QUEUE[1].src);
  if (smithsOk && cureOk) {
    APP.audioMode = 'real';
    console.log("Real audio tracks found! Setting mode to Real MP3.");
  } else {
    APP.audioMode = 'synth';
    console.warn("Could not find 'smiths.mp3' or 'cure.mp3' in root folder. Falling back to cozy chiptunes.");
  }
}

function playRealAudio(src, startOffset = 0) {
  if (!APP.audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    APP.audioCtx = new AudioContextClass();
  }
  if (APP.audioCtx.state === 'suspended') {
    APP.audioCtx.resume();
  }
  
  if (!APP.audioElement) {
    APP.audioElement = new Audio();
    APP.audioElement.loop = false;
    APP.audioSource = APP.audioCtx.createMediaElementSource(APP.audioElement);
    APP.analyser = APP.audioCtx.createAnalyser();
    APP.analyser.fftSize = 64;
    APP.audioSource.connect(APP.analyser);
    APP.analyser.connect(APP.audioCtx.destination);
    APP.frequencyData = new Uint8Array(APP.analyser.frequencyBinCount);

    APP.audioElement.ontimeupdate = () => {
      if (APP.audioMode === 'real' && APP.audioElement.duration) {
        APP.timelineProgress = (APP.audioElement.currentTime / APP.audioElement.duration) * 100;
      }
    };

    APP.audioElement.onended = () => {
      // No-op since player is removed
    };
  }

  APP.audioElement.src = src;
  APP.audioElement.volume = APP.volume;
  APP.audioElement.muted = APP.isMuted;
  
  const playPromise = APP.audioElement.play();

  // Apply seek offset once metadata is loaded
  if (startOffset > 0) {
    if (APP.audioElement.readyState >= 1) {
      APP.audioElement.currentTime = startOffset;
    } else {
      APP.audioElement.addEventListener('loadedmetadata', () => {
        APP.audioElement.currentTime = startOffset;
      }, { once: true });
    }
  }

  playPromise.catch(e => console.log("Audio play request failed/deferred: ", e));
}

// ----------------------------------------------------
// CORE LOOP & SCENE MACHINE
// ----------------------------------------------------

function loop() {
  APP.time++;
  APP.sceneTimer++;

  // Update logic and graphics
  updateStateMachines();
  updateParticles();
  cameraUpdate();

  // Render scenes to Canvas
  renderCanvas();

  // Keep looping
  if (APP.state !== STATE.INTRO) {
    requestAnimationFrame(loop);
  }
}

// State changes and scene progression logic
function updateStateMachines() {
  switch (APP.state) {
    
    // Scene 1: Memories fall into Cauldron
    case STATE.CAULDRON:
      APP.photoSpawnTimer++;
      
      // Spawn photo every 120 frames (~2 seconds) until all 7 photos are spawned
      if (APP.photoSpawnTimer > 110 && APP.nextPhotoIndex < APP.images.length) {
        spawnFallingPhoto(APP.nextPhotoIndex);
        APP.nextPhotoIndex++;
        APP.photoSpawnTimer = 0;
      }

      // Check if all photos have dissolved and liquid is boiling
      if (APP.nextPhotoIndex >= APP.images.length && APP.fallingPhotos.length === 0 && !APP.cauldronErupted) {
        APP.cauldronErupted = true;
        APP.sceneTimer = 0;
      }

      // Cauldron erupts, then transition
      if (APP.cauldronErupted) {
        APP.cauldron.glowIntensity = Math.min(1.0, APP.sceneTimer / 100);
        APP.cauldron.glowColor = `rgba(0, ${Math.floor(180 + Math.sin(APP.time*0.1)*70)}, 255, ${0.4 + Math.sin(APP.time*0.08)*0.3})`;
        
        if (APP.sceneTimer > 120) {
          // Trigger eruption particles
          triggerMagicalEruption();
          APP.state = STATE.GIRL_APPEARS;
          APP.sceneTimer = 0;
        }
      }
      break;

    // Scene 2: Girl Appears out of column of light
    case STATE.GIRL_APPEARS:
      if (APP.sceneTimer === 1) {
        APP.girl.surprised = true;
        // Float girl slightly down as if arriving from light beam
        APP.girl.y = 150;
      }
      
      // Animate girl sliding down onto street lamp center
      if (APP.girl.y < 210) {
        APP.girl.y += 1.5;
      } else {
        APP.girl.y = 210;
      }

      // Blinking animation trigger
      updateBlinking(APP.girl);

      if (APP.sceneTimer > 180) { // ~3 seconds surprise
        APP.girl.surprised = false;
        APP.state = STATE.BOY_ARRIVES;
        APP.sceneTimer = 0;
      }
      break;

    // Scene 3: Boy Arrives from left
    case STATE.BOY_ARRIVES:
      updateBlinking(APP.girl);
      
      if (APP.sceneTimer === 1) {
        APP.boy.x = -30;
        APP.boy.walking = true;
        APP.boy.flip = false; // facing right
      }

      // Move boy right until he reaches x=190
      if (APP.boy.x < 190) {
        APP.boy.x += 1.6;
      } else {
        APP.boy.walking = false;
        APP.boy.holdingMic = true;
        
        // Face each other
        APP.boy.flip = false; 
        
        if (APP.sceneTimer > 240) { // 4 seconds total
          // Girl notices boy, blushes!
          APP.girl.blush = true;
          showSubtitle("The girl notices him... a warm blush colors her cheeks.", 3000);
          APP.state = STATE.SINGING_SMITHS;
          APP.sceneTimer = 0;
        }
      }
      break;

    // Scene 4: Boy sings Smiths
    case STATE.SINGING_SMITHS:
      updateBlinking(APP.girl);
      APP.boy.singing = true;

      if (APP.sceneTimer === 1) {
        if (APP.audioMode === 'real') {
          playRealAudio(SONGS_QUEUE[0].src, SONGS_QUEUE[0].cinematicStartOffset || 0);
        } else if (APP.audioMode === 'synth') {
          startSynthPlayback();
        }
        showSubtitle("♫ Take me out tonight / Where there's music and there's people...", 8000, "The Smiths");
      }
      if (APP.sceneTimer === 480) { // 8 seconds
        showSubtitle("♫ And if a double-decker bus crashes into us...", 8000, "The Smiths");
      }
      if (APP.sceneTimer === 960) { // 16 seconds
        showSubtitle("♫ To die by your side is such a heavenly way to die.", 8000, "The Smiths");
      }
      if (APP.sceneTimer === 1440) { // 24 seconds
        showSubtitle("♫ There is a light that never goes out...", 6000, "The Smiths");
      }

      // Make street lamp pulse to beat/frequency
      syncLightingEffect();

      // Go to bus scene
      if (APP.sceneTimer > 1800) { // 30 seconds
        APP.boy.singing = false;
        APP.state = STATE.BUS_CRASH;
        APP.sceneTimer = 0;
      }
      break;

    // Scene 5: Bus Crash!
    case STATE.BUS_CRASH:
      updateBlinking(APP.girl);
      
      if (APP.sceneTimer === 1) {
        // Cut off music on impact / start of bus zoom
        if (APP.audioMode === 'real' && APP.audioElement) {
          APP.audioElement.pause();
        } else if (APP.synthInterval) {
          clearInterval(APP.synthInterval);
        }

        APP.bus.active = true;
        APP.bus.x = 600;
        APP.bus.speed = -12; // zooms left
        APP.boy.singing = false;
        APP.boy.holdingMic = false;
        showSubtitle("WATCH OUT!!", 1500);
      }

      // Bus zooms in
      APP.bus.x += APP.bus.speed;
      APP.bus.wheelsFrame++;

      // When bus is very close, boy shields girl
      if (APP.bus.x < 310 && APP.bus.x > 180) {
        // Boy shields girl
        APP.boy.x = APP.girl.x - 8;
        APP.boy.flip = true; // face left shield stance
      }

      // Impact! (x=240 approx)
      if (APP.bus.x <= 245 && APP.bus.x >= 230) {
        triggerImpactSmoke();
        APP.camera.shakeTime = 45;
        APP.camera.shakeIntensity = 6;
      }

      // After bus rolls away, clear screen
      if (APP.bus.x < -160 && APP.bus.active) {
        APP.bus.active = false;
        APP.sceneTimer = 300; // Skip timer ahead to resolve
      }

      if (APP.sceneTimer > 360) {
        showSubtitle("The dust clears... He protected her with his body.", 4000);
        APP.girl.surprised = false;
        APP.state = STATE.SINGING_CURE;
        APP.sceneTimer = 0;
        
        // Update song index to Cure
        APP.currentSongIndex = 1;
      }
      break;

    // Scene 6: Singing Lovesong (The Cure)
    case STATE.SINGING_CURE:
      updateBlinking(APP.girl);
      APP.boy.singing = true;
      APP.boy.holdingMic = true;
      APP.boy.flip = false; // look back at her
      APP.boy.x = 190;
      APP.girl.blush = true;

      // Spawn warm fireflies & hearts
      if (APP.time % 20 === 0) {
        spawnFireflyParticle();
      }
      if (APP.time % 45 === 0) {
        spawnHeartParticle(240 + (Math.random() * 40 - 20), 200);
      }

      if (APP.sceneTimer === 1) {
        if (APP.audioMode === 'real') {
          playRealAudio(SONGS_QUEUE[1].src, SONGS_QUEUE[1].cinematicStartOffset || 0);
        } else if (APP.audioMode === 'synth') {
          startSynthPlayback();
        }
        showSubtitle("♫ Whenever I'm alone with you / You make me feel like I am young again...", 8000, "The Cure");
      }
      if (APP.sceneTimer === 480) { // 8 seconds
        showSubtitle("♫ Whenever I'm alone with you / You make me feel like I am fun again...", 8000, "The Cure");
      }
      if (APP.sceneTimer === 960) { // 16 seconds
        showSubtitle("♫ However far away / I will always love you...", 8000, "The Cure");
      }
      if (APP.sceneTimer === 1440) { // 24 seconds
        showSubtitle("♫ However long I stay / I will always love you...", 8000, "The Cure");
      }
      if (APP.sceneTimer === 1920) { // 32 seconds
        showSubtitle("♫ Whatever words I say / I will always love you...", 8000, "The Cure");
      }
      if (APP.sceneTimer === 2400) { // 40 seconds
        showSubtitle("♫ I will always love you...", 3000, "The Cure");
      }

      syncLightingEffect();

      // Final Transition to black screen
      if (APP.sceneTimer > 2580) { // 43 seconds (78s to 121s)
        fadeOutToBlack();
      }
      break;

    // Scene 7: Fade to Black ending
    case STATE.BLACK_OUT:
      APP.endingFadeAlpha += 0.015; // fade speed
      if (APP.endingFadeAlpha > 1.0) {
        APP.endingFadeAlpha = 1.0;
      }
      
      // Gradually fade out volume
      if (APP.audioMode === 'real' && APP.audioElement) {
        APP.audioElement.volume = APP.volume * (1.0 - APP.endingFadeAlpha);
        if (APP.endingFadeAlpha === 1.0) {
          APP.audioElement.pause();
          APP.isPlaying = false;
        }
      } else if (APP.audioMode === 'synth') {
        if (APP.endingFadeAlpha === 1.0) {
          if (APP.synthInterval) clearInterval(APP.synthInterval);
          APP.isPlaying = false;
        }
      }
      break;
  }
}

// Custom Blinking Timer loop helper
function updateBlinking(charObj) {
  charObj.blinkTimer--;
  if (charObj.blinkTimer <= 0) {
    charObj.blinking = !charObj.blinking;
    // Blinking lasts 12 frames, open eyes last random 100-240 frames
    charObj.blinkTimer = charObj.blinking ? 12 : (100 + Math.random() * 140);
  }
}

// Connect light cone brightness to audio frequencies or loop beats
function syncLightingEffect() {
  if (APP.audioMode === 'upload' && APP.analyser) {
    APP.analyser.getByteFrequencyData(APP.frequencyData);
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += APP.frequencyData[i]; // Bass frequencies
    const avg = sum / 8 / 255;
    APP.cauldron.glowIntensity = avg; // Pulse lamp light
  } else {
    // Synth pulsing beat
    APP.cauldron.glowIntensity = 0.5 + Math.sin(APP.time * 0.1) * 0.5;
  }
}

// ----------------------------------------------------
// PARTICLE SYSTEMS
// ----------------------------------------------------

function spawnFallingPhoto(index) {
  APP.fallingPhotos.push({
    img: APP.images[index],
    x: 100 + Math.random() * 280,
    y: -40,
    vy: 1.2 + Math.random() * 0.6,
    vx: Math.random() * 0.8 - 0.4,
    rotation: Math.random() * 0.4 - 0.2,
    rotSpeed: Math.random() * 0.02 - 0.01,
    scale: 0.8 + Math.random() * 0.4,
    alpha: 1.0,
    dissolving: false,
    dissolveFrame: 0
  });
}

function updateParticles() {
  // Update falling photos
  for (let i = APP.fallingPhotos.length - 1; i >= 0; i--) {
    const photo = APP.fallingPhotos[i];
    
    if (!photo.dissolving) {
      photo.y += photo.vy;
      photo.x += photo.vx;
      photo.rotation += photo.rotSpeed;

      // Float boundary swaying
      if (photo.x < 50 || photo.x > 430) photo.vx *= -1;

      // Collision with cauldron rim (y=190, cauldron center x=240)
      if (photo.y >= 185) {
        photo.dissolving = true;
        triggerSplashParticles(photo.x, 190);
        // Cauldron flashes bright Cyan/Magenta
        APP.cauldron.glowColor = 'rgba(255, 60, 180, 0.9)';
        APP.cauldron.glowIntensity = 1.0;
      }
    } else {
      // Dissolve photo
      photo.dissolveFrame++;
      photo.alpha = 1.0 - (photo.dissolveFrame / 40);
      photo.scale -= 0.02;
      
      // Spawn tiny liquid bubbles
      if (photo.dissolveFrame % 4 === 0) {
        spawnBubbleParticle(photo.x, 192);
      }

      if (photo.dissolveFrame >= 40) {
        APP.fallingPhotos.splice(i, 1);
      }
    }
  }

  // Update generic particles
  for (let i = APP.particles.length - 1; i >= 0; i--) {
    const p = APP.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    // Behavior specific details
    if (p.type === 'smoke') {
      p.size += 0.15;
      p.alpha = p.life / p.maxLife;
    } else if (p.type === 'firefly') {
      p.vx += Math.sin(APP.time * 0.05 + p.phase) * 0.1; // zigzag wave
      p.alpha = Math.max(0, Math.sin(p.life * 0.1)); // twinkling glow
    } else if (p.type === 'sparkle' || p.type === 'splash') {
      p.vy += 0.08; // gravity
      p.alpha = p.life / p.maxLife;
    } else if (p.type === 'heart') {
      p.y -= 0.5;
      p.vx = Math.sin(p.life * 0.03) * 0.3;
      p.alpha = p.life / p.maxLife;
    }

    if (p.life <= 0 || p.y < 0 || p.x < 0 || p.x > 480) {
      APP.particles.splice(i, 1);
    }
  }
}

function triggerSplashParticles(x, y) {
  for (let i = 0; i < 20; i++) {
    APP.particles.push({
      type: 'splash',
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: -1.5 - Math.random() * 2.5,
      size: 2 + Math.random() * 2,
      color: Math.random() > 0.5 ? '#00f6ff' : '#ff3cb4',
      life: 30 + Math.random() * 20,
      maxLife: 50,
      alpha: 1.0
    });
  }
}

function spawnBubbleParticle(x, y) {
  APP.particles.push({
    type: 'bubble',
    x: x + (Math.random() * 20 - 10),
    y: y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -0.4 - Math.random() * 0.6,
    size: 2 + Math.random() * 2,
    color: '#3cfcff',
    life: 25 + Math.random() * 20,
    maxLife: 45,
    alpha: 0.8
  });
}

function triggerMagicalEruption() {
  // Explode particles vertically
  for (let i = 0; i < 60; i++) {
    APP.particles.push({
      type: 'sparkle',
      x: 240 + (Math.random() * 12 - 6),
      y: 190,
      vx: (Math.random() - 0.5) * 5,
      vy: -3 - Math.random() * 5,
      size: 3 + Math.random() * 3,
      color: `hsl(${200 + Math.random() * 80}, 100%, 75%)`,
      life: 60 + Math.random() * 40,
      maxLife: 100,
      alpha: 1.0
    });
  }
  // Camera shake on eruption
  APP.camera.shakeTime = 30;
  APP.camera.shakeIntensity = 4;
}

function triggerImpactSmoke() {
  // Bus crash dust cloud
  for (let i = 0; i < 45; i++) {
    APP.particles.push({
      type: 'smoke',
      x: 240 + (Math.random() * 60 - 30),
      y: 200 + (Math.random() * 10 - 5),
      vx: (Math.random() - 0.5) * 6,
      vy: -0.5 - Math.random() * 2,
      size: 6 + Math.random() * 8,
      color: '#424558',
      life: 50 + Math.random() * 40,
      maxLife: 90,
      alpha: 0.8
    });
  }
}

function spawnFireflyParticle() {
  APP.particles.push({
    type: 'firefly',
    x: Math.random() * 480,
    y: 100 + Math.random() * 100,
    vx: Math.random() * 0.6 - 0.3,
    vy: -0.2 - Math.random() * 0.3,
    size: 2,
    color: '#bbfd30',
    phase: Math.random() * 100,
    life: 150 + Math.random() * 100,
    maxLife: 250,
    alpha: 0.1
  });
}

function spawnHeartParticle(x, y) {
  APP.particles.push({
    type: 'heart',
    x: x,
    y: y,
    vx: 0,
    vy: -0.4,
    size: 4,
    color: '#ff5e84',
    life: 90 + Math.random() * 40,
    maxLife: 130,
    alpha: 0.9
  });
}

function spawnMusicNoteParticle(x, y) {
  const colors = ['#1db954', '#5eff96', '#3cfcff', '#df6dff'];
  APP.particles.push({
    type: 'note',
    x: x,
    y: y,
    vx: Math.random() * 0.8 - 0.4,
    vy: -0.8 - Math.random() * 0.6,
    size: 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 80,
    maxLife: 80,
    alpha: 1.0
  });
}

// ----------------------------------------------------
// CAMERA & SHAKE CONTROLS
// ----------------------------------------------------

function cameraUpdate() {
  if (APP.camera.shakeTime > 0) {
    APP.camera.shakeTime--;
    const shake = APP.camera.shakeIntensity;
    APP.camera.x = (Math.random() - 0.5) * shake;
    APP.camera.y = (Math.random() - 0.5) * shake;
  } else {
    APP.camera.x = 0;
    APP.camera.y = 0;
  }
}

// ----------------------------------------------------
// CANVAS DRAW CYCLE
// ----------------------------------------------------

function renderCanvas() {
  const ctx = APP.ctx;
  const cw = APP.canvas.width;
  const ch = APP.canvas.height;

  ctx.clearRect(0, 0, cw, ch);

  ctx.save();
  // Translate camera shake coordinates
  ctx.translate(Math.floor(APP.camera.x), Math.floor(APP.camera.y));

  // 1. Draw Sky, Stars, Road, Brickwall background
  pixelRenderer.drawBackground(ctx, cw, ch, APP.time, APP.stars);

  // 2. Draw Cauldron (only in Scene 1 and Scene 2 transitions)
  if (APP.state === STATE.CAULDRON || (APP.state === STATE.GIRL_APPEARS && APP.sceneTimer < 60)) {
    pixelRenderer.drawCauldron(ctx, APP.cauldron.x, APP.cauldron.y, APP.time, APP.cauldron.glowIntensity, APP.cauldron.glowColor);
  }

  // 3. Draw memory photos falling in Scene 1
  APP.fallingPhotos.forEach(photo => {
    pixelRenderer.drawMemoryPhoto(ctx, photo.img, photo.x, photo.y, 48 * photo.scale, 48 * photo.scale, photo.rotation, photo.alpha);
  });

  // 4. Draw Characters (Under Street Lamp)
  if (APP.state >= STATE.GIRL_APPEARS) {
    pixelRenderer.drawGirl(ctx, APP.girl.x, APP.girl.y, APP.time, APP.girl);
  }
  if (APP.state >= STATE.BOY_ARRIVES) {
    pixelRenderer.drawBoy(ctx, APP.boy.x, APP.boy.y, APP.time, APP.boy);
  }

  // 5. Draw Double decker bus
  if (APP.bus.active) {
    pixelRenderer.drawBus(ctx, APP.bus.x, APP.bus.y, APP.bus.wheelsFrame);
  }

  // 6. Draw Street Lamp and cone lighting OVER everything (soft screen blend)
  // Pulse intensity based on audio frequencies or ambient
  const lampIntensity = (APP.state === STATE.SINGING_SMITHS || APP.state === STATE.SINGING_CURE) 
    ? APP.cauldron.glowIntensity 
    : 0.3 + Math.sin(APP.time*0.02)*0.1;
  pixelRenderer.drawStreetLamp(ctx, lampIntensity);

  // 7. Draw Generic Particles (smoke, hearts, notes, sparks)
  renderParticles(ctx);

  // 8. Draw black fadeout overlay at the very end
  if (APP.state === STATE.BLACK_OUT) {
    ctx.fillStyle = `rgba(0, 0, 0, ${APP.endingFadeAlpha})`;
    ctx.fillRect(0, 0, cw, ch);
  }

  ctx.restore();
}

function renderParticles(ctx) {
  APP.particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    
    if (p.type === 'note') {
      ctx.fillStyle = p.color;
      // Draw standard single note symbol
      ctx.fillRect(p.x, p.y - 4, 3, 1);
      ctx.fillRect(p.x + 2, p.y - 4, 1, 5);
      ctx.fillRect(p.x, p.y, 2, 2);
    } else if (p.type === 'heart') {
      ctx.fillStyle = p.color;
      // Pixel Heart
      ctx.fillRect(p.x - 1, p.y - 2, 1, 1);
      ctx.fillRect(p.x + 1, p.y - 2, 1, 1);
      ctx.fillRect(p.x - 2, p.y - 1, 5, 1);
      ctx.fillRect(p.x - 2, p.y, 5, 1);
      ctx.fillRect(p.x - 1, p.y + 1, 3, 1);
      ctx.fillRect(p.x, p.y + 2, 1, 1);
    } else if (p.type === 'smoke') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // General pixel blocks (bubbles, splash, stars, fireflies)
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    }
    
    ctx.restore();
  });
}

// ----------------------------------------------------
// TEXT / NARRATIVE HUD CONTROLS
// ----------------------------------------------------

function showSubtitle(text, duration, artist = "") {
  const box = document.getElementById('subtitle-box');
  const songLabel = document.getElementById('subtitle-song-name');
  const txt = document.getElementById('subtitle-text');

  if (artist) {
    songLabel.style.display = 'block';
    songLabel.innerText = `${artist} - ${SONGS_QUEUE[APP.currentSongIndex].title}`;
  } else {
    songLabel.style.display = 'none';
  }

  txt.innerText = text;
  box.classList.add('visible');

  // Clear previous timeouts
  if (APP.subtitleTimeout) clearTimeout(APP.subtitleTimeout);
  APP.subtitleTimeout = setTimeout(() => {
    box.classList.remove('visible');
  }, duration);
}

// ----------------------------------------------------
// TRANSITION TO BLACK SCREEN
// ----------------------------------------------------

function fadeOutToBlack() {
  APP.state = STATE.BLACK_OUT;
  APP.endingFadeAlpha = 0;
  
  // Hide cinematic subtitles
  document.getElementById('subtitle-box').classList.remove('visible');
}
