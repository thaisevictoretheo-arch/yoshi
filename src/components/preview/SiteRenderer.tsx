import React from 'react';
import { SiteDocument } from '../../types';
import { ExternalLink, MessageCircle, Phone, ArrowUpRight, Check, MapPin, Clock } from 'lucide-react';

interface SiteRendererProps {
  doc: SiteDocument;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  blindWireframe?: boolean;
  noMotion?: boolean;
  noImages?: boolean;
}

export const SiteRenderer: React.FC<SiteRendererProps> = ({
  doc,
  viewport = 'desktop',
  blindWireframe = false,
  noMotion = false,
  noImages = false
}) => {
  const g = doc.genome;
  const isDark = g.colorProfile.themeType === 'dark';

  // Find key sections
  const heroSec = doc.sections.find((s) => s.type === 'hero' && s.visible);
  const statementSec = doc.sections.find((s) => s.type === 'statement' && s.visible);
  const servicesSec = doc.sections.find((s) => s.type === 'services' && s.visible);
  const aboutSec = doc.sections.find((s) => s.type === 'about' && s.visible);
  const gallerySec = doc.sections.find((s) => s.type === 'gallery' && s.visible);
  const processSec = doc.sections.find((s) => s.type === 'process' && s.visible);
  const ctaSec = doc.sections.find((s) => s.type === 'cta' && s.visible);
  const footerSec = doc.sections.find((s) => s.type === 'footer' && s.visible);

  // Styling rules (override when Blind Wireframe or No-Motion is enabled)
  const bgStyle = blindWireframe ? '#FFFFFF' : g.colorProfile.background;
  const surfaceStyle = blindWireframe ? '#F4F4F5' : g.colorProfile.surface;
  const fgStyle = blindWireframe ? '#09090B' : g.colorProfile.foreground;
  const mutedStyle = blindWireframe ? '#71717A' : g.colorProfile.mutedForeground;
  const borderStyle = blindWireframe ? '#E4E4E7' : g.colorProfile.border;
  const accentStyle = blindWireframe ? '#09090B' : g.colorProfile.accent;
  const primaryBg = blindWireframe ? '#18181B' : g.colorProfile.primary;
  const primaryFg = blindWireframe ? '#FFFFFF' : isDark ? '#000000' : '#FFFFFF';

  const headingFont = blindWireframe ? 'system-ui, sans-serif' : g.fontPair.heading;
  const bodyFont = blindWireframe ? 'system-ui, sans-serif' : g.fontPair.body;

  // Render Image Helper
  const renderImage = (
    imgUrl: string | undefined,
    altText: string,
    aspectRatio: string = '16/9',
    className: string = ''
  ) => {
    if (noImages || blindWireframe || !imgUrl) {
      return (
        <div
          style={{ aspectRatio, backgroundColor: blindWireframe ? '#E4E4E7' : g.colorProfile.surfaceAlt }}
          className={`flex flex-col items-center justify-center p-4 text-center border ${className}`}
        >
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            [ Espaço Visual: {altText.slice(0, 30)} ]
          </span>
        </div>
      );
    }
    return (
      <div style={{ aspectRatio }} className={`overflow-hidden relative ${className}`}>
        <img
          src={imgUrl}
          alt={altText}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
      </div>
    );
  };

  const containerWidthClass =
    viewport === 'mobile' ? 'max-w-sm px-4' : viewport === 'tablet' ? 'max-w-2xl px-6' : 'px-8';

  return (
    <div
      style={{
        backgroundColor: bgStyle,
        color: fgStyle,
        fontFamily: bodyFont
      }}
      className={`min-h-full w-full mx-auto select-none overflow-x-hidden ${noMotion ? 'motion-reduce' : ''}`}
    >
      {/* 1. NAVIGATION SHELL */}
      <nav
        style={{
          borderBottom: `1px solid ${borderStyle}`,
          backgroundColor: isDark ? 'rgba(15, 17, 21, 0.9)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)'
        }}
        className="sticky top-0 z-40 py-4 transition-colors"
      >
        <div
          style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
          className={`mx-auto flex items-center justify-between ${containerWidthClass}`}
        >
          <div className="flex items-center gap-3">
            <span
              style={{ fontFamily: headingFont }}
              className="text-xl font-bold tracking-tight"
            >
              {doc.companyName}
            </span>
          </div>

          {viewport !== 'mobile' && (
            <div className="flex items-center gap-8 text-sm">
              <a href="#servicos" style={{ color: mutedStyle }} className="hover:opacity-80 transition-opacity">
                Serviços
              </a>
              <a href="#sobre" style={{ color: mutedStyle }} className="hover:opacity-80 transition-opacity">
                Sobre Nós
              </a>
              <a href="#galeria" style={{ color: mutedStyle }} className="hover:opacity-80 transition-opacity">
                Ambiente
              </a>
              <a href="#contato" style={{ color: mutedStyle }} className="hover:opacity-80 transition-opacity">
                Contato
              </a>
            </div>
          )}

          <a
            href={heroSec?.content.primaryCtaUrl || '#contato'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: primaryBg,
              color: primaryFg,
              borderRadius: g.buttonProfile.radius === 'rounded-full' ? '9999px' : '4px'
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-transform hover:scale-[1.02] shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* 2. HERO ENGINE */}
      {heroSec && (
        <header className="relative pt-12 pb-20 md:py-24 border-b" style={{ borderColor: borderStyle }}>
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto ${containerWidthClass}`}
          >
            {/* HERO VARIANT: EDITORIAL SPLIT */}
            {g.heroProfile.heroType === 'editorial-split' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  {heroSec.content.kicker && (
                    <span
                      style={{ color: accentStyle }}
                      className="text-xs uppercase tracking-widest font-semibold block"
                    >
                      {heroSec.content.kicker}
                    </span>
                  )}
                  <h1
                    style={{ fontFamily: headingFont }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]"
                  >
                    {heroSec.content.headline}
                  </h1>
                  <p style={{ color: mutedStyle }} className="text-base sm:text-lg leading-relaxed max-w-xl">
                    {heroSec.content.subline}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <a
                      href={heroSec.content.primaryCtaUrl || '#contato'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: primaryBg, color: primaryFg }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded transition-transform hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{heroSec.content.primaryCtaText || 'Falar no WhatsApp'}</span>
                    </a>
                    <a
                      href="#servicos"
                      style={{ borderColor: borderStyle, color: fgStyle }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded border hover:bg-neutral-500/10 transition-colors"
                    >
                      <span>{heroSec.content.secondaryCtaText || 'Ver Serviços'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="md:col-span-5">
                  {renderImage(heroSec.images[0]?.url, heroSec.images[0]?.alt || doc.companyName, '4/5', 'rounded shadow-2xl')}
                </div>
              </div>
            )}

            {/* HERO VARIANT: FULLSCREEN CINEMATIC */}
            {g.heroProfile.heroType === 'fullscreen-cinematic' && (
              <div className="space-y-8">
                <div className="relative rounded overflow-hidden shadow-2xl border" style={{ borderColor: borderStyle }}>
                  {renderImage(heroSec.images[0]?.url, heroSec.images[0]?.alt || doc.companyName, '21/9', 'w-full')}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-14">
                    <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold mb-3">
                      {heroSec.content.kicker}
                    </span>
                    <h1
                      style={{ fontFamily: headingFont }}
                      className="text-3xl sm:text-4xl md:text-6xl font-bold text-white max-w-4xl tracking-tight leading-tight mb-4"
                    >
                      {heroSec.content.headline}
                    </h1>
                    <p className="text-neutral-300 max-w-2xl text-sm md:text-base mb-6">
                      {heroSec.content.subline}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href={heroSec.content.primaryCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: primaryBg, color: primaryFg }}
                        className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded transition-transform hover:scale-105"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{heroSec.content.primaryCtaText}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HERO VARIANT: OVERSIZED TYPE OFFSET / DEFAULT */}
            {g.heroProfile.heroType !== 'editorial-split' && g.heroProfile.heroType !== 'fullscreen-cinematic' && (
              <div className="space-y-10">
                <div className="max-w-4xl space-y-4">
                  <div className="flex items-center gap-3">
                    <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold">
                      {heroSec.content.kicker}
                    </span>
                    <span style={{ color: mutedStyle }} className="text-xs">·</span>
                    <span style={{ color: mutedStyle }} className="text-xs">
                      {heroSec.content.badgeText || doc.niche}
                    </span>
                  </div>
                  <h1
                    style={{ fontFamily: headingFont }}
                    className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
                  >
                    {heroSec.content.headline}
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-8">
                    {renderImage(heroSec.images[0]?.url, heroSec.images[0]?.alt || doc.companyName, '16/9', 'rounded shadow-xl')}
                  </div>
                  <div className="md:col-span-4 space-y-6">
                    <p style={{ color: mutedStyle }} className="text-base leading-relaxed">
                      {heroSec.content.subline}
                    </p>
                    <div className="space-y-3">
                      <a
                        href={heroSec.content.primaryCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: primaryBg, color: primaryFg }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded transition-transform hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{heroSec.content.primaryCtaText}</span>
                      </a>
                      <a
                        href="#servicos"
                        style={{ borderColor: borderStyle }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded border hover:bg-neutral-500/10 transition-colors"
                      >
                        <span>{heroSec.content.secondaryCtaText}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* 3. STATEMENT / MANIFESTO (TEXT-DOMINANT RHYTHM BREAK) */}
      {statementSec && (
        <section
          style={{ backgroundColor: surfaceStyle, borderColor: borderStyle }}
          className="py-16 md:py-24 border-b"
        >
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto ${containerWidthClass}`}
          >
            <div className="max-w-3xl space-y-4">
              <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold block">
                {statementSec.content.kicker}
              </span>
              <p
                style={{ fontFamily: headingFont }}
                className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug"
              >
                "{statementSec.content.headline}"
              </p>
              {statementSec.content.paragraph && (
                <p style={{ color: mutedStyle }} className="text-base leading-relaxed pt-2">
                  {statementSec.content.paragraph}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. SERVICES SECTION ENGINE */}
      {servicesSec && (
        <section id="servicos" className="py-20 md:py-28 border-b" style={{ borderColor: borderStyle }}>
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto ${containerWidthClass}`}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="space-y-3 max-w-xl">
                <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold block">
                  {servicesSec.content.kicker}
                </span>
                <h2 style={{ fontFamily: headingFont }} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  {servicesSec.content.headline}
                </h2>
              </div>
              <p style={{ color: mutedStyle }} className="max-w-md text-sm sm:text-base">
                {servicesSec.content.subline}
              </p>
            </div>

            {/* SERVICE PRESENTATION VARIANT: EDITORIAL NUMBERED LIST */}
            {servicesSec.layoutVariant === 'editorial-numbered-list' && (
              <div className="divide-y" style={{ borderColor: borderStyle }}>
                {servicesSec.content.items?.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{ borderColor: borderStyle }}
                    className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline transition-colors hover:bg-neutral-500/5 px-2 rounded"
                  >
                    <div className="md:col-span-1">
                      <span style={{ color: accentStyle, fontFamily: headingFont }} className="text-xl font-bold">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="md:col-span-4">
                      <h3 style={{ fontFamily: headingFont }} className="text-xl sm:text-2xl font-semibold">
                        {item.title}
                      </h3>
                    </div>
                    <div className="md:col-span-5">
                      <p style={{ color: mutedStyle }} className="text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <a
                        href={servicesSec.content.primaryCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ borderColor: borderStyle }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded border hover:bg-neutral-500/10 transition-colors"
                      >
                        <span>Consultar</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SERVICE PRESENTATION VARIANT: ASYMMETRIC BENTO GRID */}
            {servicesSec.layoutVariant === 'asymmetric-bento' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {servicesSec.content.items?.map((item, idx) => {
                  const isFeatured = idx === 0;
                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: isFeatured ? surfaceStyle : 'transparent',
                        borderColor: borderStyle
                      }}
                      className={`p-8 rounded border flex flex-col justify-between space-y-6 ${
                        isFeatured ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span style={{ color: accentStyle }} className="text-xs font-mono font-semibold">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {isFeatured && (
                            <span style={{ color: accentStyle }} className="text-xs uppercase tracking-wider font-semibold">
                              Destaque Principal
                            </span>
                          )}
                        </div>
                        <h3
                          style={{ fontFamily: headingFont }}
                          className={`font-semibold mb-3 ${isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}
                        >
                          {item.title}
                        </h3>
                        <p style={{ color: mutedStyle }} className="text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <a
                        href={servicesSec.content.primaryCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity"
                        style={{ color: accentStyle }}
                      >
                        <span>Pedir Detalhes</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SERVICE PRESENTATION VARIANT: DEFAULT CARD COMPOSITION */}
            {servicesSec.layoutVariant !== 'editorial-numbered-list' && servicesSec.layoutVariant !== 'asymmetric-bento' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {servicesSec.content.items?.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{ borderColor: borderStyle }}
                    className="p-6 rounded border space-y-4 hover:border-neutral-400 transition-colors"
                  >
                    <span style={{ color: accentStyle }} className="text-xs font-mono font-bold block">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 style={{ fontFamily: headingFont }} className="text-xl font-semibold">
                      {item.title}
                    </h3>
                    <p style={{ color: mutedStyle }} className="text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. ABOUT SECTION */}
      {aboutSec && (
        <section id="sobre" style={{ backgroundColor: surfaceStyle, borderColor: borderStyle }} className="py-20 md:py-28 border-b">
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto ${containerWidthClass}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-6">
                {renderImage(aboutSec.images[0]?.url, aboutSec.images[0]?.alt || 'Espaço da empresa', '4/3', 'rounded shadow-xl')}
              </div>
              <div className="md:col-span-6 space-y-6">
                <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold block">
                  {aboutSec.content.kicker}
                </span>
                <h2 style={{ fontFamily: headingFont }} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  {aboutSec.content.headline}
                </h2>
                <p style={{ color: mutedStyle }} className="text-base sm:text-lg leading-relaxed">
                  {aboutSec.content.paragraph}
                </p>
                {aboutSec.content.quote && (
                  <blockquote
                    style={{ borderColor: accentStyle }}
                    className="border-l-2 pl-4 py-1 italic text-sm sm:text-base font-serif"
                  >
                    "{aboutSec.content.quote.text}"
                  </blockquote>
                )}
                {aboutSec.content.contactInfo && (
                  <div className="pt-4 border-t space-y-2 text-sm" style={{ borderColor: borderStyle, color: mutedStyle }}>
                    {aboutSec.content.contactInfo.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span>{aboutSec.content.contactInfo.address}</span>
                      </div>
                    )}
                    {aboutSec.content.contactInfo.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span>{aboutSec.content.contactInfo.hours}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. GALLERY ENGINE */}
      {gallerySec && gallerySec.images.length > 0 && (
        <section id="galeria" className="py-20 md:py-28 border-b" style={{ borderColor: borderStyle }}>
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto ${containerWidthClass}`}
          >
            <div className="max-w-2xl mb-12 space-y-3">
              <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold block">
                {gallerySec.content.kicker}
              </span>
              <h2 style={{ fontFamily: headingFont }} className="text-3xl sm:text-4xl font-bold tracking-tight">
                {gallerySec.content.headline}
              </h2>
              <p style={{ color: mutedStyle }} className="text-sm sm:text-base">
                {gallerySec.content.subline}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallerySec.images.map((img) => (
                <div key={img.id} className="rounded overflow-hidden">
                  {renderImage(img.url, img.alt, '1/1', 'w-full h-full')}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. PROCESS SECTION (TIER PREMIUM) */}
      {processSec && (
        <section className="py-20 border-b" style={{ borderColor: borderStyle }}>
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto ${containerWidthClass}`}
          >
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold">
                {processSec.content.kicker}
              </span>
              <h2 style={{ fontFamily: headingFont }} className="text-3xl sm:text-4xl font-bold">
                {processSec.content.headline}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {processSec.content.steps?.map((step) => (
                <div key={step.number} style={{ borderColor: borderStyle }} className="p-6 rounded border space-y-3">
                  <span style={{ color: accentStyle, fontFamily: headingFont }} className="text-3xl font-bold">
                    {step.number}
                  </span>
                  <h3 style={{ fontFamily: headingFont }} className="text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p style={{ color: mutedStyle }} className="text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CALL TO ACTION / CONVERSION */}
      {ctaSec && (
        <section id="contato" style={{ backgroundColor: surfaceStyle }} className="py-24 md:py-32 text-center">
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto max-w-2xl ${containerWidthClass} space-y-6`}
          >
            <span style={{ color: accentStyle }} className="text-xs uppercase tracking-widest font-semibold block">
              {ctaSec.content.kicker}
            </span>
            <h2 style={{ fontFamily: headingFont }} className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              {ctaSec.content.headline}
            </h2>
            <p style={{ color: mutedStyle }} className="text-base sm:text-lg">
              {ctaSec.content.subline}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={ctaSec.content.primaryCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: primaryBg, color: primaryFg }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{ctaSec.content.primaryCtaText}</span>
              </a>
              {ctaSec.content.secondaryCtaText && (
                <a
                  href={ctaSec.content.secondaryCtaUrl}
                  style={{ borderColor: borderStyle }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium rounded border hover:bg-neutral-500/10 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{ctaSec.content.secondaryCtaText}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. FOOTER */}
      {footerSec && (
        <footer style={{ borderTop: `1px solid ${borderStyle}` }} className="py-12">
          <div
            style={{ maxWidth: `${g.gridProfile.containerMaxWidth}px` }}
            className={`mx-auto ${containerWidthClass}`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm" style={{ color: mutedStyle }}>
              <div>
                <span style={{ fontFamily: headingFont, color: fgStyle }} className="font-bold text-lg block mb-1">
                  {doc.companyName}
                </span>
                <p className="text-xs">{footerSec.content.paragraph}</p>
              </div>
              <div className="text-xs text-right">
                <p>© {new Date().getFullYear()} {doc.companyName}. Todos os direitos reservados.</p>
                <p className="mt-1 opacity-70">Design exclusivo gerado sob medida por YOSHI V6</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
