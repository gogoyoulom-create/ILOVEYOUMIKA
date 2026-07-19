import { motion } from 'framer-motion';

const POS = {
  m0: { x: 10,  y: 115 }, m1: { x: 10,  y: 10  },
  m2: { x: 60,  y: 62  }, m3: { x: 110, y: 10  },
  m4: { x: 110, y: 115 },
  i0: { x: 137, y: 10  }, i1: { x: 173, y: 10  },
  i2: { x: 155, y: 10  }, i3: { x: 155, y: 115 },
  i4: { x: 137, y: 115 }, i5: { x: 173, y: 115 },
  k0: { x: 200, y: 10  }, k1: { x: 200, y: 115 },
  k2: { x: 200, y: 62  }, k3: { x: 265, y: 10  },
  k4: { x: 265, y: 115 },
  a0: { x: 345, y: 10  }, a1: { x: 295, y: 115 },
  a2: { x: 395, y: 115 }, a3: { x: 313, y: 80  },
  a4: { x: 377, y: 80  },
};

const LINES = [
  { id: 'ml1', from: 'm0', to: 'm1' }, { id: 'ml2', from: 'm1', to: 'm2' },
  { id: 'ml3', from: 'm2', to: 'm3' }, { id: 'ml4', from: 'm3', to: 'm4' },
  { id: 'il1', from: 'i0', to: 'i1' }, { id: 'il2', from: 'i2', to: 'i3' },
  { id: 'il3', from: 'i4', to: 'i5' },
  { id: 'kl1', from: 'k0', to: 'k1' }, { id: 'kl2', from: 'k2', to: 'k3' },
  { id: 'kl3', from: 'k2', to: 'k4' },
  { id: 'al1', from: 'a0', to: 'a1' }, { id: 'al2', from: 'a0', to: 'a2' },
  { id: 'al3', from: 'a3', to: 'a4' },
];

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

const DUST = [
  { id: 'd1', cx: -22, cy: 18,  r: 0.7, d: 2.5, dl: 0.3 },
  { id: 'd2', cx: 33,  cy: -18, r: 0.6, d: 2.8, dl: 0.7 },
  { id: 'd3', cx: 82,  cy: 148, r: 0.5, d: 3.5, dl: 0.2 },
  { id: 'd4', cx: 155, cy: 152, r: 0.5, d: 3.0, dl: 0.6 },
  { id: 'd5', cx: 237, cy: -20, r: 0.6, d: 3.3, dl: 0.4 },
  { id: 'd6', cx: 268, cy: 148, r: 0.5, d: 2.6, dl: 1.7 },
  { id: 'd7', cx: 422, cy: 28,  r: 0.6, d: 2.4, dl: 0.1 },
  { id: 'd8', cx: -28, cy: 80,  r: 0.5, d: 2.9, dl: 0.5 },
  { id: 'd9', cx: 372, cy: -18, r: 0.6, d: 2.2, dl: 0.8 },
];

export default function MikaStars() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 3 }}
      style={{
        position: 'fixed',
        right: '-58px',
        top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        width: '180px',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="-45 -35 500 185"
        style={{ width: '100%', height: 'auto', overflow: 'visible', opacity: 0.45 }}
      >
        <defs>
          <filter id="mika-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mika-line-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dust stars */}
        {DUST.map(s => (
          <circle
            key={s.id}
            cx={s.cx} cy={s.cy} r={s.r}
            fill="rgba(100,255,218,0.6)"
            className="star-twinkle"
            style={{ animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}
          />
        ))}

        {/* Constellation lines */}
        {LINES.map((line, i) => {
          const a = POS[line.from];
          const b = POS[line.to];
          return (
            <motion.path
              key={line.id}
              d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
              stroke="rgba(100,255,218,0.3)"
              strokeWidth="0.8"
              fill="none"
              filter="url(#mika-line-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 3.2 + i * 0.18, ease: 'easeInOut' }}
            />
          );
        })}

        {/* Letter stars */}
        {STARS.map(star => {
          const pos = POS[star.id];
          return (
            <motion.g
              key={star.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 3 + star.delay }}
            >
              <circle
                cx={pos.x} cy={pos.y} r={star.r + 2}
                fill="rgba(100,255,218,0.07)"
                className="star-twinkle"
                style={{ animationDuration: `${star.tw.d}s`, animationDelay: `${star.tw.dl}s` }}
              />
              <circle
                cx={pos.x} cy={pos.y} r={star.r}
                fill="#64ffda"
                filter="url(#mika-glow)"
                className="star-twinkle"
                style={{ animationDuration: `${star.tw.d}s`, animationDelay: `${star.tw.dl}s` }}
              />
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}
