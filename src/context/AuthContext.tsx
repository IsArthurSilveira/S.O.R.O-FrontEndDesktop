import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react'; 
// Importa o tipo AuthContextType e User (assumindo que User inclui o perfil completo)
import type { AuthContextType, User } from '../types'; 

// Importa a função de configuração global da API do arquivo modificado
import { setAuthToken } from '../services/api/core/OpenAPI';

// Chaves de persistência no LocalStorage
const STORAGE_TOKEN_KEY = '@SORO:token';
const STORAGE_USER_KEY = '@SORO:user';

// O AuthContext é criado com valores iniciais que correspondem ao AuthContextType
export const AuthContext = createContext<AuthContextType | undefined>(undefined); //

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); //
  const [token, setToken] = useState<string | null>(null); //
  const [isLoading, setIsLoading] = useState(true); //

  // Função para fazer logout
  const logout = useCallback(() => {
    // 1. Limpa o token no estado local
    setToken(null);
    setUser(null);
    
    // 2. Limpa o token no cache do usuário
    localStorage.removeItem(STORAGE_TOKEN_KEY); //
    localStorage.removeItem(STORAGE_USER_KEY); //
    
    // 3. AÇÃO CRÍTICA: Remove o token da configuração da API para impedir chamadas não autorizadas.
    setAuthToken(null); 
  }, []);

  // Função de Login
  // Recebe o token JWT e os dados do usuário do back-end (após a chamada de AuthController.login)
  const login = useCallback((newToken: string, frontendUser: User) => {
    
    // 1. Salva o token e o usuário no estado
    setToken(newToken); //
    setUser(frontendUser); //

    // 2. Armazena no localStorage para persistência
    localStorage.setItem(STORAGE_TOKEN_KEY, newToken); //
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(frontendUser)); //
    
    // 3. AÇÃO CRÍTICA: Configura o token na instância da API imediatamente para requisições subsequentes.
    setAuthToken(newToken);
    
  }, []); 

  // Função para carregar os dados do usuário ao iniciar a aplicação
  const loadUserFromStorage = useCallback(() => {
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY); //
    const storedUser = localStorage.getItem(STORAGE_USER_KEY); //

    if (storedToken && storedUser) {
      try {
        const userData: User = JSON.parse(storedUser); //
        setToken(storedToken); //
        setUser(userData); //
        
        // AÇÃO CRÍTICA: Configura o token na instância global da API ao inicializar.
        // Isto permite que a API faça chamadas protegidas mesmo antes que o contexto seja totalmente inicializado.
        setAuthToken(storedToken);

      } catch (error) {
        console.error("Erro ao carregar dados do usuário do localStorage:", error); //
        // Limpa o cache inválido e o token na API
        setAuthToken(null); 
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        setToken(null);
        setUser(null);
      }
    } else {
        // Garante que o cliente API não tenha token se não houver no cache.
        setAuthToken(null); 
    }
    setIsLoading(false); //
  }, []); 

  useEffect(() => {
    loadUserFromStorage(); //
  }, [loadUserFromStorage]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!token,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; //
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext); //
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthContextProvider');
  }
  return context;
};