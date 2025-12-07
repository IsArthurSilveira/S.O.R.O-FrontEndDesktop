/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
// Correção na linha 7: Alteração de importação nomeada para importação default.
import FetchHttpRequest from './core/FetchHttpRequest';
import { AdminBairrosService } from './services/AdminBairrosService';
import { AdminFormasDeAcervoService } from './services/AdminFormasDeAcervoService';
import { AdminGrupamentosService } from './services/AdminGrupamentosService';
import { AdminGruposService } from './services/AdminGruposService';
import { AdminMunicPiosService } from './services/AdminMunicPiosService';
import { AdminNaturezasService } from './services/AdminNaturezasService';
import { AdminRelatRiosService } from './services/AdminRelatRiosService';
import { AdminSubgruposService } from './services/AdminSubgruposService';
import { AdminUnidadesOperacionaisService } from './services/AdminUnidadesOperacionaisService';
import { AdminUsuRiosService } from './services/AdminUsuRiosService';
import { AdminViaturasService } from './services/AdminViaturasService';
import { AuthService } from './services/AuthService';
import { DashboardService } from './services/DashboardService';
import { OcorrNciasService } from './services/OcorrNciasService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly adminBairros: AdminBairrosService;
    public readonly adminFormasDeAcervo: AdminFormasDeAcervoService;
    public readonly adminGrupamentos: AdminGrupamentosService;
    public readonly adminGrupos: AdminGruposService;
    public readonly adminMunicPios: AdminMunicPiosService;
    public readonly adminNaturezas: AdminNaturezasService;
    public readonly adminRelatRios: AdminRelatRiosService;
    public readonly adminSubgrupos: AdminSubgruposService;
    public readonly adminUnidadesOperacionais: AdminUnidadesOperacionaisService;
    public readonly adminUsuRios: AdminUsuRiosService;
    public readonly adminViaturas: AdminViaturasService;
    public readonly auth: AuthService;
    public readonly dashboard: DashboardService;
    public readonly ocorrNcias: OcorrNciasService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'https://api-bombeiros-s-o-r-o.onrender.com',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.adminBairros = new AdminBairrosService(this.request);
        this.adminFormasDeAcervo = new AdminFormasDeAcervoService(this.request);
        this.adminGrupamentos = new AdminGrupamentosService(this.request);
        this.adminGrupos = new AdminGruposService(this.request);
        this.adminMunicPios = new AdminMunicPiosService(this.request);
        this.adminNaturezas = new AdminNaturezasService(this.request);
        this.adminRelatRios = new AdminRelatRiosService(this.request);
        this.adminSubgrupos = new AdminSubgruposService(this.request);
        this.adminUnidadesOperacionais = new AdminUnidadesOperacionaisService(this.request);
        this.adminUsuRios = new AdminUsuRiosService(this.request);
        this.adminViaturas = new AdminViaturasService(this.request);
        this.auth = new AuthService(this.request);
        this.dashboard = new DashboardService(this.request);
        this.ocorrNcias = new OcorrNciasService(this.request);
    }
}