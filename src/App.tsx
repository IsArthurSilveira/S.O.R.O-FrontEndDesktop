import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CircularProgress } from '@mui/material'; // 'Box' foi removido aqui

// Importação das Páginas e Componentes de Layout
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlaceHolderPage from './pages/PlaceHolderPage';
import Logout from './pages/Logout';
import EsqueciSenha from './pages/EsqueciSenha';
import VerificacaoCodigo from './pages/VerificacaoCodigo';

import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';

// --- Componentes de Roteamento ---

// Rota Privada: Exige autenticação e aplica o layout com Sidebar e Header
const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <CircularProgress color="primary" />
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col"> {/* Margem para a Sidebar */}
        <Header />
        <main className="flex-1 p-0 overflow-auto">
          {/* O Outlet renderizará o componente da rota aninhada (Ex: Dashboard) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Rota Pública: Não exige autenticação. Se autenticado, redireciona para o Dashboard.
const PublicRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <CircularProgress color="primary" />
      </div>
    );
  }

  // Se autenticado e tentando acessar uma rota pública, redireciona para o Dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // O Outlet renderizará o componente da rota pública aninhada (Ex: Login)
  return <Outlet />;
};


// --- Componente Principal App ---

const App: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/verificacao-codigo" element={<VerificacaoCodigo />} />
      </Route>
      
      {/* Rota de Logout (sem layout) */}
      <Route path="/logout" element={<Logout />} />

      {/* Rotas Privadas (Exigem Autenticação e usam o Layout) */}
      <Route element={<PrivateRoutes />}>
        {/* Rotas aninhadas com o layout */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Exemplo de outras rotas que usarão PlaceHolder por enquanto */}
        <Route path="/ocorrencias" element={<PlaceHolderPage />} />
        <Route path="/nova-ocorrencia" element={<PlaceHolderPage />} />
        <Route path="/gerenciamento" element={<PlaceHolderPage />} />
        <Route path="/usuarios" element={<PlaceHolderPage />} />
        <Route path="/auditoria" element={<PlaceHolderPage />} />
        <Route path="/configuracoes" element={<PlaceHolderPage />} />
      </Route>

      {/* Rota 404 - Redireciona para a raiz ou login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;