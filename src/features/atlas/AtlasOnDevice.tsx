import type { Block } from '@/content/types';
import { LessonRenderer } from '@/features/course/LessonRenderer';
import { AtlasHeader } from './AtlasShared';

const blocks: Block[] = [
  { type: 'p', text: 'You don’t always need the cloud. **On-device (local) LLMs** run entirely on your own laptop or phone — **private**, **free to run**, and **fully offline** (fitting Igloo’s whole philosophy).' },
  { type: 'h2', text: 'How models fit on small hardware: quantization' },
  { type: 'p', text: 'Big models store billions of numbers at high precision. **Quantization** squeezes those numbers into fewer bits (e.g., 16-bit → 4-bit), shrinking the model 3–4× with only a small quality drop. Quantized models are often shipped in the **GGUF** file format.' },
  { type: 'keyterms', terms: [
    { term: 'Quantization', def: 'Lowering numeric precision (e.g., to 4-bit) so a model needs far less memory.' },
    { term: 'GGUF', def: 'A popular file format for distributing quantized local models.' },
    { term: 'Parameters (B)', def: '“7B” = 7 billion. Roughly, a 4-bit 7B model needs ~4–6 GB of RAM.' },
  ] },
  { type: 'h2', text: 'Tools to run models locally' },
  { type: 'ul', items: [
    '**Ollama** — easiest: install, then `ollama run llama3`. Mac/Windows/Linux.',
    '**LM Studio** — a friendly desktop GUI to browse, download, and chat.',
    '**llama.cpp** — the efficient C++ engine many local tools are built on.',
    '**Apple MLX** — Apple-Silicon-optimized local inference for Macs.',
  ] },
  { type: 'h2', text: 'Which models run locally?' },
  { type: 'ul', items: [
    '**Llama (8B)**, **Mistral 7B**, **Qwen (small)** — great all-rounders for a typical laptop.',
    '**Microsoft Phi**, **Google Gemma** — small but capable, designed for local use.',
    '**Gemini Nano** — ships *inside* Android/Pixel for on-device features.',
    '**Apple on-device models** — power Apple Intelligence privately on iPhone/Mac.',
  ] },
  { type: 'callout', variant: 'tip', title: 'Rough RAM guide', text: 'A **4-bit 7–8B** model ≈ **4–6 GB RAM** (fine on most laptops). **13B** ≈ 8–10 GB. **70B** needs a beefy GPU or lots of unified memory. Start small and size up.' },
  { type: 'callout', variant: 'key', text: 'Why bother? **Privacy** (data never leaves your machine), **no cost per token**, **works offline**, and **no rate limits**. The trade-off: local models are usually smaller/less capable than the best cloud models.' },
  { type: 'callout', variant: 'info', title: 'Try it tonight', text: 'Install **Ollama** (ollama.com), run `ollama run llama3.2`, and you’ve got a private AI assistant with your Wi-Fi turned off. 🎉' },
];

export function AtlasOnDevice() {
  return (
    <div>
      <AtlasHeader title="On-device / Offline LLMs" subtitle="Run real AI privately on your own laptop or phone — no internet required." />
      <LessonRenderer blocks={blocks} />
    </div>
  );
}
