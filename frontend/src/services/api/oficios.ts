import axios, { AxiosResponse, isAxiosError } from "axios";
import { Paginated, RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/oficios`;

export interface Oficio {
  id: number;
  idBarragem: number;
  status: boolean;
  tipo?: string;
  obs?: string;
  dataCadastro: Date;
  dataModificacao?: Date;
  idUpdate: string;
  file?: string;
  file_size?: number;
}

const add = async (
  idBarragem: number,
  oficio: Oficio
): Promise<Oficio | RequestError> => {
  try {
    const data: AxiosResponse<Oficio> = await axios.post(
      `${url}/${idBarragem}`,
      oficio
    );

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
          error.response?.data.message ?? "Erro ao adicionar este oficio",
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
): Promise<Paginated<Oficio> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Oficio>> = await axios.get(
      `${url}/all/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map((val) => {
      val.dataCadastro = new Date(val.dataCadastro);
      if (val.dataModificacao) val.dataModificacao = new Date(val.dataCadastro);
      if (val.file) val.file = `${process.env.REACT_APP_URL}/${val.file}`;
      return val;
    });

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter oficio",
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
): Promise<Paginated<Oficio> | RequestError> => {
  try {
    const data: AxiosResponse<Paginated<Oficio>> = await axios.get(
      `${url}/trash/${idBarragem}/${page}/${perPage}`
    );

    data.data.items = data.data.items.map((val) => {
      val.dataCadastro = new Date(val.dataCadastro);
      if (val.dataModificacao) val.dataModificacao = new Date(val.dataCadastro);
      if (val.file) val.file = `${process.env.REACT_APP_URL}/${val.file}`;
      return val;
    });

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Treinamento Error",
        message: error.response?.data.message ?? "Erro ao obter oficio",
      };
    } else {
      throw error;
    }
  }
};

const getById = async (idOficio: number): Promise<Oficio | RequestError> => {
  try {
    const data: AxiosResponse<Oficio> = await axios.get(`${url}/${idOficio}`);

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
        message: error.response?.data.message ?? "Erro ao obter oficio",
      };
    } else {
      throw error;
    }
  }
};

const update = async (
  oficio: Oficio,
  file?: File
): Promise<Oficio | RequestError> => {
  let config = {};
  if (file) {
    config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  try {
    const data: AxiosResponse<Oficio> = await axios.put(
      `${url}/${oficio.id}`,
      {
        ...oficio,
        file: file,
      },
      config
    );

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
        message: error.response?.data.message ?? "Erro ao atualizar oficio",
      };
    } else {
      throw error;
    }
  }
};

const setFile = async (
  idOficio: number,
  file: File
): Promise<Oficio | RequestError> => {
  try {
    const data: AxiosResponse<Oficio> = await axios.put(
      `${url}/set_file/${idOficio}`,
      { file: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
        message: error.response?.data.message ?? "Erro ao atualizar oficio",
      };
    } else {
      throw error;
    }
  }
};

const remove = async (idOficio: number): Promise<Oficio | RequestError> => {
  try {
    const data: AxiosResponse<Oficio> = await axios.delete(
      `${url}/${idOficio}`
    );

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
        message: error.response?.data.message ?? "Erro ao atualizar oficio",
      };
    } else {
      throw error;
    }
  }
};

const restore = async (idOficio: number): Promise<Oficio | RequestError> => {
  try {
    const data: AxiosResponse<Oficio> = await axios.put(
      `${url}/restore/${idOficio}`
    );

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
        message: error.response?.data.message ?? "Erro ao atualizar oficio",
      };
    } else {
      throw error;
    }
  }
};

export const ApiOficio = {
  add,
  remove,
  update,
  getAll,
  getById,
  setFile,
  restore,
  getTrash,
};
