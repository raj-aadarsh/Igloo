import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';

function parseIp(s: string): number | null {
  const parts = s.trim().split('.');
  if (parts.length !== 4) return null;
  let v = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    v = (v << 8) | n;
  }
  return v >>> 0;
}

const toIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

export function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.10');
  const [prefix, setPrefix] = useState(24);
  const parsed = useMemo(() => parseIp(ip), [ip]);

  const result = useMemo(() => {
    if (parsed === null) return null;
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (parsed & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const totalHosts = Math.pow(2, 32 - prefix);
    const usable = prefix >= 31 ? (prefix === 32 ? 1 : 2) : totalHosts - 2;
    const firstHost = prefix >= 31 ? network : network + 1;
    const lastHost = prefix >= 31 ? broadcast : broadcast - 1;
    return { mask, network, broadcast, usable, firstHost, lastHost, wildcard: (~mask >>> 0) };
  }, [parsed, prefix]);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Subnet calculator — type an IP & drag the prefix</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className={cn('w-40 rounded-lg border bg-surface px-3 py-1.5 font-mono text-sm focus:outline-none focus:ring-2', parsed === null ? 'border-rose-400 focus:ring-rose-400' : 'border-border focus:ring-brand-400')}
          placeholder="192.168.1.10"
        />
        <span className="font-mono text-lg font-bold text-muted">/{prefix}</span>
        <input type="range" min={0} max={32} value={prefix} onChange={(e) => setPrefix(parseInt(e.target.value))} className="flex-1 accent-brand-500" style={{ minWidth: 140 }} />
      </div>

      {parsed === null ? (
        <p className="mt-3 text-sm text-rose-500">Enter a valid IPv4 address like <code>192.168.1.10</code>.</p>
      ) : result && (
        <div className="mt-4 grid gap-x-6 gap-y-2 font-mono text-sm sm:grid-cols-2">
          <Row label="Subnet mask" value={toIp(result.mask)} />
          <Row label="Wildcard" value={toIp(result.wildcard)} />
          <Row label="Network address" value={toIp(result.network)} highlight />
          <Row label="Broadcast" value={toIp(result.broadcast)} highlight />
          <Row label="Usable host range" value={prefix >= 31 ? `${toIp(result.firstHost)} – ${toIp(result.lastHost)}` : `${toIp(result.firstHost)} – ${toIp(result.lastHost)}`} />
          <Row label="Usable hosts" value={result.usable.toLocaleString()} />
        </div>
      )}
      <p className="mt-3 text-xs text-muted">
        The <strong className="text-text">prefix</strong> (/{prefix}) sets how many leading bits are the <strong className="text-text">network</strong>; the rest are hosts. Usable hosts = 2<sup>(32−prefix)</sup> − 2 (minus the network &amp; broadcast addresses). Try <code>/25</code> vs <code>/26</code> to watch the network split in half.
      </p>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1">
      <span className="font-sans text-xs text-muted">{label}</span>
      <span className={cn('font-bold', highlight ? 'text-brand-600 dark:text-brand-300' : 'text-text')}>{value}</span>
    </div>
  );
}
