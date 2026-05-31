import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Tbl { name: string; cols: string[]; rows: string[][]; }

const STUDENT: Tbl = { name: 'Student', cols: ['sid', 'name', 'dept'], rows: [['1', 'Aarav', 'CS'], ['2', 'Diya', 'EE'], ['3', 'Kabir', 'CS']] };
const ENROLL: Tbl = { name: 'Enroll', cols: ['sid', 'course'], rows: [['1', 'DBMS'], ['1', 'OS'], ['3', 'CN']] };
const A: Tbl = { name: 'A', cols: ['x'], rows: [['1'], ['2'], ['3']] };
const B: Tbl = { name: 'B', cols: ['x'], rows: [['2'], ['3'], ['4']] };

interface Op { key: string; expr: string; desc: string; sources: Tbl[]; result: Tbl; }

const ops: Op[] = [
  { key: 'Selection σ', expr: "σ dept='CS' (Student)", desc: 'Selection (σ) keeps the ROWS that match a condition.', sources: [STUDENT], result: { name: 'Result', cols: ['sid', 'name', 'dept'], rows: [['1', 'Aarav', 'CS'], ['3', 'Kabir', 'CS']] } },
  { key: 'Projection π', expr: 'π name (Student)', desc: 'Projection (π) keeps the chosen COLUMNS (and removes duplicates).', sources: [STUDENT], result: { name: 'Result', cols: ['name'], rows: [['Aarav'], ['Diya'], ['Kabir']] } },
  { key: 'Union ∪', expr: 'A ∪ B', desc: 'Union returns rows in A OR B (duplicates removed). Relations must be union-compatible.', sources: [A, B], result: { name: 'Result', cols: ['x'], rows: [['1'], ['2'], ['3'], ['4']] } },
  { key: 'Intersection ∩', expr: 'A ∩ B', desc: 'Intersection returns rows in BOTH A and B.', sources: [A, B], result: { name: 'Result', cols: ['x'], rows: [['2'], ['3']] } },
  { key: 'Difference −', expr: 'A − B', desc: 'Difference returns rows in A but NOT in B.', sources: [A, B], result: { name: 'Result', cols: ['x'], rows: [['1']] } },
  { key: 'Natural Join ⋈', expr: 'Student ⋈ Enroll', desc: 'Natural join matches rows on the common attribute (sid) and merges them (duplicate column removed).', sources: [STUDENT, ENROLL], result: { name: 'Result', cols: ['sid', 'name', 'dept', 'course'], rows: [['1', 'Aarav', 'CS', 'DBMS'], ['1', 'Aarav', 'CS', 'OS'], ['3', 'Kabir', 'CS', 'CN']] } },
];

function Table({ t, accent }: { t: Tbl; accent?: boolean }) {
  return (
    <div>
      <div className={cn('mb-1 text-xs font-bold', accent ? 'text-brand-600 dark:text-brand-300' : 'text-muted')}>{t.name}</div>
      <table className="border-collapse text-xs">
        <thead><tr>{t.cols.map((c) => <th key={c} className="border border-border bg-surface px-2 py-1 font-mono">{c}</th>)}</tr></thead>
        <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border border-border px-2 py-1 font-mono">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function RelationalAlgebra() {
  const [i, setI] = useState(0);
  const op = ops[i];
  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Pick an operator — see the result</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {ops.map((o, idx) => (
          <button key={o.key} onClick={() => setI(idx)} className={cn('rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors', i === idx ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted')}>{o.key}</button>
        ))}
      </div>
      <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-mono text-sm font-bold text-brand-600 dark:text-brand-300">{op.expr}</div>
        <div className="mt-3 flex flex-wrap items-start gap-4 overflow-x-auto">
          {op.sources.map((s) => <Table key={s.name} t={s} />)}
          <div className="self-center text-xl text-muted">→</div>
          <Table t={op.result} accent />
        </div>
        <p className="mt-3 text-sm text-muted">{op.desc}</p>
      </motion.div>
      <p className="mt-2 text-xs text-muted">Relational algebra is the <strong className="text-text">procedural</strong> backbone of SQL: a <code>SELECT … WHERE</code> is really projection (π) over selection (σ), and SQL joins are these join operators.</p>
    </div>
  );
}
