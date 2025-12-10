import { useState, useEffect } from 'react';
import { getClient } from '../services/apiService';
import type { FiltrosOcorrencia, StatusOcorrencia } from '../types';
import FiltrosModal from '../components/Ocorrencias/FiltrosModal';

// Ícones KPI (Black para a listagem)
import KpiCanceladaBlack from '../assets/KPI-icons/KPI-Cancelada-Black.svg';
import KpiPendenteBlack from '../assets/KPI-icons/KPI-Pendente-Black.svg';
import KpiAndamentoBlack from '../assets/KPI-icons/KPI-Andamento-Black.svg';
import KpiConcluidoBlack from '../assets/KPI-icons/KPI-Concluído-Black.svg';

// Ícones de Ações
import SearchIcon from '../assets/Actions/Search-Icon.svg';
import EditIcon from '../assets/Actions/Edit-Icon.svg';
import ViewIcon from '../assets/Actions/Details-Icon.svg';
import ExportIcon from '../assets/Actions/CSV-Icon.svg';
import FilterIcon from '../assets/Actions/Filter-Icon.svg';
import SortIcon from '../assets/Actions/Reorder-Icon.svg';

export default function Ocorrencias() {
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosOcorrencia>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [paginacao, setPaginacao] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [subgrupos, setSubgrupos] = useState<Map<string, any>>(new Map());
  const [grupos, setGrupos] = useState<Map<string, any>>(new Map());
  const [naturezas, setNaturezas] = useState<Map<string, any>>(new Map());
  const [bairros, setBairros] = useState<Map<string, any>>(new Map());
  const [municipios, setMunicipios] = useState<Map<string, any>>(new Map());

  const api = getClient();

  // Carregar dados relacionados uma única vez
  useEffect(() => {
    carregarDadosRelacionados();
  }, []);

  // Bloquear rolagem do mouse e toque enquanto a tela de Ocorrências estiver montada
  useEffect(() => {
    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    const preventTouch = (e: TouchEvent) => {
      e.preventDefault();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('wheel', preventWheel, { passive: false });
    window.addEventListener('touchmove', preventTouch, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventWheel as EventListener);
      window.removeEventListener('touchmove', preventTouch as EventListener);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Carregar ocorrências
  useEffect(() => {
    if (subgrupos.size > 0 && grupos.size > 0 && naturezas.size > 0 && bairros.size > 0) {
      carregarOcorrencias();
    }
  }, [filtros, paginacao.page, subgrupos, grupos, naturezas, bairros, termoBusca]);

  // Resetar página ao buscar
  useEffect(() => {
    setPaginacao(prev => ({ ...prev, page: 1 }));
  }, [termoBusca]);

  const carregarDadosRelacionados = async () => {
    try {
      // Carregar naturezas
      const naturezasData = await api.adminNaturezas.getApiv3Naturezas();
      const naturezasMap = new Map();
      naturezasData.forEach((n: any) => {
        naturezasMap.set(n.id_natureza, n);
      });
      setNaturezas(naturezasMap);
      console.log('✅ Naturezas carregadas:', naturezasMap.size);

      // Carregar grupos
      const gruposData = await api.adminGrupos.getApiv3Grupos();
      const gruposMap = new Map();
      gruposData.forEach((g: any) => {
        gruposMap.set(g.id_grupo, g);
      });
      setGrupos(gruposMap);
      console.log('✅ Grupos carregados:', gruposMap.size);

      // Carregar subgrupos
      const subgruposData = await api.adminSubgrupos.getApiv3Subgrupos();
      const subgruposMap = new Map();
      subgruposData.forEach((sg: any) => {
        subgruposMap.set(sg.id_subgrupo, sg);
      });
      setSubgrupos(subgruposMap);
      console.log('✅ Subgrupos carregados:', subgruposMap.size);

      // Carregar bairros
      const bairrosData = await api.adminBairros.getApiv3Bairros();
      const bairrosMap = new Map();
      bairrosData.forEach((b: any) => {
        bairrosMap.set(b.id_bairro, b);
      });
      setBairros(bairrosMap);
      console.log('✅ Bairros carregados:', bairrosMap.size);

      // Carregar municípios
      const municipiosData = await api.adminMunicPios.getApiv3Municipios();
      const municipiosMap = new Map();
      municipiosData.forEach((m: any) => {
        municipiosMap.set(m.id_municipio, m);
      });
      setMunicipios(municipiosMap);
      console.log('✅ Municípios carregados:', municipiosMap.size);
    } catch (err) {
      console.error('❌ Erro ao carregar dados relacionados:', err);
    }
  };

  const carregarOcorrencias = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Se há busca ativa, carrega todas as ocorrências de uma vez
      // Caso contrário, carrega apenas a página atual
      const limitParaCarregar = termoBusca.trim() ? 1000 : paginacao.limit;
      const paginaParaCarregar = termoBusca.trim() ? 1 : paginacao.page;
      
      const response = await api.ocorrNcias.getApiv3Ocorrencias(
        filtros.status,
        filtros.subgrupoId,
        filtros.bairroId,
        paginaParaCarregar,
        limitParaCarregar
      );

      console.log('📦 Ocorrências carregadas:', response.data?.length || 0);
      if (response.data && response.data.length > 0) {
        console.log('📅 Formato da data:', response.data[0].data_acionamento);
        console.log('⏰ Formato da hora:', response.data[0].hora_acionamento);
      }

      setOcorrencias(response.data || []);
      setPaginacao({
        ...paginacao,
        total: response.total || 0,
        totalPages: response.totalPages || 1
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ocorrências');
      console.error('Erro ao carregar ocorrências:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar ocorrências pela busca (ID ou número de aviso)
  // Se há termo de busca, filtra localmente. Caso contrário, usa a lista da API
  const ocorrenciasFiltradas = termoBusca.trim() 
    ? ocorrencias.filter((ocorrencia) => {
        const termo = termoBusca.toLowerCase().trim();
        const nrAviso = (ocorrencia.nr_aviso || '').toString().toLowerCase();
        const idOcorrencia = (ocorrencia.id_ocorrencia || '').toString().toLowerCase();
        
        // Busca por nr_aviso ou id_ocorrencia
        return nrAviso.includes(termo) || idOcorrencia.includes(termo);
      })
    : ocorrencias;

  // Aplicar paginação apenas quando há busca (paginação local)
  // Quando não há busca, a API já retorna os dados paginados
  const totalFiltradas = ocorrenciasFiltradas.length;
  const totalPaginasFiltradas = Math.max(1, Math.ceil(totalFiltradas / paginacao.limit));
  
  const ocorrenciasPaginadas = termoBusca.trim()
    ? ocorrenciasFiltradas.slice((paginacao.page - 1) * paginacao.limit, paginacao.page * paginacao.limit)
    : ocorrenciasFiltradas; // Sem busca, usa direto da API (já vem paginado)

  const handleExportCSV = () => {
    // Implementar exportação CSV
    const csv = [
      ['ID', 'Data', 'Natureza', 'Município', 'Bairro', 'Status'],
      ...ocorrencias.map(o => [
        o.nr_aviso || o.id_ocorrencia,
        `${o.data_acionamento} - ${o.hora_acionamento}`,
        getNatureza(o),
        getMunicipio(o),
        getBairro(o),
        o.status_situacao
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ocorrencias.csv';
    a.click();
  };

  const getStatusIcon = (status: StatusOcorrencia) => {
    switch (status) {
      case 'CANCELADO':
        return KpiCanceladaBlack;
      case 'PENDENTE':
        return KpiPendenteBlack;
      case 'EM_ANDAMENTO':
        return KpiAndamentoBlack;
      case 'CONCLUIDO':
        return KpiConcluidoBlack;
      default:
        return KpiPendenteBlack;
    }
  };

  const getStatusLabel = (status: StatusOcorrencia) => {
    switch (status) {
      case 'CANCELADO':
        return 'Cancelada';
      case 'PENDENTE':
        return 'Pendente';
      case 'EM_ANDAMENTO':
        return 'Em andamento';
      case 'CONCLUIDO':
        return 'Concluída';
      default:
        return status;
    }
  };

  const formatarData = (data: string, hora: string) => {
    if (!data || !hora) return '-';
    
    try {
      let dataFormatada = '';
      let horaFormatada = '';
      
      // Formatar DATA
      if (data.includes('T')) {
        // ISO string
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        dataFormatada = `${dia}/${mes}/${ano}`;
      } else if (data.includes('-')) {
        // YYYY-MM-DD
        const [ano, mes, dia] = data.split('-');
        dataFormatada = `${dia}/${mes}/${ano}`;
      } else if (data.includes('/')) {
        // Já formatado
        dataFormatada = data;
      } else {
        dataFormatada = data;
      }
      
      // Formatar HORA
      if (hora.includes('T')) {
        // ISO string - extrair apenas HH:MM
        const horaObj = new Date(hora);
        const horas = String(horaObj.getHours()).padStart(2, '0');
        const minutos = String(horaObj.getMinutes()).padStart(2, '0');
        horaFormatada = `${horas}:${minutos}`;
      } else if (hora.includes(':')) {
        // Já é HH:MM ou HH:MM:SS
        const partes = hora.split(':');
        horaFormatada = `${partes[0]}:${partes[1]}`;
      } else {
        horaFormatada = hora;
      }
      
      return `${dataFormatada} - ${horaFormatada}`;
    } catch (err) {
      console.error('Erro ao formatar data:', err, 'Data:', data, 'Hora:', hora);
      return `${data} - ${hora}`;
    }
  };

  const getNatureza = (ocorrencia: any) => {
    const subgrupo = subgrupos.get(ocorrencia.id_subgrupo_fk);
    if (subgrupo?.id_grupo_fk) {
      const grupo = grupos.get(subgrupo.id_grupo_fk);
      if (grupo?.id_natureza_fk) {
        const natureza = naturezas.get(grupo.id_natureza_fk);
        return natureza?.descricao || '-';
      }
    }
    return '-';
  };

  const getMunicipio = (ocorrencia: any) => {
    const bairro = bairros.get(ocorrencia.id_bairro_fk);
    if (bairro?.id_municipio_fk) {
      const municipio = municipios.get(bairro.id_municipio_fk);
      return municipio?.nome_municipio || '-';
    }
    return '-';
  };

  const getBairro = (ocorrencia: any) => {
    const bairro = bairros.get(ocorrencia.id_bairro_fk);
    return bairro?.nome_bairro || '-';
  };

  const goToPage = (page: number) => {
    const totalPages = termoBusca.trim() ? totalPaginasFiltradas : paginacao.totalPages;
    if (page >= 1 && page <= totalPages) {
      setPaginacao({ ...paginacao, page });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Container com margem negativa para subir o conteúdo */}
      <div className="-mt-6 flex flex-col h-full">
        {/* Título da Página */}
        <div className="mb-3 mt-[12px]">
          <h1 className="font-['Poppins'] font-semibold text-base text-[#202224] leading-normal">
            Lista de ocorrências
          </h1>
        </div>

      {/* Botão Exportar */}
      <div className="flex justify-end mb-0">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-tl-lg rounded-tr-lg bg-[rgba(160,237,173,0.6)] border border-[rgba(6,28,67,0.4)] border-b-0 hover:bg-[rgba(160,237,173,0.8)] transition-colors"
        >
          <img src={ExportIcon} alt="Exportar" className="w-5 h-5" />
          <span className="font-['Poppins'] text-xs text-black">
            Exportar Relatório
          </span>
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
            placeholder="Pesquisar por ID ou número de aviso"
            className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[rgba(0,0,0,0.2)] font-['Poppins']"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-1.5">
          <button 
            className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            onClick={() => {
              setOrdemCrescente(!ordemCrescente);
              setOcorrencias([...ocorrencias].reverse());
            }}
            title={ordemCrescente ? "Ordenar decrescente" : "Ordenar crescente"}
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

      {/* Modal de Filtros */}
      <FiltrosModal
        isOpen={mostrarFiltros}
        onClose={() => setMostrarFiltros(false)}
        filtros={filtros}
        onAplicarFiltros={setFiltros}
      />

      {/* Tabela de Ocorrências */}
      <div className="flex flex-col gap-0 overflow-hidden rounded-tl-lg rounded-tr-lg flex-1 min-h-0">
        {/* Cabeçalho da Tabela */}
        <div className="bg-[#edeefc] border border-[rgba(6,28,67,0.4)] flex items-center gap-4 h-10 px-4 py-2 rounded-tl-lg rounded-tr-lg flex-shrink-0">
          <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-20">ID</p>
          <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-44 ml-8">DATA E HORA</p>
          <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-40">NATUREZA</p>
          <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 flex-1 ml-8">MUNICÍPIO E BAIRRO</p>
          <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-28">STATUS</p>
          <p className="font-['Poppins'] font-bold text-xs text-[#202224] opacity-90 w-24">AÇÕES</p>
        </div>

        {/* Conteúdo da Tabela */}
        <div className="flex flex-col flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-['Poppins'] text-sm text-[#202224] opacity-60">Carregando...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-['Poppins'] text-sm text-red-600">{error}</p>
            </div>
          ) : ocorrenciasPaginadas.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-['Poppins'] text-sm text-[#202224] opacity-60">
                {termoBusca.trim() ? 'Nenhuma ocorrência encontrada com esse ID' : 'Nenhuma ocorrência encontrada'}
              </p>
            </div>
          ) : (
            ocorrenciasPaginadas.map((ocorrencia) => (
              <div
                key={ocorrencia.id_ocorrencia}
                className="border-b border-[rgba(6,28,67,0.4)] h-10 overflow-hidden relative"
              >
                <div className="flex items-center gap-4 px-4 h-full">
                  <p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-20 truncate">
                    {ocorrencia.nr_aviso || `#${ocorrencia.id_ocorrencia.substring(0, 8)}`}
                  </p>
                  <p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-44 truncate ml-8">
                    {formatarData(ocorrencia.data_acionamento, ocorrencia.hora_acionamento)}
                  </p>
                  <p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 w-40 truncate" title={getNatureza(ocorrencia)}>
                    {getNatureza(ocorrencia)}
                  </p>
                  <p className="font-['Poppins'] font-medium text-xs text-[#202224] opacity-90 flex-1 truncate ml-8" title={`${getMunicipio(ocorrencia)} - ${getBairro(ocorrencia)}`}>
                    {getMunicipio(ocorrencia)} - {getBairro(ocorrencia)}
                  </p>

                  {/* Status Label */}
                  <div className="flex items-center gap-1.5 h-7 w-28 bg-[#edeefc] rounded px-2">
                    <img 
                      src={getStatusIcon(ocorrencia.status_situacao)} 
                      alt={ocorrencia.status_situacao}
                      className="w-4 h-4"
                    />
                    <p className="font-['Poppins'] font-medium text-[10px] text-black truncate">
                      {getStatusLabel(ocorrencia.status_situacao)}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 w-24">
                    <button 
                      className="hover:opacity-70 transition-opacity"
                      onClick={() => window.location.href = `/ocorrencias/${ocorrencia.id_ocorrencia}`}
                    >
                      <img src={ViewIcon} alt="Visualizar" className="w-5 h-5" />
                    </button>
                    <button 
                      className="hover:opacity-70 transition-opacity"
                      onClick={() => window.location.href = `/ocorrencias/${ocorrencia.id_ocorrencia}/editar`}
                    >
                      <img src={EditIcon} alt="Editar" className="w-5 h-5" />
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
        {/* Botão Anterior */}
        <button
          onClick={() => goToPage(paginacao.page - 1)}
          disabled={paginacao.page === 1}
          className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <span className="text-[#202224] font-['Poppins'] text-base font-medium">‹</span>
        </button>

        {/* Números das Páginas */}
        {(() => {
          const totalPages = termoBusca.trim() ? totalPaginasFiltradas : paginacao.totalPages;
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

        {/* Botão Próximo */}
        <button
          onClick={() => goToPage(paginacao.page + 1)}
          disabled={paginacao.page === (termoBusca.trim() ? totalPaginasFiltradas : paginacao.totalPages)}
          className="flex items-center justify-center h-10 w-12 rounded-xl bg-white border border-[rgba(6,28,67,0.4)] hover:bg-[#edeefc] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <span className="text-[#202224] font-['Poppins'] text-base font-medium">›</span>
        </button>
      </div>
      </div>
    </div>
  );
}
