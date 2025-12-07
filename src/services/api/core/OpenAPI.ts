/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string> | undefined;
    USERNAME?: string | Resolver<string> | undefined;
    PASSWORD?: string | Resolver<string> | undefined;
    HEADERS?: Headers | Resolver<Headers> | undefined;
    ENCODE_PATH?: ((path: string) => string) | undefined;
};

/**
 * Variável interna para armazenar o token JWT.
 */
let authToken: string | undefined = undefined;

/**
 * Função de utilidade para definir o token JWT no cliente API.
 * Deve ser chamada no login e no carregamento inicial do cache.
 * @param token O token JWT a ser utilizado no cabeçalho 'Authorization: Bearer'.
 */
export const setAuthToken = (token: string | null | undefined): void => {
    // Garante que 'undefined' ou 'null' limpa o token.
    authToken = token ?? undefined;
};

export const OpenAPI: OpenAPIConfig = {
    // URL Base da API (hospedada no Render)
    BASE: 'https://api-bombeiros-s-o-r-o.onrender.com', 
    
    // CORREÇÃO CRÍTICA: Atualização da versão da API para 'v3'.
    VERSION: 'v3', 
    
    WITH_CREDENTIALS: false, //
    CREDENTIALS: 'include', //
    
    // RESOLVER DE TOKEN: Mantém a correção para tipagem assíncrona do token.
    TOKEN: async () => {
        return authToken ?? ''; 
    },
    
    USERNAME: undefined, //
    PASSWORD: undefined, //
    HEADERS: undefined, //
    ENCODE_PATH: undefined, //
};