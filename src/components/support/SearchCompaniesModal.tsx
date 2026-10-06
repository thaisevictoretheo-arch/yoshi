import React, { useState, useEffect } from 'react';
import { BRAZIL_STATES, fetchCitiesForState, buildGoogleMapsSearchUrl } from '../../data/brazilGeo';
import { Niche, Company } from '../../types';
import { NICHE_PLAYBOOKS } from '../../engine/playbooks';
import { Search, MapPin, ExternalLink, Plus, X, Globe } from 'lucide-react';

interface SearchCompaniesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd: (company: Company) => void;
}

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

export const SearchCompaniesModal: React.FC<SearchCompaniesModalProps> = ({
  isOpen,
  onClose,
  onQuickAdd
}) => {
  const [selectedUf, setSelectedUf] = useState<string>('SP');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('São Paulo');
  const [selectedNiche, setSelectedNiche] = useState<Niche>('Barbearia');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCities(true);
    fetchCitiesForState(selectedUf).then((list) => {
      if (isMounted) {
        setCities(list);
        setSelectedCity(list[0] || 'Capital');
        setIsLoadingCities(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedUf]);

  if (!isOpen) return null;

  const mapsUrl = buildGoogleMapsSearchUrl(selectedNiche, selectedCity, selectedUf);

  const handleRegisterAndCreate = () => {
    if (!companyName.trim()) return;

    const playbook = NICHE_PLAYBOOKS[selectedNiche] || NICHE_PLAYBOOKS['Outro'];
    const newCompany: Company = {
      id: `emp-${Date.now()}`,
      name: companyName.trim(),
      niche: selectedNiche,
      state: selectedUf,
      city: selectedCity,
      phone: phone.replace(/\D/g, ''),
      whatsapp: phone.replace(/\D/g, ''),
      services: playbook.commonServices,
      photos: [],
      crmStatus: 'NOVO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onQuickAdd(newCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 text-neutral-100">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-neutral-400" />
            <h2 className="text-base font-semibold">Buscar Empresas no Google Maps</h2>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 pt-4 text-xs">
          {/* NICHE SELECTOR */}
          <div>
            <label className="text-neutral-400 block mb-1 font-medium">Nicho da Empresa</label>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value as Niche)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* STATE & CITY (27 UFs) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1 font-medium">Estado (UF)</label>
              <select
                value={selectedUf}
                onChange={(e) => setSelectedUf(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
              >
                {BRAZIL_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1 font-medium">
                Cidade {isLoadingCities && '(Carregando...)'}
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={isLoadingCities}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DIRECT GOOGLE MAPS LAUNCH */}
          <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
            <span className="text-neutral-300 font-medium block">
              1. Encontre prospects locais no Google Maps:
            </span>
            <p className="text-neutral-400 text-[11px]">
              Pesquise por empresas sem site ou com sites desatualizados na região selecionada.
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Abrir Busca no Google Maps</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </div>

          {/* QUICK ONBOARDING FROM MAPS */}
          <div className="space-y-3 pt-2">
            <span className="text-neutral-300 font-medium block">
              2. Encontrou uma empresa? Cadastre aqui:
            </span>
            <div>
              <label className="text-neutral-400 block mb-1">Nome da Empresa</label>
              <input
                type="text"
                placeholder="Ex: Barbearia Dom Pedro"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">WhatsApp / Telefone (com DDD)</label>
              <input
                type="text"
                placeholder="Ex: 11987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleRegisterAndCreate}
              disabled={!companyName.trim()}
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-40 transition-colors"
            >
              Cadastrar & Criar Site Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
