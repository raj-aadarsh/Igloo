import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, AlertTriangle, Rocket, Puzzle, Wind } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Comp { id: string; name: string; icon: typeof Crown; prompts: string[]; show: string; }

const COMPS: Comp[] = [
  { id: 'lead', name: 'Leadership', icon: Crown, prompts: ['"A time you led a team / project."', '"A time you influenced others without authority."'], show: 'You drove an outcome and brought people with you — even without a "lead" title.' },
  { id: 'team', name: 'Teamwork & Conflict', icon: Users, prompts: ['"A disagreement with a teammate."', '"A difficult person you worked with."'], show: 'Empathy, communication, and a constructive resolution — not "I won".' },
  { id: 'fail', name: 'Failure & Mistakes', icon: AlertTriangle, prompts: ['"A time you failed."', '"A mistake you made and how you handled it."'], show: 'Ownership + what you learned and changed afterwards. Honesty over a polished win.' },
  { id: 'init', name: 'Initiative & Ownership', icon: Rocket, prompts: ['"A time you went beyond your role."', '"Something you improved on your own."'], show: 'You spotted a problem and acted without being told — and owned it end-to-end.' },
  { id: 'solve', name: 'Problem-solving', icon: Puzzle, prompts: ['"The hardest technical problem you solved."', '"A time you were stuck — what did you do?"'], show: 'A structured approach: how you broke it down, options you weighed, the result.' },
  { id: 'ambig', name: 'Pressure & Ambiguity', icon: Wind, prompts: ['"A tight deadline / high-pressure moment."', '"Unclear requirements — how did you proceed?"'], show: 'You stayed calm, prioritised, and made progress despite incomplete information.' },
];

export function CompetencyMatrix() {
  const [active, setActive] = useState('lead');
  const c = COMPS.find((x) => x.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Your story bank — the competencies interviewers probe. Tap one</div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {COMPS.map((comp) => (
          <button key={comp.id} onClick={() => setActive(comp.id)}
            className={cn('flex items-center gap-2 rounded-xl border p-2 text-left transition-colors', comp.id === active ? 'border-brand-400 bg-brand-500/10' : 'border-border hover:bg-surface-2')}>
            <comp.icon size={16} className={comp.id === active ? 'text-brand-600 dark:text-brand-300' : 'text-muted'} />
            <span className="text-[11px] font-bold leading-tight">{comp.name}</span>
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
        <div className="mb-1 flex items-center gap-2 font-semibold"><c.icon size={16} className="text-brand-500" /> {c.name}</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Questions this covers</div>
        <ul className="mt-0.5 list-disc pl-5 text-sm text-muted">{c.prompts.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="mt-2 text-sm"><span className="font-semibold text-emerald-600 dark:text-emerald-400">What to show:</span> <span className="text-muted">{c.show}</span></p>
      </motion.div>

      <p className="mt-3 text-xs text-muted">
        Prep tip: you don’t need a story per question — you need <strong>~5–6 strong stories</strong> that each cover several competencies. One great project story might show leadership <em>and</em> problem-solving <em>and</em> pressure. Map your stories to this grid and you’re ready for almost anything.
      </p>
    </div>
  );
}
