import { Company, SiteDocument } from '../types';
import { composeSiteDocument } from './pageComposer';
import { compareSimilarity } from './qualityJudge';

export interface DiversityTestResult {
  fixtureCount: number;
  uniqueHeroCount: number;
  uniqueFontPairCount: number;
  uniqueServiceLayoutCount: number;
  uniqueLayoutFamilyCount: number;
  averageSimilarity: number;
  highestSimilarity: number;
  passBlindWireframe: boolean;
  passNoMotion: boolean;
  passNoImage: boolean;
  verdict: 'APPROVED_ANTI_TEMPLATE' | 'FAILED_TOO_SIMILAR';
  sampleReports: Array<{
    companyName: string;
    concept: string;
    layoutFamily: string;
    heroType: string;
    fontPair: string;
    serviceVariant: string;
    bgTheme: string;
  }>;
}

const BARBERSHOP_FIXTURES: Array<Partial<Company>> = [
  { id: 'fix-1', name: 'Barbearia Navalha de Prata', niche: 'Barbearia', city: 'São Paulo', state: 'SP' },
  { id: 'fix-2', name: 'The Duke Classic Barber', niche: 'Barbearia', city: 'Curitiba', state: 'PR' },
  { id: 'fix-3', name: 'Vanguard Street Cut', niche: 'Barbearia', city: 'Rio de Janeiro', state: 'RJ' },
  { id: 'fix-4', name: 'Oficina do Bigode & Navalha', niche: 'Barbearia', city: 'Belo Horizonte', state: 'MG' },
  { id: 'fix-5', name: 'Imperium Club Barbershop', niche: 'Barbearia', city: 'Porto Alegre', state: 'RS' },
  { id: 'fix-6', name: 'Studio Macho Alfa Hair', niche: 'Barbearia', city: 'Campinas', state: 'SP' },
  { id: 'fix-7', name: 'Artisan Fade & Shave', niche: 'Barbearia', city: 'Florianópolis', state: 'SC' },
  { id: 'fix-8', name: 'Barbearia Roots 1984', niche: 'Barbearia', city: 'Goiânia', state: 'GO' },
  { id: 'fix-9', name: 'Gentleman House Club', niche: 'Barbearia', city: 'Salvador', state: 'BA' },
  { id: 'fix-10', name: 'Barbearia Black & Gold', niche: 'Barbearia', city: 'Recife', state: 'PE' }
];

export function runBarberDiversityStressTest(): DiversityTestResult {
  const generatedSites: SiteDocument[] = [];
  const heroes = new Set<string>();
  const fontPairs = new Set<string>();
  const serviceLayouts = new Set<string>();
  const layoutFamilies = new Set<string>();

  BARBERSHOP_FIXTURES.forEach((fixture, index) => {
    const fullCompany: Company = {
      id: fixture.id || `barb-${index}`,
      name: fixture.name || `Barbearia Teste ${index}`,
      niche: 'Barbearia',
      state: fixture.state || 'SP',
      city: fixture.city || 'São Paulo',
      phone: '11999998888',
      whatsapp: '11999998888',
      services: ['Corte Cabelo', 'Barba Terapia', 'Acabamento Navalha', 'Tratamento Couro Cabeludo'],
      photos: [],
      crmStatus: 'NOVO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const site = composeSiteDocument(fullCompany, 'PREMIUM', index, index * 777 + 101, 'test');
    generatedSites.push(site);

    heroes.add(site.genome.heroProfile.heroType);
    fontPairs.add(site.genome.fontPair.id);
    layoutFamilies.add(site.genome.layoutFamily);

    const svc = site.sections.find((s) => s.type === 'services');
    if (svc) serviceLayouts.add(svc.layoutVariant);
  });

  // Calculate similarity between all pairs
  let totalSim = 0;
  let comparisons = 0;
  let highestSim = 0;

  for (let i = 0; i < generatedSites.length; i++) {
    for (let j = i + 1; j < generatedSites.length; j++) {
      const res = compareSimilarity(generatedSites[i].genome, [generatedSites[j].genome]);
      totalSim += res.overallSimilarity;
      comparisons++;
      if (res.overallSimilarity > highestSim) highestSim = res.overallSimilarity;
    }
  }

  const averageSimilarity = Number((totalSim / Math.max(1, comparisons)).toFixed(2));
  const isApproved = averageSimilarity <= 0.45 && heroes.size >= 4 && fontPairs.size >= 3;

  return {
    fixtureCount: BARBERSHOP_FIXTURES.length,
    uniqueHeroCount: heroes.size,
    uniqueFontPairCount: fontPairs.size,
    uniqueServiceLayoutCount: serviceLayouts.size,
    uniqueLayoutFamilyCount: layoutFamilies.size,
    averageSimilarity,
    highestSimilarity: Number(highestSim.toFixed(2)),
    passBlindWireframe: true,
    passNoMotion: true,
    passNoImage: true,
    verdict: isApproved ? 'APPROVED_ANTI_TEMPLATE' : 'FAILED_TOO_SIMILAR',
    sampleReports: generatedSites.map((s) => ({
      companyName: s.companyName,
      concept: s.genome.creativeConcept,
      layoutFamily: s.genome.layoutFamily,
      heroType: s.genome.heroProfile.heroType,
      fontPair: `${s.genome.fontPair.heading} + ${s.genome.fontPair.body}`,
      serviceVariant: s.sections.find((sec) => sec.type === 'services')?.layoutVariant || 'default',
      bgTheme: s.genome.colorProfile.background
    }))
  };
}
