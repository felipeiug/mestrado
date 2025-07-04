import { ApiLayers } from "./layers";
import { ApiLogin } from "./login";
import { ApiProjects } from "./projects";
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
  layers: typeof ApiLayers;
  projects: typeof ApiProjects;
  baseUrl: string;
}

// Dados da API
export function useApi(): ApiSchema {
  return {
    user: ApiUser,
    login: ApiLogin,
    university: ApiUniversity,
    layers: ApiLayers,
    projects: ApiProjects,
    baseUrl: `${import.meta.env.REACT_APP_URL}`,
  };
}
