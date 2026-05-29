import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

export function AtlasHeader({ title, subtitle, count }: { title: string; subtitle: string; count?: number }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-black tracking-tight">{title}</h1>
      <p className="mt-1 text-muted">{subtitle}{count != null && <span className="ml-1 text-sm">· {count} entries</span>}</p>
      <p className="mt-2 text-xs text-muted">Snapshot as of early 2026 — every card links out so you can check the latest.</p>
    </header>
  );
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative mb-3">
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  );
}

export function FilterChips<T extends string>({ options, value, onChange }: { options: T[]; value: T | 'All'; onChange: (v: T | 'All') => void }) {
  const all = ['All', ...options] as (T | 'All')[];
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {all.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            value === o ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted hover:text-text',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <motion.div layout className="grid gap-3 sm:grid-cols-2">{children}</motion.div>;
}

export function EmptyState() {
  return <p className="py-10 text-center text-sm text-muted">No matches. Try a different search or filter.</p>;
}
