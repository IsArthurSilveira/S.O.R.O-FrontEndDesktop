// src/App.tsx
import { useState } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'; 
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import RightBar from './components/RightBar/RightBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ocorrencias from './pages/Ocorrencias';
import EsqueciSenha from './pages/EsqueciSenha';
import VerificacaoCodigo from './pages/VerificacaoCodigo';
import Logout from './pages/Logout';
import Usuarios from './pages/Usuarios';
import Auditoria from './pages/Auditoria';
import Configuracoes from './pages/Configuracoes';
import Gerenciamento from './pages/Gerenciamento';
import { useAuth } from './context/AuthContext'; 

// Componente de Layout Privado
const PrivateLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isRightBarVisible, setIsRightBarVisible] = useState(true);
    const location = useLocation();
    
    // Verifica se estamos na rota do Dashboard
    const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
    
    // RightBar expande quando sidebar colapsa e vice-versa
    const isRightBarExpanded = !isSidebarExpanded;

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background dark:bg-[#0a0a0a]">
                <p className="text-xl font-semibold text-foreground dark:text-white">Carregando S.O.R.O...</p>
            </div>
        );
    }
    
    if (!isAuthenticated) { 
        return <Navigate to="/login" replace />;
    }

    const handleToggleRightBar = () => {
        setIsRightBarVisible(!isRightBarVisible);
    };

    const contentMargin = isSidebarExpanded ? 'ml-64' : 'ml-20';

    return (
        <div className="flex min-h-screen bg-background dark:bg-[#0a0a0a] text-foreground dark:text-white">
            <Sidebar 
                expanded={isSidebarExpanded}
                setExpanded={setIsSidebarExpanded}
            />
            
            <div className={`flex-1 transition-all duration-300 ${contentMargin}`}>
                <Header 
                    onToggleRightBar={handleToggleRightBar}
                    showRightBarToggle={isDashboard}
                />
                <main className={`p-6 transition-all duration-300 ${isDashboard && isRightBarVisible && isRightBarExpanded ? 'mr-64' : ''}`}>
                    <Outlet /> 
                </main>
            </div>

            {/* RightBar - Visível apenas no Dashboard */}
            {isDashboard && (
                <RightBar 
                    isVisible={isRightBarVisible}
                    isSidebarExpanded={isSidebarExpanded}
                    onClose={handleToggleRightBar}
                />
            )}
        </div>
    );
};

// Componente principal: AGORA RENDERIZA APENAS O BLOCO <Routes>
const App: React.FC = () => {
  return (
    // REMOVIDO: <Router> e os Providers de Contexto
    <Routes>
        
        {/* ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/verificacao-codigo" element={<VerificacaoCodigo />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* ROTAS PRIVADAS (Aninhamento) */}
        {/* path="/" define o layout base para todas as rotas filhas */}
        <Route path="/" element={<PrivateLayout />}>
        {/* Rota principal (índice) do layout privado: / */}
        <Route index element={<Dashboard />} /> 
        <Route path="dashboard" element={<Dashboard />} />
            
            {/* Rotas de Exemplo (Caminhos relativos) */}
            <Route path="ocorrencias" element={<Ocorrencias />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="auditoria" element={<Auditoria />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="gerenciamento" element={<Gerenciamento />} />

        </Route>
    </Routes>
  );
};

export default App;