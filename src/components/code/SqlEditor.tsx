import { useEffect, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { sql, SQLite } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from '@/theme/ThemeProvider';

// A CodeMirror 6 editor configured for SQLite. Powers the DBMS SQL playground.
export function SqlEditor({
  value,
  onChange,
  onRun,
  minHeight = 140,
}: {
  value: string;
  onChange?: (v: string) => void;
  onRun?: () => void;
  minHeight?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const { theme } = useTheme();
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    if (!host.current) return;
    const extensions = [
      lineNumbers(),
      history(),
      highlightActiveLine(),
      keymap.of([
        // Cmd/Ctrl-Enter runs the query.
        { key: 'Mod-Enter', run: () => { onRunRef.current?.(); return true; } },
        ...defaultKeymap,
        ...historyKeymap,
        indentWithTab,
      ]),
      sql({ dialect: SQLite, upperCaseKeywords: true }),
      EditorView.theme({
        '&': { fontSize: '13.5px', borderRadius: '0.75rem', minHeight: `${minHeight}px` },
        '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', padding: '12px 0' },
        '.cm-scroller': { borderRadius: '0.75rem' },
        '&.cm-focused': { outline: 'none' },
      }),
      ...(theme === 'dark' ? [oneDark] : []),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
      }),
    ];

    const state = EditorState.create({ doc: value, extensions });
    const v = new EditorView({ state, parent: host.current });
    view.current = v;
    return () => v.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, minHeight]);

  useEffect(() => {
    const v = view.current;
    if (v && value !== v.state.doc.toString()) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  return (
    <div
      ref={host}
      className="overflow-hidden rounded-xl border border-border bg-[#fafafa] dark:bg-[#282c34]"
    />
  );
}
