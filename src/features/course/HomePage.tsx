import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Sparkles, Hand, Wand2, Linkedin, Github } from 'lucide-react';
import { courses } from '@/content/courses';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

// Per-accent styling so each featured course can have its own colour while
// sharing the same classy "standout" treatment.
const accentMap: Record<string, { grad: string; border: string; ring: string; tile: string; eyebrow: string; btn: string; blob: string }> = {
  brand: { grad: 'from-brand-500/15 via-surface to-accent-500/10', border: 'border-brand-400/40', ring: 'ring-brand-500/15', tile: 'bg-brand-500/15 text-brand-600 ring-brand-500/20 dark:text-brand-300', eyebrow: 'text-brand-600 dark:text-brand-300', btn: 'bg-brand-600 group-hover:bg-brand-500', blob: 'bg-brand-400/20' },
  emerald: { grad: 'from-emerald-500/15 via-surface to-brand-500/10', border: 'border-emerald-400/40', ring: 'ring-emerald-500/15', tile: 'bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300', eyebrow: 'text-emerald-600 dark:text-emerald-300', btn: 'bg-emerald-600 group-hover:bg-emerald-500', blob: 'bg-emerald-400/20' },
  accent: { grad: 'from-accent-500/15 via-surface to-rose-500/10', border: 'border-accent-400/40', ring: 'ring-accent-500/15', tile: 'bg-accent-500/15 text-accent-600 ring-accent-500/20 dark:text-accent-300', eyebrow: 'text-accent-600 dark:text-accent-300', btn: 'bg-accent-600 group-hover:bg-accent-500', blob: 'bg-accent-400/20' },
  violet: { grad: 'from-violet-500/15 via-surface to-brand-500/10', border: 'border-violet-400/40', ring: 'ring-violet-500/15', tile: 'bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300', eyebrow: 'text-violet-600 dark:text-violet-300', btn: 'bg-violet-600 group-hover:bg-violet-500', blob: 'bg-violet-400/20' },
  rose: { grad: 'from-rose-500/15 via-surface to-accent-500/10', border: 'border-rose-400/40', ring: 'ring-rose-500/15', tile: 'bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300', eyebrow: 'text-rose-600 dark:text-rose-300', btn: 'bg-rose-600 group-hover:bg-rose-500', blob: 'bg-rose-400/20' },
};

export function HomePage() {
  const available = courses.filter((c) => c.status === 'available');
  const upcoming = courses.filter((c) => c.status !== 'available');

  return (
    <div className="space-y-12">
      {/* Platform hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent-500/10 p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-12 rounded-2xl shadow-soft" />
          <span className="chip"><Sparkles size={13} className="text-accent-500" /> Cozy, interactive learning</span>
        </div>
        <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Welcome to <span className="text-brand-600 dark:text-brand-300">Igloo</span> — your warm little place to learn hard things.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Hands-on courses with playable demos and pressure-free practice, designed so a tricky topic actually feels fun to learn.
        </p>
      </motion.section>

      {/* Course catalog */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Courses</h2>
          <span className="text-xs text-muted">{available.length} available</span>
        </div>

        <div className="space-y-4">
          {available.map((c, i) => {
            const a = accentMap[c.accent] ?? accentMap.brand;
            return (
              <Link key={c.id} to={c.overviewPath ?? '/'} className="group block">
                <motion.div
                  whileHover={{ y: -3 }}
                  className={`relative overflow-hidden rounded-3xl border ${a.border} bg-gradient-to-br ${a.grad} p-6 shadow-soft ring-1 ${a.ring} transition-shadow group-hover:shadow-glow sm:p-7`}
                >
                  <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ${a.blob} blur-3xl`} />
                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 ${a.tile}`}>
                      <Icon name={c.icon} size={30} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${a.eyebrow}`}>Course {String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">{c.title}</h3>
                      <p className="mt-1 text-sm text-muted">{c.tagline}</p>
                    </div>
                    <div className="shrink-0 self-end sm:self-center">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-soft transition-all group-hover:translate-x-1 ${a.btn}`}>
                        <ArrowRight size={20} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}

          {/* Upcoming — quiet, minimal */}
          {upcoming.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-3xl border border-dashed border-border bg-surface/40 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-muted">
                <Icon name={c.icon} size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-muted">{c.title}</h3>
              </div>
              <span className="chip">Coming soon</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Igloo */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: Trophy, label: 'Pressure-free', sub: 'Unlimited tries' },
          { icon: Hand, label: 'Learn by doing', sub: 'Play & code' },
          { icon: Wand2, label: 'Clean & cozy', sub: 'A joy to use' },
        ].map((f) => (
          <div key={f.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
            <f.icon className="mx-auto text-brand-500" size={22} />
            <div className="mt-2 text-sm font-bold">{f.label}</div>
            <div className="text-xs text-muted">{f.sub}</div>
          </div>
        ))}
      </section>

      {/* Developer credit */}
      <footer className="flex flex-col items-center gap-3 border-t border-border pt-8 text-center">
        <p className="text-sm text-muted">
          Designed &amp; developed by <Link to="/about" className="font-semibold text-text hover:text-brand-600 dark:hover:text-brand-300">Aadarsh Raj</Link>
        </p>
        <div className="flex items-center gap-3">
          <a href="https://www.linkedin.com/in/aadarsh-raj/" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300" aria-label="LinkedIn">
            <Linkedin size={17} />
          </a>
          <a href="https://github.com/raj-aadarsh" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300" aria-label="GitHub">
            <Github size={17} />
          </a>
        </div>
      </footer>
    </div>
  );
}
