/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Bairro } from '../models/Bairro';
import type { SuccessDelete } from '../models/SuccessDelete';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminBairrosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria um novo bairro (apenas Admin)
     * @param requestBody
     * @returns Bairro Bairro criado com sucesso.
     * @throws ApiError
     */
    public postApiV1Bairros(
        requestBody: Bairro,
    ): CancelablePromise<Bairro> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/bairros',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (bairro já existe).`,
            },
        });
    }
    /**
     * Lista todos os bairros
     * @returns Bairro Lista de bairros.
     * @throws ApiError
     */
    public getApiV1Bairros(): CancelablePromise<Array<Bairro>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/bairros',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Obtém um bairro pelo ID
     * @param id ID do bairro
     * @returns Bairro Detalhes do bairro.
     * @throws ApiError
     */
    public getApiV1Bairros1(
        id: string,
    ): CancelablePromise<Bairro> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/bairros/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Bairro não encontrado.`,
            },
        });
    }
    /**
     * Atualiza um bairro pelo ID (apenas Admin)
     * @param id ID do bairro
     * @param requestBody
     * @returns Bairro Bairro atualizado com sucesso.
     * @throws ApiError
     */
    public putApiV1Bairros(
        id: string,
        requestBody: Bairro,
    ): CancelablePromise<Bairro> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/bairros/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                404: `Bairro não encontrado.`,
            },
        });
    }
    /**
     * Deleta um bairro pelo ID (apenas Admin)
     * @param id ID do bairro
     * @returns SuccessDelete Bairro deletado com sucesso.
     * @throws ApiError
     */
    public deleteApiV1Bairros(
        id: string,
    ): CancelablePromise<SuccessDelete> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/bairros/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Bairro não encontrado.`,
            },
        });
    }
}
