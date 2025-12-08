// src/services/apiService.ts
import { ApiClient } from './api/ApiClient';
import { OpenAPI } from './api/core/OpenAPI';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let api: ApiClient | null = null;

export const getClient = () => {
    // Se já existe uma instância, retorna ela
    if (api) {
        return api;
    }
    
    // Cria uma nova instância do cliente de API
    api = new ApiClient({
        BASE: BASE_URL,
        TOKEN: OpenAPI.TOKEN,
    });
    
    return api;
};