import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client'; 
import { useAuth } from './AuthContext';
import type { SocketContextType } from '../types'; 

// URL da API (deve ser a URL completa, ex: 'https://api-s-o-r-o.onrender.com/api/v3')
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v3';

// Extrai a ORIGEM (protocolo + host) de forma robusta usando a classe URL.
// Extrai a origem da URL para uso no Socket.IO
let SOCKET_URL: string;
try {
  const url = new URL(BASE_URL.replace(/\/+$/, ''));
  SOCKET_URL = url.origin;
} catch (error) {
  SOCKET_URL = BASE_URL;
}


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
      // Desconecta instância anterior antes de criar nova
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      // Conecta ao servidor Socket.IO
      newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        forceNew: true,
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: { token },
      });

      newSocket.on('connect', () => {
        console.log('Conectado ao Socket.IO');
      });

      newSocket.on('connect_error', (err) => {
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

    // Limpeza ao desmontar
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, token, logout]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  // Hook para acessar o contexto do socket
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket deve ser usado dentro de um SocketContextProvider');
  }
  return context;
};
export default SocketContextProvider;