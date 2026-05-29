import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'm1',
  slug: 'what-is-ai',
  order: 1,
  title: 'What Is AI, Really?',
  subtitle: 'The big picture + a quick history',
  icon: 'sparkles',
  lessons: [
    {
      id: 'm1-l1',
      title: 'AI vs ML vs Deep Learning vs GenAI',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'These four words get mixed up constantly. They’re not competitors — they’re **nested circles**, each one living inside the bigger one. Tap through them below.' },
        { type: 'widget', widget: 'nested-circles' },
        { type: 'h2', text: 'Said simply' },
        { type: 'ul', items: [
          '**Artificial Intelligence (AI)** — the whole goal: machines doing things that normally need human smarts.',
          '**Machine Learning (ML)** — the dominant *way* we do AI today: learn patterns from data instead of hand-coding rules.',
          '**Deep Learning (DL)** — ML using large **neural networks**. It powers modern vision, speech, and language.',
          '**Generative AI** — deep learning that *creates* new content (text, images, audio, video). ChatGPT and Midjourney live here.',
        ] },
        { type: 'callout', variant: 'key', text: 'Almost everything making headlines today is **Generative AI**, which is a kind of **Deep Learning**, which is a kind of **Machine Learning**, which is a branch of **AI**. Get this nesting right and half the confusion disappears.' },
        { type: 'keyterms', terms: [
          { term: 'Model', def: 'The trained “brain” — a big bundle of numbers that turns an input into an output.' },
          { term: 'Training', def: 'The process of adjusting those numbers by showing the model lots of data.' },
          { term: 'Inference', def: 'Actually *using* a trained model to get an answer (e.g., asking ChatGPT a question).' },
          { term: 'Parameters', def: 'The adjustable numbers inside a model. More parameters ≈ more capacity (e.g., “70B” = 70 billion).' },
        ] },
      ],
    },
    {
      id: 'm1-l2',
      title: 'A 75-year history in 12 moments',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'AI isn’t new — the *term* was coined in **1956**. What’s new is that it finally **works**, thanks to huge data and powerful chips. Click along the timeline:' },
        { type: 'widget', widget: 'timeline' },
        { type: 'h2', text: 'The three things that made it click' },
        { type: 'ul', items: [
          '**Data** — the internet gave us oceans of text and images to learn from.',
          '**Compute** — **GPUs** (graphics chips, especially from **NVIDIA**) made training giant models practical.',
          '**Algorithms** — the **Transformer** (2017) was the architecture that scaled beautifully.',
        ] },
        { type: 'callout', variant: 'history', title: 'AI Winters', text: 'Twice (the mid-1970s and late-1980s) hype crashed into reality and funding collapsed — the “**AI winters**.” It’s why veterans stay a little skeptical of hype. The current boom is different mainly because the results are real and in everyone’s hands.' },
        { type: 'callout', variant: 'tip', text: 'If you remember only three years: **1956** (AI named), **2012** (deep learning takes off with AlexNet), **2017** (the Transformer). Everything modern flows from those.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm1-q1',
      type: 'single',
      prompt: 'Which statement about the “nesting” is correct?',
      options: [
        'Machine Learning contains Artificial Intelligence',
        'Generative AI is a type of Deep Learning, which is a type of Machine Learning',
        'Deep Learning and AI are unrelated fields',
        'Generative AI is bigger than AI',
      ],
      correct: [1],
      explanation: 'The order from biggest to smallest is AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI.',
    },
    {
      id: 'm1-q2',
      type: 'single',
      prompt: 'In what year was the term “Artificial Intelligence” coined?',
      options: ['1936', '1956', '1986', '2012'],
      correct: [1],
      explanation: 'It was coined at the 1956 Dartmouth Workshop, organized by John McCarthy and others.',
    },
    {
      id: 'm1-q3',
      type: 'multi',
      prompt: 'Which three ingredients made modern AI finally work?',
      options: ['Massive data', 'Powerful compute (GPUs)', 'Better algorithms (Transformers)', 'Blockchain'],
      correct: [0, 1, 2],
      explanation: 'Data + compute + the Transformer architecture is the standard “why now?” explanation. Blockchain is unrelated.',
    },
    {
      id: 'm1-q4',
      type: 'single',
      prompt: 'What does “inference” mean?',
      options: ['Training a model', 'Using a trained model to get an output', 'Cleaning the dataset', 'Buying GPUs'],
      correct: [1],
      explanation: 'Training builds the model; inference is running it to produce answers.',
    },
  ],
  resources: [
    { label: 'A visual intro to Machine Learning (R2D3)', url: 'https://www.r2d3.us/visual-intro-to-machine-learning-part-1/', kind: 'article', free: true },
    { label: 'Computerphile: history of AI (YouTube)', url: 'https://www.youtube.com/user/Computerphile', kind: 'video', free: true },
    { label: 'Wikipedia: History of artificial intelligence', url: 'https://en.wikipedia.org/wiki/History_of_artificial_intelligence', kind: 'article', free: true },
  ],
};
