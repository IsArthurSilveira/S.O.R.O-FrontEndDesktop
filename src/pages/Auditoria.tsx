import React, { useEffect, useState } from 'react';
import { fetchAuditLogs, type AuditLog } from '../services/api/services/AuditService';
import { CircularProgress } from '@mui/material';

// Ícones (usando lucide-react ou heroicons seria ideal, mas vou usar SVGs inline ou unicode para simplicidade máxima)
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
);

const Auditoria: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Função para estilizar o tipo de ação (Badge)
  const getActionStyle = (action: string) => {
    if (action.includes('DELETE') || action.includes('FAIL')) return 'bg-destructive text-white';
    if (action.includes('CREATE') || action.includes('LOGIN')) return 'bg-green-100 text-green-800 border-green-200';
    if (action.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-secondary text-secondary-foreground';
  };

  // Formata data amigável
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6 font-poppins min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1C3E]">Auditoria e Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitore todas as ações realizadas no sistema em tempo real.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
        >
          <RefreshIcon />
          Atualizar Lista
        </button>
      </div>

      {/* Card da Tabela */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12 h-64">
            <CircularProgress size={40} className="text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F0F5FA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[#1E3A8A]">Data e Hora</th>
                  <th className="px-6 py-4 font-semibold text-[#1E3A8A]">Usuário</th>
                  <th className="px-6 py-4 font-semibold text-[#1E3A8A]">Ação</th>
                  <th className="px-6 py-4 font-semibold text-[#1E3A8A]">Detalhes</th>
                  <th className="px-6 py-4 font-semibold text-[#1E3A8A]">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F0F5FA]/50 transition-colors">
                    
                    {/* Data */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                      {formatDate(log.timestamp)}
                    </td>

                    {/* Usuário */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0A1C3E]">{log.user.nome}</span>
                        <span className="text-xs text-gray-500">{log.user.matricula} • {log.user.tipo_perfil}</span>
                      </div>
                    </td>

                    {/* Badge de Ação */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Detalhes */}
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>

                    {/* IP */}
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Footer da Tabela */}
        {!loading && (
            <div className="bg-gray-50 px-6 py-3 border-t border-[#E0E0E0] text-xs text-gray-500 flex justify-between items-center">
                <span>Exibindo {logs.length} registros recentes</span>
                <span className="italic">Dados gerados via Mock (Modo Seguro)</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default Auditoria;