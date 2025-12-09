import { useState } from 'react';
import { X } from 'lucide-react';

export interface DeletarOcorrenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletarOcorrenciaModal({ isOpen, onClose, onConfirm }: DeletarOcorrenciaModalProps) {
  const [naoMostrarNovamente, setNaoMostrarNovamente] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (naoMostrarNovamente) {
      localStorage.setItem('naoMostrarModalDeletarOcorrencia', 'true');
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[480px] flex flex-col shadow-lg">
        {/* Header */}
        <div className="bg-white relative">
          <div className="flex gap-4 items-start pt-6 px-6 pb-0">
            {/* Icon */}
            <div className="bg-[#fee4e2] border-8 border-[#fef3f2] rounded-[28px] shrink-0 w-12 h-12 flex items-center justify-center relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" 
                  stroke="#D92D20" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text Content */}
            <div className="flex-1 flex flex-col gap-1">
              <h2 className="font-['Poppins'] font-semibold text-lg text-[#181d27] leading-7">
                Deletar registro de ocorrência
              </h2>
              <p className="font-['Poppins'] text-sm text-[#535862] leading-5">
                Você tem certeza que desejar deletar essa ocorrência ? A ação não pode ser revertida
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#717680]" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col pt-8 pb-0 px-0">
          <div className="flex gap-3 items-center pb-6 pl-[88px] pr-6">
            {/* Checkbox */}
            <div className="flex gap-2 items-start">
              <div className="flex items-center justify-center pt-0.5">
                <input 
                  type="checkbox"
                  checked={naoMostrarNovamente}
                  onChange={(e) => setNaoMostrarNovamente(e.target.checked)}
                  className="w-4 h-4 border border-[#d5d7da] rounded cursor-pointer accent-[#9b0103]"
                />
              </div>
              <label className="font-['Inter'] font-medium text-sm text-[#414651] leading-5 cursor-pointer select-none"
                onClick={() => setNaoMostrarNovamente(!naoMostrarNovamente)}
              >
                Não mostrar novamente
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-1 gap-3 items-center justify-end">
              <button 
                onClick={onClose}
                className="bg-white border border-[#d5d7da] px-[18px] py-2.5 rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:bg-gray-50 transition-colors"
              >
                <span className="font-['Inter'] font-semibold text-base text-[#414651] leading-6">
                  Cancelar
                </span>
              </button>
              <button 
                onClick={handleConfirm}
                className="bg-[#9b0103] border border-[#9b0103] px-[18px] py-2.5 rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:bg-[#7a0102] transition-colors"
              >
                <span className="font-['Inter'] font-semibold text-base text-white leading-6">
                  Deletar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
