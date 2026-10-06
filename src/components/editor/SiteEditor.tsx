import React, { useState, useEffect, useRef } from 'react';
import { SiteDocument, SiteSection, SectionImage } from '../../types';
import { SandboxedPreview } from '../preview/SandboxedPreview';
import { FONT_PAIRS_CATALOG } from '../../engine/typographyLab';
import { buildDesignGenome } from '../../engine/pageComposer';
import { downloadZipBundle, downloadHtmlFile, generateExportHtml } from '../../engine/exportEngine';
import {
  Smartphone,
  Tablet,
  Monitor,
  Type,
  Palette,
  Image as ImageIcon,
  Layers,
  Download,
  Check,
  RefreshCw,
  ArrowLeft,
  FileCode,
  Sliders,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  History,
  Undo2,
  ExternalLink,
  Plus,
  AlertCircle
} from 'lucide-react';

interface SiteEditorProps {
  document: SiteDocument;
  onSave: (updated: SiteDocument) => void;
  onBack: () => void;
}

type EditorTab = 'conteudo' | 'secoes' | 'tipografia' | 'cores' | 'fotos' | 'motion' | 'versoes';

export const SiteEditor: React.FC<SiteEditorProps> = ({
  document: initialDoc,
  onSave,
  onBack
}) => {
  const [doc, setDoc] = useState<SiteDocument>(initialDoc);
  const [activeTab, setActiveTab] = useState<EditorTab>('conteudo');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [mobileViewMode, setMobileViewMode] = useState<'editor' | 'preview'>('preview');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Version snapshots for undo/restore
  const [snapshots, setSnapshots] = useState<Array<{ timestamp: string; label: string; document: SiteDocument }>>([
    {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      label: 'Versão Inicial',
      document: JSON.parse(JSON.stringify(initialDoc))
    }
  ]);

  const isInitialMount = useRef(true);
  const isDirty = useRef(false);

  // Take a snapshot before big changes
  const createSnapshot = (label: string, currentDoc: SiteDocument) => {
    setSnapshots((prev) => [
      {
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        label,
        document: JSON.parse(JSON.stringify(currentDoc))
      },
      ...prev.slice(0, 8)
    ]);
  };

  // Autosave with 700ms debounce ONLY when isDirty is true
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isDirty.current) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        onSave(doc);
        setSaveStatus('saved');
        isDirty.current = false;
        setTimeout(() => setSaveStatus('idle'), 2500);
      } catch (err) {
        setSaveStatus('error');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [doc]);

  // Outra Direção Criativa (gera novo genoma visual preservando dados)
  const handleRegenerateDirection = () => {
    createSnapshot('Antes de Nova Direção', doc);
    isDirty.current = true;
    const newSeed = Math.floor(Math.random() * 100000);
    const mockCompany = {
      id: doc.companyId,
      name: doc.companyName,
      niche: doc.niche,
      state: 'SP',
      city: 'São Paulo',
      phone: '',
      whatsapp: '',
      services: [],
      photos: [],
      crmStatus: 'NOVO' as const,
      createdAt: '',
      updatedAt: ''
    };
    const newGenome = buildDesignGenome(mockCompany, doc.tier, Math.floor(Math.random() * 20), newSeed);

    setDoc((prev) => ({
      ...prev,
      version: prev.version + 1,
      genome: newGenome,
      sections: prev.sections.map((sec) => {
        if (sec.type === 'hero') {
          return { ...sec, layoutVariant: newGenome.heroProfile.heroType };
        }
        return sec;
      })
    }));
  };

  // Reordenar seção
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === doc.sections.length - 1) return;

    isDirty.current = true;
    const newSections = [...doc.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    setDoc((prev) => ({ ...prev, sections: newSections }));
  };

  // Alternar visibilidade da seção
  const handleToggleSectionVisibility = (sectionId: string) => {
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s))
    }));
  };

  // Duplicar seção
  const handleDuplicateSection = (section: SiteSection, index: number) => {
    createSnapshot(`Duplicou ${section.title}`, doc);
    isDirty.current = true;
    const duplicated: SiteSection = {
      ...JSON.parse(JSON.stringify(section)),
      id: `${section.id}-copy-${Date.now()}`,
      title: `${section.title} (Cópia)`
    };
    const next = [...doc.sections];
    next.splice(index + 1, 0, duplicated);
    setDoc((prev) => ({ ...prev, sections: next }));
  };

  // Excluir seção
  const handleDeleteSection = (sectionId: string) => {
    if (doc.sections.length <= 2) {
      setFeedbackMessage('O site precisa ter pelo menos duas seções ativas.');
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }
    createSnapshot('Excluiu seção', doc);
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId)
    }));
  };

  // "Outra Versão da Seção": altera layout, grid, ritmo de verdade
  const handleCycleVariant = (sectionId: string) => {
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        if (sec.type === 'hero') {
          const variants = ['editorial-split', 'fullscreen-cinematic', 'oversized-type-offset'];
          const idx = variants.indexOf(sec.layoutVariant);
          return { ...sec, layoutVariant: variants[(idx + 1) % variants.length] };
        }
        if (sec.type === 'services') {
          const variants = ['editorial-numbered-list', 'asymmetric-bento', 'default'];
          const idx = variants.indexOf(sec.layoutVariant);
          return { ...sec, layoutVariant: variants[(idx + 1) % variants.length] };
        }
        return sec;
      })
    }));
  };

  // Atualizar conteúdo
  const handleUpdateContent = (sectionId: string, field: string, value: any) => {
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            content: {
              ...sec.content,
              [field]: value
            }
          };
        }
        return sec;
      })
    }));
  };

  // Selecionar par de fontes
  const handleSelectFontPair = (pairId: string) => {
    const pair = FONT_PAIRS_CATALOG.find((p) => p.id === pairId);
    if (!pair) return;
    createSnapshot(`Trocou para ${pair.heading}`, doc);
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      genome: {
        ...prev.genome,
        fontPair: pair,
        typographyProfile: {
          ...prev.genome.typographyProfile,
          headingFamily: pair.heading,
          bodyFamily: pair.body,
          headingWeight: pair.headingWeight,
          bodyWeight: pair.bodyWeight
        }
      }
    }));
  };

  // Atualizar cor
  const handleUpdateColor = (key: keyof typeof doc.genome.colorProfile, val: string) => {
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      genome: {
        ...prev.genome,
        colorProfile: {
          ...prev.genome.colorProfile,
          [key]: val
        }
      }
    }));
  };

  // Atualizar motion
  const handleUpdateMotion = (intensity: 'none' | 'subtle' | 'editorial' | 'cinematic') => {
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      genome: {
        ...prev.genome,
        motionProfile: {
          ...prev.genome.motionProfile,
          intensity
        }
      }
    }));
  };

  // Substituir imagem
  const handleReplaceImageUrl = (sectionId: string, imageIndex: number, newUrl: string) => {
    isDirty.current = true;
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id === sectionId && sec.images[imageIndex]) {
          const newImages = [...sec.images];
          newImages[imageIndex] = {
            ...newImages[imageIndex],
            url: newUrl
          };
          return { ...sec, images: newImages };
        }
        return sec;
      })
    }));
  };

  // Restaurar snapshot
  const handleRestoreSnapshot = (snapshotDoc: SiteDocument) => {
    isDirty.current = true;
    setDoc(JSON.parse(JSON.stringify(snapshotDoc)));
  };

  // Exportar HTML ou feedback
  const handleOpenInNewTab = () => {
    downloadHtmlFile(doc);
    setFeedbackMessage('Arquivo HTML baixado com sucesso!');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const heroSec = doc.sections.find((s) => s.type === 'hero');
  const aboutSec = doc.sections.find((s) => s.type === 'about');
  const servicesSec = doc.sections.find((s) => s.type === 'services');

  return (
    <div className="flex flex-col h-screen w-full bg-[#050507] text-[#FFFFFF] overflow-hidden font-sans">
      {/* TOPBAR */}
      <header className="h-14 border-b border-[rgba(255,255,255,0.08)] bg-[#0A0A0D] px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B8B8C7] hover:text-white hover:bg-[#14141A] rounded-xl transition-colors border border-[rgba(255,255,255,0.08)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Painel</span>
          </button>
          <div className="h-4 w-px bg-[rgba(255,255,255,0.08)]" />
          <span className="font-extrabold text-sm truncate max-w-[160px] sm:max-w-[200px] text-white">
            {doc.companyName}
          </span>
          <span className="text-xs text-[#9296A8] hidden sm:inline">· {doc.niche}</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#151720] text-[#FF2F87] font-bold border border-[#FF2F87]/30">
            {doc.tier}
          </span>

          {/* AUTOSAVE FEEDBACK STATUS */}
          {saveStatus === 'saving' && (
            <span className="text-xs text-amber-400 font-mono animate-pulse flex items-center gap-1">
              Salvando...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Salvo ✓
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-xs text-red-400 font-mono">
              Erro ao salvar
            </span>
          )}
        </div>

        {/* MOBILE MODE TOGGLE (SMARTPHONE ONLY) */}
        <div className="flex md:hidden items-center bg-[#050507] p-0.5 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setMobileViewMode('editor')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              mobileViewMode === 'editor' ? 'bg-[#FF2F87] text-white' : 'text-[#B8B8C7]'
            }`}
          >
            Editar
          </button>
          <button
            onClick={() => setMobileViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              mobileViewMode === 'preview' ? 'bg-[#FF2F87] text-white' : 'text-[#B8B8C7]'
            }`}
          >
            Ver Site
          </button>
        </div>

        {/* DEVICE VIEWPORT CONTROLS (DESKTOP / TABLET / MOBILE) */}
        <div className="hidden sm:flex items-center gap-1 bg-[#050507] p-1 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setViewport('desktop')}
            title="Desktop (1440px)"
            className={`p-1.5 rounded-lg transition-colors ${
              viewport === 'desktop'
                ? 'bg-[#FF2F87] text-white shadow-sm'
                : 'text-[#B8B8C7] hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            title="Tablet (768px)"
            className={`p-1.5 rounded-lg transition-colors ${
              viewport === 'tablet'
                ? 'bg-[#FF2F87] text-white shadow-sm'
                : 'text-[#B8B8C7] hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            title="Mobile (390px)"
            className={`p-1.5 rounded-lg transition-colors ${
              viewport === 'mobile'
                ? 'bg-[#FF2F87] text-white shadow-sm'
                : 'text-[#B8B8C7] hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* ACTIONS & EXPORTS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerateDirection}
            title="Gera outra direção criativa exclusiva preservando seus dados"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#14141A] hover:bg-[#181820] text-white border border-[rgba(255,255,255,0.08)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF2F87]" />
            <span>Outra Direção</span>
          </button>

          <button
            onClick={() => downloadHtmlFile(doc)}
            title="Baixar arquivo HTML autossuficiente"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#14141A] hover:bg-[#181820] text-white border border-[rgba(255,255,255,0.08)] transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>HTML</span>
          </button>

          <button
            onClick={() => downloadZipBundle(doc)}
            title="Baixar Pacote ZIP da Agência"
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] hover:from-[#FF4FA0] hover:to-[#FF2F87] text-white transition-all shadow-md shadow-[#FF2F87]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar ZIP</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT DESIGNER PANEL */}
        <aside
          className={`${
            mobileViewMode === 'editor' ? 'flex' : 'hidden'
          } md:flex w-full md:w-96 border-r border-[rgba(255,255,255,0.08)] bg-[#0A0A0D] flex-col shrink-0 overflow-hidden`}
        >
          {/* TABS */}
          <div className="flex border-b border-[rgba(255,255,255,0.08)] p-1 gap-1 bg-[#050507] shrink-0 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('conteudo')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'conteudo'
                  ? 'bg-[#151720] text-[#FF2F87]'
                  : 'text-[#B8B8C7] hover:text-white'
              }`}
            >
              Conteúdo
            </button>
            <button
              onClick={() => setActiveTab('secoes')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'secoes'
                  ? 'bg-[#151720] text-[#FF2F87]'
                  : 'text-[#B8B8C7] hover:text-white'
              }`}
            >
              Seções
            </button>
            <button
              onClick={() => setActiveTab('tipografia')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'tipografia'
                  ? 'bg-[#151720] text-[#FF2F87]'
                  : 'text-[#B8B8C7] hover:text-white'
              }`}
            >
              Fontes
            </button>
            <button
              onClick={() => setActiveTab('cores')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'cores'
                  ? 'bg-[#151720] text-[#FF2F87]'
                  : 'text-[#B8B8C7] hover:text-white'
              }`}
            >
              Cores
            </button>
            <button
              onClick={() => setActiveTab('fotos')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'fotos'
                  ? 'bg-[#151720] text-[#FF2F87]'
                  : 'text-[#B8B8C7] hover:text-white'
              }`}
            >
              Fotos
            </button>
            <button
              onClick={() => setActiveTab('motion')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'motion'
                  ? 'bg-[#151720] text-[#FF2F87]'
                  : 'text-[#B8B8C7] hover:text-white'
              }`}
            >
              Motion
            </button>
            <button
              onClick={() => setActiveTab('versoes')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'versoes'
                  ? 'bg-[#151720] text-[#FF2F87]'
                  : 'text-[#B8B8C7] hover:text-white'
              }`}
            >
              Histórico
            </button>
          </div>

          {/* TAB PANELS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            {/* 1. CONTEÚDO TAB */}
            {activeTab === 'conteudo' && (
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B8C7] block">
                  Edição de Textos e Conteúdo
                </span>

                {/* HERO COPY */}
                {heroSec && (
                  <div className="p-4 bg-[#111219] rounded-2xl border border-[rgba(255,255,255,0.07)] space-y-3">
                    <span className="text-xs font-bold text-white block">Hero (Abertura)</span>
                    <div>
                      <label className="text-[#9296A8] block mb-1">Kicker / Categoria</label>
                      <input
                        type="text"
                        value={heroSec.content.kicker || ''}
                        onChange={(e) => handleUpdateContent('sec-hero', 'kicker', e.target.value)}
                        className="w-full bg-[#09090D] border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[#9296A8] block mb-1">Título Principal (Headline)</label>
                      <textarea
                        rows={2}
                        value={heroSec.content.headline || ''}
                        onChange={(e) => handleUpdateContent('sec-hero', 'headline', e.target.value)}
                        className="w-full bg-[#09090D] border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[#9296A8] block mb-1">Subtítulo de Apoio</label>
                      <textarea
                        rows={3}
                        value={heroSec.content.subline || ''}
                        onChange={(e) => handleUpdateContent('sec-hero', 'subline', e.target.value)}
                        className="w-full bg-[#09090D] border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[#9296A8] block mb-1">Texto do Botão WhatsApp</label>
                      <input
                        type="text"
                        value={heroSec.content.primaryCtaText || ''}
                        onChange={(e) => handleUpdateContent('sec-hero', 'primaryCtaText', e.target.value)}
                        className="w-full bg-[#09090D] border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* ABOUT COPY */}
                {aboutSec && (
                  <div className="p-4 bg-[#111219] rounded-2xl border border-[rgba(255,255,255,0.07)] space-y-3">
                    <span className="text-xs font-bold text-white block">Sobre a Empresa</span>
                    <div>
                      <label className="text-[#9296A8] block mb-1">Texto Institucional</label>
                      <textarea
                        rows={4}
                        value={aboutSec.content.paragraph || ''}
                        onChange={(e) => handleUpdateContent('sec-about', 'paragraph', e.target.value)}
                        className="w-full bg-[#09090D] border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. SEÇÕES TAB (REORDENAR, DUPLICAR, OCULTAR, OUTRA VERSÃO) */}
            {activeTab === 'secoes' && (
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B8C7] block">
                  Gerenciamento de Seções
                </span>

                <div className="space-y-2">
                  {doc.sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className={`p-3.5 bg-[#111219] rounded-2xl border transition-all ${
                        sec.visible ? 'border-[rgba(255,255,255,0.08)]' : 'border-neutral-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-xs text-white block">{sec.title}</span>
                          <span className="text-[10px] text-[#9296A8] font-mono">
                            Layout: {sec.layoutVariant}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCycleVariant(sec.id)}
                            title="Trocar variante visual da seção (Outra Versão)"
                            className="p-1.5 bg-[#1A1D28] text-[#B8B8C7] hover:text-[#FF2F87] rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleSectionVisibility(sec.id)}
                            title={sec.visible ? 'Ocultar seção' : 'Exibir seção'}
                            className="p-1.5 bg-[#1A1D28] text-[#B8B8C7] hover:text-white rounded-lg transition-colors"
                          >
                            {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDuplicateSection(sec, idx)}
                            title="Duplicar seção"
                            className="p-1.5 bg-[#1A1D28] text-[#B8B8C7] hover:text-white rounded-lg transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            title="Mover para cima"
                            className="p-1.5 bg-[#1A1D28] text-[#B8B8C7] hover:text-white rounded-lg disabled:opacity-30"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === doc.sections.length - 1}
                            title="Mover para baixo"
                            className="p-1.5 bg-[#1A1D28] text-[#B8B8C7] hover:text-white rounded-lg disabled:opacity-30"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sec.id)}
                            title="Excluir seção"
                            className="p-1.5 bg-[#1A1D28] text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TIPOGRAFIA TAB */}
            {activeTab === 'tipografia' && (
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B8C7] block">
                  Pares de Fontes & Estilo
                </span>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {FONT_PAIRS_CATALOG.map((pair) => {
                    const isSelected = doc.genome.fontPair.id === pair.id;
                    return (
                      <div
                        key={pair.id}
                        onClick={() => handleSelectFontPair(pair.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#FF2F87] bg-[#151720] shadow-md shadow-[#FF2F87]/10'
                            : 'border-[rgba(255,255,255,0.08)] bg-[#111219] hover:border-[rgba(255,255,255,0.15)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{pair.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FF2F87]" />}
                        </div>
                        <p className="text-[11px] text-[#B8B8C7]">{pair.personality}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. CORES TAB */}
            {activeTab === 'cores' && (
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B8C7] block">
                  Harmonia de Cores do Projeto
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[#9296A8] block mb-1 font-semibold">Fundo Principal</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={doc.genome.colorProfile.background}
                        onChange={(e) => handleUpdateColor('background', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={doc.genome.colorProfile.background}
                        onChange={(e) => handleUpdateColor('background', e.target.value)}
                        className="bg-[#111219] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 text-xs font-mono text-white flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9296A8] block mb-1 font-semibold">Superfície / Cards</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={doc.genome.colorProfile.surface}
                        onChange={(e) => handleUpdateColor('surface', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={doc.genome.colorProfile.surface}
                        onChange={(e) => handleUpdateColor('surface', e.target.value)}
                        className="bg-[#111219] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 text-xs font-mono text-white flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9296A8] block mb-1 font-semibold">Cor Primária (Ações / Botões)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={doc.genome.colorProfile.primary}
                        onChange={(e) => handleUpdateColor('primary', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={doc.genome.colorProfile.primary}
                        onChange={(e) => handleUpdateColor('primary', e.target.value)}
                        className="bg-[#111219] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 text-xs font-mono text-white flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9296A8] block mb-1 font-semibold">Cor de Acento / Kickers</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={doc.genome.colorProfile.accent}
                        onChange={(e) => handleUpdateColor('accent', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={doc.genome.colorProfile.accent}
                        onChange={(e) => handleUpdateColor('accent', e.target.value)}
                        className="bg-[#111219] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 text-xs font-mono text-white flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. FOTOS TAB */}
            {activeTab === 'fotos' && (
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B8C7] block">
                  Fotos e Curadoria Visual
                </span>

                <div className="space-y-3">
                  {doc.sections.map((sec) => (
                    <div key={sec.id} className="p-4 bg-[#111219] rounded-2xl border border-[rgba(255,255,255,0.07)] space-y-2">
                      <span className="font-bold text-xs text-white block">{sec.title}</span>
                      {sec.images.length === 0 ? (
                        <p className="text-[11px] text-[#9296A8]">Sem imagens nesta seção.</p>
                      ) : (
                        sec.images.map((img, imgIdx) => (
                          <div key={img.id} className="space-y-2 pt-1 border-t border-[rgba(255,255,255,0.05)]">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={img.url}
                                alt={img.alt}
                                className="w-12 h-12 object-cover rounded-xl border border-[rgba(255,255,255,0.08)]"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] text-white block truncate font-medium">{img.alt}</span>
                                <span className="text-[10px] text-[#9296A8] font-mono">
                                  {img.factualOrDecorative === 'factual' ? 'Foto Real' : 'Curadoria Coerente'}
                                </span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={img.url}
                              onChange={(e) => handleReplaceImageUrl(sec.id, imgIdx, e.target.value)}
                              placeholder="URL da foto..."
                              className="w-full bg-[#09090D] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-1.5 text-[11px] text-white focus:border-[#FF2F87] outline-none"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. MOTION TAB */}
            {activeTab === 'motion' && (
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B8C7] block">
                  Intensidade de Animação & Motion
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {(['none', 'subtle', 'editorial', 'cinematic'] as const).map((lvl) => {
                    const isSelected = doc.genome.motionProfile.intensity === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => handleUpdateMotion(lvl)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#FF2F87] bg-[#151720] text-white font-bold'
                            : 'border-[rgba(255,255,255,0.08)] bg-[#111219] text-[#B8B8C7] hover:text-white'
                        }`}
                      >
                        <span className="text-xs uppercase font-mono block mb-1">
                          {lvl === 'none' ? 'Desativado' : lvl === 'subtle' ? 'Sutil' : lvl === 'editorial' ? 'Editorial' : 'Cinemático'}
                        </span>
                        <span className="text-[10px] text-[#9296A8] block">
                          {lvl === 'none' ? 'Sem efeitos' : lvl === 'subtle' ? 'Transições limpas' : lvl === 'editorial' ? 'Revelação suave' : 'Motion de agência'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7. VERSÕES & HISTÓRICO TAB */}
            {activeTab === 'versoes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B8C7] block">
                    Snapshots & Restauração
                  </span>
                  <button
                    onClick={() => createSnapshot('Snapshot Manual', doc)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#FF2F87] hover:underline font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Criar Snapshot</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {snapshots.map((snap, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#111219] rounded-xl border border-[rgba(255,255,255,0.08)] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-white block">{snap.label}</span>
                        <span className="text-[10px] font-mono text-[#9296A8]">{snap.timestamp}</span>
                      </div>
                      <button
                        onClick={() => handleRestoreSnapshot(snap.document)}
                        className="px-2.5 py-1 bg-[#1A1D28] hover:bg-[#FF2F87] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Restaurar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PREVIEW CANVAS — 100% ISOLATED IN SANDBOXED IFRAME */}
        <main
          className={`${
            mobileViewMode === 'preview' ? 'flex' : 'hidden'
          } md:flex flex-1 bg-[#050507] overflow-hidden flex-col items-center justify-center relative`}
        >
          <SandboxedPreview
            doc={doc}
            viewport={viewport}
            onOpenExternal={handleOpenInNewTab}
          />
        </main>
      </div>

      {/* FLOATING FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#14141A] border border-[#FF2F87]/60 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in font-medium">
          <AlertCircle className="w-4 h-4 text-[#FF2F87] shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}
    </div>
  );
};
