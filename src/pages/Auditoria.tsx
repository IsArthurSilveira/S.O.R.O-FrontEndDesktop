import { useEffect, useState } from 'react';
import SearchIcon from '../assets/Actions/Search-Icon.svg';
import FilterIcon from '../assets/Actions/Filter-Icon.svg';
import SortIcon from '../assets/Actions/Reorder-Icon.svg';

// Ícones de Auditoria
import RelatorioNovoIcon from '../assets/Audit/Relatorio-Novo-Icon.svg';
import OcorrenciaEditadaIcon from '../assets/Audit/Ocorrencia-Editada-Icon.svg';
import OcorrenciaNovaIcon from '../assets/Audit/Ocorrencia-Nova-Icon.svg';
import UsuarioEditadoIcon from '../assets/Audit/Usuario-Editado-Icon.svg';
import UsuarioAdicionadoIcon from '../assets/Audit/Usuario-Adicionado-Icon.svg';
import PerfilIcon from '../assets/SideBar/Perfil-Menu-Icon.svg';

interface AuditoriaRegistro {
	id: string;
	atividade: string;
	usuario: string;
	data: string;
	tipo: 'relatorio' | 'ocorrencia_editada' | 'ocorrencia_criada' | 'usuario_editado' | 'usuario_criado';
}

// Dados mockados para auditoria
const mockAuditoriaData: AuditoriaRegistro[] = [
	{ id: '1', atividade: 'Um novo relatório foi gerado', usuario: 'Admin Silva', data: 'Agora', tipo: 'relatorio' },
	{ id: '2', atividade: 'Uma Ocorrência foi editada', usuario: 'João Santos', data: '1 minuto atrás', tipo: 'ocorrencia_editada' },
	{ id: '3', atividade: 'Criado uma nova de Ocorrência', usuario: 'Maria Oliveira', data: '1 hora atrás', tipo: 'ocorrencia_criada' },
	{ id: '4', atividade: 'Um usuário foi editado', usuario: 'Pedro Costa', data: '1 minuto atrás', tipo: 'usuario_editado' },
	{ id: '5', atividade: 'Novo usuário adicionado', usuario: 'Ana Paula', data: '1 hora atrás', tipo: 'usuario_criado' },
	{ id: '6', atividade: 'Um usuário foi editado', usuario: 'Carlos Souza', data: '1 minuto atrás', tipo: 'usuario_editado' },
	{ id: '7', atividade: 'Um novo relatório foi gerado', usuario: 'Admin Silva', data: 'Agora', tipo: 'relatorio' },
	{ id: '8', atividade: 'Uma Ocorrência foi editada', usuario: 'João Santos', data: '1 minuto atrás', tipo: 'ocorrencia_editada' },
	{ id: '9', atividade: 'Criado uma nova de Ocorrência', usuario: 'Maria Oliveira', data: '1 hora atrás', tipo: 'ocorrencia_criada' },
	{ id: '10', atividade: 'Um usuário foi editado', usuario: 'Pedro Costa', data: '1 minuto atrás', tipo: 'usuario_editado' },
	{ id: '11', atividade: 'Novo usuário adicionado', usuario: 'Ana Paula', data: '1 hora atrás', tipo: 'usuario_criado' },
	{ id: '12', atividade: 'Um usuário foi editado', usuario: 'Carlos Souza', data: '1 minuto atrás', tipo: 'usuario_editado' },
	{ id: '13', atividade: 'Novo usuário adicionado', usuario: 'Fernanda Lima', data: '1 hora atrás', tipo: 'usuario_criado' },
    { id: '14', atividade: 'Um novo relatório foi gerado', usuario: 'Admin Silva', data: 'Agora', tipo: 'relatorio' },
    { id: '15', atividade: 'Uma Ocorrência foi editada', usuario: 'João Santos', data: '1 minuto atrás', tipo: 'ocorrencia_editada' },
    { id: '16', atividade: 'Criado uma nova de Ocorrência', usuario: 'Maria Oliveira', data: '1 hora atrás', tipo: 'ocorrencia_criada' },
    { id: '17', atividade: 'Um usuário foi editado', usuario: 'Pedro Costa', data: '1 minuto atrás', tipo: 'usuario_editado' },
    { id: '18', atividade: 'Novo usuário adicionado', usuario: 'Ana Paula', data: '1 hora atrás', tipo: 'usuario_criado' },
    { id: '19', atividade: 'Um usuário foi editado', usuario: 'Carlos Souza', data: '1 minuto atrás', tipo: 'usuario_editado' },
    { id: '20', atividade: 'Novo usuário adicionado', usuario: 'Fernanda Lima', data: '1 hora atrás', tipo: 'usuario_criado' },
];

export default function Auditoria() {
	const [registros, setRegistros] = useState<AuditoriaRegistro[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [ordemCrescente, setOrdemCrescente] = useState(true);
	const [paginacao, setPaginacao] = useState({
		page: 1,
		totalPages: 1,
		total: 0,
		limit: 10
	});

	useEffect(() => {
		// Simula carregamento de dados
		setTimeout(() => {
			setRegistros(mockAuditoriaData);
			setPaginacao(prev => ({
				...prev,
				total: mockAuditoriaData.length,
				totalPages: Math.max(1, Math.ceil(mockAuditoriaData.length / prev.limit))
			}));
			setLoading(false);
		}, 500);
	}, []);

	const getIconForType = (tipo: string) => {
		switch (tipo) {
			case 'relatorio':
				return RelatorioNovoIcon;
			case 'ocorrencia_editada':
				return OcorrenciaEditadaIcon;
			case 'ocorrencia_criada':
				return OcorrenciaNovaIcon;
			case 'usuario_editado':
				return UsuarioEditadoIcon;
			case 'usuario_criado':
				return UsuarioAdicionadoIcon;
			default:
				return RelatorioNovoIcon;
		}
	};

	const filtrarOrdenar = () => {
		let base = [...registros];
		if (search.trim()) {
			const q = search.toLowerCase();
			base = base.filter(r =>
				r.atividade.toLowerCase().includes(q) ||
				r.usuario.toLowerCase().includes(q)
			);
		}
		base.sort((a, b) => ordemCrescente ? a.atividade.localeCompare(b.atividade) : b.atividade.localeCompare(a.atividade));
		return base;
	};

	const currentPageItems = () => {
		const items = filtrarOrdenar();
		const start = (paginacao.page - 1) * paginacao.limit;
		return items.slice(start, start + paginacao.limit);
	};

	const goToPage = (page: number) => {
		const totalPages = Math.max(1, Math.ceil(filtrarOrdenar().length / paginacao.limit));
		if (page >= 1 && page <= totalPages) {
			setPaginacao({ ...paginacao, page, totalPages });
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="-mt-6 flex flex-col h-full">
				{/* Título */}
				<div className="mb-3 mt-[12px]">
					<h1 className="font-['Poppins'] font-semibold text-base text-[#202224]">Registros de Auditoria</h1>
				</div>

				{/* Barra de Pesquisa e Filtros */}
				<div 
					className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-[rgba(6,28,67,0.4)] mb-3"
					style={{
						background: 'linear-gradient(90deg, rgba(242, 236, 236, 0.12) 0%, rgba(242, 236, 236, 0.12) 100%), linear-gradient(90deg, rgba(249, 249, 250, 1) 0%, rgba(249, 249, 250, 1) 100%)'
					}}
				>
					{/* Pesquisa */}
					<div className="flex items-center gap-2 flex-1 px-2 rounded-lg">
						<img src={SearchIcon} alt="Pesquisar" className="w-5 h-5" />
						<input
							type="text"
							placeholder="Pesquisar Atividade"
							className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[rgba(0,0,0,0.2)] font-['Poppins']"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					{/* Botões de Ação */}
					<div className="flex items-center gap-1.5">
						<button 
							className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors"
							onClick={() => setOrdemCrescente(!ordemCrescente)}
							title={ordemCrescente ? 'Ordenar decrescente' : 'Ordenar crescente'}
						>
							<img src={SortIcon} alt="Ordenar" className="w-5 h-5" />
						</button>
						<button 
							className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors"
						>
							<img src={FilterIcon} alt="Filtrar" className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Tabela de Auditoria */}
				<div className="flex flex-col gap-0 overflow-hidden rounded-tl-lg rounded-tr-lg flex-1 min-h-0">
					{/* Cabeçalho */}
					<div className="bg-[#edeefc] border border-[rgba(6,28,67,0.4)] flex items-center gap-4 h-10 px-4 py-2 rounded-tl-lg rounded-tr-lg flex-shrink-0">
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 flex-1">ATIVIDADE</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-64">USUÁRIO</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-40">DATA</p>
					</div>

					{/* Conteúdo */}
					<div className="flex flex-col overflow-y-auto flex-1">
						{loading ? (
							<div className="flex items-center justify-center h-full">
								<p className="font-['Poppins'] text-sm text-[#202224] opacity-60">Carregando...</p>
							</div>
						) : currentPageItems().length === 0 ? (
							<div className="flex items-center justify-center h-full">
								<p className="font-['Poppins'] text-sm text-[#202224] opacity-60">Nenhum registro encontrado</p>
							</div>
						) : (
							currentPageItems().map((item) => (
								<div key={item.id} className="border-b border-[rgba(6,28,67,0.4)] h-10 overflow-hidden relative">
									<div className="flex items-center gap-4 px-4 h-full">
										{/* Atividade */}
										<div className="flex items-center gap-2 flex-1">
											<div className="bg-[rgba(0,0,0,0.04)] p-1 rounded-lg flex items-center justify-center">
												<img src={getIconForType(item.tipo)} alt="Icon" className="w-5 h-5" />
											</div>
											<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 truncate" title={item.atividade}>
												{item.atividade}
											</p>
										</div>
										{/* Usuário */}
										<div className="flex items-center gap-2 w-64">
											<img src={PerfilIcon} alt="User" className="w-5 h-5" />
											<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 truncate" title={item.usuario}>
												{item.usuario}
											</p>
										</div>
										{/* Data */}
										<div className="flex items-center gap-1 w-40">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M2 6V13.5C2 14.0523 2.44772 14.5 3 14.5H13C13.5523 14.5 14 14.0523 14 13.5V6M2 6V3.5C2 2.94772 2.44772 2.5 3 2.5H5M2 6H14M14 6V3.5C14 2.94772 13.5523 2.5 13 2.5H11M5 2.5V1M5 2.5V4M5 2.5H11M11 2.5V1M11 2.5V4" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
											<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 truncate">
												{item.data}
											</p>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Paginação */}
				<div className="flex items-center justify-center gap-2 h-[88px] flex-shrink-0">
					<button 
						onClick={() => goToPage(paginacao.page - 1)} 
						disabled={paginacao.page === 1} 
						className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
					>
						<span className="text-[#202224] font-['Poppins'] text-base font-medium">‹</span>
					</button>
					{Array.from({ length: Math.min(5, paginacao.totalPages) }, (_, i) => {
						const pageNumber = i + 1;
						const isActive = pageNumber === paginacao.page;
						return (
							<button 
								key={pageNumber} 
								onClick={() => goToPage(pageNumber)} 
								className={`flex items-center justify-center h-10 w-12 rounded-xl transition-all font-['Poppins'] text-sm font-medium border shadow-sm ${isActive ? 'bg-[#edeefc] text-[#202224] border-[rgba(6,28,67,0.4)] shadow-md' : 'bg-white text-[#202224] hover:bg-[#edeefc] hover:shadow-md border-[rgba(6,28,67,0.4)]'}`}
							>
								{pageNumber}
							</button>
						);
					})}
					<button 
						onClick={() => goToPage(paginacao.page + 1)} 
						disabled={paginacao.page === paginacao.totalPages} 
						className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
					>
						<span className="text-[#202224] font-['Poppins'] text-base font-medium">›</span>
					</button>
				</div>
			</div>
		</div>
	);
}
