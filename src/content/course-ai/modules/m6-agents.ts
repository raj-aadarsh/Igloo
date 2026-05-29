import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'm6',
  slug: 'agents',
  order: 6,
  title: 'Agents & the Agentic Stack',
  subtitle: 'LangChain, LangGraph, MCP & friends',
  icon: 'bot',
  lessons: [
    {
      id: 'm6-l1',
      title: 'What is an AI agent?',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A chatbot answers a question. An **agent** pursues a *goal*: it can **plan**, **use tools**, observe results, and keep going until the job is done. You give it the “what,” and it works out the “how.”' },
        { type: 'widget', widget: 'flow-agent' },
        { type: 'h3', text: 'Tools / function calling' },
        { type: 'p', text: 'The key unlock is **tool use** (a.k.a. **function calling**): the model can decide to call a function you provide — search the web, run code, query a DB, send an email — then use the result. This is how an LLM reaches beyond text into the real world.' },
        { type: 'keyterms', terms: [
          { term: 'Agent', def: 'An LLM that plans and takes actions (via tools) to achieve a goal, in a loop.' },
          { term: 'Tool / function calling', def: 'Letting the model invoke external functions and use their results.' },
          { term: 'ReAct', def: 'A pattern: the model alternates Reasoning and Acting (tool calls).' },
          { term: 'Memory', def: 'Storing past steps/info so the agent stays coherent over a long task.' },
        ] },
      ],
    },
    {
      id: 'm6-l2',
      title: 'The frameworks (who does what)',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'You *can* build agents from scratch, but frameworks save time. Here’s the cheat sheet of names you’ll hear:' },
        { type: 'ul', items: [
          '**LangChain** — the popular all-purpose toolkit for chaining LLM calls, tools, and data sources together. Great for getting started.',
          '**LangGraph** — from the LangChain team; models an agent as a **graph/state machine**. Better for complex, multi-step, reliable workflows with loops and branching.',
          '**LlamaIndex** — focused on **data**: connecting your documents to LLMs (indexing + RAG).',
          '**CrewAI** — orchestrate a “**crew**” of role-playing agents that collaborate (researcher + writer + reviewer).',
          '**Microsoft AutoGen** — research-y framework for **multi-agent** conversations.',
          '**OpenAI Agents SDK / Google ADK** — first-party agent toolkits from the model makers.',
        ] },
        { type: 'callout', variant: 'tip', text: 'Don’t over-think the choice. **LangChain/LlamaIndex** to start, **LangGraph** when you need control and reliability, **CrewAI/AutoGen** when you want multiple cooperating agents.' },
        { type: 'keyterms', terms: [
          { term: 'Multi-agent system', def: 'Several specialized agents working together, each with a role.' },
          { term: 'Orchestration', def: 'Coordinating the steps, tools, and agents in a workflow.' },
        ] },
      ],
    },
    {
      id: 'm6-l3',
      title: 'MCP — the “USB-C for AI tools”',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**MCP (Model Context Protocol)** is an open standard introduced by **Anthropic in late 2024** to solve a messy problem: every AI app used to need custom code to connect to every tool and data source (an N×M nightmare). MCP makes it a single standard plug.' },
        { type: 'widget', widget: 'flow-mcp' },
        { type: 'p', text: 'Write one **MCP server** for a tool (your files, GitHub, a database, Slack…) and *any* MCP-aware app — Claude Desktop, IDEs like Cursor, and many others — can use it. It’s been widely adopted across the industry since 2025.' },
        { type: 'keyterms', terms: [
          { term: 'MCP', def: 'Model Context Protocol — an open standard for connecting AI apps to tools and data.' },
          { term: 'MCP server', def: 'A small adapter exposing a tool/data source in the MCP standard.' },
          { term: 'MCP client/host', def: 'The AI app (e.g., Claude Desktop, an IDE) that consumes MCP servers.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Analogy to remember: before USB-C, every device had its own charger. **MCP is USB-C for AI** — one standard way to plug models into the world.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm6-q1',
      type: 'single',
      prompt: 'What most distinguishes an “agent” from a plain chatbot?',
      options: ['It’s bigger', 'It plans and takes actions with tools to reach a goal', 'It only answers in JSON', 'It never hallucinates'],
      correct: [1],
      explanation: 'Agents act in a loop using tools to accomplish goals, not just reply.',
    },
    {
      id: 'm6-q2',
      type: 'single',
      prompt: 'Which framework is best described as modeling an agent as a graph/state machine for complex, reliable workflows?',
      options: ['LangChain', 'LangGraph', 'LlamaIndex', 'CrewAI'],
      correct: [1],
      explanation: 'LangGraph (from the LangChain team) uses a graph/state-machine model for control and reliability.',
    },
    {
      id: 'm6-q3',
      type: 'single',
      prompt: 'What problem does MCP solve?',
      options: [
        'Training models faster',
        'A standard way to connect AI apps to tools/data (instead of custom glue per integration)',
        'Compressing model weights',
        'Generating images',
      ],
      correct: [1],
      explanation: 'MCP standardizes tool/data connections — the “USB-C for AI” idea.',
    },
    {
      id: 'm6-q4',
      type: 'single',
      prompt: 'Who introduced MCP, and roughly when?',
      options: ['Google, 2017', 'Anthropic, late 2024', 'Meta, 2020', 'OpenAI, 2022'],
      correct: [1],
      explanation: 'Anthropic introduced the Model Context Protocol in late 2024; adoption spread across 2025.',
    },
    {
      id: 'm6-q5',
      type: 'single',
      prompt: '“Function calling” lets a model…',
      options: ['Rewrite its own weights', 'Invoke external tools/functions and use their results', 'Skip the context window', 'Run without GPUs'],
      correct: [1],
      explanation: 'Function/tool calling is how the model reaches outside itself to act.',
    },
  ],
  resources: [
    { label: 'Model Context Protocol — official site & docs', url: 'https://modelcontextprotocol.io/', kind: 'docs', free: true },
    { label: 'LangChain docs (free)', url: 'https://python.langchain.com/docs/introduction/', kind: 'docs', free: true },
    { label: 'LangGraph docs', url: 'https://langchain-ai.github.io/langgraph/', kind: 'docs', free: true },
    { label: 'Anthropic: “Building effective agents” (must-read)', url: 'https://www.anthropic.com/research/building-effective-agents', kind: 'article', free: true },
  ],
};
