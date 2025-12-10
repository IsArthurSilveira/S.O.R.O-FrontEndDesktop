/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FormaAcervo } from '../models/FormaAcervo';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminFormasDeAcervoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria uma nova forma de acervo (apenas Admin)
     * @param requestBody
     * @returns any Forma de acervo criada com sucesso.
     * @throws ApiError
     */
    public postApiv3FormasAcervo(
        requestBody: FormaAcervo,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v3/formas-acervo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (forma já existe).`,
            },
        });
    }
    /**
     * Lista todas as formas de acervo
     * @returns FormaAcervo Lista de formas de acervo.
     * @throws ApiError
     */
    public getApiv3FormasAcervo(): CancelablePromise<Array<FormaAcervo>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/formas-acervo',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Deleta uma forma de acervo pelo ID (apenas Admin)
     * @param id ID da forma de acervo
     * @returns any Forma de acervo deletada com sucesso.
     * @throws ApiError
     */
    public deleteApiv3FormasAcervo(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v3/formas-acervo/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Forma de acervo não encontrada.`,
            },
        });
    }
}
