import { ApiCompany } from "./company";
import { ApiBarragem } from "./barragem";
import { ApiZAS } from "./zas";
import { ApiSection } from "./section";
import { ApiDamFiles } from "./barragemFiles";
import { ApiUser } from "./user";
import { ApiDocumento } from "./documentos";
import { ApiDocType } from "./docType";
import { ApiContrato } from "./contratos";
import { ApiEstadosMunicipios } from "./estadoMunicipio";
import { ApiSeminarios } from "./seminarios";
import { ApiSegurancaBarragems } from "./segBarragem";
import { ApiTreinamento } from "./treinamentos";
import { ApiSimulado } from "./simulados";
import { ApiOficio } from "./oficios";

export interface RequestError {
  error: string;
  message: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

// Schemas
export interface ApiSchema {
  company: typeof ApiCompany;
  barragem: typeof ApiBarragem;
  zas: typeof ApiZAS;
  section: typeof ApiSection;
  damFiles: typeof ApiDamFiles;
  user: typeof ApiUser;
  documento: typeof ApiDocumento;
  docType: typeof ApiDocType;
  contrato: typeof ApiContrato;
  estadosMunicipios: typeof ApiEstadosMunicipios;
  seminarios: typeof ApiSeminarios;
  segBarragem: typeof ApiSegurancaBarragems;
  treinamentos: typeof ApiTreinamento;
  simulados: typeof ApiSimulado;
  oficios: typeof ApiOficio;
  baseUrl: string;
}

// Dados da API
export function useApi(): ApiSchema {
  return {
    company: ApiCompany,
    barragem: ApiBarragem,
    zas: ApiZAS,
    section: ApiSection,
    damFiles: ApiDamFiles,
    user: ApiUser,
    documento: ApiDocumento,
    docType: ApiDocType,
    contrato: ApiContrato,
    estadosMunicipios: ApiEstadosMunicipios,
    segBarragem: ApiSegurancaBarragems,
    treinamentos: ApiTreinamento,
    simulados: ApiSimulado,
    oficios: ApiOficio,
    seminarios: ApiSeminarios,
    baseUrl: `${process.env.REACT_APP_URL}`,
  };
}
