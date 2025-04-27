import axios, { AxiosResponse, isAxiosError } from "axios";
import { CompanyData } from "../../pages";
import { RequestError } from "./api";

interface AllCompanies {
  items: string[]; // Ids dos empreendimentos
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
const getAll = async (name: string, page: number, perPage: number): Promise<AllCompanies | RequestError> => {
  try {
    const data: AxiosResponse<AllCompanies> = await axios.get(`${process.env.REACT_APP_URL}/company/${name}/${page.toFixed(0)}/${perPage.toFixed(0)}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Company Error",
        message: error.response?.data.message ?? "Erro ao obter dados do empreendimento",
      };
    } else {
      throw error;
    }
  }
};

const company = async (id: string): Promise<CompanyData | RequestError> => {
  try {
    const data: AxiosResponse<CompanyData> = await axios.get(`${process.env.REACT_APP_URL}/company/${id}`);
    data.data.logo = `${process.env.REACT_APP_URL}/files/${data.data.logo}`;
    data.data.banner = `${process.env.REACT_APP_URL}/files/${data.data.banner}`;
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Company Error",
        message: error.response?.data.message ?? "Erro ao obter dados do empreendimento",
      };
    } else {
      throw error;
    }
  }
};

export interface EditCompany {
  nome: string;
  descricao: string;
  logo: File | null;
  banner: File | null;
}

const updateCompany = async (id: string, data: EditCompany): Promise<AxiosResponse | RequestError> => {
  const formData = new FormData();
  formData.append("nome", data.nome);
  formData.append("descricao", data.descricao);
  if (data.logo) formData.append("logo", data.logo);
  if (data.banner) formData.append("banner", data.banner);
  
  try {
    const response = await axios.put(`${process.env.REACT_APP_URL}/company/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Company Error",
        message: error.response?.data?.message || "Erro ao atualizar empreendimento",
      };
    }
    else {
      throw error;
    }
  }
};

export const ApiCompany = {
  company: company,
  getAll: getAll,
  updateCompany: updateCompany,
};