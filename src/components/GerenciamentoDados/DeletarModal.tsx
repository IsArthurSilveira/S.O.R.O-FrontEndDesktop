import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeletarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: () => Promise<void>;
  titulo: string;
  nomeItem: string;
}

export default function DeletarModal({
  isOpen,
  onClose,
  onConfirmar,
  titulo,
  nomeItem
}: DeletarModalProps) {

  const [loading, setLoading] = useState(false);

  // Reseta o loading ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await onConfirmar();
    } catch (error) {
      // erro ao deletar (opcional)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-[#f3f3f5] rounded-2xl w-full max-w-[328px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-[#f3f3f5] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-[#0a1c3e]">Deletar {titulo}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-['Poppins'] text-sm text-[#202224] mb-2">
                Tem certeza que deseja deletar <span className="font-semibold">"{nomeItem}"</span>?
              </p>
              <p className="font-['Poppins'] text-xs text-[#535862]">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-[#202224] rounded-lg hover:bg-gray-50 transition-colors font-['Poppins'] text-sm font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-['Poppins'] text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Deletando...' : 'Deletar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
