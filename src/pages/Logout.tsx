import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Chama a função de logout do contexto imediatamente
    logout();
  }, [logout]);

  // Redireciona para a página de login após o logout
  return <Navigate to="/login" replace />;
};

export default Logout;