import React, { useState } from 'react';
import { Company, SiteDocument } from '../../types';
import { MessageSquare, Copy, Check, ExternalLink, X, Send } from 'lucide-react';

interface CommercialPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  site?: SiteDocument;
}

type ToneType = 'direto' | 'consultivo' | 'exclusivo';

export const CommercialPitchModal: React.FC<CommercialPitchModalProps> = ({
  isOpen,
  onClose,
  company,
  site
}) => {
  const [tone, setTone] = useState<ToneType>('direto');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const cleanPhone = company.whatsapp ? company.whatsapp.replace(/\D/g, '') : '';

  const generatePitchText = (): string => {
    const niche = company.niche;
    const city = company.city || 'sua região';

    if (tone === 'direto') {
      return `Olá! Vi o trabalho da ${company.name} em ${city} e notei a alta qualidade em ${niche}.\n\nPara facilitar o agendamento de novos clientes direto pelo celular, estruturei uma demonstração de site moderno e rápido para a ${company.name}.\n\nFicou excelente e com botão direto para o seu WhatsApp. Posso te enviar o link da prévia sem compromisso?`;
    }

    if (tone === 'consultivo') {
      return `Olá! Acompanho o mercado de ${niche} em ${city} e percebi que muitos clientes hoje pesquisam antes de fechar contato.\n\nDesenvolvi um projeto digital focado em autoridade e agendamento rápido no WhatsApp para a ${company.name}.\n\nO site já está estruturado com seus serviços confirmados. Gostaria de dar uma olhada na demonstração?`;
    }

    // Exclusivo
    return `Olá! Tudo bem?\n\nCriamos projetos digitais de alta conversão para empresas de referência e preparamos uma direção visual sob medida para a ${company.name}.\n\nO site conta com tipografia elegante, navegação perfeita no smartphone e integração com WhatsApp.\n\nFizemos uma versão ao vivo da página. Posso compartilhar o link com você?`;
  };

  const pitchText = generatePitchText();
  const waShareUrl = cleanPhone
    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(pitchText)}`
    : '#';

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#0E1016] border border-[#1D2230] rounded-2xl shadow-2xl p-6 text-[#F5F7FB]">
        <div className="flex items-center justify-between pb-4 border-b border-[#1D2230]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#FF2F87]" />
            <h2 className="text-base font-extrabold text-white">Proposta Comercial</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#B8B8C7] hover:text-white rounded-lg hover:bg-[#161A22]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 pt-4 text-xs">
          {/* TONE SELECTOR */}
          <div>
            <label className="text-[#B8B8C7] block mb-1 font-semibold">Tom da Mensagem</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTone('direto')}
                className={`py-2 px-3 rounded-xl border font-semibold transition-all ${
                  tone === 'direto'
                    ? 'bg-[#161A22] border-[#FF2F87] text-white shadow-sm'
                    : 'bg-[#050507] border-[#1D2230] text-[#B8B8C7] hover:text-white'
                }`}
              >
                Direto & Ágil
              </button>
              <button
                type="button"
                onClick={() => setTone('consultivo')}
                className={`py-2 px-3 rounded-xl border font-semibold transition-all ${
                  tone === 'consultivo'
                    ? 'bg-[#161A22] border-[#FF2F87] text-white shadow-sm'
                    : 'bg-[#050507] border-[#1D2230] text-[#B8B8C7] hover:text-white'
                }`}
              >
                Consultivo
              </button>
              <button
                type="button"
                onClick={() => setTone('exclusivo')}
                className={`py-2 px-3 rounded-xl border font-semibold transition-all ${
                  tone === 'exclusivo'
                    ? 'bg-[#161A22] border-[#FF2F87] text-white shadow-sm'
                    : 'bg-[#050507] border-[#1D2230] text-[#B8B8C7] hover:text-white'
                }`}
              >
                Exclusivo
              </button>
            </div>
          </div>

          {/* MESSAGE PREVIEW */}
          <div>
            <label className="text-[#B8B8C7] block mb-1 font-semibold">Mensagem Formatada</label>
            <textarea
              rows={7}
              readOnly
              value={pitchText}
              className="w-full bg-[#050507] border border-[#1D2230] rounded-xl p-3 text-white leading-relaxed font-sans text-xs focus:outline-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#161A22] hover:bg-[#1D1D27] text-white rounded-xl font-semibold border border-[#1D2230] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Mensagem'}</span>
            </button>

            {cleanPhone ? (
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Enviar no WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-[#9292A3] text-xs italic">WhatsApp não informado</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
