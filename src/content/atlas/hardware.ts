import type { HardwareItem } from './types';

export const hardware: HardwareItem[] = [
  { id: 'nv-blackwell', name: 'NVIDIA Blackwell (B200/GB200)', maker: 'NVIDIA', kind: 'GPU', what: 'The flagship AI training/inference GPU generation; the chip everyone wants.', url: 'https://www.nvidia.com/en-us/data-center/' },
  { id: 'nv-hopper', name: 'NVIDIA H100 / H200', maker: 'NVIDIA', kind: 'GPU', what: 'The workhorse data-center GPUs that trained most recent frontier models.', url: 'https://www.nvidia.com/en-us/data-center/h100/' },
  { id: 'cuda', name: 'CUDA', maker: 'NVIDIA', kind: 'Accelerator', what: 'NVIDIA’s software platform — the "moat" that locks the ecosystem to its GPUs.', url: 'https://developer.nvidia.com/cuda-zone' },
  { id: 'tpu', name: 'Google TPU', maker: 'Google', kind: 'TPU / ASIC', what: 'Google’s custom AI chips that train and serve Gemini.', url: 'https://cloud.google.com/tpu' },
  { id: 'trainium', name: 'AWS Trainium / Inferentia', maker: 'Amazon', kind: 'TPU / ASIC', what: 'Amazon’s in-house chips for cheaper training and inference on AWS.', url: 'https://aws.amazon.com/machine-learning/trainium/' },
  { id: 'amd-mi', name: 'AMD Instinct (MI-series)', maker: 'AMD', kind: 'GPU', what: 'The main competitor to NVIDIA data-center GPUs, with the open ROCm stack.', url: 'https://www.amd.com/en/products/accelerators/instinct.html' },
  { id: 'groq-lpu', name: 'Groq LPU', maker: 'Groq', kind: 'Inference chip', what: 'Specialized chip for blazing-fast, low-latency LLM inference.', url: 'https://groq.com' },
  { id: 'cerebras-wse', name: 'Cerebras WSE', maker: 'Cerebras', kind: 'Accelerator', what: 'Wafer-scale engine — the largest chip ever made, for huge-throughput AI.', url: 'https://www.cerebras.ai' },
  { id: 'apple-silicon', name: 'Apple Silicon (M-series, Neural Engine)', maker: 'Apple', kind: 'Accelerator', what: 'Unified-memory chips that make Macs surprisingly good at running local models.', url: 'https://www.apple.com/mac/' },
];
