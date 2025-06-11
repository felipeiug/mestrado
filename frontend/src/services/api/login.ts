import axios, { AxiosResponse, isAxiosError } from "axios";
import { MyError, User } from "../../context";

const url = `${import.meta.env.VITE_URL}/login`;

const login = async (email: string, password: string): Promise<{ token: string; token_type: string; } | MyError> => {
  try {
    const data: AxiosResponse<{ token: string; token_type: string; }> = await axios.post(
      `${url}`,
      {
        'email': email,
        'password': password,
      },
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.detail ?? "Erro ao relaizar o login",
      };
    } else {
      throw error;
    }
  }
};

const logout = async (): Promise<{ ok: boolean; } | MyError> => {
  try {
    const data: AxiosResponse<{ ok: boolean; }> = await axios.get(`${url}/logout`);
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.detail ?? "Erro ao realizar logout",
      };
    } else {
      throw error;
    }
  }
};

const sendResetCode = async (email: string): Promise<{ ok: boolean; } | MyError> => {
  try {
    const data: AxiosResponse<{ ok: boolean; }> = await axios.post(
      `${url}/send_reset_code`,
      { 'email': email },
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.detail ?? "Erro ao enviar código para resetar a senha",
      };
    } else {
      throw error;
    }
  }
};

const changePassw = async (password: string, token: string): Promise<{ token: string; token_type: string; } | MyError> => {
  try {
    const data: AxiosResponse<{ token: string; token_type: string; }> = await axios.post(
      `${url}/change_password`,
      {
        'token': token,
        'password': password,
      },
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.detail ?? "Erro ao alterar a senha do usuário",
      };
    } else {
      throw error;
    }
  }
};

export interface UserWithPasswords extends User {
  password: string;
  confirmPassword?: string;
}
const newUser = async (user: UserWithPasswords): Promise<{ token: string; token_type: string; } | MyError> => {
  try {
    const data: AxiosResponse<{ token: string; token_type: string; }> = await axios.post(
      `${url}/new`,
      user,
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.detail ?? "Erro ao adicionar usuário",
      };
    } else {
      throw error;
    }
  }
};

export const ApiLogin = {
  login,
  logout,
  newUser,
  changePassw,
  sendResetCode,
};