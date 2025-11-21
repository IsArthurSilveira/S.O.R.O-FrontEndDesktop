/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User = {
    id?: string;
    nome?: string;
    email?: string;
    matricula?: string;
    tipo_perfil?: User.tipo_perfil;
    nome_guerra?: string | null;
    posto_grad?: string | null;
    id_unidade_operacional_fk?: string | null;
};
export namespace User {
    export enum tipo_perfil {
        ADMIN = 'ADMIN',
        ANALISTA = 'ANALISTA',
        CHEFE = 'CHEFE',
    }
}

