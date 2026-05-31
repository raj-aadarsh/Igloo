import { useState } from 'react';
import { cn } from '@/lib/cn';

const cols = ['roll_no', 'name', 'age'];
const rows = [
  ['1', 'Aarav', '20'],
  ['2', 'Diya', '21'],
  ['3', 'Kabir', '19'],
];

type Term = 'relation' | 'tuple' | 'attribute' | 'degree' | 'cardinality' | 'domain';

const info: Record<Term, string> = {
  relation: 'A relation is the whole table — a set of tuples sharing the same attributes.',
  tuple: 'A tuple is a single row — one record (here, one student).',
  attribute: 'An attribute is a column — a named property every tuple has.',
  degree: 'Degree = the number of attributes (columns). This table’s degree is 3.',
  cardinality: 'Cardinality = the number of tuples (rows). This table’s cardinality is 3.',
  domain: 'A domain is the set of allowed values for an attribute (e.g. age ∈ positive integers).',
};

export function RelationalAnatomy() {
  const [term, setTerm] = useState<Term>('tuple');
  const highlightRow = term === 'tuple' ? 0 : -1;
  const highlightCol = term === 'attribute' || term === 'domain' ? 2 : -1;

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Anatomy of a relation — tap a term</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(Object.keys(info) as Term[]).map((t) => (
          <button key={t} onClick={() => setTerm(t)} className={cn('rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors', term === t ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted hover:text-text')}>{t}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className={cn('border-collapse text-sm', term === 'relation' && 'rounded-lg ring-2 ring-brand-500')}>
          <thead>
            <tr>
              {cols.map((c, ci) => (
                <th key={c} className={cn('border border-border bg-surface px-4 py-1.5 font-mono font-bold', highlightCol === ci && 'bg-brand-500/20')}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className={cn(highlightRow === ri && 'ring-2 ring-accent-500')}>
                {r.map((cell, ci) => (
                  <td key={ci} className={cn('border border-border px-4 py-1.5 font-mono', highlightCol === ci && 'bg-brand-500/15', highlightRow === ri && 'bg-accent-500/15')}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted">
        <span>degree (cols) = <strong className="text-text">{cols.length}</strong></span>
        <span>cardinality (rows) = <strong className="text-text">{rows.length}</strong></span>
      </div>
      <p className="mt-2 text-sm text-muted">{info[term]}</p>
    </div>
  );
}
