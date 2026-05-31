import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'os-m1',
  slug: 'foundations',
  order: 1,
  title: 'OS Foundations',
  subtitle: 'What an operating system is & does',
  icon: 'cpu',
  lessons: [
    {
      id: 'os-m1-l1',
      title: 'What is an operating system?',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'An **operating system (OS)** is the software layer between your **applications** and the **hardware**. It manages the CPU, memory, disk, and devices, and gives programs a clean, safe interface to use them — so apps don’t each have to know the gritty details of your specific hardware.' },
        { type: 'analogy', text: 'A theatre manager: actors (apps) just perform; the manager handles the stage, lighting, scheduling, and makes sure two shows don’t book the same room.' },
        { type: 'p', text: 'Apps never touch hardware directly. They ask the OS through **system calls**, which cross the boundary from **user mode** into the privileged **kernel mode**. Explore the layers:' },
        { type: 'widget', widget: 'os-layers' },
        { type: 'keyterms', terms: [
          { term: 'Kernel', def: 'The core of the OS that runs in privileged mode and manages all resources.' },
          { term: 'User mode vs Kernel mode', def: 'CPU privilege levels. Apps run in restricted user mode; the kernel runs in full-access kernel mode.' },
          { term: 'System call', def: 'The controlled entry point an app uses to request an OS service (e.g. read, write, fork).' },
        ] },
      ],
    },
    {
      id: 'os-m1-l2',
      title: 'What the OS manages (and how it’s built)',
      minutes: 6,
      blocks: [
        { type: 'h2', text: 'The core jobs' },
        { type: 'ul', items: [
          '**Process management** — create, schedule, and stop programs (CPU time-sharing).',
          '**Memory management** — give each process memory, track what’s free, enable virtual memory.',
          '**File system** — organise data on disk into files and directories.',
          '**I/O & device management** — talk to disks, keyboards, networks via drivers.',
          '**Protection & security** — isolate processes and users from each other.',
        ] },
        { type: 'h2', text: 'Kernel architectures' },
        { type: 'keyterms', terms: [
          { term: 'Monolithic kernel', def: 'All OS services run together in kernel space — fast, but a bug can crash everything (e.g. classic Linux).' },
          { term: 'Microkernel', def: 'Only the bare minimum in the kernel; other services run as user processes — safer/modular, a bit slower (e.g. Minix).' },
          { term: 'Hybrid', def: 'A mix of both (e.g. Windows, macOS).' },
        ] },
        { type: 'callout', variant: 'key', text: 'Interview one-liner: the OS is a **resource manager** (allocates CPU, memory, I/O) and an **abstraction layer** (gives programs a simple, uniform view of messy hardware).' },
      ],
    },
    {
      id: 'os-m1-l3',
      title: 'Types of operating systems',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'The same core ideas get tuned for different goals. The types interviewers expect you to distinguish:' },
        { type: 'keyterms', terms: [
          { term: 'Batch', def: 'Jobs collected and run in batches with no interaction (early mainframes).' },
          { term: 'Multiprogramming', def: 'Keep several jobs in memory; when one waits for I/O, run another — keeps the CPU busy.' },
          { term: 'Multitasking / Time-sharing', def: 'Rapidly switch between tasks so users feel they run simultaneously.' },
          { term: 'Multiprocessing', def: 'Multiple CPUs/cores running processes truly in parallel.' },
          { term: 'Real-time (RTOS)', def: 'Guarantees responses within strict deadlines. **Hard real-time** = deadlines are absolute (airbags, pacemakers, missile systems); **Soft real-time** = deadlines matter but the occasional miss is tolerable (video/audio streaming).' },
          { term: 'Distributed', def: 'Many networked machines presented as one system; each has its own CPU & memory.' },
          { term: 'Network OS', def: 'Runs on a server and manages shared resources (files, printers, security) for clients on a private network; each machine is aware of the others (e.g. Windows Server).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Don’t confuse the four "multi-" terms: **multiprogramming** (one CPU, overlap by switching during I/O waits), **multitasking** (one CPU, fast time-slicing for interactivity), **multiprocessing** (multiple CPUs, real parallelism), and **multithreading** (one process split into multiple threads sharing its memory).' },
      ],
    },
  ],
  quiz: [
    {
      id: 'os-m1-q1',
      type: 'single',
      prompt: 'How does an application use a hardware resource like the disk?',
      options: ['It writes to the disk controller directly', 'It makes a system call into the kernel', 'It edits kernel memory', 'It can’t use the disk at all'],
      correct: [1],
      explanation: 'Apps run in user mode and must request services via system calls; only the kernel touches hardware directly.',
    },
    {
      id: 'os-m1-q2',
      type: 'single',
      prompt: 'A microkernel differs from a monolithic kernel because it…',
      options: ['Runs everything in kernel space', 'Keeps most services as user-space processes', 'Has no system calls', 'Cannot multitask'],
      correct: [1],
      explanation: 'Microkernels keep the kernel minimal and push services (drivers, FS) to user space for modularity and safety.',
    },
    {
      id: 'os-m1-q3',
      type: 'single',
      prompt: 'One CPU keeps several jobs in memory and switches to another whenever the current one waits for I/O. This is…',
      options: ['Multiprocessing', 'Multiprogramming', 'Distributed OS', 'Batch with no overlap'],
      correct: [1],
      explanation: 'That’s multiprogramming — overlap CPU and I/O to keep the single CPU busy.',
    },
    {
      id: 'os-m1-q4',
      type: 'multi',
      prompt: 'Which are core responsibilities of an OS?',
      options: ['Process scheduling', 'Memory management', 'Compiling your source code', 'File & I/O management'],
      correct: [0, 1, 3],
      explanation: 'Scheduling, memory, files, and I/O are OS jobs. Compiling is a separate tool (the compiler), not the OS.',
    },
  ],
  resources: [
    { label: 'TutorialsPoint — OS Overview', url: 'https://www.tutorialspoint.com/operating_system/os_overview.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — OS Types', url: 'https://www.tutorialspoint.com/operating_system/os_types.htm', kind: 'article', free: true },
    { label: 'Neso Academy — Operating System (YouTube playlist)', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O', kind: 'video', free: true },
  ],
};
