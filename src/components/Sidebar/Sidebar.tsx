import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo-chama.svg';
import { navigationItems, secondaryNavigationItems } from '../../config/navigationItens';
import { useAuth } from '../../context/AuthContext';
import type { MenuItem } from '../../types'; // CORREÇÃO APLICADA AQUI

// Componente auxiliar para renderizar itens de navegação
const NavigationItem: React.FC<{ item: MenuItem; isActive: boolean }> = ({ item, isActive }) => {
  return (
    <NavLink
      to={item.href}
      className={({ isActive: routeIsActive }) =>
        `flex items-center h-12 px-4 rounded-lg transition-colors ${
          routeIsActive || isActive
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'text-sidebar-foreground hover:bg-sidebar-accent'
        }`
      }
    >
      <img
        src={item.icon}
        alt={item.title}
        className={`w-5 h-5 mr-3 ${isActive ? 'brightness-0 invert' : ''}`}
      />
      <span className="text-sm">{item.title}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Função para filtrar itens de navegação com base na função do usuário
  const filterItems = (items: MenuItem[]) => {
    return items.filter(item => 
      !item.roles || 
      item.roles.includes(user?.perfil || 'ANALISTA') // Assume OPERADOR se não houver perfil
    );
  };

  const filteredNavigationItems = filterItems(navigationItems);
  const filteredSecondaryNavigationItems = filterItems(secondaryNavigationItems);

  return (
    <aside className="w-64 flex flex-col bg-sidebar-DEFAULT border-r border-sidebar-border h-full fixed top-0 left-0 z-20 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border p-4">
        <img src={Logo} alt="S.O.R.O. Logo" className="h-10 w-auto" />
      </div>

      <nav className="flex flex-col justify-between flex-grow p-4">
        {/* Itens de Navegação Principais */}
        <div className="space-y-1">
          {filteredNavigationItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>

        {/* Itens de Navegação Secundários (Sair) */}
        <div className="space-y-1 border-t border-sidebar-border pt-4 mt-auto">
          {filteredSecondaryNavigationItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;