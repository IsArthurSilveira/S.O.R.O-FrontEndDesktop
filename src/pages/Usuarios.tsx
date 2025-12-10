import { useEffect, useState } from 'react';
import { getClient } from '../services/apiService';
import SearchIcon from '../assets/Actions/Search-Icon.svg';
import EditIcon from '../assets/Actions/Edit-Icon.svg';
import DeleteIcon from '../assets/Actions/Delete-Icon.svg';
import UsuariosIcon from '../assets/Sidebar/Usuarios-Menu-Icon.svg';
import FilterIcon from '../assets/Actions/Filter-Icon.svg';
import SortIcon from '../assets/Actions/Reorder-Icon.svg';
import FiltrosModal from '../components/Ocorrencias/FiltrosModal';
import KpiConcluidoBlack from '../assets/KPI-icons/KPI-Concluído-Black.svg';
import NovoUsuarioModal, { NovoUsuarioPayload } from '../components/Usuarios/NovoUsuarioModal';
import DeletarUsuarioModal from '../components/Usuarios/DeletarUsuarioModal';
import EditarUsuarioModal, { EditarUsuarioPayload } from '../components/Usuarios/EditarUsuarioModal';

interface UsuarioItem {
	id: string;
	nome: string;
	email: string;
	tipo_perfil: 'ADMIN' | 'ANALISTA' | 'CHEFE' | string;
	matricula?: string;
	nome_guerra?: string | null;
	posto_grad?: string | null;
	id_unidade_operacional_fk?: string | null;
}

export default function Usuarios() {
	const api = getClient();
	const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [mostrarFiltros, setMostrarFiltros] = useState(false);
	const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
	const [mostrarDeletar, setMostrarDeletar] = useState(false);
	const [mostrarEditar, setMostrarEditar] = useState(false);
	const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<UsuarioItem | null>(null);
	const [usuarioParaEditar, setUsuarioParaEditar] = useState<UsuarioItem | null>(null);
	const [ordemCrescente, setOrdemCrescente] = useState(true);
	const [search, setSearch] = useState('');
	const [paginacao, setPaginacao] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });

	// Estado simples para feedback de envio (pode ser usado futuramente)
	// removido por enquanto para evitar variáveis não utilizadas

	useEffect(() => { carregarUsuarios(); }, []);

	// Resetar página ao buscar
	useEffect(() => {
		setPaginacao(prev => ({ ...prev, page: 1 }));
	}, [search]);

	const carregarUsuarios = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await api.adminUsuRios.getApiv3Users();
			const list: UsuarioItem[] = Array.isArray(res) ? res : res?.data || [];
			// Debug: inspeciona as chaves disponíveis nos primeiros itens
			if (Array.isArray(list) && list.length) {
				console.log('[Usuarios] Amostra de usuários recebidos:', list.slice(0, 3));
				console.log('[Usuarios] Chaves do primeiro usuário:', Object.keys(list[0] || {}));
			}
			setUsuarios(list);
			setPaginacao(prev => ({ ...prev, total: list.length, totalPages: Math.max(1, Math.ceil(list.length / prev.limit)) }));
		} catch (err: any) {
			setError(err.message || 'Erro ao carregar usuários');
		} finally {
			setLoading(false);
		}
	};

	const filtrarOrdenar = () => {
		let base = [...usuarios];
		if (search.trim()) {
			const q = search.toLowerCase();
			base = base.filter(u => (
				u.id?.toLowerCase().startsWith(q) ||
				u.nome?.toLowerCase().includes(q) ||
				u.email?.toLowerCase().includes(q) ||
				u.tipo_perfil?.toLowerCase().includes(q)
			));
		}
		base.sort((a, b) => ordemCrescente ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome));
		return base;
	};

	const currentPageItems = () => {
		const items = filtrarOrdenar();
		const start = (paginacao.page - 1) * paginacao.limit;
		return items.slice(start, start + paginacao.limit);
	};

	const goToPage = (page: number) => {
		const usuariosFiltrados = filtrarOrdenar();
		const totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / paginacao.limit));
		if (page >= 1 && page <= totalPages) {
			setPaginacao({ ...paginacao, page, totalPages });
		}
	};

	const handleDeleteClick = (usuario: UsuarioItem) => {
		// Verificar se o usuário configurou para não mostrar o modal
		const naoMostrar = localStorage.getItem('naoMostrarModalDeletar');
		
		if (naoMostrar === 'true') {
			// Deletar diretamente
			confirmarDelecao(usuario.id);
		} else {
			// Abrir modal de confirmação
			setUsuarioParaDeletar(usuario);
			setMostrarDeletar(true);
		}
	};

	const confirmarDelecao = async (userId: string) => {
		try {
			await api.adminUsuRios.deleteApiv3Users(userId);
			setMostrarDeletar(false);
			setUsuarioParaDeletar(null);
			await carregarUsuarios();
		} catch (e: any) {
			console.error('Erro ao deletar usuário', e);
			alert('Erro ao deletar usuário: ' + (e.message || 'Erro desconhecido'));
		}
	};

	const handleEditarClick = async (usuario: UsuarioItem) => {
		try {
			// Buscar dados completos do usuário
			console.log('Buscando dados completos do usuário:', usuario.id);
			const usuarioCompleto = await api.adminUsuRios.getApiv3UsersById(usuario.id);
			console.log('Dados completos recebidos:', usuarioCompleto);
			setUsuarioParaEditar(usuarioCompleto);
			setMostrarEditar(true);
		} catch (e: any) {
			console.error('Erro ao buscar usuário completo:', e);
			// Se falhar, usa os dados básicos que já temos
			setUsuarioParaEditar(usuario);
			setMostrarEditar(true);
		}
	};

	const handleAtualizarUsuario = async (payload: EditarUsuarioPayload) => {
		if (!usuarioParaEditar) return;
		try {
			console.log('Payload de edição recebido:', payload);
			// Ajustar para o formato da API: nome, email e tipo_perfil (outros campos como null)
			const requestBody = {
				nome: payload.nome,
				email: payload.email,
				tipo_perfil: payload.tipo_perfil,
				matricula: usuarioParaEditar.matricula || null,
				nome_guerra: null,
				posto_grad: null,
				id_unidade_operacional_fk: null
			};
			
			console.log('Atualizando usuário ID:', usuarioParaEditar.id);
			console.log('Request Body:', JSON.stringify(requestBody, null, 2));
			await api.adminUsuRios.putApiv3Users(usuarioParaEditar.id, requestBody as any);
			console.log('Usuário atualizado com sucesso!');
			setMostrarEditar(false);
			setUsuarioParaEditar(null);
			await carregarUsuarios();
		} catch (e: any) {
			console.error('Erro ao atualizar usuário', e);
			console.error('Status:', e?.status);
			console.error('Body completo:', JSON.stringify(e?.body, null, 2));
			console.error('Detalhes do erro (array):', e?.body);
			if (Array.isArray(e?.body)) {
				e.body.forEach((err: any, idx: number) => {
					console.error(`Erro ${idx + 1}:`, JSON.stringify(err, null, 2));
				});
			}
			console.error('Message:', e?.message);
			throw e;
		}
	};


	const handleRegistrarUsuario = async (payload: NovoUsuarioPayload) => {
		try {
			console.log('Payload recebido em Usuarios.tsx:', payload);
			// Ajustar para o formato da API: name, email, profile, matricula
			const requestBody = {
				name: payload.nome,
				email: payload.email,
				profile: payload.tipo_perfil,
				matricula: payload.email.split('@')[0] // Gera matrícula a partir do email
			};
			console.log('Enviando para API:', requestBody);
			await api.auth.postApiV3AuthRegister(requestBody as any);
			setMostrarAdicionar(false);
			await carregarUsuarios();
		} catch (e: any) {
			console.error('Erro ao registrar usuário', e);
			console.error('Detalhes do erro:', {
				status: e?.status,
				statusText: e?.statusText,
				body: e?.body,
				message: e?.message
			});
			throw e; // Re-lançar o erro para o modal capturar
		}
	};

	// Formata ID para exibição: começa com # e mostra 8 primeiros dígitos
	const formatarId = (id: string | undefined): string => {
		if (!id || typeof id !== 'string') return '-';
		const curto = id.slice(0, 8);
		return `#${curto}`;
	};

	// Formata data de registro com a mesma lógica das ocorrências
	const formatarDataUsuario = (u: any, incluirHora: boolean = false) => {
		const data = u.data_registro || u.created_at || u.createdAt || '';
		const hora = u.hora_registro || u.created_time || u.createdTime || '';
		try {
			let dataFormatada = '';
			let horaFormatada = '';
			if (data && typeof data === 'string') {
				if (data.includes('T')) {
					const d = new Date(data);
					const dia = String(d.getDate()).padStart(2, '0');
					const mes = String(d.getMonth() + 1).padStart(2, '0');
					const ano = d.getFullYear();
					dataFormatada = `${dia}/${mes}/${ano}`;
					if (incluirHora) {
						const horas = String(d.getHours()).padStart(2, '0');
						const minutos = String(d.getMinutes()).padStart(2, '0');
						horaFormatada = `${horas}:${minutos}`;
					}
				} else if (data.includes('-')) {
					const [ano, mes, dia] = data.split('-');
					dataFormatada = `${dia}/${mes}/${ano}`;
				} else if (data.includes('/')) {
					dataFormatada = data;
				}
			}
			if (incluirHora && !horaFormatada && hora && typeof hora === 'string') {
				if (hora.includes('T')) {
					const h = new Date(hora);
					const horas = String(h.getHours()).padStart(2, '0');
					const minutos = String(h.getMinutes()).padStart(2, '0');
					horaFormatada = `${horas}:${minutos}`;
				} else if (hora.includes(':')) {
					const partes = hora.split(':');
					horaFormatada = `${partes[0]}:${partes[1]}`;
				}
			}
			return (dataFormatada || '-') + (horaFormatada ? ` - ${horaFormatada}` : '');
		} catch {
			return (data || '-') + (incluirHora && hora ? ` - ${hora}` : '');
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="-mt-6 flex flex-col h-full">
				{/* Título */}
				<div className="mb-3 mt-[12px]">
					<h1 className="font-['Poppins'] font-semibold text-base text-[#202224]">Lista de usuários</h1>
				</div>

				{/* Botão Adicionar Usuário */}
				<div className="flex justify-end mb-0">
					<button
						onClick={() => setMostrarAdicionar(true)}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-tl-lg rounded-tr-lg bg-[rgba(160,237,173,0.6)] border border-[rgba(6,28,67,0.4)] border-b-0 hover:bg-[rgba(160,237,173,0.8)] transition-colors"
					>
						<img src={UsuariosIcon} alt="Adicionar Usuário" className="w-5 h-5" />
						<span className="font-['Poppins'] text-xs text-black">Adicionar Usuário</span>
					</button>
				</div>

				{/* Barra de Pesquisa e Filtros */}
				<div 
					className="flex items-center justify-between gap-3 px-3 py-2 rounded-bl-xl rounded-br-xl rounded-tl-xl border border-[rgba(6,28,67,0.4)] mb-3"
					style={{
						background: 'linear-gradient(90deg, rgba(242, 236, 236, 0.12) 0%, rgba(242, 236, 236, 0.12) 100%), linear-gradient(90deg, rgba(249, 249, 250, 1) 0%, rgba(249, 249, 250, 1) 100%)'
					}}
				>
					{/* Pesquisa */}
					<div className="flex items-center gap-2 flex-1 px-2 rounded-lg">
						<img src={SearchIcon} alt="Pesquisar" className="w-5 h-5" />
						<input
							type="text"
							placeholder="Pesquisar usuário"
							className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[rgba(0,0,0,0.2)] font-['Poppins']"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					{/* Botões de Ação */}
					<div className="flex items-center gap-1.5">
						<button 
							className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors"
							onClick={() => { setOrdemCrescente(!ordemCrescente); }}
							title={ordemCrescente ? 'Ordenar decrescente' : 'Ordenar crescente'}
						>
							<img src={SortIcon} alt="Ordenar" className="w-5 h-5" />
						</button>
						<button 
							className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors"
							onClick={() => setMostrarFiltros(true)}
						>
							<img src={FilterIcon} alt="Filtrar" className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Modal de Filtros (reuso) */}
				<FiltrosModal
					isOpen={mostrarFiltros}
					onClose={() => setMostrarFiltros(false)}
					filtros={{ search }}
					onAplicarFiltros={(f: any) => setSearch(f.search || '')}
				/>

				<NovoUsuarioModal isOpen={mostrarAdicionar} onClose={()=>setMostrarAdicionar(false)} onSubmit={handleRegistrarUsuario} />

				<DeletarUsuarioModal 
					isOpen={mostrarDeletar} 
					onClose={() => {
						setMostrarDeletar(false);
						setUsuarioParaDeletar(null);
					}} 
					onConfirm={() => {
						if (usuarioParaDeletar) {
							confirmarDelecao(usuarioParaDeletar.id);
						}
					}}
				/>

				<EditarUsuarioModal 
					isOpen={mostrarEditar} 
					onClose={() => {
						setMostrarEditar(false);
						setUsuarioParaEditar(null);
					}} 
					onSubmit={handleAtualizarUsuario}
					usuario={usuarioParaEditar}
				/>

				{/* Tabela de Usuários */}
				<div className="flex flex-col gap-0 overflow-hidden rounded-tl-lg rounded-tr-lg flex-1 min-h-0">
					{/* Cabeçalho */}
					<div className="bg[#edeefc] border border-[rgba(6,28,67,0.4)] flex items-center gap-4 h-10 px-4 py-2 rounded-tl-lg rounded-tr-lg flex-shrink-0">
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-32">ID</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-52">NOME</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-64">EMAIL</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-40">PERFIL DE ACESSO</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-36">STATUS</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 flex-1">DATA DE REGISTRO</p>
						<p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-24">AÇÕES</p>
					</div>

					{/* Conteúdo */}
					<div className="flex flex-col overflow-y-auto flex-1">
						{loading ? (
							<div className="flex items-center justify-center h-full">
								<p className="font-['Poppins'] text-sm text-[#202224] opacity-60">Carregando...</p>
							</div>
						) : error ? (
							<div className="flex items-center justify-center h-full">
								<p className="font-['Poppins'] text-sm text-red-600">{error}</p>
							</div>
						) : currentPageItems().length === 0 ? (
							<div className="flex items-center justify-center h-full">
								<p className="font-['Poppins'] text-sm text-[#202224] opacity-60">Nenhum usuário encontrado</p>
							</div>
						) : (
							currentPageItems().map((u) => (
								<div key={u.id} className="border-b border-[rgba(6,28,67,0.4)] h-10 overflow-hidden relative">
									<div className="flex items-center gap-4 px-4 h-full">
										<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-32 truncate">{formatarId(u.id)}</p>
										<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-52 truncate" title={u.nome}>{u.nome}</p>
										<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-64 truncate" title={u.email}>{u.email}</p>
										<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-40 truncate">{u.tipo_perfil}</p>
										{/* Status */}
										<div className="flex items-center gap-1.5 h-7 w-36 bg-[#edeefc] rounded px-2">
											<img src={KpiConcluidoBlack} alt="Ativo" className="w-4 h-4" />
											<p className="font-['Poppins'] font-medium text-[10px] text-black truncate">Ativo</p>
										</div>
										{/* Data de Registro */}
										<p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 flex-1 truncate" title={formatarDataUsuario(u, true)}>
											{formatarDataUsuario(u, true)}
										</p>
										<div className="flex items-center gap-2 w-24">
											<button className="hover:opacity-70 transition-opacity" onClick={() => handleEditarClick(u)}> 
												<img src={EditIcon} alt="Editar" className="w-5 h-5" />
											</button>
											<button className="hover:opacity-70 transition-opacity" onClick={() => handleDeleteClick(u)}> 
												<img src={DeleteIcon} alt="Deletar" className="w-5 h-5" />
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Paginação */}
				<div className="flex items-center justify-center gap-2 h-[88px] flex-shrink-0">
					<button onClick={() => goToPage(paginacao.page - 1)} disabled={paginacao.page === 1} className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
						<span className="text-[#202224] font-['Poppins'] text-base font-medium">‹</span>
					</button>
					{(() => {
						const usuariosFiltrados = filtrarOrdenar();
						const totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / paginacao.limit));
						const maxPaginasVisiveis = 5;
						let paginaInicio = Math.max(1, paginacao.page - Math.floor(maxPaginasVisiveis / 2));
						let paginaFim = Math.min(totalPages, paginaInicio + maxPaginasVisiveis - 1);
						
						// Ajusta o início se estiver muito próximo do fim
						if (paginaFim - paginaInicio < maxPaginasVisiveis - 1) {
							paginaInicio = Math.max(1, paginaFim - maxPaginasVisiveis + 1);
						}
						
						const paginas = [];
						
						// Primeira página
						if (paginaInicio > 1) {
							paginas.push(
								<button
									key={1}
									onClick={() => goToPage(1)}
									className="flex items-center justify-center h-10 w-12 rounded-xl transition-all font-['Poppins'] text-sm font-medium border shadow-sm bg-white text-[#202224] hover:bg-[#edeefc] hover:shadow-md border-[rgba(6,28,67,0.4)]"
								>
									1
								</button>
							);
							
							if (paginaInicio > 2) {
								paginas.push(
									<span key="dots-start" className="flex items-center justify-center h-10 w-12 text-[#202224] font-['Poppins'] text-sm">
										...
									</span>
								);
							}
						}
						
						// Páginas intermediárias
						for (let i = paginaInicio; i <= paginaFim; i++) {
							const isActive = i === paginacao.page;
							paginas.push(
								<button
									key={i}
									onClick={() => goToPage(i)}
									className={`flex items-center justify-center h-10 w-12 rounded-xl transition-all font-['Poppins'] text-sm font-medium border shadow-sm ${
										isActive 
											? 'bg-[#edeefc] text-[#202224] border-[rgba(6,28,67,0.4)] shadow-md' 
											: 'bg-white text-[#202224] hover:bg-[#edeefc] hover:shadow-md border-[rgba(6,28,67,0.4)]'
									}`}
								>
									{i}
								</button>
							);
						}
						
						// Última página
						if (paginaFim < totalPages) {
							if (paginaFim < totalPages - 1) {
								paginas.push(
									<span key="dots-end" className="flex items-center justify-center h-10 w-12 text-[#202224] font-['Poppins'] text-sm">
										...
									</span>
								);
							}
							
							paginas.push(
								<button
									key={totalPages}
									onClick={() => goToPage(totalPages)}
									className="flex items-center justify-center h-10 w-12 rounded-xl transition-all font-['Poppins'] text-sm font-medium border shadow-sm bg-white text-[#202224] hover:bg-[#edeefc] hover:shadow-md border-[rgba(6,28,67,0.4)]"
								>
									{totalPages}
								</button>
							);
						}
						
						return paginas;
					})()}
					<button onClick={() => goToPage(paginacao.page + 1)} disabled={paginacao.page === Math.max(1, Math.ceil(filtrarOrdenar().length / paginacao.limit))} className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
						<span className="text-[#202224] font-['Poppins'] text-base font-medium">›</span>
					</button>
				</div>
			</div>
		</div>
	);
}
