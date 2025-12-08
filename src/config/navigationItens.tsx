import DashboardIcon from '../assets/SideBar/PainelControle-Menu-Icon.svg';
import OcorrenciasIcon from '../assets/SideBar/Ocorrencia-Menu-Icon.svg';
import NovaOcorrenciaIcon from '../assets/SideBar/NovaOcorrencia-Menu-Icon.svg';
import DadosMestresIcon from '../assets/SideBar/DadosMestres-Menu-Icon.svg';
import UsuariosIcon from '../assets/SideBar/Usuarios-Menu-Icon.svg';
import ConfiguracoesIcon from '../assets/SideBar/Configuracoes-Menu-Icon.svg';
import AuditoriaIcon from '../assets/SideBar/Auditoria-Menu-Icon.svg';
import SairIcon from '../assets/SideBar/Sair-Menu-Icon.svg';
import type { MenuItem } from '../types';
import type { PerfilSistema } from '../types'; // Importa o tipo unificado

// Combina a lista principal e secundária em uma única lista
export const navigationItems: MenuItem[] = [
  {
    title: 'Painel de Controle',
    href: '/', // Mantido o caminho raiz para o dashboard
    icon: DashboardIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[],
  },
  {
    title: 'Nova Ocorrência',
    href: '/nova-ocorrencia',
    icon: NovaOcorrenciaIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[],
  },
  {
    title: 'Ocorrências',
    href: '/ocorrencias',
    icon: OcorrenciasIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[],
  },
  {
    title: 'Dados Mestres',
    href: '/gerenciamento',
    icon: DadosMestresIcon,
    roles: ['ADMIN'] as PerfilSistema[], 
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: UsuariosIcon,
    roles: ['ADMIN', 'CHEFE'] as PerfilSistema[], 
  },
  {
    title: 'Auditoria',
    href: '/auditoria',
    icon: AuditoriaIcon,
    roles: ['ADMIN'] as PerfilSistema[],
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: ConfiguracoesIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[],
  },
  // Item de navegação secundária movido para a lista principal
  {
    title: 'Sair',
    href: '/logout',
    icon: SairIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[],
  },
];

// Removemos a lista secundária, pois ela foi incorporada acima
export const secondaryNavigationItems: MenuItem[] = [];