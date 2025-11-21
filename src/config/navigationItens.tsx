import DashboardIcon from '../assets/Icons/Painel.svg';
import OcorrenciasIcon from '../assets/Icons/ocorrências.svg';
import NovaOcorrenciaIcon from '../assets/Icons/novaOcorrencia.svg';
import DadosMestresIcon from '../assets/Icons/dadosMestres.svg';
import UsuariosIcon from '../assets/Icons/usuarios.svg';
import ConfiguracoesIcon from '../assets/Icons/config.svg';
import AuditoriaIcon from '../assets/Icons/Auditoria.svg';
import SairIcon from '../assets/Icons/sair.svg';
import type { MenuItem } from '../types';
import type { PerfilSistema } from '../types'; // Importa o tipo unificado

export const navigationItems: MenuItem[] = [
  {
    title: 'Painel',
    href: '/',
    icon: DashboardIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[], // ADMIN, ANALISTA (OP), CHEFE (SUP)
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
    roles: ['ADMIN'], // Apenas ADMIN
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: UsuariosIcon,
    roles: ['ADMIN', 'CHEFE'] as PerfilSistema[], // ADMIN e CHEFE (ex-SUPERVISOR)
  },
  {
    title: 'Auditoria',
    href: '/auditoria',
    icon: AuditoriaIcon,
    roles: ['ADMIN'],
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: ConfiguracoesIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[],
  },
];

export const secondaryNavigationItems: MenuItem[] = [
  {
    title: 'Sair',
    href: '/logout',
    icon: SairIcon,
    roles: ['ADMIN', 'ANALISTA', 'CHEFE'] as PerfilSistema[],
  },
];