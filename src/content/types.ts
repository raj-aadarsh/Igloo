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
  | 'subnet-calculator'
  | 'tcp-handshake'
  | 'url-journey'
  // DBMS course widgets
  | 'relational-anatomy'
  | 'er-cardinality'
  | 'normalization-steps'
  | 'relational-algebra'
  | 'transaction-states'
  | 'btree-index'
  | 'sql-playground'
  // Core Java course widgets
  | 'java-playground'
  | 'jvm-pipeline'
  | 'oop-pillars'
  | 'hashmap-internals'
  | 'thread-lifecycle'
  // Low-Level Design course widgets
  | 'uml-relationships'
  | 'solid-explorer'
  | 'coupling-cohesion'
  | 'pattern-gallery'
  | 'strategy-demo'
  | 'observer-demo'
  | 'state-demo'
  | 'lld-playground'
  | 'noun-extraction'
  | 'parking-lot-design'
  // High-Level / System Design course widgets
  | 'request-journey'
  | 'scaling-visualizer'
  | 'load-balancer-sim'
  | 'latency-numbers'
  | 'capacity-estimator'
  | 'consistent-hashing'
  | 'caching-demo'
  | 'cap-theorem'
  | 'message-queue'
  | 'circuit-breaker'
  | 'architecture-canvas'
  // DevOps Essentials course widgets
  | 'devops-lifecycle'
  | 'container-vs-vm'
  | 'image-layers'
  | 'cicd-pipeline'
  | 'deployment-strategies'
  | 'k8s-architecture'
  | 'cloud-models'
  // Git & GitHub course widgets
  | 'git-areas'
  | 'git-branching'
  | 'merge-vs-rebase'
  // Behavioral / HR course widgets
  | 'star-builder'
  | 'question-bank'
  | 'competency-matrix'
  // Android Framework course widgets
  | 'android-stack'
  | 'android-boot'
  | 'android-app-process'
  | 'handler-looper'
  | 'activity-lifecycle'
  | 'launch-modes'
  | 'intent-matching'
  | 'binder-ipc'
  | 'jni-hal'
  | 'oom-ladder'
  | 'input-pipeline'
  | 'touch-dispatch'
  | 'multi-user'
  | 'crash-signatures'
  | 'avc-decoder'
  | 'package-record'
  | 'graphics-pipeline'
  | 'frame-timeline'
  | 'aosp-tree'
  | 'partition-map'
  | 'memory-metrics'
  | 'props-settings'
  | 'patch-port'
  | 'log-java-crashes'
  | 'log-anr-freezes'
  | 'log-native-crashes'
  | 'log-kernel-boot'
  | 'log-memory-issues'
  | 'log-ui-issues'
  | 'log-security-issues'
  | 'log-xts-issues'
  | 'log-buffers';

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
