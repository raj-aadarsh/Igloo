import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'm0',
  slug: 'orientation',
  order: 0,
  title: 'Welcome to Igloo',
  subtitle: 'How this works & what you’ll be able to do',
  icon: 'compass',
  lessons: [
    {
      id: 'm0-l1',
      title: 'Start here',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'Hi! You’re about to go from *"I keep hearing AI words and feel lost"* to *"I can explain AI to anyone."* This course is built for a software engineer who wants the **full map** — concepts, history, the companies, and the modern agentic tools — without drowning in math.' },
        { type: 'h2', text: 'Two ways to learn here' },
        { type: 'ul', items: [
          '**The Course** (this section) — a guided path from zero to advanced. Short lessons, interactive demos, and a quick quiz after each module. Go in order.',
          '**The AI Atlas** — a browsable encyclopedia of every major company, model (Opus, GPT, Gemini, Llama, Grok, DeepSeek…), product, and on-device tool. Use it like a reference whenever you hear a new name.',
        ] },
        { type: 'callout', variant: 'tip', title: 'You can’t break anything', text: 'Every quiz has **unlimited attempts** and no timer. Click everything. Drag the sliders. The interactive widgets are toys — play with them.' },
        { type: 'h2', text: 'How progress works' },
        { type: 'p', text: 'Mark a lesson **done** with the button at the bottom, and your progress is saved on **this device only** (in your browser). There’s no login and nothing leaves your computer — the whole site works **fully offline**.' },
        { type: 'callout', variant: 'info', title: 'A note on “latest” info', text: 'The content is current as of **early 2026**. Because Igloo runs offline, it can’t auto-update — so wherever the field moves fast, you’ll find a **free link** to check the newest details when you’re online.' },
      ],
    },
    {
      id: 'm0-l2',
      title: 'How to get the most out of it',
      minutes: 3,
      blocks: [
        { type: 'h2', text: 'A simple study loop' },
        { type: 'ol', items: [
          'Read a lesson and **play with the interactive widget** — it’s there to make the idea click.',
          'Notice the **“Terms to remember”** boxes. Those are the words people actually use in meetings, job interviews, and docs.',
          'Take the **module quiz**. Got one wrong? Read the explanation and retry — that’s how it sticks.',
          'Curious? Open the **resource links** at the end of each module to go deeper (all free).',
        ] },
        { type: 'analogy', text: 'Learning AI is like learning a city. The **Course** is a walking tour that builds your mental map street by street. The **Atlas** is the directory you flip to when someone mentions a place you haven’t visited yet.' },
        { type: 'callout', variant: 'key', text: 'You don’t need to memorize math. You need the **vocabulary** and the **intuitions**. That’s exactly what we’ll build.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm0-q1',
      type: 'single',
      prompt: 'How many attempts do the quizzes allow?',
      options: ['One attempt only', 'Three attempts', 'Unlimited attempts', 'Depends on the module'],
      correct: [2],
      explanation: 'Every quiz is unlimited and untimed — they exist to help you learn, not to grade you.',
    },
    {
      id: 'm0-q2',
      type: 'single',
      prompt: 'Where is your progress stored?',
      options: ['On a cloud server', 'In your browser on this device (offline)', 'In a Google account', 'Nowhere — it resets each visit'],
      correct: [1],
      explanation: 'Igloo is fully offline. Progress lives in your browser’s local storage; nothing is uploaded.',
    },
  ],
  resources: [
    { label: 'IBM: “What is artificial intelligence?” (clear explainer)', url: 'https://www.ibm.com/think/topics/artificial-intelligence', kind: 'article', free: true },
    { label: 'MIT Technology Review: a plain-English guide to AI', url: 'https://www.technologyreview.com/2024/07/10/1094475/what-is-artificial-intelligence-ai-definitive-guide/', kind: 'article', free: true },
  ],
};
