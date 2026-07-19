import { motion } from 'framer-motion';

// Star positions forming each letter of "MIKA" as constellations
// Coordinate system: viewBox "-45 -35 500 185"
const POS = {
  // M
  m0: { x: 10,  y: 115 }, m1: { x: 10,  y: 10  },
  m2: { x: 60,  y: 62  }, m3: { x: 110, y: 10  },
  m4: { x: 110, y: 115 },
  // I
  i0: { x: 137, y: 10  }, i1: { x: 173, y: 10  },
  i2: { x: 155, y: 10  }, i3: { x: 155, y: 115 },
  i4: { x: 137, y: 115 }, i5: { x: 173, y: 115 },
  // K
  k0: { x: 200, y: 10  }, k1: { x: 200, y: 115 },
  k2: { x: 200, y: 62  }, k3: { x: 265, y: 10  },
  k4: { x: 265, y: 115 },
  // A
  a0: { x: 345, y: 10  }, a1: { x: 295, y: 115 },
  a2: { x: 395, y: 115 }, a3: { x: 313, y: 80  },
  a4: { x: 377, y: 80  },
};

// Lines connecting the stars into letter shapes
const LINES = [
  { id: 'ml1', from: 'm0', to: 'm1' },
  { id: 'ml2', from: 'm1', to: 'm2' },
  { id: 'ml3', from: 'm2', to: 'm3' },
  { id: 'ml4', from: 'm3', to: 'm4' },
  { id: 'il1', from: 'i0', to: 'i1'  },
  { id: 'il2', from: 'i2', to: 'i3'  },
  { id: 'il3', from: 'i4', to: 'i5'  },
  { id: 'kl1', from: 'k0', to: 'k1'  },
  { id: 'kl2', from: 'k2', to: 'k3'  },
  { id: 'kl3', from: 'k2', to: 'k4'  },
  { id: 'al1', from: 'a0', to: 'a1'  },
  { id: 'al2', from: 'a0', to: 'a2'  },
  { id: 'al3', from: 'a3', to: 'a4'  },
];

// Main letter stars with appear delay and twinkle timing
const STARS = [
  { id: 'm0', r: 2.5, delay: 0.2,  tw: { d: 3.2, dl: 0.0 } },
  { id: 'm1', r: 2.5, delay: 0.5,  tw: { d: 2.8, dl: 0.4 } },
  { id: 'm2', r: 2.0, delay: 0.8,  tw: { d: 3.6, dl: 0.8 } },
  { id: 'm3', r: 2.5, delay: 1.1,  tw: { d: 2.5, dl: 0.2 } },
  { id: 'm4', r: 2.5, delay: 1.4,  tw: { d: 3.0, dl: 1.1 } },
  { id: 'i0', r: 1.5, delay: 1.7,  tw: { d: 2.9, dl: 0.6 } },
  { id: 'i1', r: 1.5, delay: 1.7,  tw: { d: 3.3, dl: 1.3 } },
  { id: 'i2', r: 2.0, delay: 1.9,  tw: { d: 2.6, dl: 0.0 } },
  { id: 'i3', r: 2.0, delay: 2.1,  tw: { d: 3.5, dl: 0.9 } },
  { id: 'i4', r: 1.5, delay: 2.3,  tw: { d: 2.7, dl: 1.5 } },
  { id: 'i5', r: 1.5, delay: 2.3,  tw: { d: 3.1, dl: 0.3 } },
  { id: 'k0', r: 2.5, delay: 2.6,  tw: { d: 3.3, dl: 0.7 } },
  { id: 'k1', r: 2.5, delay: 2.9,  tw: { d: 2.4, dl: 1.0 } },
  { id: 'k2', r: 2.0, delay: 3.2,  tw: { d: 3.7, dl: 0.2 } },
  { id: 'k3', r: 2.5, delay: 3.5,  tw: { d: 2.8, dl: 1.4 } },
  { id: 'k4', r: 2.5, delay: 3.8,  tw: { d: 3.2, dl: 0.5 } },
  { id: 'a0', r: 3.0, delay: 4.1,  tw: { d: 2.5, dl: 0.0 } },
  { id: 'a1', r: 2.5, delay: 4.4,  tw: { d: 3.0, dl: 0.8 } },
  { id: 'a2', r: 2.5, delay: 4.4,  tw: { d: 2.7, dl: 1.2 } },
  { id: 'a3', r: 1.5, delay: 4.7,  tw: { d: 3.4, dl: 0.4 } },
  { id: 'a4', r: 1.5, delay: 4.7,  tw: { d: 2.9, dl: 1.7 } },
];

// Small dust stars scattered around the name
const DUST = [
  { id: 'd1',  cx: -22, cy: 18,   r: 0.8, d: 2.5, dl: 0.3 },
  { id: 'd2',  cx: -8,  cy: 72,   r: 0.5, d: 3.2, dl: 1.1 },
  { id: 'd3',  cx: 33,  cy: -18,  r: 0.7, d: 2.8, dl: 0.7 },
  { id: 'd4',  cx: 82,  cy: 148,  r: 0.6, d: 3.5, dl: 0.2 },
  { id: 'd5',  cx: 125, cy: -22,  r: 0.9, d: 2.3, dl: 1.4 },
  { id: 'd6',  cx: 155, cy: 152,  r: 0.5, d: 3.0, dl: 0.6 },
  { id: 'd7',  cx: 183, cy: -20,  r: 0.7, d: 2.7, dl: 1.0 },
  { id: 'd8',  cx: 237, cy: 148,  r: 0.6, d: 3.3, dl: 0.4 },
  { id: 'd9',  cx: 268, cy: -15,  r: 0.8, d: 2.6, dl: 1.7 },
  { id: 'd10', cx: 312, cy: 148,  r: 0.5, d: 3.1, dl: 0.9 },
  { id: 'd11', cx: 422, cy: 28,   r: 0.7, d: 2.4, dl: 0.1 },
  { id: 'd12', cx: 428, cy: 92,   r: 0.6, d: 3.4, dl: 1.3 },
  { id: 'd13', cx: -28, cy: 132,  r: 0.5, d: 2.9, dl: 0.5 },
  { id: 'd14', cx: 52,  cy: -22,  r: 0.6, d: 3.6, dl: 1.8 },
  { id: 'd15', cx: 372, cy: -18,  r: 0.7, d: 2.2, dl: 0.8 },
  { id: 'd16', cx: 128, cy: 60,   r: 0.4, d: 3.0, dl: 0.3 },
  { id: 'd17', cx: 285, cy: 38,   r: 0.4, d: 2.8, dl: 1.2 },
  { id: 'd18', cx: 412, cy: 62,   r: 0.5, d: 3.3, dl: 0.6 },
  { id: 'd19', cx: -5,  cy: -10,  r: 0.6, d: 2.6, dl: 1.5 },
  { id: 'd20', cx: 200, cy: -25,  r: 0.7, d: 3.1, dl: 0.4 },
  { id: 'd21', cx: 450, cy: 50,   r: 0.5, d: 2.4, dl: 1.0 },
  { id: 'd22', cx: -35, cy: 55,   r: 0.6, d: 3.0, dl: 0.2 },
  { id: 'd23', cx: 60,  cy: 155,  r: 0.4, d: 2.7, dl: 1.6 },
  { id: 'd24', cx: 340, cy: -22,  r: 0.5, d: 3.5, dl: 0.7 },
];

export default function MikaStars() {
  return (
    <section
      id="mika-stars"
      className="relative py-16 md:py-24 px-4 z-10 select-none w-full overflow-hidden"
    >
      {/* Soft ambient glow behind the constellation */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[280px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(100,255,218,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Section eyebrow label */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8 }}
        className="text-center text-[11px] tracking-[0.45em] uppercase text-cyan-soft/40 mb-12"
      >
        ✦ written in the stars ✦
      </motion.p>

      {/* Constellation SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full max-w-xl mx-auto px-6"
      >
        <svg
          viewBox="-45 -35 500 185"
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Glow filter for the main letter stars */}
            <filter id="mika-glow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Subtle glow for constellation lines */}
            <filter id="mika-line-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dust stars — always visible, gently twinkling */}
          {DUST.map(s => (
            <circle
              key={s.id}
              cx={s.cx} cy={s.cy} r={s.r}
              fill="rgba(100,255,218,0.55)"
              className="star-twinkle"
              style={{ animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}
            />
          ))}

          {/* Constellation lines — draw in one by one */}
          {LINES.map((line, i) => {
            const a = POS[line.from];
            const b = POS[line.to];
            return (
              <motion.path
                key={line.id}
                d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
                stroke="rgba(100,255,218,0.22)"
                strokeWidth="0.7"
                fill="none"
                filter="url(#mika-line-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.2, ease: 'easeInOut' }}
              />
            );
          })}

          {/* Letter stars — fade in sequentially, then twinkle */}
          {STARS.map(star => {
            const pos = POS[star.id];
            return (
              <motion.g
                key={star.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: star.delay }}
              >
                {/* Outer glow halo */}
                <circle
                  cx={pos.x} cy={pos.y} r={star.r + 2}
                  fill="rgba(100,255,218,0.08)"
                  className="star-twinkle"
                  style={{
                    animationDuration: `${star.tw.d}s`,
                    animationDelay: `${star.tw.dl}s`,
                  }}
                />
                {/* Core star */}
                <circle
                  cx={pos.x} cy={pos.y} r={star.r}
                  fill="#64ffda"
                  filter="url(#mika-glow)"
                  className="star-twinkle"
                  style={{
                    animationDuration: `${star.tw.d}s`,
                    animationDelay: `${star.tw.dl}s`,
                  }}
                />
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      {/* Soft subtitle underneath */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 5.5 }}
        className="text-center text-[10px] tracking-[0.35em] uppercase text-slate-600 mt-10"
      >
        that's your name up there
      </motion.p>
    </section>
  );
}
