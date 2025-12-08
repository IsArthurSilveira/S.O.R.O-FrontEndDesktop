import React, { useState, useEffect, useCallback } from 'react';
import { getClient } from '../services/apiService';
// Importa tipo Ocorrencia que contém o enum de status aninhado
import { Ocorrencia } from '../services/api/models/Ocorrencia'; 
// Importa componentes visuais do Material UI (MUI) e Lucide React
import { CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, InputLabel, FormControl, Pagination } from '@mui/material';
// CORREÇÃO 1: Trocado FilterList por Filter, que é o nome correto do ícone
import { Search, Filter } from 'lucide-react'; 

// CORREÇÃO 2.1: Define um alias de tipo para o enum de status aninhado no modelo Ocorrencia
type StatusSituacao = Ocorrencia.status_situacao;

// Interface para a resposta paginada da API (assumindo a estrutura padrão do backend)
interface OcorrenciasResponse {
  data: Ocorrencia[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Mapeamento para nomes de status mais amigáveis em Português
const statusMap: Record<StatusSituacao, string> = { 
  [Ocorrencia.status_situacao.PENDENTE]: 'Pendente', 
  [Ocorrencia.status_situacao.EM_ANDAMENTO]: 'Em Andamento', 
  [Ocorrencia.status_situacao.CONCLUIDO]: 'Concluído', 
  [Ocorrencia.status_situacao.CANCELADO]: 'Cancelado', 
};

// Componente auxiliar para badge de status
const StatusBadge = ({ status }: { status: StatusSituacao }) => {
    let colorClass = 'bg-gray-500';
    switch (status) {
      case Ocorrencia.status_situacao.PENDENTE:
        colorClass = 'bg-yellow-600';
        break;
      case Ocorrencia.status_situacao.EM_ANDAMENTO:
        colorClass = 'bg-blue-600';
        break;
      case Ocorrencia.status_situacao.CONCLUIDO:
        colorClass = 'bg-green-600';
        break;
      case Ocorrencia.status_situacao.CANCELADO:
        colorClass = 'bg-red-600';
        break;
      default:
        // Caso o status seja undefined, use uma cor padrão ou 'N/A'
        return <span className="text-gray-500 text-sm">N/A</span>;
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${colorClass}`}>
        {statusMap[status] || 'N/A'}
      </span>
    );
  };


const Ocorrencias: React.FC = () => {
  const [data, setData] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados de Filtro, usando StatusSituacao
  const [selectedStatus, setSelectedStatus] = useState<StatusSituacao | ''>('');
  const [subgrupoId, setSubgrupoId] = useState('');
  const [bairroId, setBairroId] = useState('');

  // Estados de Paginação
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);

  const fetchOcorrencias = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const client = getClient();
      
      // Chamada à API com os filtros e paginação
      const response = await client.ocorrNcias.getApiv3Ocorrencias(
        selectedStatus || undefined,
        subgrupoId || undefined,
        bairroId || undefined,
        page,
        limit
      ) as OcorrenciasResponse; 

      setData(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);

    } catch (err: any) {
      console.error("Erro ao carregar ocorrências:", err);
      
      const errorMessage = err.body?.message || err.message || 'Falha ao carregar a lista de ocorrências.';
      setError(errorMessage);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedStatus, subgrupoId, bairroId]);

  useEffect(() => {
    fetchOcorrencias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 
  
  // Função que executa a busca ao aplicar filtros, resetando a página para 1
  const handleFilterSearch = () => {
    setPage(1);
    // Chamada manual para garantir que os filtros atualizados no state sejam usados
    fetchOcorrencias();
  };

  // Tratando a mudança de status com o tipo correto
  const handleStatusChange = (event: { target: { value: StatusSituacao | '' } }) => {
    setSelectedStatus(event.target.value);
    setPage(1); 
  };

  // CORREÇÃO 3: Adicionando '_' ao parâmetro não utilizado 'event' para silenciar o aviso.
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Lista de chaves do enum para renderizar o Select
  const statusKeys = Object.keys(statusMap) as StatusSituacao[];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Lista de Ocorrências</h1>
        <button 
            onClick={() => {/* Implementar navegação */}}
            className="flex items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
        >
            + Nova Ocorrência
        </button>
      </div>

      {/* Seção de Filtros */}
      <Paper elevation={1} className="p-4 bg-white rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
            {/* CORREÇÃO 1: Uso do ícone Filter */}
            <Filter className="w-5 h-5 mr-2" /> Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <FormControl fullWidth size="small" className="bg-background">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              label="Status"
              onChange={(e) => handleStatusChange({ target: { value: e.target.value as StatusSituacao | '' } })}
            >
              <MenuItem value="">Todos</MenuItem>
              {statusKeys.map((key) => (
                <MenuItem key={key} value={key}>
                  {statusMap[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Campo de Bairro (Simulando o filtro bairroId) */}
          <input
            type="text"
            placeholder="Filtrar por ID do Bairro"
            value={bairroId}
            onChange={(e) => setBairroId(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
          />
          
          {/* Campo de Subgrupo (Simulando o filtro subgrupoId) */}
          <input
            type="text"
            placeholder="Filtrar por ID do Subgrupo"
            value={subgrupoId}
            onChange={(e) => setSubgrupoId(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
          />
          
          <button 
            onClick={handleFilterSearch}
            className="flex items-center justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </div>
      </Paper>


      {/* Seção de Conteúdo (Loading, Erro, Tabela) */}
      <Paper elevation={1} className="p-6 bg-white rounded-lg shadow-sm border border-border">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : data.length === 0 ? (
          <Alert severity="info">Nenhuma ocorrência encontrada com os filtros aplicados.</Alert>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-muted">
                    <TableCell className="font-semibold text-foreground">ID</TableCell>
                    <TableCell className="font-semibold text-foreground">Aviso</TableCell>
                    <TableCell className="font-semibold text-foreground">Acionamento</TableCell>
                    <TableCell className="font-semibold text-foreground">Status</TableCell>
                    <TableCell className="font-semibold text-foreground">Bairro ID</TableCell>
                    <TableCell className="font-semibold text-foreground">Subgrupo ID</TableCell>
                    <TableCell className="font-semibold text-foreground">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((ocorrencia) => (
                    <TableRow key={ocorrencia.id_ocorrencia} className="hover:bg-accent/50 transition-colors">
                      {/* Trunca o ID para melhor visualização */}
                      <TableCell>{ocorrencia.id_ocorrencia?.substring(0, 8)}...</TableCell>
                      <TableCell>{ocorrencia.nr_aviso || 'N/A'}</TableCell>
                      <TableCell>
                        {ocorrencia.data_acionamento ? new Date(ocorrencia.data_acionamento).toLocaleDateString('pt-BR') : 'N/A'} {ocorrencia.hora_acionamento}
                      </TableCell>
                      <TableCell>
                        {/* CORREÇÃO 2.2: Passa o status para o StatusBadge, e o componente lida com o undefined */}
                        <StatusBadge status={ocorrencia.status_situacao as StatusSituacao} /> 
                      </TableCell>
                      <TableCell>{ocorrencia.id_bairro_fk?.substring(0, 8)}...</TableCell>
                      <TableCell>{ocorrencia.id_subgrupo_fk?.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <button className="text-primary hover:text-primary/90 text-sm">
                          Ver Detalhes
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginação */}
            <div className="flex justify-center mt-4">
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                showFirstButton 
                showLastButton
              />
            </div>
          </>
        )}
      </Paper>
    </div>
  );
};

export default Ocorrencias;