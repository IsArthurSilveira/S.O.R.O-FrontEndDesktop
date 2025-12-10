import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material'; 
import LogoChama from '../assets/S.O.R.O/Icone-Marca-Grande.svg';

// Adicione a tipagem para o evento de input para compatibilidade com o controle de Backspace
interface InputEvent extends React.FormEvent<HTMLInputElement> {
    nativeEvent: {
        inputType?: string;
    } & Event;
}


const VerificacaoCodigo: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. Estados de Credenciais e Processo
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Adicionado estado para confirmação de senha
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    
    // 2. Estado para o Código de Verificação (4 dígitos) - Estilo V2
    const [codigo, setCodigo] = useState(['', '', '', '']);
    
    // Mantendo a URL da API da versão desktop
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    // Captura o email passado pela tela anterior e o usa para inicializar o estado
    useEffect(() => {
        const emailDaRota = location.state?.email;
        if (emailDaRota) {
            setEmail(emailDaRota);
        }
    }, [location.state?.email]);


    // Função para lidar com a mudança nos campos de input (Estilo V2)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        
        // Limita a entrada a um dígito por campo
        if (value.length > 1) return;

        const novoCodigo = [...codigo];
        novoCodigo[index] = value;
        setCodigo(novoCodigo);

        // Mover o foco para o próximo input se um dígito foi inserido
        if (value && index < codigo.length - 1) {
            document.getElementById(`codigo-${index + 1}`)?.focus();
        }
        
        // Se apagar (Backspace/Delete), move o foco para o input anterior
        const nativeEvent = e.nativeEvent as InputEvent['nativeEvent']; 
        if (!value && index > 0 && nativeEvent.inputType === 'deleteContentBackward') {
            document.getElementById(`codigo-${index - 1}`)?.focus();
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSubmitting(true);

        const codigoCompleto = codigo.join('');

        if (codigoCompleto.length < 4) {
            setMessage({ type: 'error', text: 'Por favor, preencha todos os 4 dígitos do código.' });
            setIsSubmitting(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem. Por favor, verifique.' });
            setIsSubmitting(false);
            return;
        }

        try {
            // Lógica de API para redefinição de senha (Mantida do desktop)
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token: codigoCompleto, password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: '✅ Senha redefinida com sucesso! Redirecionando para o Login...' });
                setTimeout(() => {
                    navigate('/'); // Redireciona para o login
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || '❌ Erro ao redefinir a senha. Verifique o código e o e-mail.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: '❌ Não foi possível conectar ao servidor. Tente novamente mais tarde.' });
        } finally {
            // Se houve sucesso, o isSubmitting será resetado no timeout
            if (message?.type !== 'success') {
                setIsSubmitting(false);
            }
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
                <div className="w-full max-w-sm sm:max-w-md mx-auto">
                    {/* Ícone do Envelope */}
                    <div className="mx-auto w-fit text-center mb-4">
                        <svg width="65" height="50" viewBox="0 0 65 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-14 sm:h-12 sm:w-16 text-gray-900">
                            <path d="M62.5 0H2.5C1.83696 0 1.20107 0.263393 0.732233 0.732234C0.263392 1.20107 0 1.83696 0 2.5V45C0 46.3261 0.526784 47.5979 1.46447 48.5355C2.40215 49.4732 3.67392 50 5 50H60C61.3261 50 62.5979 49.4732 63.5355 48.5355C64.4732 47.5979 65 46.3261 65 45V2.5C65 1.83696 64.7366 1.20107 64.2678 0.732234C63.7989 0.263393 63.163 0 62.5 0ZM56.0719 5L32.5 26.6094L8.92813 5H56.0719ZM60 45H5V8.18438L30.8094 31.8437C31.2706 32.2671 31.8739 32.5021 32.5 32.5021C33.1261 32.5021 33.7294 32.2671 34.1906 31.8437L60 8.18438V45Z" fill="currentColor"/> 
                        </svg>
                    </div>

                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                        Redefinição de Senha
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
                        Insira o código de verificação enviado para o e-mail:
                    </p>
                    {/* E-mail a ser verificado */}
                    <p className="mt-2 text-xs sm:text-sm font-semibold text-center text-gray-900">
                        {email || "Insira seu e-mail"}
                    </p>

                    <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        {/* Campo E-mail */}
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
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#1a2b5e] focus:border-[#1a2b5e] text-xs sm:text-sm"
                                placeholder="Insira seu e-mail"
                            />
                        </div>

                        {/* Campos de Código (OTP) */}
                        <div className='pt-2 sm:pt-4'>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 text-center mb-2">
                                Código de Verificação
                            </label>
                            <div className="flex justify-center space-x-2 sm:space-x-4">
                                {codigo.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`codigo-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                        required
                                        inputMode="numeric"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Campo Nova Senha */}
                        <div>
                            <label htmlFor="nova-senha" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Nova Senha
                            </label>
                            <input
                                id="nova-senha"
                                name="nova-senha"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Insira a nova senha"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#1a2b5e] focus:border-[#1a2b5e] text-xs sm:text-sm"
                            />
                        </div>

                        {/* Campo Confirmação de Senha */}
                        <div>
                            <label htmlFor="confirmar-senha" className="block text-xs sm:text-sm font-medium text-gray-700">
                                Confirmar Nova Senha
                            </label>
                            <input
                                id="confirmar-senha"
                                name="confirmar-senha"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme a nova senha"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#1a2b5e] focus:border-[#1a2b5e] text-xs sm:text-sm"
                            />
                        </div>

                        {/* Mensagem de sucesso/erro */}
                        {message && (
                            <Alert severity={message.type} className="w-full">
                                {message.text}
                            </Alert>
                        )}

                        {/* Link para reenvio */}
                        <div className="text-xs sm:text-sm text-center">
                            <a href="#" className="font-medium text-gray-500 hover:text-[#1a2b5e]">
                                Reenviar código (60s)
                            </a>
                        </div>

                        {/* Botão de Recuperar senha */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#43a047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    'Recuperar senha'
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

export default VerificacaoCodigo;