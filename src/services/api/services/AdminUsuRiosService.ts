/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminUsuRiosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Lista todos os usuários (apenas Admin)
     * @returns any Lista de usuários.
     * @throws ApiError
     */
    public getApiv3Users(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/users',
            errors: {
                403: `Acesso negado (não é Admin).`,
            },
        });
    }
    /**
     * Obtém um usuário pelo ID (apenas Admin)
     * @param id ID do usuário
     * @returns any Detalhes do usuário.
     * @throws ApiError
     */
    public getApiv3UsersById(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Usuário não encontrado.`,
            },
        });
    }
    /**
     * Atualiza um usuário pelo ID (apenas Admin)
     * @param id ID do usuário
     * @param requestBody
     * @returns any Usuário atualizado com sucesso.
     * @throws ApiError
     */
    public putApiv3Users(
        id: string,
        requestBody: UserUpdate,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v3/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                404: `Usuário não encontrado.`,
            },
        });
    }
    /**
     * Deleta um usuário pelo ID (apenas Admin)
     * @param id ID do usuário
     * @returns any Usuário deletado com sucesso.
     * @throws ApiError
     */
    public deleteApiv3Users(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v3/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Usuário não encontrado.`,
            },
        });
    }
}
