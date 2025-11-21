import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Painel de Controle</h1>
      <p className="text-muted-foreground">Bem-vindo(a) ao S.O.R.O. - Sistema de Ocorrências e Recursos Operacionais. Esta é a página do Dashboard.</p>
      
      {/* Aqui serão integrados os cards e gráficos do Dashboard V2 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
            <h3 className="font-semibold text-lg text-primary">Total de Ocorrências</h3>
            <p className="text-3xl text-foreground mt-2">1234</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
            <h3 className="font-semibold text-lg text-primary">Em Andamento</h3>
            <p className="text-3xl text-foreground mt-2">12</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
            <h3 className="font-semibold text-lg text-primary">Concluídas (Hoje)</h3>
            <p className="text-3xl text-foreground mt-2">5</p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
            <h3 className="font-semibold text-lg text-primary">Viaturas em Operação</h3>
            <p className="text-3xl text-foreground mt-2">10 / 15</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;