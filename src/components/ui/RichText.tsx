import { Fragment, type ReactNode } from 'react';

// Tiny inline-markdown renderer supporting **bold**, `code`, and [text](url).
// Keeps lesson text readable in source while rendering nicely. Offline-safe.

type Token = { kind: 'text' | 'bold' | 'code' | 'link'; value: string; href?: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const re = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) tokens.push({ kind: 'text', value: input.slice(last, m.index) });
    if (m[2] !== undefined) tokens.push({ kind: 'bold', value: m[2] });
    else if (m[4] !== undefined) tokens.push({ kind: 'code', value: m[4] });
    else if (m[6] !== undefined) tokens.push({ kind: 'link', value: m[6], href: m[7] });
    last = re.lastIndex;
  }
  if (last < input.length) tokens.push({ kind: 'text', value: input.slice(last) });
  return tokens;
}

export function RichText({ children }: { children: string }): ReactNode {
  return tokenize(children).map((t, i) => {
    switch (t.kind) {
      case 'bold':
        return <strong key={i}>{t.value}</strong>;
      case 'code':
        return (
          <code
            key={i}
            className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700 dark:text-brand-300"
          >
            {t.value}
          </code>
        );
      case 'link':
        return (
          <a key={i} href={t.href} target="_blank" rel="noreferrer" className="link-underline">
            {t.value}
          </a>
        );
      default:
        return <Fragment key={i}>{t.value}</Fragment>;
    }
  });
}
