import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'cn-m0',
  slug: 'welcome',
  order: 0,
  title: 'Welcome to Networks',
  subtitle: 'How this course works',
  icon: 'compass',
  lessons: [
    {
      id: 'cn-m0-l1',
      title: 'Start here',
      minutes: 3,
      blocks: [
        { type: 'p', text: 'Computer Networks is a favourite interview topic — and it’s easiest to *see*. So this course leans on **interactive diagrams**: click through the OSI layers, calculate subnets live, follow a packet from your browser to a server. Read less, picture more.' },
        { type: 'h2', text: 'What you’ll be able to do' },
        { type: 'ul', items: [
          'Explain the **OSI & TCP/IP models** and what each layer adds.',
          'Confidently answer the classics: **TCP vs UDP, the 3-way handshake, IP & subnetting, DNS, HTTP/HTTPS, ARP, NAT**.',
          'Walk through **"what happens when you type a URL"** end to end — the question every interviewer loves.',
        ] },
        { type: 'callout', variant: 'tip', text: 'Play with every widget and take the short quiz at the end of each module (unlimited attempts). The subnet calculator and the layer explorer are worth a few minutes each.' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m0-q1', type: 'single', prompt: 'What’s the fastest way to learn here?', options: ['Memorize RFCs', 'Use the interactive widgets, then quiz yourself', 'Skip to the exam', 'Read only'], correct: [1], explanation: 'The widgets build intuition; the quizzes lock it in.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Data Communication & Computer Network', url: 'https://www.tutorialspoint.com/data_communication_computer_network/index.htm', kind: 'article', free: true },
  ],
};
