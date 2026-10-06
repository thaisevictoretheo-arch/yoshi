import React, { useState } from 'react';
import { Sale, Company } from '../../types';
import { DollarSign, Plus, CheckCircle, Clock, AlertCircle, X, Trash2 } from 'lucide-react';

interface SalesTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: Sale[];
  companies: Company[];
  onSaveSale: (sale: Sale) => void;
  onDeleteSale: (id: string) => void;
}

export const SalesTrackerModal: React.FC<SalesTrackerModalProps> = ({
  isOpen,
  onClose,
  sales,
  companies,
  onSaveSale,
  onDeleteSale
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [total, setTotal] = useState<string>('3500');
  const [received, setReceived] = useState<string>('1750');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const totalVendido = sales.reduce((acc, s) => acc + (s.total || 0), 0);
  const totalRecebido = sales.reduce((acc, s) => acc + (s.received || 0), 0);
  const totalPendente = sales.reduce((acc, s) => acc + (s.pending || 0), 0);

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === selectedCompanyId) || companies[0];
    if (!comp) return;

    const numTotal = parseFloat(total) || 0;
    const numReceived = parseFloat(received) || 0;
    const numPending = Math.max(0, numTotal - numReceived);

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      companyId: comp.id,
      companyName: comp.name,
      total: numTotal,
      received: numReceived,
      pending: numPending,
      status: numPending === 0 ? 'PAGO' : numReceived > 0 ? 'PARCIAL' : 'PENDENTE',
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined
    };

    onSaveSale(newSale);
    setIsAdding(false);
    setNotes('');
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0E1016] border border-[#1D2230] rounded-2xl shadow-2xl p-6 text-[#F5F7FB] my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#1D2230]">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-extrabold text-white">Gestão de Vendas & Faturamento</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#B8B8C7] hover:text-white rounded-lg hover:bg-[#161A22]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 pt-4 text-xs">
          {/* FINANCIAL SUMMARY CARDS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-[#050507] rounded-xl border border-[#1D2230]">
              <span className="text-[10px] uppercase font-mono text-[#B8B8C7] block mb-1">
                Total Vendido
              </span>
              <span className="text-base font-black text-white font-mono block">
                {formatBRL(totalVendido)}
              </span>
            </div>
            <div className="p-4 bg-[#050507] rounded-xl border border-[#1D2230]">
              <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">
                Total Recebido
              </span>
              <span className="text-base font-black text-emerald-400 font-mono block">
                {formatBRL(totalRecebido)}
              </span>
            </div>
            <div className="p-4 bg-[#050507] rounded-xl border border-[#1D2230]">
              <span className="text-[10px] uppercase font-mono text-amber-400 block mb-1">
                A Receber
              </span>
              <span className="text-base font-black text-amber-400 font-mono block">
                {formatBRL(totalPendente)}
              </span>
            </div>
          </div>

          {/* NEW SALE TOGGLE & FORM */}
          {isAdding ? (
            <form onSubmit={handleCreateSale} className="p-4 bg-[#161A22] rounded-xl border border-[#1D2230] space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white">Registrar Nova Venda</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-[#B8B8C7] hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div>
                <label className="text-[#B8B8C7] block mb-1">Empresa / Cliente</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full bg-[#0E1016] border border-[#1D2230] rounded-lg p-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city} - {c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#B8B8C7] block mb-1">Valor Total do Projeto (R$)</label>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="w-full bg-[#0E1016] border border-[#1D2230] rounded-lg p-2.5 text-white font-mono text-xs focus:border-[#FF2F87] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#B8B8C7] block mb-1">Valor Já Recebido (R$)</label>
                  <input
                    type="number"
                    value={received}
                    onChange={(e) => setReceived(e.target.value)}
                    className="w-full bg-[#0E1016] border border-[#1D2230] rounded-lg p-2.5 text-white font-mono text-xs focus:border-[#FF2F87] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#B8B8C7] block mb-1">Observações</label>
                <input
                  type="text"
                  placeholder="Ex: 50% de entrada pago no PIX"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0E1016] border border-[#1D2230] rounded-lg p-2.5 text-white text-xs focus:border-[#FF2F87] outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Salvar Venda
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">Histórico de Contratos</span>
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#161A22] hover:bg-[#1D1D27] text-white rounded-xl font-semibold border border-[#1D2230] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF2F87]" />
                <span>Nova Venda</span>
              </button>
            </div>
          )}

          {/* SALES LIST TABLE */}
          <div className="border border-[#1D2230] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050507] text-[#B8B8C7] border-b border-[#1D2230] font-mono text-[10px]">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Recebido</th>
                  <th className="p-3">Pendente</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2230] bg-[#0E1016]">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-[#9292A3]">
                      Nenhuma venda registrada ainda.
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-[#161A22]/50">
                      <td className="p-3 font-semibold text-white">{sale.companyName}</td>
                      <td className="p-3 text-[#B8B8C7] font-mono">{sale.date}</td>
                      <td className="p-3 text-white font-mono">{formatBRL(sale.total)}</td>
                      <td className="p-3 text-emerald-400 font-mono">{formatBRL(sale.received)}</td>
                      <td className="p-3 text-amber-400 font-mono">{formatBRL(sale.pending)}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            sale.status === 'PAGO'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : sale.status === 'PARCIAL'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                              : 'bg-[#161A22] text-[#B8B8C7]'
                          }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteSale(sale.id)}
                          className="text-[#9292A3] hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#1D2230]">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
