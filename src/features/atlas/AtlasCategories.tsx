import type { Block } from '@/content/types';
import { LessonRenderer } from '@/features/course/LessonRenderer';
import { AtlasHeader } from './AtlasShared';

const blocks: Block[] = [
  { type: 'p', text: 'When someone says “what *kind* of AI is that?”, they’re usually slicing the field one of five ways. Here’s the map so any model or product clicks into place.' },
  { type: 'h2', text: '1 · By capability (what task)' },
  { type: 'ul', items: [
    '**Natural Language Processing (NLP)** — text & language (chatbots, translation, summarization).',
    '**Computer Vision (CV)** — images & video (recognition, detection, generation).',
    '**Speech & Audio** — speech-to-text, text-to-speech, music.',
    '**Robotics & control** — agents acting in the physical world.',
    '**Recommender systems** — “you might also like…” (the AI you use most without noticing).',
  ] },
  { type: 'h2', text: '2 · By technique (how it works)' },
  { type: 'ul', items: [
    '**Symbolic / rule-based AI** — hand-written logic. The old-school approach.',
    '**Classical Machine Learning** — learns from data (trees, SVMs, regressions).',
    '**Deep Learning** — neural networks; today’s default for perception & language.',
  ] },
  { type: 'h2', text: '3 · By modality (what it generates)' },
  { type: 'ul', items: [
    '**Text** (LLMs: Claude, GPT, Gemini, Llama)',
    '**Image** (DALL·E, Stable Diffusion, FLUX, Midjourney)',
    '**Video** (Sora, Veo, Runway)',
    '**Audio/voice/music** (Whisper, ElevenLabs, Suno)',
    '**Code** (Copilot, Claude Code, Cursor)',
    '**Multimodal** — handles several at once (most frontier models now).',
  ] },
  { type: 'h2', text: '4 · By deployment (where it runs)' },
  { type: 'ul', items: [
    '**Cloud / API** — runs on the maker’s servers; you call it over the internet.',
    '**On-device / edge** — runs locally on your phone/laptop; private and offline (see the On-device section).',
  ] },
  { type: 'h2', text: '5 · By openness (who can use the weights)' },
  { type: 'ul', items: [
    '**Open-weight** — downloadable, self-hostable (Llama, Mistral, Gemma, Qwen, DeepSeek).',
    '**Closed / API** — used remotely, weights not shared (GPT, Claude, Gemini).',
  ] },
  { type: 'callout', variant: 'key', text: 'Try it: take “**Claude Sonnet**” → capability: NLP/coding · technique: deep learning · modality: multimodal · deployment: cloud/API · openness: closed. Now you can classify *any* model you meet.' },
  { type: 'callout', variant: 'tip', text: 'Special mention: **Reasoning models** (OpenAI o-series, DeepSeek-R1) are LLMs tuned to “think” longer before answering — great for math, code, and logic puzzles.' },
];

export function AtlasCategories() {
  return (
    <div>
      <AtlasHeader title="Categories & Taxonomy" subtitle="The five ways the AI world is sliced — so every term has a home." />
      <LessonRenderer blocks={blocks} />
    </div>
  );
}
