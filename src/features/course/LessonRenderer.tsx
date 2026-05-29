import type { Block } from '@/content/types';
import { RichText } from '@/components/ui/RichText';
import { Callout } from '@/components/ui/Callout';
import { Widget } from '@/components/interactive/registry';
import { KeyRound } from 'lucide-react';

export function LessonRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-lesson max-w-none">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return <h2 key={i}>{b.text}</h2>;
          case 'h3':
            return <h3 key={i}>{b.text}</h3>;
          case 'p':
            return (
              <p key={i}>
                <RichText>{b.text}</RichText>
              </p>
            );
          case 'ul':
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <RichText>{it}</RichText>
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="mb-4 ml-5 list-decimal space-y-1.5 text-text/90">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <RichText>{it}</RichText>
                  </li>
                ))}
              </ol>
            );
          case 'analogy':
            return (
              <div key={i} className="my-5 rounded-2xl border-l-4 border-accent-400 bg-accent-50 p-4 italic text-text/90 dark:bg-accent-900/15">
                <span className="mr-1 font-bold not-italic text-accent-600 dark:text-accent-400">Think of it like:</span>
                <RichText>{b.text}</RichText>
              </div>
            );
          case 'callout':
            return <Callout key={i} variant={b.variant} title={b.title} text={b.text} />;
          case 'keyterms':
            return (
              <div key={i} className="my-6 rounded-2xl border border-accent-200 bg-accent-50/60 p-4 dark:border-accent-800 dark:bg-accent-900/15">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-accent-700 dark:text-accent-300">
                  <KeyRound size={16} /> {b.title ?? 'Terms to remember'}
                </div>
                <dl className="space-y-2">
                  {b.terms.map((t, j) => (
                    <div key={j} className="grid gap-0.5 sm:grid-cols-[160px_1fr] sm:gap-3">
                      <dt className="font-mono text-sm font-bold text-text">{t.term}</dt>
                      <dd className="text-sm text-muted">
                        <RichText>{t.def}</RichText>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          case 'widget':
            return <Widget key={i} name={b.widget} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
