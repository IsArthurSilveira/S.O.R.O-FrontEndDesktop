import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // 1. Quando o componente é carregado (após a navegação de Header.tsx),
    // ele chama a função que limpa o token do estado e do localStorage.
    logout();
  }, [logout]);

  // 2. Imediatamente após a limpeza, o componente retorna o redirecionamento.
  // A prop `replace` garante que o histórico de navegação não seja poluído.
  return <Navigate to="/login" replace />;
};

export default Logout;