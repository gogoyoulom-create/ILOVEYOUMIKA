import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Sun, Heart, Compass } from 'lucide-react';

const COMPLIMENTS = [
  {
    title: "Your honesty",
    description: "You say what is true, even when it is hard. It is a rare, beautiful thing that makes me trust you completely.",
    icon: Sparkles,
    color: "from-cyan-500/10 to-teal-500/5",
    glow: "rgba(0, 240, 255, 0.15)"
  },
  {
    title: "The way you make conversations feel easy",
    description: "Like talking in the middle of the night, without any filters. With you, silence is never awkward, and talking is a comfort.",
    icon: MessageCircle,
    color: "from-blue-500/10 to-indigo-500/5",
    glow: "rgba(99, 102, 241, 0.15)"
  },
  {
    title: "Your energy",
    description: "Warm, bright, and calming. It is a gentle presence that somehow makes even the heaviest days feel a lot lighter.",
    icon: Sun,
    color: "from-amber-500/10 to-orange-500/5",
    glow: "rgba(245, 158, 11, 0.15)"
  },
  {
    title: "The comfort you bring",
    description: "You are a safe place to land. No matter how messy the world gets, you always have a way of calming my mind.",
    icon: Heart,
    color: "from-rose-500/10 to-pink-500/5",
    glow: "rgba(244, 63, 94, 0.15)"
  },
  {
    title: "The way you stay on my mind",
    description: "In the quiet hours, in the busy moments, you just pop up in my thoughts. You are my favorite distraction.",
    icon: Compass,
    color: "from-sky-500/10 to-blue-500/5",
    glow: "rgba(14, 165, 233, 0.15)"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function ThingsAboutYou() {
  return (
    <section id="things-about-you" className="relative py-16 md:py-24 px-4 max-w-6xl mx-auto z-10 select-none sky-fade-top sky-fade-bottom">
      {/* Visual background atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-glow/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.3em] uppercase text-cyan-soft mb-3"
        >
          Thoughtful Details
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-light font-serif text-slate-100 mb-4"
        >
          Things About You
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "40px" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[1px] bg-cyan-glow/40 mx-auto"
        />
      </div>

      {/* Interactive Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {COMPLIMENTS.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
              }}
              className={`relative glass glass-glow glow-border p-6 md:p-8 rounded-2xl flex flex-col justify-between overflow-hidden group ${
                index === 3 ? "lg:col-span-1" : index === 4 ? "lg:col-span-2" : ""
              }`}
            >
              {/* Internal subtle background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
              
              {/* Dynamic light reflecting highlight overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-transparent pointer-events-none" />

              <div>
                {/* Compliment Icon */}
                <div className="text-cyan-soft mb-6 relative z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/50 border border-slate-800/40">
                  <IconComponent size={20} strokeWidth={1.5} className="group-hover:text-cyan-glow transition-colors duration-300" />
                </div>

                {/* Compliment Title */}
                <h3 className="text-lg md:text-xl font-light text-slate-100 mb-3 relative z-10 font-sans tracking-wide">
                  {item.title}
                </h3>

                {/* Sincere Compliment Description */}
                <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed relative z-10">
                  {item.description}
                </p>
              </div>

              {/* Glowing decorative corner spot */}
              <div
                className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full filter blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: item.glow }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
