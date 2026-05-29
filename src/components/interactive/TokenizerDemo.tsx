import { useMemo, useState } from 'react';

// A simplified, offline approximation of how LLM tokenizers split text.
// Real tokenizers (BPE) are learned from data; this just illustrates the idea:
// common words = one token, rarer/long words get split into sub-word pieces,
// and spaces/punctuation matter.
function tokenize(text: string): string[] {
  if (!text) return [];
  const pieces = text.match(/\s+|[^\s\w]|[\w']+/g) ?? [];
  const tokens: string[] = [];
  for (const p of pieces) {
    if (/^\s+$/.test(p)) {
      tokens.push(p); // whitespace becomes part of the next token visually
      continue;
    }
    if (p.length <= 5 || !/^[\w']+$/.test(p)) {
      tokens.push(p);
    } else {
      // split long words into ~4-char chunks (sub-word approximation)
      for (let i = 0; i < p.length; i += 4) tokens.push(p.slice(i, i + 4));
    }
  }
  // merge a leading space into the following token (GPT-style)
  const merged: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (/^\s+$/.test(tokens[i]) && i + 1 < tokens.length) {
      merged.push(tokens[i] + tokens[i + 1]);
      i++;
    } else {
      merged.push(tokens[i]);
    }
  }
  return merged.filter((t) => t.length > 0);
}

const colors = [
  'bg-brand-200 dark:bg-brand-800/70',
  'bg-accent-200 dark:bg-accent-800/60',
  'bg-emerald-200 dark:bg-emerald-800/60',
  'bg-violet-200 dark:bg-violet-800/60',
  'bg-rose-200 dark:bg-rose-800/60',
];

export function TokenizerDemo() {
  const [text, setText] = useState('Transformers turned AI into a superpower in 2017.');
  const tokens = useMemo(() => tokenize(text), [text]);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted">Type anything — see it become tokens</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="mt-1 w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      <div className="mt-3 flex flex-wrap gap-1 rounded-xl bg-surface p-3 font-mono text-sm leading-7">
        {tokens.length === 0 && <span className="text-muted">…tokens appear here</span>}
        {tokens.map((t, i) => (
          <span key={i} className={`whitespace-pre rounded ${colors[i % colors.length]} px-1`}>
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
        <span><strong className="text-text">{tokens.length}</strong> tokens</span>
        <span><strong className="text-text">{text.length}</strong> characters</span>
        <span>≈ <strong className="text-text">{(text.length / Math.max(tokens.length, 1)).toFixed(1)}</strong> chars/token</span>
      </div>
      <p className="mt-2 text-xs text-muted">
        LLMs don't read letters or words — they read <strong>tokens</strong> (chunks of text). Rough rule: <strong>1 token ≈ 4 characters ≈ ¾ of a word</strong>. You pay per token and the context window is measured in tokens. (This is a simplified illustration; real tokenizers like BPE are learned from data.)
      </p>
    </div>
  );
}
