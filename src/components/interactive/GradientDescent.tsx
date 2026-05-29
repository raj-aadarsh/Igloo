import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/primitives';
import { Play, Pause, RotateCcw } from 'lucide-react';

// Loss curve: L(w) = (w - 2)^2 + 0.4  → minimum at w = 2.
const lossAt = (w: number) => (w - 2) ** 2 + 0.4;
const gradAt = (w: number) => 2 * (w - 2);

const W_MIN = -3;
const W_MAX = 7;
const VIEW_W = 320;
const VIEW_H = 180;

// Map (w, loss) into SVG coords.
const toX = (w: number) => ((w - W_MIN) / (W_MAX - W_MIN)) * VIEW_W;
const maxLoss = lossAt(W_MIN);
const toY = (loss: number) => VIEW_H - 12 - (loss / maxLoss) * (VIEW_H - 30);

export function GradientDescent() {
  const [w, setW] = useState(-2);
  const [lr, setLr] = useState(0.1);
  const [playing, setPlaying] = useState(false);
  const [steps, setSteps] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setW((cur) => {
        const next = cur - lr * gradAt(cur);
        if (Math.abs(next - 2) < 0.01) {
          setPlaying(false);
          return 2;
        }
        if (next < W_MIN || next > W_MAX || !Number.isFinite(next)) {
          setPlaying(false); // diverged (learning rate too high!)
          return Math.max(W_MIN, Math.min(W_MAX, next));
        }
        return next;
      });
      setSteps((s) => s + 1);
    }, 350);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, lr]);

  const reset = () => {
    setPlaying(false);
    setW(-2);
    setSteps(0);
  };

  const curve = Array.from({ length: 60 }, (_, i) => {
    const wv = W_MIN + (i / 59) * (W_MAX - W_MIN);
    return `${toX(wv).toFixed(1)},${toY(lossAt(wv)).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="my-6 grid items-center gap-5 rounded-2xl border border-border bg-surface-2/50 p-5 md:grid-cols-[1fr_auto]">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full">
        <polyline points={curve} fill="none" stroke="rgb(var(--muted))" strokeWidth="2" opacity="0.5" />
        {/* minimum marker */}
        <line x1={toX(2)} y1={toY(lossAt(2))} x2={toX(2)} y2={VIEW_H - 8} stroke="rgb(16 185 129)" strokeDasharray="3 3" strokeWidth="1.5" />
        <text x={toX(2)} y={VIEW_H - 1} textAnchor="middle" className="fill-emerald-500 text-[8px] font-bold">minimum</text>
        {/* the ball */}
        <circle cx={toX(w)} cy={toY(lossAt(w))} r="7" className="fill-accent-500" stroke="white" strokeWidth="2" />
      </svg>
      <div className="space-y-3">
        <div className="text-sm">
          <div className="font-mono text-muted">w = <span className="font-bold text-text">{w.toFixed(2)}</span></div>
          <div className="font-mono text-muted">loss = <span className="font-bold text-text">{lossAt(w).toFixed(2)}</span></div>
          <div className="font-mono text-muted">steps: {steps}</div>
        </div>
        <label className="block text-sm">
          <span className="text-muted">learning rate: <span className="font-bold text-text">{lr.toFixed(2)}</span></span>
          <input type="range" min={0.01} max={1.05} step={0.01} value={lr} onChange={(e) => setLr(parseFloat(e.target.value))} className="mt-1 w-full accent-accent-500" />
        </label>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pause' : 'Roll'}
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
        <p className="max-w-[15rem] text-xs text-muted">
          The ball follows the <strong>slope (gradient)</strong> downhill toward the lowest loss. Crank the learning rate too high and watch it <strong>overshoot and diverge</strong> — that's a real training failure.
        </p>
      </div>
    </div>
  );
}
