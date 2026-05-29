import { useEffect, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from '@/theme/ThemeProvider';

// A focused CodeMirror 6 editor for Java. Read-only mode is used to render
// code snippets inside lessons; editable mode powers the playground.
export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  minHeight = 220,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  minHeight?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const { theme } = useTheme();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;
    const extensions = [
      lineNumbers(),
      history(),
      highlightActiveLine(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      java(),
      EditorView.theme({
        '&': { fontSize: '13.5px', borderRadius: '0.75rem', minHeight: `${minHeight}px` },
        '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', padding: '12px 0' },
        '.cm-scroller': { borderRadius: '0.75rem' },
        '&.cm-focused': { outline: 'none' },
      }),
      EditorState.readOnly.of(readOnly),
      EditorView.editable.of(!readOnly),
      ...(theme === 'dark' ? [oneDark] : []),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
      }),
    ];

    const state = EditorState.create({ doc: value, extensions });
    const v = new EditorView({ state, parent: host.current });
    view.current = v;
    return () => v.destroy();
    // Recreate on theme / readOnly change. Value changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, readOnly, minHeight]);

  // Sync external value changes (e.g. "reset code") without losing the cursor on typing.
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
