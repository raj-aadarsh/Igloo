import { useState } from 'react';

function fmtNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(0);
}
function fmtBytes(b: number): string {
  const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0; while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
  return `${b.toFixed(1)} ${u[i]}`;
}

function Field({ label, value, set, suffix }: { label: string; value: number; set: (n: number) => void; suffix?: string }) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="flex items-center gap-1">
        <input type="number" value={value} onChange={(e) => set(Math.max(0, Number(e.target.value)))}
          className="w-24 rounded-lg border border-border bg-surface-2 px-2 py-1 text-right font-mono text-sm" />
        {suffix && <span className="w-8 text-xs text-muted">{suffix}</span>}
      </span>
    </label>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className="font-mono text-lg font-bold text-brand-600 dark:text-brand-300">{value}</div>
      {hint && <div className="text-[10px] text-muted">{hint}</div>}
    </div>
  );
}

export function CapacityEstimator() {
  const [dau, setDau] = useState(100_000_000);     // daily active users
  const [reqPerUser, setReqPerUser] = useState(10); // requests/user/day
  const [writePct, setWritePct] = useState(10);     // % of requests that write
  const [itemKb, setItemKb] = useState(1);          // avg bytes stored per write (KB)
  const [years, setYears] = useState(5);            // retention
  const PEAK = 3;                                   // peak-to-average factor

  const perDay = dau * reqPerUser;
  const avgQps = perDay / 86400;
  const peakQps = avgQps * PEAK;
  const writeQps = avgQps * (writePct / 100);
  const readQps = avgQps - writeQps;
  const writesPerDay = perDay * (writePct / 100);
  const storagePerYear = writesPerDay * 365 * itemKb * 1024; // bytes
  const totalStorage = storagePerYear * years;
  const readBw = readQps * itemKb * 1024; // bytes/sec served

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Back-of-the-envelope estimator — change the inputs, watch the numbers</div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border p-3">
          <Field label="Daily active users" value={dau} set={setDau} />
          <Field label="Requests / user / day" value={reqPerUser} set={setReqPerUser} />
          <Field label="Writes" value={writePct} set={setWritePct} suffix="%" />
          <Field label="Avg size / write" value={itemKb} set={setItemKb} suffix="KB" />
          <Field label="Retention" value={years} set={setYears} suffix="yrs" />
        </div>
        <div className="grid grid-cols-2 gap-2 content-start">
          <Stat label="Avg QPS" value={fmtNum(avgQps)} hint="requests / sec" />
          <Stat label="Peak QPS" value={fmtNum(peakQps)} hint={`×${PEAK} average`} />
          <Stat label="Read QPS" value={fmtNum(readQps)} />
          <Stat label="Write QPS" value={fmtNum(writeQps)} />
          <Stat label="Storage / year" value={fmtBytes(storagePerYear)} />
          <Stat label={`Storage / ${years}yr`} value={fmtBytes(totalStorage)} />
          <Stat label="Read bandwidth" value={`${fmtBytes(readBw)}/s`} />
          <Stat label="Read : Write" value={`${Math.round((100 - writePct) / Math.max(1, writePct))} : 1`} />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        This is exactly the math interviewers want early: convert <strong>DAU → QPS → storage → bandwidth</strong>. A read-heavy ratio (e.g. 9:1) screams "add caching &amp; read replicas"; huge storage screams "shard the database." The estimate justifies your architecture.
      </p>
    </div>
  );
}
