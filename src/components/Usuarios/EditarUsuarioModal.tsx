import { useState, useEffect } from 'react';
import { UserCircle, X } from 'lucide-react';

type Perfil = 'ADMIN' | 'ANALISTA' | 'CHEFE' | 'OPERADOR_CAMPO';

export interface EditarUsuarioPayload {
  nome: string;
  email: string;
  tipo_perfil: Perfil;
  matricula: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo_perfil: string;
  matricula?: string;
  nome_guerra?: string | null;
  posto_grad?: string | null;
}

export interface EditarUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: EditarUsuarioPayload) => Promise<void> | void;
  usuario: Usuario | null;
}

const tiposUsuario = [
  {
    value: 'ADMIN' as Perfil,
    titulo: 'Administrador',
    descricao: 'Acesso total ao sistema e permissão para adicionar novos usuários'
  },
  {
    value: 'ANALISTA' as Perfil,
    titulo: 'Analista',
    descricao: 'Acesso limitado ao sistema com permissão para adicionar ocorrências'
  },
  {
    value: 'CHEFE' as Perfil,
    titulo: 'Gerente',
    descricao: 'Acesso limitado ao sistema com permissão de gerar relatórios de ocorrências'
  },
  {
    value: 'OPERADOR_CAMPO' as Perfil,
    titulo: 'Operador de Campo',
    descricao: 'Usuário mobile com permissão para editar ocorrências'
  }
];

export default function EditarUsuarioModal({ isOpen, onClose, onSubmit, usuario }: EditarUsuarioModalProps) {
  const [form, setForm] = useState<EditarUsuarioPayload>({ 
    nome: '', 
    email: '', 
    tipo_perfil: 'ANALISTA',
    matricula: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preenche o formulário quando o usuário é carregado
  useEffect(() => {
    if (usuario) {
      setForm({
        nome: usuario.nome,
        email: usuario.email,
        tipo_perfil: usuario.tipo_perfil as Perfil,
        matricula: usuario.matricula || ''
      });
    }
  }, [usuario]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Validação básica
    if (!form.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!form.email.trim()) {
      setError('Email é obrigatório');
      return;
    }
    if (!form.matricula.trim()) {
      setError('Matrícula é obrigatória');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      // Mapeia perfis não suportados pelo enum da API
      const tipoMap: Record<Perfil, 'ADMIN' | 'ANALISTA' | 'CHEFE'> = {
        ADMIN: 'ADMIN',
        ANALISTA: 'ANALISTA',
        CHEFE: 'CHEFE',
        OPERADOR_CAMPO: 'ANALISTA',
      } as const;
      // Envia nome, email, tipo_perfil e matrícula
      const payload: EditarUsuarioPayload = { 
        nome: form.nome.trim(), 
        email: form.email.trim(), 
        tipo_perfil: tipoMap[form.tipo_perfil],
        matricula: form.matricula.trim()
      };
      console.log('Enviando payload de edição:', payload);
      await onSubmit(payload);
      onClose();
    } catch (e: any) {
      console.error('Erro completo:', e);
      const apiMsg = e?.body?.message || e?.message;
      const apiErrors = e?.body?.errors ? JSON.stringify(e.body.errors) : '';
      setError(apiMsg ? `${apiMsg}${apiErrors ? `: ${apiErrors}` : ''}` : 'Erro ao atualizar usuário');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[720px] flex flex-col shadow-lg">
        {/* Header */}
        <div className="bg-white border-b border-[#e9eaeb]">
          <div className="flex gap-4 items-start pt-6 px-6 pb-5">
            <div className="bg-white border border-[#e9eaeb] rounded-[10px] shadow-sm p-2 shrink-0">
              <UserCircle className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-['Poppins'] font-semibold text-sm text-[#181d27] leading-5">
                Editar usuário
              </h2>
              <p className="font-['Poppins'] text-sm text-[#535862] leading-5 mt-1">
                Atualize os campos com as novas informações do usuário
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <X className="w-6 h-6 text-[#717680]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-3">
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3.5">
            {/* Nome completo */}
            <div className="flex items-center gap-8">
              <label className="font-['Poppins'] font-medium text-sm text-[#414651] w-40 shrink-0">
                Nome completo
              </label>
              <input 
                type="text"
                className="flex-1 bg-white border border-[#d5d7da] rounded-lg shadow-sm px-3.5 py-2.5 font-['Poppins'] font-medium text-sm text-gray-900 placeholder:text-[#717680] focus:outline-none focus:border-black"
                placeholder="Maria Silva Carvalho"
                value={form.nome}
                onChange={(e) => setForm({...form, nome: e.target.value})}
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-8">
              <label className="font-['Poppins'] font-medium text-sm text-[#414651] w-40 shrink-0">
                Email do usuário
              </label>
              <input 
                type="email"
                className="flex-1 bg-white border border-[#d5d7da] rounded-lg shadow-sm px-3.5 py-2.5 font-['Poppins'] font-medium text-sm text-gray-900 placeholder:text-[#717680] focus:outline-none focus:border-black"
                placeholder="Maria.silva@cbm.pe.gov.br"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
              />
            </div>

            {/* Matrícula */}
            <div className="flex items-center gap-8">
              <label className="font-['Poppins'] font-medium text-sm text-[#414651] w-40 shrink-0">
                Matrícula
              </label>
              <input 
                type="text"
                className="flex-1 bg-white border border-[#d5d7da] rounded-lg shadow-sm px-3.5 py-2.5 font-['Poppins'] font-medium text-sm text-gray-900 placeholder:text-[#717680] focus:outline-none focus:border-black"
                placeholder="123456-7"
                value={form.matricula}
                onChange={(e) => setForm({...form, matricula: e.target.value})}
              />
            </div>

            {/* Tipo de usuário */}
            <div className="mt-1">
              <p className="font-['Poppins'] font-medium text-sm text-[#414651] mb-2.5">
                Tipo de usuário :
              </p>
              <div className="h-px bg-[#e9eaeb] mb-2.5"></div>
              
              <div className="flex flex-col gap-2">
                {tiposUsuario.map((tipo) => (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => setForm({...form, tipo_perfil: tipo.value})}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${
                      form.tipo_perfil === tipo.value 
                        ? 'border-black bg-white' 
                        : 'border-[#d5d7da] hover:border-black'
                    }`}
                  >
                    <UserCircle className="w-7 h-7 text-gray-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <p className="font-['Poppins'] font-semibold text-sm text-black leading-tight">
                        {tipo.titulo}
                      </p>
                      <p className="font-['Poppins'] text-xs text-black/40 leading-snug mt-1">
                        {tipo.descricao}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e9eaeb] pt-5">
          <div className="flex gap-3 px-6 pb-5">
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-[#d5d7da] rounded-lg shadow-sm px-4 py-2.5 font-['Poppins'] font-semibold text-base text-[#414651] hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-[#70b37b] border border-[#a0bce8] rounded-lg shadow-sm px-4 py-2.5 font-['Poppins'] font-semibold text-base text-white hover:bg-[#5fa36a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
