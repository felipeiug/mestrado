import axios, { AxiosResponse, isAxiosError } from "axios";
import { Paginated, RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/simulados`;

export interface Simulado {
  id: number;
  idBarragem: number;
  status: boolean;
  tipo?: string;
  data: Date;
  responsavel: string;
  populacao?: number;
  obs?: string;
  dataCadastro: Date;
  dataModificacao?: Date;
  idUpdate: string;
  file?: string;
  file_size?: number;
  anterior?: Simulado;
}

const add = async (
  idBarragem: number,
  simulado: Simulado
): Promise<Simulado | RequestError> => {
  try {
    const data: AxiosResponse<Simulado> = await axios.post(
      `${url}/${idBarragem}`,
      {
        ...simulado,
        data: simulado.data.toISOString(),
      }
    );

    data.data.data = new Date(data.data.data);
    data.data.dataCadastro = new Date(data.data.dataCadastro);
    if (data.data.dataModificacao)
      data.data.dataModificacao = new Date(data.data.dataCadastro);
    if (data.data.file)
      data.data.file = `${process.env.REACT_APP_URL}/${data.data.file}`;

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message:
          error.response?.data.message ?? "Erro ao adicionar este simulado",
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
): Promise<Paginated<Simulado> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Simulado>> = await axios.get(
      `${url}/all/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map(processData);

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter simulado",
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
): Promise<Paginated<Simulado> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Simulado>> = await axios.get(
      `${url}/trash/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map(processData);

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter simulado",
      };
    } else {
      throw error;
    }
  }
};

const getById = async (
  idSimulado: number
): Promise<Simulado | RequestError> => {
  try {
    const data: AxiosResponse<Simulado> = await axios.get(
      `${url}/${idSimulado}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter simulado",
      };
    } else {
      throw error;
    }
  }
};

const update = async (
  simulado: Simulado,
  file?: File
): Promise<Simulado | RequestError> => {
  let config = {};
  if (file) {
    config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  try {
    const data: AxiosResponse<Simulado> = await axios.put(
      `${url}/${simulado.id}`,
      {
        ...simulado,
        data: simulado.data.toISOString(),
        file: file,
      },
      config
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message:
          error.response?.data.message ?? "Erro ao atualizar simulado",
      };
    } else {
      throw error;
    }
  }
};

const setFile = async (
  idSimulado: number,
  file: File
): Promise<Simulado | RequestError> => {
  try {
    const data: AxiosResponse<Simulado> = await axios.put(
      `${url}/set_file/${idSimulado}`,
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
        error: error.response?.data.error ?? "Treinamento Error",
        message:
          error.response?.data.message ?? "Erro ao atualizar simulado",
      };
    } else {
      throw error;
    }
  }
};

const remove = async (
  idSimulado: number
): Promise<Simulado | RequestError> => {
  try {
    const data: AxiosResponse<Simulado> = await axios.delete(
      `${url}/${idSimulado}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message:
          error.response?.data.message ?? "Erro ao atualizar simulado",
      };
    } else {
      throw error;
    }
  }
};

const restore = async (
  idSimulado: number
): Promise<Simulado | RequestError> => {
  try {
    const data: AxiosResponse<Simulado> = await axios.put(
      `${url}/restore/${idSimulado}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message:
          error.response?.data.message ?? "Erro ao atualizar simulado",
      };
    } else {
      throw error;
    }
  }
};

function processData(value: Simulado) {
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

export const ApiSimulado = {
  add,
  remove,
  update,
  getAll,
  getById,
  setFile,
  restore,
  getTrash,
};
