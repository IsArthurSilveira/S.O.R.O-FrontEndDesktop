/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Grupo } from '../models/Grupo';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminGruposService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria um novo grupo (apenas Admin)
     * @param requestBody
     * @returns any Grupo criado com sucesso.
     * @throws ApiError
     */
    public postApiV1Grupos(
        requestBody: Grupo,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/grupos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (grupo já existe).`,
            },
        });
    }
    /**
     * Lista todos os grupos
     * @returns Grupo Lista de grupos.
     * @throws ApiError
     */
    public getApiV1Grupos(): CancelablePromise<Array<Grupo>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/grupos',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Deleta um grupo pelo ID (apenas Admin)
     * @param id ID do grupo
     * @returns any Grupo deletado com sucesso.
     * @throws ApiError
     */
    public deleteApiV1Grupos(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/grupos/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Grupo não encontrado.`,
            },
        });
    }
}
