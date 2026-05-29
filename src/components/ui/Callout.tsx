import { Info, Lightbulb, AlertTriangle, KeyRound, Clock } from 'lucide-react';
import type { CalloutVariant } from '@/content/types';
import { RichText } from './RichText';
import { cn } from '@/lib/cn';

const styles: Record<CalloutVariant, { icon: typeof Info; ring: string; iconColor: string; label: string }> = {
  info: { icon: Info, ring: 'border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/20', iconColor: 'text-brand-600 dark:text-brand-300', label: 'Note' },
  tip: { icon: Lightbulb, ring: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-300', label: 'Tip' },
  warning: { icon: AlertTriangle, ring: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-300', label: 'Watch out' },
  key: { icon: KeyRound, ring: 'border-accent-200 bg-accent-50 dark:border-accent-800 dark:bg-accent-900/20', iconColor: 'text-accent-600 dark:text-accent-300', label: 'Remember this' },
  history: { icon: Clock, ring: 'border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-900/20', iconColor: 'text-violet-600 dark:text-violet-300', label: 'History' },
};

export function Callout({ variant, title, text }: { variant: CalloutVariant; title?: string; text: string }) {
  const s = styles[variant];
  const I = s.icon;
  return (
    <div className={cn('my-5 flex gap-3 rounded-2xl border p-4', s.ring)}>
      <I className={cn('mt-0.5 shrink-0', s.iconColor)} size={20} />
      <div className="min-w-0">
        <div className={cn('mb-1 text-sm font-bold', s.iconColor)}>{title ?? s.label}</div>
        <div className="text-sm leading-6 text-text/90">
          <RichText>{text}</RichText>
        </div>
      </div>
    </div>
  );
}
