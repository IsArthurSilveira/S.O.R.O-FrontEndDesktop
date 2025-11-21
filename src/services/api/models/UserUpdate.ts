/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserUpdate = {
    nome?: string;
    email?: string;
    /**
     * Nova senha (opcional)
     */
    password?: string;
    matricula?: string;
    tipo_perfil?: UserUpdate.tipo_perfil;
    nome_guerra?: string | null;
    posto_grad?: string | null;
    id_unidade_operacional_fk?: string | null;
};
export namespace UserUpdate {
    export enum tipo_perfil {
        ADMIN = 'ADMIN',
        ANALISTA = 'ANALISTA',
        CHEFE = 'CHEFE',
    }
}

