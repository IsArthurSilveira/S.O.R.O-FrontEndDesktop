import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '../types';
import { setAuthToken } from '../services/api/core/OpenAPI';

const STORAGE_TOKEN_KEY = '@SORO:token';
const STORAGE_USER_KEY = '@SORO:user';

// Contexto de autenticação
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logout: limpa estado, storage e token da API
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setAuthToken(null);
  }, []);

  // Login: salva estado, storage e token da API
  const login = useCallback((newToken: string, frontendUser: User) => {
    setToken(newToken);
    setUser(frontendUser);
    localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(frontendUser));
    setAuthToken(newToken);
  }, []);

  // Carrega dados do usuário do localStorage ao iniciar
  const loadUserFromStorage = useCallback(() => {
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);

    if (storedToken && storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        setAuthToken(storedToken);
      } catch (error) {
        setAuthToken(null);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        setToken(null);
        setUser(null);
      }
    } else {
      setAuthToken(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Valor do contexto
  const value: AuthContextType = {
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
  // Hook para acessar o contexto de autenticação
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthContextProvider');
  }
  return context;
};