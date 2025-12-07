import React from 'react';
// import { useAuth } from '../../context/AuthContext'; // Removido, pois o usuário não será mais exibido.
// import { Avatar, IconButton, Menu, MenuItem } from '@mui/material'; // Componentes removidos
// import { User as LucideUser, LogOut } from 'lucide-react'; // Ícones removidos
// import ProfilePlaceholder from '../../assets/Profile.svg'; // Imagem removida
import { useLocation } from 'react-router-dom'; // Mantido para o título dinâmico
import { navigationItems } from '../../config/navigationItens'; // Mantido para o título dinâmico

// Função auxiliar para obter o título da página baseado na rota
const getCurrentPageTitle = (pathname: string): string => {
  // Padroniza a rota raiz para corresponder ao item de navegação '/'
  const normalizedPath = pathname === '/dashboard' ? '/' : pathname;

  // Busca o item de navegação que corresponde à rota atual
  const item = navigationItems.find(navItem => 
    navItem.href === normalizedPath
  );
  
  // Retorna o título da rota ou um título padrão
  return item ? item.title : 'S.O.R.O. Desktop'; 
};
const Header: React.FC = () => {
  const location = useLocation(); 
  const pageTitle = getCurrentPageTitle(location.pathname);
  return (
    <header className="flex items-center justify-start h-16 px-6 bg-white border-b border-[rgba(6,28,67,0.24)] sticky top-4 z-10">
      
      {/* Título dinâmico da página */}
      <h1 className="text-xl font-medium text-[rgba(0,0,0,0.6)] -mt-3">
        {pageTitle}
      </h1>

      {/* A seção de Perfil do Usuário foi removida, conforme solicitado. */}
      
    </header>
  );
};

export default Header;