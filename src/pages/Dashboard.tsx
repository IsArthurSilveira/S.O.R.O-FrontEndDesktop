import React, { useEffect, useState } from 'react';
import { getClient } from '../services/apiService';
import { CircularProgress, Alert } from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';

interface DashboardData {
  status: Record<string, number>;
  total: number;
  porPeriodo: Array<{ periodo: string; total: number }>;
  porTipo: Array<{ nome: string; total: number }>;
  porMunicipio: Array<{ nome: string; total: number }>;
}

const COLORS = ['#0060FF', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = getClient();
        
        // Chamadas paralelas para performance
        const [statusRaw, periodoRaw, tipoRaw, municipioRaw] = await Promise.all([
            client.dashboard.getApiV2DashboardOcorrenciasPorStatus(),
            client.dashboard.getApiV2DashboardOcorrenciasPorPeriodo('month'),
            client.dashboard.getApiV2DashboardOcorrenciasPorTipo(),
            client.dashboard.getApiV2DashboardOcorrenciasPorMunicipio()
        ]);

        const statusData = statusRaw as Record<string, number>;
        const total = Object.values(statusData).reduce((acc: number, curr: number) => acc + curr, 0);

        setData({
          status: statusData,
          total: total,
          porPeriodo: periodoRaw as any[],
          porTipo: tipoRaw as any[],
          porMunicipio: municipioRaw as any[]
        });

      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError('Falha ao carregar dados. Verifique se o backend está rodando e acessível.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center"><CircularProgress /></div>;
  if (error) return <div className="p-6"><Alert severity="error">{error}</Alert></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Painel de Controle</h1>
      </div>
      
      {/* 1. CARDS DE KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Geral" value={data?.total || 0} color="text-primary" />
        <DashboardCard title="Pendentes" value={data?.status['PENDENTE'] || 0} color="text-yellow-600" />
        <DashboardCard title="Em Andamento" value={data?.status['EM_ANDAMENTO'] || 0} color="text-blue-600" />
        <DashboardCard title="Concluídas" value={data?.status['CONCLUIDO'] || 0} color="text-green-600" />
      </div>

      {/* 2. GRÁFICOS - LINHA 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        
        {/* Linha do Tempo (Ocupa 2 espaços) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Evolução Mensal</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.porPeriodo}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="periodo" 
                            tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
                            tick={{fontSize: 12}} 
                        />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip labelFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}/>
                        <Line type="monotone" dataKey="total" stroke="#0060FF" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Pizza Municípios */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Por Município</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data?.porMunicipio}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="total"
                        >
                            {data?.porMunicipio.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* 3. GRÁFICO - LINHA 2: Barras (Tipos) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-border h-[350px] flex flex-col">
         <h3 className="text-lg font-semibold text-foreground mb-4">Top 10 Tipos de Ocorrência</h3>
         <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.porTipo} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="nome" type="category" width={150} tick={{fontSize: 12}} interval={0} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="total" fill="#0060FF" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

    </div>
  );
};

const DashboardCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col items-start hover:scale-105 transition-transform duration-200">
        <h3 className={`font-medium text-sm text-muted-foreground uppercase tracking-wider`}>{title}</h3>
        <p className={`text-4xl mt-2 font-bold ${color}`}>{value}</p>
    </div>
);

export default Dashboard;