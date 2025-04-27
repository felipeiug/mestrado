import axios, { AxiosResponse, isAxiosError } from "axios";
import { User } from "../../context";
import { NewUser } from "../../components";
import { RequestError } from "./api";


const getUser = async (): Promise<User | RequestError> => {
  try {
    const data = await axios.get(`${process.env.REACT_APP_URL}/user/data`);
    if (data.data.insertDate) data.data.insertDate = new Date(data.data.insertDate);
    if (data.data.updateDate) data.data.updateDate = new Date(data.data.updateDate);
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "User Error",
        message: error.response?.data.message ?? "Erro ao obter os dados do usuário",
      };
    } else {
      throw error;
    }
  }
};

const getUserById = async (id: string): Promise<User | RequestError> => {
  try {
    const data = await axios.get(`${process.env.REACT_APP_URL}/user/${id}`);
    if (data.data.insertDate) data.data.insertDate = new Date(data.data.insertDate);
    if (data.data.updateDate) data.data.updateDate = new Date(data.data.updateDate);
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "User Error",
        message: error.response?.data.message ?? "Erro ao obter os dados do usuário",
      };
    } else {
      throw error;
    }
  }
};

interface AllUsers {
  items: string[]; // Id dos usuários
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
const getAll = async (page: number, perPage: number): Promise<AllUsers | RequestError> => {
  try {
    const data: AxiosResponse<AllUsers> = await axios.get(`${process.env.REACT_APP_URL}/user/list_my_users/${page.toFixed(0)}/${perPage.toFixed(0)}`);
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "User Error",
        message: error.response?.data.message ?? "Erro ao obter os dados do usuário",
      };
    } else {
      throw error;
    }
  }
};

const getByName = async (name: string, page: number, perPage: number): Promise<AllUsers | RequestError> => {
  try {
    const data: AxiosResponse<AllUsers> = await axios.get(`${process.env.REACT_APP_URL}/user/users_by_name/${name}/${page.toFixed(0)}/${perPage.toFixed(0)}`);
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "User Error",
        message: error.response?.data.message ?? "Erro ao obter os dados do usuário",
      };
    } else {
      throw error;
    }
  }
};

const login = async (email: string, password: string): Promise<{ token: string; } | RequestError> => {
  try {
    const data: AxiosResponse<{ token: string; }> = await axios.post(
      `${process.env.REACT_APP_URL}/user/login`,
      {
        'email': email,
        'password': password,
      },
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Login Error",
        message: error.response?.data.message ?? "Erro ao relaizar o login",
      };
    } else {
      throw error;
    }
  }
};

const logout = async (): Promise<{ ok: boolean; } | RequestError> => {
  try {
    const data: AxiosResponse<{ ok: boolean; }> = await axios.get(`${process.env.REACT_APP_URL}/user/logout`);
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Login Error",
        message: error.response?.data.message ?? "Erro ao relaizar o login",
      };
    } else {
      throw error;
    }
  }
};

const addUser = async (newUser: NewUser): Promise<{ user: string; } | RequestError> => {
  try {
    const data: AxiosResponse<{ user: string; }> = await axios.post(
      `${process.env.REACT_APP_URL}/user/add_user`,
      {
        'nome': newUser.nome,
        'email': newUser.email,
        'password': newUser.password,
        'empresa_id': newUser.empresa?.id,
      },
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Add User Error",
        message: error.response?.data.message ?? "Erro ao adicionar o novo usuário",
      };
    } else {
      throw error;
    }
  }
};

const changePassw = async (oldPass: string, newPass: string): Promise<{ ok: boolean; } | RequestError> => {
  try {
    const data: AxiosResponse<{ ok: boolean; }> = await axios.post(
      `${process.env.REACT_APP_URL}/user/change_password`,
      {
        'oldPass': oldPass,
        'newPass': newPass,
      },
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "User Error",
        message: error.response?.data.message ?? "Erro ao alterar a senha do usuário",
      };
    } else {
      throw error;
    }
  }
};

export interface Funcionario extends User {
  status: boolean;
}

const getFuncionarios = async (idBarragem: number, page: number, perPage: number): Promise<Funcionario[] | RequestError> => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_URL}/user/list_my_users/${idBarragem}/${page}/${perPage}`);
    return res.data.items;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.message ?? "Erro ao buscar funcionários",
      };
    }
    throw error;
  }
};

async function remove(id: string): Promise<true | RequestError> {
  try {
    await axios.delete(`${process.env.REACT_APP_URL}/user/delete_user/${id}`);
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.message ?? "Erro ao excluir funcionário",
      };
    }
    throw error;
  }
}

async function update(id: string, data: Partial<Funcionario>): Promise<Funcionario | RequestError> {
  try {
    const res = await axios.put(`${process.env.REACT_APP_URL}/user/update_user/${id}`, data);
    return res.data.user;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: "Erro ao atualizar usuário",
        message: error?.response?.data?.message || error.message,
      };
    }
    throw error;
  }
}

export interface CreateUserPayload {
  nome: string;
  email: string;
  setor?: string;
  funcao?: string;
  telefones?: string;
  admin: boolean;
  empreedimento: string;
}
async function create(data: CreateUserPayload): Promise<string | RequestError> {
  try {
    const res = await axios.post(`${process.env.REACT_APP_URL}/user/add_user`, data);
    return res.data.user;
  } catch(error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.message ?? "Erro ao cadastrar funcionário",
      };
    }
    throw error;
  }
}


export const ApiUser = {
  getUser: getUser,
  getByName: getByName,
  getUserById: getUserById,
  getAll: getAll,
  login: login,
  logout: logout,
  addUser: addUser,
  changePassw: changePassw,
  getFuncionarios: getFuncionarios,
  remove: remove,
  update: update,
  create: create,
};