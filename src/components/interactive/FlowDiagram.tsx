import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface FlowStep {
  title: string;
  desc: string;
  emoji: string;
}

function FlowDiagram({ title, steps, loop }: { title: string; steps: FlowStep[]; loop?: boolean }) {
  const [active, setActive] = useState(0);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-bold">{title}</span>
        {loop && <RefreshCw size={14} className="text-brand-500" />}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-1 items-center gap-2 sm:flex-col">
            <button
              onClick={() => setActive(i)}
              className={cn(
                'flex w-full flex-1 flex-col items-center rounded-xl border p-3 text-center transition-all',
                active === i ? 'border-brand-500 bg-brand-50 shadow-soft dark:bg-brand-900/30' : 'border-border bg-surface hover:border-brand-300',
              )}
            >
              <span className="mb-1 text-2xl">{s.emoji}</span>
              <span className="text-xs font-bold leading-tight">{s.title}</span>
            </button>
            {i < steps.length - 1 && <ArrowRight size={18} className="shrink-0 rotate-90 text-muted sm:rotate-0" />}
          </div>
        ))}
      </div>
      <motion.p key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm leading-6 text-muted">
        <strong className="text-text">{active + 1}. {steps[active].title}:</strong> {steps[active].desc}
      </motion.p>
    </div>
  );
}

export function FlowRag() {
  return (
    <FlowDiagram
      title="RAG — Retrieval-Augmented Generation"
      steps={[
        { emoji: '❓', title: 'Question', desc: 'You ask something the model may not know (your private docs, fresh info).' },
        { emoji: '🔎', title: 'Retrieve', desc: 'The question is embedded and used to search a vector database for the most relevant chunks of your documents.' },
        { emoji: '📎', title: 'Augment', desc: 'Those retrieved chunks are pasted into the prompt as context, alongside your question.' },
        { emoji: '💬', title: 'Generate', desc: 'The LLM answers using that context — grounded in your data, with fewer hallucinations and the ability to cite sources.' },
      ]}
    />
  );
}

export function FlowAgent() {
  return (
    <FlowDiagram
      loop
      title="The Agent Loop (perceive → think → act → repeat)"
      steps={[
        { emoji: '🎯', title: 'Goal', desc: 'You give the agent a goal, not step-by-step instructions ("book me a cheap flight").' },
        { emoji: '🧠', title: 'Reason / Plan', desc: 'The LLM decides what to do next and which tool to use. This is the "ReAct" idea: reason, then act.' },
        { emoji: '🛠️', title: 'Act (tool call)', desc: 'It calls a tool — search the web, run code, query a database, hit an API.' },
        { emoji: '👀', title: 'Observe', desc: 'It reads the tool\'s result, updates its memory, and loops back to reasoning — until the goal is done.' },
      ]}
    />
  );
}

export function FlowMcp() {
  return (
    <FlowDiagram
      title="MCP — Model Context Protocol (the 'USB-C for AI tools')"
      steps={[
        { emoji: '🤖', title: 'AI App (Host)', desc: 'An app like Claude Desktop or an IDE wants to use external tools and data.' },
        { emoji: '🔌', title: 'MCP Client', desc: 'Built into the host, it speaks one standard protocol instead of a custom integration per tool.' },
        { emoji: '🧩', title: 'MCP Server', desc: 'A small adapter that exposes a tool or data source (your files, GitHub, a database, Slack) in the MCP standard.' },
        { emoji: '🗄️', title: 'Your Tool / Data', desc: 'The actual resource. Write one MCP server and any MCP-aware AI app can use it — no more N×M custom glue.' },
      ]}
    />
  );
}
