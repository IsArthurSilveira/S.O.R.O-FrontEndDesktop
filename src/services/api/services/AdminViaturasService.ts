/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Viatura } from '../models/Viatura';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminViaturasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria uma nova viatura (apenas Admin)
     * @param requestBody
     * @returns any Viatura criada com sucesso.
     * @throws ApiError
     */
    public postApiV1Viaturas(
        requestBody: Viatura,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/viaturas',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (viatura já existe).`,
            },
        });
    }
    /**
     * Lista todas as viaturas
     * @returns Viatura Lista de viaturas.
     * @throws ApiError
     */
    public getApiV1Viaturas(): CancelablePromise<Array<Viatura>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/viaturas',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Deleta uma viatura pelo ID (apenas Admin)
     * @param id ID da viatura
     * @returns any Viatura deletada com sucesso.
     * @throws ApiError
     */
    public deleteApiV1Viaturas(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/viaturas/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Viatura não encontrada.`,
            },
        });
    }
}
