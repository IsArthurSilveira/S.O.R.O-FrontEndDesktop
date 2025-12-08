import { useState } from 'react';
import type { FiltrosOcorrencia, StatusOcorrencia } from '../../types';
import FilterIcon from '../../assets/Actions/Filter-Icon.svg';

interface FiltrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  filtros: FiltrosOcorrencia;
  onAplicarFiltros: (filtros: FiltrosOcorrencia) => void;
}

export default function FiltrosModal({ isOpen, onClose, filtros, onAplicarFiltros }: FiltrosModalProps) {
  const [filtrosLocal, setFiltrosLocal] = useState<FiltrosOcorrencia>(filtros);

  if (!isOpen) return null;

  const handleAplicar = () => {
    onAplicarFiltros(filtrosLocal);
    onClose();
  };

  const handleLimpar = () => {
    const filtrosVazios: FiltrosOcorrencia = {};
    setFiltrosLocal(filtrosVazios);
    onAplicarFiltros(filtrosVazios);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src={FilterIcon} alt="Filtros" className="w-5 h-5" />
            <h2 className="font-['Poppins'] font-semibold text-[18px] text-black">Filtros</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors text-[24px] leading-none"
          >
            ×
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins'] font-medium text-[14px] text-[#202224]">
              Status
            </label>
            <select
              value={filtrosLocal.status || ''}
              onChange={(e) => setFiltrosLocal({ 
                ...filtrosLocal, 
                status: e.target.value as StatusOcorrencia || undefined 
              })}
              className="px-4 py-2 border border-[rgba(6,28,67,0.4)] rounded-xl font-['Poppins'] text-[14px] outline-none focus:border-[rgba(6,28,67,0.6)]"
            >
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          {/* Data Início */}
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins'] font-medium text-[14px] text-[#202224]">
              Data Início
            </label>
            <input
              type="date"
              value={filtrosLocal.dataInicio || ''}
              onChange={(e) => setFiltrosLocal({ ...filtrosLocal, dataInicio: e.target.value })}
              className="px-4 py-2 border border-[rgba(6,28,67,0.4)] rounded-xl font-['Poppins'] text-[14px] outline-none focus:border-[rgba(6,28,67,0.6)]"
            />
          </div>

          {/* Data Fim */}
          <div className="flex flex-col gap-2">
            <label className="font-['Poppins'] font-medium text-[14px] text-[#202224]">
              Data Fim
            </label>
            <input
              type="date"
              value={filtrosLocal.dataFim || ''}
              onChange={(e) => setFiltrosLocal({ ...filtrosLocal, dataFim: e.target.value })}
              className="px-4 py-2 border border-[rgba(6,28,67,0.4)] rounded-xl font-['Poppins'] text-[14px] outline-none focus:border-[rgba(6,28,67,0.6)]"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={handleLimpar}
            className="flex-1 px-4 py-2 border border-[rgba(6,28,67,0.4)] rounded-xl font-['Poppins'] font-medium text-[14px] text-[#202224] hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={handleAplicar}
            className="flex-1 px-4 py-2 bg-[rgba(160,237,173,0.6)] border border-[rgba(6,28,67,0.4)] rounded-xl font-['Poppins'] font-medium text-[14px] text-black hover:bg-[rgba(160,237,173,0.8)] transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
