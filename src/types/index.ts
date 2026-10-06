export type Niche =
  | 'Barbearia'
  | 'Salão de Beleza'
  | 'Restaurante'
  | 'Pizzaria'
  | 'Cafeteria'
  | 'Confeitaria'
  | 'Padaria'
  | 'Clínica'
  | 'Dentista'
  | 'Academia'
  | 'Pet Shop'
  | 'Imobiliária'
  | 'Contabilidade'
  | 'Marcenaria'
  | 'Loja de Roupas'
  | 'Fotógrafo'
  | 'Eletricista'
  | 'Oficina Mecânica'
  | 'Arquitetura'
  | 'Construção'
  | 'Estética'
  | 'Fisioterapia'
  | 'Psicologia'
  | 'Outro';

export type BusinessModel =
  | 'SERVICE'
  | 'APPOINTMENT'
  | 'PRODUCT'
  | 'PORTFOLIO'
  | 'CATALOG'
  | 'MENU'
  | 'LOCAL_VISIT'
  | 'LEAD_GENERATION'
  | 'HYBRID';

export type Tier = 'PROFESSIONAL' | 'PREMIUM';

export type PageMode = 'SINGLE_PAGE' | 'MULTI_PAGE';

export type CRMStatus =
  | 'NOVO'
  | 'CONTATAR'
  | 'CONTATADO'
  | 'RESPONDEU'
  | 'INTERESSADO'
  | 'PROPOSTA'
  | 'CLIENTE'
  | 'PERDIDO';

export interface CompanyPhoto {
  id: string;
  url: string;
  caption?: string;
  role: 'hero' | 'service' | 'atmosphere' | 'detail' | 'portfolio' | 'product';
  isRealPhoto: boolean;
  focalPoint?: { x: number; y: number };
}

export interface Company {
  id: string;
  name: string;
  niche: Niche;
  subNiche?: string;
  state: string;
  city: string;
  address?: string;
  website?: string;
  instagram?: string;
  hours?: string;
  googleMapsUrl?: string;
  phone: string;
  whatsapp: string;
  services: string[];
  details?: string;
  photos: CompanyPhoto[];
  crmStatus: CRMStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Sale {
  id: string;
  companyId: string;
  companyName: string;
  siteId?: string;
  total: number;
  received: number;
  pending: number;
  status: 'PENDENTE' | 'PARCIAL' | 'PAGO' | 'CANCELADO';
  date: string;
  notes?: string;
}

export interface FontPair {
  id: string;
  name: string;
  heading: string;
  body: string;
  headingWeight: number | string;
  bodyWeight: number | string;
  personality: string;
}

export type LayoutFamily =
  | 'EDITORIAL'
  | 'ARCHITECTURAL'
  | 'CINEMATIC'
  | 'MODULAR'
  | 'MAGAZINE'
  | 'LUXURY'
  | 'MINIMAL'
  | 'PORTFOLIO_LED'
  | 'STORYTELLING'
  | 'PRODUCT_LED'
  | 'TYPOGRAPHY_LED'
  | 'IMMERSIVE'
  | 'BRUTALIST_CONTROLLED'
  | 'CRAFT_LED'
  | 'LOCAL_PREMIUM'
  | 'UTILITY_MODERN';

export interface DesignGenome {
  creativeConcept: string;
  layoutFamily: LayoutFamily;
  gridProfile: {
    containerMaxWidth: number; // e.g. 1180, 1280, 1360, 1440
    columns: number;
    gutter: number;
    horizontalPadding: number;
  };
  spacingProfile: 'COMPACT' | 'BALANCED' | 'AIRY' | 'EDITORIAL' | 'DRAMATIC';
  heroProfile: {
    heroType: string;
    headlinePosition: 'left' | 'center' | 'asymmetric-left' | 'offset-right' | 'split';
    headlineWidth: string;
    mediaDominance: 'TEXT_DOMINANT' | 'IMAGE_DOMINANT' | 'BALANCED';
    heroHeight: 'screen' | 'large' | 'compact' | 'cinematic';
  };
  sectionSequenceProfile: string[];
  typographyProfile: {
    headingFamily: string;
    bodyFamily: string;
    headingWeight: string | number;
    bodyWeight: string | number;
    typeScale: 'MODERN' | 'EDITORIAL' | 'COMPACT' | 'DRAMATIC' | 'LUXURY';
    tracking: 'tighter' | 'tight' | 'normal' | 'wide' | 'widest';
    lineHeight: 'tight' | 'snug' | 'relaxed';
    capitalization: 'none' | 'uppercase' | 'capitalize';
    headingAlignment: 'left' | 'center' | 'right';
    numberStyle: 'classic-serif' | 'technical-mono' | 'minimal-sans' | 'large-display';
  };
  fontPair: FontPair;
  imageProfile: {
    lighting: 'dramatic-warm' | 'clean-neutral' | 'moody-lowkey' | 'high-contrast' | 'natural-diffuse';
    contrast: 'high' | 'medium' | 'soft';
    cropLanguage: 'rectangular-clean' | 'soft-rounded' | 'sharp-crop' | 'editorial-offset' | 'arched-mask' | 'full-bleed' | 'inset-frame';
    frameBorder: boolean;
  };
  colorProfile: {
    background: string;
    surface: string;
    surfaceAlt: string;
    foreground: string;
    mutedForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    border: string;
    themeType: 'dark' | 'light' | 'warm-paper' | 'cream' | 'obsidian';
  };
  surfaceProfile: {
    texture: 'none' | 'paper-subtle' | 'radial-glow' | 'grid-dots' | 'split-tone';
    cardStyle: 'borderless' | 'hairline-border' | 'tinted-flat' | 'solid-contrast';
  };
  buttonProfile: {
    radius: 'rounded-none' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-full';
    variant: 'solid-bold' | 'outline-clean' | 'editorial-arrow' | 'high-contrast';
  };
  motionProfile: {
    intensity: 'none' | 'subtle' | 'editorial' | 'cinematic';
    tempo: 'fast' | 'measured' | 'slow';
    textReveal: 'fade-up' | 'mask-reveal' | 'none';
  };
  navigationProfile: {
    style: 'floating' | 'traditional' | 'transparent' | 'minimal-split';
  };
  footerProfile: {
    style: 'editorial-split' | 'minimal-brand' | 'mega-columns' | 'closing-statement';
  };
}

export interface SectionImage {
  id: string;
  url: string;
  alt: string;
  role: 'hero' | 'service' | 'atmosphere' | 'detail' | 'portfolio' | 'product';
  factualOrDecorative: 'factual' | 'decorative';
  aspectRatio: string;
  focalPoint?: { x: number; y: number };
  caption?: string;
}

export interface SiteSection {
  id: string;
  type:
    | 'hero'
    | 'statement'
    | 'services'
    | 'about'
    | 'gallery'
    | 'portfolio'
    | 'products'
    | 'menu'
    | 'process'
    | 'contact'
    | 'cta'
    | 'footer';
  title: string;
  order: number;
  visible: boolean;
  layoutVariant: string;
  content: {
    kicker?: string;
    headline?: string;
    subline?: string;
    paragraph?: string;
    primaryCtaText?: string;
    primaryCtaUrl?: string;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;
    badgeText?: string;
    items?: Array<{
      id: string;
      title: string;
      description?: string;
      price?: string;
      highlight?: boolean;
      imageUrl?: string;
      tags?: string[];
      category?: string;
    }>;
    steps?: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    quote?: {
      text: string;
      author?: string;
      role?: string;
    };
    contactInfo?: {
      address?: string;
      city?: string;
      whatsapp?: string;
      phone?: string;
      hours?: string;
    };
  };
  images: SectionImage[];
}

export interface QualityReport {
  overallScore: number;
  firstImpression: number;
  businessFit: number;
  originality: number;
  artDirection: number;
  composition: number;
  hierarchy: number;
  typography: number;
  fontPairing: number;
  imageQuality: number;
  imageCoherence: number;
  contentQuality: number;
  contentSpecificity: number;
  sectionRhythm: number;
  motionQuality: number;
  conversionClarity: number;
  mobileQuality: number;
  accessibility: number;
  performance: number;
  factualSafety: number;
  exportReadiness: number;
  critiqueNotes: string[];
}

export interface SiteDocument {
  id: string;
  source?: 'user' | 'test' | 'imported';
  status?: 'draft' | 'generating' | 'completed' | 'failed' | 'archived';
  companyId: string;
  companyName: string;
  niche: Niche;
  tier: Tier;
  pageMode: PageMode;
  version: number;
  createdAt: string;
  updatedAt: string;
  metadata: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  genome: DesignGenome;
  sections: SiteSection[];
  qualityReport: QualityReport;
  generationMeta: {
    seed: string;
    uniquenessScore: number;
    generatedAt: string;
  };
}
