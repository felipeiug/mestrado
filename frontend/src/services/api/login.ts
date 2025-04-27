import axios, { AxiosResponse, isAxiosError } from "axios";
import { MyError, User } from "../../context";

const url = `${import.meta.env.REACT_APP_URL}/login`;

const login = async (email: string, password: string): Promise<{ token: string; } | MyError> => {
  try {
    const data: AxiosResponse<{ token: string; }> = await axios.post(
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
        message: error.response?.data.message ?? "Erro ao relaizar o login",
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
        message: error.response?.data.message ?? "Erro ao realizar logout",
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
        message: error.response?.data.message ?? "Erro ao enviar código para resetar a senha",
      };
    } else {
      throw error;
    }
  }
};

const changePassw = async (oldPass: string, newPass: string, token: string): Promise<{ ok: boolean; } | MyError> => {
  try {
    const data: AxiosResponse<{ ok: boolean; }> = await axios.post(
      `${url}/change_password`,
      {
        'token': token,
        'old_pass': oldPass,
        'new_pass': newPass,
      },
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.message ?? "Erro ao alterar a senha do usuário",
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
const newUser = async (user: UserWithPasswords): Promise<{ ok: boolean; } | MyError> => {
  try {
    const data: AxiosResponse<{ ok: boolean; }> = await axios.post(
      `${url}/new`,
      user,
    );
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.message ?? "Erro ao adicionar usuário",
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