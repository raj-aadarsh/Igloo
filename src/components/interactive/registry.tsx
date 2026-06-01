import type { WidgetKey } from '@/content/types';
import { NestedCircles } from './NestedCircles';
import { Timeline } from './Timeline';
import { NeuronPlayground } from './NeuronPlayground';
import { GradientDescent } from './GradientDescent';
import { TokenizerDemo } from './TokenizerDemo';
import { AttentionViz } from './AttentionViz';
import { EmbeddingSpace } from './EmbeddingSpace';
import { FlowRag, FlowAgent, FlowMcp } from './FlowDiagram';
import { MLTypes } from './MLTypes';
import { TransformerAnatomy } from './TransformerAnatomy';
import { ArrayViz } from './dsa/ArrayViz';
import { SlidingWindowViz } from './dsa/SlidingWindowViz';
import { StackViz } from './dsa/StackViz';
import { BigOCheat } from './dsa/BigOCheat';
import { OsLayers } from './os/OsLayers';
import { ProcessStates } from './os/ProcessStates';
import { CpuScheduling } from './os/CpuScheduling';
import { ProducerConsumer } from './os/ProducerConsumer';
import { DeadlockRAG } from './os/DeadlockRAG';
import { MemoryFit } from './os/MemoryFit';
import { PageReplacement } from './os/PageReplacement';
import { DiskScheduling } from './os/DiskScheduling';
import { OsiLayers } from './cn/OsiLayers';
import { SubnetCalculator } from './cn/SubnetCalculator';
import { TcpHandshake } from './cn/TcpHandshake';
import { UrlJourney } from './cn/UrlJourney';
import { RelationalAnatomy } from './dbms/RelationalAnatomy';
import { ErCardinality } from './dbms/ErCardinality';
import { NormalizationSteps } from './dbms/NormalizationSteps';
import { RelationalAlgebra } from './dbms/RelationalAlgebra';
import { TransactionStates } from './dbms/TransactionStates';
import { BTreeIndex } from './dbms/BTreeIndex';
import { SqlPlayground } from './dbms/SqlPlayground';
import { JavaPlayground } from './java/JavaPlayground';
import { JvmPipeline } from './java/JvmPipeline';
import { OopPillars } from './java/OopPillars';
import { HashMapInternals } from './java/HashMapInternals';
import { ThreadLifecycle } from './java/ThreadLifecycle';

export const widgetRegistry: Record<WidgetKey, () => JSX.Element> = {
  'nested-circles': NestedCircles,
  timeline: Timeline,
  neuron: NeuronPlayground,
  'gradient-descent': GradientDescent,
  tokenizer: TokenizerDemo,
  attention: AttentionViz,
  'embedding-space': EmbeddingSpace,
  'flow-rag': FlowRag,
  'flow-agent': FlowAgent,
  'flow-mcp': FlowMcp,
  'ml-types': MLTypes,
  'transformer-anatomy': TransformerAnatomy,
  'array-viz': ArrayViz,
  'sliding-window': SlidingWindowViz,
  'stack-viz': StackViz,
  'bigo-cheat': BigOCheat,
  'os-layers': OsLayers,
  'process-states': ProcessStates,
  'cpu-scheduling': CpuScheduling,
  'producer-consumer': ProducerConsumer,
  'deadlock-rag': DeadlockRAG,
  'memory-fit': MemoryFit,
  'page-replacement': PageReplacement,
  'disk-scheduling': DiskScheduling,
  'osi-layers': OsiLayers,
  'subnet-calculator': SubnetCalculator,
  'tcp-handshake': TcpHandshake,
  'url-journey': UrlJourney,
  'relational-anatomy': RelationalAnatomy,
  'er-cardinality': ErCardinality,
  'normalization-steps': NormalizationSteps,
  'relational-algebra': RelationalAlgebra,
  'transaction-states': TransactionStates,
  'btree-index': BTreeIndex,
  'sql-playground': SqlPlayground,
  'java-playground': JavaPlayground,
  'jvm-pipeline': JvmPipeline,
  'oop-pillars': OopPillars,
  'hashmap-internals': HashMapInternals,
  'thread-lifecycle': ThreadLifecycle,
};

export function Widget({ name }: { name: WidgetKey }) {
  const Cmp = widgetRegistry[name];
  if (!Cmp) return null;
  return <Cmp />;
}
