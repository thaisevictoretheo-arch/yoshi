import { FontPair } from '../types';

export const FONT_PAIRS_CATALOG: FontPair[] = [
  {
    id: 'cormorant-instrument',
    name: 'Quiet Luxury — Cormorant + Instrument Sans',
    heading: 'Cormorant Garamond',
    body: 'Instrument Sans',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Refined, architectural, quiet luxury, high-end craftsmanship'
  },
  {
    id: 'bodoni-manrope',
    name: 'High Fashion — Bodoni Moda + Manrope',
    heading: 'Bodoni Moda',
    body: 'Manrope',
    headingWeight: 700,
    bodyWeight: 400,
    personality: 'Dramatic contrast, editorial authority, luxury beauty'
  },
  {
    id: 'fraunces-instrumentsans',
    name: 'Artisan Warmth — Fraunces + Instrument Sans',
    heading: 'Fraunces',
    body: 'Instrument Sans',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Warm, organic, crafted, tactile, boutique culinary & coffee'
  },
  {
    id: 'dmserif-plusjakarta',
    name: 'Modern Heritage — DM Serif Display + Plus Jakarta Sans',
    heading: 'DM Serif Display',
    body: 'Plus Jakarta Sans',
    headingWeight: 400,
    bodyWeight: 400,
    personality: 'Approachable prestige, hospitality, culinary classics'
  },
  {
    id: 'spacegrotesk-dmsans',
    name: 'Urban Precision — Space Grotesk + DM Sans',
    heading: 'Space Grotesk',
    body: 'DM Sans',
    headingWeight: 700,
    bodyWeight: 400,
    personality: 'Technical, geometric, modern industrial, street culture'
  },
  {
    id: 'barlowcondensed-inter',
    name: 'Bold Athletic — Barlow Condensed + Inter',
    heading: 'Barlow Condensed',
    body: 'Inter',
    headingWeight: 700,
    bodyWeight: 400,
    personality: 'High energy, athletic, condensed editorial, barbershop & fitness'
  },
  {
    id: 'playfair-inter',
    name: 'Classic Editorial — Playfair Display + Inter',
    heading: 'Playfair Display',
    body: 'Inter',
    headingWeight: 700,
    bodyWeight: 400,
    personality: 'Timeless magazine, established heritage, bespoke studios'
  },
  {
    id: 'archivo-manrope',
    name: 'Industrial Modern — Archivo + Manrope',
    heading: 'Archivo',
    body: 'Manrope',
    headingWeight: 700,
    bodyWeight: 400,
    personality: 'Sturdy, technical, precision engineering & craft workshop'
  },
  {
    id: 'lora-manrope',
    name: 'Humanist Clinical — Lora + Manrope',
    heading: 'Lora',
    body: 'Manrope',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Calm, empathetic, medical, dental, wellness'
  },
  {
    id: 'spectral-instrumentsans',
    name: 'Literary Calm — Spectral + Instrument Sans',
    heading: 'Spectral',
    body: 'Instrument Sans',
    headingWeight: 500,
    bodyWeight: 400,
    personality: 'Thoughtful, psychology, legal, advisory'
  },
  {
    id: 'oswald-instrumentsans',
    name: 'Street Edge — Oswald + Instrument Sans',
    heading: 'Oswald',
    body: 'Instrument Sans',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Impactful, raw barbershop, tattoo, motorcycle, bold'
  },
  {
    id: 'sora-inter',
    name: 'Digital Neo-Grotesk — Sora + Inter',
    heading: 'Sora',
    body: 'Inter',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Crisp, contemporary, aesthetic clinic, forward-looking'
  },
  {
    id: 'outfit-dmsans',
    name: 'Warm Contemporary — Outfit + DM Sans',
    heading: 'Outfit',
    body: 'DM Sans',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Friendly, modern pet shop, playful gourmet, bakery'
  },
  {
    id: 'prata-dmsans',
    name: 'Haute Atelier — Prata + DM Sans',
    heading: 'Prata',
    body: 'DM Sans',
    headingWeight: 400,
    bodyWeight: 400,
    personality: 'Art-book elegance, photography, high-end bridal & jewelry'
  },
  {
    id: 'ibmplex-sourceserif',
    name: 'Technical Authority — IBM Plex Sans + Source Serif 4',
    heading: 'IBM Plex Sans',
    body: 'Source Serif 4',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Financial, accounting, structural engineering'
  },
  {
    id: 'urbanist-inter',
    name: 'Geometric Chic — Urbanist + Inter',
    heading: 'Urbanist',
    body: 'Inter',
    headingWeight: 700,
    bodyWeight: 400,
    personality: 'Clean architecture, real estate, interior design'
  },
  {
    id: 'ebgaramond-manrope',
    name: 'Classical Heritage — EB Garamond + Manrope',
    heading: 'EB Garamond',
    body: 'Manrope',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Academic, legal, architecture, quiet luxury'
  },
  {
    id: 'newsreader-outfit',
    name: 'Editorial Clarity — Newsreader + Outfit',
    heading: 'Newsreader',
    body: 'Outfit',
    headingWeight: 600,
    bodyWeight: 400,
    personality: 'Contemporary journalism, fine arts, modern storytelling'
  }
];

export function getFontPairById(id: string): FontPair {
  return FONT_PAIRS_CATALOG.find((p) => p.id === id) || FONT_PAIRS_CATALOG[0];
}

export function pickFontPairForConcept(niche: string, concept: string, seed: number): FontPair {
  // Map niches to high-synergy candidate sets
  const nicheCandidates: Record<string, string[]> = {
    'Barbearia': ['barlowcondensed-inter', 'oswald-instrumentsans', 'spacegrotesk-dmsans', 'archivo-manrope', 'cormorant-instrument'],
    'Salão de Beleza': ['bodoni-manrope', 'cormorant-instrument', 'playfair-inter', 'sora-inter'],
    'Restaurante': ['fraunces-instrumentsans', 'dmserif-plusjakarta', 'playfair-inter', 'cormorant-instrument'],
    'Pizzaria': ['barlowcondensed-inter', 'spacegrotesk-dmsans', 'fraunces-instrumentsans'],
    'Cafeteria': ['fraunces-instrumentsans', 'lora-manrope', 'sora-inter', 'cormorant-instrument'],
    'Confeitaria': ['dmserif-plusjakarta', 'fraunces-instrumentsans', 'playfair-inter'],
    'Padaria': ['lora-manrope', 'fraunces-instrumentsans', 'archivo-manrope'],
    'Clínica': ['lora-manrope', 'sora-inter', 'spectral-instrumentsans'],
    'Dentista': ['sora-inter', 'lora-manrope', 'spectral-instrumentsans'],
    'Academia': ['barlowcondensed-inter', 'archivo-manrope', 'spacegrotesk-dmsans'],
    'Pet Shop': ['outfit-dmsans', 'sora-inter', 'fraunces-instrumentsans'],
    'Imobiliária': ['urbanist-inter', 'cormorant-instrument', 'playfair-inter'],
    'Contabilidade': ['ibmplex-sourceserif', 'spectral-instrumentsans', 'lora-manrope'],
    'Marcenaria': ['fraunces-instrumentsans', 'cormorant-instrument', 'archivo-manrope'],
    'Loja de Roupas': ['bodoni-manrope', 'barlowcondensed-inter', 'spacegrotesk-dmsans', 'cormorant-instrument'],
    'Fotógrafo': ['prata-dmsans', 'cormorant-instrument', 'bodoni-manrope', 'playfair-inter'],
    'Eletricista': ['archivo-manrope', 'spacegrotesk-dmsans', 'barlowcondensed-inter'],
    'Oficina Mecânica': ['archivo-manrope', 'barlowcondensed-inter', 'spacegrotesk-dmsans'],
    'Arquitetura': ['cormorant-instrument', 'urbanist-inter', 'bodoni-manrope', 'spacegrotesk-dmsans'],
    'Construção': ['archivo-manrope', 'barlowcondensed-inter', 'ibmplex-sourceserif'],
    'Estética': ['cormorant-instrument', 'bodoni-manrope', 'dmserif-plusjakarta', 'sora-inter'],
    'Fisioterapia': ['lora-manrope', 'sora-inter', 'spectral-instrumentsans'],
    'Psicologia': ['spectral-instrumentsans', 'lora-manrope', 'cormorant-instrument']
  };

  const pool = nicheCandidates[niche] || FONT_PAIRS_CATALOG.map((f) => f.id);
  const selectedId = pool[Math.abs(seed) % pool.length];
  return getFontPairById(selectedId);
}
