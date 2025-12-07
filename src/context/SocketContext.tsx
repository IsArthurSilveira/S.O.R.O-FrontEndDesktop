import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client'; 
import { useAuth } from './AuthContext';
import type { SocketContextType } from '../types'; 

// URL da API (deve ser a URL completa, ex: 'https://api-s-o-r-o.onrender.com/api/v3')
// Adicionado um path completo ao fallback de localhost para refletir a nova estrutura da API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v3';

// CORREÇÃO CRÍTICA: Extrai a ORIGEM (protocolo + host) de forma robusta usando a classe URL.
// Isso evita erros de parsing como "ws://https/".
let SOCKET_URL: string;
try {
    // 1. Cria um objeto URL a partir da BASE_URL (remove barras finais desnecessárias antes de parsear)
    const url = new URL(BASE_URL.replace(/\/+$/, '')); 
    // 2. A propriedade 'origin' retorna o protocolo, hostname e porta (ex: https://dominio.com)
    SOCKET_URL = url.origin; 
    
    // DEBUG: Se você quiser garantir que a URL correta está sendo usada, pode descomentar:
    // console.log("SOCKET_URL extraída:", SOCKET_URL);

} catch (error) {
    // Fallback de segurança em caso de URL de API completamente inválida
    console.error("Erro fatal ao parsear BASE_URL para Socket.IO. Usando BASE_URL original.", error);
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
      
      // DESCONECTA QUALQUER INSTÂNCIA EXISTENTE ANTES DE CRIAR UMA NOVA
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      // Conecta ao servidor Socket.IO, usando a URL de ORIGEM
      newSocket = io(SOCKET_URL, {
        transports: ['websocket'], // Força o uso de WebSocket
        forceNew: true, // Garante que uma nova instância seja criada, ignorando pools
        autoConnect: true,
        // Configurações de Reconexão para limitar o flood:
        reconnectionAttempts: 5, // Tenta reconectar no máximo 5 vezes
        reconnectionDelay: 1000, // Espera 1s antes de tentar de novo
        
        auth: {
          token: token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Conectado ao Socket.IO com sucesso!');
      });

      newSocket.on('connect_error', (err) => {
        console.error('Erro de Conexão do Socket:', err.message);
        // Lógica para forçar logout se o token for inválido
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
  }, [isAuthenticated, token, logout]); // Removido 'socket' da lista de dependências para evitar loop

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
export default SocketContextProvider;