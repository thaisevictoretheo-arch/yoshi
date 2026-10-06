import React, { useMemo, useState } from 'react';
import { SiteDocument } from '../../types';
import { generateExportHtml } from '../../engine/exportEngine';
import { Maximize2, Minimize2, ExternalLink } from 'lucide-react';

interface SandboxedPreviewProps {
  doc: SiteDocument;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  className?: string;
  onOpenExternal?: () => void;
}

export const SandboxedPreview: React.FC<SandboxedPreviewProps> = ({
  doc,
  viewport = 'desktop',
  className = '',
  onOpenExternal
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Generate pristine HTML string for iframe
  const htmlContent = useMemo(() => {
    return generateExportHtml(doc);
  }, [doc]);

  const widthStyle =
    viewport === 'mobile'
      ? '390px'
      : viewport === 'tablet'
      ? '768px'
      : '100%';

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center overflow-hidden p-2 sm:p-4 ${className}`}>
      {/* PREVIEW CONTAINER */}
      <div
        style={{
          width: isFullscreen ? '100%' : widthStyle,
          height: '100%',
          maxWidth: isFullscreen ? '100%' : viewport === 'desktop' ? '1440px' : widthStyle
        }}
        className={`transition-all duration-300 mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.08)] bg-[#050507] flex flex-col relative ${
          isFullscreen ? 'fixed inset-4 z-[120] bg-[#050507]' : ''
        }`}
      >
        {/* PREVIEW MINI HEADER */}
        <div className="h-9 px-4 bg-[#0A0A0D] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] font-mono text-[#B8B8C7] ml-2 truncate max-w-[200px]">
              {doc.companyName} — {viewport.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Reduzir tela' : 'Tela cheia'}
              className="p-1 text-[#9296A8] hover:text-white rounded hover:bg-[#151720] transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            {onOpenExternal && (
              <button
                onClick={onOpenExternal}
                title="Abrir em nova aba"
                className="p-1 text-[#9296A8] hover:text-white rounded hover:bg-[#151720] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* SANDBOXED IFRAME */}
        <iframe
          title={`Preview - ${doc.companyName}`}
          srcDoc={htmlContent}
          sandbox="allow-scripts allow-same-origin allow-popups"
          className="w-full h-full flex-1 border-0 bg-transparent block"
        />
      </div>
    </div>
  );
};
