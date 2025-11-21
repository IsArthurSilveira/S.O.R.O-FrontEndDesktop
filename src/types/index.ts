import type { Socket } from 'socket.io-client';

// Tipos unificados do Backend S.O.R.O.
export type PerfilSistema = 'ADMIN' | 'ANALISTA' | 'CHEFE';

export interface User {
  // Campos obrigatórios do Backend
  id: string;
  nome: string;
  email: string;
  matricula: string; 
  perfil: PerfilSistema; // RENOMEADO: Usaremos 'perfil' com os tipos do Backend

  // Campos opcionais/null do Backend
  nome_guerra: string | null;
  posto_grad: string | null;
  id_unidade_operacional_fk: string | null;
  
  // Campos de compatibilidade do FrontEnd V2 (Simplificados/Removidos)
  // Removido: isSupervisor, perfil (antigo)
  unidadeId?: string | null; // Mapeado de id_unidade_operacional_fk
  unidadeNome?: string | null; 
  grupamentoNome?: string | null;
  grupamentoId?: string | null;
  grupoNome?: string | null;
  grupoId?: string | null;
  subgrupoNome?: string | null;
  subgrupoId?: string | null;
  avatarUrl?: string | null;
}

export interface MenuItem {
  title: string;
  href: string;
  icon: string; // Caminho para o SVG
  roles?: PerfilSistema[]; // Usa o tipo de perfil unificado
}

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
};

export interface DashboardStats {
  totalOcorrencias: number;
  ocorrenciasPendentes: number;
  ocorrenciasEmAndamento: number;
  ocorrenciasConcluidas: number;
  ocorrenciasCanceladas: number;
  ocorrenciasPorNatureza: { name: string, count: number }[];
  ocorrenciasPorStatus: { status: string, count: number }[];
  ocorrenciasUltimosDias: { date: string, count: number }[];
  feedAtividades: { id: string, acao: string, timestamp: string }[];
}

export interface SocketContextType {
  socket: Socket | null;
}