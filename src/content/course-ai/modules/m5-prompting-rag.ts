import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'm5',
  slug: 'prompting-rag',
  order: 5,
  title: 'Prompting, Embeddings & RAG',
  subtitle: 'Getting useful answers out of LLMs',
  icon: 'message',
  lessons: [
    {
      id: 'm5-l1',
      title: 'Prompt engineering',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **prompt** is just the text you send the model. Small wording changes can hugely change the output — shaping prompts well is **prompt engineering**.' },
        { type: 'h3', text: 'The core techniques' },
        { type: 'ul', items: [
          '**Zero-shot** — just ask. ("Translate this to French.")',
          '**Few-shot** — give a couple of examples first, so it copies the pattern.',
          '**Chain-of-thought** — ask it to "think step by step." Big boost on reasoning tasks.',
          '**System prompt** — the hidden instructions that set the assistant’s role and rules.',
        ] },
        { type: 'keyterms', terms: [
          { term: 'Prompt', def: 'The input text you give the model.' },
          { term: 'System prompt', def: 'Persistent instructions defining the assistant’s behavior/persona.' },
          { term: 'Few-shot', def: 'Including examples in the prompt to guide the format/style.' },
          { term: 'Chain-of-thought', def: 'Prompting the model to reason in steps before answering.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Be specific about **role, task, format, and constraints**. “You are a senior editor. Rewrite this in 3 bullet points, plain English” beats “make this better.”' },
      ],
    },
    {
      id: 'm5-l2',
      title: 'Embeddings & vector databases',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Remember **embeddings** (turning text into points in space)? They power **semantic search**: instead of matching keywords, you match *meaning*. Store millions of embeddings in a **vector database** and you can instantly find the most relevant chunks for any query.' },
        { type: 'widget', widget: 'embedding-space' },
        { type: 'keyterms', terms: [
          { term: 'Embedding', def: 'A vector of numbers representing meaning. Similar meanings → nearby vectors.' },
          { term: 'Vector database', def: 'A store optimized to find the nearest vectors fast (e.g., Pinecone, Chroma, FAISS, pgvector).' },
          { term: 'Semantic search', def: 'Searching by meaning rather than exact keywords.' },
        ] },
      ],
    },
    {
      id: 'm5-l3',
      title: 'RAG — giving the model your knowledge',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'LLMs only know what they were trained on, and they hallucinate. **RAG (Retrieval-Augmented Generation)** fixes both by *fetching relevant facts and pasting them into the prompt* before the model answers. Step through it:' },
        { type: 'widget', widget: 'flow-rag' },
        { type: 'h2', text: 'Prompting vs RAG vs Fine-tuning — which when?' },
        { type: 'ul', items: [
          '**Prompting** — fastest, free, no setup. Try this first.',
          '**RAG** — when the model needs *your* documents or fresh/private info. Most common pattern for company chatbots.',
          '**Fine-tuning** — when you need a specific *style/format/behavior* at scale, or to teach a narrow skill. More effort and cost.',
        ] },
        { type: 'callout', variant: 'key', text: 'Memory hook: **Prompting** changes *how you ask*. **RAG** changes *what facts are in the prompt*. **Fine-tuning** changes *the model itself*.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm5-q1',
      type: 'single',
      prompt: 'Giving the model 2–3 examples in the prompt is called…',
      options: ['Zero-shot', 'Few-shot', 'Fine-tuning', 'RAG'],
      correct: [1],
      explanation: 'Examples in the prompt = few-shot prompting.',
    },
    {
      id: 'm5-q2',
      type: 'single',
      prompt: 'What does a vector database do best?',
      options: ['Store images', 'Find the nearest (most similar) vectors quickly', 'Train models', 'Run the LLM'],
      correct: [1],
      explanation: 'Vector DBs specialize in fast nearest-neighbor search over embeddings.',
    },
    {
      id: 'm5-q3',
      type: 'single',
      prompt: 'Your chatbot must answer from your company’s private PDFs and stay current. Best approach?',
      options: ['Fine-tuning only', 'RAG', 'Raising temperature', 'Bigger context window alone'],
      correct: [1],
      explanation: 'RAG retrieves your documents at query time — ideal for private/fresh knowledge with citations.',
    },
    {
      id: 'm5-q4',
      type: 'single',
      prompt: 'Which best describes the difference?',
      options: [
        'RAG changes the model’s weights',
        'Fine-tuning changes the model; RAG changes the facts in the prompt',
        'Prompting and RAG are the same',
        'Fine-tuning is always cheapest',
      ],
      correct: [1],
      explanation: 'Fine-tuning alters the model itself; RAG injects retrieved facts into the prompt.',
    },
  ],
  resources: [
    { label: 'Anthropic prompt engineering guide (free)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', kind: 'docs', free: true },
    { label: 'OpenAI prompt engineering guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering', kind: 'docs', free: true },
    { label: 'What is RAG? (visual explainer)', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', kind: 'article', free: true },
  ],
};
