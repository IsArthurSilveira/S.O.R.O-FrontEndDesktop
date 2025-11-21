/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthLogin } from '../models/AuthLogin';
import type { AuthRegister } from '../models/AuthRegister';
import type { AuthToken } from '../models/AuthToken';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Registra um novo usuário (Admin)
     * @param requestBody
     * @returns AuthToken Usuário criado com sucesso.
     * @throws ApiError
     */
    public postApiV1AuthRegister(
        requestBody: AuthRegister,
    ): CancelablePromise<AuthToken> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                409: `Conflito (Usuário já existe).`,
            },
        });
    }
    /**
     * Login de usuário
     * @param requestBody
     * @returns AuthToken Login bem-sucedido.
     * @throws ApiError
     */
    public postApiV1AuthLogin(
        requestBody: AuthLogin,
    ): CancelablePromise<AuthToken> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Credenciais inválidas.`,
            },
        });
    }
}
