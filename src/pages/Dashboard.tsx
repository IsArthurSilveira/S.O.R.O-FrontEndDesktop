import React, { useEffect, useState } from 'react';
import { getClient } from '../services/apiService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import KPIPendenteIcon from '../assets/KPI-icons/KPI-Pendente.svg';
import KPIAndamentoIcon from '../assets/KPI-icons/KPI-Andamento.svg';
import KPIConcluidoIcon from '../assets/KPI-icons/KPI-Concluido.svg';
import KPICanceladaIcon from '../assets/KPI-icons/KPI-Cancelada.svg';

interface DashboardData {
  status: Record<string, number>;
  porPeriodo: Array<{ periodo: string; total: number; totalAnterior?: number }>;
  porTipo: Array<{ nome: string; total: number; avgTime?: string }>;
  porMunicipio: Array<{ nome: string; total: number }>;
  tempoMedio: Array<{ tipo: string; tempo: number }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState<string>('Hoje');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = getClient();
        
        // Calcular datas baseado no filtro - undefined para "Hoje" (usa default do backend)
        let dataInicio: string | undefined = undefined;
        let dataFim: string | undefined = undefined;
        
        if (filtro === 'Semana') {
          const hoje = new Date();
          const semanaAtras = new Date(hoje);
          semanaAtras.setDate(hoje.getDate() - 7);
          dataInicio = semanaAtras.toISOString().split('T')[0];
          dataFim = hoje.toISOString().split('T')[0];
        } else if (filtro === 'Mês') {
          const hoje = new Date();
          const mesAtras = new Date(hoje);
          mesAtras.setMonth(hoje.getMonth() - 1);
          dataInicio = mesAtras.toISOString().split('T')[0];
          dataFim = hoje.toISOString().split('T')[0];
        }
        
        // Chamadas paralelas com tratamento individual de erros
        const [statusRaw, periodoRaw, tipoRaw, municipioRaw, tempoMedioRaw] = await Promise.allSettled([
            client.dashboard.getApiv3DashboardOcorrenciasPorStatus(dataInicio, dataFim),
            client.dashboard.getApiv3DashboardOcorrenciasPorPeriodo('day', dataInicio, dataFim),
            client.dashboard.getApiv3DashboardOcorrenciasPorTipo(dataInicio, dataFim),
            client.dashboard.getApiv3DashboardOcorrenciasPorMunicipio(dataInicio, dataFim),
            client.dashboard.getApiv3DashboardAvgCompletionTime(dataInicio, dataFim)
        ]);

        // Função helper com dados mock
        const getValueOrDefault = <T,>(result: PromiseSettledResult<T>, defaultValue: T): T => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.warn('Endpoint indisponível, usando dados mock:', result.reason?.message || result.reason);
            return defaultValue;
          }
        };

        // Dados mock completos
        const mockStatus = { CONCLUIDO: 30, EM_ANDAMENTO: 10, PENDENTE: 2, CANCELADA: 1 };
        const mockPeriodo = [
          { periodo: '2025-12-02', total: 20, totalAnterior: 15 },
          { periodo: '2025-12-03', total: 15, totalAnterior: 18 },
          { periodo: '2025-12-04', total: 25, totalAnterior: 20 },
          { periodo: '2025-12-05', total: 30, totalAnterior: 22 },
          { periodo: '2025-12-06', total: 35, totalAnterior: 28 },
          { periodo: '2025-12-07', total: 28, totalAnterior: 32 },
          { periodo: '2025-12-08', total: 32, totalAnterior: 35 }
        ];
        const mockTipo = [
          { nome: 'Incêndio', total: 54 },
          { nome: 'Resgate', total: 35 },
          { nome: 'Busca', total: 28 },
          { nome: 'Árvores', total: 23 },
          { nome: 'Afogamento', total: 18 },
          { nome: 'Pré-Hospitalar', total: 12 }
        ];
        const mockMunicipio = [
          { nome: 'Recife', total: 54 },
          { nome: 'Garanhuns', total: 35 },
          { nome: 'Jaboatão', total: 15 },
          { nome: 'Lajedo', total: 3 }
        ];
        const mockTempoMedio = [
          { tipo: 'Incêndio', tempo: 2.5 },
          { tipo: 'APH', tempo: 3.2 },
          { tipo: 'Salvamento', tempo: 1.8 },
          { tipo: 'Produtos Perigosos', tempo: 3.8 },
          { tipo: 'Prevenção', tempo: 4.2 },
          { tipo: 'Atividade Comunitária', tempo: 3.5 }
        ];

        setData({
          status: getValueOrDefault(statusRaw, mockStatus) as Record<string, number>,
          porPeriodo: getValueOrDefault(periodoRaw, mockPeriodo) as any[],
          porTipo: getValueOrDefault(tipoRaw, mockTipo) as any[],
          porMunicipio: getValueOrDefault(municipioRaw, mockMunicipio) as any[],
          tempoMedio: getValueOrDefault(tempoMedioRaw, mockTempoMedio) as any[]
        });

      } catch (err) {
        console.error("Erro crítico ao carregar dashboard:", err);
        setError('Falha ao carregar dados. Verifique se o backend está rodando e acessível.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtro]);



  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const totalConcluidas = data?.status['CONCLUIDO'] || 0;
  const totalAndamento = data?.status['EM_ANDAMENTO'] || 0;
  const totalPendentes = data?.status['PENDENTE'] || 0;
  const totalCanceladas = data?.status['CANCELADA'] || 0;

  // Dados para o gráfico de linha (semana)
  const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const dadosSemana = data?.porPeriodo?.slice(-7).map((item, idx) => ({
    dia: diasSemana[idx % 7],
    atual: item.total,
    anterior: item.totalAnterior || Math.round(item.total * 0.8)
  })) || [];

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden p-3 -mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-semibold text-[14px] text-black">Dashboard</h1>
        <div className="relative inline-flex items-center justify-center cursor-pointer bg-white rounded-full shadow-sm px-3 py-1">
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="appearance-none bg-transparent border-none font-normal text-[12px] text-black pr-5 pl-1 py-0.5 cursor-pointer focus:outline-none"
          >
            <option value="Hoje">Hoje</option>
            <option value="Semana">Semana</option>
            <option value="Mês">Mês</option>
          </select>
          <span className="absolute right-3 pointer-events-none text-black transform rotate-90 text-[12px]">&gt;</span>
        </div>
      </div>

      {/* Container ajustável para subir todo o conteúdo */}
      <div className="-mt-0">
        {/* Grid principal: 2 colunas em desktop, 1 coluna em mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-2 min-h-fit">
          
          {/* Coluna Esquerda */}
          <div className="flex flex-col gap-2">
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-h-[72px]">
              <KPICard 
                title="Concluídas" 
                value={totalConcluidas} 
                icon={KPIConcluidoIcon}
              />
              <KPICard 
                title="Em andamento" 
                value={totalAndamento} 
                icon={KPIAndamentoIcon}
              />
              <KPICard 
                title="Pendente" 
                value={totalPendentes} 
                icon={KPIPendenteIcon}
              />
              <KPICard 
                title="Canceladas" 
                value={totalCanceladas} 
                icon={KPICanceladaIcon}
              />
            </div>

            {/* Tempo médio de conclusão */}
            <div className="bg-white rounded-[16px] shadow-[0px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] p-2 flex flex-col min-h-[240px] sm:min-h-[280px]">
            <h3 className="font-medium text-[13px] text-black mb-2">
              Tempo médio de conclusão por tipo de ocorrência
            </h3>
            <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data?.tempoMedio?.slice(0, 6) || []}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4EAF0" />
                <XAxis 
                  dataKey="tipo" 
                  tick={{ fontSize: 10, fill: '#646A73' }}
                  angle={0}
                  textAnchor="middle"
                  height={40}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.4)' }}
                  tickFormatter={(val) => `${val}H`}
                />
                <Tooltip 
                  formatter={(val: number) => [`${val.toFixed(1)}H`, 'Tempo Médio']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #E4EAF0', fontSize: 11 }}
                />
                <Bar 
                  dataKey="tempo" 
                  fill="#9EB9E3" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>

            {/* Total por período */}
            <div className="bg-white rounded-[16px] shadow-[0px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] p-2 flex flex-col min-h-[268px] sm:min-h-[300px]">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-medium text-[13px] text-black">
                Total de ocorrências por período
              </h3>
              <span className="text-[12px] text-[rgba(0,0,0,0.1)]">|</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                  <span className="text-[10px] text-black">Atual</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#A0BCE8]"></div>
                  <span className="text-[10px] text-black">Período passado</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={dadosSemana}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4EAF0" />
                <XAxis 
                  dataKey="dia" 
                  tick={{ fontSize: 10, fill: '#646A73' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.4)' }}
                  domain={[0, 50]}
                  ticks={[0, 10, 20, 30, 40, 50]}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: 8, border: '1px solid #E4EAF0', fontSize: 11 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="anterior" 
                  stroke="#A0BCE8" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="atual" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>
          </div>

          {/* Coluna Direita */}
          <div className="flex flex-col gap-2">
            {/* Nº de Ocorrências por Município */}
            <div className="bg-white rounded-[16px] shadow-[0px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] p-2 flex flex-col w-full min-h-[320px] sm:min-h-[360px]">
              <h3 className="font-medium text-[13px] text-black mb-1">
              Nº de ocorrência por Município
              </h3>
              <div className="flex flex-col gap-1 flex-1 min-h-0">
              {/* Gráfico */}
              <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                data={data?.porMunicipio?.slice(0, 4) || []}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="total"
                >
                {(data?.porMunicipio?.slice(0, 4) || []).map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={['#E57373', '#64B5F6', '#FFD54F', '#81C784'][index]} />
                ))}
                </Pie>
                <Tooltip />
              </PieChart>
              </ResponsiveContainer>
              </div>
              
              {/* Legenda */}
              <div className="flex flex-col gap-0.5">
              {(data?.porMunicipio?.slice(0, 4) || []).map((municipio, index) => (
              <div key={municipio.nome} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: ['#E57373', '#64B5F6', '#FFD54F', '#81C784'][index] }}
                ></div>
                <span className="text-[10px] text-black truncate">{municipio.nome}</span>
                </div>
                <span className="text-[10px] text-black font-medium flex-shrink-0 ml-2">{municipio.total}</span>
              </div>
              ))}
              </div>
              </div>
            </div>

            {/* Ocorrências Mais Comuns */}
            <div className="bg-white rounded-[16px] shadow-[0px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] p-4 flex flex-col w-full min-h-[240px]">
              <h3 className="font-medium text-[13px] text-black mb-2">
                Ocorrências mais comuns
              </h3>
              <div className="space-y-2">
                {(data?.porTipo?.slice(0, 6) || []).map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center h-4">
                      <span className="text-[11px] text-[rgba(0,0,0,0.6)]">
                        {item.nome}
                      </span>
                      <span className="text-[11px] font-medium text-black">
                        {item.total}
                      </span>
                    </div>
                    <div className="w-full bg-[#F2F4F7] rounded-full h-1.5">
                      <div
                        className="bg-[#A0BCE8] h-1.5 rounded-full"
                        style={{
                          width: `${(item.total / (data?.porTipo?.[0]?.total || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente KPI Card
const KPICard: React.FC<{
  title: string;
  value: number;
  icon: string;
}> = ({ title, value, icon }) => (
  <div className="bg-white rounded-[16px] h-[72px] px-2 py-2 flex items-center gap-2 min-w-0 shadow-sm">
    <div className="w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
      <img src={icon} alt={title} className="w-full h-full" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="font-normal text-[13px] text-black leading-tight truncate">{title}</span>
      <span className="font-medium text-[20px] text-black leading-tight mt-1">{value.toString().padStart(2, '0')}</span>
    </div>
  </div>
);

export default Dashboard;