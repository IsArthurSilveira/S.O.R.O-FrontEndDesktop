// src/App.tsx
import { useState } from 'react';
// Removemos a importação de "Router" (ou BrowserRouter), deixando apenas os componentes de rotas
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'; 
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ocorrencias from './pages/Ocorrencias'; //
import EsqueciSenha from './pages/EsqueciSenha';
import VerificacaoCodigo from './pages/VerificacaoCodigo';
import Logout from './pages/Logout';
import PlaceHolderPage from './pages/PlaceHolderPage';

// Apenas useAuth é necessário, pois os Context Providers estão em main.tsx
import { useAuth } from './context/AuthContext'; 

// 1. Componente de Layout Privado (sem <Routes> internas)
const PrivateLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <p className="text-xl font-semibold text-foreground">Carregando S.O.R.O...</p>
            </div>
        );
    }
    
    // Se não estiver autenticado, redireciona para a rota /login
    if (!isAuthenticated) { 
        // Usamos Navigate para redirecionar o usuário
        return <Navigate to="/login" replace />;
    }

    const contentMargin = isSidebarExpanded ? 'sm:ml-64' : 'sm:ml-20';

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar 
                expanded={isSidebarExpanded} 
                setExpanded={setIsSidebarExpanded}
            />
            
            <div className={`flex-1 transition-all duration-300 ${contentMargin}`}>
                <Header />
                <main className="p-6">
                    {/* <Outlet /> renderiza a rota filha correspondente */}
                    <Outlet /> 
                </main>
            </div>
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
            <Route path="nova-ocorrencia" element={<PlaceHolderPage />} />
            <Route path="ocorrencias" element={<Ocorrencias />} />
            <Route path="gerenciamento" element={<PlaceHolderPage />} />
            <Route path="usuarios" element={<PlaceHolderPage />} />
            <Route path="auditoria" element={<PlaceHolderPage />} />
            <Route path="configuracoes" element={<PlaceHolderPage />} />

        </Route>
    </Routes>
  );
};

export default App;