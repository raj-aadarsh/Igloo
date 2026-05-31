import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Card = '1:1' | '1:N' | 'M:N';

const data: Record<Card, { title: string; example: string; mapping: string }> = {
  '1:1': { title: 'One-to-One', example: 'Each Person has exactly one Passport, and vice versa.', mapping: 'Add a foreign key (with a UNIQUE constraint) on either table.' },
  '1:N': { title: 'One-to-Many', example: 'One Department has many Employees; each Employee is in one Department.', mapping: 'Put the foreign key on the "many" side (Employee.dept_id → Department).' },
  'M:N': { title: 'Many-to-Many', example: 'A Student takes many Courses; a Course has many Students.', mapping: 'Needs a separate junction table with two foreign keys (Enrollment: student_id, course_id).' },
};

export function ErCardinality() {
  const [card, setCard] = useState<Card>('1:N');
  const d = data[card];
  const leftCount = card === 'M:N' ? 2 : 1;
  const rightCount = card === '1:1' ? 1 : 3;

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-3 flex gap-1.5">
        {(['1:1', '1:N', 'M:N'] as Card[]).map((c) => (
          <button key={c} onClick={() => setCard(c)} className={cn('rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors', card === c ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted')}>{c}</button>
        ))}
      </div>

      <svg viewBox="0 0 100 60" className="w-full" style={{ maxHeight: 200 }}>
        {/* connection lines */}
        {Array.from({ length: Math.max(leftCount, rightCount) }).map((_, i) => {
          const ly = leftCount === 1 ? 30 : 18 + i * 24;
          const ry = rightCount === 1 ? 30 : 12 + (i % rightCount) * 16;
          if (card === '1:1') return <line key={i} x1="32" y1="30" x2="68" y2="30" className="stroke-brand-400" strokeWidth="0.6" />;
          if (card === '1:N') return <line key={i} x1="32" y1="30" x2="68" y2={12 + i * 16} className="stroke-brand-400" strokeWidth="0.6" />;
          // M:N: connect each left to each right
          return Array.from({ length: rightCount }).map((__, j) => (
            <line key={`${i}-${j}`} x1="32" y1={20 + i * 20} x2="68" y2={12 + j * 16} className="stroke-brand-400" strokeWidth="0.4" opacity="0.7" />
          ));
        })}
        {/* left entities */}
        {Array.from({ length: leftCount }).map((_, i) => {
          const y = leftCount === 1 ? 24 : 12 + i * 20;
          return <g key={i}><rect x="8" y={y} width="24" height="12" rx="2" className="fill-accent-500/20 stroke-accent-500" strokeWidth="0.5" /><text x="20" y={y + 8} textAnchor="middle" className="fill-text text-[4px] font-bold">{card === 'M:N' ? `S${i + 1}` : 'A'}</text></g>;
        })}
        {/* right entities */}
        {Array.from({ length: rightCount }).map((_, i) => {
          const y = rightCount === 1 ? 24 : 6 + i * 16;
          return <g key={i}><rect x="68" y={y} width="24" height="11" rx="2" className="fill-brand-500/20 stroke-brand-500" strokeWidth="0.5" /><text x="80" y={y + 7.5} textAnchor="middle" className="fill-text text-[4px] font-bold">{card === '1:1' ? 'B' : `B${i + 1}`}</text></g>;
        })}
      </svg>

      <motion.div key={card} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
        <h4 className="font-bold">{d.title} ({card})</h4>
        <p className="mt-1 text-sm text-muted">{d.example}</p>
        <p className="mt-2 rounded-lg bg-surface p-2 text-xs"><strong className="text-brand-600 dark:text-brand-300">Maps to tables:</strong> {d.mapping}</p>
      </motion.div>
    </div>
  );
}
