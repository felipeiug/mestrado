import axios, { AxiosResponse, isAxiosError } from "axios";
import { Paginated, RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/treinamentos`;

export interface Treinamento {
  id: number;
  idBarragem: number;
  status: boolean;
  tipo?: string;
  data: Date;
  responsavel: string;
  obs?: string;
  dataCadastro: Date;
  dataModificacao?: Date;
  idUpdate: string;
  file?: string;
  file_size?: number;
  anterior?: Treinamento;
}

const add = async (
  idBarragem: number,
  treinamento: Treinamento
): Promise<Treinamento | RequestError> => {
  try {
    const data: AxiosResponse<Treinamento> = await axios.post(
      `${url}/${idBarragem}`,
      {
        ...treinamento,
        data: treinamento.data.toISOString(),
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
          error.response?.data.message ?? "Erro ao adicionar este treinamento",
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
): Promise<Paginated<Treinamento> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Treinamento>> = await axios.get(
      `${url}/all/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map(processData);

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter treinamento",
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
): Promise<Paginated<Treinamento> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Treinamento>> = await axios.get(
      `${url}/trash/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map(processData);

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter treinamento",
      };
    } else {
      throw error;
    }
  }
};

const getById = async (
  idTreinamento: number
): Promise<Treinamento | RequestError> => {
  try {
    const data: AxiosResponse<Treinamento> = await axios.get(
      `${url}/${idTreinamento}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter treinamento",
      };
    } else {
      throw error;
    }
  }
};

const update = async (
  treinamento: Treinamento,
  file?: File
): Promise<Treinamento | RequestError> => {
  let config = {};
  if (file) {
    config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  try {
    const data: AxiosResponse<Treinamento> = await axios.put(
      `${url}/${treinamento.id}`,
      {
        ...treinamento,
        data: treinamento.data.toISOString(),
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
          error.response?.data.message ?? "Erro ao atualizar treinamento",
      };
    } else {
      throw error;
    }
  }
};

const setFile = async (
  idTreinamento: number,
  file: File
): Promise<Treinamento | RequestError> => {
  try {
    const data: AxiosResponse<Treinamento> = await axios.put(
      `${url}/set_file/${idTreinamento}`,
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
          error.response?.data.message ?? "Erro ao atualizar treinamento",
      };
    } else {
      throw error;
    }
  }
};

const remove = async (
  idTreinamento: number
): Promise<Treinamento | RequestError> => {
  try {
    const data: AxiosResponse<Treinamento> = await axios.delete(
      `${url}/${idTreinamento}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message:
          error.response?.data.message ?? "Erro ao atualizar treinamento",
      };
    } else {
      throw error;
    }
  }
};

const restore = async (
  idTreinamento: number
): Promise<Treinamento | RequestError> => {
  try {
    const data: AxiosResponse<Treinamento> = await axios.put(
      `${url}/restore/${idTreinamento}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message:
          error.response?.data.message ?? "Erro ao atualizar treinamento",
      };
    } else {
      throw error;
    }
  }
};

function processData(value: Treinamento) {
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

export const ApiTreinamento = {
  add,
  remove,
  update,
  getAll,
  getById,
  setFile,
  restore,
  getTrash,
};
