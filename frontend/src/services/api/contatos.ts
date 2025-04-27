import axios, { AxiosResponse, isAxiosError } from "axios";
import { RequestError } from "./api";

export type TipoContato = "municipal" | "estadual" | "federal";

export interface ContatoExterno {
  id: number;
  elemento_notificacao: string;
  email?: string;
  sitio?: string;
  tipo: TipoContato;
  insertDate?: string;
  updateDate?: string;
  idUpdate?: string;
  idBarragem: number;
}

export interface ContatoInterno {
  id: string;
  nome: string;
  telefones: string;
  funcao: string;
  setor: string;
}

interface PaginationResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  perPage: number;
}

const getContatosExternos = async (idBarragem: number, tipo: TipoContato, page: number, perPage: number): Promise<PaginationResponse<ContatoExterno> | RequestError> => {
  try {
    const response: AxiosResponse<PaginationResponse<ContatoExterno>> = await axios.get(`${process.env.REACT_APP_URL}/contato/${idBarragem}/${tipo}/${page}/${perPage}`);
    return response.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contato Error",
        message: error.response?.data.message ?? "Erro ao obter dados de contato externo",
      };
    } else {
      throw error;
    }
  }
};

const createContatoExterno = async (idBarragem: number, contato: Omit<ContatoExterno, 'id' | 'insert_date' | 'update_date' | 'id_update'>): Promise<ContatoExterno | RequestError> => {
  try {
    const response: AxiosResponse<ContatoExterno> = await axios.post(
      `${process.env.REACT_APP_URL}/contato/${idBarragem}`,
      contato
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contato Error",
        message: error.response?.data.message ?? "Erro ao cadastrar contato externo!",
      };
    } else {
      throw error;
    }
  }
};

const updateContatoExterno = async (idContato: number, dados: Partial<ContatoExterno>): Promise<ContatoExterno | RequestError> => {
  try {
    const response: AxiosResponse<ContatoExterno> = await axios.put(
      `${process.env.REACT_APP_URL}/contato/${idContato}`,
      dados
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contato Error",
        message: error.response?.data.message ?? "Erro ao atualizar contato externo!",
      };
    } else {
      throw error;
    }
  }
};

const deleteContatoExterno = async (idContato: number): Promise<ContatoExterno | RequestError> => {
  try {
    const response: AxiosResponse<ContatoExterno> = await axios.delete(
      `${process.env.REACT_APP_URL}/contato/${idContato}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contato Error",
        message: error.response?.data.message ?? "Erro ao excluir contato externo!",
      };
    } else {
      throw error;
    }
  }
};


const getContatosInternos = async (idBarragem: number, page: number, perPage: number): Promise<PaginationResponse<ContatoInterno> | RequestError> => {
  try {
    const response: AxiosResponse<PaginationResponse<ContatoInterno>> = await axios.get(
      `${process.env.REACT_APP_URL}/contato/interno/${idBarragem}/${page}/${perPage}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contato Error",
        message: error.response?.data.message ?? "Erro ao obter contatos internos!",
      };
    } else {
      throw error;
    }
  }
};

const updateContatoInterno = async ( idFuncionario: string, dados: Partial<ContatoInterno> ): Promise<ContatoInterno | RequestError> => {
  try {
    const response: AxiosResponse<ContatoInterno> = await axios.put(
      `${process.env.REACT_APP_URL}/contato/interno/${idFuncionario}`,
      dados
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contato Error",
        message: error.response?.data.message ?? "Erro ao atualizar contato interno!",
      };
    } else {
      throw error;
    }
  }
};

const deleteContatoInterno = async (idFuncionario: string): Promise<ContatoInterno | RequestError> => {
  try {
    const response: AxiosResponse<ContatoInterno> = await axios.delete(
      `${process.env.REACT_APP_URL}/contato/interno/${idFuncionario}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Contato Error",
        message: error.response?.data.message ?? "Erro ao excluir contato interno!",
      };
    } else {
      throw error;
    }
  }
};


export const ApiContato = {
  getContatosExternos: getContatosExternos,
  createContatoExterno: createContatoExterno,
  updateContatoExterno: updateContatoExterno,
  deleteContatoExterno: deleteContatoExterno,
  getContatosInternos: getContatosInternos,
  updateContatoInterno: updateContatoInterno,
  deleteContatoInterno: deleteContatoInterno,
};
