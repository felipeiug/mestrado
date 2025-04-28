import axios, { AxiosResponse, isAxiosError } from "axios";
import { MyError } from "../../context";

const url = `${import.meta.env.VITE_URL}/university`;

const UNIVERSITYOPTIONS = {
  "626bbe13-1729-4854-ba91-35df34bd5d26": "Universidade Federal de Viçosa (UFV)",
  "11c0cf1f-6765-4498-80bc-456ab858b9ff": "Universidade de São Paulo (USP)",
  "626ace13-1729-4854-ba91-87df34bd5d26": "Universidade Federal da Bahia (UFBA)",
  "86357051-53a3-48f0-867d-64b9ea838360": "Universidade Federal do Paraná (UFPR)",
  "776c2ed9-5686-4a6e-ab0e-216ecb89228a": "Universidade Federal de Minas Gerais (UFMG)",
  "69197fb0-42a5-44b9-a0fe-09f9c38710cd": "Universidade Federal de São Carlos (UFSCar)",
  "c33e443a-f440-4b3e-b72a-37df2e65b818": "Universidade Federal de Santa Catarina (UFSC)",
  "f07ef8a4-40cb-4523-9b9c-cf6b5cab403c": "Universidade Federal do Rio de Janeiro (UFRJ)",
  "8cc8fb6e-a8c4-4845-81f6-a611b2f4017d": "Universidade Federal do Rio Grande do Sul (UFRGS)",
  "48c6d037-e078-4181-b17b-9eb83b992133": "Universidade Estadual Paulista (UNESP)",
  "55e38e59-8de7-456b-902b-7fcca023bcd2": "Universidade Estadual de Campinas (UNICAMP)",
};

const getAll = async (match: string): Promise<{ [key: string]: string; }> => {
  try {
    const data: AxiosResponse<{ [key: string]: string; }> = await axios.get(`${url}/${match}`);
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return UNIVERSITYOPTIONS;
    } else {
      throw error;
    }
  }
};

const addNew = async (name: string): Promise<string | MyError> => {
  try {
    const data: AxiosResponse<string> = await axios.post(`${url}`, { nome: name });
    return data.data;

  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Erro",
        message: error.response?.data.message ?? "Erro ao adicionar universidade",
      };
    } else {
      throw error;
    }
  }
};

export const ApiUniversity = {
  getAll,
  addNew,
};