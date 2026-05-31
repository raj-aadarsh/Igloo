import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, Check, X, AlertTriangle, Database, Table2, PartyPopper, Trophy } from 'lucide-react';
import { SqlEditor } from '@/components/code/SqlEditor';
import { Button, Pill } from '@/components/ui/primitives';
import { readJSON, writeJSON } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { runSql, gradeQuery, type QueryResult } from './sql/runner';

interface Challenge {
  id: string;
  prompt: string;
  hint: string;
  expected: string; // reference query — graded against the learner's result
  ordered?: boolean; // when row order matters (ORDER BY tasks)
  covers: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    prompt: 'Select every column of every employee.',
    hint: 'SELECT * FROM employees;',
    expected: 'SELECT * FROM employees;',
    covers: 'SELECT *',
  },
  {
    id: 'c2',
    prompt: 'List the name and salary of employees based in Bengaluru.',
    hint: "Filter with WHERE city = 'Bengaluru'.",
    expected: "SELECT name, salary FROM employees WHERE city = 'Bengaluru';",
    covers: 'WHERE',
  },
  {
    id: 'c3',
    prompt: 'Show every distinct city, no duplicates.',
    hint: 'SELECT DISTINCT city ...',
    expected: 'SELECT DISTINCT city FROM employees;',
    covers: 'DISTINCT',
  },
  {
    id: 'c4',
    prompt: 'List all employee names ordered by salary, highest first.',
    hint: 'ORDER BY salary DESC. (Order matters here!)',
    expected: 'SELECT name FROM employees ORDER BY salary DESC;',
    ordered: true,
    covers: 'ORDER BY',
  },
  {
    id: 'c5',
    prompt: 'Find employees whose age is between 30 and 40 (inclusive).',
    hint: 'WHERE age BETWEEN 30 AND 40.',
    expected: 'SELECT name, age FROM employees WHERE age BETWEEN 30 AND 40;',
    covers: 'BETWEEN',
  },
  {
    id: 'c6',
    prompt: 'Count how many employees are in each department (use dept_id).',
    hint: 'GROUP BY dept_id with COUNT(*).',
    expected: 'SELECT dept_id, COUNT(*) FROM employees GROUP BY dept_id;',
    covers: 'GROUP BY + COUNT',
  },
  {
    id: 'c7',
    prompt: 'Show each department id whose AVERAGE salary is above 1,300,000.',
    hint: 'GROUP BY dept_id, then filter the groups with HAVING AVG(salary) > 1300000.',
    expected: 'SELECT dept_id, AVG(salary) FROM employees GROUP BY dept_id HAVING AVG(salary) > 1300000;',
    covers: 'HAVING',
  },
  {
    id: 'c8',
    prompt: 'List each employee’s name alongside their department NAME (not id).',
    hint: 'JOIN employees with departments ON employees.dept_id = departments.id.',
    expected: 'SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id;',
    covers: 'INNER JOIN',
  },
  {
    id: 'c9',
    prompt: 'Find employees whose name starts with "A".',
    hint: "WHERE name LIKE 'A%'.",
    expected: "SELECT name FROM employees WHERE name LIKE 'A%';",
    covers: 'LIKE',
  },
];

function ResultTable({ result }: { result: QueryResult }) {
  if (result.rows.length === 0) {
    return <p className="px-3 py-2 text-sm text-muted">Query ran — 0 rows returned.</p>;
  }
  return (
    <div className="max-h-72 overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-surface-2">
          <tr>
            {result.columns.map((c, i) => (
              <th key={i} className="border-b border-border px-3 py-1.5 text-left font-semibold text-text">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, ri) => (
            <tr key={ri} className="odd:bg-surface even:bg-surface-2/40">
              {row.map((cell, ci) => (
                <td key={ci} className="border-b border-border/60 px-3 py-1.5 font-mono text-xs">
                  {cell === null ? <span className="text-muted italic">NULL</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SchemaCard() {
  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-sm">
      <div className="mb-2 flex items-center gap-1.5 font-semibold"><Database size={15} className="text-brand-500" /> Sample database</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold"><Table2 size={13} className="text-accent-500" /> employees</div>
          <div className="mt-1 font-mono text-[11px] text-muted">id, name, dept_id, city, age, salary</div>
          <div className="mt-1 text-[11px] text-muted">10 rows · dept_id → departments.id</div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold"><Table2 size={13} className="text-accent-500" /> departments</div>
          <div className="mt-1 font-mono text-[11px] text-muted">id, name</div>
          <div className="mt-1 text-[11px] text-muted">4 rows (Engineering, Design, Sales, Marketing)</div>
        </div>
      </div>
    </div>
  );
}

export function SqlPlayground() {
  const [tab, setTab] = useState<'challenges' | 'free'>('challenges');
  const [activeId, setActiveId] = useState(CHALLENGES[0].id);
  const active = useMemo(() => CHALLENGES.find((c) => c.id === activeId)!, [activeId]);

  const [solved, setSolved] = useState<Record<string, true>>(() => readJSON('dbms-sql-solved', {}));
  const [sqlByChallenge, setSqlByChallenge] = useState<Record<string, string>>({});
  const [freeSql, setFreeSql] = useState('SELECT name, city, salary\nFROM employees\nORDER BY salary DESC;');

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [justSolved, setJustSolved] = useState(false);

  const code = tab === 'free' ? freeSql : (sqlByChallenge[activeId] ?? '');
  const solvedCount = Object.keys(solved).length;
  const allDone = solvedCount === CHALLENGES.length;

  // Reset transient output when switching challenge/tab.
  useEffect(() => { setResult(null); setError(null); setVerdict(null); setShowHint(false); }, [activeId, tab]);

  const setCode = (v: string) => {
    if (tab === 'free') setFreeSql(v);
    else setSqlByChallenge((m) => ({ ...m, [activeId]: v }));
  };

  const handleRun = async () => {
    setRunning(true); setResult(null); setError(null); setVerdict(null);
    try {
      if (tab === 'free') {
        const out = await runSql(code);
        if (out.error) setError(out.error);
        else setResult(out.results[out.results.length - 1] ?? { columns: [], rows: [] });
        return;
      }
      const graded = await gradeQuery(code, active.expected, active.ordered ?? false);
      if (graded.error) { setError(graded.error); return; }
      if (graded.user) setResult(graded.user);
      setVerdict(graded.correct ? 'correct' : 'wrong');
      if (graded.correct && !solved[active.id]) {
        const next = { ...solved, [active.id]: true as const };
        setSolved(next);
        writeJSON('dbms-sql-solved', next);
        setJustSolved(true);
        setTimeout(() => setJustSolved(false), 3500);
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      {/* Tabs */}
      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => setTab('challenges')} className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold', tab === 'challenges' ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2')}>
          Challenges
        </button>
        <button onClick={() => setTab('free')} className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold', tab === 'free' ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2')}>
          Free SQL
        </button>
        {tab === 'challenges' && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
            {allDone ? <Trophy size={14} className="text-accent-500" /> : null}
            {solvedCount}/{CHALLENGES.length} solved
          </span>
        )}
      </div>

      <SchemaCard />

      {tab === 'challenges' && (
        <>
          {/* Challenge chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CHALLENGES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                  c.id === activeId ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2',
                )}
              >
                {solved[c.id] ? <Check size={12} className="text-emerald-500" /> : <span className="text-muted">{i + 1}.</span>}
                {c.covers}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-border bg-surface-2/40 p-3">
            <div className="text-sm"><strong className="text-brand-700 dark:text-brand-300">Task:</strong> {active.prompt}</div>
            {showHint ? (
              <div className="mt-1.5 font-mono text-xs text-muted">💡 {active.hint}</div>
            ) : (
              <button onClick={() => setShowHint(true)} className="mt-1.5 text-xs font-semibold text-accent-600 hover:text-accent-500 dark:text-accent-400">Show hint →</button>
            )}
          </div>
        </>
      )}

      {/* Editor */}
      <div className="mt-3">
        <SqlEditor value={code} onChange={setCode} onRun={handleRun} minHeight={tab === 'free' ? 160 : 120} />
        <p className="mt-1 text-[11px] text-muted">Tip: press ⌘/Ctrl + Enter to run.</p>
      </div>

      {/* Run bar */}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button onClick={handleRun} disabled={running}>
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          {running ? 'Running…' : 'Run query'}
        </Button>
        {verdict === 'correct' && <Pill tone="green"><Check size={12} /> Correct</Pill>}
        {verdict === 'wrong' && <Pill tone="rose"><X size={12} /> Not quite — compare the rows</Pill>}
      </div>

      {/* Celebration */}
      <AnimatePresence>
        {justSolved && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-400 bg-emerald-50 p-3 dark:border-emerald-700 dark:bg-emerald-900/25">
            <PartyPopper className="text-emerald-500" size={18} />
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {allDone ? 'All challenges solved — you’ve got SQL down! 🏆' : 'Correct! On to the next one. 🎉'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 p-3 dark:border-rose-800 dark:bg-rose-900/20">
          <div className="mb-1 flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300"><AlertTriangle size={15} /> SQL error</div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-rose-800 dark:text-rose-200">{error}</pre>
        </div>
      )}

      {/* Result */}
      {result && !error && (
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <ResultTable result={result} />
        </div>
      )}
    </div>
  );
}
