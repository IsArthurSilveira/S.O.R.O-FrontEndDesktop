// src/services/apiService.ts
import { ApiClient } from './api/ApiClient';
import { OpenAPI } from './api/core/OpenAPI';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cria uma única instância do cliente de API para ser usada em toda a aplicação
const api = new ApiClient({
  BASE: BASE_URL,
  // Dizemos ao cliente para usar a função resolvedora de token da configuração global
  TOKEN: OpenAPI.TOKEN,
});

export const getClient = () => {
    return api;
};