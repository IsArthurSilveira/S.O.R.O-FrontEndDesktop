/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UnidadeOperacional } from '../models/UnidadeOperacional';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminUnidadesOperacionaisService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria uma nova unidade operacional (apenas Admin)
     * @param requestBody
     * @returns any Unidade operacional criada com sucesso.
     * @throws ApiError
     */
    public postApiV1UnidadesOperacionais(
        requestBody: UnidadeOperacional,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/unidades-operacionais',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (unidade já existe).`,
            },
        });
    }
    /**
     * Lista todas as unidades operacionais
     * @returns UnidadeOperacional Lista de unidades operacionais.
     * @throws ApiError
     */
    public getApiV1UnidadesOperacionais(): CancelablePromise<Array<UnidadeOperacional>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/unidades-operacionais',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Deleta uma unidade operacional pelo ID (apenas Admin)
     * @param id ID da unidade operacional
     * @returns any Unidade operacional deletada com sucesso.
     * @throws ApiError
     */
    public deleteApiV1UnidadesOperacionais(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/unidades-operacionais/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Unidade operacional não encontrada.`,
            },
        });
    }
}
