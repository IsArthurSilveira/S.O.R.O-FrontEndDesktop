/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OcorrenciaInput } from '../models/OcorrenciaInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OcorrNciasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Cria uma nova ocorrência
     * @param requestBody
     * @returns any Ocorrência criada com sucesso.
     * @throws ApiError
     */
    public postApiv3Ocorrencias(
        requestBody: OcorrenciaInput,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v3/ocorrencias',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Lista todas as ocorrências com filtros opcionais
     * @param status Filtrar por status (opcional)
     * @param subgrupoId Filtrar por Subgrupo (opcional)
     * @param bairroId Filtrar por Bairro (opcional)
     * @param page Número da página (opcional, padrão 1)
     * @param limit Número máximo de itens por página (opcional, padrão 10)
     * @returns any Lista de ocorrências.
     * @throws ApiError
     */
    public getApiv3Ocorrencias(
        status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO',
        subgrupoId?: string,
        bairroId?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/ocorrencias',
            query: {
                'status': status,
                'subgrupoId': subgrupoId,
                'bairroId': bairroId,
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Não autorizado.`,
            },
        });
    }
    /**
     * Obtém uma ocorrência pelo ID
     * @param id ID da ocorrência
     * @returns any Detalhes da ocorrência.
     * @throws ApiError
     */
    public getApiv3Ocorrencias1(
        id: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v3/ocorrencias/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Ocorrência não encontrada.`,
            },
        });
    }
    /**
     * Atualiza uma ocorrência pelo ID (apenas o criador)
     * @param id ID da ocorrência
     * @param requestBody
     * @returns any Ocorrência atualizada com sucesso.
     * @throws ApiError
     */
    public putApiv3Ocorrencias(
        id: string,
        requestBody: {
            status_situacao?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
            data_execucao_servico?: string | null;
            relacionado_eleicao?: boolean;
            nr_aviso?: string | null;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v3/ocorrencias/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erro de validação.`,
                403: `Acesso negado (não é o criador).`,
                404: `Ocorrência não encontrada.`,
            },
        });
    }
    /**
     * Faz upload de uma nova mídia (imagem/vídeo) para uma ocorrência
     * @param id ID da ocorrência
     * @param formData
     * @returns any Mídia enviada com sucesso.
     * @throws ApiError
     */
    public postApiv3OcorrenciasMidia(
        id: string,
        formData: {
            /**
             * O arquivo de mídia (imagem ou vídeo)
             */
            midia?: Blob;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v3/ocorrencias/{id}/midia',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Erro de validação ou nenhum arquivo enviado.`,
                404: `Ocorrência não encontrada.`,
            },
        });
    }
}
