import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import LogoChama from '../assets/S.O.R.O/Icone-Marca-Grande.svg';

const EsqueciSenha: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mantendo a URL da API da versão desktop
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      // Lógica de conexão com o backend (mantida do desktop)
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso: Redirecionar para a tela de verificação de código, seguindo o fluxo da v2
        setMessage({ type: 'success', text: 'E-mail de verificação enviado com sucesso! Redirecionando...' });
        
        // Redireciona com o estado do email
        setTimeout(() => {
            navigate('/verificacao-codigo', { 
                state: { email: email } 
            });
        }, 1000); 

      } else {
        setMessage({ type: 'error', text: data.message || 'Erro ao solicitar a redefinição de senha.' });
        setIsSubmitting(false); // Desativa o loading em caso de erro
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.' });
      setIsSubmitting(false); // Desativa o loading em caso de erro de conexão
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen bg-white">
      {/* Coluna da Esquerda (Logo e Info) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-[#CCD8FF] rounded-tr-[60px] lg:rounded-tr-[100px]">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <img 
              src={LogoChama} 
              alt="Logo S.O.R.O" 
              className="h-20 w-20 lg:h-28 lg:w-28 mb-4" 
            />
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-[#1a2b5e] mt-4 tracking-tight">S.O.R.O</h1>
          <hr className="w-16 lg:w-20 h-0.5 mx-auto bg-gray-400 border-0 rounded my-4" />
          <p className="text-base lg:text-xl text-[#1a2b5e] font-normal max-w-xs lg:max-w-sm mx-auto">
            Sistema Organizacional para Registros de Ocorrências
          </p>
        </div>
      </div>

      {/* Coluna da Direita (Formulário) */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-4 sm:p-8 bg-white">
        <div className="w-full max-w-sm mx-auto">
          {/* Ícone da Chave */}
          <div className="mx-auto w-fit text-center mb-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-900">
                <path d="M72.5 30C72.5008 33.6799 71.599 37.3038 69.8736 40.5542C68.1483 43.8046 65.652 46.5821 62.6036 48.6435C59.5553 50.7048 56.0478 51.987 52.3887 52.3777C48.7296 52.7684 45.0305 52.2556 41.6156 50.8843L37.5 55H30V62.5H22.5V70H10V57.5L29.1156 38.3843C27.8819 35.3069 27.3436 31.9947 27.5392 28.6849C27.7348 25.3751 28.6594 22.1495 30.247 19.2387C31.8346 16.3279 34.0458 13.804 36.7226 11.8474C39.3993 9.89088 42.4754 8.55008 45.7307 7.92096C48.986 7.29184 52.3402 7.38995 55.5532 8.20826C58.7662 9.02657 61.7586 10.5449 64.3164 12.6545C66.8742 14.7642 68.9342 17.413 70.3489 20.4116C71.7637 23.4102 72.4982 26.6844 72.5 30Z" fill="black" fillOpacity="0.04"/>
                <path d="M50 5C46.0541 5.00354 42.165 5.94024 38.6502 7.73363C35.1354 9.52701 32.0945 12.1262 29.7759 15.3191C27.4573 18.5119 25.9267 22.2078 25.309 26.1051C24.6913 30.0024 25.0042 33.9904 26.2219 37.7438L8.23125 55.7312C7.99916 55.9636 7.81513 56.2394 7.68966 56.5429C7.56419 56.8464 7.49974 57.1716 7.5 57.5V70C7.5 70.663 7.76339 71.2989 8.23223 71.7678C8.70107 72.2366 9.33696 72.5 10 72.5H22.5C23.163 72.5 23.7989 72.2366 24.2678 71.7678C24.7366 71.2989 25 70.663 25 70V65H30C30.663 65 31.2989 64.7366 31.7678 64.2678C32.2366 63.7989 32.5 63.163 32.5 62.5V57.5H37.5C37.8284 57.5003 38.1536 57.4358 38.4571 57.3103C38.7606 57.1849 39.0364 57.0008 39.2688 56.7688L42.2562 53.7781C45.6923 54.8937 49.3292 55.2514 52.9167 54.8265C56.5042 54.4016 59.957 53.2042 63.0374 51.3169C66.1177 49.4295 68.7524 46.897 70.7601 43.8937C72.7678 40.8904 74.1007 37.4877 74.6672 33.9198C75.2336 30.3519 75.02 26.7036 74.0412 23.2262C73.0624 19.7487 71.3415 16.5248 68.9971 13.7762C66.6527 11.0277 63.7405 8.81984 60.461 7.30478C57.1815 5.78972 53.6126 5.00341 50 5ZM50 50C47.4693 50.0043 44.9609 49.5259 42.6094 48.5906C42.1494 48.391 41.64 48.3343 41.1473 48.4279C40.6547 48.5215 40.2016 48.7612 39.8469 49.1156L36.4656 52.5H30C29.337 52.5 28.7011 52.7634 28.2322 53.2322C27.7634 53.7011 27.5 54.337 27.5 55V60H22.5C21.837 60 21.2011 60.2634 20.7322 60.7322C20.2634 61.2011 20 61.837 20 62.5V67.5H12.5V58.5344L30.8844 40.1531C31.2388 39.7984 31.4785 39.3453 31.5721 38.8527C31.6657 38.36 31.609 37.8506 31.4094 37.3906C29.8284 33.4151 29.5639 29.0375 30.6548 24.9006C31.7456 20.7637 34.1343 17.0856 37.47 14.4066C40.8056 11.7276 44.9125 10.1888 49.1873 10.0163C53.4621 9.84376 57.6796 11.0466 61.2203 13.4481C64.761 15.8497 67.4383 19.3233 68.8589 23.3588C70.2796 27.3944 70.3687 31.7791 69.1132 35.8691C67.8577 39.959 65.3238 43.5386 61.8836 46.082C58.4434 48.6254 54.2783 49.9987 50 50ZM60 23.75C60 24.4917 59.7801 25.2167 59.368 25.8334C58.956 26.4501 58.3703 26.9307 57.6851 27.2145C56.9998 27.4984 56.2458 27.5726 55.5184 27.4279C54.791 27.2833 54.1228 26.9261 53.5984 26.4017C53.0739 25.8772 52.7168 25.209 52.5721 24.4816C52.4274 23.7542 52.5016 23.0002 52.7855 22.3149C53.0693 21.6297 53.5499 21.044 54.1666 20.632C54.7833 20.2199 55.5083 20 56.25 20C57.2446 20 58.1984 20.3951 58.9016 21.0983C59.6049 21.8016 60 22.7554 60 23.75Z" fill="black"/>
            </svg>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
            Esqueci minha Senha
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
            Por favor, insira o e-mail de identificação do usuário
          </p>

          <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="sr-only">E-mail</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] text-xs sm:text-sm"
                    placeholder="Insira seu e-mail"
                />
            </div>
            {/* Exibição de Mensagem */}
            {message && (
                <Alert severity={message.type} className="w-full">
                    {message.text}
                </Alert>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#43a047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] disabled:opacity-50"
              >
                {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    'Enviar código de verificação'
                )}
              </button>
            </div>
          </form>

          <div className="mt-3 sm:mt-4 text-center">
            <Link to="/" className="font-medium text-[#1a2b5e] hover:text-[#4CAF50] text-xs sm:text-sm">
                Voltar para o Login
            </Link>
          </div>

          {/* Rodapé e Informações de Versão */}
          <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-200 text-center">
            <p className="text-xs sm:text-sm text-[#4CAF50] font-semibold flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-[#4CAF50] mr-2"></span>
              Conexão segura e criptografada
            </p>
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
              © 2025 S.O.R.O - Sistema Organizacional de Registros de Ocorrências
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Versão 2.0.0 - Todos os Direitos Reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;