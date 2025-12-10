import React from 'react';
import { useLocation } from 'react-router-dom';
import { navigationItems } from '../../config/navigationItens';

// Função auxiliar para obter o título da página baseado na rota
const getCurrentPageTitle = (pathname: string): string => {
  const normalizedPath = pathname === '/dashboard' ? '/' : pathname;
  const item = navigationItems.find(navItem => navItem.href === normalizedPath);
  return item ? item.title : 'S.O.R.O. Desktop'; 
};

interface HeaderProps {
  onToggleRightBar?: () => void;
  showRightBarToggle?: boolean;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleRightBar, showRightBarToggle = false, onToggleSidebar }) => {
  const location = useLocation(); 
  const pageTitle = getCurrentPageTitle(location.pathname);
  
  return (
    <header className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-5 md:px-7 bg-white dark:bg-[#1a1a1a] border-b border-[rgba(6,28,67,0.24)] dark:border-[rgba(255,255,255,0.1)] sticky top-0 z-10">
      {/* Botão de menu hamburguer para mobile */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors flex-shrink-0 mr-2 lg:hidden"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      
      {/* Título dinâmico da página */}
      <div className="flex items-center flex-1 min-w-0">
        <h1 className="text-sm sm:text-base font-medium text-[rgba(0,0,0,0.4)] dark:text-[rgba(255,255,255,0.6)] font-poppins truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Botão para toggle do RightBar (visível apenas no Dashboard) */}
      {showRightBarToggle && (
        <button
          onClick={onToggleRightBar}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors flex-shrink-0 ml-2"
          aria-label="Toggle painel de atividades"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
    </header>
  );
};

export default Header;