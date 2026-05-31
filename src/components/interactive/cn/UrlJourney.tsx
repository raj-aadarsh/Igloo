import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const steps = [
  { emoji: '🔎', title: 'Parse URL', desc: 'The browser splits the URL into scheme (https), host (google.com), and path. It checks its HSTS list to force HTTPS where required.' },
  { emoji: '🗂️', title: 'DNS lookup', desc: 'It resolves the hostname to an IP. Checks browser cache → OS cache → asks the recursive resolver, which walks the root → TLD (.com) → authoritative name server. Returns e.g. 142.250.x.x.' },
  { emoji: '🤝', title: 'TCP handshake', desc: 'A 3-way handshake (SYN / SYN-ACK / ACK) opens a reliable connection to the server’s IP on port 443.' },
  { emoji: '🔒', title: 'TLS handshake', desc: 'For HTTPS, client & server agree on encryption, and the server proves its identity with a certificate signed by a trusted CA. Now the channel is encrypted.' },
  { emoji: '📤', title: 'HTTP request', desc: 'The browser sends `GET /` with headers (Host, User-Agent, Cookies, Accept…).' },
  { emoji: '📥', title: 'Server response', desc: 'The server returns a status line (e.g. 200 OK) plus headers and the HTML body.' },
  { emoji: '🎨', title: 'Render', desc: 'The browser parses the HTML, then fetches CSS, JS, and images (more requests), builds the DOM, and paints the page.' },
];

export function UrlJourney() {
  const [active, setActive] = useState(0);

  return (
    <div className="my-6 rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">"What happens when you type a URL?" — tap each step</p>
      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all sm:flex-col sm:items-center sm:text-center',
              active === i ? 'border-brand-500 bg-brand-50 shadow-soft dark:bg-brand-900/30' : 'border-border bg-surface hover:border-brand-300',
            )}
          >
            <span className="text-xl">{s.emoji}</span>
            <span className="text-xs font-bold leading-tight">{i + 1}. {s.title}</span>
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-surface p-4">
        <h4 className="flex items-center gap-2 font-bold">{steps[active].emoji} Step {active + 1}: {steps[active].title}</h4>
        <p className="mt-1 text-sm leading-6 text-muted">{steps[active].desc}</p>
      </motion.div>
      <p className="mt-3 text-xs text-muted">This single question touches almost every layer — DNS, TCP, TLS, HTTP — which is why interviewers love it. Know the order: <strong className="text-text">URL → DNS → TCP → TLS → HTTP → render</strong>.</p>
    </div>
  );
}
