import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Model = 'onprem' | 'iaas' | 'paas' | 'saas';

// Layers top → bottom. Value = index from the BOTTOM that the provider manages up to.
const LAYERS = ['Application', 'Data', 'Runtime', 'Middleware', 'O/S', 'Virtualization', 'Servers', 'Storage', 'Networking'];

// How many layers (counting from the bottom) the PROVIDER manages.
const PROVIDER_MANAGES: Record<Model, number> = {
  onprem: 0,   // you manage everything
  iaas: 4,     // provider: Networking, Storage, Servers, Virtualization
  paas: 7,     // provider: + O/S, Middleware, Runtime
  saas: 9,     // provider manages all
};

const INFO: Record<Model, { label: string; example: string; desc: string }> = {
  onprem: { label: 'On-Premises', example: 'Your own data center', desc: 'You own and manage the entire stack — maximum control, maximum operational burden.' },
  iaas: { label: 'IaaS', example: 'AWS EC2, GCP Compute', desc: 'Infrastructure as a Service: the provider runs the hardware & virtualization; you manage the OS upward (patching, runtime, app). Most flexible cloud option.' },
  paas: { label: 'PaaS', example: 'Heroku, App Engine', desc: 'Platform as a Service: the provider also manages the OS, runtime & middleware; you just bring your code + data. Less control, far less ops.' },
  saas: { label: 'SaaS', example: 'Gmail, Salesforce', desc: 'Software as a Service: the provider manages everything; you simply use the application. Zero infrastructure work.' },
};

const MODELS: Model[] = ['onprem', 'iaas', 'paas', 'saas'];

export function CloudModels() {
  const [model, setModel] = useState<Model>('iaas');
  const providerCount = PROVIDER_MANAGES[model];
  const info = INFO[model];

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Cloud service models — who manages what? Tap a model</div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {MODELS.map((m) => (
          <button key={m} onClick={() => setModel(m)} className={cn('rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors', m === model ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>{INFO[m].label}</button>
        ))}
      </div>

      <div className="space-y-1">
        {LAYERS.map((layer, i) => {
          const fromBottom = LAYERS.length - 1 - i;
          const byProvider = fromBottom < providerCount;
          return (
            <motion.div key={layer} layout className={cn('flex items-center justify-between rounded-md border px-3 py-1.5 text-xs font-semibold',
              byProvider ? 'border-accent-400 bg-accent-500/10 text-accent-700 dark:text-accent-300' : 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300')}>
              {layer}
              <span className="text-[10px] font-normal opacity-80">{byProvider ? 'managed by provider' : 'you manage'}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px]">
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-brand-500" /> You manage</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-accent-500" /> Provider manages</span>
      </div>

      <motion.div key={model} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 rounded-xl border border-border bg-surface-2/50 p-3 text-sm">
        <span className="font-semibold">{info.label}</span> <span className="text-xs text-muted">· e.g. {info.example}</span>
        <p className="mt-1 text-muted">{info.desc}</p>
      </motion.div>

      <p className="mt-2 text-xs text-muted">Moving On-Prem → IaaS → PaaS → SaaS, you hand more of the stack to the provider: <strong>less control, but less to operate.</strong> ("Serverless"/FaaS like AWS Lambda goes further still — you manage only functions.)</p>
    </div>
  );
}
