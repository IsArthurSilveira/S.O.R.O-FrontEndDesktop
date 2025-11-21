// src/services/apiService.ts
import { ApiClient } from './api/ApiClient';

// O base URL é definido no .env do seu projeto, mas garantimos um fallback.
// Usamos a raiz do servidor para a geração. A API do backend está em /api/v1/
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cria uma única instância do cliente de API para ser usada em toda a aplicação
const api = new ApiClient({
  BASE: BASE_URL,
});

export const getClient = () => {
    return api;
};