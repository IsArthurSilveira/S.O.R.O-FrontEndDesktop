import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react'; // Corrigido: Importado apenas como tipo
import type { AuthContextType, User } from '../types'; // Corrigido: Importado apenas como tipo

// O AuthContext é criado com valores iniciais que correspondem ao AuthContextType
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para fazer login
  const login = useCallback((newToken: string, userData: User) => {
    // Salva o token e o usuário no estado
    setToken(newToken);
    setUser(userData);

    // Armazena no localStorage para persistência
    localStorage.setItem('@SORO:token', newToken);
    localStorage.setItem('@SORO:user', JSON.stringify(userData));

  }, []);

  // Função para fazer logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('@SORO:token');
    localStorage.removeItem('@SORO:user');
    // Navegará automaticamente para a tela de login via React Router
  }, []);

  // Função para carregar os dados do usuário ao iniciar a aplicação
  const loadUserFromStorage = useCallback(() => {
    const storedToken = localStorage.getItem('@SORO:token');
    const storedUser = localStorage.getItem('@SORO:user');

    if (storedToken && storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário do localStorage:", error);
        logout(); // Limpar dados inválidos
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const value = {
    user,
    isAuthenticated: !!token,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthContextProvider');
  }
  return context;
};