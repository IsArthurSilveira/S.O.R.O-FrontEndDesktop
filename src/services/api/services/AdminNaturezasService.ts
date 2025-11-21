/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Natureza } from '../models/Natureza';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminNaturezasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria uma nova natureza (apenas Admin)
     * @param requestBody
     * @returns any Natureza criada com sucesso.
     * @throws ApiError
     */
    public postApiV1Naturezas(
        requestBody: Natureza,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/naturezas',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (natureza já existe).`,
            },
        });
    }
    /**
     * Lista todas as naturezas
     * @returns Natureza Lista de naturezas.
     * @throws ApiError
     */
    public getApiV1Naturezas(): CancelablePromise<Array<Natureza>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/naturezas',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Deleta uma natureza pelo ID (apenas Admin)
     * @param id ID da natureza
     * @returns any Natureza deletada com sucesso.
     * @throws ApiError
     */
    public deleteApiV1Naturezas(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/naturezas/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Natureza não encontrada.`,
            },
        });
    }
}
