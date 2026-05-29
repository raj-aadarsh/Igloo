import { motion } from 'framer-motion';
import { Linkedin, Github, Sparkles, Hand, Trophy, Map, Snowflake } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

function IglooBackdrop() {
  // A soft, decorative igloo + aurora scene that sits behind the hero.
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] dark:opacity-25" aria-hidden>
      <defs>
        <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#76c8dd" />
          <stop offset="0.5" stopColor="#1f88a8" />
          <stop offset="1" stopColor="#f98a07" />
        </linearGradient>
      </defs>
      {/* aurora ribbons */}
      <path d="M0 60 Q100 20 200 55 T400 45" fill="none" stroke="url(#aurora)" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 90 Q120 50 220 85 T400 75" fill="none" stroke="url(#aurora)" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {/* snow ground */}
      <path d="M0 165 Q200 140 400 165 L400 200 L0 200 Z" fill="currentColor" className="text-brand-200 dark:text-brand-900" />
      {/* igloo */}
      <g className="text-surface" transform="translate(168 120)">
        <path d="M0 45 A32 32 0 0 1 64 45 Z" fill="currentColor" stroke="rgb(var(--border))" strokeWidth="1.5" />
        <path d="M22 45 V28 a10 10 0 0 1 20 0 V45 Z" fill="rgb(var(--brand-glow))" opacity="0.5" />
        <path d="M6 33 q26 -16 52 0" fill="none" stroke="rgb(var(--border))" strokeWidth="1" />
        <line x1="4" y1="42" x2="60" y2="42" stroke="rgb(var(--border))" strokeWidth="1" />
      </g>
    </svg>
  );
}

const highlights = [
  { icon: Sparkles, title: 'Whole-picture courses', text: 'Concepts, history, and the modern stack — structured so it all connects.' },
  { icon: Hand, title: 'Learn by playing', text: 'Interactive widgets you can poke, drag, and break to build real intuition.' },
  { icon: Trophy, title: 'Pressure-free testing', text: 'Quizzes and a final exam with unlimited attempts and instant explanations.' },
  { icon: Map, title: 'A living reference', text: 'A browsable atlas that turns a wall of jargon into something you can explore.' },
];

export function AboutPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent-500/10 p-8 sm:p-12">
        <IglooBackdrop />
        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <Logo className="h-12 w-12 rounded-2xl shadow-soft" />
            <span className="chip"><Snowflake size={13} className="text-brand-500" /> About Igloo</span>
          </div>
          <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            A cozy place where cold, hard topics get warm and clear.
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Igloo is an interactive learning platform built on a simple belief: the hardest subjects become approachable when you can <strong className="text-text">see them, play with them, and test yourself</strong> without fear of getting it wrong. Each course is a guided path of bite-sized lessons, hands-on visuals, and friendly quizzes — paired with a browsable reference you can always come back to.
          </p>
          <p className="mt-3 max-w-2xl text-muted">
            The first course is a complete map of <strong className="text-text">AI</strong>. More courses, on all kinds of topics, will make their home here over time.
          </p>
        </div>
      </motion.section>

      {/* Highlights */}
      <section className="grid gap-3 sm:grid-cols-2">
        {highlights.map((h) => (
          <div key={h.title} className="card flex gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <h.icon size={22} />
            </div>
            <div>
              <h3 className="font-bold">{h.title}</h3>
              <p className="mt-0.5 text-sm text-muted">{h.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Developer */}
      <section>
        <h2 className="mb-4 text-xl font-bold">The person behind it</h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent-500/10 via-surface to-brand-500/10 p-7 sm:p-9"
        >
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-accent-400/15 blur-3xl" />
          <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-black text-white shadow-glow">
              AR
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black tracking-tight">Aadarsh Raj</h3>
              <p className="mt-0.5 text-sm font-semibold text-brand-600 dark:text-brand-300">Software Engineer &amp; creator of Igloo</p>
              <p className="mx-auto mt-3 max-w-lg text-sm text-muted sm:mx-0">
                Igloo started from a simple frustration: wanting one calm, well-structured place to truly understand a fast-moving field — instead of scattered tabs and jargon. So I built it. If it helped you, I’d love to connect.
              </p>
              <div className="mt-5 flex justify-center gap-3 sm:justify-start">
                <a
                  href="https://www.linkedin.com/in/aadarsh-raj/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:gap-3 hover:bg-brand-500"
                >
                  <Linkedin size={17} /> LinkedIn
                </a>
                <a
                  href="https://github.com/raj-aadarsh"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-all hover:gap-3 hover:border-brand-400"
                >
                  <Github size={17} /> GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <p className="pb-2 text-center text-xs text-muted">Made with care, and a little bit of snow. ❄️</p>
    </div>
  );
}
