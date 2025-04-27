import axios, { AxiosResponse, isAxiosError } from "axios";
import { RequestError } from "./api";

export interface ListShapes {
  files: { name: string; layers: string[] | null; }[];
}
const listShapes = async (barragem: number): Promise<ListShapes| RequestError> => {
  try {
    const data:AxiosResponse<ListShapes> = await axios.get(`${process.env.REACT_APP_URL}/files/shapes_from_dam/${barragem}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message: error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

const shapeData = async (barragem: number, filename: string, layer?: string): Promise<GeoJSON.FeatureCollection|RequestError> => {
  try {
    const data:AxiosResponse<GeoJSON.FeatureCollection> = await axios.get(`${process.env.REACT_APP_URL}/files/shape_from_dam/${barragem}/${filename}/${layer}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message: error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

const uploadShape = async (file: File, barragem: number): Promise<{ok:boolean;}|RequestError> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const data:AxiosResponse<{ok:boolean;}> = await axios.post(
      `${process.env.REACT_APP_URL}/files/send_shape/${barragem}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, },
    );
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message: error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

export const ApiDamFiles = {
  listShapes: listShapes,
  shapeData: shapeData,
  uploadShape: uploadShape,
};