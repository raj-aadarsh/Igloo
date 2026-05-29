import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'm8',
  slug: 'building-with-ai',
  order: 8,
  title: 'Building With AI',
  subtitle: 'The practical toolbox',
  icon: 'wrench',
  lessons: [
    {
      id: 'm8-l1',
      title: 'APIs, SDKs & where models run',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'As an engineer, you mostly use models through an **API**: send a prompt over HTTP, get tokens back. The makers provide **SDKs** (libraries) so it’s a few lines of code.' },
        { type: 'ul', items: [
          '**OpenAI SDK** and **Anthropic SDK** — call GPT / Claude directly.',
          '**Cloud gateways** — **Azure OpenAI**, **AWS Bedrock**, **Google Vertex AI** wrap many models with enterprise features.',
          '**Aggregators** — **OpenRouter**, **Together**, **Fireworks**, **Replicate** let you hit many models behind one API.',
        ] },
        { type: 'h3', text: 'Run it locally (and offline!)' },
        { type: 'p', text: 'You can run capable open models on your own machine — no internet, full privacy:' },
        { type: 'ul', items: [
          '**Ollama** — the easiest: `ollama run llama3` and you’re chatting locally.',
          '**LM Studio** — a friendly desktop app for local models.',
          '**llama.cpp** — the efficient engine many local tools are built on.',
        ] },
        { type: 'callout', variant: 'tip', text: 'See the **On-device LLMs** section in the Atlas for which models fit your laptop’s RAM and how quantization shrinks them.' },
      ],
    },
    {
      id: 'm8-l2',
      title: 'The supporting cast & starter projects',
      minutes: 6,
      blocks: [
        { type: 'h3', text: 'Tools you’ll meet' },
        { type: 'keyterms', terms: [
          { term: 'Vector DB', def: 'Stores embeddings for RAG — Pinecone, Chroma, FAISS, pgvector, Weaviate, Qdrant.' },
          { term: 'Orchestration', def: 'LangChain / LangGraph / LlamaIndex to wire steps, tools, and data.' },
          { term: 'Evals', def: 'Tests that measure your AI app’s quality (so changes don’t silently break it).' },
          { term: 'Guardrails', def: 'Checks that keep outputs safe, on-topic, and well-formatted.' },
        ] },
        { type: 'h2', text: 'Free things to try this week' },
        { type: 'ul', items: [
          'Install **Ollama** and chat with a model fully offline.',
          'Build a tiny **“chat with your PDF”** RAG app (LlamaIndex/LangChain have free tutorials).',
          'Spin up a simple **MCP server** and connect it to an MCP-aware client.',
          'Make a **few-shot classifier** with one API call and a clever prompt.',
        ] },
        { type: 'callout', variant: 'key', text: 'The fastest way to *really* learn AI is to build one small thing end-to-end. Pick a starter above — they’re all free.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm8-q1',
      type: 'single',
      prompt: 'What’s the easiest way to run an LLM locally/offline?',
      options: ['Train one from scratch', 'Use Ollama', 'Rent 1,000 GPUs', 'Use a vector database'],
      correct: [1],
      explanation: 'Ollama makes running open models locally a one-line affair.',
    },
    {
      id: 'm8-q2',
      type: 'single',
      prompt: 'What is a vector database used for in AI apps?',
      options: ['Storing embeddings for retrieval (RAG)', 'Training the model', 'Rendering UI', 'Tokenizing text'],
      correct: [0],
      explanation: 'Vector DBs store embeddings so you can retrieve relevant chunks for RAG.',
    },
    {
      id: 'm8-q3',
      type: 'single',
      prompt: 'Why write “evals” for an AI feature?',
      options: ['To make it bigger', 'To measure quality so changes don’t silently regress', 'To reduce token cost', 'They’re required by law'],
      correct: [1],
      explanation: 'Evals are tests that track whether your app’s quality holds up as you change prompts/models.',
    },
  ],
  resources: [
    { label: 'Ollama — run LLMs locally (free)', url: 'https://ollama.com/', kind: 'tool', free: true },
    { label: 'Anthropic Cookbook — runnable examples', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'project', free: true },
    { label: 'OpenAI Cookbook — runnable examples', url: 'https://github.com/openai/openai-cookbook', kind: 'project', free: true },
    { label: 'LlamaIndex “chat with your docs” starter', url: 'https://docs.llamaindex.ai/en/stable/getting_started/starter_example/', kind: 'project', free: true },
  ],
};
