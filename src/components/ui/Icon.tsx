import {
  Compass,
  Brain,
  Sparkles,
  Network,
  Boxes,
  Layers,
  MessageSquare,
  Bot,
  Building2,
  Wrench,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  History,
  Cpu,
  Database,
  Search,
  Map,
  Trophy,
  Atom,
  Workflow,
  Bug,
  type LucideIcon,
} from 'lucide-react';

const registry: Record<string, LucideIcon> = {
  compass: Compass,
  brain: Brain,
  sparkles: Sparkles,
  network: Network,
  boxes: Boxes,
  layers: Layers,
  message: MessageSquare,
  bot: Bot,
  building: Building2,
  wrench: Wrench,
  shield: ShieldCheck,
  cap: GraduationCap,
  book: BookOpen,
  history: History,
  cpu: Cpu,
  database: Database,
  search: Search,
  map: Map,
  trophy: Trophy,
  atom: Atom,
  workflow: Workflow,
  bug: Bug,
};

export function Icon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = registry[name] ?? Sparkles;
  return <Cmp className={className} size={size} aria-hidden />;
}
