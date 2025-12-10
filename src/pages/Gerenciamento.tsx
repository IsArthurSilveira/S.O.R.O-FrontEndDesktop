import { useState, useEffect } from 'react';
import { MapPin, FileText, Building2, Shield, FolderTree, Layers, Car, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { getClient } from '../services/apiService';
import AdicionarEditarModal from '../components/GerenciamentoDados/AdicionarEditarModal';
import DeletarModal from '../components/GerenciamentoDados/DeletarModal';

type TipoEntidade = 'bairros' | 'naturezas' | 'municipios' | 'unidades' | 'grupos' | 'subgrupos' | 'viaturas';

interface Entidade {
  id: string;
  nome?: string;
  descricao?: string;
  [key: string]: any;
}

interface Campo {
  nome: string;
  label: string;
  tipo: 'text' | 'select';
  obrigatorio: boolean;
  opcoes?: { valor: string; label: string }[];
}

const entidadesConfig = [
  { id: 'bairros', titulo: 'Bairros', descricao: 'Gerenciar bairros do sistema', icon: MapPin },
  { id: 'naturezas', titulo: 'Naturezas', descricao: 'Gerenciar naturezas de ocorrências', icon: FileText },
  { id: 'municipios', titulo: 'Municípios', descricao: 'Gerenciar municípios', icon: Building2 },
  { id: 'unidades', titulo: 'Unidades Operacionais', descricao: 'Gerenciar unidades operacionais', icon: Shield },
  { id: 'grupos', titulo: 'Grupos', descricao: 'Gerenciar grupos de ocorrências', icon: FolderTree },
  { id: 'subgrupos', titulo: 'Subgrupos', descricao: 'Gerenciar subgrupos de ocorrências', icon: Layers },
  { id: 'viaturas', titulo: 'Viaturas', descricao: 'Gerenciar viaturas', icon: Car }
];

const camposPorEntidade: Record<TipoEntidade, Campo[]> = {
  bairros: [
    { nome: 'nome_bairro', label: 'Nome do Bairro', tipo: 'text', obrigatorio: true },
    { nome: 'regiao', label: 'Região', tipo: 'text', obrigatorio: false },
    { nome: 'ais', label: 'AIS', tipo: 'text', obrigatorio: false }
  ],
  naturezas: [
    { nome: 'descricao', label: 'Descrição', tipo: 'text', obrigatorio: true }
  ],
  municipios: [
    { nome: 'nome_municipio', label: 'Nome do Município', tipo: 'text', obrigatorio: true }
  ],
  unidades: [
    { nome: 'nome_unidade_operacional', label: 'Nome da Unidade', tipo: 'text', obrigatorio: true },
    { nome: 'sigla', label: 'Sigla', tipo: 'text', obrigatorio: false }
  ],
  grupos: [
    { nome: 'nome_grupo', label: 'Nome do Grupo', tipo: 'text', obrigatorio: true }
  ],
  subgrupos: [
    { nome: 'nome_subgrupo', label: 'Nome do Subgrupo', tipo: 'text', obrigatorio: true }
  ],
  viaturas: [
    { nome: 'prefixo', label: 'Prefixo', tipo: 'text', obrigatorio: true },
    { nome: 'placa', label: 'Placa', tipo: 'text', obrigatorio: false }
  ]
};

export default function Gerenciamento() {
  const [entidadeSelecionada, setEntidadeSelecionada] = useState<TipoEntidade | null>(null);
  const [dados, setDados] = useState<Entidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDeletarAberto, setModalDeletarAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Entidade | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoBusca, setTermoBusca] = useState('');
  const itensPorPagina = 10;

  useEffect(() => {
    if (entidadeSelecionada) {
      carregarDados();
    }
  }, [entidadeSelecionada]);

  // Resetar página ao buscar
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  const carregarDados = async () => {
    if (!entidadeSelecionada) return;
    
    setLoading(true);
    try {
      const apiService = getClient();
      let resultado: any[] = [];
      
      switch (entidadeSelecionada) {
        case 'bairros':
          resultado = await apiService.adminBairros.getApiv3Bairros();
          break;
        case 'naturezas':
          resultado = await apiService.adminNaturezas.getApiv3Naturezas();
          break;
        case 'municipios':
          resultado = await apiService.adminMunicPios.getApiv3Municipios();
          break;
        case 'unidades':
          resultado = await apiService.adminUnidadesOperacionais.getApiV1UnidadesOperacionais();
          break;
        case 'grupos':
          resultado = await apiService.adminGrupos.getApiv3Grupos();
          break;
        case 'subgrupos':
          resultado = await apiService.adminSubgrupos.getApiv3Subgrupos();
          break;
        case 'viaturas':
          resultado = await apiService.adminViaturas.getApiV1Viaturas();
          break;
      }
      
      const dadosNormalizados = resultado.map((item: any) => {
        let id = '';
        let nome = '';
        
        switch (entidadeSelecionada) {
          case 'bairros':
            id = item.id_bairro;
            nome = item.nome_bairro;
            break;
          case 'naturezas':
            id = item.id_natureza;
            nome = item.descricao;
            break;
          case 'municipios':
            id = item.id_municipio;
            nome = item.nome_municipio;
            break;
          case 'unidades':
            id = item.id_unidade_operacional;
            nome = item.nome_unidade_operacional;
            break;
          case 'grupos':
            id = item.id_grupo;
            nome = item.nome_grupo;
            break;
          case 'subgrupos':
            id = item.id_subgrupo;
            nome = item.nome_subgrupo;
            break;
          case 'viaturas':
            id = item.id_viatura;
            nome = item.prefixo;
            break;
        }
        
        return { ...item, id, nome };
      });
      
      setDados(dadosNormalizados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarEntidade = (tipo: TipoEntidade) => {
    setEntidadeSelecionada(tipo);
    setPaginaAtual(1);
  };

  const handleVoltar = () => {
    setEntidadeSelecionada(null);
    setDados([]);
    setPaginaAtual(1);
  };

  const handleAdicionar = () => {
    setModoEdicao(false);
    setItemSelecionado(null);
    setModalAberto(true);
  };

  const handleEditar = (item: Entidade) => {
    setModoEdicao(true);
    setItemSelecionado(item);
    setModalAberto(true);
  };

  const handleDeletar = (item: Entidade) => {
    setItemSelecionado(item);
    setModalDeletarAberto(true);
  };

  const handleSalvar = async (dadosForm: any) => {
    if (!entidadeSelecionada) return;
    
    try {
      const apiService = getClient();
      if (modoEdicao && itemSelecionado) {
        // Editar (apenas para entidades que suportam PUT)
        switch (entidadeSelecionada) {
          case 'bairros':
            await apiService.adminBairros.putApiv3Bairros(itemSelecionado.id, dadosForm);
            break;
          case 'municipios':
            await apiService.adminMunicPios.putApiv3Municipios(itemSelecionado.id, dadosForm);
            break;
          // Unidades, grupos, subgrupos e viaturas não suportam PUT
          default:
            throw new Error('Edição não suportada para esta entidade');
        }
      } else {
        // Criar
        switch (entidadeSelecionada) {
          case 'bairros':
            await apiService.adminBairros.postApiv3Bairros(dadosForm);
            break;
          case 'naturezas':
            await apiService.adminNaturezas.postApiv3Naturezas(dadosForm);
            break;
          case 'municipios':
            await apiService.adminMunicPios.postApiv3Municipios(dadosForm);
            break;
          case 'unidades':
            await apiService.adminUnidadesOperacionais.postApiV1UnidadesOperacionais(dadosForm);
            break;
          case 'grupos':
            await apiService.adminGrupos.postApiv3Grupos(dadosForm);
            break;
          case 'subgrupos':
            await apiService.adminSubgrupos.postApiv3Subgrupos(dadosForm);
            break;
          case 'viaturas':
            await apiService.adminViaturas.postApiV1Viaturas(dadosForm);
            break;
        }
      }
      
      await carregarDados();
      setModalAberto(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      throw error;
    }
  };

  const handleConfirmarDeletar = async () => {
    if (!entidadeSelecionada || !itemSelecionado) return;
    
    try {
      const apiService = getClient();
      switch (entidadeSelecionada) {
        case 'bairros':
          await apiService.adminBairros.deleteApiv3Bairros(itemSelecionado.id);
          break;
        case 'naturezas':
          await apiService.adminNaturezas.deleteApiv3Naturezas(itemSelecionado.id);
          break;
        case 'municipios':
          await apiService.adminMunicPios.deleteApiv3Municipios(itemSelecionado.id);
          break;
        case 'unidades':
          await apiService.adminUnidadesOperacionais.deleteApiV1UnidadesOperacionais(itemSelecionado.id);
          break;
        case 'grupos':
          await apiService.adminGrupos.deleteApiv3Grupos(itemSelecionado.id);
          break;
        case 'subgrupos':
          await apiService.adminSubgrupos.deleteApiv3Subgrupos(itemSelecionado.id);
          break;
        case 'viaturas':
          await apiService.adminViaturas.deleteApiV1Viaturas(itemSelecionado.id);
          break;
      }
      
      await carregarDados();
      setModalDeletarAberto(false);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      throw error;
    }
  };

  if (!entidadeSelecionada) {
    return (
      <div className="flex flex-col h-full">
        <div className="-mt-6 flex flex-col h-full">
          <div className="mb-6 mt-[12px]">
            <h1 className="font-['Poppins'] font-semibold text-base text-[#202224]">
              Gerenciamento de Dados
            </h1>
            <p className="font-['Poppins'] text-sm text-[#535862] mt-1">
              Selecione uma categoria para gerenciar os dados do sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entidadesConfig.map((entidade) => {
              const Icon = entidade.icon;
              return (
              <button
                key={entidade.id}
                onClick={() => handleSelecionarEntidade(entidade.id as TipoEntidade)}
                className="flex flex-col items-start gap-3 p-5 bg-white border border-[#e9eaeb] rounded-xl hover:border-black hover:shadow-md transition-all text-left"
              >
                <div className="bg-[#edeefc] p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-[#202224]" />
                </div>
                <div>
                  <h3 className="font-['Poppins'] font-semibold text-sm text-[#202224]">
                    {entidade.titulo}
                  </h3>
                  <p className="font-['Poppins'] text-xs text-[#535862] mt-1">
                    {entidade.descricao}
                  </p>
                </div>
              </button>
            );
            })}
          </div>
        </div>
      </div>
    );
  }

  const entidadeAtual = entidadesConfig.find(e => e.id === entidadeSelecionada);

  return (
    <div className="flex flex-col h-full">
      <div className="-mt-6 flex flex-col h-full">
        <div className="mb-3 mt-[12px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVoltar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg">←</span>
            </button>
            <div>
              <h1 className="font-['Poppins'] font-semibold text-base text-[#202224]">
                {entidadeAtual?.titulo}
              </h1>
              <p className="font-['Poppins'] text-xs text-[#535862]">
                {entidadeAtual?.descricao}
              </p>
            </div>
          </div>

          <button
            onClick={handleAdicionar}
            className="flex items-center gap-2 px-4 py-2 bg-[#70b37b] text-white rounded-lg hover:bg-[#5fa36a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-['Poppins'] text-sm font-medium">Adicionar</span>
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-white border border-[rgba(6,28,67,0.4)] rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por ID ou nome"
            className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-gray-400 font-['Poppins']"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-0 overflow-hidden rounded-tl-lg rounded-tr-lg flex-1 min-h-0 border border-[rgba(6,28,67,0.4)]">
          <div className="bg-[#edeefc] border-b border-[rgba(6,28,67,0.4)] flex items-center gap-4 h-10 px-4 py-2 flex-shrink-0">
            <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-32">ID</p>
            <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 flex-1">NOME</p>
            <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-24">AÇÕES</p>
          </div>

          <div className="flex flex-col overflow-y-auto flex-1 bg-white">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-['Poppins'] text-sm text-[#202224] opacity-60">Carregando...</p>
              </div>
            ) : dados.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="font-['Poppins'] text-sm text-[#202224] opacity-60">
                    Nenhum registro encontrado
                  </p>
                  <p className="font-['Poppins'] text-xs text-[#535862] mt-1">
                    Clique em "Adicionar" para criar um novo registro
                  </p>
                </div>
              </div>
            ) : (
              (() => {
                // Filtrar dados pela busca
                const dadosFiltrados = termoBusca.trim()
                  ? dados.filter((item) => {
                      const termo = termoBusca.toLowerCase().trim();
                      const id = (item.id || '').toString().toLowerCase();
                      const nome = (item.nome || item.descricao || '').toString().toLowerCase();
                      return id.includes(termo) || nome.includes(termo);
                    })
                  : dados;
                
                // Aplicar paginação
                const indiceInicio = (paginaAtual - 1) * itensPorPagina;
                const indiceFim = indiceInicio + itensPorPagina;
                const dadosPaginados = dadosFiltrados.slice(indiceInicio, indiceFim);
                
                return dadosPaginados.map((item) => (
                <div key={item.id} className="border-b border-[rgba(6,28,67,0.4)] h-10">
                  <div className="flex items-center gap-4 px-4 h-full">
                    <p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-32 truncate">
                      #{item.id.slice(0, 8)}
                    </p>
                    <p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 flex-1 truncate">
                      {item.nome || item.descricao || '-'}
                    </p>
                    <div className="flex items-center gap-2 w-24">
                      {/* Botão editar desabilitado para entidades sem suporte PUT */}
                      {(entidadeSelecionada === 'bairros' || entidadeSelecionada === 'municipios') ? (
                        <button 
                          onClick={() => handleEditar(item)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-[#202224]" />
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="p-1.5 rounded transition-colors opacity-30 cursor-not-allowed"
                          title="Edição não disponível"
                        >
                          <Edit2 className="w-4 h-4 text-[#202224]" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeletar(item)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ));
              })()
            )}
          </div>
        </div>

        {/* Paginação */}
        {!loading && dados.length > 0 && (() => {
          // Calcular total de páginas baseado nos dados filtrados
          const dadosFiltrados = termoBusca.trim()
            ? dados.filter((item) => {
                const termo = termoBusca.toLowerCase().trim();
                const id = (item.id || '').toString().toLowerCase();
                const nome = (item.nome || item.descricao || '').toString().toLowerCase();
                return id.includes(termo) || nome.includes(termo);
              })
            : dados;
          const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
          return totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 h-[88px] flex-shrink-0">
              {/* Botão Anterior */}
              <button
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span className="text-[#202224] font-['Poppins'] text-base font-medium">‹</span>
              </button>

              {/* Números das Páginas */}
              {(() => {
                const maxPaginasVisiveis = 5;
                let paginaInicio = Math.max(1, paginaAtual - Math.floor(maxPaginasVisiveis / 2));
                let paginaFim = Math.min(totalPaginas, paginaInicio + maxPaginasVisiveis - 1);
                
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
                      onClick={() => setPaginaAtual(1)}
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
                  const isActive = i === paginaAtual;
                  paginas.push(
                    <button
                      key={i}
                      onClick={() => setPaginaAtual(i)}
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
                if (paginaFim < totalPaginas) {
                  if (paginaFim < totalPaginas - 1) {
                    paginas.push(
                      <span key="dots-end" className="flex items-center justify-center h-10 w-12 text-[#202224] font-['Poppins'] text-sm">
                        ...
                      </span>
                    );
                  }
                  
                  paginas.push(
                    <button
                      key={totalPaginas}
                      onClick={() => setPaginaAtual(totalPaginas)}
                      className="flex items-center justify-center h-10 w-12 rounded-xl transition-all font-['Poppins'] text-sm font-medium border shadow-sm bg-white text-[#202224] hover:bg-[#edeefc] hover:shadow-md border-[rgba(6,28,67,0.4)]"
                    >
                      {totalPaginas}
                    </button>
                  );
                }
                
                return paginas;
              })()}

              {/* Botão Próximo */}
              <button
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span className="text-[#202224] font-['Poppins'] text-base font-medium">›</span>
              </button>
            </div>
          );
        })()}
      </div>

      {/* Modais */}
      <AdicionarEditarModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        titulo={entidadeAtual?.titulo || ''}
        campos={camposPorEntidade[entidadeSelecionada]}
        dadosIniciais={itemSelecionado}
        modoEdicao={modoEdicao}
      />

      <DeletarModal
        isOpen={modalDeletarAberto}
        onClose={() => setModalDeletarAberto(false)}
        onConfirmar={handleConfirmarDeletar}
        titulo={entidadeAtual?.titulo || ''}
        nomeItem={itemSelecionado?.nome || itemSelecionado?.descricao || ''}
      />
    </div>
  );
}
