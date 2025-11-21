export interface User {
  id: string;
  nome: string;
  email: string;
  username: string;
  isSupervisor: boolean;
  unidadeId: string | null;
  unidadeNome: string | null;
  grupamentoNome: string | null;
  grupamentoId: string | null;
  grupoNome: string | null;
  grupoId: string | null;
  subgrupoNome: string | null;
  subgrupoId: string | null;
  avatarUrl: string | null;
  perfil: 'ADMINISTRADOR' | 'ANALISTA' | 'GERENTE';
}

export interface MenuItem {
  title: string;
  href: string;
  icon: string; // Caminho para o SVG
  roles?: User['perfil'][];
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
  socket: any | null;
}