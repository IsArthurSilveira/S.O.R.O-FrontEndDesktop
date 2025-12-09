// src/components/RightBar/RightBar.tsx
import React from 'react';

interface Activity {
  id: string;
  icon: string;
  title: string;
  time: string;
}

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
  isSidebarExpanded: boolean;
  onClose?: () => void;
}

const RightBar: React.FC<RightBarProps> = ({ isVisible, isSidebarExpanded, onClose }) => {
  // RightBar fica expandida quando sidebar está colapsada, e vice-versa
  const isExpanded = !isSidebarExpanded;
  // Dados mockados - você pode substituir por dados reais da API
  const recentActivities: Activity[] = [
    { id: '1', icon: '📊', title: 'Um relatório foi gerado', time: 'Agora' },
    { id: '2', icon: '✏️', title: 'Uma ocorrência foi editada', time: '5 minutos atrás' },
    { id: '3', icon: '➕', title: 'Uma nova Ocorrência foi Criada', time: '10 minutos atrás' },
    { id: '4', icon: '👤', title: 'Você editou um usuário', time: '15 minutos atrás' },
    { id: '5', icon: '👥', title: 'Você Adicionou um novo usuário', time: '20 minutos atrás' },
  ];

  const recentOccurrences: RecentOccurrence[] = [
    { id: '1', number: '20245', status: 'EM_ANDAMENTO', time: 'Agora' },
    { id: '2', number: '20244', status: 'PENDENTE', time: '6 horas atrás' },
    { id: '3', number: '20243', status: 'CONCLUIDO', time: '8 horas atrás' },
    { id: '4', number: '20242', status: 'CANCELADO', time: '4 horas atrás' },
    { id: '5', number: '20241', status: 'CONCLUIDO', time: 'Ontem' },
  ];

  const recentUsers: RecentUser[] = [
    { id: '1', name: 'Rogério Ágora' },
    { id: '2', name: 'Capitã Maria Silva' },
    { id: '3', name: 'Jose Xavier' },
    { id: '4', name: 'Matheus Kauan' },
    { id: '5', name: 'Marcos Tenório' },
  ];

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

  // Quando colapsada (sidebar expandida), não exibe ícone/flutuante
  if (!isExpanded) {
    return null;
  }

  return (
    <aside 
      className="fixed top-0 right-0 h-full w-64 bg-white border-l border-[rgba(6,28,67,0.24)] z-10 overflow-y-auto transition-all duration-300 ease-in-out"
    >
      <div className="flex flex-col gap-2 p-3">
        {/* Botão X para fechar */}
        {onClose && (
          <button
            onClick={onClose}
            className="self-end text-gray-500 hover:text-gray-700 transition-colors -mb-1"
            aria-label="Fechar painel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Últimas Atividades */}
        <section className="flex flex-col gap-2 w-full">
          <h2 className="font-poppins text-sm font-medium leading-5 text-black">
            Últimas Atividades
          </h2>
          <div className="flex flex-col gap-1">
            {recentActivities.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="flex gap-2 items-start p-1.5 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-center w-5 h-5 bg-white rounded-lg shrink-0">
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-xs leading-4 text-black truncate">
                    {activity.title}
                  </p>
                  <p className="font-poppins text-[10px] leading-3 text-[rgba(0,0,0,0.4)]">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ocorrências Recentes */}
        <section className="flex flex-col gap-2 w-full mt-2">
          <h2 className="font-poppins text-sm font-medium leading-5 text-black">
            Ocorrências Recentes
          </h2>
          <div className="flex flex-col gap-1">
            {recentOccurrences.slice(0, 3).map((occurrence) => (
              <div
                key={occurrence.id}
                className="flex gap-2 items-start p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div
                  className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${getStatusColor(occurrence.status)}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-xs leading-4 text-black truncate">
                    Ocorrência #{occurrence.number}
                  </p>
                  <p className="font-inter text-[10px] leading-3 text-[rgba(0,0,0,0.4)]">
                    Ver detalhes
                  </p>
                </div>
                <span className="font-inter text-[10px] leading-3 text-[rgba(0,0,0,0.4)] shrink-0 whitespace-nowrap">
                  {occurrence.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Usuários Adicionados Recentemente */}
        <section className="flex flex-col gap-2 w-full mt-2">
          <h2 className="font-poppins text-sm font-medium leading-5 text-black">
            Usuários Recentes
          </h2>
          <div className="flex flex-col gap-1">
            {recentUsers.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="flex gap-2 items-center p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-600"
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
                <p className="font-poppins text-xs leading-4 text-black truncate">
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default RightBar;
