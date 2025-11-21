import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Box, CircularProgress, Link } from '@mui/material';
import Logo from '../assets/logo.svg';
import { getClient } from '../services/apiService';
import type { AuthLogin } from '../services/api/models/AuthLogin'; 
import type { AuthToken } from '../services/api/models/AuthToken'; 
// Importa o tipo User do gerador (que tem 'tipo_perfil')
import type { User as BackendUserRaw } from '../services/api/models/User'; 
// Importa o tipo User final do frontend (que tem 'perfil')
import type { User, PerfilSistema } from '../types'; 


const Login: React.FC = () => {
  // REVERTIDO: Usar 'email' em vez de 'matricula'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const api = getClient();
      
      // O tipo AuthLogin gerado pode esperar 'matricula'. 
      // Usaremos o cast para 'any' ou ajustamos o tipo para 'email' temporariamente.
      // Assumindo que a API aceita 'email' e 'password':
      const credentials: AuthLogin = { 
        email: email, // NOVO: Campo de login é 'email'
        password: password,
      } as unknown as AuthLogin; // Cast forçar o tipo AuthLogin

      const data: AuthToken = await (api.auth as any).postApiV1AuthLogin(credentials);

      const { token, user } = data; 
      
      // REALIZA O MAPEAMENTO ANTES DE CHAMAR O CONTEXTO
      if (token && user) {
        const rawUser = user as BackendUserRaw;

        const frontendUser: User = {
            // CORREÇÃO DE TIPAGEM: Asserção não-nula nos campos obrigatórios
            id: rawUser.id!, 
            nome: rawUser.nome!,
            email: rawUser.email!,
            matricula: rawUser.matricula!,
            perfil: rawUser.tipo_perfil as PerfilSistema, 
            nome_guerra: rawUser.nome_guerra!,
            posto_grad: rawUser.posto_grad!,
            id_unidade_operacional_fk: rawUser.id_unidade_operacional_fk!,
            
            unidadeId: rawUser.id_unidade_operacional_fk,
        };

        login(token, frontendUser); 
        navigate('/'); 
      } else {
        setError('Resposta inválida do servidor.'); 
      }

    } catch (err: any) {
      console.error("Erro na chamada de Login:", err);
      
      const errorMessage = err.body?.message || err.message || 'Erro de conexão ou credenciais inválidas.';
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Box 
        className="w-full max-w-sm p-8 space-y-6 bg-card rounded-xl shadow-2xl"
        component="form"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center">
          <img src={Logo} alt="S.O.R.O. Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-foreground">Acesso ao Sistema</h2>
        
        {error && (
          <Alert severity="error" className="w-full">
            {error}
          </Alert>
        )}

        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input text-foreground"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-input text-foreground"
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-DEFAULT/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-primary/50"
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Entrar'
          )}
        </button>

        <div className="text-center text-sm">
          <Link href="/esqueci-senha" className="text-primary hover:text-primary-DEFAULT/90">
            Esqueci minha senha
          </Link>
        </div>
      </Box>
    </div>
  );
};

export default Login;