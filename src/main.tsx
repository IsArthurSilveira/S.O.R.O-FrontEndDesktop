import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { SocketContextProvider } from './context/SocketContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Provedores de Contexto Globais */}
      <ThemeProvider>
        <AuthContextProvider>
          {/* O SocketContext depende do AuthContext, por isso deve estar dentro dele */}
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);