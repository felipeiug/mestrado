import axios, { isAxiosError } from "axios";
import { MyError } from "../../context";
import { LayerBase } from "../../core";

const url = `${import.meta.env.VITE_URL}/layers`

const getLayers = async (): Promise<LayerBase[] | MyError> => {
  try {
    const data = await axios.get<any[]>(`${url}/list`);
    return data.data.map(processData);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Layers Error",
        message: error.response?.data.message ?? "Erro ao obter as layers",
      };
    } else {
      throw error;
    }
  }
};

function processData(value: any): LayerBase {
  if (value.name === "Linear") {
    return {
      ...value,
      validateShape: (shape) => {
        if (shape.length !== 1) return false;
        return true;
      }
    };
  }
  return value;
}

export const ApiLayers = {
  getLayers,
};