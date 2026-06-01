import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

const STAR = [
  { k: 'S', label: 'Situation', tone: 'text-brand-600 dark:text-brand-300', text: 'Set the scene briefly: "During my final-year project, our team of four was building an app and we were two weeks from the deadline."' },
  { k: 'T', label: 'Task', tone: 'text-accent-600 dark:text-accent-300', text: 'Your specific responsibility: "As the lead, I had to get us back on track after a key module broke."' },
  { k: 'A', label: 'Action', tone: 'text-emerald-600 dark:text-emerald-400', text: 'What YOU did, step by step (the longest part): "I split the work by strength, set up daily 10-min standups, and pair-programmed the broken module myself."' },
  { k: 'R', label: 'Result', tone: 'text-rose-600 dark:text-rose-400', text: 'The outcome, quantified if possible: "We shipped on time and scored the highest grade in our batch — and I learned to delegate by strength."' },
];

export function StarBuilder() {
  const [star, setStar] = useState(true);

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">The STAR method — structure any "tell me about a time…" answer</div>

      <div className="mb-3 rounded-xl border border-border bg-surface-2/40 p-3 text-sm">
        <span className="font-semibold">Q:</span> "Tell me about a time you led a team through a difficult situation."
      </div>

      <div className="mb-3 flex gap-2">
        <button onClick={() => setStar(false)} className={cn('inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold', !star ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'text-muted hover:bg-surface-2')}>
          <X size={14} /> Rambling answer
        </button>
        <button onClick={() => setStar(true)} className={cn('inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold', star ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'text-muted hover:bg-surface-2')}>
          <Check size={14} /> STAR answer
        </button>
      </div>

      {star ? (
        <motion.div key="star" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {STAR.map((s) => (
            <div key={s.k} className="flex gap-3 rounded-xl border border-border bg-surface-2/40 p-3">
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-lg font-black', s.tone)}>{s.k}</div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted">{s.label}</div>
                <p className="text-sm">{s.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div key="ramble" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-100">
          "Uh, yeah, so there was this project and it was kind of stressful and we were all busy and something broke I think, and we sort of figured it out eventually and it worked out okay I guess…"
          <div className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-300">✗ No structure, no specifics, no "I", no result. The interviewer learns nothing about you.</div>
        </motion.div>
      )}

      <p className="mt-3 text-xs text-muted">
        <strong>STAR</strong> = Situation · Task · Action · Result. Spend most time on <strong>Action</strong> (what <em>you</em> did — say "I", not "we"), and always land a concrete <strong>Result</strong>. It turns a vague story into evidence of your skills.
      </p>
    </div>
  );
}
