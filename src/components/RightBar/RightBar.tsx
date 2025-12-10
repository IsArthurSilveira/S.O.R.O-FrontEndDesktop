import React from 'react';
import { BarChart2, Edit2, PlusCircle, User, UserPlus } from 'lucide-react';


interface RecentOccurrence {
  id: string;
  number: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  time: string;
}

interface RecentUser {
  id: string;
  name: string;
}

interface RightBarProps {
  isVisible: boolean;
  isSidebarExpanded?: boolean;
  onClose?: () => void;
}

const RightBar: React.FC<RightBarProps> = ({ isVisible, onClose }) => {
  // Atividades recentes (mock)
  const recentActivities: Array<{ id: string; icon: string; title: string; time: string }> = [
    { id: '1', icon: 'report', title: 'Um relatório foi gerado', time: 'Agora' },
    { id: '2', icon: 'edit', title: 'Uma ocorrência foi editada', time: '5 minutos atrás' },
    { id: '3', icon: 'add', title: 'Uma nova Ocorrência foi Criada', time: '10 minutos atrás' },
    { id: '4', icon: 'userEdit', title: 'Você editou um usuário', time: '15 minutos atrás' },
    { id: '5', icon: 'userAdd', title: 'Você Adicionou um novo usuário', time: '20 minutos atrás' },
  ];

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'report':
        return <BarChart2 size={18} className="text-blue-600" />;
      case 'edit':
        return <Edit2 size={18} className="text-yellow-600" />;
      case 'add':
        return <PlusCircle size={18} className="text-green-600" />;
      case 'userEdit':
        return <User size={18} className="text-purple-600" />;
      case 'userAdd':
        return <UserPlus size={18} className="text-indigo-600" />;
      default:
        return null;
    }
  };

  // Ocorrências recentes (mock)
  const recentOccurrences: RecentOccurrence[] = [
    { id: '1', number: '20245', status: 'EM_ANDAMENTO', time: 'Agora' },
    { id: '2', number: '20244', status: 'PENDENTE', time: '6 horas atrás' },
    { id: '3', number: '20243', status: 'CONCLUIDO', time: '8 horas atrás' },
    { id: '4', number: '20242', status: 'CANCELADO', time: '4 horas atrás' },
    { id: '5', number: '20241', status: 'CONCLUIDO', time: 'Ontem' },
  ];

  // Usuários recentes (mock)
  const recentUsers: RecentUser[] = [
    { id: '1', name: 'Rogério Ágora' },
    { id: '2', name: 'Capitã Maria Silva' },
    { id: '3', name: 'Jose Xavier' },
    { id: '4', name: 'Matheus Kauan' },
    { id: '5', name: 'Marcos Tenório' },
  ];

  // Cor do status da ocorrência
  const getStatusColor = (status: RecentOccurrence['status']) => {
    const colors = {
      PENDENTE: 'bg-red-500',
      EM_ANDAMENTO: 'bg-yellow-400',
      CONCLUIDO: 'bg-green-400',
      CANCELADO: 'bg-gray-400',
    };
    return colors[status];
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay escuro para mobile */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Painel lateral fixo à direita */}
      <aside 
        className="fixed top-0 right-0 h-full bg-white border-l border-[rgba(6,28,67,0.24)] z-50 overflow-y-auto shadow-2xl w-[85%] max-w-[320px] sm:w-80 md:w-72 lg:w-64"
      >
      <div className="flex flex-col gap-2 p-3 sm:p-4 pt-4">
        {/* Botão para fechar o painel */}
        {onClose && (
          <div className="flex justify-end -mb-2">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Fechar painel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Seção: Últimas Atividades */}
        <section className="flex flex-col gap-2 w-full">
          <h2 className="font-poppins text-base sm:text-sm font-medium leading-5 text-black">
            Últimas Atividades
          </h2>
          <div className="flex flex-col gap-1.5 sm:gap-1">
            {recentActivities.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="flex gap-2 sm:gap-2 items-start p-2 sm:p-1.5 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-center w-6 h-6 sm:w-5 sm:h-5 bg-white rounded-lg shrink-0">
                  {getActivityIcon(activity.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-sm sm:text-xs leading-4 text-black truncate">
                    {activity.title}
                  </p>
                  <p className="font-poppins text-xs sm:text-[10px] leading-3 text-[rgba(0,0,0,0.4)]">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Ocorrências Recentes */}
        <section className="flex flex-col gap-2 w-full mt-2">
          <h2 className="font-poppins text-base sm:text-sm font-medium leading-5 text-black">
            Ocorrências Recentes
          </h2>
          <div className="flex flex-col gap-1.5 sm:gap-1">
            {recentOccurrences.slice(0, 3).map((occurrence) => (
              <div
                key={occurrence.id}
                className="flex gap-2 items-start p-2 sm:p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full shrink-0 mt-0.5 ${getStatusColor(occurrence.status)}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-sm sm:text-xs leading-4 text-black truncate">
                    Ocorrência #{occurrence.number}
                  </p>
                  <p className="font-inter text-xs sm:text-[10px] leading-3 text-[rgba(0,0,0,0.4)]">
                    Ver detalhes
                  </p>
                </div>
                <span className="font-inter text-xs sm:text-[10px] leading-3 text-[rgba(0,0,0,0.4)] shrink-0 whitespace-nowrap">
                  {occurrence.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Usuários Recentes */}
        <section className="flex flex-col gap-2 w-full mt-2">
          <h2 className="font-poppins text-base sm:text-sm font-medium leading-5 text-black">
            Usuários Recentes
          </h2>
          <div className="flex flex-col gap-1.5 sm:gap-1">
            {recentUsers.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="flex gap-2 items-center p-2 sm:p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-3 sm:w-3 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="font-poppins text-sm sm:text-xs leading-4 text-black truncate">
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
    </>
  );
};

export default RightBar;
