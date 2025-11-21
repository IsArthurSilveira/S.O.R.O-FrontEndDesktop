import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Box, CircularProgress, Link } from '@mui/material';
import Logo from '../assets/logo.svg';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso no login
        const { token, user } = data;
        login(token, user);
        navigate('/'); // Redirecionar para o painel
      } else {
        // Erro no login
        setError(data.message || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
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
          placeholder="Nome de Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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