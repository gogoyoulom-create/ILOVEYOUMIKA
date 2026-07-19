// Pixel-Art Renderer for Retro Cinematic Story
// Handles all canvas drawing operations with crisp pixel aesthetics

let photoCanvas = null;
let photoCtx = null;

// Color Palette Definition
const PALETTE = {
  skyDark: '#04050f',
  skyLight: '#0f142d',
  brickMortar: '#0f0a14',
  brick1: '#261b2b',
  brick2: '#332135',
  brick3: '#1c1322',
  road: '#131520',
  roadLine: '#24283c',
  sidewalk: '#1f2130',
  sidewalkCurb: '#2b2e42',
  lampPost: '#22232a',
  lampGlow: 'rgba(255, 225, 120, 0.18)',
  lampBulb: '#ffdf6d',
  cauldronMetal: '#1d1e26',
  cauldronHighlight: '#333545',
  glassFrame: '#0a0a0c',
  skinFair: '#fcd3ba',
  hairBrown: '#5c3a21',
  hairBlack: '#1d1d1f',
  sweaterGirl: '#e3ad34',
  jacketBoy: '#2e5c3e',
  jeansGirl: '#2a3a5c',
  pantsBoy: '#3e414f',
  blushCheeks: 'rgba(255, 100, 130, 0.75)',
  busRed: '#a81c1c',
  busWindowOn: '#ffdc5e',
  busWindowOff: '#242021',
  busWheel: '#0d0d0f',
  busWheelCap: '#6a6e82'
};

// Character Sprite Layouts (16x24 grids)
// Each character in the string represents a color key:
// . = transparent, H = hair, S = skin, G = glasses frame, E = hazel eye, W = white eye
// B = blush, C = clothes (sweater/jacket), P = pants, K = shoes, M = mic, m = mic stand
const SPRITE_MAPS = {
  girl: {
    idle: [
      "....HHHHHH......",
      "..HHHHHHHHHH....",
      ".HHHHHHHHHHHH...",
      "HHHHSSSSSSSSHH..",
      "HHHSSWWSSWWSSHH.",
      "HHHSSGGSSGGSSHH.",
      "HHHSSGESSGESSHH.",
      ".HHSSSSSSSSSSHH.",
      "..HSSSSSSSSSsH..",
      "...SSBBSSBBSSH..",
      "....SSSSSSSSSH..",
      "....CCCCCCSS....",
      "....CCCCCC......",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PP....PP....",
      "....PP....PP....",
      "....KK....KK....",
      "....KK....KK...."
    ],
    blink: [
      "....HHHHHH......",
      "..HHHHHHHHHH....",
      ".HHHHHHHHHHHH...",
      "HHHHSSSSSSSSHH..",
      "HHHSSGGSSGGSSHH.",
      "HHHSSGGSSGGSSHH.",
      "HHHSSSSSSSSSSHH.",
      ".HHSSSSSSSSSSHH.",
      "..HSSSSSSSSSsH..",
      "...SSBBSSBBSSH..",
      "....SSSSSSSSSH..",
      "....CCCCCCSS....",
      "....CCCCCC......",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PP....PP....",
      "....PP....PP....",
      "....KK....KK....",
      "....KK....KK...."
    ],
    surprised: [
      "....HHHHHH......",
      "..HHHHHHHHHH....",
      ".HHHHHHHHHHHH...",
      "HHHHSSSSSSSSHH..",
      "HHHSSWWSSWWSSHH.",
      "HHHSSGGSSGGSSHH.",
      "HHHSSGESSGESSHH.",
      ".HHSSSSSSSSSSHH.",
      "..HSSSS.S.SSSsH..",
      "...SSBB.S.BBSSH..",
      "....SSS.S.SSSH..",
      "....CCCCCCSS....",
      "....CCCCCC......",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PP....PP....",
      "....PP....PP....",
      "....KK....KK....",
      "....KK....KK...."
    ]
  },
  boy: {
    idle: [
      "....HHHHHH......",
      "..HHHHHHHHHH....",
      ".HHHHHHHHHHHH...",
      "HHHHSSSSSSSSHH..",
      "HHHSSWWSSWWSSHH.",
      "HHHSSGGSSGGSSHH.",
      "HHHSSGGSSGGSSHH.",
      ".HHSSSSSSSSSSHH.",
      "..HSSSSSSSSSsH..",
      "...SSSSSSSSSHH..",
      "....SSSSSSSSSH..",
      "....CCCCCC......",
      "....CCCCCC......",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PP....PP....",
      "....PP....PP....",
      "....KK....KK....",
      "....KK....KK...."
    ],
    singing: [
      "....HHHHHH......",
      "..HHHHHHHHHH....",
      ".HHHHHHHHHHHH...",
      "HHHHSSSSSSSSHH..",
      "HHHSSWWSSWWSSHH.",
      "HHHSSGGSSGGSSHH.",
      "HHHSSGGSSGGSSHH.",
      ".HHSSSSSSSSSSHH.",
      "..HSSSSSSSSSSsH.",
      "...SSS..S..SSHH.",
      "....SS..S..SSSH.",
      "....CCCCCC......",
      "....CCCCCC......",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "...CCCCCCCCC....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PPPPPPPP....",
      "....PP....PP....",
      "....PP....PP....",
      "....KK....KK....",
      "....KK....KK...."
    ]
  }
};

// Renders a sprite sheet directly to context
function drawSprite(ctx, map, x, y, pixelScale, config = {}) {
  const height = map.length;
  const width = map[0].length;
  
  const startX = x - (width * pixelScale) / 2;
  const startY = y - height * pixelScale;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const char = map[r][c];
      if (char === '.') continue; // transparent

      let color = 'transparent';
      
      switch (char) {
        case 'H':
          color = config.hairColor || PALETTE.hairBrown;
          break;
        case 'S':
          color = PALETTE.skinFair;
          break;
        case 'G':
          color = PALETTE.glassFrame;
          break;
        case 'W':
          color = '#ffffff';
          break;
        case 'E':
          color = config.eyeColor || '#7c5936'; // hazel / custom
          break;
        case 'B':
          if (config.blush) {
            color = PALETTE.blushCheeks;
          } else {
            color = PALETTE.skinFair; // no blush, draw skin
          }
          break;
        case 'C':
          color = config.sweaterColor || PALETTE.sweaterGirl;
          break;
        case 'P':
          color = config.pantsColor || PALETTE.jeansGirl;
          break;
        case 'K':
          color = '#111115';
          break;
        case 's': // skin shadow
          color = '#e2ba9b';
          break;
      }

      if (color !== 'transparent') {
        ctx.fillStyle = color;
        // Flip character horizontally if specified
        const drawC = config.flip ? (width - 1 - c) : c;
        ctx.fillRect(startX + drawC * pixelScale, startY + r * pixelScale, pixelScale, pixelScale);
      }
    }
  }
}

// Renders the background brick wall, night sky, and stars
function drawBackground(ctx, canvasWidth, canvasHeight, time, stars) {
  // 1. Draw Night Sky (Dark gradient)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 90);
  skyGrad.addColorStop(0, PALETTE.skyDark);
  skyGrad.addColorStop(1, PALETTE.skyLight);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvasWidth, 90);

  // 2. Draw Stars
  stars.forEach(star => {
    // Make stars blink gently based on time & phase
    const blink = Math.sin(time * 0.005 + star.phase) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + blink * 0.8})`;
    if (star.size > 1) {
      ctx.fillRect(star.x, star.y, 2, 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + blink * 0.4})`;
      ctx.fillRect(star.x - 1, star.y, 4, 2);
      ctx.fillRect(star.x, star.y - 1, 2, 4);
    } else {
      ctx.fillRect(star.x, star.y, 1, 1);
    }
  });

  // 3. Draw Brick Wall (from y=90 to y=210)
  const wallTop = 90;
  const wallBottom = 210;
  const brickW = 16;
  const brickH = 8;
  const mortarSize = 1;

  // Background mortar layer
  ctx.fillStyle = PALETTE.brickMortar;
  ctx.fillRect(0, wallTop, canvasWidth, wallBottom - wallTop);

  // Individual bricks
  for (let y = wallTop; y < wallBottom; y += brickH + mortarSize) {
    const rowOffset = ((y - wallTop) / (brickH + mortarSize)) % 2 === 0 ? 0 : brickW / 2;
    for (let x = -brickW; x < canvasWidth + brickW; x += brickW + mortarSize) {
      // Pick a brick color pseudo-randomly to keep it consistent and retro
      const randSeed = Math.floor(Math.abs(Math.sin((x + rowOffset) * 12.9898 + y * 78.233)) * 3);
      let brickColor = PALETTE.brick1;
      if (randSeed === 1) brickColor = PALETTE.brick2;
      if (randSeed === 2) brickColor = PALETTE.brick3;

      ctx.fillStyle = brickColor;
      ctx.fillRect(x + rowOffset, y, brickW, brickH);
    }
  }

  // Draw Sidewalk trim/curb (y=210 to y=218)
  ctx.fillStyle = PALETTE.sidewalkCurb;
  ctx.fillRect(0, 210, canvasWidth, 8);
  ctx.fillStyle = PALETTE.sidewalk;
  ctx.fillRect(0, 218, canvasWidth, 12);

  // 4. Draw Asphalt Road (y=230 to y=270)
  ctx.fillStyle = PALETTE.road;
  ctx.fillRect(0, 230, canvasWidth, 40);

  // Dashed lane lines
  ctx.fillStyle = PALETTE.roadLine;
  const lineW = 20;
  const gapW = 30;
  for (let x = 10; x < canvasWidth; x += lineW + gapW) {
    ctx.fillRect(x, 248, lineW, 2);
  }
}

// Renders the street lamp and light cone
function drawStreetLamp(ctx, intensity) {
  const lampX = 240;
  const lampY = 65;

  // Draw street lamp post structure
  ctx.fillStyle = PALETTE.lampPost;
  
  // Base
  ctx.fillRect(lampX - 6, 204, 12, 6);
  ctx.fillRect(lampX - 4, 190, 8, 14);
  // Column
  ctx.fillRect(lampX - 2, 85, 4, 105);
  // Arm curve
  ctx.fillRect(lampX - 2, 77, 4, 8);
  ctx.fillRect(lampX - 10, 71, 10, 6);
  ctx.fillRect(lampX - 16, 68, 8, 5);
  // Lamp Head
  ctx.fillStyle = '#1c1d24';
  ctx.fillRect(lampX - 18, 64, 4, 4);
  ctx.fillStyle = PALETTE.lampPost;
  ctx.fillRect(lampX - 22, 68, 12, 4);
  ctx.fillRect(lampX - 20, 72, 8, 3);

  // Bulb
  ctx.fillStyle = PALETTE.lampBulb;
  ctx.fillRect(lampX - 19, 75, 6, 3);

  // Warm glowing Light Cone (Yellow gradient with composite mode)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  const coneGrad = ctx.createLinearGradient(0, lampY + 13, 0, 240);
  // Pulse light opacity dynamically based on music/intensity
  const alpha = 0.12 + intensity * 0.15;
  coneGrad.addColorStop(0, `rgba(255, 230, 140, ${alpha * 2})`);
  coneGrad.addColorStop(0.3, `rgba(255, 220, 120, ${alpha * 1.1})`);
  coneGrad.addColorStop(1, 'rgba(255, 210, 100, 0)');

  // Draw light triangle
  ctx.beginPath();
  ctx.moveTo(lampX - 16, lampY + 13);
  ctx.lineTo(lampX - 100, 240);
  ctx.lineTo(lampX + 68, 240);
  ctx.closePath();
  ctx.fillStyle = coneGrad;
  ctx.fill();

  // Cozy yellow ellipse on the ground
  const groundGrad = ctx.createRadialGradient(lampX - 16, 230, 10, lampX - 16, 230, 80);
  groundGrad.addColorStop(0, `rgba(255, 225, 120, ${alpha * 2.2})`);
  groundGrad.addColorStop(0.6, `rgba(255, 210, 100, ${alpha * 0.8})`);
  groundGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
  ctx.beginPath();
  ctx.ellipse(lampX - 16, 230, 84, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = groundGrad;
  ctx.fill();

  ctx.restore();
}

// Renders the magical memory cauldron
function drawCauldron(ctx, x, y, frameCount, glowIntensity, glowColor) {
  const pixelScale = 2;
  const cw = 28; // width of cauldron
  const ch = 20; // height of cauldron

  // 1. Draw magical vapor / smoke floating up
  ctx.fillStyle = glowColor;
  ctx.save();
  ctx.globalAlpha = 0.25 + glowIntensity * 0.25;
  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < 5; i++) {
    const wave = Math.sin(frameCount * 0.03 + i * 2) * 8;
    const size = 6 + (i % 3) * 3;
    const sy = y - 10 - i * 8 - (frameCount % 8);
    ctx.beginPath();
    ctx.arc(x + wave, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 2. Draw Cauldron metal body
  ctx.fillStyle = PALETTE.cauldronMetal;
  // Rim
  ctx.fillRect(x - cw/2, y - ch, cw, 3);
  // Body shape
  ctx.fillRect(x - cw/2 + 2, y - ch + 3, cw - 4, 4);
  ctx.fillRect(x - cw/2 + 1, y - ch + 7, cw - 2, 8);
  ctx.fillRect(x - cw/2 + 3, y - ch + 15, cw - 6, 3);
  // Legs
  ctx.fillRect(x - cw/2 + 4, y - ch + 18, 3, 2);
  ctx.fillRect(x + cw/2 - 7, y - ch + 18, 3, 2);

  // Metal Highlights
  ctx.fillStyle = PALETTE.cauldronHighlight;
  ctx.fillRect(x - cw/2 + 3, y - ch + 3, cw - 12, 1);
  ctx.fillRect(x - cw/2 + 2, y - ch + 7, 3, 6);

  // 3. Liquid inside (Boiling/Bubbling rim)
  ctx.fillStyle = glowColor;
  const boilOffset = Math.sin(frameCount * 0.2) * 1.5;
  ctx.fillRect(x - cw/2 + 2, y - ch, cw - 4, 2);
  
  // Draw bubble peaks inside cauldron rim
  ctx.fillStyle = '#fff';
  if (frameCount % 20 < 10) {
    ctx.fillRect(x - 6, y - ch - 1, 2, 2);
    ctx.fillRect(x + 5, y - ch - boilOffset, 2, 2);
  } else {
    ctx.fillRect(x - 3, y - ch - boilOffset, 2, 2);
    ctx.fillRect(x + 2, y - ch - 1, 2, 2);
  }
}

// Renders photo with pixelated effect
function drawMemoryPhoto(ctx, img, x, y, width, height, rotation, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  if (!photoCanvas) {
    photoCanvas = document.createElement('canvas');
    photoCtx = photoCanvas.getContext('2d');
  }

  const pSize = 48; // downscale photo to 48x48
  photoCanvas.width = pSize;
  photoCanvas.height = pSize;

  photoCtx.imageSmoothingEnabled = false;
  photoCtx.clearRect(0, 0, pSize, pSize);
  photoCtx.drawImage(img, 0, 0, pSize, pSize);

  // Draw pixelated image onto canvas
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(photoCanvas, -width / 2, -height / 2, width, height);

  // Retro white polaroid/pixel border
  ctx.strokeStyle = '#fbfcf6';
  ctx.lineWidth = 3;
  ctx.strokeRect(-width / 2, -height / 2, width, height);

  // Polaroid white bottom notch
  ctx.fillStyle = '#fbfcf6';
  ctx.fillRect(-width / 2, height / 2 - 6, width, 6);

  ctx.restore();
}

// Draws the Girl Character
function drawGirl(ctx, x, y, frameCount, stateConfig) {
  const pixelScale = 2; // character size scaling
  let map = SPRITE_MAPS.girl.idle;

  if (stateConfig.surprised) {
    map = SPRITE_MAPS.girl.surprised;
  } else if (stateConfig.blinking) {
    map = SPRITE_MAPS.girl.blink;
  }

  // Handle breathing bobbing
  const bob = stateConfig.breathing ? (Math.floor(frameCount / 30) % 2) : 0;
  
  // Custom render properties
  const config = {
    hairColor: PALETTE.hairBrown,
    eyeColor: '#4f7d54', // Hazel eyes
    blush: stateConfig.blush,
    flip: stateConfig.flip || false,
    sweaterColor: PALETTE.sweaterGirl,
    pantsColor: PALETTE.jeansGirl
  };

  // Draw sprite with vertical offset for breathing bob
  drawSprite(ctx, map, x, y + bob, pixelScale, config);
}

// Draws the Boy Character
function drawBoy(ctx, x, y, frameCount, stateConfig) {
  const pixelScale = 2;
  let map = SPRITE_MAPS.boy.idle;

  if (stateConfig.singing) {
    map = SPRITE_MAPS.boy.singing;
  }

  // Breathing bob
  const bob = stateConfig.breathing ? (Math.floor(frameCount / 25) % 2) : 0;

  // Walking legs motion
  let walkOffset = 0;
  if (stateConfig.walking) {
    // Bob the character up and down during steps
    walkOffset = Math.sin(frameCount * 0.15) * 2;
  }

  const config = {
    hairColor: PALETTE.hairBlack,
    eyeColor: '#2b2a2a',
    blush: false,
    flip: stateConfig.flip || false,
    sweaterColor: PALETTE.jacketBoy,
    pantsColor: PALETTE.pantsBoy
  };

  // Draw Sprite
  drawSprite(ctx, map, x, y + bob + walkOffset, pixelScale, config);

  // Draw Microphone overlay
  if (stateConfig.holdingMic) {
    ctx.fillStyle = '#333'; // Mic stand/body
    const micX = stateConfig.flip ? x + 8 : x - 8;
    const micY = y - 24 + bob + walkOffset;
    
    // Stand shaft
    ctx.fillRect(micX, micY, 1, 10);
    // Mic capsule
    ctx.fillStyle = '#888';
    ctx.fillRect(micX - 1, micY - 3, 3, 3);
    ctx.fillStyle = '#fff';
    ctx.fillRect(micX, micY - 2, 1, 1);
  }
}

// Draws the Double-decker Bus
function drawBus(ctx, x, y, wheelFrame) {
  const w = 140;
  const h = 76;
  const startX = x - w / 2;
  const startY = y - h;

  // 1. Red bus metal body
  ctx.fillStyle = PALETTE.busRed;
  ctx.fillRect(startX + 6, startY, w - 12, h - 8); // main trunk
  ctx.fillRect(startX, startY + 20, 6, h - 28); // nose

  // Front curve/bumper
  ctx.fillStyle = '#222';
  ctx.fillRect(startX, startY + h - 14, 12, 6);
  ctx.fillStyle = '#ddd';
  ctx.fillRect(startX, startY + h - 10, 8, 2);

  // White separator stripes (Retro London feel)
  ctx.fillStyle = '#fefefe';
  ctx.fillRect(startX + 6, startY + 38, w - 6, 3);
  ctx.fillRect(startX + 6, startY + 6, w - 6, 2);

  // 2. Windows grid (Double decker rows)
  const drawWindows = (rowY, litColor) => {
    const winW = 12;
    const winH = 14;
    const winGap = 6;
    for (let wx = startX + 16; wx < startX + w - 10; wx += winW + winGap) {
      // Alternating off windows for cozy RPG feel
      const windowSeed = Math.floor(Math.abs(Math.sin(wx * 29.83)) * 10);
      ctx.fillStyle = (windowSeed > 3) ? litColor : PALETTE.busWindowOff;
      ctx.fillRect(wx, rowY, winW, winH);
      
      // Window panes detail
      ctx.fillStyle = '#111';
      ctx.fillRect(wx + winW/2 - 1, rowY, 1, winH);
    }
  };

  // Top Deck windows
  drawWindows(startY + 10, PALETTE.busWindowOn);
  // Bottom Deck windows
  drawWindows(startY + 44, PALETTE.busWindowOn);

  // Driver windshield (Front-left window, assuming driving left)
  ctx.fillStyle = PALETTE.busWindowOn;
  ctx.fillRect(startX + 3, startY + 24, 10, 12);
  ctx.fillStyle = '#1c1c1f';
  ctx.fillRect(startX + 13, startY + 24, 1, 12);

  // Headlights
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startX, startY + h - 22, 3, 4);

  // Headlight beam (Light cone on road)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const beamGrad = ctx.createLinearGradient(startX, startY + h - 20, startX - 100, startY + h - 15);
  beamGrad.addColorStop(0, 'rgba(255, 240, 180, 0.45)');
  beamGrad.addColorStop(1, 'rgba(255, 230, 150, 0)');
  ctx.beginPath();
  ctx.moveTo(startX, startY + h - 22);
  ctx.lineTo(startX - 100, startY + h - 40);
  ctx.lineTo(startX - 100, startY + h + 20);
  ctx.closePath();
  ctx.fillStyle = beamGrad;
  ctx.fill();
  ctx.restore();

  // Destination board banner
  ctx.fillStyle = '#111';
  ctx.fillRect(startX + w/2 - 25, startY + 2, 50, 6);
  ctx.fillStyle = PALETTE.busWindowOn;
  // Draw simulated pixels representing text
  ctx.fillRect(startX + w/2 - 20, startY + 4, 3, 2);
  ctx.fillRect(startX + w/2 - 14, startY + 4, 8, 2);
  ctx.fillRect(startX + w/2 - 2, startY + 4, 5, 2);
  ctx.fillRect(startX + w/2 + 6, startY + 4, 6, 2);

  // 3. Spinning Wheels
  const drawWheel = (wx, wy) => {
    ctx.fillStyle = PALETTE.busWheel;
    ctx.beginPath();
    ctx.arc(wx, wy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Spinner hubcap lines
    ctx.strokeStyle = PALETTE.busWheelCap;
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(wheelFrame * 0.15);
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(6, 0);
    ctx.moveTo(0, -6);
    ctx.lineTo(0, 6);
    ctx.stroke();
    ctx.restore();
  };

  const wheelY = y - 4;
  drawWheel(startX + 30, wheelY);
  drawWheel(startX + w - 30, wheelY);
}

// Reveal exports globally
window.pixelRenderer = {
  drawBackground,
  drawStreetLamp,
  drawCauldron,
  drawMemoryPhoto,
  drawGirl,
  drawBoy,
  drawBus,
  PALETTE
};
