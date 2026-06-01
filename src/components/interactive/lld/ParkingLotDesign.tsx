import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Cls {
  id: string;
  name: string;
  role: string;
  rel: string;
  pattern?: string;
}

const CLASSES: Cls[] = [
  { id: 'lot', name: 'ParkingLot', role: 'Top-level entry point: holds floors, finds a spot, issues/closes tickets.', rel: 'Composition → many ParkingFloor. Often a Singleton (one lot per process).', pattern: 'Singleton, Facade' },
  { id: 'floor', name: 'ParkingFloor', role: 'A level of the lot; holds spots and tracks availability per type.', rel: 'Composition → many ParkingSpot.' },
  { id: 'spot', name: 'ParkingSpot (abstract)', role: 'A single space. Subtypes: CompactSpot, LargeSpot, HandicappedSpot, BikeSpot.', rel: 'Inheritance ▷ subtypes. Created via a SpotFactory.', pattern: 'Factory' },
  { id: 'vehicle', name: 'Vehicle (abstract)', role: 'What gets parked. Subtypes: Car, Bike, Truck — each fits certain spot types.', rel: 'Inheritance ▷ Car/Bike/Truck. Associated with a Ticket.' },
  { id: 'ticket', name: 'Ticket', role: 'Records entry time, spot, and vehicle; used to compute the fee at exit.', rel: 'Association → Vehicle & ParkingSpot.' },
  { id: 'gate', name: 'EntryGate / ExitGate', role: 'Entry issues a ticket & assigns a spot; Exit computes fee & frees the spot.', rel: 'Depends on ParkingLot, PricingStrategy, PaymentStrategy.' },
  { id: 'pricing', name: 'PricingStrategy', role: 'Computes the fee (flat, hourly, or per-vehicle-type). Swappable.', rel: 'Strategy interface → HourlyPricing, FlatPricing.', pattern: 'Strategy' },
  { id: 'payment', name: 'PaymentStrategy', role: 'Processes payment (cash, card, UPI). Swappable at runtime.', rel: 'Strategy interface → CashPayment, CardPayment.', pattern: 'Strategy' },
];

export function ParkingLotDesign() {
  const [active, setActive] = useState('lot');
  const c = CLASSES.find((x) => x.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Parking Lot — tap a class to see its role, relationships & patterns</div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {CLASSES.map((cls) => (
          <button key={cls.id} onClick={() => setActive(cls.id)}
            className={cn('rounded-xl border p-2 text-center font-mono text-[11px] font-bold leading-tight transition-colors',
              cls.id === active ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>
            {cls.name}
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-bold">{c.name}</span>
          {c.pattern && <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-semibold text-accent-700 dark:text-accent-300">{c.pattern}</span>}
        </div>
        <p className="text-sm"><span className="font-semibold">Role:</span> <span className="text-muted">{c.role}</span></p>
        <p className="mt-1 text-sm"><span className="font-semibold">Relationships:</span> <span className="text-muted">{c.rel}</span></p>
      </motion.div>

      <p className="mt-2 text-xs text-muted">Notice the patterns fall out naturally: <span className="font-semibold">Factory</span> for spot creation, <span className="font-semibold">Strategy</span> for pricing &amp; payment (swap without touching the gate), <span className="font-semibold">Singleton/Facade</span> for the lot. That’s SOLID design in the wild.</p>
    </div>
  );
}
