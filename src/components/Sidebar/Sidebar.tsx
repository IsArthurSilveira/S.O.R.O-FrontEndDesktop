// src/components/Sidebar/Sidebar.tsx
import { createContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { MenuItem, PerfilSistema } from '../../types';
import { navigationItems } from '../../config/navigationItens';
import { useAuth } from '../../context/AuthContext';
import ProfileIcon from "../../assets/SideBar/Perfil-Menu-Icon.svg";
import Logo from "../../assets/S.O.R.O/Icone-Marca-Pequeno.svg";


// --- Contexto para a Sidebar ---
type SidebarContextType = {
  expanded: boolean;
};
const SidebarContext = createContext<SidebarContextType>({ expanded: false });


// --- Propriedades da Sidebar ---
interface SidebarProps {
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
}

// --- Componente Principal da Sidebar ---
export default function Sidebar({ expanded = false, setExpanded = () => {} }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const allItems = navigationItems;

  // Função para filtrar itens de navegação com base no perfil do usuário
  const filterItems = (items: MenuItem[]) => {
    const userProfile = user?.perfil || ('ANALISTA' as PerfilSistema); 
    
    return items.filter(item => 
      !item.roles || 
      (item.roles as PerfilSistema[]).includes(userProfile)
    );
  };
  
  const visibleItems = filterItems(allItems);

  return (
    <aside 
      className={`h-screen fixed top-0 left-0 z-20 bg-white dark:bg-[#1a1a1a] border-r border-[rgba(6,28,67,0.24)] dark:border-[rgba(255,255,255,0.1)] flex flex-col transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      
      {/* Profile Section */}
      <div className={`flex items-center gap-2 h-16 border-b border-[rgba(6,28,67,0.24)] dark:border-[rgba(255,255,255,0.1)] ${!expanded ? 'justify-center px-2' : 'px-3'}`}>
        <div className="w-[42px] h-[42px] flex items-center justify-center shrink-0">
          <img src={ProfileIcon} alt="Perfil" className="w-[42px] h-[42px] rounded-full" />
        </div>
        {expanded && (
          <div className="flex flex-col justify-center min-h-full">
            <div className="text-foreground dark:text-white font-poppins text-sm font-medium leading-5 truncate">
              {user?.nome_guerra || user?.nome || 'Maria Silva'}
            </div>
            <div className="text-muted-foreground dark:text-gray-400 font-poppins text-[10px] font-normal leading-5">
              {user?.perfil === 'ADMIN' ? 'Administrador' : user?.perfil === 'CHEFE' ? 'Chefe' : 'Analista'}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <SidebarContext.Provider value={{ expanded }}>
        <nav role="navigation" aria-label="Principal" className="flex-1 flex flex-col gap-3 mt-5 px-3"> 
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.href || (location.pathname === '/' && item.href === '/');
            const iconUrl = item.icon as string; 

            return (
              <SidebarItem 
                key={item.href} 
                to={item.href} 
                iconUrl={iconUrl}
                text={item.title}
                active={isActive} 
                expanded={expanded}
              />
            );
          })}
        </nav>
      </SidebarContext.Provider>

      {/* Logo Bottom */}
      <div className="mt-auto mb-3 flex items-center justify-center p-3">
        {expanded ? (
          <div className="flex flex-col items-center">
            <img src={Logo} alt="S.O.R.O" className="h-8 w-6 object-contain" />
            <p className="font-poppins font-semibold text-[20px] text-[#061c43] dark:text-white text-center mt-1">
              S.O.R.O
            </p>
          </div>
        ) : (
          <img src={Logo} alt="S.O.R.O" className="h-8 w-8 object-contain" />
        )}
      </div>
    </aside>
  );
}


// --- Componente Auxiliar SidebarItem ---
interface SidebarItemProps {
  iconUrl: string;
  text: string;
  active?: boolean;
  to?: string;
  expanded: boolean;
}

function SidebarItem({ iconUrl, text, active, to, expanded }: SidebarItemProps) {
  const activeClasses = `bg-[rgba(0,60,255,0.20)] dark:bg-[rgba(76,175,80,0.20)]`;
  const hoverClasses = `hover:bg-[rgba(0,60,255,0.10)] dark:hover:bg-[rgba(76,175,80,0.10)]`;
  
  return (
    <li className='w-full list-none'>
      <NavLink 
        to={to || '#'} 
        className={`relative flex items-center py-3 font-medium rounded-2xl cursor-pointer transition-colors group ${expanded ? 'px-3 gap-3' : 'justify-center'} ${active ? activeClasses : hoverClasses}`}
      >
        {/* Ícone */}
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <img src={iconUrl} alt={text} className='w-6 h-6' />
        </div>
        
        {/* Texto - Apenas quando expandido */}
        {expanded && (
          <span className="text-sm font-normal leading-5 overflow-hidden transition-all w-full text-foreground dark:text-white font-poppins">
            {text}
          </span>
        )}

        {/* Tooltip - Apenas quando colapsado */}
        {!expanded && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-4 bg-card dark:bg-[#2a2a2a] shadow-md text-base text-foreground dark:text-white invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-30 whitespace-nowrap">
            {text}
          </div>
        )}
      </NavLink>
    </li>
  );
}