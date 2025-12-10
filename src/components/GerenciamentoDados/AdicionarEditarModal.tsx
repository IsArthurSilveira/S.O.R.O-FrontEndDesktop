import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Campo {
  nome: string;
  label: string;
  tipo: 'text' | 'select';
  obrigatorio: boolean;
  opcoes?: { valor: string; label: string }[];
}

interface AdicionarEditarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (dados: any) => Promise<void>;
  titulo: string;
  campos: Campo[];
  dadosIniciais?: any;
  modoEdicao: boolean;
}

export default function AdicionarEditarModal({
  isOpen,
  onClose,
  onSalvar,
  titulo,
  campos,
  dadosIniciais,
  modoEdicao
}: AdicionarEditarModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (modoEdicao && dadosIniciais) {
        setFormData(dadosIniciais);
      } else {
        const inicial: any = {};
        campos.forEach(campo => {
          inicial[campo.nome] = '';
        });
        setFormData(inicial);
      }
    }
  }, [isOpen, dadosIniciais, modoEdicao, campos]);

  const handleChange = (nome: string, valor: string) => {
    setFormData((prev: any) => ({ ...prev, [nome]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSalvar(formData);
    } catch (error) {
      // Pode adicionar tratamento de erro se quiser
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-[#f3f3f5] rounded-2xl w-full max-w-[328px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-[#f3f3f5] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-[#0a1c3e]">{modoEdicao ? 'Editar' : 'Adicionar'} {titulo}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {campos.map((campo) => (
              <div key={campo.nome}>
                <label className="block font-['Poppins'] text-sm font-medium text-[#202224] mb-1.5">
                  {campo.label}
                  {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
                </label>
                {campo.tipo === 'select' ? (
                  <select
                    value={formData[campo.nome] || ''}
                    onChange={(e) => handleChange(campo.nome, e.target.value)}
                    required={campo.obrigatorio}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-black"
                  >
                    <option value="">Selecione...</option>
                    {campo.opcoes?.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[campo.nome] || ''}
                    onChange={(e) => handleChange(campo.nome, e.target.value)}
                    required={campo.obrigatorio}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-black"
                    placeholder={`Digite ${campo.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-[#202224] rounded-lg hover:bg-gray-50 transition-colors font-['Poppins'] text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#70b37b] text-white rounded-lg hover:bg-[#5fa36a] transition-colors font-['Poppins'] text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
// ...fim do componente
}
