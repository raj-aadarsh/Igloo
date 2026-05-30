import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'os-m3',
  slug: 'cpu-scheduling',
  order: 3,
  title: 'CPU Scheduling',
  subtitle: 'Who gets the CPU next — and why',
  icon: 'workflow',
  lessons: [
    {
      id: 'os-m3-l1',
      title: 'The goal & the metrics',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'With many processes ready and one CPU, the **scheduler** decides who runs next. Different algorithms optimise different things — and interviewers love asking you to compute and compare the metrics.' },
        { type: 'keyterms', title: 'The metrics (know these cold)', terms: [
          { term: 'Burst time', def: 'How long a process needs the CPU.' },
          { term: 'Arrival time', def: 'When the process enters the ready queue.' },
          { term: 'Completion time', def: 'When the process finishes.' },
          { term: 'Turnaround time (TAT)', def: 'Completion − Arrival (total time in the system).' },
          { term: 'Waiting time (WT)', def: 'Turnaround − Burst (time spent waiting, not running).' },
          { term: 'Response time', def: 'First time it gets the CPU − Arrival.' },
        ] },
        { type: 'keyterms', title: 'Two more terms', terms: [
          { term: 'Preemptive', def: 'The OS can pause a running process to run another (e.g. Round Robin, SRTF).' },
          { term: 'Non-preemptive', def: 'A process runs until it finishes or blocks (e.g. FCFS, basic SJF).' },
        ] },
      ],
    },
    {
      id: 'os-m3-l2',
      title: 'The algorithms — see them run',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'Switch algorithms below and watch the **Gantt chart** and **average waiting time** change for the same set of processes. This single widget answers most scheduling interview questions.' },
        { type: 'widget', widget: 'cpu-scheduling' },
        { type: 'h2', text: 'The classics' },
        { type: 'ul', items: [
          '**FCFS (First-Come First-Served)** — run in arrival order. Simple, fair-ish, but a long job first delays everyone (the **convoy effect**).',
          '**SJF (Shortest Job First)** — run the shortest burst next. Gives the **minimum average waiting time**, but needs to know burst lengths and can **starve** long jobs. Preemptive version = **SRTF**.',
          '**Round Robin (RR)** — each process gets a fixed **time quantum**, then goes to the back of the queue. Great **response time** and fairness; quantum too small = too many context switches.',
          '**Priority scheduling** — highest priority runs first. Risk: **starvation** of low-priority jobs (fixed with **aging**).',
          '**Multilevel Queue** — separate queues (e.g. system / interactive / batch), each with its own policy.',
        ] },
        { type: 'keyterms', terms: [
          { term: 'Starvation', def: 'A process waits indefinitely because others keep being chosen.' },
          { term: 'Aging', def: 'Gradually raise a waiting process’s priority so it eventually runs — the fix for starvation.' },
          { term: 'Time quantum', def: 'The fixed slice each process gets in Round Robin.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Quick recall: **SJF → lowest average waiting time** (but can starve & needs burst knowledge). **Round Robin → best responsiveness/fairness** (tune the quantum). **FCFS → simplest but convoy effect.**' },
      ],
    },
  ],
  quiz: [
    {
      id: 'os-m3-q1',
      type: 'single',
      prompt: 'Waiting time is calculated as…',
      options: ['Completion − Arrival', 'Turnaround − Burst', 'Burst − Arrival', 'Arrival − Completion'],
      correct: [1],
      explanation: 'WT = Turnaround − Burst (where Turnaround = Completion − Arrival).',
    },
    {
      id: 'os-m3-q2',
      type: 'single',
      prompt: 'Which algorithm gives the minimum average waiting time (in theory)?',
      options: ['FCFS', 'Round Robin', 'Shortest Job First (SJF)', 'Priority'],
      correct: [2],
      explanation: 'SJF is provably optimal for average waiting time — but it can starve long jobs and needs burst-time knowledge.',
    },
    {
      id: 'os-m3-q3',
      type: 'single',
      prompt: 'The "convoy effect" (a long job delaying many short ones) is a problem of…',
      options: ['Round Robin', 'FCFS', 'SJF', 'Aging'],
      correct: [1],
      explanation: 'FCFS runs in arrival order, so one long job at the front holds up everyone behind it.',
    },
    {
      id: 'os-m3-q4',
      type: 'single',
      prompt: 'How do we prevent starvation in priority scheduling?',
      options: ['Use a bigger quantum', 'Aging — slowly raise waiting processes’ priority', 'Disable interrupts', 'Use FCFS only'],
      correct: [1],
      explanation: 'Aging increases a waiting process’s priority over time so it eventually gets the CPU.',
    },
    {
      id: 'os-m3-q5',
      type: 'single',
      prompt: 'In Round Robin, a time quantum that is far too small causes…',
      options: ['Starvation', 'Excessive context-switch overhead', 'The convoy effect', 'Deadlock'],
      correct: [1],
      explanation: 'Tiny quanta mean the CPU spends much of its time context-switching instead of doing useful work.',
    },
  ],
  resources: [
    { label: 'TutorialsPoint — Process Scheduling Algorithms', url: 'https://www.tutorialspoint.com/operating_system/os_process_scheduling_algorithms.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Scheduling Algorithms Overview', url: 'https://www.tutorialspoint.com/operating_system/scheduling_algorithms_overview.htm', kind: 'article', free: true },
  ],
};
