/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Grupamento } from '../models/Grupamento';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminGrupamentosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria um novo grupamento (apenas Admin)
     * @param requestBody
     * @returns any Grupamento criado com sucesso.
     * @throws ApiError
     */
    public postApiV1Grupamentos(
        requestBody: Grupamento,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/grupamentos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (grupamento já existe).`,
            },
        });
    }
    /**
     * Lista todos os grupamentos
     * @returns Grupamento Lista de grupamentos.
     * @throws ApiError
     */
    public getApiV1Grupamentos(): CancelablePromise<Array<Grupamento>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/grupamentos',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Deleta um grupamento pelo ID (apenas Admin)
     * @param id ID do grupamento
     * @returns any Grupamento deletado com sucesso.
     * @throws ApiError
     */
    public deleteApiV1Grupamentos(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/grupamentos/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Grupamento não encontrado.`,
            },
        });
    }
}
