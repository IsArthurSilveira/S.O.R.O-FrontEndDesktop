/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}

    public getApiv3DashboardOcorrenciasPorStatus(
        dataInicio?: string,
        dataFim?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/dashboard/ocorrencias-por-status', 
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'subgrupoId': subgrupoId,
            },
        });
    }

    public getApiv3DashboardOcorrenciasPorTipo(
        dataInicio?: string,
        dataFim?: string,
        bairroId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/dashboard/ocorrencias-por-tipo', 
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'bairroId': bairroId,
            },
        });
    }

    public getApiv3DashboardOcorrenciasPorBairro(
        dataInicio?: string,
        dataFim?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/dashboard/ocorrencias-por-bairro', 
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'subgrupoId': subgrupoId,
            },
        });
    }

    public getApiv3DashboardOcorrenciasPorMunicipio(
        dataInicio?: string,
        dataFim?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/dashboard/ocorrencias-por-municipio',
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'subgrupoId': subgrupoId,
            },
        });
    }

    public getApiv3DashboardOcorrenciasPorPeriodo(
        periodo?: 'day' | 'month',
        dataInicio?: string,
        dataFim?: string,
        status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO',
        bairroId?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/dashboard/ocorrencias-por-periodo', 
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

    public getApiv3DashboardAvgCompletionTime(
        dataInicio?: string,
        dataFim?: string,
        bairroId?: string,
        subgrupoId?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/dashboard/avg-completion-time',
            query: {
                'dataInicio': dataInicio,
                'dataFim': dataFim,
                'bairroId': bairroId,
                'subgrupoId': subgrupoId,
            },
        });
    }
}