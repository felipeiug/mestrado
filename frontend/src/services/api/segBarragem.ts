import axios, { AxiosResponse, isAxiosError } from "axios";
import { Paginated, RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/seguranca_barragem`;

export type SegurancaTypes = "EdR" | "RISR" | "RPSB" | "oficio" | "outro";
export interface SegurancaBarragem {
  id: number;
  idBarragem: number;
  status: boolean;
  tipo: SegurancaTypes;
  outro?: string;
  data: Date;
  responsavel: string;
  obs?: string;
  dataCadastro: Date;
  dataModificacao?: Date;
  idUpdate: string;
  file?: string;
  file_size?: number;
  anterior?: SegurancaBarragem;
}

const add = async (
  idBarragem: number,
  segBarragem: SegurancaBarragem
): Promise<SegurancaBarragem | RequestError> => {
  try {
    const data: AxiosResponse<SegurancaBarragem> = await axios.post(
      `${url}/${idBarragem}`,
      {
        ...segBarragem,
        data: segBarragem.data.toISOString(),
      }
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message:
          error.response?.data.message ?? "Erro ao adicionar este segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

const getAll = async (
  idBarragem: number,
  page: number,
  perPage: number
): Promise<Paginated<SegurancaBarragem> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<SegurancaBarragem>> = await axios.get(
      `${url}/all/${idBarragem}/${page}/${perPage}`
    );
    data.data.items = data.data.items.map(processData);

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message: error.response?.data.message ?? "Erro ao obter segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

const getTrash = async (
  idBarragem: number,
  page: number,
  perPage: number
): Promise<Paginated<SegurancaBarragem> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<SegurancaBarragem>> = await axios.get(
      `${url}/trash/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map(processData);
    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message: error.response?.data.message ?? "Erro ao obter segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

const getById = async (
  idSegurancaBarragem: number
): Promise<SegurancaBarragem | RequestError> => {
  try {
    const data: AxiosResponse<SegurancaBarragem> = await axios.get(
      `${url}/${idSegurancaBarragem}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message: error.response?.data.message ?? "Erro ao obter segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

const update = async (
  segBarragem: SegurancaBarragem,
  file?: File
): Promise<SegurancaBarragem | RequestError> => {
  let config = {};
  if (file) {
    config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  try {
    const data: AxiosResponse<SegurancaBarragem> = await axios.put(
      `${url}/${segBarragem.id}`,
      {
        ...segBarragem,
        data: segBarragem.data.toISOString(),
        file: file,
      },
      config
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message: error.response?.data.message ?? "Erro ao atualizar segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

const setFile = async (
  idSegurancaBarragem: number,
  file: File
): Promise<SegurancaBarragem | RequestError> => {
  try {
    const data: AxiosResponse<SegurancaBarragem> = await axios.put(
      `${url}/set_file/${idSegurancaBarragem}`,
      { file: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message: error.response?.data.message ?? "Erro ao atualizar segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

const remove = async (
  idSegurancaBarragem: number
): Promise<SegurancaBarragem | RequestError> => {
  try {
    const data: AxiosResponse<SegurancaBarragem> = await axios.delete(
      `${url}/${idSegurancaBarragem}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message: error.response?.data.message ?? "Erro ao atualizar segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

const restore = async (
  idSegurancaBarragem: number
): Promise<SegurancaBarragem | RequestError> => {
  try {
    const data: AxiosResponse<SegurancaBarragem> = await axios.put(
      `${url}/restore/${idSegurancaBarragem}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Segurança da Barragem Error",
        message: error.response?.data.message ?? "Erro ao atualizar segurança da barragem",
      };
    } else {
      throw error;
    }
  }
};

function processData(value: SegurancaBarragem) {
  value.data = new Date(value.data);
  value.dataCadastro = new Date(value.dataCadastro);
  value.dataModificacao &&= new Date(value.dataCadastro);
  value.file &&= `${process.env.REACT_APP_URL}/${value.file}`;
  if (value.anterior) {
    value.anterior.data = new Date(value.anterior.data);
    value.anterior.dataCadastro = new Date(value.anterior.dataCadastro);
    value.anterior.dataModificacao &&= new Date(value.anterior.dataCadastro);
    value.anterior.file &&= `${process.env.REACT_APP_URL}/${value.anterior.file}`;
  }

  return value;
}

export const ApiSegurancaBarragems = {
  add,
  remove,
  update,
  getAll,
  getById,
  setFile,
  restore,
  getTrash,
};
