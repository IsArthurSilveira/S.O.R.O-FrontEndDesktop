import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; // Corrigido: ReactNode como tipo
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client'; // Corrigido: Socket como tipo
import { useAuth } from './AuthContext';
import type { SocketContextType } from '../types'; // Corrigido: SocketContextType como tipo

// URL da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// A URL base do servidor é a URL da API sem o '/api'
const SOCKET_URL = API_URL.replace('/api', '');

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { isAuthenticated, token, logout } = useAuth();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket | null = null;
    
    if (isAuthenticated && token) {
      // Conecta ao servidor Socket.IO
      newSocket = io(SOCKET_URL, {
        autoConnect: true,
        auth: {
          token: token,
        },
        transports: ['websocket'], // Forçar uso de websocket para desktop
      });

      newSocket.on('connect', () => {
        console.log('Conectado ao Socket.IO com sucesso!');
      });

      newSocket.on('connect_error', (err) => {
        console.error('Erro de Conexão do Socket:', err.message);
        // Possível lógica para forçar logout se o token for inválido
        if (err.message === 'Token Inválido') {
            logout();
        }
      });
      
      setSocket(newSocket);
    } else {
      // Desconecta se o usuário sair ou o token for removido
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }

    // Função de limpeza
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, token, logout, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket deve ser usado dentro de um SocketContextProvider');
  }
  return context;
};