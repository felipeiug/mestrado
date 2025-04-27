import axios, { AxiosResponse, isAxiosError } from "axios";
import { Documento } from "./documentos";
import { RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/contratos`;

export interface Contrato {
  id: number;
  nome: string;
  contratoLote: string;
  descricao: string;
  idEmpreendimento?: string;
  idBarragem?: number;
  finalizado: boolean;
  validade: Date;
  dataCadastro: Date;
  idAdicionou: string;
  file: string;
  documentos?: Documento[];
}


interface Paginated {
  items: number[]; // Id dos documentos
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

const getContratoById = async (id: number): Promise<Contrato | RequestError> => {
  try {
    const data:AxiosResponse<Contrato> = await axios.get(`${url}/${id}`);
    
    data.data.dataCadastro = new Date(data.data.dataCadastro);
    data.data.validade = new Date(data.data.validade);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
      
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contrato Error",
        message: error.response?.data.message ?? "Erro ao obter dados do contrato",
      };
    } else {
      throw error;
    }
  }
};

const getAll = async (page: number, perPage: number): Promise<Paginated|RequestError> => {
  try {
    const data:AxiosResponse<Paginated> = await axios.get(`${url}/all/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contrato Error",
        message: error.response?.data.message ?? "Erro ao obter dados do contrato",
      };
    } else {
      throw error;
    }
  }
};

const getContratosByEmpreendimento = async (empreendimento: string, page: number, perPage: number): Promise<Paginated|RequestError> => {
  try {
    const data:AxiosResponse<Paginated> = await axios.get(`${url}/empreedimento/${empreendimento}/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contrato Error",
        message: error.response?.data.message ?? "Erro ao obter dados do contrato",
      };
    } else {
      throw error;
    }
  }
};

const getContratosByEmpreendimentoAndDam = async (empreendimento: string, dam:number, page: number, perPage: number): Promise<Paginated|RequestError> => {
  try {
    const data:AxiosResponse<Paginated> = await axios.get(`${url}/empreedimento_and_dam/${empreendimento}/${dam}/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contrato Error",
        message: error.response?.data.message ?? "Erro ao obter dados do contrato",
      };
    } else {
      throw error;
    }
  }
};

const novoContrato = async (newContrato: Contrato, file: File): Promise<Contrato|RequestError> => {
  try {
    const data:AxiosResponse<Contrato> = await axios.post(
      `${url}/new`,
      {
        'file':file,
        'nome': newContrato.nome,
        'contrato_lote': newContrato.contratoLote,
        'descricao': newContrato.descricao,
        'id_empreendimento': newContrato.idEmpreendimento,
        'id_barragem': newContrato.idBarragem,
        'validade': newContrato.validade,
        'documentos': newContrato.documentos,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    data.data.validade = new Date(data.data.validade);
    data.data.dataCadastro = new Date(data.data.dataCadastro);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;

    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contrato Error",
        message: error.response?.data.message ?? "Erro ao obter dados do contrato",
      };
    } else {
      throw error;
    }
  }
};

const setFinalized = async (id: number, finalized:boolean): Promise<Contrato|RequestError> => {
  try {
    const data:AxiosResponse<Contrato> = await axios.post(
      `${url}/set_finalized`,
      {
        'id': id,
        'finalized': finalized,
      },
    );

    data.data.validade = new Date(data.data.validade);
    data.data.dataCadastro = new Date(data.data.dataCadastro);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;

    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contrato Error",
        message: error.response?.data.message ?? "Erro ao obter dados do contrato",
      };
    } else {
      throw error;
    }
  }
};


export const ApiContrato = {
  getContratoById: getContratoById,
  getAll: getAll,
  getContratosByEmpreendimento: getContratosByEmpreendimento,
  getContratosByEmpreendimentoAndDam: getContratosByEmpreendimentoAndDam,
  novoContrato: novoContrato,
  setFinalized: setFinalized,
};