import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Usando Link do react-router-dom
import { useAuth } from '../context/AuthContext';
import { Alert, CircularProgress } from '@mui/material'; // Mantendo Alert e CircularProgress para a lógica
// Usando o ícone do projeto desktop, seguindo o estilo da v2
import LogoChama from '../assets/Icone.svg'; 
import { getClient } from '../services/apiService';
import type { AuthLogin } from '../services/api/models/AuthLogin'; 
import type { AuthToken } from '../services/api/models/AuthToken'; 
// Importa o tipo User do gerador (que tem 'tipo_perfil')
import type { User as BackendUserRaw } from '../services/api/models/User'; 
// Importa o tipo User final do frontend (que tem 'perfil')
import type { User, PerfilSistema } from '../types'; 


const Login: React.FC = () => {
  // Mantendo os estados de credenciais do desktop para a lógica da API
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de funcionalidade do formulário (estilo v2)
  const [lembrarUsuario, setLembrarUsuario] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const api = getClient();
      
      const credentials: AuthLogin = { 
        email: email, // Campo de login é 'email'
        password: password,
      } as unknown as AuthLogin; // Cast forçar o tipo AuthLogin

      const data: AuthToken = await (api.auth as any).postApiV3AuthLogin(credentials);

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
    // Container principal: tela cheia (h-screen) e layout flexível (flex) - Estilo V2
    <div className="flex h-screen bg-white">
      
      {/* 1. Coluna da Esquerda (Informações e Logo) - Estilo V2 */}
      <div className="hidden lg:flex flex-col justify-center items-center w-full lg:w-1/2 p-8 
                    bg-[#CCD8FF] rounded-tr-[100px]"> 
        <div className="text-center">
          
          {/* Inserindo a tag <img> com o SVG importado */}
          <div className="mx-auto flex items-center justify-center">
            <img 
              src={LogoChama} 
              alt="Logo S.O.R.O" 
              className="h-28 w-28 mb-4" 
            />
          </div>
          
          <h1 className="text-6xl font-extrabold text-[#1a2b5e] mt-4 tracking-tight">
            S.O.R.O
          </h1>
          {/* Linha separadora */}
          <hr className="w-20 h-0.5 mx-auto bg-gray-400 border-0 rounded my-4" />
          <p className="text-xl text-[#1a2b5e] font-normal max-w-sm mx-auto">
            Sistema Organizacional para Registros de Ocorrências
          </p>
        </div>
      </div>

      {/* 2. Coluna da Direita (Formulário de Login) - Estilo V2 */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-900">
            Entrar na conta
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Seja bem vindo, preencha os campos com suas credenciais
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            
            {/* Exibição de Erro (Mantendo MUI Alert) */}
            {error && (
                <Alert severity="error" className="w-full">
                    {error}
                </Alert>
            )}

            {/* Campo Usuário/Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="insira seu e-mail" 
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a2b5e] focus:border-[#1a2b5e] sm:text-sm"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="insira a senha"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a2b5e] focus:border-[#1a2b5e] sm:text-sm pr-10"
                />
                
                {/* Ícone de olho (Estilo V2) */}
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {mostrarSenha ? (
                    <span role="img" aria-label="esconder senha"> 
                      &#128065;&#xfe0e;&#x200d;&#x20e0;
                    </span>
                  ) : (
                    <span role="img" aria-label="mostrar senha">
                      &#128065;
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Opções (Lembrar Usuário e Esqueceu a Senha?) - Estilo V2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="lembrar-usuario"
                  name="lembrar-usuario"
                  type="checkbox"
                  checked={lembrarUsuario}
                  onChange={(e) => setLembrarUsuario(e.target.checked)}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="lembrar-usuario" className="ml-2 block text-sm text-gray-900">
                  Lembrar usuário
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/esqueci-senha" 
                  className="font-medium text-[#1a2b5e] hover:text-[#0f1d38] flex items-center"
                >
                  Esqueceu a senha?
                  <span className="ml-1 text-sm font-semibold"> &gt;</span>
                </Link>
              </div>
            </div>

            {/* Botão de Entrar (Estilo V2 com lógica de submissão do desktop) */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                          bg-[#4CAF50] hover:bg-[#43a047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]
                          disabled:opacity-50 disabled:cursor-not-allowed" 
              >
                {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Entrar'
                )}
              </button>
            </div>
          </form>

          {/* Rodapé e Informações de Versão - Estilo V2 */}
          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-[#4CAF50] font-semibold flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[#4CAF50] mr-2"></span>
                Conexão segura e criptografada
            </p>
            <p className="mt-3 text-xs text-gray-500">
              © 2025 S.O.R.O - Sistema Organizacional de Registros de Ocorrências
            </p>
            <p className="text-xs text-gray-500">
              Versão 2.0.0 - Todos os Direitos Reservados
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;