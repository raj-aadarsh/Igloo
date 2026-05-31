// ---------------------------------------------------------------------------
// Shared content types for the Course and the Atlas.
// Content is authored as data (blocks) so it stays simple, while "widget"
// blocks let us drop in fully interactive React components anywhere.
// ---------------------------------------------------------------------------

export type WidgetKey =
  | 'nested-circles'
  | 'timeline'
  | 'neuron'
  | 'gradient-descent'
  | 'tokenizer'
  | 'attention'
  | 'embedding-space'
  | 'flow-rag'
  | 'flow-agent'
  | 'flow-mcp'
  | 'ml-types'
  | 'transformer-anatomy'
  // DSA course widgets
  | 'array-viz'
  | 'sliding-window'
  | 'stack-viz'
  | 'bigo-cheat'
  // OS course widgets
  | 'os-layers'
  | 'process-states'
  | 'cpu-scheduling'
  | 'producer-consumer'
  | 'deadlock-rag'
  | 'memory-fit'
  | 'page-replacement'
  | 'disk-scheduling'
  // Computer Networks course widgets
  | 'osi-layers'
  | 'subnet-calculator';

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'key' | 'history';

export interface KeyTerm {
  term: string;
  def: string;
}

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; variant: CalloutVariant; title?: string; text: string }
  | { type: 'keyterms'; title?: string; terms: KeyTerm[] }
  | { type: 'widget'; widget: WidgetKey }
  | { type: 'analogy'; text: string }
  | { type: 'code'; code: string; caption?: string };

export interface Resource {
  label: string;
  url: string;
  kind: 'docs' | 'video' | 'article' | 'project' | 'tool' | 'course';
  free?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  blocks: Block[];
}

export type QuestionType = 'single' | 'multi';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  /** index (single) or indices (multi) of correct answers */
  correct: number[];
  explanation: string;
}

export interface Module {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name
  lessons: Lesson[];
  quiz: Question[];
  resources: Resource[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  modules: Module[];
}

export interface GlossaryEntry {
  term: string;
  short: string;
  category: string;
}
