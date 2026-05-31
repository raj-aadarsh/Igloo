import type { Module } from '@/content/types';

export const m10: Module = {
  id: 'os-m10',
  slug: 'io-systems',
  order: 10,
  title: 'I/O Systems',
  subtitle: 'Talking to the outside world',
  icon: 'cpu',
  lessons: [
    {
      id: 'os-m10-l1',
      title: 'I/O hardware & drivers',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Devices (keyboard, disk, network card) connect through **controllers** and communicate with the CPU over a **bus** using **registers** and **ports**. The OS hides each device’s quirks behind a **device driver** — a module that presents a uniform interface to the rest of the kernel.' },
        { type: 'keyterms', terms: [
          { term: 'Device controller', def: 'Hardware that operates a device and exposes registers (status, command, data) to the CPU.' },
          { term: 'Device driver', def: 'Kernel software that translates generic OS requests into device-specific commands.' },
          { term: 'Memory-mapped I/O', def: 'Device registers are mapped into the address space, so reads/writes to certain addresses talk to the device.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Drivers are the OS’s plug-in layer: add a new device, add a driver, and the rest of the kernel doesn’t change. That abstraction is why one OS runs on endless hardware.' },
      ],
    },
    {
      id: 'os-m10-l2',
      title: 'Three ways to do I/O',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Programmed I/O (polling)', def: 'The CPU repeatedly checks the device’s status register ("are you ready yet?"). Simple but wastes CPU cycles busy-waiting.' },
          { term: 'Interrupt-driven I/O', def: 'The CPU issues the request and moves on; the device raises an interrupt when done. Far more efficient — no busy-waiting.' },
          { term: 'DMA (Direct Memory Access)', def: 'A DMA controller transfers a whole block between device and memory without the CPU copying each byte; the CPU is interrupted only once the block is done.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The progression is about freeing the CPU: **polling** (CPU babysits every byte) → **interrupts** (CPU notified when ready) → **DMA** (CPU offloads the whole transfer). DMA is essential for fast devices like disks and networks.' },
        { type: 'h3', text: 'Helpers: buffering, caching, spooling' },
        { type: 'ul', items: [
          '**Buffering** — hold data in memory to smooth speed mismatches between producer and device.',
          '**Caching** — keep frequently used data in fast memory to avoid slow I/O.',
          '**Spooling** — queue jobs for a slow shared device (the classic example: a printer spool).',
        ] },
      ],
    },
  ],
  quiz: [
    { id: 'os-m10-q1', type: 'single', prompt: 'In polling (programmed I/O), the CPU…', options: ['Sleeps until an interrupt', 'Repeatedly checks the device status, busy-waiting', 'Offloads the transfer to a controller', 'Is not involved'], correct: [1], explanation: 'Polling means the CPU keeps checking the status register, wasting cycles.' },
    { id: 'os-m10-q2', type: 'single', prompt: 'DMA improves I/O by…', options: ['Polling faster', 'Letting a controller move whole blocks to/from memory without the CPU copying each byte', 'Removing device drivers', 'Disabling interrupts permanently'], correct: [1], explanation: 'DMA offloads the bulk transfer, interrupting the CPU only when the whole block is done.' },
    { id: 'os-m10-q3', type: 'single', prompt: 'What presents a uniform interface to the kernel for a specific device?', options: ['The bus', 'The device driver', 'The page table', 'The scheduler'], correct: [1], explanation: 'The driver hides device-specific details behind a standard interface.' },
    { id: 'os-m10-q4', type: 'single', prompt: 'Queuing print jobs for a slow shared printer is an example of…', options: ['Caching', 'Spooling', 'Paging', 'DMA'], correct: [1], explanation: 'Spooling buffers jobs for a slow, shared device so programs don’t wait on it.' },
  ],
  resources: [
    { label: 'TutorialsPoint — I/O Hardware', url: 'https://www.tutorialspoint.com/operating_system/os_io_hardware.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — I/O Software', url: 'https://www.tutorialspoint.com/operating_system/os_io_software.htm', kind: 'article', free: true },
  ],
};
