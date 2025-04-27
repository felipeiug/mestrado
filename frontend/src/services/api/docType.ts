import axios, { AxiosResponse, isAxiosError } from "axios";
import { RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/doc_type`;

export interface DocType {
  id: number;
  nome: string;
  descricao: string;
  addBy: string;
  addOn: Date;
  vigente: boolean;
  file: string;
  lastVigente?: Date;
}


interface Paginated {
  items: number[]; // Id dos documentos
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
const getDocTypeById = async (id: number): Promise<DocType|RequestError> => {
  try {
    const data:AxiosResponse<DocType> = await axios.get(`${url}/${id}`);

    data.data.addOn = new Date(data.data.addOn);
    if(data.data.lastVigente)
      data.data.lastVigente = new Date(data.data.lastVigente);

    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;

    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "DocType Error",
        message: error.response?.data.message ?? "Erro ao obter dados do tipo de documento",
      };
    } else {
      throw error;
    }
  }
};

const getAll = async (tipo:"vigente"|"not_vigente"|"all", page: number, perPage: number): Promise<Paginated|RequestError> => {
  try {
    const data:AxiosResponse<Paginated> = await axios.get(`${url}/${tipo}/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "DocType Error",
        message: error.response?.data.message ?? "Erro ao obter dados do tipo de documento",
      };
    } else {
      throw error;
    }
  }
};

const newDocType = async (newDoc: DocType, file: File): Promise<DocType|RequestError> => {
  try {
    const data:AxiosResponse<DocType> = await axios.post(
      `${url}/`,
      {
        'file': file,
        'nome': newDoc.nome,
        'descricao': newDoc.descricao,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    data.data.addOn = new Date(data.data.addOn);
    if(data.data.lastVigente)
      data.data.lastVigente = new Date(data.data.lastVigente);

    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;

    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "DocType Error",
        message: error.response?.data.message ?? "Erro ao obter dados do tipo de documento",
      };
    } else {
      throw error;
    }
  }
};

const setVigencia = async (id: number, vigente: boolean, lastVigente: Date): Promise<DocType|RequestError> => {
  try {
    const data:AxiosResponse<DocType> = await axios.post(
      `${url}/vigencia`,
      {
        'id': id,
        'vigente': vigente,
        'lastVigente': lastVigente,
      },
    );

    data.data.addOn = new Date(data.data.addOn);
    if(data.data.lastVigente)
      data.data.lastVigente = new Date(data.data.lastVigente);

    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;

    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "DocType Error",
        message: error.response?.data.message ?? "Erro ao obter dados do tipo de documento",
      };
    } else {
      throw error;
    }
  }
};


export const ApiDocType = {
  getDocTypeById: getDocTypeById,
  getAll: getAll,
  newDocType: newDocType,
  setVigencia: setVigencia,
};