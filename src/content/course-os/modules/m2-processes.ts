import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'os-m2',
  slug: 'processes-threads',
  order: 2,
  title: 'Processes & Threads',
  subtitle: 'The unit of work — and how it runs',
  icon: 'boxes',
  lessons: [
    {
      id: 'os-m2-l1',
      title: 'Processes & the PCB',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **program** is a passive file on disk. A **process** is a *running* program — with its own memory (code, data, heap, stack), registers, and state. The OS tracks each process with a **Process Control Block (PCB)**.' },
        { type: 'keyterms', title: 'Inside the PCB', terms: [
          { term: 'PID', def: 'Unique process identifier.' },
          { term: 'Process state', def: 'New / Ready / Running / Waiting / Terminated.' },
          { term: 'Program counter + registers', def: 'Where execution is, saved so it can resume after a switch.' },
          { term: 'Memory & resources', def: 'Memory limits, open files, I/O devices held.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Remember: **program = passive file; process = active execution** with its own address space and a PCB the OS uses to manage it.' },
      ],
    },
    {
      id: 'os-m2-l2',
      title: 'Process states & context switching',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A process moves through a lifecycle as it competes for the CPU and waits for I/O. Tap through the states:' },
        { type: 'widget', widget: 'process-states' },
        { type: 'h3', text: 'Context switching' },
        { type: 'p', text: 'When the CPU switches from one process to another, the OS does a **context switch**: save the current process’s registers/PC into its PCB, load the next one’s. It’s essential for multitasking — but it’s **pure overhead** (no useful work happens during the switch).' },
        { type: 'callout', variant: 'warning', text: 'Context switches aren’t free. Too-frequent switching (e.g. a tiny time quantum) wastes CPU on saving/restoring state instead of running your code.' },
      ],
    },
    {
      id: 'os-m2-l3',
      title: 'Threads & IPC',
      minutes: 7,
      blocks: [
        { type: 'h2', text: 'Threads' },
        { type: 'p', text: 'A **thread** is a lightweight unit of execution *inside* a process. Threads of the same process **share** its code, data, and open files, but each has its **own stack and registers**. That sharing makes threads cheaper to create and switch than processes — and lets one app do many things at once (UI + network + compute).' },
        { type: 'keyterms', terms: [
          { term: 'Process vs Thread', def: 'Processes are isolated (separate memory); threads share memory within a process.' },
          { term: 'Multithreading', def: 'Multiple threads in one process running concurrently.' },
          { term: 'User vs Kernel threads', def: 'User threads are managed by a library (fast, but one block can stall all); kernel threads are scheduled by the OS.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Because threads share memory, two threads touching the same data can clash — that’s the **synchronization** problem (next module). Isolation is the trade-off you give up for speed.' },
        { type: 'h2', text: 'Inter-Process Communication (IPC)' },
        { type: 'p', text: 'Isolated processes still need to talk. The OS provides **IPC** mechanisms:' },
        { type: 'ul', items: [
          '**Shared memory** — fastest; processes map a common memory region (must be synchronized).',
          '**Message passing** — send/receive messages via the kernel (pipes, message queues, sockets).',
          '**Pipes / sockets** — streams between processes (sockets work across machines too).',
        ] },
        { type: 'callout', variant: 'info', title: 'Sockets', text: 'A **socket** is an endpoint for communication, identified by an **IP address + port number**. A server **listens** on a port; when a client connects, the server **accepts** it and the two exchange data — this is how networked processes (browser ↔ web server) communicate.' },
        { type: 'callout', variant: 'tip', text: 'Shared memory is fast but you manage the syncing; message passing is simpler and safer but copies data through the kernel.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'os-m2-q1',
      type: 'single',
      prompt: 'What’s the difference between a program and a process?',
      options: ['Nothing', 'A program is a running process', 'A process is a program in execution (active); a program is a passive file', 'A process has no memory'],
      correct: [2],
      explanation: 'A process is an active execution with its own memory and PCB; a program is the passive file on disk.',
    },
    {
      id: 'os-m2-q2',
      type: 'single',
      prompt: 'During a context switch, the OS…',
      options: ['Deletes the process', 'Saves the current process’s state and loads the next’s', 'Runs two processes on one core simultaneously', 'Frees all memory'],
      correct: [1],
      explanation: 'It saves registers/PC to the current PCB and restores the next process’s — overhead with no useful work done.',
    },
    {
      id: 'os-m2-q3',
      type: 'multi',
      prompt: 'Which are SHARED among threads of the same process?',
      options: ['Code section', 'Heap / global data', 'Each thread’s stack', 'Open files'],
      correct: [0, 1, 3],
      explanation: 'Threads share code, data/heap, and open files. Each thread has its OWN stack and registers.',
    },
    {
      id: 'os-m2-q4',
      type: 'single',
      prompt: 'Which IPC method is typically the fastest (but needs careful synchronization)?',
      options: ['Message passing', 'Pipes', 'Shared memory', 'Sockets'],
      correct: [2],
      explanation: 'Shared memory avoids copying through the kernel, so it’s fastest — but you must synchronize access yourself.',
    },
  ],
  resources: [
    { label: 'TutorialsPoint — Processes', url: 'https://www.tutorialspoint.com/operating_system/os_processes.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Threads', url: 'https://www.tutorialspoint.com/operating_system/os_multi_threading.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Inter Process Communication', url: 'https://www.tutorialspoint.com/operating_system/os_inter_process_communication.htm', kind: 'article', free: true },
  ],
};
