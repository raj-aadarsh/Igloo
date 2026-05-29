// Types for the AI Atlas — the browsable encyclopedia.

export type CompanyType =
  | 'Frontier Lab'
  | 'Big Tech'
  | 'Open Source'
  | 'Startup'
  | 'Hardware'
  | 'Infra / Cloud'
  | 'Platform / Tools';

export interface Company {
  id: string;
  name: string;
  founded: string; // year or "1998 / 2015" etc.
  founders: string;
  country: string;
  type: CompanyType;
  what: string; // one-line "what they do"
  flagship: string[]; // notable models / products
  focus: string; // current focus (early 2026)
  notable: string; // a memorable fact
  url: string;
}

export type ModelCategory =
  | 'LLM'
  | 'Multimodal'
  | 'Reasoning'
  | 'Image'
  | 'Video'
  | 'Audio / Voice'
  | 'Embedding'
  | 'Code'
  | 'On-device';

export type Openness = 'Open weights' | 'Closed / API';

export interface AIModel {
  id: string;
  name: string;
  maker: string;
  family: string;
  category: ModelCategory;
  year: string;
  modality: string; // "text", "text+image", etc.
  openness: Openness;
  size?: string; // params if known
  notableFor: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  maker: string;
  category: string; // "Chat assistant", "Coding", "Search", "Image", ...
  what: string;
  freeTier: string;
  url: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  maker: string;
  kind: 'GPU' | 'TPU / ASIC' | 'Accelerator' | 'Inference chip';
  what: string;
  url: string;
}
