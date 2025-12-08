/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Subgrupo } from '../models/Subgrupo';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminSubgruposService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria um novo subgrupo (apenas Admin)
     * @param requestBody
     * @returns any Subgrupo criado com sucesso.
     * @throws ApiError
     */
    public postApiv3Subgrupos(
        requestBody: Subgrupo,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v3/subgrupos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (subgrupo já existe).`,
            },
        });
    }
    /**
     * Lista todos os subgrupos
     * @returns Subgrupo Lista de subgrupos.
     * @throws ApiError
     */
    public getApiv3Subgrupos(): CancelablePromise<Array<Subgrupo>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/subgrupos',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Deleta um subgrupo pelo ID (apenas Admin)
     * @param id ID do subgrupo
     * @returns any Subgrupo deletado com sucesso.
     * @throws ApiError
     */
    public deleteApiv3Subgrupos(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v3/subgrupos/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Subgrupo não encontrado.`,
            },
        });
    }
}
