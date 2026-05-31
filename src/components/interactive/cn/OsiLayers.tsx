import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Layer {
  n: number; name: string; pdu: string; fn: string; protocols: string; devices: string;
  tcpip: string; color: string;
}

// Top (7) to bottom (1), the way the OSI stack is usually drawn.
const layers: Layer[] = [
  { n: 7, name: 'Application', pdu: 'Data', fn: 'User-facing network services & APIs.', protocols: 'HTTP, DNS, SMTP, FTP', devices: '—', tcpip: 'Application', color: 'from-brand-300 to-brand-200 dark:from-brand-800/70 dark:to-brand-800/40' },
  { n: 6, name: 'Presentation', pdu: 'Data', fn: 'Translation, encryption, compression.', protocols: 'TLS/SSL, JPEG, ASCII', devices: '—', tcpip: 'Application', color: 'from-brand-300 to-brand-200 dark:from-brand-800/70 dark:to-brand-800/40' },
  { n: 5, name: 'Session', pdu: 'Data', fn: 'Opens, manages & closes sessions between apps.', protocols: 'Sockets, RPC, NetBIOS', devices: '—', tcpip: 'Application', color: 'from-brand-300 to-brand-200 dark:from-brand-800/70 dark:to-brand-800/40' },
  { n: 4, name: 'Transport', pdu: 'Segment', fn: 'End-to-end delivery, ports, reliability (or not).', protocols: 'TCP, UDP', devices: '—', tcpip: 'Transport', color: 'from-accent-300 to-accent-200 dark:from-accent-800/60 dark:to-accent-800/40' },
  { n: 3, name: 'Network', pdu: 'Packet', fn: 'Logical (IP) addressing & routing between networks.', protocols: 'IP, ICMP, OSPF', devices: 'Router', tcpip: 'Internet', color: 'from-violet-300 to-violet-200 dark:from-violet-800/70 dark:to-violet-800/40' },
  { n: 2, name: 'Data Link', pdu: 'Frame', fn: 'Node-to-node delivery; MAC addressing & framing.', protocols: 'Ethernet, ARP, PPP', devices: 'Switch, NIC', tcpip: 'Network Access', color: 'from-emerald-300 to-emerald-200 dark:from-emerald-800/70 dark:to-emerald-800/40' },
  { n: 1, name: 'Physical', pdu: 'Bits', fn: 'Raw bit transmission over the medium.', protocols: 'Cables, Wi-Fi radio', devices: 'Hub, cable, repeater', tcpip: 'Network Access', color: 'from-emerald-300 to-emerald-200 dark:from-emerald-800/70 dark:to-emerald-800/40' },
];

export function OsiLayers() {
  const [active, setActive] = useState(4);
  const [tcpip, setTcpip] = useState(false);
  const cur = layers.find((l) => l.n === active)!;

  return (
    <div className="my-6 grid items-start gap-5 rounded-2xl border border-border bg-surface-2/50 p-5 sm:grid-cols-2">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{tcpip ? 'TCP/IP (4-layer) grouping' : 'OSI 7-layer model'}</span>
          <button onClick={() => setTcpip((t) => !t)} className="rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-muted hover:text-text">
            {tcpip ? 'Show OSI' : 'Show TCP/IP'}
          </button>
        </div>
        <div className="space-y-1">
          {layers.map((l) => (
            <button
              key={l.n}
              onClick={() => setActive(l.n)}
              className={cn('flex w-full items-center gap-2 rounded-lg bg-gradient-to-r px-3 py-2 text-left text-sm font-bold transition-all', l.color, active === l.n ? 'ring-2 ring-brand-500 ring-offset-1 ring-offset-bg' : 'hover:brightness-105')}
            >
              <span className="w-5 text-text/60">{l.n}</span>
              <span className="flex-1 text-text/80">{l.name}</span>
              <span className="text-[10px] font-medium text-text/60">{tcpip ? l.tcpip : l.pdu}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={cur.n} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <h4 className="text-lg font-bold">Layer {cur.n}: {cur.name}</h4>
        <p className="mt-1 text-sm text-muted">{cur.fn}</p>
        <dl className="mt-3 space-y-1.5 text-xs">
          <Row label="Data unit (PDU)">{cur.pdu}</Row>
          <Row label="Protocols">{cur.protocols}</Row>
          <Row label="Devices">{cur.devices}</Row>
          <Row label="TCP/IP layer">{cur.tcpip}</Row>
        </dl>
        <p className="mt-3 rounded-lg bg-surface p-2 text-xs italic text-muted">Mnemonic (7→1): <strong className="not-italic text-text">A</strong>ll <strong className="not-italic text-text">P</strong>eople <strong className="not-italic text-text">S</strong>eem <strong className="not-italic text-text">T</strong>o <strong className="not-italic text-text">N</strong>eed <strong className="not-italic text-text">D</strong>ata <strong className="not-italic text-text">P</strong>rocessing.</p>
      </motion.div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2">
      <dt className="font-semibold text-muted">{label}</dt>
      <dd className="text-text/90">{children}</dd>
    </div>
  );
}
