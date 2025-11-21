/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserInput = {
    nome: string;
    email: string;
    /**
     * Opcional no registro (será gerada e enviada por email). Obrigatória no login.
     */
    password?: string;
    matricula: string;
    tipo_perfil: UserInput.tipo_perfil;
    nome_guerra?: string | null;
    posto_grad?: string | null;
    id_unidade_operacional_fk?: string | null;
};
export namespace UserInput {
    export enum tipo_perfil {
        ADMIN = 'ADMIN',
        ANALISTA = 'ANALISTA',
        CHEFE = 'CHEFE',
    }
}

