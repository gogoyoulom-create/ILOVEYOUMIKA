import { motion } from 'framer-motion';

const SPARKLES = [
  { id: 's1',  cx: -10, cy: 8,   r: 1.2, d: 2.5, dl: 0.3 },
  { id: 's2',  cx: 38,  cy: 22,  r: 0.8, d: 3.1, dl: 1.1 },
  { id: 's3',  cx: -9,  cy: 58,  r: 1.0, d: 2.8, dl: 0.7 },
  { id: 's4',  cx: 36,  cy: 72,  r: 0.7, d: 3.4, dl: 0.2 },
  { id: 's5',  cx: -11, cy: 105, r: 1.1, d: 2.3, dl: 1.4 },
  { id: 's6',  cx: 37,  cy: 118, r: 0.8, d: 3.0, dl: 0.6 },
  { id: 's7',  cx: -8,  cy: 152, r: 0.9, d: 2.7, dl: 1.0 },
  { id: 's8',  cx: 38,  cy: 165, r: 0.7, d: 3.3, dl: 0.4 },
  { id: 's9',  cx: 14,  cy: -12, r: 1.0, d: 2.6, dl: 0.9 },
  { id: 's10', cx: 14,  cy: 192, r: 0.8, d: 3.1, dl: 1.7 },
  { id: 's11', cx: -6,  cy: 38,  r: 0.7, d: 2.4, dl: 1.2 },
  { id: 's12', cx: 40,  cy: 95,  r: 0.6, d: 3.5, dl: 0.5 },
  { id: 's13', cx: 40,  cy: 142, r: 0.8, d: 2.9, dl: 1.6 },
  { id: 's14', cx: -12, cy: 130, r: 0.6, d: 3.2, dl: 0.1 },
];

const LETTER_DATA = [
  { char: 'M', y: 32,  delay: 2.8, tw: { d: 3.2, dl: 0.0 } },
  { char: 'I', y: 82,  delay: 3.3, tw: { d: 2.8, dl: 0.5 } },
  { char: 'K', y: 132, delay: 3.8, tw: { d: 3.5, dl: 0.3 } },
  { char: 'A', y: 182, delay: 4.3, tw: { d: 2.6, dl: 0.8 } },
];

export default function MikaStars() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 2.5 }}
      style={{
        position: 'fixed',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%) rotate(-14deg)',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="32"
        height="210"
        viewBox="-14 -16 56 232"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="mika-letter-glow" x="-200%" y="-100%" width="500%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mika-dot-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sparkle dots scattered around the letters */}
        {SPARKLES.map(s => (
          <circle
            key={s.id}
            cx={s.cx} cy={s.cy} r={s.r}
            fill="rgba(100,255,218,0.8)"
            filter="url(#mika-dot-glow)"
            className="star-twinkle"
            style={{ animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}
          />
        ))}

        {/* Each letter of MIKA, stacked vertically */}
        {LETTER_DATA.map(({ char, y, delay, tw }) => (
          <motion.text
            key={char}
            x="14"
            y={y}
            textAnchor="middle"
            fontFamily="Playfair Display, serif"
            fontSize="30"
            fill="rgba(100,255,218,0.18)"
            stroke="rgba(100,255,218,0.8)"
            strokeWidth="0.45"
            filter="url(#mika-letter-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay }}
            className="star-twinkle"
            style={{ animationDuration: `${tw.d}s`, animationDelay: `${tw.dl}s` }}
          >
            {char}
          </motion.text>
        ))}
      </svg>
    </motion.div>
  );
}
