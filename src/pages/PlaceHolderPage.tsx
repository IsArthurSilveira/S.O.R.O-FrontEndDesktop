import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceHolderPage: React.FC = () => {
  const location = useLocation();
  const pageName = location.pathname.replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-background">
      <h1 className="text-5xl font-extrabold text-primary mb-4">Em Construção</h1>
      <p className="text-xl text-foreground mb-8 text-center">
        A página **{pageName || 'Início'}** está sendo migrada para a versão Desktop.
      </p>
      <p className="text-muted-foreground text-center">
        Aguarde as próximas atualizações para acessar este recurso.
      </p>
    </div>
  );
};

export default PlaceHolderPage;