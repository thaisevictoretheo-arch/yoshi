import JSZip from 'jszip';
import { SiteDocument, SiteSection } from '../types';

export function generateExportHtml(doc: SiteDocument): string {
  const g = doc.genome;
  const isDark = g.colorProfile.themeType === 'dark';

  // Fonts to load
  const fontsToLoad = [g.fontPair.heading, g.fontPair.body]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((f) => f.replace(/\s+/g, '+') + ':wght@300;400;500;600;700;800')
    .join('&family=');

  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;

  const heroSec = doc.sections.find((s) => s.type === 'hero');
  const footerSec = doc.sections.find((s) => s.type === 'footer');

  const defaultHeroImg = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80';
  const defaultAboutImg = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80';

  const waUrl = heroSec?.content.primaryCtaUrl || '#contato';
  const isWaExternal = waUrl.startsWith('http://') || waUrl.startsWith('https://');

  // Dynamic section renderers
  const renderSectionHtml = (sec: SiteSection): string => {
    switch (sec.type) {
      case 'hero': {
        const heroImg = sec.images[0]?.url || defaultHeroImg;
        const heroVariant = sec.layoutVariant || 'editorial-split';
        const primaryUrl = sec.content.primaryCtaUrl || '#contato';
        const isPrimaryExt = primaryUrl.startsWith('http');
        const secondaryUrl = sec.content.secondaryCtaUrl || '#servicos';
        const isSecondaryExt = secondaryUrl.startsWith('http');

        if (heroVariant === 'fullscreen-cinematic') {
          return `
  <!-- HERO (CINEMATIC) -->
  <section class="hero" id="topo">
    <div class="container">
      <div class="hero-cinematic">
        <img src="${heroImg}" alt="${doc.companyName}">
        <div class="hero-cinematic-overlay">
          <span class="kicker">${sec.content.kicker || 'EXCLUSIVIDADE & AUTORIDADE'}</span>
          <h1 class="hero-title" style="color: #ffffff; max-width: 800px;">${sec.content.headline || doc.companyName}</h1>
          <p class="hero-sub" style="color: #e2e8f0;">${sec.content.subline || ''}</p>
          <div class="hero-actions">
            <a href="${primaryUrl}" ${isPrimaryExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary">
              ${sec.content.primaryCtaText || 'Falar no WhatsApp'}
            </a>
            <a href="${secondaryUrl}" ${isSecondaryExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-outline" style="color: #ffffff; border-color: rgba(255,255,255,0.3);">
              ${sec.content.secondaryCtaText || 'Ver Serviços'}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
        }

        return `
  <!-- HERO (EDITORIAL SPLIT) -->
  <section class="hero" id="topo">
    <div class="container">
      <div class="hero-split-grid">
        <div class="hero-text">
          <span class="kicker">${sec.content.kicker || 'EXCELÊNCIA & DESIGN'}</span>
          <h1 class="hero-title">${sec.content.headline || doc.companyName}</h1>
          <p class="hero-sub">${sec.content.subline || ''}</p>
          <div class="hero-actions">
            <a href="${primaryUrl}" ${isPrimaryExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary">
              ${sec.content.primaryCtaText || 'Falar no WhatsApp'}
            </a>
            <a href="${secondaryUrl}" ${isSecondaryExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-outline">
              ${sec.content.secondaryCtaText || 'Ver Serviços'}
            </a>
          </div>
        </div>
        <div class="hero-media">
          <img src="${heroImg}" alt="${doc.companyName}">
        </div>
      </div>
    </div>
  </section>`;
      }

      case 'statement': {
        return `
  <!-- STATEMENT -->
  <section class="statement-section">
    <div class="container statement-content">
      <span class="kicker">${sec.content.kicker || 'NOSSA FILOSOFIA'}</span>
      <h2 class="statement-quote font-heading">${sec.content.headline || ''}</h2>
      <p style="color: var(--muted); font-size: 1.05rem;">${sec.content.paragraph || ''}</p>
    </div>
  </section>`;
      }

      case 'services': {
        const primaryUrl = sec.content.primaryCtaUrl || '#contato';
        const isPrimaryExt = primaryUrl.startsWith('http');
        const isBento = sec.layoutVariant === 'asymmetric-bento';

        return `
  <!-- SERVICES -->
  <section class="services-section" id="servicos">
    <div class="container">
      <div class="section-head">
        <span class="kicker">${sec.content.kicker || 'SERVIÇOS CONFIRMADOS'}</span>
        <h2>${sec.content.headline || 'O que oferecemos'}</h2>
        <p style="color: var(--muted); max-width: 600px; margin-top: 8px;">${sec.content.subline || ''}</p>
      </div>

      ${
        isBento
          ? `
      <div class="service-bento-grid">
        ${(sec.content.items || [])
          .map(
            (item, index) => `
          <div class="service-bento-card">
            <div>
              <span style="color: var(--accent); font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; display: block;">
                ${String(index + 1).padStart(2, '0')}
              </span>
              <h3 style="font-size: 1.35rem; margin-bottom: 10px;">${item.title}</h3>
              <p style="color: var(--muted); font-size: 0.92rem; line-height: 1.6;">${item.description || ''}</p>
            </div>
            <div style="margin-top: 24px;">
              <a href="${primaryUrl}" ${isPrimaryExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-outline" style="padding: 8px 16px; font-size: 0.82rem; width: 100%;">
                Solicitar Atendimento
              </a>
            </div>
          </div>
        `
          )
          .join('')}
      </div>`
          : `
      <div class="service-rows">
        ${(sec.content.items || [])
          .map(
            (item, index) => `
          <div class="service-row">
            <span class="service-num font-heading">${String(index + 1).padStart(2, '0')}</span>
            <span class="service-name font-heading">${item.title}</span>
            <p class="service-desc">${item.description || ''}</p>
            <a href="${primaryUrl}" ${isPrimaryExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-outline" style="padding: 8px 18px; font-size: 0.82rem;">
              Consultar
            </a>
          </div>
        `
          )
          .join('')}
      </div>`
      }
    </div>
  </section>`;
      }

      case 'about': {
        const aboutImg = sec.images[0]?.url || defaultAboutImg;
        return `
  <!-- ABOUT -->
  <section class="about-section" id="sobre">
    <div class="container about-grid">
      <div class="about-media">
        <img src="${aboutImg}" alt="${doc.companyName}">
      </div>
      <div class="about-text">
        <span class="kicker">${sec.content.kicker || 'SOBRE NÓS'}</span>
        <h2 style="font-size: clamp(2rem, 3.2vw, 2.8rem); margin-bottom: 20px;">${sec.content.headline || 'Nossa Trajetória'}</h2>
        <p style="color: var(--muted); margin-bottom: 24px; font-size: 1.05rem; line-height: 1.7;">${sec.content.paragraph || ''}</p>
        ${sec.content.quote ? `<blockquote style="border-left: 2px solid var(--accent); padding-left: 16px; font-style: italic; color: var(--fg); margin-bottom: 24px;">"${sec.content.quote.text}"</blockquote>` : ''}
        <div style="font-size: 0.9rem; color: var(--muted); line-height: 1.8;">
          <p><strong>Localização:</strong> ${sec.content.contactInfo?.address || 'Região Central'}</p>
          <p><strong>Atendimento:</strong> ${sec.content.contactInfo?.hours || 'Segunda a Sábado com horário agendado'}</p>
        </div>
      </div>
    </div>
  </section>`;
      }

      case 'process': {
        return `
  <!-- PROCESS -->
  <section class="process-section">
    <div class="container">
      <div class="section-head" style="text-align: center; max-width: 650px; margin-left: auto; margin-right: auto;">
        <span class="kicker">${sec.content.kicker || 'METODOLOGIA'}</span>
        <h2>${sec.content.headline || 'Como Trabalhamos'}</h2>
      </div>
      <div class="process-grid">
        ${(sec.content.steps || [])
          .map(
            (step) => `
          <div class="process-card">
            <span class="process-num">${step.number}</span>
            <h3 style="font-size: 1.25rem; margin-bottom: 10px;">${step.title}</h3>
            <p style="color: var(--muted); font-size: 0.92rem; line-height: 1.6;">${step.description}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>`;
      }

      case 'gallery': {
        if (!sec.images || sec.images.length === 0) return '';
        return `
  <!-- GALLERY -->
  <section class="gallery-section" id="galeria">
    <div class="container">
      <div class="section-head">
        <span class="kicker">${sec.content.kicker || 'ATMOSFERA'}</span>
        <h2>${sec.content.headline || 'Espaço & Detalhes'}</h2>
      </div>
      <div class="gallery-grid">
        ${sec.images
          .map(
            (img) => `
          <div class="gallery-item">
            <img src="${img.url}" alt="${img.alt || doc.companyName}">
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>`;
      }

      case 'cta': {
        const ctaUrl = sec.content.primaryCtaUrl || '#topo';
        const isCtaExt = ctaUrl.startsWith('http');
        return `
  <!-- CTA -->
  <section class="cta-section" id="contato">
    <div class="container cta-box">
      <span class="kicker">${sec.content.kicker || 'CONTATO IMEDIATO'}</span>
      <h2>${sec.content.headline || 'Agende seu horário com antecedência.'}</h2>
      <p>${sec.content.subline || 'Atendimento personalizado diretamente pelo WhatsApp.'}</p>
      <a href="${ctaUrl}" ${isCtaExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary" style="padding: 16px 40px; font-size: 1.05rem;">
        ${sec.content.primaryCtaText || 'Falar no WhatsApp Agora'}
      </a>
    </div>
  </section>`;
      }

      default:
        return '';
    }
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.metadata.title}</title>
  <meta name="description" content="${doc.metadata.description}">
  <meta property="og:title" content="${doc.metadata.ogTitle}">
  <meta property="og:description" content="${doc.metadata.ogDescription}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFontsUrl}" rel="stylesheet">
  <style>
    :root {
      --bg: ${g.colorProfile.background};
      --surface: ${g.colorProfile.surface};
      --surface-alt: ${g.colorProfile.surfaceAlt};
      --fg: ${g.colorProfile.foreground};
      --muted: ${g.colorProfile.mutedForeground};
      --primary: ${g.colorProfile.primary};
      --accent: ${g.colorProfile.accent};
      --border: ${g.colorProfile.border};
      --font-heading: '${g.fontPair.heading}', serif, sans-serif;
      --font-body: '${g.fontPair.body}', sans-serif;
      --max-w: ${g.gridProfile.containerMaxWidth}px;
      --radius: ${g.buttonProfile.radius === 'rounded-full' ? '9999px' : g.buttonProfile.radius === 'rounded-lg' ? '12px' : g.buttonProfile.radius === 'rounded-md' ? '8px' : '4px'};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background-color: var(--bg);
      color: var(--fg);
      font-family: var(--font-body);
      line-height: 1.6;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, .font-heading {
      font-family: var(--font-heading);
      letter-spacing: -0.02em;
      line-height: 1.15;
    }

    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; height: auto; display: block; object-fit: cover; }

    .container {
      max-width: var(--max-w);
      margin: 0 auto;
      padding: 0 24px;
    }

    .kicker {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 12px;
      display: inline-block;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: var(--radius);
      transition: all 0.25s ease;
      cursor: pointer;
      text-align: center;
    }
    .btn-primary {
      background-color: var(--primary);
      color: ${isDark ? '#000000' : '#FFFFFF'};
      border: 1px solid var(--primary);
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    .btn-outline {
      background: transparent;
      color: var(--fg);
      border: 1px solid var(--border);
    }
    .btn-outline:hover {
      background: var(--surface);
      border-color: var(--muted);
    }

    /* HEADER */
    header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: ${isDark ? 'rgba(10, 10, 13, 0.9)' : 'rgba(255, 255, 255, 0.92)'};
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 18px 0;
    }
    .nav-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-logo {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
      list-style: none;
    }
    .nav-links a {
      font-size: 0.88rem;
      color: var(--muted);
      transition: color 0.2s;
    }
    .nav-links a:hover {
      color: var(--fg);
    }

    /* HERO VARIANTS */
    .hero {
      padding: 80px 0;
      position: relative;
    }
    .hero-split-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 56px;
      align-items: center;
    }
    .hero-cinematic {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 21/9;
      box-shadow: 0 24px 60px rgba(0,0,0,0.3);
      border: 1px solid var(--border);
    }
    .hero-cinematic img { width: 100%; height: 100%; }
    .hero-cinematic-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 48px;
    }
    .hero-title {
      font-size: clamp(2.4rem, 5vw, 4.4rem);
      margin-bottom: 20px;
      font-weight: 700;
      line-height: 1.1;
    }
    .hero-sub {
      font-size: 1.15rem;
      color: var(--muted);
      margin-bottom: 32px;
      max-width: 580px;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .hero-media {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4/5;
      box-shadow: 0 24px 48px rgba(0,0,0,0.2);
      border: 1px solid var(--border);
    }
    .hero-media img {
      width: 100%;
      height: 100%;
    }

    /* STATEMENT */
    .statement-section {
      padding: 80px 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .statement-content {
      max-width: 860px;
    }
    .statement-quote {
      font-size: clamp(1.6rem, 3.2vw, 2.6rem);
      margin-bottom: 16px;
      line-height: 1.3;
      font-weight: 600;
    }

    /* SERVICES */
    .services-section {
      padding: 100px 0;
    }
    .section-head {
      margin-bottom: 56px;
    }
    .section-head h2 {
      font-size: clamp(2rem, 3.5vw, 3rem);
      margin-top: 8px;
    }
    
    /* Services: Numbered rows */
    .service-rows {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--border);
    }
    .service-row {
      display: grid;
      grid-template-columns: 80px 1.2fr 2fr 160px;
      align-items: baseline;
      padding: 32px 0;
      border-bottom: 1px solid var(--border);
      transition: background 0.2s, padding 0.2s;
    }
    .service-row:hover {
      background: var(--surface);
      padding-left: 12px;
      padding-right: 12px;
    }
    .service-num {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      color: var(--accent);
      font-weight: 700;
    }
    .service-name {
      font-size: 1.35rem;
      font-weight: 600;
    }
    .service-desc {
      color: var(--muted);
      font-size: 0.95rem;
      padding-right: 24px;
      line-height: 1.6;
    }

    /* Services: Bento grid */
    .service-bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .service-bento-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 220px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .service-bento-card:hover {
      transform: translateY(-4px);
      border-color: var(--muted);
    }

    /* ABOUT */
    .about-section {
      padding: 100px 0;
      background: var(--surface);
    }
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }
    .about-media {
      aspect-ratio: 4/3;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .about-media img { width: 100%; height: 100%; }

    /* GALLERY */
    .gallery-section {
      padding: 100px 0;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .gallery-item {
      aspect-ratio: 1/1;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
      transition: transform 0.3s;
    }
    .gallery-item:hover {
      transform: scale(1.03);
    }
    .gallery-item img { width: 100%; height: 100%; }

    /* PROCESS (PREMIUM) */
    .process-section {
      padding: 100px 0;
      border-top: 1px solid var(--border);
      background: var(--bg);
    }
    .process-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      margin-top: 48px;
    }
    .process-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      position: relative;
    }
    .process-num {
      font-size: 2rem;
      font-weight: 800;
      color: var(--accent);
      font-family: var(--font-heading);
      margin-bottom: 16px;
      display: block;
    }

    /* CTA */
    .cta-section {
      padding: 120px 0;
      background: ${isDark ? 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)' : 'var(--surface-alt)'};
      text-align: center;
      border-top: 1px solid var(--border);
    }
    .cta-box {
      max-width: 720px;
      margin: 0 auto;
    }
    .cta-box h2 {
      font-size: clamp(2.2rem, 4.5vw, 3.8rem);
      margin-bottom: 20px;
      font-weight: 700;
    }
    .cta-box p {
      color: var(--muted);
      font-size: 1.15rem;
      margin-bottom: 36px;
    }

    /* FOOTER */
    footer {
      padding: 64px 0 40px;
      border-top: 1px solid var(--border);
      background: var(--bg);
    }
    .footer-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 48px;
      flex-wrap: wrap;
      gap: 32px;
    }
    .footer-copy {
      color: var(--muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
    }

    /* RESPONSIVE QUERIES */
    @media (max-width: 900px) {
      .hero-split-grid, .about-grid { grid-template-columns: 1fr; gap: 40px; }
      .service-row { grid-template-columns: 40px 1fr; gap: 8px; }
      .service-desc { grid-column: 2 / -1; margin-top: 4px; padding-right: 0; }
      .service-row .btn { grid-column: 2 / -1; margin-top: 12px; width: fit-content; }
      .service-bento-grid { grid-template-columns: 1fr; }
      .gallery-grid { grid-template-columns: repeat(2, 1fr); }
      .process-grid { grid-template-columns: 1fr; }
      .nav-links { display: none; }
      .hero-cinematic { aspect-ratio: 16/9; }
      .hero-cinematic-overlay { padding: 24px; }
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <header>
    <div class="container nav-inner">
      <a href="#topo" class="brand-logo">${doc.companyName}</a>
      <ul class="nav-links">
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#galeria">Ambiente</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
      <a href="${waUrl}" ${isWaExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary" style="padding: 10px 22px; font-size: 0.85rem;">
        Agendar via WhatsApp
      </a>
    </div>
  </header>

  <!-- DYNAMIC SECTIONS ACCORDING TO LIVE VISIBILITY & ORDER -->
  ${doc.sections
    .filter((s) => s.visible !== false && s.type !== 'footer')
    .map((sec) => renderSectionHtml(sec))
    .join('\n')}

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand-logo" style="margin-bottom: 10px;">${doc.companyName}</div>
          <p style="color: var(--muted); font-size: 0.9rem; max-width: 320px;">${footerSec?.content.paragraph || ''}</p>
        </div>
        <div>
          <h4 style="font-size: 0.9rem; text-transform: uppercase; margin-bottom: 12px; color: var(--fg);">Navegação</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: var(--muted);">
            <li><a href="#topo">Início</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#sobre">Sobre Nós</a></li>
            <li><a href="#contato">Contato WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-copy">
        <span>© ${new Date().getFullYear()} ${doc.companyName}. Todos os direitos reservados.</span>
        <span>Projeto exclusivo gerado com YOSHI Site Engine</span>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

export async function downloadZipBundle(doc: SiteDocument): Promise<void> {
  const htmlContent = generateExportHtml(doc);
  const zip = new JSZip();

  zip.file('index.html', htmlContent);
  zip.file(
    'README.txt',
    `PROJETO CRIADO COM YOSHI SITE ENGINE V6\n` +
      `Empresa: ${doc.companyName}\n` +
      `Nicho: ${doc.niche}\n` +
      `Conceito Criativo: ${doc.genome.creativeConcept}\n` +
      `Tipografia: ${doc.genome.fontPair.heading} + ${doc.genome.fontPair.body}\n` +
      `Data de Geração: ${doc.createdAt}\n\n` +
      `COMO PUBLICAR:\n` +
      `1. O arquivo index.html é 100% autossuficiente e responsivo.\n` +
      `2. Pode ser hospedado diretamente em qualquer serviço (Vercel, Netlify, Hostinger, GitHub Pages, etc.).\n`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-site.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadHtmlFile(doc: SiteDocument): void {
  const htmlContent = generateExportHtml(doc);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
