import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'm9',
  slug: 'responsible-ai',
  order: 9,
  title: 'Responsible AI & the Future',
  subtitle: 'Safety, ethics, regulation, careers',
  icon: 'shield',
  lessons: [
    {
      id: 'm9-l1',
      title: 'Risks, bias & safety',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Powerful tools need care. The big issues you should be able to name:' },
        { type: 'ul', items: [
          '**Bias & fairness** — models learn society’s biases from their training data, and can amplify them.',
          '**Hallucinations** — confident falsehoods (we met these in the LLM module).',
          '**Privacy** — don’t paste secrets into tools that may log them; prefer on-device for sensitive data.',
          '**Copyright & data** — what models train on, and who owns AI-generated output, is hotly debated and litigated.',
          '**Misuse** — deepfakes, scams, misinformation at scale.',
        ] },
        { type: 'h3', text: 'How labs try to keep models safe' },
        { type: 'keyterms', terms: [
          { term: 'Alignment', def: 'Making a model’s goals/behavior match human intent and values.' },
          { term: 'RLHF', def: 'Human feedback used to steer models toward helpful/harmless answers.' },
          { term: 'Constitutional AI', def: 'Anthropic’s method: train a model to critique itself against a set of principles.' },
          { term: 'Red-teaming', def: 'Deliberately attacking a model to find failures before release.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'As an engineer, treat model output as a *draft from a confident intern*: useful, fast, and to be checked — especially for facts, code security, and anything high-stakes.' },
      ],
    },
    {
      id: 'm9-l2',
      title: 'Regulation, AGI & your career',
      minutes: 6,
      blocks: [
        { type: 'h3', text: 'Rules of the road' },
        { type: 'ul', items: [
          '**EU AI Act** — the first big comprehensive AI law, phasing in; risk-based rules.',
          'Other regions (US executive actions, UK, China, India) are crafting their own approaches.',
          'Themes: transparency, safety testing, and labeling AI-generated content.',
        ] },
        { type: 'h3', text: 'The AGI question' },
        { type: 'p', text: '**AGI (Artificial General Intelligence)** = AI as broadly capable as a human across tasks. Whether/when it arrives is genuinely **debated** — from “a few years” to “decades” to “not like this.” **ASI** (super-intelligence) goes beyond. Smart people disagree; be skeptical of confident predictions either way.' },
        { type: 'h2', text: 'What this means for a software engineer' },
        { type: 'ul', items: [
          'AI is becoming a **normal part of the stack** — like databases or the cloud. Knowing how to use it well is a core skill.',
          '**AI-assisted coding** (Copilot, Cursor, Claude Code) makes you faster; judgment and system design matter more, not less.',
          'High-value skills: **prompting, RAG, agents, evals, and integrating models into products** — exactly what this course covered.',
        ] },
        { type: 'callout', variant: 'key', text: 'You don’t need to fear AI taking your job as much as you should ride it. Engineers who *use* AI fluently have a big edge — and you’re now one of them.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm9-q1',
      type: 'single',
      prompt: 'Why can models be biased?',
      options: ['They choose to be', 'They learn patterns (including biases) from their training data', 'GPUs are biased', 'Because of the learning rate'],
      correct: [1],
      explanation: 'Models reflect and can amplify biases present in their training data.',
    },
    {
      id: 'm9-q2',
      type: 'single',
      prompt: '“Alignment” refers to…',
      options: ['Lining up GPUs', 'Making a model’s behavior match human intent and values', 'Formatting code', 'Reducing token cost'],
      correct: [1],
      explanation: 'Alignment is about matching model behavior to human goals and values.',
    },
    {
      id: 'm9-q3',
      type: 'single',
      prompt: 'What is the EU AI Act?',
      options: ['A model', 'A comprehensive, risk-based AI law', 'A GPU', 'A framework like LangChain'],
      correct: [1],
      explanation: 'The EU AI Act is a landmark risk-based regulation for AI.',
    },
    {
      id: 'm9-q4',
      type: 'single',
      prompt: 'What does AGI stand for?',
      options: ['Automated GPU Inference', 'Artificial General Intelligence', 'Augmented Generative Interface', 'Average Gradient Index'],
      correct: [1],
      explanation: 'AGI = Artificial General Intelligence — human-level breadth of capability (timing is debated).',
    },
  ],
  resources: [
    { label: 'EU AI Act — official overview', url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', kind: 'article', free: true },
    { label: 'Anthropic: Constitutional AI (research)', url: 'https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback', kind: 'article', free: true },
    { label: 'Stanford AI Index — societal impact data', url: 'https://aiindex.stanford.edu/report/', kind: 'article', free: true },
  ],
};
