import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Configuracoes() {
	const { isDarkMode, toggleDarkMode } = useTheme();
	const [notificacoes, setNotificacoes] = useState(true);
	const [autoSalvar, setAutoSalvar] = useState(true);

	return (
		<div className="flex flex-col h-full px-2 sm:px-4 md:px-8">
			<div className="-mt-6 flex flex-col h-full">
				{/* Título */}
				<div className="mb-4 mt-[12px]">
					<h1 className="font-['Poppins'] font-semibold text-base text-[#202224] dark:text-white">
						Configurações do Sistema
					</h1>
					<p className="font-['Poppins'] text-sm text-[#202224] opacity-60 dark:text-white dark:opacity-70 mt-1">
						Personalize a aparência e comportamento do S.O.R.O
					</p>
				</div>

				{/* Layout em Grid - 2 colunas responsivo */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
					
					{/* Coluna Esquerda */}
					<div className="flex flex-col gap-4">
						
						{/* Seção: Aparência */}
						<div className="bg-white dark:bg-[#1a1a1a] border border-[rgba(6,28,67,0.4)] dark:border-[rgba(255,255,255,0.1)] rounded-xl p-5 shadow-sm">
							<h2 className="font-['Poppins'] font-semibold text-sm text-[#202224] dark:text-white mb-3">
								Aparência
							</h2>
							
							{/* Modo Escuro */}
							<div className="flex items-center justify-between">
								<div className="flex flex-col gap-0.5">
									<label className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
										Modo Escuro
									</label>
									<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
										Tema escuro para reduzir o brilho
									</span>
								</div>
								<button
									onClick={toggleDarkMode}
									className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
										isDarkMode ? 'bg-[#4CAF50]' : 'bg-gray-300'
									}`}
								>
									<span
										className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
											isDarkMode ? 'translate-x-7' : 'translate-x-1'
										}`}
									/>
								</button>
							</div>
						</div>

						{/* Seção: Notificações */}
						<div className="bg-white dark:bg-[#1a1a1a] border border-[rgba(6,28,67,0.4)] dark:border-[rgba(255,255,255,0.1)] rounded-xl p-5 shadow-sm">
							<h2 className="font-['Poppins'] font-semibold text-sm text-[#202224] dark:text-white mb-3">
								Notificações
							</h2>
							
							{/* Ativar Notificações */}
							<div className="flex items-center justify-between">
								<div className="flex flex-col gap-0.5">
									<label className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
										Ativar Notificações
									</label>
									<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
										Alertas sobre novas ocorrências
									</span>
								</div>
								<button
									onClick={() => setNotificacoes(!notificacoes)}
									className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
										notificacoes ? 'bg-[#4CAF50]' : 'bg-gray-300'
									}`}
								>
									<span
										className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
											notificacoes ? 'translate-x-7' : 'translate-x-1'
										}`}
									/>
								</button>
							</div>
						</div>

						{/* Seção: Sobre */}
						<div className="bg-white dark:bg-[#1a1a1a] border border-[rgba(6,28,67,0.4)] dark:border-[rgba(255,255,255,0.1)] rounded-xl p-5 shadow-sm">
							<h2 className="font-['Poppins'] font-semibold text-sm text-[#202224] dark:text-white mb-3">
								Sobre o Sistema
							</h2>
							
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
										Versão
									</span>
									<span className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
										1.0.0
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
										Sistema
									</span>
									<span className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
										S.O.R.O
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
										Atualização
									</span>
									<span className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
										08/12/2025
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Coluna Direita */}
					<div className="flex flex-col gap-4 mt-0 md:mt-0">
						
						{/* Seção: Sistema */}
						<div className="bg-white dark:bg-[#1a1a1a] border border-[rgba(6,28,67,0.4)] dark:border-[rgba(255,255,255,0.1)] rounded-xl p-5 shadow-sm">
							<h2 className="font-['Poppins'] font-semibold text-sm text-[#202224] dark:text-white mb-3">
								Sistema
							</h2>
							
							<div className="space-y-4">
								{/* Auto-Salvar */}
								<div className="flex items-center justify-between">
									<div className="flex flex-col gap-0.5">
										<label className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
											Auto-Salvar
										</label>
										<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
											Salva automaticamente
										</span>
									</div>
									<button
										onClick={() => setAutoSalvar(!autoSalvar)}
										className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
											autoSalvar ? 'bg-[#4CAF50]' : 'bg-gray-300'
										}`}
									>
										<span
											className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
												autoSalvar ? 'translate-x-7' : 'translate-x-1'
											}`}
										/>
									</button>
								</div>

								{/* Idioma */}
								<div className="flex items-center justify-between">
									<div className="flex flex-col gap-0.5">
										<label className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
											Idioma
										</label>
										<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
											Idioma do sistema
										</span>
									</div>
									<select 
										className="px-3 py-1.5 rounded-lg border border-[rgba(6,28,67,0.4)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#2a2a2a] text-[#202224] dark:text-white font-['Poppins'] text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
										defaultValue="pt-BR"
									>
										<option value="pt-BR">Português (BR)</option>
										<option value="en-US">English (US)</option>
										<option value="es-ES">Español</option>
									</select>
								</div>

								{/* Timezone */}
								<div className="flex items-center justify-between">
									<div className="flex flex-col gap-0.5">
										<label className="font-['Poppins'] font-medium text-sm text-[#202224] dark:text-white">
											Fuso Horário
										</label>
										<span className="font-['Poppins'] text-xs text-[#202224] opacity-60 dark:text-white dark:opacity-70">
											Exibição de datas
										</span>
									</div>
									<select 
										className="px-3 py-1.5 rounded-lg border border-[rgba(6,28,67,0.4)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#2a2a2a] text-[#202224] dark:text-white font-['Poppins'] text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
										defaultValue="America/Sao_Paulo"
									>
										<option value="America/Sao_Paulo">Brasília (GMT-3)</option>
										<option value="America/New_York">New York (GMT-5)</option>
										<option value="Europe/London">London (GMT+0)</option>
									</select>
								</div>
							</div>
						</div>

						{/* Botões de Ação */}
						<div className="flex flex-col gap-3">
							<button
								className="w-full px-4 py-2.5 rounded-lg bg-[#4CAF50] hover:bg-[#45a049] text-white font-['Poppins'] text-sm font-medium transition-colors"
							>
								Salvar Alterações
							</button>
							<button
								className="w-full px-4 py-2.5 rounded-lg border border-[rgba(6,28,67,0.4)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333] text-[#202224] dark:text-white font-['Poppins'] text-sm font-medium transition-colors"
							>
								Restaurar Padrões
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
