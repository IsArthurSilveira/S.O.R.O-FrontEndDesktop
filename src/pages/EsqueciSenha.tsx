import React, { useState } from 'react';
import { Box, Alert, Link, CircularProgress } from '@mui/material';
import Logo from '../assets/logo.svg';

const EsqueciSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Um código de verificação foi enviado para o seu e-mail.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Erro ao solicitar a redefinição de senha.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.' });
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
        <h2 className="text-2xl font-bold text-center text-foreground">Esqueci Minha Senha</h2>
        <p className="text-sm text-center text-muted-foreground">Informe o e-mail cadastrado para receber um código de verificação.</p>
        
        {message && (
          <Alert severity={message.type} className="w-full">
            {message.text}
          </Alert>
        )}

        <input
          type="email"
          placeholder="Seu E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            'Enviar Código'
          )}
        </button>

        <div className="text-center text-sm">
          <Link href="/login" className="text-primary hover:text-primary-DEFAULT/90">
            Voltar para o Login
          </Link>
        </div>
      </Box>
    </div>
  );
};

export default EsqueciSenha;