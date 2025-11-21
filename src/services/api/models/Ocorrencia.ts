/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Ocorrencia = {
    id_ocorrencia?: string;
    nr_aviso?: string | null;
    data_acionamento?: string;
    hora_acionamento?: string;
    status_situacao?: Ocorrencia.status_situacao;
    data_execucao_servico?: string | null;
    relacionado_eleicao?: boolean;
    id_subgrupo_fk?: string;
    id_bairro_fk?: string;
    id_forma_acervo_fk?: string;
    id_usuario_abertura_fk?: string;
};
export namespace Ocorrencia {
    export enum status_situacao {
        PENDENTE = 'PENDENTE',
        EM_ANDAMENTO = 'EM_ANDAMENTO',
        CONCLUIDO = 'CONCLUIDO',
        CANCELADO = 'CANCELADO',
    }
}

