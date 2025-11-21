/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Municipio } from '../models/Municipio';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMunicPiosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria um novo município (apenas Admin)
     * @param requestBody
     * @returns any Município criado com sucesso.
     * @throws ApiError
     */
    public postApiV1Municipios(
        requestBody: Municipio,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/municipios',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                409: `Conflito (município já existe).`,
            },
        });
    }
    /**
     * Lista todos os municípios
     * @returns Municipio Lista de municípios.
     * @throws ApiError
     */
    public getApiV1Municipios(): CancelablePromise<Array<Municipio>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/municipios',
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Obtém um município pelo ID
     * @param id ID do município
     * @returns any Detalhes do município.
     * @throws ApiError
     */
    public getApiV1Municipios1(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/municipios/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Município não encontrado.`,
            },
        });
    }
    /**
     * Atualiza um município pelo ID (apenas Admin)
     * @param id ID do município
     * @param requestBody
     * @returns any Município atualizado com sucesso.
     * @throws ApiError
     */
    public putApiV1Municipios(
        id: string,
        requestBody: Municipio,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/municipios/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
                404: `Município não encontrado.`,
            },
        });
    }
    /**
     * Deleta um município pelo ID (apenas Admin)
     * @param id ID do município
     * @returns any Município deletado com sucesso.
     * @throws ApiError
     */
    public deleteApiV1Municipios(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/municipios/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Acesso negado (não é Admin).`,
                404: `Município não encontrado.`,
            },
        });
    }
}
