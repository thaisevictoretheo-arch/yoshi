import React, { useState, useEffect } from 'react';
import { Company, CRMStatus, Niche, Sale, SiteDocument, Tier } from './types';
import { storageService } from './services/storageService';
import { composeSiteDocument } from './engine/pageComposer';
import { downloadZipBundle, downloadHtmlFile } from './engine/exportEngine';
import { SiteEditor } from './components/editor/SiteEditor';
import { CompanyRegisterModal } from './components/support/CompanyRegisterModal';
import { CommercialPitchModal } from './components/support/CommercialPitchModal';
import { SalesTrackerModal } from './components/support/SalesTrackerModal';
import { BRAZIL_STATES, FALLBACK_CITIES_BY_UF, fetchCitiesForState, buildGoogleMapsSearchUrl } from './data/brazilGeo';
import {
  Sparkles,
  Search,
  Building2,
  FileCode2,
  DollarSign,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  ExternalLink,
  Download,
  Edit3,
  Trash2,
  Menu,
  X,
  MapPin,
  Phone,
  Check,
  TrendingUp,
  Globe,
  MessageSquare,
  Camera,
  Layers,
  ChevronRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

type NavTab = 'home' | 'buscar' | 'empresas' | 'criar' | 'sites' | 'vendas' | 'ajustes';
type GenerationState = 'idle' | 'generating' | 'completed' | 'failed';

const NICHES: Niche[] = [
  'Barbearia',
  'Salão de Beleza',
  'Restaurante',
  'Pizzaria',
  'Cafeteria',
  'Confeitaria',
  'Padaria',
  'Clínica',
  'Dentista',
  'Academia',
  'Pet Shop',
  'Imobiliária',
  'Contabilidade',
  'Marcenaria',
  'Loja de Roupas',
  'Fotógrafo',
  'Eletricista',
  'Oficina Mecânica',
  'Arquitetura',
  'Construção',
  'Estética',
  'Fisioterapia',
  'Psicologia',
  'Outro'
];

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [sites, setSites] = useState<SiteDocument[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Generation state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<Tier>('PREMIUM');
  const [activeSite, setActiveSite] = useState<SiteDocument | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>('idle');

  // Search tab state
  const [searchNiche, setSearchNiche] = useState<Niche>('Barbearia');
  const [searchUf, setSearchUf] = useState<string>('SP');
  const [searchCity, setSearchCity] = useState<string>('São Paulo');
  const [searchCitiesList, setSearchCitiesList] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState<boolean>(false);

  const [pitchCompany, setPitchCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // In-app confirm modal and toast feedback (avoids window.alert / window.confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load
  useEffect(() => {
    const loadedCompanies = storageService.getCompanies();
    setCompanies(loadedCompanies);
    if (loadedCompanies.length > 0) {
      setSelectedCompanyId(loadedCompanies[0].id);
    }
    setSites(storageService.getSites());
    setSales(storageService.getSales());
  }, []);

  // Update cities when UF changes in search tab: AO TROCAR ESTADO: limpar Cidade!
  useEffect(() => {
    let active = true;
    setIsLoadingCities(true);
    setSearchCity(''); // Limpa a cidade imediatamente
    fetchCitiesForState(searchUf).then((list) => {
      if (active) {
        setSearchCitiesList(list);
        if (list.length > 0) {
          setSearchCity(list[0]);
        }
        setIsLoadingCities(false);
      }
    });
    return () => {
      active = false;
    };
  }, [searchUf]);

  // Handle Generate Site (ONLY when user explicitly clicks "GERAR SITE" in the Criar Site screen)
  const handleGenerateSite = () => {
    if (generationState === 'generating') return;

    const company = companies.find((c) => c.id === selectedCompanyId) || companies[0];
    if (!company) {
      showToast('Cadastre ou selecione uma empresa primeiro para poder gerar o site.');
      return;
    }

    setGenerationState('generating');
    setTimeout(() => {
      try {
        const existingCount = sites.filter((s) => s.companyId === company.id).length;
        const newDoc = composeSiteDocument(company, selectedTier, existingCount, undefined, 'user');

        storageService.saveSite(newDoc);
        setSites(storageService.getSites());
        setActiveSite(newDoc);
        setGenerationState('completed');
      } catch (err) {
        console.error('Erro ao gerar site:', err);
        setGenerationState('failed');
        showToast('Ocorreu um erro ao gerar o projeto. Tente novamente.');
      }
    }, 350);
  };

  const handleOpenEditor = (site: SiteDocument) => {
    setActiveSite(site);
  };

  const handleDeleteSite = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Projeto de Site',
      message: 'Tem certeza que deseja excluir este projeto de site?',
      onConfirm: () => {
        storageService.deleteSite(id);
        setSites(storageService.getSites());
        showToast('Projeto de site excluído com sucesso.');
      }
    });
  };

  const handleDeleteCompany = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Empresa',
      message: 'Tem certeza que deseja remover esta empresa do cadastro?',
      onConfirm: () => {
        storageService.deleteCompany(id);
        const updated = storageService.getCompanies();
        setCompanies(updated);
        if (selectedCompanyId === id && updated.length > 0) {
          setSelectedCompanyId(updated[0].id);
        }
        showToast('Empresa excluída com sucesso.');
      }
    });
  };

  const handleSaveCompany = (company: Company) => {
    storageService.saveCompany(company);
    const updated = storageService.getCompanies();
    setCompanies(updated);
    setSelectedCompanyId(company.id);
  };

  const handleUpdateCRMStatus = (companyId: string, status: CRMStatus) => {
    const comp = companies.find((c) => c.id === companyId);
    if (comp) {
      const updated = { ...comp, crmStatus: status };
      storageService.saveCompany(updated);
      setCompanies(storageService.getCompanies());
    }
  };

  // If viewing Site Editor, render isolated editor
  if (activeSite) {
    return (
      <SiteEditor
        document={activeSite}
        onSave={(updated) => {
          storageService.saveSite(updated);
          setActiveSite(updated);
          setSites(storageService.getSites());
        }}
        onBack={() => setActiveSite(null)}
      />
    );
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || (companies.length > 0 ? companies[0] : null);

  // Financial calculations
  const totalVendido = sales.reduce((acc, s) => acc + (s.total || 0), 0);
  const totalRecebido = sales.reduce((acc, s) => acc + (s.received || 0), 0);
  const totalPendente = sales.reduce((acc, s) => acc + (s.pending || 0), 0);
  const clientesConquistados = companies.filter((c) => c.crmStatus === 'CLIENTE').length;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const mapsQueryUrl = buildGoogleMapsSearchUrl(searchNiche, searchCity || 'Brasil', searchUf);

  return (
    <div className="flex h-screen w-full bg-[#050507] text-[#FFFFFF] overflow-hidden font-sans">
      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* LEFT SIDEBAR (FIXED DESKTOP, DRAWER MOBILE) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0A0A0D] border-r border-[rgba(255,255,255,0.08)] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* BRAND HEADER */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF2F87] to-[#FF4FA0] flex items-center justify-center font-black text-sm text-white shadow-lg shadow-[#FF2F87]/30">
                  Y
                </div>
                <div>
                  <span className="font-black text-lg tracking-tight text-white block leading-none">
                    YOSHI.
                  </span>
                  <span className="text-[10px] text-[#B8B8C7] font-medium tracking-wide">
                    Encontre. Crie. Venda.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-1 text-[#B8B8C7] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="p-3 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'home'
                  ? 'bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white shadow-md shadow-[#FF2F87]/25'
                  : 'text-[#B8B8C7] hover:text-white hover:bg-[#14141A]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Painel</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('buscar');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'buscar'
                  ? 'bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white shadow-md shadow-[#FF2F87]/25'
                  : 'text-[#B8B8C7] hover:text-white hover:bg-[#14141A]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('empresas');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'empresas'
                  ? 'bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white shadow-md shadow-[#FF2F87]/25'
                  : 'text-[#B8B8C7] hover:text-white hover:bg-[#14141A]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <div className="flex items-center justify-between flex-1">
                <span>Empresas</span>
                <span className="text-[10px] font-mono bg-[#181820] px-1.5 py-0.5 rounded text-[#B8B8C7]">
                  {companies.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setCurrentTab('criar');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'criar'
                  ? 'bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white shadow-md shadow-[#FF2F87]/25'
                  : 'text-[#B8B8C7] hover:text-white hover:bg-[#14141A]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <div className="flex items-center justify-between flex-1">
                <span className="font-bold">Criar Site</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#FF2F87]/20 text-[#FF2F87] rounded font-bold">
                  Pro
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setCurrentTab('sites');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'sites'
                  ? 'bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white shadow-md shadow-[#FF2F87]/25'
                  : 'text-[#B8B8C7] hover:text-white hover:bg-[#14141A]'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <div className="flex items-center justify-between flex-1">
                <span>Sites</span>
                <span className="text-[10px] font-mono bg-[#181820] px-1.5 py-0.5 rounded text-[#B8B8C7]">
                  {sites.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setCurrentTab('vendas');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'vendas'
                  ? 'bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white shadow-md shadow-[#FF2F87]/25'
                  : 'text-[#B8B8C7] hover:text-white hover:bg-[#14141A]'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Vendas</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('ajustes');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'ajustes'
                  ? 'bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white shadow-md shadow-[#FF2F87]/25'
                  : 'text-[#B8B8C7] hover:text-white hover:bg-[#14141A]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Ajustes</span>
            </button>
          </nav>
        </div>

        {/* BOTTOM BRAND FOOTER */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#050507] text-[11px] text-[#9292A3]">
          <span className="font-semibold text-white block mb-0.5">YOSHI Agency Core</span>
          <span className="text-[10px] block opacity-80">Criador de sites de alto valor</span>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050507]">
        {/* MOBILE TOPBAR */}
        <div className="md:hidden h-14 border-b border-[rgba(255,255,255,0.08)] bg-[#0A0A0D] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#B8B8C7] hover:text-white rounded-lg bg-[#14141A]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-black text-white text-sm">YOSHI.</span>
          </div>
          <button
            onClick={() => setCurrentTab('criar')}
            className="px-3 py-1.5 bg-[#FF2F87] text-white rounded-lg text-xs font-bold"
          >
            Criar Site
          </button>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 space-y-8">
          {/* 1. HOME TAB */}
          {currentTab === 'home' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* HERO HEADER */}
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono tracking-wider text-[#FF2F87] uppercase block">
                  Painel de Oportunidades
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  Seu negócio em movimento
                </h1>
                <p className="text-sm sm:text-base text-[#B8B8C7] max-w-2xl leading-relaxed">
                  Encontre oportunidades, crie sites profissionais e transforme contatos em clientes.
                </p>
              </div>

              {/* QUICK ACTIONS */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentTab('criar')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] hover:from-[#FF4FA0] hover:to-[#FF2F87] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#FF2F87]/25 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Criar Site</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentTab('buscar')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#101014] hover:bg-[#14141A] text-white rounded-xl font-semibold text-xs sm:text-sm border border-[rgba(255,255,255,0.08)] transition-colors"
                >
                  <Search className="w-4 h-4 text-[#B8B8C7]" />
                  <span>Buscar Empresa</span>
                </button>
                <button
                  onClick={() => {
                    setEditingCompany(null);
                    setIsRegisterModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#101014] hover:bg-[#14141A] text-white rounded-xl font-semibold text-xs sm:text-sm border border-[rgba(255,255,255,0.08)] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#B8B8C7]" />
                  <span>Cadastrar Empresa</span>
                </button>
              </div>

              {/* METRICS (REAL DATA ONLY) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="p-4 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                  <span className="text-[11px] text-[#B8B8C7] block font-medium">Empresas</span>
                  <span className="text-xl font-black text-white font-mono">{companies.length}</span>
                </div>
                <div className="p-4 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                  <span className="text-[11px] text-[#B8B8C7] block font-medium">Sites</span>
                  <span className="text-xl font-black text-[#FF2F87] font-mono">{sites.length}</span>
                </div>
                <div className="p-4 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                  <span className="text-[11px] text-[#B8B8C7] block font-medium">Clientes</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{clientesConquistados}</span>
                </div>
                <div className="p-4 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                  <span className="text-[11px] text-[#B8B8C7] block font-medium">Vendido</span>
                  <span className="text-lg font-black text-white font-mono">{formatBRL(totalVendido)}</span>
                </div>
                <div className="p-4 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                  <span className="text-[11px] text-[#B8B8C7] block font-medium">Recebido</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{formatBRL(totalRecebido)}</span>
                </div>
                <div className="p-4 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-xl space-y-1">
                  <span className="text-[11px] text-[#B8B8C7] block font-medium">A receber</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{formatBRL(totalPendente)}</span>
                </div>
              </div>

              {/* LIST OF RECENT COMPANIES */}
              <div className="p-6 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">Empresas para Atendimento</h2>
                    <p className="text-xs text-[#B8B8C7]">Selecione uma empresa para criar um projeto digital sob medida</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('empresas')}
                    className="text-xs text-[#FF2F87] font-semibold hover:underline"
                  >
                    Ver todas →
                  </button>
                </div>

                {companies.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#9292A3] border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl">
                    Nenhuma empresa cadastrada. Use "Buscar Empresa" ou "Cadastrar Empresa" para começar.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {companies.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="p-4 bg-[#101014] border border-[rgba(255,255,255,0.08)] rounded-xl flex flex-col justify-between space-y-3 hover:border-[#FF2F87]/40 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-xs text-white block truncate mb-1">{c.name}</span>
                          <span className="text-[11px] text-[#B8B8C7] block">{c.niche}</span>
                          <span className="text-[10px] text-[#9292A3] font-mono block mt-1">
                            {c.city} — {c.state}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCompanyId(c.id);
                            setCurrentTab('criar');
                          }}
                          className="w-full py-2 bg-[#181820] hover:bg-[#FF2F87] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Criar Site</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. BUSCAR EMPRESA TAB */}
          {currentTab === 'buscar' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Buscar Empresa no Google Maps
                </h1>
                <p className="text-xs sm:text-sm text-[#B8B8C7] mt-1">
                  Fluxo: Escolha o nicho, estado e cidade para abrir a pesquisa no Google Maps e cadastrar novos clientes.
                </p>
              </div>

              <div className="p-6 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl space-y-6">
                {/* NICHE SELECTOR */}
                <div>
                  <label className="text-xs font-bold text-white block mb-2">1. Nicho da Empresa</label>
                  <select
                    value={searchNiche}
                    onChange={(e) => setSearchNiche(e.target.value as Niche)}
                    className="w-full bg-[#101014] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-white text-xs font-medium focus:border-[#FF2F87] outline-none"
                  >
                    {NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STATE & CITY SELECTORS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white block mb-2">2. Estado (UF - 27 Estados)</label>
                    <select
                      value={searchUf}
                      onChange={(e) => setSearchUf(e.target.value)}
                      className="w-full bg-[#101014] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-white text-xs font-medium focus:border-[#FF2F87] outline-none"
                    >
                      {BRAZIL_STATES.map((s) => (
                        <option key={s.uf} value={s.uf}>
                          {s.uf} — {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white block mb-2">
                      3. Cidade {isLoadingCities && '(Carregando municípios...)'}
                    </label>
                    <select
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      disabled={isLoadingCities}
                      className="w-full bg-[#101014] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-white text-xs font-medium focus:border-[#FF2F87] outline-none disabled:opacity-50"
                    >
                      {searchCitiesList.length === 0 ? (
                        <option value="">Selecione ou aguarde o carregamento...</option>
                      ) : (
                        searchCitiesList.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* GOOGLE MAPS DIRECT SEARCH ACTION */}
                <div className="p-5 bg-[#101014] rounded-xl border border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white block mb-1">
                      Pesquisa Direta no Google Maps:
                    </span>
                    <span className="text-xs text-[#FF2F87] font-mono block">
                      "{searchNiche} {searchCity || '...'} {searchUf} Brasil"
                    </span>
                  </div>
                  <a
                    href={mapsQueryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF2F87] hover:bg-[#FF4FA0] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FF2F87]/20 shrink-0"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Pesquisar no Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* CADASTRO MANUAL DEPOIS DA BUSCA */}
                <div className="pt-2 border-t border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-[#B8B8C7]">
                    Encontrou uma empresa no Maps? Cadastre seus dados para criar o site:
                  </span>
                  <button
                    onClick={() => {
                      setEditingCompany({
                        id: `emp-${Date.now()}`,
                        name: '',
                        niche: searchNiche,
                        state: searchUf,
                        city: searchCity || 'Capital',
                        phone: '',
                        whatsapp: '',
                        services: [],
                        photos: [],
                        crmStatus: 'NOVO',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      });
                      setIsRegisterModalOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-neutral-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cadastrar Empresa</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. EMPRESAS TAB */}
          {currentTab === 'empresas' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Empresas Cadastradas
                  </h1>
                  <p className="text-xs sm:text-sm text-[#B8B8C7] mt-1">
                    Base de dados de empresas para geração e venda de sites.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCompany(null);
                    setIsRegisterModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF2F87] hover:bg-[#FF4FA0] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FF2F87]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Empresa</span>
                </button>
              </div>

              {companies.length === 0 ? (
                <div className="p-16 text-center border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl bg-[#0A0A0D] space-y-4">
                  <Building2 className="w-10 h-10 mx-auto text-[#9292A3]" />
                  <h3 className="font-bold text-base text-white">Nenhuma empresa cadastrada</h3>
                  <p className="text-xs text-[#B8B8C7] max-w-sm mx-auto">
                    Cadastre uma empresa ou busque no Google Maps para começar.
                  </p>
                  <button
                    onClick={() => {
                      setEditingCompany(null);
                      setIsRegisterModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-[#FF2F87] text-white rounded-xl text-xs font-bold"
                  >
                    Cadastrar Empresa
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companies.map((c) => (
                    <div
                      key={c.id}
                      className="p-5 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#FF2F87]/30 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="font-bold text-base text-white block">{c.name}</span>
                            <span className="text-xs text-[#FF2F87] font-semibold">{c.niche}</span>
                          </div>
                          <select
                            value={c.crmStatus}
                            onChange={(e) => handleUpdateCRMStatus(c.id, e.target.value as CRMStatus)}
                            className="bg-[#14141A] border border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white focus:border-[#FF2F87] outline-none"
                          >
                            <option value="NOVO">NOVO</option>
                            <option value="CONTATAR">CONTATAR</option>
                            <option value="CONTATADO">CONTATADO</option>
                            <option value="RESPONDEU">RESPONDEU</option>
                            <option value="INTERESSADO">INTERESSADO</option>
                            <option value="PROPOSTA">PROPOSTA</option>
                            <option value="CLIENTE">CLIENTE</option>
                            <option value="PERDIDO">PERDIDO</option>
                          </select>
                        </div>

                        <div className="space-y-1 text-xs text-[#B8B8C7]">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#9292A3]" />
                            <span>{c.city} — {c.state}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#9292A3]" />
                            <span className="font-mono">{c.whatsapp || c.phone || 'Sem contato'}</span>
                          </p>
                        </div>

                        {/* SERVICES CHIPS */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {c.services.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md bg-[#14141A] text-[#B8B8C7] text-[10px] border border-[rgba(255,255,255,0.08)]"
                            >
                              {s}
                            </span>
                          ))}
                          {c.services.length > 4 && (
                            <span className="text-[10px] text-[#9292A3] self-center">
                              +{c.services.length - 4} mais
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setPitchCompany(c);
                              setIsPitchModalOpen(true);
                            }}
                            title="Gerar Proposta Comercial"
                            className="px-3 py-1.5 rounded-lg bg-[#14141A] hover:bg-[#181820] text-xs text-white font-medium flex items-center gap-1.5 transition-colors border border-[rgba(255,255,255,0.08)]"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#FF2F87]" />
                            <span>Abordar</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingCompany(c);
                              setIsRegisterModalOpen(true);
                            }}
                            className="p-2 text-[#B8B8C7] hover:text-white rounded-lg hover:bg-[#14141A]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(c.id)}
                            className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-[#14141A]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCompanyId(c.id);
                            setCurrentTab('criar'); // Vai para a tela Criar Site para escolher o nível e gerar!
                          }}
                          className="px-4 py-2 bg-[#FF2F87] hover:bg-[#FF4FA0] text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-[#FF2F87]/20 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Criar Site</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. CRIAR SITE TAB — PRIORIDADE MÁXIMA */}
          {currentTab === 'criar' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#FF2F87] block mb-1">
                  CRIAÇÃO DE SITES SOB MEDIDA
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Criar Site
                </h1>
                <p className="text-xs sm:text-sm text-[#B8B8C7] mt-1">
                  Cada empresa recebe um projeto digital sob medida, com tipografia, direção de arte e conversão para WhatsApp.
                </p>
              </div>

              {companies.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl bg-[#0A0A0D] space-y-4">
                  <Building2 className="w-12 h-12 mx-auto text-[#FF2F87]" />
                  <h3 className="font-bold text-lg text-white">Nenhuma empresa selecionada</h3>
                  <p className="text-xs text-[#B8B8C7] max-w-md mx-auto">
                    Para criar um site profissional sob medida, primeiro cadastre a empresa ou pesquise no Google Maps.
                  </p>
                  <button
                    onClick={() => {
                      setEditingCompany(null);
                      setIsRegisterModalOpen(true);
                    }}
                    className="px-6 py-3 bg-[#FF2F87] hover:bg-[#FF4FA0] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#FF2F87]/25"
                  >
                    + Cadastrar Empresa Agora
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl space-y-6">
                  {/* SELEÇÃO DA EMPRESA */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-white uppercase tracking-wider">
                        Criar Site para:
                      </label>
                      <button
                        onClick={() => {
                          setEditingCompany(null);
                          setIsRegisterModalOpen(true);
                        }}
                        className="text-xs text-[#FF2F87] hover:underline font-semibold"
                      >
                        + Cadastrar outra empresa
                      </button>
                    </div>

                    <select
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full bg-[#101014] border border-[rgba(255,255,255,0.08)] rounded-xl p-3.5 text-white text-xs font-bold focus:border-[#FF2F87] outline-none"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.niche} ({c.city}/{c.state})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* RESUMO DOS DADOS DA EMPRESA */}
                  {selectedCompany && (
                    <div className="p-5 bg-[#101014] rounded-xl border border-[rgba(255,255,255,0.08)] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-white block">{selectedCompany.name}</span>
                          <span className="text-xs text-[#FF2F87] font-semibold">{selectedCompany.niche}</span>
                        </div>
                        <span className="text-xs text-[#B8B8C7] font-mono">
                          {selectedCompany.city} — {selectedCompany.state}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#B8B8C7]">
                        <div>
                          <span className="block text-[10px] text-[#9292A3]">WhatsApp de Contato</span>
                          <span className="text-white font-mono font-semibold">{selectedCompany.whatsapp || 'Não informado'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#9292A3]">Fotos Disponíveis</span>
                          <span className="text-white font-semibold">{selectedCompany.photos.length} fotos cadastradas</span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] text-[#9292A3] mb-1.5">Serviços Confirmados:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCompany.services.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 bg-[#14141A] rounded-lg text-[11px] text-white border border-[rgba(255,255,255,0.08)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ESCOLHA: PROFESSIONAL VS PREMIUM */}
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
                      Escolha o Nível de Projeto:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setSelectedTier('PROFESSIONAL')}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          selectedTier === 'PROFESSIONAL'
                            ? 'border-[#FF2F87] bg-[#14141A] shadow-lg shadow-[#FF2F87]/15'
                            : 'border-[rgba(255,255,255,0.08)] bg-[#101014] hover:border-[rgba(255,255,255,0.15)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-sm text-white">Professional</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0A0D] text-[#B8B8C7]">
                            6–8 Seções
                          </span>
                        </div>
                        <p className="text-xs text-[#B8B8C7] leading-relaxed">
                          Site excelente, visual profissional, boa copy, boas imagens, layout forte e ótimo custo-benefício.
                        </p>
                      </div>

                      <div
                        onClick={() => setSelectedTier('PREMIUM')}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          selectedTier === 'PREMIUM'
                            ? 'border-[#FF2F87] bg-[#14141A] shadow-lg shadow-[#FF2F87]/15'
                            : 'border-[rgba(255,255,255,0.08)] bg-[#101014] hover:border-[rgba(255,255,255,0.15)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-sm text-white">Premium</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF2F87]/20 text-[#FF2F87] font-bold">
                            Superior
                          </span>
                        </div>
                        <p className="text-xs text-[#B8B8C7] leading-relaxed">
                          Site mais sofisticado, direção de arte mais forte, layout exclusivo, fontes refinadas, mais riqueza visual, mais impacto e motion suave.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BOTOES DE AÇÃO */}
                  <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-end gap-3">
                    {selectedCompany && (
                      <button
                        onClick={() => {
                          setEditingCompany(selectedCompany);
                          setIsRegisterModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#101014] hover:bg-[#14141A] text-[#B8B8C7] hover:text-white font-semibold text-xs border border-[rgba(255,255,255,0.08)] transition-colors"
                      >
                        Editar dados da empresa
                      </button>
                    )}
                    <button
                      onClick={handleGenerateSite}
                      disabled={generationState === 'generating'}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] hover:from-[#FF4FA0] hover:to-[#FF2F87] text-white font-black text-sm rounded-xl transition-all shadow-xl shadow-[#FF2F87]/25 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      {generationState === 'generating' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Criando site...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>GERAR SITE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. SITES TAB */}
          {currentTab === 'sites' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Sites Criados
                  </h1>
                  <p className="text-xs sm:text-sm text-[#B8B8C7] mt-1">
                    Projetos digitais prontos para apresentação ao cliente ou exportação direta.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('criar')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF2F87] hover:bg-[#FF4FA0] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FF2F87]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar Novo Site</span>
                </button>
              </div>

              {sites.length === 0 ? (
                <div className="p-16 text-center border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl bg-[#0A0A0D] space-y-4">
                  <FileCode2 className="w-10 h-10 mx-auto text-[#9292A3]" />
                  <h3 className="font-bold text-base text-white">Nenhum site criado ainda</h3>
                  <p className="text-xs text-[#B8B8C7] max-w-sm mx-auto">
                    Os sites só são criados quando você escolhe a empresa e clica em "GERAR SITE".
                  </p>
                  <button
                    onClick={() => setCurrentTab('criar')}
                    className="px-5 py-2.5 bg-[#FF2F87] hover:bg-[#FF4FA0] text-white rounded-xl text-xs font-bold"
                  >
                    Ir para Criar Site
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sites.map((site) => (
                    <div
                      key={site.id}
                      className="p-5 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl space-y-4 hover:border-[#FF2F87]/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="font-bold text-base text-white block">{site.companyName}</span>
                            <span className="text-xs text-[#FF2F87] font-semibold">{site.niche}</span>
                          </div>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#101014] text-[#B8B8C7] border border-[rgba(255,255,255,0.08)] font-semibold">
                            {site.tier}
                          </span>
                        </div>

                        <div className="p-3 bg-[#101014] rounded-xl text-xs space-y-1 text-[#B8B8C7]">
                          <p>
                            <strong className="text-white">Tipografia:</strong> {site.genome.fontPair.heading} + {site.genome.fontPair.body}
                          </p>
                          <p>
                            <strong className="text-white">Layout:</strong> {site.genome.creativeConcept}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => downloadHtmlFile(site)}
                            title="Baixar HTML puro"
                            className="px-2.5 py-1.5 rounded-lg bg-[#14141A] hover:bg-[#181820] text-[#B8B8C7] hover:text-white text-xs font-semibold flex items-center gap-1 border border-[rgba(255,255,255,0.08)]"
                          >
                            <FileCode2 className="w-3.5 h-3.5" />
                            <span>HTML</span>
                          </button>
                          <button
                            onClick={() => downloadZipBundle(site)}
                            title="Baixar Pacote ZIP da Agência"
                            className="px-2.5 py-1.5 rounded-lg bg-[#14141A] hover:bg-[#181820] text-[#B8B8C7] hover:text-white text-xs font-semibold flex items-center gap-1 border border-[rgba(255,255,255,0.08)]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>ZIP</span>
                          </button>
                          <button
                            onClick={() => {
                              const comp = companies.find((c) => c.id === site.companyId);
                              if (comp) {
                                setPitchCompany(comp);
                                setIsPitchModalOpen(true);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#14141A] hover:bg-[#181820] text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-[rgba(255,255,255,0.08)]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Vender</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteSite(site.id)}
                            className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-[#14141A]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditor(site)}
                            className="px-4 py-2 bg-white text-black font-bold rounded-xl text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Abrir Editor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. VENDAS TAB */}
          {currentTab === 'vendas' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Faturamento & Vendas
                  </h1>
                  <p className="text-xs sm:text-sm text-[#B8B8C7] mt-1">
                    Acompanhe valores negociados, entradas e saldo a receber por projeto.
                  </p>
                </div>
                <button
                  onClick={() => setIsSalesModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF2F87] hover:bg-[#FF4FA0] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FF2F87]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Venda</span>
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl">
                  <span className="text-xs text-[#B8B8C7] block mb-1">Total Vendido</span>
                  <span className="text-2xl font-black text-white font-mono">{formatBRL(totalVendido)}</span>
                </div>
                <div className="p-6 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl">
                  <span className="text-xs text-emerald-400 block mb-1">Recebido</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">{formatBRL(totalRecebido)}</span>
                </div>
                <div className="p-6 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl">
                  <span className="text-xs text-amber-400 block mb-1">A Receber</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">{formatBRL(totalPendente)}</span>
                </div>
              </div>

              {/* LIST OF SALES */}
              <div className="bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101014] text-[#B8B8C7] border-b border-[rgba(255,255,255,0.08)] font-mono text-[10px]">
                    <tr>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Recebido</th>
                      <th className="p-4">Pendente</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.08)]">
                    {sales.map((s) => (
                      <tr key={s.id} className="hover:bg-[#101014]/50">
                        <td className="p-4 font-bold text-white">{s.companyName}</td>
                        <td className="p-4 text-[#B8B8C7] font-mono">{s.date}</td>
                        <td className="p-4 font-mono text-white">{formatBRL(s.total)}</td>
                        <td className="p-4 font-mono text-emerald-400">{formatBRL(s.received)}</td>
                        <td className="p-4 font-mono text-amber-400">{formatBRL(s.pending)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                              s.status === 'PAGO'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                : s.status === 'PARCIAL'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                : 'bg-[#14141A] text-[#B8B8C7]'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. AJUSTES TAB */}
          {currentTab === 'ajustes' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Ajustes & Backup
                </h1>
                <p className="text-xs sm:text-sm text-[#B8B8C7] mt-1">
                  Gerencie o armazenamento e exporte seus dados com segurança.
                </p>
              </div>

              <div className="p-6 bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl space-y-4">
                <span className="text-xs font-bold text-white block">Backup Completo dos Dados</span>
                <p className="text-xs text-[#B8B8C7] leading-relaxed">
                  Baixe todos os dados salvos no YOSHI (empresas, fotos, sites criados e vendas) em um arquivo JSON.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      const backupJson = storageService.exportFullBackup();
                      const blob = new Blob([backupJson], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `yoshi-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-5 py-2.5 bg-[#14141A] hover:bg-[#181820] text-white rounded-xl text-xs font-semibold border border-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Backup (JSON)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      <CompanyRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setEditingCompany(null);
        }}
        onSave={handleSaveCompany}
        initialCompany={editingCompany}
      />

      {/* PITCH COMMERCIAL MODAL */}
      {pitchCompany && (
        <CommercialPitchModal
          isOpen={isPitchModalOpen}
          onClose={() => {
            setIsPitchModalOpen(false);
            setPitchCompany(null);
          }}
          company={pitchCompany}
          site={sites.find((s) => s.companyId === pitchCompany.id)}
        />
      )}

      {/* SALES MODAL */}
      <SalesTrackerModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        sales={sales}
        companies={companies}
        onSaveSale={(sale) => {
          storageService.saveSale(sale);
          setSales(storageService.getSales());
        }}
        onDeleteSale={(id) => {
          storageService.deleteSale(id);
          setSales(storageService.getSales());
        }}
      />

      {/* IN-APP CONFIRMATION DIALOG */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-sm w-full bg-[#0A0A0D] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-white">
              <AlertCircle className="w-5 h-5 text-[#FF2F87]" />
              <h3 className="font-extrabold text-sm">{confirmDialog.title}</h3>
            </div>
            <p className="text-xs text-[#B8B8C7] leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#B8B8C7] hover:text-white bg-[#14141A] hover:bg-[#181820] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-md shadow-red-600/20"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14141A] border border-[#FF2F87]/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in font-medium">
          <Sparkles className="w-4 h-4 text-[#FF2F87] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
