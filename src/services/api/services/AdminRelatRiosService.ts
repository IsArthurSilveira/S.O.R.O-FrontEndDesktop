/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminRelatRiosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Exporta um relatório de ocorrências em formato Excel (apenas Admin)
     * @param ano Ano para filtrar (opcional)
     * @param mes Mês para filtrar (opcional)
     * @param unidadeOperacionalId ID da Unidade Operacional para filtrar (opcional)
     * @returns binary Relatório gerado com sucesso. Retorna um ficheiro binário (Excel).
     * @throws ApiError
     */
    public getApiV1Relatorios(
        ano?: number,
        mes?: number,
        unidadeOperacionalId?: string,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/relatorios',
            query: {
                'ano': ano,
                'mes': mes,
                'unidadeOperacionalId': unidadeOperacionalId,
            },
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é Admin).`,
            },
        });
    }
}
