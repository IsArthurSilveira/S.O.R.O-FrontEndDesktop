// src/components/Sidebar/Sidebar.tsx
import { createContext } from 'react'; // REMOVIDO: useContext
import { NavLink, useLocation } from 'react-router-dom';
import type { MenuItem, PerfilSistema } from '../../types'; // Importa o tipo unificado
import { navigationItems } from '../../config/navigationItens';
import { useAuth } from '../../context/AuthContext';
import ProfileIcon from "../../assets/Profile.svg"; // Ícone de perfil
import FullLogo from "../../assets/logo.svg"; // Logo completo
import Icone from "../../assets/Icone.svg"; // Ícone para versão colapsada


// --- Contexto para a Sidebar (Mantido da V2) ---
type SidebarContextType = {
  expanded: boolean;
};
const SidebarContext = createContext<SidebarContextType>({ expanded: false });


// --- Propriedades da Sidebar (Simplificadas para Desktop) ---
interface SidebarProps {
  // Props Desktop
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
}

// --- Componente Principal da Sidebar ---
// O Desktop não usa mobileOpen, então removemos a lógica de props mobile
export default function Sidebar({ expanded = false, setExpanded = () => {} }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Combina a lista principal e secundária de navegação
  const allItems = navigationItems;

  // Função para filtrar itens de navegação com base no perfil do usuário
  const filterItems = (items: MenuItem[]) => {
    // A propriedade `perfil` do user é do tipo PerfilSistema
    const userProfile = user?.perfil || ('ANALISTA' as PerfilSistema); 
    
    return items.filter(item => 
      !item.roles || 
      (item.roles as PerfilSistema[]).includes(userProfile)
    );
  };
  
  const visibleItems = filterItems(allItems);
  const currentProfileLabel = user?.perfil || 'ANALISTA';

  return (
    <aside className={`h-full fixed top-0 left-0 z-20 bg-white border-r border-[rgba(6,28,67,0.24)] flex flex-col transition-all duration-300 ease-in-out sm:w-20 ${expanded ? 'sm:w-64' : ''}`}
        
        // 4. Eventos de hover para controlar a expansão no modo desktop
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
    >
      
      {/* Profile Section (Adaptado do V2) */}
      <div className={`border-b border-sidebar-border flex items-center p-3 ${!expanded ? 'justify-center py-6' : 'px-4 gap-3 mt-6'}`}>
          <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-black shrink-0`}>
            {/* Ícone de perfil padrão */}
            <img src={ProfileIcon} alt="Perfil" className="w-6 h-6" />
          </div>

        {expanded && (
            <div className="flex flex-col justify-center">
              <div className="text-foreground font-poppins text-sm font-semibold leading-5 truncate">
                {user?.nome_guerra || 'Usuário S.O.R.O'}
              </div>
              <div className="text-muted-foreground font-poppins text-[10px] font-normal leading-5">
                {currentProfileLabel}
              </div>
            </div>
          )}
      </div>

    {/* Navigation */}
    <SidebarContext.Provider value={{ expanded: expanded }}>
      <nav role="navigation" aria-label="Principal" className="flex-1 flex flex-col gap-1 px-3 mt-4">
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname === '/' && item.href === '/');
              
              // O ícone no desktop é um SVG importado (string), renderizamos diretamente na SidebarItem
              const iconUrl = item.icon as string; 

              return (
                <SidebarItem 
                  key={item.href} 
                  to={item.href} 
                  iconUrl={iconUrl} // Passamos a URL do SVG
                  text={item.title} 
                  active={isActive} 
                  expanded={expanded}
                />
              );
            })}
          </nav>
        </SidebarContext.Provider>

        {/* Logo Bottom: Mostra logo ou ícone baseado em 'expanded' (Estilo V2) */}
        <div className="mt-auto mb-8 flex items-center justify-center p-3">
          {expanded ? (
            <img src={FullLogo} alt="S.O.R.O Logo" className="h-8 object-contain" />
          ) : (
            <img src={Icone} alt="S.O.R.O Icone" className="h-8 w-8 object-contain" /> 
          )}
        </div>
      </aside>
  );
}


// --- Componente Auxiliar SidebarItem (Novo - Estilo V2) ---
interface SidebarItemProps {
  iconUrl: string; // URL do SVG
  text: string;
  active?: boolean;
  to?: string;
  expanded: boolean;
}

function SidebarItem({ iconUrl, text, active, to, expanded }: SidebarItemProps) {
  // As classes de cor usam o Tailwind config definido no Desktop
  const activeClasses = `bg-[rgba(0,96,255,0.20)]`; // Baseado no primary:DEFAULT do Tailwind Desktop
  const hoverClasses = `hover:bg-[rgba(0,96,255,0.10)]`; 
  
  // Classes para icon e texto (sempre visíveis no modo expandido)
  const textClasses = `text-sm font-normal leading-5 overflow-hidden transition-all w-full text-foreground`;
  
  // Classes para o ícone (invertidas em caso de ativo/hover se o ícone for preto)
  const iconBaseClasses = `w-6 h-6 flex items-center justify-center shrink-0`;
  const iconActiveClasses = ``; // Mantemos o ícone sem alteração de cor, pois os SVGs já têm cores.

  return (
    <li className='w-full'>
      <NavLink 
        to={to || '#'} 
        className={
          `relative flex items-center py-3 font-medium rounded-2xl cursor-pointer transition-colors group 
          ${expanded ? 'px-3 gap-3 w-full' : 'justify-center w-full'} 
          ${active ? activeClasses : hoverClasses}
        `}
      >
        {/* Ícone */}
        <div className={`${iconBaseClasses} ${active ? iconActiveClasses : ''}`}>
            {/* Renderiza o SVG importado */}
            <img src={iconUrl} alt={text} className='w-6 h-6' />
        </div>
        
        {/* Texto (Apenas no modo expandido) */}
        {expanded && (
          <span className={textClasses}>
            {text}
          </span>
        )}

        {/* Tooltip (Apenas no modo colapsado) */}
        {!expanded && (
          <div className={`absolute left-full rounded-md px-2 py-1 ml-4 bg-card shadow-md text-sm text-foreground invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-30 whitespace-nowrap`}>
            {text}
          </div>
        )}
      </NavLink>
    </li>
  );
}