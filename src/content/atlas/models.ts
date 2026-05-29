import type { AIModel } from './types';

// Notable models grouped by family. We describe families and key members rather
// than chase exact version numbers (those change monthly) — use the links for
// the current release. Accurate as of early 2026.
export const models: AIModel[] = [
  // ---- Claude (Anthropic) ----
  { id: 'claude-opus', name: 'Claude Opus', maker: 'Anthropic', family: 'Claude', category: 'Multimodal', year: '2024–', modality: 'text + images', openness: 'Closed / API', notableFor: 'The most capable Claude tier — deep reasoning, coding, and long tasks.', url: 'https://www.anthropic.com/claude' },
  { id: 'claude-sonnet', name: 'Claude Sonnet', maker: 'Anthropic', family: 'Claude', category: 'Multimodal', year: '2024–', modality: 'text + images', openness: 'Closed / API', notableFor: 'The balanced workhorse — strong and fast; popular for coding & agents.', url: 'https://www.anthropic.com/claude' },
  { id: 'claude-haiku', name: 'Claude Haiku', maker: 'Anthropic', family: 'Claude', category: 'Multimodal', year: '2024–', modality: 'text + images', openness: 'Closed / API', notableFor: 'The fastest, cheapest Claude — great for high-volume tasks.', url: 'https://www.anthropic.com/claude' },

  // ---- GPT / o-series (OpenAI) ----
  { id: 'gpt-4o', name: 'GPT-4o', maker: 'OpenAI', family: 'GPT', category: 'Multimodal', year: '2024', modality: 'text + image + audio', openness: 'Closed / API', notableFor: 'Fast natively-multimodal model powering much of ChatGPT.', url: 'https://platform.openai.com/docs/models' },
  { id: 'gpt-series', name: 'GPT-5 / GPT family', maker: 'OpenAI', family: 'GPT', category: 'Multimodal', year: '2018–', modality: 'text + images', openness: 'Closed / API', notableFor: 'The flagship general-purpose line behind ChatGPT.', url: 'https://platform.openai.com/docs/models' },
  { id: 'openai-o', name: 'o-series (o1, o3, …)', maker: 'OpenAI', family: 'GPT (reasoning)', category: 'Reasoning', year: '2024–', modality: 'text', openness: 'Closed / API', notableFor: 'Models that "think" longer with hidden reasoning for hard problems.', url: 'https://platform.openai.com/docs/models' },
  { id: 'gpt-oss', name: 'gpt-oss', maker: 'OpenAI', family: 'GPT', category: 'On-device', year: '2025', modality: 'text', openness: 'Open weights', notableFor: 'OpenAI’s open-weight models you can run yourself.', url: 'https://openai.com' },

  // ---- Gemini / Gemma (Google) ----
  { id: 'gemini-pro', name: 'Gemini Pro', maker: 'Google DeepMind', family: 'Gemini', category: 'Multimodal', year: '2023–', modality: 'text + image + audio + video', openness: 'Closed / API', notableFor: 'Frontier model with very long context and strong multimodality.', url: 'https://deepmind.google/technologies/gemini/' },
  { id: 'gemini-flash', name: 'Gemini Flash', maker: 'Google DeepMind', family: 'Gemini', category: 'Multimodal', year: '2024–', modality: 'text + image + audio', openness: 'Closed / API', notableFor: 'Fast, cheap Gemini tier for high volume.', url: 'https://deepmind.google/technologies/gemini/' },
  { id: 'gemini-nano', name: 'Gemini Nano', maker: 'Google DeepMind', family: 'Gemini', category: 'On-device', year: '2023–', modality: 'text', openness: 'Closed / API', notableFor: 'Runs on-device (e.g., Pixel phones) for private, offline features.', url: 'https://deepmind.google/technologies/gemini/' },
  { id: 'gemma', name: 'Gemma', maker: 'Google DeepMind', family: 'Gemma', category: 'On-device', year: '2024–', modality: 'text (+ some multimodal)', openness: 'Open weights', notableFor: 'Google’s open, lightweight models for local use.', url: 'https://ai.google.dev/gemma' },

  // ---- Llama (Meta) ----
  { id: 'llama', name: 'Llama family', maker: 'Meta', family: 'Llama', category: 'LLM', year: '2023–', modality: 'text + images (newer)', openness: 'Open weights', notableFor: 'The most influential open-weight family — runs locally; huge ecosystem.', url: 'https://www.llama.com' },

  // ---- Mistral ----
  { id: 'mistral', name: 'Mistral / Mixtral', maker: 'Mistral AI', family: 'Mistral', category: 'LLM', year: '2023–', modality: 'text (+ multimodal)', openness: 'Open weights', notableFor: 'Efficient open models; popularized Mixture-of-Experts (MoE).', url: 'https://mistral.ai' },

  // ---- Grok ----
  { id: 'grok', name: 'Grok', maker: 'xAI', family: 'Grok', category: 'Multimodal', year: '2023–', modality: 'text + images', openness: 'Closed / API', notableFor: 'Integrated with X (Twitter); real-time-flavored answers.', url: 'https://x.ai' },

  // ---- DeepSeek ----
  { id: 'deepseek-v3', name: 'DeepSeek-V3', maker: 'DeepSeek', family: 'DeepSeek', category: 'LLM', year: '2024', modality: 'text', openness: 'Open weights', notableFor: 'Strong, very cost-efficient open MoE model.', url: 'https://deepseek.com' },
  { id: 'deepseek-r1', name: 'DeepSeek-R1', maker: 'DeepSeek', family: 'DeepSeek', category: 'Reasoning', year: '2025', modality: 'text', openness: 'Open weights', notableFor: 'Open reasoning model that proved frontier reasoning can be cheap.', url: 'https://deepseek.com' },

  // ---- Qwen / others ----
  { id: 'qwen', name: 'Qwen family', maker: 'Alibaba', family: 'Qwen', category: 'Multimodal', year: '2023–', modality: 'text + images + audio', openness: 'Open weights', notableFor: 'Huge, popular open family across many sizes and modalities.', url: 'https://qwenlm.github.io' },
  { id: 'phi', name: 'Phi', maker: 'Microsoft', family: 'Phi', category: 'On-device', year: '2023–', modality: 'text (+ multimodal)', openness: 'Open weights', notableFor: 'Small models that punch above their size ("small but mighty").', url: 'https://azure.microsoft.com/en-us/products/phi' },
  { id: 'command', name: 'Command', maker: 'Cohere', family: 'Command', category: 'LLM', year: '2023–', modality: 'text', openness: 'Closed / API', notableFor: 'Enterprise-tuned models with strong RAG support.', url: 'https://cohere.com' },

  // ---- Image generation ----
  { id: 'dalle', name: 'DALL·E', maker: 'OpenAI', family: 'DALL·E', category: 'Image', year: '2021–', modality: 'text→image', openness: 'Closed / API', notableFor: 'Early mainstream text-to-image; built into ChatGPT.', url: 'https://openai.com/dall-e' },
  { id: 'sd', name: 'Stable Diffusion', maker: 'Stability AI', family: 'Stable Diffusion', category: 'Image', year: '2022–', modality: 'text→image', openness: 'Open weights', notableFor: 'The open model that put image generation on everyone’s laptop.', url: 'https://stability.ai' },
  { id: 'flux', name: 'FLUX', maker: 'Black Forest Labs', family: 'FLUX', category: 'Image', year: '2024–', modality: 'text→image', openness: 'Open weights', notableFor: 'High-quality open image models from the SD creators.', url: 'https://blackforestlabs.ai' },
  { id: 'imagen', name: 'Imagen', maker: 'Google DeepMind', family: 'Imagen', category: 'Image', year: '2023–', modality: 'text→image', openness: 'Closed / API', notableFor: 'Google’s high-fidelity image generator.', url: 'https://deepmind.google/technologies/imagen/' },
  { id: 'midjourney-m', name: 'Midjourney', maker: 'Midjourney', family: 'Midjourney', category: 'Image', year: '2022–', modality: 'text→image', openness: 'Closed / API', notableFor: 'Distinctive, highly aesthetic image generation.', url: 'https://www.midjourney.com' },

  // ---- Video ----
  { id: 'sora', name: 'Sora', maker: 'OpenAI', family: 'Sora', category: 'Video', year: '2024–', modality: 'text→video', openness: 'Closed / API', notableFor: 'High-profile text-to-video model.', url: 'https://openai.com/sora' },
  { id: 'veo', name: 'Veo', maker: 'Google DeepMind', family: 'Veo', category: 'Video', year: '2024–', modality: 'text→video', openness: 'Closed / API', notableFor: 'Google’s flagship video generator.', url: 'https://deepmind.google/technologies/veo/' },
  { id: 'runway-gen', name: 'Runway Gen', maker: 'Runway', family: 'Gen', category: 'Video', year: '2023–', modality: 'text/image→video', openness: 'Closed / API', notableFor: 'Creative-pro video generation and editing.', url: 'https://runwayml.com' },

  // ---- Audio / voice ----
  { id: 'whisper', name: 'Whisper', maker: 'OpenAI', family: 'Whisper', category: 'Audio / Voice', year: '2022', modality: 'speech→text', openness: 'Open weights', notableFor: 'Robust open speech-to-text in many languages.', url: 'https://github.com/openai/whisper' },
  { id: 'eleven', name: 'ElevenLabs TTS', maker: 'ElevenLabs', family: 'ElevenLabs', category: 'Audio / Voice', year: '2023–', modality: 'text→speech', openness: 'Closed / API', notableFor: 'Ultra-realistic AI voices and cloning.', url: 'https://elevenlabs.io' },
  { id: 'suno-m', name: 'Suno', maker: 'Suno', family: 'Suno', category: 'Audio / Voice', year: '2023–', modality: 'text→music', openness: 'Closed / API', notableFor: 'Full songs with vocals from a prompt.', url: 'https://suno.com' },

  // ---- Embeddings ----
  { id: 'oai-embed', name: 'text-embedding-3', maker: 'OpenAI', family: 'Embeddings', category: 'Embedding', year: '2024', modality: 'text→vector', openness: 'Closed / API', notableFor: 'Widely used embeddings for search and RAG.', url: 'https://platform.openai.com/docs/guides/embeddings' },
  { id: 'cohere-embed', name: 'Cohere Embed', maker: 'Cohere', family: 'Embeddings', category: 'Embedding', year: '2023–', modality: 'text→vector', openness: 'Closed / API', notableFor: 'Strong multilingual retrieval embeddings + reranking.', url: 'https://cohere.com/embeddings' },
];
