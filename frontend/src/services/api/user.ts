import axios, { AxiosResponse, isAxiosError } from "axios";
import { MyError, User } from "../../context";


const getUser = async (): Promise<User | MyError> => {
  try {
    const data = await axios.get<User>(`${import.meta.env.VITE_URL}/user`);
    return processUser(data.data);

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "User Error",
        message: error.response?.data.detail ?? "Erro ao obter os dados do usuário",
      };
    } else {
      throw error;
    }
  }
};

const getUserById = async (id: string): Promise<User | MyError> => {
  try {
    const data = await axios.get<User>(`${import.meta.env.VITE_URL}/user/${id}`);
    return processUser(data.data);

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
  items: User[]; // Id dos usuários
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
const getAll = async (page: number, perPage: number): Promise<AllUsers | MyError> => {
  try {
    const data: AxiosResponse<AllUsers> = await axios.get(`${import.meta.env.VITE_URL}/user/all/${page.toFixed(0)}/${perPage.toFixed(0)}`);
    data.data.items = data.data.items.map(processUser);
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

const getByName = async (name: string, page: number, perPage: number): Promise<AllUsers | MyError> => {
  try {
    const data: AxiosResponse<AllUsers> = await axios.get(`${import.meta.env.VITE_URL}/user/all_name/${name}/${page.toFixed(0)}/${perPage.toFixed(0)}`);
    data.data.items = data.data.items.map(processUser);
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

async function update(user: User): Promise<User | MyError> {
  try {
    const data = await axios.put<User>(`${import.meta.env.VITE_URL}/user`, user);
    return processUser(data.data);
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


function processUser(user: User) {

  user.insertDate = new Date(user.insertDate);
  if (user.lastLogin) user.lastLogin = new Date(user.lastLogin);
  if (user.updateDate) user.updateDate = new Date(user.updateDate);

  return user;
}

export const ApiUser = {
  update,
  getAll,
  getUser,
  getByName,
  getUserById,
};