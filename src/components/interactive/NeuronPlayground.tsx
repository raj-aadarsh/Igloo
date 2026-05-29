import { useState } from 'react';
import { cn } from '@/lib/cn';

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}
function relu(x: number) {
  return Math.max(0, x);
}

export function NeuronPlayground() {
  const [x1, setX1] = useState(0.5);
  const [x2, setX2] = useState(0.8);
  const [w1, setW1] = useState(0.7);
  const [w2, setW2] = useState(-0.4);
  const [bias, setBias] = useState(0.1);
  const [act, setAct] = useState<'sigmoid' | 'relu' | 'tanh'>('sigmoid');

  const z = x1 * w1 + x2 * w2 + bias;
  const out = act === 'sigmoid' ? sigmoid(z) : act === 'relu' ? relu(z) : Math.tanh(z);

  const Slider = ({ label, value, set, min = -1, max = 1 }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number }) => (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-16 font-mono text-muted">{label}</span>
      <input type="range" min={min} max={max} step={0.05} value={value} onChange={(e) => set(parseFloat(e.target.value))} className="flex-1 accent-brand-500" />
      <span className="w-12 text-right font-mono tabular-nums">{value.toFixed(2)}</span>
    </label>
  );

  return (
    <div className="my-6 grid gap-6 rounded-2xl border border-border bg-surface-2/50 p-5 md:grid-cols-2">
      <div className="space-y-2.5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Inputs &amp; weights — drag to play</p>
        <Slider label="input x₁" value={x1} set={setX1} min={0} max={1} />
        <Slider label="weight w₁" value={w1} set={setW1} />
        <Slider label="input x₂" value={x2} set={setX2} min={0} max={1} />
        <Slider label="weight w₂" value={w2} set={setW2} />
        <Slider label="bias b" value={bias} set={setBias} />
        <div className="flex gap-1.5 pt-2">
          {(['sigmoid', 'relu', 'tanh'] as const).map((a) => (
            <button key={a} onClick={() => setAct(a)} className={cn('rounded-lg border px-2.5 py-1 text-xs font-medium', act === a ? 'border-brand-500 bg-brand-500 text-white' : 'border-border bg-surface text-muted')}>
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="font-mono text-xs text-muted">
          z = x₁·w₁ + x₂·w₂ + b = <span className="font-bold text-text">{z.toFixed(2)}</span>
        </div>
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full border-4 text-center transition-all"
          style={{
            borderColor: `rgb(31 136 168 / ${0.3 + out * 0.7})`,
            backgroundColor: `rgb(31 136 168 / ${out * 0.35})`,
          }}
        >
          <div>
            <div className="text-2xl font-black tabular-nums">{out.toFixed(2)}</div>
            <div className="text-[10px] uppercase text-muted">output</div>
          </div>
        </div>
        <p className="max-w-[14rem] text-center text-xs text-muted">
          A neuron multiplies each input by a <strong>weight</strong>, adds a <strong>bias</strong>, then squashes the result through an <strong>activation function</strong>. Stack millions of these and you get a neural network.
        </p>
      </div>
    </div>
  );
}
