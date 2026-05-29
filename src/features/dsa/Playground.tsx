import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Check, X, Clock, Lightbulb, Eye, Loader2, PartyPopper } from 'lucide-react';
import type { Problem } from '@/content/course-dsa/types';
import { CodeEditor } from '@/components/code/CodeEditor';
import { LessonRenderer } from '@/features/course/LessonRenderer';
import { Button, Pill } from '@/components/ui/primitives';
import { usePyodideRunner } from './runner/usePyodideRunner';
import type { TestOutcome } from './runner/runner';
import { useProgress } from '@/features/progress/ProgressProvider';
import { readJSON, writeJSON } from '@/lib/storage';
import { cn } from '@/lib/cn';

export function Playground({ problem }: { problem: Problem }) {
  const codeKey = `dsa-code:${problem.id}`;
  const { status, run } = usePyodideRunner();
  const { isProblemSolved, markProblemSolved } = useProgress();
  const solved = isProblemSolved(problem.id);

  const [code, setCode] = useState<string>(() => readJSON<string>(codeKey, problem.starterCode));
  const [results, setResults] = useState<TestOutcome[] | null>(null);
  const [running, setRunning] = useState(false);
  const [revealHints, setRevealHints] = useState(0);
  const [showSolutions, setShowSolutions] = useState(false);
  const [justSolved, setJustSolved] = useState(false);

  const setAndPersistCode = (v: string) => {
    setCode(v);
    writeJSON(codeKey, v);
  };

  const passedCount = useMemo(() => results?.filter((r) => r.passed).length ?? 0, [results]);
  const allPassed = results != null && results.length > 0 && passedCount === results.length;

  const handleRun = async () => {
    setRunning(true);
    setResults(null);
    try {
      const out = await run(code, problem.tests);
      setResults(out);
      if (out.length > 0 && out.every((r) => r.passed)) {
        if (!solved) {
          markProblemSolved(problem.id);
          setJustSolved(true);
          setTimeout(() => setJustSolved(false), 4000);
        }
      }
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => setAndPersistCode(problem.starterCode);

  const busy = running || status === 'loading';

  return (
    <div className="space-y-4">
      {/* Editor */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Your solution — Python</span>
          <button onClick={resetCode} className="inline-flex items-center gap-1 text-xs text-muted hover:text-text">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        <CodeEditor value={code} onChange={setAndPersistCode} minHeight={260} />
      </div>

      {/* Run bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleRun} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          {status === 'loading' && running ? 'Warming up the engine…' : running ? 'Running…' : 'Run & check'}
        </Button>
        {results && (
          <span className={cn('text-sm font-semibold', allPassed ? 'text-emerald-500' : 'text-muted')}>
            {passedCount}/{results.length} tests passed
          </span>
        )}
        {solved && !justSolved && <Pill tone="green"><Check size={12} /> Solved</Pill>}
      </div>
      {status === 'loading' && (
        <p className="text-xs text-muted">First run loads the Python engine locally (a few seconds, once). After that it’s instant and works offline.</p>
      )}

      {/* Celebration */}
      <AnimatePresence>
        {justSolved && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-emerald-400 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-900/25"
          >
            <PartyPopper className="text-emerald-500" />
            <div>
              <div className="font-bold text-emerald-700 dark:text-emerald-300">Solved! All tests passed 🎉</div>
              <div className="text-sm text-muted">Now check the optimal approach below — even if you already nailed it.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {results && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div
              key={i}
              className={cn(
                'rounded-xl border p-3 text-sm',
                r.passed ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/15' : 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/15',
              )}
            >
              <div className="flex items-center gap-2 font-semibold">
                {r.passed ? <Check size={15} className="text-emerald-500" /> : r.timedOut ? <Clock size={15} className="text-rose-500" /> : <X size={15} className="text-rose-500" />}
                Test {i + 1} {r.hidden && <span className="text-xs font-normal text-muted">(hidden)</span>}
                <span className={cn('ml-auto text-xs', r.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                  {r.passed ? 'Passed' : r.timedOut ? 'Time limit exceeded' : r.error ? 'Runtime error' : 'Wrong answer'}
                </span>
              </div>
              {!r.passed && !r.hidden && (
                <div className="mt-2 grid gap-2 font-mono text-xs sm:grid-cols-3">
                  <Field label="Input" value={r.stdin || '(empty)'} />
                  <Field label="Expected" value={r.expected} tone="ok" />
                  <Field label="Your output" value={r.error ? '—' : r.got || '(no output)'} tone="bad" />
                </div>
              )}
              {r.error && !r.hidden && (
                <pre className="mt-2 overflow-x-auto rounded-lg bg-rose-100 p-2 text-xs text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">{r.error.trim().split('\n').slice(-4).join('\n')}</pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hints */}
      {problem.hints.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-2/50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold"><Lightbulb size={16} className="text-accent-500" /> Stuck? Reveal hints one at a time</div>
          <div className="mt-2 space-y-1.5">
            {problem.hints.slice(0, revealHints).map((h, i) => (
              <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted">
                <strong className="text-text">Hint {i + 1}:</strong> {h}
              </motion.p>
            ))}
          </div>
          {revealHints < problem.hints.length && (
            <button onClick={() => setRevealHints((n) => n + 1)} className="mt-2 text-sm font-semibold text-accent-600 hover:text-accent-500 dark:text-accent-400">
              Show {revealHints === 0 ? 'a hint' : 'next hint'} →
            </button>
          )}
        </div>
      )}

      {/* Solutions */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        {!showSolutions ? (
          <button
            onClick={() => {
              if (solved || confirm('Reveal the worked solutions? Try solving it yourself first for the most learning.')) setShowSolutions(true);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-300"
          >
            <Eye size={16} /> {solved ? 'Show the optimal approach' : 'Reveal solutions'}
          </button>
        ) : (
          <div className="space-y-6">
            {problem.solutions.map((s, i) => (
              <div key={i}>
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="text-base font-bold">{s.label}</h4>
                  <Pill tone={i === problem.solutions.length - 1 ? 'green' : 'default'}>{s.bigO}</Pill>
                </div>
                <CodeEditor value={s.code} readOnly minHeight={0} />
                <div className="mt-2"><LessonRenderer blocks={s.explanation} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'bad' }) {
  return (
    <div>
      <div className="mb-0.5 text-[10px] uppercase tracking-wide text-muted">{label}</div>
      <pre className={cn('overflow-x-auto whitespace-pre-wrap rounded-lg bg-surface p-2', tone === 'ok' && 'text-emerald-700 dark:text-emerald-300', tone === 'bad' && 'text-rose-700 dark:text-rose-300')}>{value}</pre>
    </div>
  );
}
