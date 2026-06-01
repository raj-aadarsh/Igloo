import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

type Cat = 'About you' | 'Motivation' | 'Behavioral' | 'Closing';

interface Q { cat: Cat; q: string; really: string; tip: string; }

const QS: Q[] = [
  { cat: 'About you', q: '"Tell me about yourself."', really: 'A 60–90s professional summary — not your life story.', tip: 'Present → Past → Future: what you do now, relevant background, why this role is the next step. Rehearse it.' },
  { cat: 'About you', q: '"What’s your greatest strength?"', really: 'Can you back a strength with evidence relevant to the job?', tip: 'Pick one role-relevant strength + a quick example proving it. Avoid generic "hard worker".' },
  { cat: 'About you', q: '"What’s your greatest weakness?"', really: 'Are you self-aware and improving — not hiding?', tip: 'Name a real (non-critical) weakness + the concrete steps you’re taking to improve. Never "I’m a perfectionist".' },
  { cat: 'Motivation', q: '"Why do you want to work here?"', really: 'Have you researched us, and do you actually care?', tip: 'Reference something specific about the company (product, mission, tech) + how it fits your goals. Generic answers kill it.' },
  { cat: 'Motivation', q: '"Why should we hire you?"', really: 'Can you match your skills to their needs?', tip: 'Map 2–3 of your strengths directly to the role’s requirements, with brief proof.' },
  { cat: 'Motivation', q: '"Where do you see yourself in 5 years?"', really: 'Are you ambitious but likely to stay & grow here?', tip: 'Show growth aligned with the role/company — focus on skills & impact, not job titles.' },
  { cat: 'Behavioral', q: '"Tell me about a time you faced a conflict."', really: 'How do you handle disagreement & work with people?', tip: 'Use STAR. Show empathy, communication, and a constructive resolution — not "I was right".' },
  { cat: 'Behavioral', q: '"Tell me about a failure."', really: 'Can you own mistakes and learn from them?', tip: 'Pick a real failure, take responsibility, and emphasise what you learned & changed. STAR.' },
  { cat: 'Behavioral', q: '"A time you showed leadership / took initiative."', really: 'Do you step up beyond what’s asked?', tip: 'Leadership ≠ a title. Show you drove an outcome. STAR, heavy on YOUR Action + the Result.' },
  { cat: 'Closing', q: '"Do you have any questions for us?"', really: 'Are you genuinely engaged & evaluating fit?', tip: 'ALWAYS have 2–3 thoughtful questions ready. "No questions" signals disinterest. (See the next module.)' },
  { cat: 'Closing', q: '"What are your salary expectations?"', really: 'Are your expectations realistic & researched?', tip: 'Research a market range first; give a range, or deflect early-stage ("open, depending on the full package").' },
];

const CATS: Cat[] = ['About you', 'Motivation', 'Behavioral', 'Closing'];

export function QuestionBank() {
  const [cat, setCat] = useState<Cat>('About you');
  const [open, setOpen] = useState<string | null>(null);
  const list = QS.filter((q) => q.cat === cat);

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">The question bank — tap a question to see what they’re really asking</div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {CATS.map((c) => (
          <button key={c} onClick={() => { setCat(c); setOpen(null); }} className={cn('rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors', c === cat ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>{c}</button>
        ))}
      </div>

      <div className="space-y-1.5">
        {list.map((item) => (
          <div key={item.q} className="rounded-xl border border-border">
            <button onClick={() => setOpen(open === item.q ? null : item.q)} className={cn('flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold', open === item.q && 'text-brand-700 dark:text-brand-300')}>
              {item.q}
              <span className="text-xs text-muted">{open === item.q ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {open === item.q && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="space-y-1 px-3 pb-3 text-xs">
                    <p><span className="font-semibold text-text">What they’re really asking:</span> <span className="text-muted">{item.really}</span></p>
                    <p><span className="font-semibold text-emerald-600 dark:text-emerald-400">How to answer:</span> <span className="text-muted">{item.tip}</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
