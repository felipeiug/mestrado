import axios, { AxiosResponse, isAxiosError } from "axios";
import { BarragemCardData } from "../../components";
import { BarragemData } from "../../context";
import { Paginated, RequestError } from "./api";
import { Estado, Municipio } from "../../components/estadoMunicipio";

const url = `${process.env.REACT_APP_URL}/estadoMun`;

const getMunicipio = async (id: number): Promise<Municipio | RequestError> => {
  try {
    const dados: AxiosResponse = await axios.get(url + `/municipio/${id}`);
    return processMunicipio(dados.data);
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Municipio Error",
        message: error.response?.data.message ?? "Erro ao obter municipio",
      };
    } else {
      throw error;
    }
  }
};

const getMunicipios = async (page: number, perPage: number, name?: string, estado?: number): Promise<Paginated<Municipio> | RequestError> => {
  const sufix: string[] = [];
  if (name) sufix.push(`name=${name}`);
  if (estado) sufix.push(`estado=${estado.toString()}`);

  let sufixStr = "";
  if (sufix.length > 0) sufixStr = "?" + sufix.join("&");

  try {
    const dados: AxiosResponse<Paginated<Municipio>> = await axios.get(url + `/municipios/${page}/${perPage}` + sufixStr);
    dados.data.items = dados.data.items.map(processMunicipio);
    return dados.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Municipio Error",
        message: error.response?.data.message ?? "Erro ao obter municipios",
      };
    } else {
      throw error;
    }
  }
};

const getEstado = async (id: number): Promise<Estado | RequestError> => {
  try {
    const dados: AxiosResponse<Estado> = await axios.get(url + `/estado/${id}`);
    return dados.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Estado Error",
        message: error.response?.data.message ?? "Erro ao obter estado",
      };
    } else {
      throw error;
    }
  }
};

const getEstados = async (): Promise<Estado[] | RequestError> => {
  try {
    const dados: AxiosResponse<Estado[]> = await axios.get(url + `/estados`);
    return dados.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Estado Error",
        message: error.response?.data.message ?? "Erro ao obter estados",
      };
    } else {
      throw error;
    }
  }
};

function processMunicipio(mun: any) {
  if ("regiao-imediata" in mun) {
    if ("regiao-intermediaria" in mun["regiao-imediata"]) {
      mun["regiao-imediata"]['regiaoIntermediaria'] = mun["regiao-imediata"]['regiao-intermediaria'];
    }
    mun["regiaoImediata"] = mun["regiao-imediata"];
  }
  return mun as Municipio;
}


export const ApiEstadosMunicipios = {
  getMunicipios: getMunicipios,
  getMunicipio: getMunicipio,
  getEstados: getEstados,
  getEstado: getEstado,
};