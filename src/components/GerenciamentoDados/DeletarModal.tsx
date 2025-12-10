import { useState } from 'react';
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

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await onConfirmar();
      onClose();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-['Poppins'] font-semibold text-lg text-[#202224]">
            Deletar {titulo}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
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

          {/* Botões */}
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
