import axios, { AxiosResponse, isAxiosError } from "axios";
import { Paginated, RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/seminarios`;

export interface Seminario {
  id: number;
  idBarragem: number;
  status: boolean;
  local: string;
  tipo?: string;
  data: Date;
  responsavel: string;
  participantes?: number;
  obs?: string;
  dataCadastro: Date;
  dataModificacao?: Date;
  idUpdate: string;
  file?: string;
  file_size?: number;
  anterior?: Seminario;
}

const add = async (
  idBarragem: number,
  seminario: Seminario
): Promise<Seminario | RequestError> => {
  try {
    const data: AxiosResponse<Seminario> = await axios.post(
      `${url}/${idBarragem}`,
      {
        ...seminario,
        data: seminario.data.toISOString(),
      }
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Seminário Error",
        message:
          error.response?.data.message ?? "Erro ao adicionar este seminário",
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
): Promise<Paginated<Seminario> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Seminario>> = await axios.get(
      `${url}/all/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map(processData);

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Seminário Error",
        message: error.response?.data.message ?? "Erro ao obter seminários",
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
): Promise<Paginated<Seminario> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Seminario>> = await axios.get(
      `${url}/trash/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map(processData);

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Seminário Error",
        message: error.response?.data.message ?? "Erro ao obter seminários",
      };
    } else {
      throw error;
    }
  }
};

const getById = async (
  idSeminario: number
): Promise<Seminario | RequestError> => {
  try {
    const data: AxiosResponse<Seminario> = await axios.get(
      `${url}/${idSeminario}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Seminário Error",
        message: error.response?.data.message ?? "Erro ao obter seminário",
      };
    } else {
      throw error;
    }
  }
};

const update = async (
  seminario: Seminario,
  file?: File
): Promise<Seminario | RequestError> => {
  let config = {};
  if (file) {
    config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  try {
    const data: AxiosResponse<Seminario> = await axios.put(
      `${url}/${seminario.id}`,
      {
        ...seminario,
        data: seminario.data.toISOString(),
        file: file,
      },
      config
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Seminário Error",
        message: error.response?.data.message ?? "Erro ao atualizar seminário",
      };
    } else {
      throw error;
    }
  }
};

const setFile = async (
  idSeminario: number,
  file: File
): Promise<Seminario | RequestError> => {
  try {
    const data: AxiosResponse<Seminario> = await axios.put(
      `${url}/set_file/${idSeminario}`,
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
        error: error.response?.data.error ?? "Seminário Error",
        message: error.response?.data.message ?? "Erro ao atualizar seminário",
      };
    } else {
      throw error;
    }
  }
};

const remove = async (
  idSeminario: number
): Promise<Seminario | RequestError> => {
  try {
    const data: AxiosResponse<Seminario> = await axios.delete(
      `${url}/${idSeminario}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Seminário Error",
        message: error.response?.data.message ?? "Erro ao atualizar seminário",
      };
    } else {
      throw error;
    }
  }
};

const restore = async (
  idSeminario: number
): Promise<Seminario | RequestError> => {
  try {
    const data: AxiosResponse<Seminario> = await axios.put(
      `${url}/restore/${idSeminario}`
    );

    return processData(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Seminário Error",
        message: error.response?.data.message ?? "Erro ao atualizar seminário",
      };
    } else {
      throw error;
    }
  }
};

function processData(value: Seminario) {
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

export const ApiSeminarios = {
  add,
  remove,
  update,
  getAll,
  getById,
  setFile,
  restore,
  getTrash,
};
