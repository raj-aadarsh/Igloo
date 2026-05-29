import type { Module } from '@/content/types';

export const m10: Module = {
  id: 'm10',
  slug: 'capstone',
  order: 10,
  title: 'Capstone & What’s Next',
  subtitle: 'Cement it, test it, keep going',
  icon: 'cap',
  lessons: [
    {
      id: 'm10-l1',
      title: 'The whole map, on one page',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'You made it. Here’s your mental model, top to bottom — if you can explain this list out loud, you understand AI better than most people in any room:' },
        { type: 'ol', items: [
          '**AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI** — nested ideas.',
          '**ML** learns patterns from data: supervised, unsupervised, reinforcement.',
          'Training = minimizing **loss** via **gradient descent**; beware **overfitting**.',
          '**Neural networks** stack neurons; **backprop** updates the weights; **GPUs** make it fast.',
          'The **Transformer** (2017) + **self-attention** → **LLMs** that predict the next **token**.',
          'LLMs are **pretrained**, then **fine-tuned** and aligned with **RLHF**; they **hallucinate**.',
          'Use them with **prompting**, ground them with **RAG** (+ **embeddings**/**vector DBs**).',
          '**Agents** add **tools/function calling** in a loop; frameworks: **LangChain, LangGraph, LlamaIndex, CrewAI**; **MCP** standardizes tool connections.',
          'The **industry**: OpenAI, Anthropic, Google DeepMind, Meta, Mistral, xAI, DeepSeek + NVIDIA + clouds + Hugging Face.',
          '**Responsible AI**: bias, privacy, alignment, regulation; and a bright **career** for engineers who use it well.',
        ] },
        { type: 'callout', variant: 'key', text: 'Next: take the **Final Exam** (sidebar) to test the whole picture, skim the **Glossary** to lock in vocabulary, and browse the **Atlas** whenever a new name pops up.' },
      ],
    },
    {
      id: 'm10-l2',
      title: 'Keep learning (all free)',
      minutes: 3,
      blocks: [
        { type: 'p', text: 'A curated shortlist to go deeper. Bookmark these — they’re the genuinely good, free ones.' },
        { type: 'ul', items: [
          '**3Blue1Brown** & **StatQuest** (YouTube) — the best visual intuition for the math.',
          '**fast.ai** & **Google ML Crash Course** — free, hands-on courses.',
          '**Hugging Face Learn** — free LLM, agents, and deep-RL courses.',
          '**Anthropic / OpenAI docs & cookbooks** — to actually build things.',
          '**Stanford AI Index** & **LMArena** — to track the state of the field.',
        ] },
        { type: 'callout', variant: 'tip', text: 'Now go build one small thing — a local chatbot, a RAG over your notes, or a tiny agent. Shipping it will teach you more than another hour of reading. 🚀' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm10-q1',
      type: 'single',
      prompt: 'Best one-line summary of an LLM?',
      options: [
        'A database of facts',
        'A big Transformer trained to predict the next token',
        'A search engine',
        'A rule-based expert system',
      ],
      correct: [1],
      explanation: 'That’s the essence — a large Transformer predicting the next token.',
    },
    {
      id: 'm10-q2',
      type: 'multi',
      prompt: 'Which of these reduce hallucinations or ground answers in real facts?',
      options: ['RAG', 'Higher temperature', 'Tool/function calling for live data', 'Citing retrieved sources'],
      correct: [0, 2, 3],
      explanation: 'RAG, tools for live data, and source citations help; higher temperature adds randomness, not accuracy.',
    },
  ],
  resources: [
    { label: 'Take the Final Exam (in this app)', url: '#/exam', kind: 'course', free: true },
    { label: 'Hugging Face Learn — free courses', url: 'https://huggingface.co/learn', kind: 'course', free: true },
    { label: 'Browse the AI Atlas (in this app)', url: '#/atlas', kind: 'docs', free: true },
  ],
};
