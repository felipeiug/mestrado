import axios, { AxiosResponse, isAxiosError } from "axios";
import { ItemSumario } from "../../components";
import { RequestError } from "./api";

interface PropsGet {
  dados_sec: ItemSumario;
  URL_BI?: string;
}
const getEditSection = async (barragem:number, sec: string): Promise<PropsGet|RequestError> => {
  try {
    const data:AxiosResponse<PropsGet> = await axios.get(`${process.env.REACT_APP_URL}/edit/${barragem}/${sec}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Section Error",
        message: error.response?.data.message ?? "Erro ao obter seção",
      };
    } else {
      throw error;
    }
  }
};

const postEditSection = async (company:string, barragem:number, sec: string, data: ItemSumario, urlBI?:string): Promise<{ok:boolean;}|RequestError> => {
  try {
    await axios.post(
      `${process.env.REACT_APP_URL}/edit/${company}/${barragem}/${sec}`,
      {
        "dados_sec": data,
        "URL_BI": urlBI,
      }
    );
    return {ok:true};
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Section Error",
        message: error.response?.data.message ?? "Erro ao atualizr seção",
      };
    } else {
      throw error;
    }
  }
};

export const ApiSection = {
  getEditSection: getEditSection,
  postEditSection: postEditSection,
};