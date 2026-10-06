import React, { useState } from 'react';
import { Company, CompanyPhoto, Niche } from '../../types';
import { BRAZIL_STATES, FALLBACK_CITIES_BY_UF, fetchCitiesForState } from '../../data/brazilGeo';
import { NICHE_PLAYBOOKS } from '../../engine/playbooks';
import { X, Upload, Plus, Trash2, Camera, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface CompanyRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Company) => void;
  initialCompany?: Company | null;
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

export const CompanyRegisterModal: React.FC<CompanyRegisterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCompany
}) => {
  const [name, setName] = useState<string>(initialCompany?.name || '');
  const [niche, setNiche] = useState<Niche>(initialCompany?.niche || 'Barbearia');
  const [state, setState] = useState<string>(initialCompany?.state || 'SP');
  const [city, setCity] = useState<string>(initialCompany?.city || 'São Paulo');
  const [whatsapp, setWhatsapp] = useState<string>(initialCompany?.whatsapp || '');
  const [services, setServices] = useState<string[]>(
    initialCompany?.services && initialCompany.services.length > 0
      ? initialCompany.services
      : NICHE_PLAYBOOKS['Barbearia'].commonServices
  );
  const [newServiceText, setNewServiceText] = useState<string>('');

  // + Mais Informações (toggle)
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const [website, setWebsite] = useState<string>(initialCompany?.website || '');
  const [instagram, setInstagram] = useState<string>(initialCompany?.instagram || '');
  const [address, setAddress] = useState<string>(initialCompany?.address || '');
  const [hours, setHours] = useState<string>(initialCompany?.hours || '');
  const [details, setDetails] = useState<string>(initialCompany?.details || '');
  const [notes, setNotes] = useState<string>(initialCompany?.notes || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(initialCompany?.googleMapsUrl || '');
  const [photos, setPhotos] = useState<CompanyPhoto[]>(initialCompany?.photos || []);

  const [citiesList, setCitiesList] = useState<string[]>(FALLBACK_CITIES_BY_UF[state] || ['São Paulo']);

  // Reset or initialize form whenever modal opens or target company changes
  React.useEffect(() => {
    if (isOpen) {
      setName(initialCompany?.name || '');
      const currentNiche = initialCompany?.niche || 'Barbearia';
      setNiche(currentNiche);
      const currentUf = initialCompany?.state || 'SP';
      setState(currentUf);
      setCity(initialCompany?.city || 'São Paulo');
      setWhatsapp(initialCompany?.whatsapp || initialCompany?.phone || '');
      setServices(
        initialCompany?.services && initialCompany.services.length > 0
          ? initialCompany.services
          : (NICHE_PLAYBOOKS[currentNiche] || NICHE_PLAYBOOKS['Outro']).commonServices
      );
      setWebsite(initialCompany?.website || '');
      setInstagram(initialCompany?.instagram || '');
      setAddress(initialCompany?.address || '');
      setHours(initialCompany?.hours || '');
      setDetails(initialCompany?.details || '');
      setNotes(initialCompany?.notes || '');
      setGoogleMapsUrl(initialCompany?.googleMapsUrl || '');
      setPhotos(initialCompany?.photos ? [...initialCompany.photos] : []);
      setNewServiceText('');
      setShowMoreInfo(false);

      fetchCitiesForState(currentUf).then((list) => {
        setCitiesList(list);
        if (initialCompany?.city) {
          setCity(initialCompany.city);
        } else if (list.length > 0) {
          setCity(list[0]);
        }
      });
    }
  }, [isOpen, initialCompany]);

  if (!isOpen) return null;

  const handleStateChange = (newUf: string) => {
    setState(newUf);
    setCity(''); // AO TROCAR ESTADO: limpar cidade!
    fetchCitiesForState(newUf).then((list) => {
      setCitiesList(list);
      if (list.length > 0) setCity(list[0]);
    });
  };

  const handleNicheChange = (newNiche: Niche) => {
    setNiche(newNiche);
    const playbook = NICHE_PLAYBOOKS[newNiche] || NICHE_PLAYBOOKS['Outro'];
    setServices(playbook.commonServices);
  };

  const handleAddService = () => {
    const trimmed = newServiceText.trim();
    if (trimmed && !services.includes(trimmed)) {
      setServices([...services, trimmed]);
      setNewServiceText('');
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter((s) => s !== serviceToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: CompanyPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            url: event.target.result as string,
            caption: file.name,
            role: photos.length === 0 ? 'hero' : 'service',
            isRealPhoto: true,
            focalPoint: { x: 50, y: 50 }
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedCompany: Company = {
      id: initialCompany?.id || `emp-${Date.now()}`,
      name: name.trim(),
      niche,
      state,
      city: city || 'Capital',
      address: address.trim() || undefined,
      website: website.trim() || undefined,
      instagram: instagram.trim() || undefined,
      hours: hours.trim() || undefined,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
      phone: whatsapp.replace(/\D/g, ''),
      whatsapp: whatsapp.replace(/\D/g, ''),
      services,
      details: details.trim() || undefined,
      notes: notes.trim() || undefined,
      photos,
      crmStatus: initialCompany?.crmStatus || 'NOVO',
      createdAt: initialCompany?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0E1016] border border-[#1D2230] rounded-2xl shadow-2xl p-6 text-[#F5F7FB] my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#1D2230]">
          <h2 className="text-base font-extrabold text-white">
            {initialCompany ? 'Editar Empresa' : 'Cadastrar Empresa'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-[#B8B8C7] hover:text-white rounded-lg hover:bg-[#161A22]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* 1. NOME */}
          <div>
            <label className="text-[#B8B8C7] block mb-1 font-semibold">Nome da Empresa *</label>
            <input
              type="text"
              required
              placeholder="Ex: Barbearia Don Corleone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
            />
          </div>

          {/* 2. NICHO & WHATSAPP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#B8B8C7] block mb-1 font-semibold">Nicho *</label>
              <select
                value={niche}
                onChange={(e) => handleNicheChange(e.target.value as Niche)}
                className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#B8B8C7] block mb-1 font-semibold">WhatsApp (com DDD) *</label>
              <input
                type="text"
                required
                placeholder="Ex: 11999998888"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:border-[#FF2F87] outline-none"
              />
            </div>
          </div>

          {/* 3. ESTADO & CIDADE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#B8B8C7] block mb-1 font-semibold">Estado (UF)</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
              >
                {BRAZIL_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf} — {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#B8B8C7] block mb-1 font-semibold">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Blumenau"
                className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
              />
            </div>
          </div>

          {/* 4. SERVIÇOS CONFIRMADOS COM CHIPS ORGANIZADOS */}
          <div>
            <label className="text-[#B8B8C7] block mb-1 font-semibold">
              Serviços Confirmados
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Adicionar serviço (ex: Corte Degradê)..."
                value={newServiceText}
                onChange={(e) => setNewServiceText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddService();
                  }
                }}
                className="flex-1 bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2 text-white text-xs focus:border-[#FF2F87] outline-none"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="px-3.5 py-2 bg-[#181820] hover:bg-[#1D1D27] text-white rounded-xl font-semibold border border-[#1D2230] transition-colors"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#050507] rounded-xl border border-[#1D2230]">
              {services.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#161A22] rounded-lg text-white text-[11px] border border-[#1D2230]"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(s)}
                    className="text-[#9292A3] hover:text-[#FF2F87] text-xs font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 5. TOGGLE: + MAIS INFORMAÇÕES */}
          <div className="pt-2 border-t border-[#1D2230]">
            <button
              type="button"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF2F87] hover:text-[#FF4FA0] transition-colors"
            >
              {showMoreInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showMoreInfo ? 'Ocultar Informações Adicionais' : '+ Mais Informações (Fotos, Endereço, Instagram, etc.)'}</span>
            </button>
          </div>

          {showMoreInfo && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9292A3] block mb-1">Instagram (@empresa)</label>
                  <input
                    type="text"
                    placeholder="Ex: @barbeariadon"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2 text-white text-xs focus:border-[#FF2F87] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#9292A3] block mb-1">Site Atual (se houver)</label>
                  <input
                    type="text"
                    placeholder="Ex: https://donbarber.com.br"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2 text-white text-xs focus:border-[#FF2F87] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#9292A3] block mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Rua XV de Novembro, 820 - Centro"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2 text-white text-xs focus:border-[#FF2F87] outline-none"
                />
              </div>

              <div>
                <label className="text-[#9292A3] block mb-1">Horário de Funcionamento</label>
                <input
                  type="text"
                  placeholder="Ex: Seg a Sáb das 09:00 às 20:00"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2 text-white text-xs focus:border-[#FF2F87] outline-none"
                />
              </div>

              <div>
                <label className="text-[#9292A3] block mb-1">Descrição / Posicionamento</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Atendimento focado em pontualidade e produtos nobres."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-[#161A22] border border-[#1D2230] rounded-xl px-3 py-2 text-white text-xs focus:border-[#FF2F87] outline-none"
                />
              </div>

              {/* FOTOS REAIS UPLOAD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#9292A3]">Fotos do Cliente / Espaço</label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-[#181820] hover:bg-[#1D1D27] text-white rounded-lg text-xs font-medium border border-[#1D2230]">
                    <Upload className="w-3.5 h-3.5 text-[#FF2F87]" />
                    <span>Upload de Fotos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {photos.length === 0 ? (
                  <div className="border border-dashed border-[#1D2230] rounded-xl p-3 text-center text-[#9292A3] text-[11px]">
                    Nenhuma foto cadastrada. O motor usará curadoria profissional de alta resolução.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-28 overflow-y-auto p-1 bg-[#050507] rounded-xl border border-[#1D2230]">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-video bg-[#181820]">
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="pt-3 flex justify-end gap-2 border-t border-[#1D2230]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#161A22] hover:bg-[#1D1D27] text-[#B8B8C7] hover:text-white font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2F87] to-[#FF4FA0] text-white font-bold hover:opacity-95 transition-all shadow-md shadow-[#FF2F87]/20"
            >
              Salvar Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
