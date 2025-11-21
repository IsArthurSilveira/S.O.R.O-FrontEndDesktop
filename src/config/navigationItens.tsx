import DashboardIcon from '../assets/Icons/Painel.svg';
import OcorrenciasIcon from '../assets/Icons/ocorrências.svg';
import NovaOcorrenciaIcon from '../assets/Icons/novaOcorrencia.svg';
import DadosMestresIcon from '../assets/Icons/dadosMestres.svg';
import UsuariosIcon from '../assets/Icons/usuarios.svg';
import ConfiguracoesIcon from '../assets/Icons/config.svg';
import AuditoriaIcon from '../assets/Icons/Auditoria.svg';
import SairIcon from '../assets/Icons/sair.svg';
import type { MenuItem } from '../types'; // CORREÇÃO APLICADA AQUI

export const navigationItems: MenuItem[] = [
  {
    title: 'Painel',
    href: '/',
    icon: DashboardIcon,
    roles: ['ADMINISTRADOR', 'GERENTE'],
  },
  {
    title: 'Nova Ocorrência',
    href: '/nova-ocorrencia',
    icon: NovaOcorrenciaIcon,
    roles: ['ADMINISTRADOR', 'GERENTE', 'ANALISTA'],
  },
  {
    title: 'Ocorrências',
    href: '/ocorrencias',
    icon: OcorrenciasIcon,
    roles: ['ADMINISTRADOR', 'GERENTE', 'ANALISTA'],
  },
  {
    title: 'Dados Mestres',
    href: '/gerenciamento',
    icon: DadosMestresIcon,
    roles: ['ADMINISTRADOR'],
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: UsuariosIcon,
    roles: ['ADMINISTRADOR'],
  },
  {
    title: 'Auditoria',
    href: '/auditoria',
    icon: AuditoriaIcon,
    roles: ['ADMINISTRADOR'],
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: ConfiguracoesIcon,
    roles: ['ADMINISTRADOR', 'GERENTE', 'ANALISTA'],
  },
];

export const secondaryNavigationItems: MenuItem[] = [
  {
    title: 'Sair',
    href: '/logout',
    icon: SairIcon,
    roles: ['ADMINISTRADOR', 'GERENTE', 'ANALISTA'],
  },
];