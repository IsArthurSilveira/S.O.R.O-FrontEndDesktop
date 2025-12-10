import { useState, useEffect } from 'react';
import { UserCircle, X } from 'lucide-react';

type Perfil = 'ADMIN' | 'ANALISTA' | 'CHEFE' | 'OPERADOR_CAMPO';

export interface EditarUsuarioPayload {
  nome: string;
  email: string;
  tipo_perfil: Perfil;
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
    tipo_perfil: 'ANALISTA'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preenche o formulário quando o usuário é carregado
  useEffect(() => {
    if (usuario) {
      console.log('Dados do usuário para edição:', usuario);
      setForm({
        nome: usuario.nome,
        email: usuario.email,
        tipo_perfil: usuario.tipo_perfil as Perfil
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
      // Envia nome, email e tipo_perfil
      const payload: EditarUsuarioPayload = { 
        nome: form.nome.trim(), 
        email: form.email.trim(),
        tipo_perfil: tipoMap[form.tipo_perfil]
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
      <div className="bg-white rounded-2xl w-full max-w-[650px] flex flex-col shadow-lg">
        {/* Header */}
        <div className="bg-white border-b border-[#e9eaeb]">
          <div className="flex gap-3 items-center pt-4 px-5 pb-3">
            <UserCircle className="w-6 h-6 text-gray-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="font-['Poppins'] font-semibold text-sm text-[#181d27]">
                Editar usuário
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <X className="w-5 h-5 text-[#717680]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-3 pb-3 overflow-y-auto">
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Nome completo */}
            <div>
              <label className="font-['Poppins'] font-medium text-xs text-[#414651] block mb-1">
                Nome completo
              </label>
              <input 
                type="text"
                className="w-full bg-white border border-[#d5d7da] rounded-lg shadow-sm px-3 py-2 font-['Poppins'] text-xs text-gray-900 placeholder:text-[#717680] focus:outline-none focus:border-black"
                placeholder="Maria Silva Carvalho"
                value={form.nome}
                onChange={(e) => setForm({...form, nome: e.target.value})}
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-['Poppins'] font-medium text-xs text-[#414651] block mb-1">
                Email
              </label>
              <input 
                type="email"
                className="w-full bg-white border border-[#d5d7da] rounded-lg shadow-sm px-3 py-2 font-['Poppins'] text-xs text-gray-900 placeholder:text-[#717680] focus:outline-none focus:border-black"
                placeholder="Maria.silva@cbm.pe.gov.br"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
              />
            </div>

            {/* Tipo de usuário */}
            <div className="mt-1">
              <p className="font-['Poppins'] font-medium text-xs text-[#414651] mb-2">
                Tipo de usuário
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {tiposUsuario.map((tipo) => (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => setForm({...form, tipo_perfil: tipo.value})}
                    className={`flex items-start gap-2 p-2.5 rounded-lg border transition-all ${
                      form.tipo_perfil === tipo.value 
                        ? 'border-black bg-white' 
                        : 'border-[#d5d7da] hover:border-black'
                    }`}
                  >
                    <UserCircle className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <p className="font-['Poppins'] font-semibold text-xs text-black leading-tight">
                        {tipo.titulo}
                      </p>
                      <p className="font-['Poppins'] text-[10px] text-black/40 leading-snug mt-0.5">
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
        <div className="border-t border-[#e9eaeb] pt-3">
          <div className="flex gap-2 px-5 pb-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-[#d5d7da] rounded-lg shadow-sm px-3 py-2 font-['Poppins'] font-semibold text-sm text-[#414651] hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-[#70b37b] border border-[#a0bce8] rounded-lg shadow-sm px-3 py-2 font-['Poppins'] font-semibold text-sm text-white hover:bg-[#5fa36a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
