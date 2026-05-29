import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'm7',
  slug: 'industry',
  order: 7,
  title: 'The AI Industry',
  subtitle: 'Who builds what (early 2026)',
  icon: 'building',
  lessons: [
    {
      id: 'm7-l1',
      title: 'The players, in plain terms',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'The field can feel like alphabet soup of company names. Here’s the map. (For deep, browsable detail on every one — flagship models, current focus, links — open the **AI Atlas** from the sidebar.)' },
        { type: 'h2', text: 'The frontier labs' },
        { type: 'ul', items: [
          '**OpenAI** — makers of **ChatGPT**, the **GPT** models, the **o-series** reasoning models, **DALL·E** (images) and **Sora** (video). Closed/API, backed heavily by **Microsoft**.',
          '**Anthropic** — makers of **Claude** (models named **Opus**, **Sonnet**, **Haiku**), creators of **MCP** and the “**Constitutional AI**” safety approach. Backed by Amazon & Google.',
          '**Google DeepMind** — **Gemini** models, plus science wins like **AlphaFold** (protein folding, Nobel-recognized) and **AlphaGo**.',
          '**Meta AI** — the **Llama** family, famous for **open weights** you can download and run yourself.',
          '**Mistral AI** (France), **xAI** (**Grok**), and **DeepSeek** (China) — fast-moving challengers, several with open-weight releases.',
        ] },
        { type: 'h2', text: 'The rest of the stack' },
        { type: 'ul', items: [
          '**NVIDIA** — sells the **GPUs** everyone trains on; the picks-and-shovels giant of the boom.',
          '**Microsoft / Amazon (AWS) / Google Cloud** — the clouds where models run; they also resell models (Azure OpenAI, **Bedrock**, Vertex AI).',
          '**Hugging Face** — the “GitHub of models”: a hub to find, share, and run open models/datasets.',
          '**Apple** — **Apple Intelligence**, with a strong focus on **on-device** models for privacy.',
          'Image/video/audio specialists: **Midjourney**, **Black Forest Labs** (FLUX), **Stability AI**, **Runway**, **ElevenLabs**, **Suno**.',
        ] },
        { type: 'callout', variant: 'info', title: 'Open vs closed', text: '**Closed/API** models (GPT, Claude, Gemini) are used over the internet and you can’t see the weights. **Open-weight** models (Llama, Mistral, DeepSeek, Gemma, Qwen) can be downloaded and run yourself — even offline. Both camps are thriving.' },
      ],
    },
    {
      id: 'm7-l2',
      title: 'How they make money & what they’re racing on',
      minutes: 5,
      blocks: [
        { type: 'h3', text: 'Business models' },
        { type: 'ul', items: [
          '**Subscriptions** — ChatGPT Plus, Claude Pro, Gemini Advanced (consumer).',
          '**API usage** — developers pay per token to build apps on the models.',
          '**Cloud & enterprise** — big contracts via Azure/AWS/Google Cloud.',
          '**Hardware** — NVIDIA sells GPUs; others sell inference chips.',
        ] },
        { type: 'h3', text: 'What the 2025–26 race is about' },
        { type: 'ul', items: [
          '**Reasoning** — models that “think” longer for harder problems.',
          '**Agents** — models that *do* tasks, not just chat.',
          '**Multimodality** — fluent across text, image, audio, and video.',
          '**Efficiency & on-device** — smaller, cheaper models that run locally.',
          '**Context & memory** — handling huge documents and remembering you over time.',
        ] },
        { type: 'callout', variant: 'tip', text: 'This is the fastest-moving part of AI. Use the **Atlas** as your snapshot, and click the “check latest” links for current model versions when you’re online.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm7-q1',
      type: 'single',
      prompt: 'Which company makes the Claude models (Opus, Sonnet, Haiku)?',
      options: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Meta'],
      correct: [1],
      explanation: 'Claude — Opus/Sonnet/Haiku — is made by Anthropic, who also created MCP.',
    },
    {
      id: 'm7-q2',
      type: 'single',
      prompt: 'Which company is best known for open-weight Llama models?',
      options: ['Meta', 'OpenAI', 'NVIDIA', 'Perplexity'],
      correct: [0],
      explanation: 'Meta AI releases the Llama family with open weights.',
    },
    {
      id: 'm7-q3',
      type: 'single',
      prompt: 'NVIDIA’s main role in the AI boom is…',
      options: ['Building chatbots', 'Selling the GPUs models train and run on', 'Hosting datasets', 'Writing safety rules'],
      correct: [1],
      explanation: 'NVIDIA supplies the GPUs — the “picks and shovels” of AI.',
    },
    {
      id: 'm7-q4',
      type: 'single',
      prompt: 'What’s the difference between “open-weight” and “closed/API” models?',
      options: [
        'Open-weight models are always smarter',
        'Open-weight can be downloaded and run yourself; closed/API are used over the internet without access to the weights',
        'There is no difference',
        'Closed models are always free',
      ],
      correct: [1],
      explanation: 'Open-weight = downloadable/self-hostable; closed/API = accessed remotely without the weights.',
    },
  ],
  resources: [
    { label: 'Stanford AI Index Report (free, data-rich)', url: 'https://aiindex.stanford.edu/report/', kind: 'article', free: true },
    { label: 'State of AI Report — the annual industry deep-dive', url: 'https://www.stateof.ai/', kind: 'article', free: true },
    { label: 'LMArena — community leaderboard of top models', url: 'https://lmarena.ai/', kind: 'tool', free: true },
  ],
};
