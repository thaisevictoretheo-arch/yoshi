import { Company, CRMStatus, Sale, SiteDocument } from '../types';

const STORAGE_KEYS = {
  COMPANIES: 'yoshi_companies_v6',
  SITES: 'yoshi_sites_v6',
  SALES: 'yoshi_sales_v6',
  GENOME_HISTORY: 'yoshi_genome_history_v6'
};

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'emp-1',
    name: 'Corleone Barber Studio',
    niche: 'Barbearia',
    subNiche: 'Barbearia Clássica & Visagismo',
    state: 'SP',
    city: 'Campinas',
    address: 'Av. Coronel Silva Telles, 420 - Cambuí',
    phone: '19987654321',
    whatsapp: '19987654321',
    services: [
      'Corte de Cabelo Visagista',
      'Barba Terapia com Toalha Quente',
      'Acabamento na Navalha',
      'Tratamento Capilar & Couro Cabeludo'
    ],
    details: 'Fundada por barbeiros apaixonados pelo estilo clássico com atendimento individualizado e ambiente com música de qualidade e café especial.',
    photos: [
      {
        id: 'p-1',
        url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
        caption: 'Cadeiras de barbeiro clássicas em couro e aço escovado',
        role: 'hero',
        isRealPhoto: true,
        focalPoint: { x: 50, y: 50 }
      },
      {
        id: 'p-2',
        url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1600&q=80',
        caption: 'Finalização de degradê com tesoura e máquina de precisão',
        role: 'service',
        isRealPhoto: true,
        focalPoint: { x: 50, y: 50 }
      }
    ],
    crmStatus: 'CLIENTE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Cliente satisfeito com a proposta de agendamento online.'
  },
  {
    id: 'emp-2',
    name: 'Studio Pau-Brasil Marcenaria',
    niche: 'Marcenaria',
    subNiche: 'Mobiliário Sob Medida & Madeira Nobre',
    state: 'PR',
    city: 'Curitiba',
    address: 'Rua Desembargador Motta, 1850 - Batel',
    phone: '41991234567',
    whatsapp: '41991234567',
    services: [
      'Cozinhas & Ilhas Gourmet Planejadas',
      'Painéis Ripados e Revestimentos Acústicos',
      'Dormitórios & Closets Sob Medida',
      'Mesas em Madeira Maciça com Resina'
    ],
    details: 'Marcenaria de alto padrão focada na fusão entre marcenaria artesanal e arquitetura contemporânea.',
    photos: [
      {
        id: 'p-3',
        url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1600&q=80',
        caption: 'Bancada de trabalho artesanal com ferramentas de precisão',
        role: 'hero',
        isRealPhoto: true,
        focalPoint: { x: 50, y: 50 }
      }
    ],
    crmStatus: 'PROPOSTA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'emp-3',
    name: 'Cucina Serena Ristorante',
    niche: 'Restaurante',
    subNiche: 'Cozinha Italiana Autoral',
    state: 'SP',
    city: 'São Paulo',
    address: 'Rua Oscar Freire, 920 - Jardins',
    phone: '11988887777',
    whatsapp: '11988887777',
    services: [
      'Massas Frescas Feitas na Casa Diariamente',
      'Pratos Principais à la Carte',
      'Carta de Vinhos Italianos e Nacionais',
      'Sobremesas Artesanais Tiramisù Autoral'
    ],
    details: 'Restaurante de culinária italiana contemporânea com ambiente intimista e ingredientes importados da Toscana.',
    photos: [
      {
        id: 'p-4',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
        caption: 'Salão acolhedor iluminado à meia-luz',
        role: 'hero',
        isRealPhoto: true,
        focalPoint: { x: 50, y: 50 }
      }
    ],
    crmStatus: 'INTERESSADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'emp-4',
    name: 'Lumina Fotografia & Direção',
    niche: 'Fotógrafo',
    subNiche: 'Fotografia de Arquitetura e Ensaios Pessoais',
    state: 'SC',
    city: 'Florianópolis',
    address: 'Rua Bocaiúva, 2468 - Centro',
    phone: '48999991122',
    whatsapp: '48999991122',
    services: [
      'Fotografia de Arquitetura & Design de Interiores',
      'Ensaios Pessoais com Luz Natural',
      'Direção Visual para Marcas Autorais',
      'Cobertura Fotográfica de Pequenos Eventos'
    ],
    details: 'Fotógrafa com foco em estética documental e sensibilidade poética de luz e sombra.',
    photos: [
      {
        id: 'p-5',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80',
        caption: 'Câmera analógica e digital em estúdio com luz difusa',
        role: 'hero',
        isRealPhoto: true,
        focalPoint: { x: 50, y: 50 }
      }
    ],
    crmStatus: 'CLIENTE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    companyId: 'emp-1',
    companyName: 'Corleone Barber Studio',
    total: 3500,
    received: 3500,
    pending: 0,
    status: 'PAGO',
    date: '2026-09-15',
    notes: 'Site entregue e domínio configurado.'
  },
  {
    id: 'sale-2',
    companyId: 'emp-2',
    companyName: 'Studio Pau-Brasil Marcenaria',
    total: 4800,
    received: 2400,
    pending: 2400,
    status: 'PARCIAL',
    date: '2026-09-28',
    notes: '50% de entrada recebido na aprovação do design.'
  },
  {
    id: 'sale-3',
    companyId: 'emp-4',
    companyName: 'Lumina Fotografia & Direção',
    total: 3200,
    received: 3200,
    pending: 0,
    status: 'PAGO',
    date: '2026-10-02',
    notes: 'Projeto finalizado com galeria interativa.'
  }
];

export const storageService = {
  getCompanies(): Company[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
      return INITIAL_COMPANIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COMPANIES;
    }
  },

  saveCompany(company: Company): void {
    const companies = this.getCompanies();
    const index = companies.findIndex((c) => c.id === company.id);
    if (index >= 0) {
      companies[index] = { ...company, updatedAt: new Date().toISOString() };
    } else {
      companies.unshift(company);
    }
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  },

  deleteCompany(id: string): void {
    const companies = this.getCompanies().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  },

  getSites(): SiteDocument[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SITES);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (s: any) => s && s.source !== 'test' && (s.status === undefined || s.status === 'completed')
        );
      }
      return [];
    } catch {
      return [];
    }
  },

  getSiteById(id: string): SiteDocument | undefined {
    return this.getSites().find((s) => s.id === id);
  },

  saveSite(site: SiteDocument): void {
    if (site.source === 'test') return; // Do not persist tests into user database
    const sites = this.getSites();
    const index = sites.findIndex((s) => s.id === site.id);
    const normalizedSite: SiteDocument = {
      ...site,
      source: site.source || 'user',
      status: site.status || 'completed'
    };
    if (index >= 0) {
      sites[index] = { ...normalizedSite, updatedAt: new Date().toISOString() };
    } else {
      sites.unshift(normalizedSite);
    }
    localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(sites));

    // Also record genome in history for anti-similarity checks
    const historyRaw = localStorage.getItem(STORAGE_KEYS.GENOME_HISTORY);
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    history.push(site.genome);
    if (history.length > 30) history.shift();
    localStorage.setItem(STORAGE_KEYS.GENOME_HISTORY, JSON.stringify(history));
  },

  deleteSite(id: string): void {
    const sites = this.getSites().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(sites));
  },

  getGenomeHistory(): any[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GENOME_HISTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  getSales(): Sale[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
      return INITIAL_SALES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SALES;
    }
  },

  saveSale(sale: Sale): void {
    const sales = this.getSales();
    const index = sales.findIndex((s) => s.id === sale.id);
    if (index >= 0) {
      sales[index] = sale;
    } else {
      sales.unshift(sale);
    }
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  deleteSale(id: string): void {
    const sales = this.getSales().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  exportFullBackup(): string {
    const data = {
      version: 6,
      exportedAt: new Date().toISOString(),
      companies: this.getCompanies(),
      sites: this.getSites(),
      sales: this.getSales(),
      genomeHistory: this.getGenomeHistory()
    };
    return JSON.stringify(data, null, 2);
  },

  importFullBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.companies) localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(data.companies));
      if (data.sites) localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(data.sites));
      if (data.sales) localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(data.sales));
      return true;
    } catch {
      return false;
    }
  }
};
