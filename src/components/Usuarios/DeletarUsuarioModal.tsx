import { useState } from 'react';

interface DeletarUsuarioModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export default function DeletarUsuarioModal({ isOpen, onClose, onConfirm }: DeletarUsuarioModalProps) {
	const [naoMostrarNovamente, setNaoMostrarNovamente] = useState(false);

	if (!isOpen) return null;

	const handleConfirm = () => {
		if (naoMostrarNovamente) {
			localStorage.setItem('naoMostrarModalDeletar', 'true');
		}
		onConfirm();
	};

	return (
		<div 
			className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4"
			onClick={onClose}
		>
			<div 
				className="bg-white rounded-2xl w-full max-w-[400px] shadow-lg"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-0">
					<div className="flex gap-2 sm:gap-4 items-start">
						{/* Ícone de Delete */}
						<div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#FEE4E2] border-4 sm:border-8 border-[#FEF3F2] rounded-[28px] flex items-center justify-center">
							<svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="#D92D20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>

						{/* Texto */}
						<div className="flex-1 min-w-0">
							<h3 className="font-['Poppins'] font-semibold text-base sm:text-lg text-[#181D27] mb-1">
								Deletar usuário
							</h3>
							<p className="font-['Poppins'] font-normal text-xs sm:text-sm text-[#535862] leading-5">
								Você tem certeza que desejar deletar esse usuário ? A ação não pode ser revertida
							</p>
						</div>
					</div>

					{/* Botão Fechar */}
					<button 
						onClick={onClose}
						className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18 6L6 18M6 6L18 18" stroke="#717680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>
				</div>

				{/* Footer / Actions */}
				<div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
						{/* Checkbox */}
						<div className="flex items-center gap-2">
							<input 
								type="checkbox"
								id="nao-mostrar-novamente"
								checked={naoMostrarNovamente}
								onChange={(e) => setNaoMostrarNovamente(e.target.checked)}
								className="w-3.5 h-3.5 sm:w-4 sm:h-4 border border-[#D5D7DA] rounded cursor-pointer accent-[#9b0103]"
							/>
							<label 
								htmlFor="nao-mostrar-novamente"
								className="font-['Poppins'] font-medium text-xs sm:text-sm text-[#414651] cursor-pointer select-none"
							>
								Não mostrar novamente
							</label>
						</div>

						{/* Botões de Ação */}
						<div className="flex gap-2 sm:gap-3 w-full sm:w-auto sm:ml-auto">
							<button
								onClick={onClose}
								className="flex-1 sm:flex-none px-3 sm:px-[18px] py-2 sm:py-2.5 bg-white border border-[#D5D7DA] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-['Poppins'] font-semibold text-sm sm:text-base text-[#414651] hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={handleConfirm}
								className="flex-1 sm:flex-none px-3 sm:px-[18px] py-2 sm:py-2.5 bg-[#9b0103] border border-[#9b0103] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-['Poppins'] font-semibold text-sm sm:text-base text-white hover:bg-[#7a0102] transition-colors"
							>
								Deletar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
