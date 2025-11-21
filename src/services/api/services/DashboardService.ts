/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Obtém o número de ocorrências por status
     * @param dataInicio Filtrar por data de início (opcional)
     * @param dataFim Filtrar por data de fim (opcional)
     * @param subgrupoId ID do Subgrupo para filtrar (opcional)
     * @returns any Dados de ocorrências por status.
     * @throws ApiError
     */
    public getApiV2DashboardOcorrenciasPorStatus(
        dataInicio?: string,
        dataFim?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v2/dashboard/ocorrencias-por-status',
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'subgrupoId': subgrupoId,
            },
        });
    }
    /**
     * Obtém o top 10 de ocorrências por tipo (Subgrupo)
     * @param dataInicio Filtrar por data de início (opcional)
     * @param dataFim Filtrar por data de fim (opcional)
     * @param bairroId ID do Bairro para filtrar (opcional)
     * @returns any Dados de ocorrências por tipo.
     * @throws ApiError
     */
    public getApiV2DashboardOcorrenciasPorTipo(
        dataInicio?: string,
        dataFim?: string,
        bairroId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v2/dashboard/ocorrencias-por-tipo',
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'bairroId': bairroId,
            },
        });
    }
    /**
     * Obtém o top 10 de ocorrências por bairro
     * @param dataInicio Filtrar por data de início (opcional)
     * @param dataFim Filtrar por data de fim (opcional)
     * @param subgrupoId ID do Subgrupo para filtrar (opcional)
     * @returns any Dados de ocorrências por bairro.
     * @throws ApiError
     */
    public getApiV2DashboardOcorrenciasPorBairro(
        dataInicio?: string,
        dataFim?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v2/dashboard/ocorrencias-por-bairro',
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'subgrupoId': subgrupoId,
            },
        });
    }
    /**
     * (NOVO) Obtém ocorrências por município (Gráfico Pizza)
     * @param dataInicio Filtrar por data de início (opcional)
     * @param dataFim Filtrar por data de fim (opcional)
     * @param subgrupoId ID do Subgrupo para filtrar (opcional)
     * @returns any Dados de ocorrências por município.
     * @throws ApiError
     */
    public getApiV2DashboardOcorrenciasPorMunicipio(
        dataInicio?: string,
        dataFim?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v2/dashboard/ocorrencias-por-municipio',
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'subgrupoId': subgrupoId,
            },
        });
    }
    /**
     * (NOVO) Obtém total de ocorrências por período (Gráfico Linha)
     * @param periodo Agrupar por 'day' (dia) ou 'month' (mês). Padrão é 'day'.
     * @param dataInicio Filtrar por data de início (opcional)
     * @param dataFim Filtrar por data de fim (opcional)
     * @param status Filtrar por status (opcional)
     * @param bairroId ID do Bairro para filtrar (opcional)
     * @param subgrupoId ID do Subgrupo para filtrar (opcional)
     * @returns any Lista de totais por período.
     * @throws ApiError
     */
    public getApiV2DashboardOcorrenciasPorPeriodo(
        periodo?: 'day' | 'month',
        dataInicio?: string,
        dataFim?: string,
        status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO',
        bairroId?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v2/dashboard/ocorrencias-por-periodo',
            query: {
                'periodo': periodo,
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'status': status,
                'bairroId': bairroId,
                'subgrupoId': subgrupoId,
            },
        });
    }
    /**
     * (NOVO) Obtém tempo médio (em horas) de conclusão por tipo (Gráfico Barra)
     * @param dataInicio Filtrar por data de início (opcional)
     * @param dataFim Filtrar por data de fim (opcional)
     * @param bairroId ID do Bairro para filtrar (opcional)
     * @param subgrupoId ID do Subgrupo para filtrar (opcional)
     * @returns any Lista de tipos com seu tempo médio de conclusão em horas.
     * @throws ApiError
     */
    public getApiV2DashboardAvgCompletionTime(
        dataInicio?: string,
        dataFim?: string,
        bairroId?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v2/dashboard/avg-completion-time',
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'bairroId': bairroId,
                'subgrupoId': subgrupoId,
            },
        });
    }
}
