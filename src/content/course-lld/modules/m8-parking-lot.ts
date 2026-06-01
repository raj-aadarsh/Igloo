import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'lld-m8',
  slug: 'case-study-parking-lot',
  order: 8,
  title: 'Case Study: Parking Lot',
  subtitle: 'The canonical LLD interview',
  icon: 'drafting-compass',
  lessons: [
    {
      id: 'lld-m8-l1',
      title: 'Step 1–2: requirements & entities',
      minutes: 6,
      blocks: [
        { type: 'p', text: '"Design a parking lot" is *the* classic LLD question. Let’s run our 6-step framework on it for real. First, **clarify requirements** and state assumptions:' },
        { type: 'ul', items: [
          'Multiple floors, each with multiple spots; spots come in types (compact, large, handicapped, bike).',
          'Vehicles (car, bike, truck) take a compatible spot.',
          'On entry: assign the nearest free compatible spot and issue a ticket. On exit: compute fee, take payment, free the spot.',
          'Pricing may be hourly or flat, and may differ by vehicle type — *expect it to change*.',
          'In-memory for this round; multiple gates can operate concurrently.',
        ] },
        { type: 'p', text: 'Now **identify entities** (the nouns) and how they relate. Tap through the class map:' },
        { type: 'widget', widget: 'parking-lot-design' },
        { type: 'callout', variant: 'key', text: 'Spotting the variation points ("pricing may change", "new vehicle/spot types") tells you exactly where abstractions go: a PricingStrategy interface and a ParkingSpot hierarchy created by a factory.' },
      ],
    },
    {
      id: 'lld-m8-l2',
      title: 'Step 3–5: classes, relationships & patterns',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'Model the **spot** and **vehicle** hierarchies, then make pricing a **Strategy** so new schemes don’t touch the gate logic (Open/Closed):' },
        { type: 'code', caption: 'Core domain', code: `enum VehicleType { CAR, BIKE, TRUCK }
enum SpotType   { COMPACT, LARGE, HANDICAPPED, BIKE }

abstract class Vehicle {
    private final String plate;
    private final VehicleType type;
    Vehicle(String plate, VehicleType type) { this.plate = plate; this.type = type; }
    VehicleType getType() { return type; }
}
class Car extends Vehicle  { Car(String p)  { super(p, VehicleType.CAR); } }
class Bike extends Vehicle { Bike(String p) { super(p, VehicleType.BIKE); } }

class ParkingSpot {
    private final String id;
    private final SpotType type;
    private Vehicle current;                 // null = free
    boolean isFree() { return current == null; }
    boolean canFit(Vehicle v) { /* type compatibility */ return isFree(); }
    void assign(Vehicle v) { this.current = v; }
    void free() { this.current = null; }
}` },
        { type: 'code', caption: 'Strategy for pricing — swap without editing the gate', code: `interface PricingStrategy {
    double price(Ticket t, long exitTime);
}
class HourlyPricing implements PricingStrategy {
    public double price(Ticket t, long exitTime) {
        long hours = Math.max(1, (exitTime - t.entryTime()) / 3_600_000);
        return hours * rateFor(t.vehicleType());
    }
}
// New scheme later? Add FlatPricing implements PricingStrategy — gate unchanged.` },
        { type: 'callout', variant: 'tip', text: 'Patterns that fall out naturally: Strategy (pricing & payment), Factory (create the right ParkingSpot/Vehicle subtype), Singleton/Facade (the ParkingLot as the one coordinating entry point). You did NOT force them — the requirements pulled them in.' },
      ],
    },
    {
      id: 'lld-m8-l3',
      title: 'Step 6: the flow, concurrency & extension',
      minutes: 7,
      blocks: [
        { type: 'code', caption: 'Entry/exit flow on the ParkingLot facade', code: `class ParkingLot {              // Singleton + Facade
    private final List<ParkingFloor> floors;
    private final PricingStrategy pricing;

    synchronized Ticket parkVehicle(Vehicle v) {        // thread-safe assignment
        ParkingSpot spot = findFreeSpot(v);             // search floors
        if (spot == null) throw new NoSpotAvailableException();
        spot.assign(v);
        return new Ticket(v, spot, System.currentTimeMillis());
    }

    synchronized double unpark(Ticket t, PaymentStrategy pay) {
        double fee = pricing.price(t, System.currentTimeMillis());
        pay.pay(fee);
        t.spot().free();
        return fee;
    }
}` },
        { type: 'callout', variant: 'warning', text: 'Concurrency is the senior-level point: two gates could grab the same spot. Guard the find-and-assign as one atomic step (synchronize, or use a concurrent structure / per-spot lock / atomic CAS). Mention it even if you don’t fully implement it.' },
        { type: 'p', text: '**How would you extend it?** (The interviewer always asks.) Each answer should be "add a class, change nothing":' },
        { type: 'ul', items: [
          'New vehicle/spot type → add a subtype (+ factory case). Existing code untouched.',
          'New pricing (weekend, EV) → new PricingStrategy implementation.',
          'New payment method → new PaymentStrategy implementation.',
          'Reservations, monthly passes → new collaborators, not rewrites.',
        ] },
        { type: 'p', text: 'Want to see the patterns running? Open the playground and revisit Strategy/Factory/Singleton — the same shapes you just used here:' },
        { type: 'widget', widget: 'lld-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m8-q1', type: 'single', prompt: 'Pricing "may be hourly or flat and may change" signals you should use…', options: ['A Singleton', 'A Strategy interface for pricing', 'A giant if/else in the gate', 'Inheritance of ParkingLot'], correct: [1], explanation: 'A variation point → encapsulate it behind a PricingStrategy so new schemes are new classes (OCP).' },
    { id: 'lld-m8-q2', type: 'single', prompt: 'Creating the correct ParkingSpot/Vehicle subtype is a job for the…', options: ['Observer pattern', 'Factory pattern', 'Decorator pattern', 'Memento pattern'], correct: [1], explanation: 'A factory centralises and hides the choice of concrete subtype.' },
    { id: 'lld-m8-q3', type: 'single', prompt: 'Two entry gates assigning the same spot at once is a…', options: ['Memory leak', 'Race condition needing synchronization', 'Compile error', 'Pricing bug'], correct: [1], explanation: 'Concurrent find-and-assign must be atomic (lock / concurrent structure) to avoid double-assignment.' },
    { id: 'lld-m8-q4', type: 'single', prompt: 'The ParkingLot acting as the single coordinating entry point resembles…', options: ['Facade (and often Singleton)', 'Visitor', 'Flyweight', 'Bridge'], correct: [0], explanation: 'It presents a simple unified API over floors/spots (Facade), usually as one instance (Singleton).' },
    { id: 'lld-m8-q5', type: 'single', prompt: 'A strong answer to "how would you add a new payment method?" is…', options: ['Rewrite the gate logic', 'Add a new PaymentStrategy implementation; nothing else changes', 'Add an if/else branch', 'Subclass ParkingLot'], correct: [1], explanation: 'Open/Closed: extend by adding a class, not by modifying tested code.' },
  ],
  resources: [
    { label: 'Awesome Low Level Design — Parking Lot', url: 'https://github.com/ashishps1/awesome-low-level-design', kind: 'project', free: true },
  ],
};
