import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Heart } from 'lucide-react';

const LETTERS = [
  {
    id: 'sad',
    label: "Open When You're Sad",
    emoji: '🌧️',
    color: 'from-blue-500/20 to-indigo-600/10',
    borderColor: 'border-blue-400/30',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    accentColor: '#818cf8',
    messages: [
      "Hey. I know right now everything feels heavy and that's okay. You don't have to pretend to be fine. But I need you to know, I think about you in quiet moments and every single time I smile. You make this world softer just by being in it.\n\nSadness is just love with nowhere to go right now. Let it pass through you. I'm here, even from far away.",
      "You're allowed to cry. You're allowed to feel it all. But please don't forget, you are the kind of person who makes other people feel seen and heard just by existing. That's rare. That's you.\n\nThings will feel lighter soon. Until then I'm sending you the warmest quietest hug. You're not alone in this.",
      "I wish I could be there right now to sit next to you in silence or say something stupid to make you laugh. Since I can't, just know that somewhere someone is thinking about you with so much warmth it's almost embarrassing.\n\nYou'll get through this. You always do. And I'll be here when you come out the other side."
    ]
  },
  {
    id: 'happy',
    label: "Open When You're Happy",
    emoji: '☀️',
    color: 'from-amber-400/20 to-yellow-500/10',
    borderColor: 'border-amber-400/30',
    glowColor: 'rgba(251, 191, 36, 0.15)',
    accentColor: '#fbbf24',
    messages: [
      "YES. Look at you, happy and glowing! This is your natural state you know? This lightness, this ease, it suits you perfectly. Don't let anyone dim it.\n\nI love when you're happy. The world genuinely looks better when you're okay. Enjoy every single second of it. You deserve it all.",
      "A happy you is my favorite you. Okay all versions of you are my favorite but a happy you? That hits different.\n\nKeep riding this wave. You've earned it. Go do something fun, be a little silly, laugh too loud. You have my full permission.",
      "Something good happened and you remembered this? That's adorable. I'm so glad you're smiling right now.\n\nPlease save this feeling somewhere safe inside you. On the harder days come back to this moment and remember, you are capable of feeling this good. It will always come back."
    ]
  },
  {
    id: 'notenough',
    label: "Open When You Feel Like You're Not Enough",
    emoji: '💫',
    color: 'from-rose-500/20 to-pink-600/10',
    borderColor: 'border-rose-400/30',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    accentColor: '#fb7185',
    messages: [
      "Stop. I need you to hear this. You are so so enough. More than enough. You've been measuring yourself against some standard that doesn't even exist and I hate that for you.\n\nThe way you care about things, the way your mind works, the way you love, none of that is small. It's everything. Please be a little kinder to yourself today.",
      "I know your brain is lying to you right now. It does that sometimes. But I've seen you, really seen you, and what I see is someone who gives everything they have, who feels deeply, who tries even when it's hard.\n\nThat's not not enough. That's more than most people will ever be. You are more than enough, always.",
      "Whoever made you feel this way today was wrong. Full stop.\n\nYou bring something to this world that no one else can replicate. Your kindness, your laugh, the weird things you notice, the way you make people feel. That's irreplaceable. The world would genuinely be missing something without you in it."
    ]
  },
  {
    id: 'miss',
    label: 'Open When You Miss Me',
    emoji: '🌙',
    color: 'from-cyan-500/20 to-teal-600/10',
    borderColor: 'border-cyan-400/30',
    glowColor: 'rgba(0, 240, 255, 0.12)',
    accentColor: '#00f0ff',
    messages: [
      "Hey, I miss you too. Whatever you're feeling right now, that pull, that ache, I feel it from here. Distance is weird like that. It makes you realize how much someone actually matters.\n\nBut guess what. Every mile between us is just proof of how real this is. I'm not going anywhere. I'm right here, just in a different time zone.",
      "You thought of me. That just made my whole day honestly.\n\nI think about you more than I say. In the quiet in-between moments, music or sunsets or something funny that happened, my first thought is always that I want to tell you. That's you. You live in my little everyday moments.",
      "Missing someone is proof they mattered. And you matter to me a ridiculous amount.\n\nClose your eyes for a second. Breathe. I'm right there with you in whatever quiet you can find. We're looking at the same sky. We're more connected than the distance makes it feel. I promise."
    ]
  },
  {
    id: 'proud',
    label: 'Open When You Did Something Great',
    emoji: '🏆',
    color: 'from-emerald-400/20 to-green-600/10',
    borderColor: 'border-emerald-400/30',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    accentColor: '#34d399',
    messages: [
      "I KNEW IT. I knew you could do it. Honestly were you even surprised? Because I wasn't.\n\nYou work hard, you care, you push through even when you don't feel like it. This moment? You earned every single bit of it. Celebrate yourself. You deserve it.",
      "Look at you go!! I'm so proud it's actually kind of annoying how proud I am.\n\nSeriously though, remember this feeling. You did a hard thing. Or maybe it wasn't even hard for you and that's the whole point, you're just that good. Either way YES. That's you. That's all you.",
      "Something in me just wanted to cheer out loud when I read this.\n\nYou did something great and I want you to sit with that for longer than you normally would. Don't move on too fast. Don't already be thinking about the next thing. Just for right now, be proud of yourself. You've earned it completely."
    ]
  },
  {
    id: 'cantsleep',
    label: "Open When You Can't Sleep",
    emoji: '🌠',
    color: 'from-violet-500/20 to-purple-700/10',
    borderColor: 'border-violet-400/30',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    accentColor: '#a78bfa',
    messages: [
      "It's late and your brain won't quiet down. I know. Mine does that too.\n\nHere's something to think about instead. Somewhere someone is thinking of you with the softest kind of warmth. That's me. You are so genuinely cared for, even in the 3am dark where it doesn't always feel that way. Rest now. Tomorrow will be a little easier.",
      "You're awake again. The night feels too big and your thoughts are too loud.\n\nTry this, breathe in slowly and breathe out slower. Think of one good thing that happened today, even something tiny. The world is quieter at this hour. Let it hold you for a bit. You don't have to figure everything out tonight.",
      "The fact that you opened this at whatever time it is tells me your brain is being chaotic again.\n\nYou're okay. You're safe. Nothing needs solving right now. I hope you find a comfortable spot and just let the night be gentle with you. Dream of something beautiful. You deserve rest. I'll be here in the morning too."
    ]
  },
];

function LetterCard({ letter, onOpen }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onOpen(letter)}
      className={`relative cursor-pointer rounded-2xl border p-5 overflow-hidden bg-gradient-to-br ${letter.color} ${letter.borderColor} transition-colors duration-400 ease-out group`}
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px ${letter.glowColor}` }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${letter.accentColor}40, transparent)` }}
      />
      <div className="flex flex-col items-center gap-3 relative z-10">
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center relative"
          style={{ background: `${letter.accentColor}15`, border: `1px solid ${letter.accentColor}30` }}
        >
          <span className="text-2xl absolute group-hover:opacity-0 transition-opacity duration-300">{letter.emoji}</span>
          <Mail
            size={26}
            className="opacity-0 group-hover:opacity-90 transition-opacity duration-300 absolute"
            style={{ color: letter.accentColor }}
          />
        </motion.div>
        <p
          className="text-center text-[12px] leading-snug font-medium tracking-wide"
          style={{ color: letter.accentColor }}
        >
          {letter.label}
        </p>
        <div
          className="flex items-center gap-1.5 opacity-30 group-hover:opacity-80 transition-opacity duration-300"
          style={{ color: letter.accentColor }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Open</span>
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[10px]"
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

function LetterModal({ letter, onClose }) {
  const [message] = useState(() => {
    const idx = Math.floor(Math.random() * letter.messages.length);
    return letter.messages[idx];
  });

  const paragraphs = message.split('\n\n');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(5, 11, 20, 0.95)',
          border: `1px solid ${letter.accentColor}30`,
          boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 60px ${letter.glowColor}`,
        }}
      >
        <div
          className="w-full h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${letter.accentColor}, transparent)` }}
        />
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{letter.emoji}</span>
            <div>
              <p
                className="text-[10px] tracking-[0.25em] uppercase opacity-50 font-medium"
                style={{ color: letter.accentColor }}
              >
                A Letter For You
              </p>
              <h3 className="text-sm font-semibold text-slate-100 leading-snug">{letter.label}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-90 transition-opacity"
            style={{ background: `${letter.accentColor}15` }}
          >
            <X size={14} style={{ color: letter.accentColor }} />
          </button>
        </div>
        <div
          className="mx-6 h-[1px] mb-5"
          style={{ background: `linear-gradient(90deg, ${letter.accentColor}40, transparent)` }}
        />
        <div className="px-6 pb-6">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.18 }}
              className="text-slate-200 leading-[1.9] mb-4 last:mb-0 font-handwritten text-lg md:text-xl"
            >
              {para}
            </motion.p>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center gap-2 mt-5 pt-4"
            style={{ borderTop: `1px dashed ${letter.accentColor}20` }}
          >
            <Heart size={11} style={{ color: letter.accentColor }} className="opacity-60" />
            <span
              className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-medium"
              style={{ color: letter.accentColor }}
            >
              Written just for you
            </span>
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${letter.accentColor}40, transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function OpenWhenLetters() {
  const [openLetter, setOpenLetter] = useState(null);

  return (
    <section
      id="open-when-letters"
      className="relative py-16 md:py-28 px-4 max-w-5xl mx-auto z-10 select-none w-full"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(100,255,218,0.03) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div className="text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.3em] uppercase text-cyan-soft mb-3"
        >
          Just For You
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-light font-serif text-slate-100 mb-4"
        >
          Open When Letters
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '40px' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[1px] bg-cyan-glow/40 mx-auto mb-5"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.55, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed"
        >
          Little letters sealed with love, waiting for the right moment. Open the one that fits how you're feeling.
        </motion.p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {LETTERS.map((letter, i) => (
          <motion.div
            key={letter.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <LetterCard letter={letter} onOpen={setOpenLetter} />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {openLetter && (
          <LetterModal letter={openLetter} onClose={() => setOpenLetter(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
