import type { Product } from './types';

// Consumer & developer AI products you’ll keep hearing about. Early 2026.
export const products: Product[] = [
  { id: 'chatgpt', name: 'ChatGPT', maker: 'OpenAI', category: 'Chat assistant', what: 'The app that started the boom: chat, voice, image generation, and tools.', freeTier: 'Yes (paid Plus/Pro for top models)', url: 'https://chatgpt.com' },
  { id: 'claude-ai', name: 'Claude.ai', maker: 'Anthropic', category: 'Chat assistant', what: 'Claude in the browser/app, strong at writing, analysis, and coding.', freeTier: 'Yes (paid Pro/Max)', url: 'https://claude.ai' },
  { id: 'claude-code', name: 'Claude Code', maker: 'Anthropic', category: 'Coding', what: 'An agentic coding tool that works in your terminal and editor.', freeTier: 'With a Claude subscription / API', url: 'https://www.anthropic.com/claude-code' },
  { id: 'gemini-app', name: 'Gemini app', maker: 'Google', category: 'Chat assistant', what: 'Google’s assistant across web, Android, and Workspace.', freeTier: 'Yes (paid Advanced)', url: 'https://gemini.google.com' },
  { id: 'copilot-ms', name: 'Microsoft Copilot', maker: 'Microsoft', category: 'Assistant / Office', what: 'AI across Windows, Office, and Edge.', freeTier: 'Yes (paid Pro / M365 Copilot)', url: 'https://copilot.microsoft.com' },
  { id: 'gh-copilot', name: 'GitHub Copilot', maker: 'GitHub / Microsoft', category: 'Coding', what: 'AI autocomplete, chat, and agents inside your editor.', freeTier: 'Free tier + paid plans', url: 'https://github.com/features/copilot' },
  { id: 'cursor', name: 'Cursor', maker: 'Anysphere', category: 'Coding', what: 'AI-first code editor (a VS Code fork) with powerful agent features.', freeTier: 'Free tier + Pro', url: 'https://cursor.com' },
  { id: 'antigravity', name: 'Google Antigravity', maker: 'Google', category: 'Coding (agentic IDE)', what: 'Google’s agent-first development platform where AI agents plan and build across editor, terminal, and browser.', freeTier: 'Yes (with limits)', url: 'https://antigravity.google' },
  { id: 'perplexity-p', name: 'Perplexity', maker: 'Perplexity', category: 'Search', what: 'AI answer engine that searches the web and cites sources.', freeTier: 'Yes (paid Pro)', url: 'https://perplexity.ai' },
  { id: 'notebooklm', name: 'NotebookLM', maker: 'Google', category: 'Research', what: 'Upload your sources; chat with them and generate "audio overviews".', freeTier: 'Yes', url: 'https://notebooklm.google.com' },
  { id: 'replit-agent', name: 'Replit Agent', maker: 'Replit', category: 'Coding', what: 'Describe an app in plain English; it builds and deploys it.', freeTier: 'Free tier + paid', url: 'https://replit.com' },
  { id: 'v0', name: 'v0', maker: 'Vercel', category: 'Coding / UI', what: 'Generates React/UI from prompts and screenshots.', freeTier: 'Free tier + paid', url: 'https://v0.dev' },
  { id: 'midjourney-p', name: 'Midjourney', maker: 'Midjourney', category: 'Image', what: 'Create striking images from text prompts.', freeTier: 'Paid (trials vary)', url: 'https://www.midjourney.com' },
  { id: 'lmstudio', name: 'LM Studio', maker: 'LM Studio', category: 'Local models', what: 'Friendly desktop app to download and chat with local LLMs — offline.', freeTier: 'Free', url: 'https://lmstudio.ai' },
  { id: 'ollama-p', name: 'Ollama', maker: 'Ollama', category: 'Local models', what: 'Run open models locally with one command; fully offline & private.', freeTier: 'Free / open source', url: 'https://ollama.com' },
  { id: 'huggingchat', name: 'Hugging Face / Spaces', maker: 'Hugging Face', category: 'Hub & demos', what: 'Find, run, and demo thousands of open models for free.', freeTier: 'Free + paid', url: 'https://huggingface.co' },
];
