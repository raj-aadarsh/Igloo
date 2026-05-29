import { Link } from 'react-router-dom';
import { Building2, Boxes, AppWindow, Layers, Cpu, Laptop, ArrowRight } from 'lucide-react';
import { companies } from '@/content/atlas/companies';
import { models } from '@/content/atlas/models';
import { products } from '@/content/atlas/products';
import { hardware } from '@/content/atlas/hardware';
import { AtlasHeader } from './AtlasShared';

const sections = [
  { to: '/atlas/companies', icon: Building2, title: 'Companies & Labs', desc: `${companies.length} entries — who builds AI`, tone: 'text-brand-500' },
  { to: '/atlas/models', icon: Boxes, title: 'Models', desc: `${models.length} entries — Claude, GPT, Gemini, Llama…`, tone: 'text-accent-500' },
  { to: '/atlas/products', icon: AppWindow, title: 'Products & Apps', desc: `${products.length} entries — tools people use`, tone: 'text-emerald-500' },
  { to: '/atlas/categories', icon: Layers, title: 'Categories', desc: 'The 5 ways AI is classified', tone: 'text-violet-500' },
  { to: '/atlas/hardware', icon: Cpu, title: 'Hardware & Chips', desc: `${hardware.length} entries — GPUs, TPUs & more`, tone: 'text-rose-500' },
  { to: '/atlas/on-device', icon: Laptop, title: 'On-device / Offline', desc: 'Run AI locally & privately', tone: 'text-brand-500' },
];

export function AtlasHome() {
  return (
    <div>
      <AtlasHeader title="The AI Atlas" subtitle="Your browsable encyclopedia of the entire AI world." />
      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="card group flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <s.icon className={s.tone} size={28} />
            <div className="min-w-0 flex-1">
              <div className="font-bold">{s.title}</div>
              <div className="text-xs text-muted">{s.desc}</div>
            </div>
            <ArrowRight size={18} className="text-muted transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
