import { ApiLogin } from "./login";
import { ApiUniversity } from "./universidade";
import { ApiUser } from "./user";

export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

// Schemas
export interface ApiSchema {
  user: typeof ApiUser;
  login: typeof ApiLogin;
  university: typeof ApiUniversity;
  baseUrl: string;
}

// Dados da API
export function useApi(): ApiSchema {
  return {
    user: ApiUser,
    login: ApiLogin,
    university: ApiUniversity,
    baseUrl: `${import.meta.env.REACT_APP_URL}`,
  };
}
