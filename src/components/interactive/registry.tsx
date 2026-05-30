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
};

export function Widget({ name }: { name: WidgetKey }) {
  const Cmp = widgetRegistry[name];
  if (!Cmp) return null;
  return <Cmp />;
}
