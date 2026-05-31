import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Tbl { name: string; cols: string[]; rows: string[][]; }
interface Step { label: string; note: string; tables: Tbl[]; }

const steps: Step[] = [
  {
    label: 'Unnormalized',
    note: 'One messy table. “Courses” holds multiple values in a single cell, and dept info repeats. Lots of redundancy.',
    tables: [{
      name: 'Student',
      cols: ['StudentID', 'Name', 'Courses', 'Dept', 'DeptHead'],
      rows: [['1', 'Aarav', 'Math, Physics', 'Science', 'Dr. Rao'], ['2', 'Diya', 'History', 'Arts', 'Dr. Sen']],
    }],
  },
  {
    label: '1NF',
    note: 'Make every cell atomic — no multi-valued fields. The multi-valued “Courses” is split into separate rows. Key is now (StudentID, Course).',
    tables: [{
      name: 'Student',
      cols: ['StudentID', 'Name', 'Course', 'Dept', 'DeptHead'],
      rows: [['1', 'Aarav', 'Math', 'Science', 'Dr. Rao'], ['1', 'Aarav', 'Physics', 'Science', 'Dr. Rao'], ['2', 'Diya', 'History', 'Arts', 'Dr. Sen']],
    }],
  },
  {
    label: '2NF',
    note: 'Remove partial dependencies. Name/Dept depend only on StudentID (part of the key), not the whole key — so split them out from the (StudentID, Course) table.',
    tables: [
      { name: 'Student', cols: ['StudentID', 'Name', 'Dept', 'DeptHead'], rows: [['1', 'Aarav', 'Science', 'Dr. Rao'], ['2', 'Diya', 'Arts', 'Dr. Sen']] },
      { name: 'Enrollment', cols: ['StudentID', 'Course'], rows: [['1', 'Math'], ['1', 'Physics'], ['2', 'History']] },
    ],
  },
  {
    label: '3NF',
    note: 'Remove transitive dependencies. DeptHead depends on Dept (a non-key attribute), not directly on StudentID — so move Dept→DeptHead into its own table.',
    tables: [
      { name: 'Student', cols: ['StudentID', 'Name', 'Dept'], rows: [['1', 'Aarav', 'Science'], ['2', 'Diya', 'Arts']] },
      { name: 'Department', cols: ['Dept', 'DeptHead'], rows: [['Science', 'Dr. Rao'], ['Arts', 'Dr. Sen']] },
      { name: 'Enrollment', cols: ['StudentID', 'Course'], rows: [['1', 'Math'], ['1', 'Physics'], ['2', 'History']] },
    ],
  },
];

function Table({ t }: { t: Tbl }) {
  return (
    <div>
      <div className="mb-1 text-xs font-bold text-brand-600 dark:text-brand-300">{t.name}</div>
      <table className="border-collapse text-xs">
        <thead><tr>{t.cols.map((c) => <th key={c} className="border border-border bg-surface px-2 py-1 font-mono">{c}</th>)}</tr></thead>
        <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border border-border px-2 py-1 font-mono">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function NormalizationSteps() {
  const [i, setI] = useState(0);
  const s = steps[i];
  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-3 flex gap-1.5">
        {steps.map((st, idx) => (
          <button key={st.label} onClick={() => setI(idx)} className={cn('rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors', i === idx ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted')}>{st.label}</button>
        ))}
      </div>
      <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start gap-4 overflow-x-auto">
          {s.tables.map((t) => <Table key={t.name} t={t} />)}
        </div>
        <p className="mt-3 text-sm text-muted">{s.note}</p>
      </motion.div>
      <p className="mt-2 text-xs text-muted">Each step removes a type of redundancy: <strong className="text-text">1NF</strong> atomic cells → <strong className="text-text">2NF</strong> no partial deps → <strong className="text-text">3NF</strong> no transitive deps. (BCNF tightens 3NF: every determinant must be a super key.)</p>
    </div>
  );
}
