// src/services/AuditService.ts

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  user: {
    nome: string;
    matricula: string;
    tipo_perfil: string;
    avatarUrl?: string; 
  };
}

const MOCK_DATA: AuditLog[] = [
  {
    id: '1',
    action: 'LOGIN',
    details: 'Login realizado com sucesso via Desktop.',
    ipAddress: '192.168.0.105',
    timestamp: new Date().toISOString(),
    user: { nome: 'Sd. Arthur Silveira', matricula: '900.123-4', tipo_perfil: 'ADMIN' }
  },
  {
    id: '2',
    action: 'CREATE_OCORRENCIA',
    details: 'Criou a ocorrência #2025-001 (Incêndio em Vegetação).',
    ipAddress: '172.16.10.20',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
    user: { nome: 'Cb. Mariana Lima', matricula: '920.555-1', tipo_perfil: 'OPERADOR' }
  },
  {
    id: '3',
    action: 'UPDATE_VIATURA',
    details: 'Alterou status da viatura ABT-15 para "EM MANUTENÇÃO".',
    ipAddress: '10.0.0.5',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h atrás
    user: { nome: 'Sgt. Pereira', matricula: '880.111-9', tipo_perfil: 'CHEFE' }
  },
  {
    id: '4',
    action: 'DELETE_USER',
    details: 'Removeu o usuário "Sd. Teste" do sistema.',
    ipAddress: '192.168.0.105',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
    user: { nome: 'Sd. Arthur Silveira', matricula: '900.123-4', tipo_perfil: 'ADMIN' }
  },
  {
    id: '5',
    action: 'EXPORT_REPORT',
    details: 'Exportou relatório mensal de ocorrências (PDF).',
    ipAddress: '172.16.10.22',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    user: { nome: 'Maj. Carvalho', matricula: '123.456-7', tipo_perfil: 'ANALISTA' }
  },
   {
    id: '6',
    action: 'LOGIN_FAIL',
    details: 'Tentativa de login falhou (Senha Incorreta).',
    ipAddress: '45.233.12.1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    user: { nome: 'Desconhecido', matricula: '---', tipo_perfil: 'N/A' }
  },
];

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  // Simulamos um delay de rede de 600ms para dar sensação de "carregando"
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 600);
  });
};