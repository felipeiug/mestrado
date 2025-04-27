import axios, { AxiosResponse, isAxiosError } from "axios";
import { BarragemCardData } from "../../components";
import { BarragemData, GeometryBarragem } from "../../context";
import { RequestError } from "./api";
import { Seminario } from "./seminarios";
import { Simulado } from "./simulados";
import { Treinamento } from "./treinamentos";
import { SegurancaBarragem } from "./segBarragem";

const addGeometry = async (
  barragem: number,
  lat: number,
  lon: number
): Promise<GeometryBarragem | RequestError> => {
  try {
    const data: AxiosResponse<GeometryBarragem> = await axios.post(
      `${process.env.REACT_APP_URL}/barragens/geometries/id/${barragem}`,
      { lat: lat, lon: lon }
    );
    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Geometry Error",
        message: error.response?.data.message ?? "Erro ao adicionar geometria",
      };
    } else {
      throw error;
    }
  }
};

const removeGeometry = async (
  geomId: number
): Promise<GeometryBarragem | RequestError> => {
  try {
    const data: AxiosResponse<GeometryBarragem> = await axios.delete(
      `${process.env.REACT_APP_URL}/barragens/geometries/id/${geomId}`
    );
    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Geometry Error",
        message: error.response?.data.message ?? "Erro ao excluir geometria",
      };
    } else {
      throw error;
    }
  }
};

const updateGeometry = async (
  geomData: GeometryBarragem
): Promise<GeometryBarragem | RequestError> => {
  try {
    const data: AxiosResponse<GeometryBarragem> = await axios.put(
      `${process.env.REACT_APP_URL}/barragens/geometries/id/${geomData.id}`,
      geomData
    );
    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Geometry Error",
        message: error.response?.data.message ?? "Erro ao atualizar geometria",
      };
    } else {
      throw error;
    }
  }
};

const updateBarragem = async (
  id: number,
  nome: string,
  lat: number,
  lon: number
): Promise<BarragemData | RequestError> => {
  try {
    const data: AxiosResponse<BarragemData> = await axios.put(
      `${process.env.REACT_APP_URL}/barragens/id/${id}`,
      {
        id: id,
        lat: lat,
        lon: lon,
        nome: nome,
      }
    );
    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message: error.response?.data.message ?? "Erro ao atualizar barragem",
      };
    } else {
      throw error;
    }
  }
};

const getBarragens = async (): Promise<BarragemData[] | RequestError> => {
  try {
    const barragemData: AxiosResponse<BarragemData[]> = await axios.get(
      `${process.env.REACT_APP_URL}/barragens`
    );

    const dados = barragemData.data.map(processBarragem);
    return dados;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message:
          error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

const getBarragemById = async (
  barragem: number
): Promise<BarragemData | RequestError> => {
  try {
    const barragemData: AxiosResponse<BarragemData> = await axios.get(
      `${process.env.REACT_APP_URL}/barragens/id/${barragem}`
    );
    return processBarragem(barragemData.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message:
          error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

const getBarragemCard = async (
  barragem: number
): Promise<BarragemCardData | RequestError> => {
  try {
    const barragemData: AxiosResponse<BarragemCardData> = await axios.get(
      `${process.env.REACT_APP_URL}/barragens/card/${barragem}`
    );
    barragemData.data.images = barragemData.data.images.map(
      (image) => `${process.env.REACT_APP_URL}/files/${image}`
    );
    return barragemData.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message:
          error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

const updateRecMatLogisticos = async (id: number, text: string): Promise<BarragemData | RequestError> => {
  try {
    const data: AxiosResponse<BarragemData> = await axios.put(
      `${process.env.REACT_APP_URL}/barragens/rec_mat_logisticos/${id}`,
      { markdown: text }
    );
    return processBarragem(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message: error.response?.data.message ?? "Erro ao atualizar os Recursos Materiais e Logísticos",
      };
    } else {
      throw error;
    }
  }
};

const updateDescricao = async (id: number, text: string): Promise<BarragemData | RequestError> => {
  try {
    const data: AxiosResponse<BarragemData> = await axios.put(
      `${process.env.REACT_APP_URL}/barragens/descricao/${id}`,
      { markdown: text }
    );
    return processBarragem(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message: error.response?.data.message ?? "Erro ao atualizar a Descrição da Barragem",
      };
    } else {
      throw error;
    }
  }
};

export interface DocRef {
  id: number;
  idBarragem: number;
  dado: string;
  documento: string;
  dataCadastro: Date;
  dataModificacao?: Date;
  idUpdate: string;
}
const updateBarragemDocRef = async (barragemId: number, docs: DocRef[]): Promise<DocRef[] | RequestError> => {
  try {
    const data: AxiosResponse<DocRef[]> = await axios.put(
      `${process.env.REACT_APP_URL}/barragens/docRef/${barragemId}`,
      docs,
    );

    const dados = data.data.map((val) => {
      val.dataCadastro = new Date(val.dataCadastro);
      if (val.dataModificacao) {
        val.dataModificacao = new Date(val.dataModificacao);
      }
      return val;
    });
    return dados;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message:
          error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

const getBarragemDocRef = async (barragemId: number): Promise<DocRef[] | RequestError> => {
  try {
    const data: AxiosResponse<DocRef[]> = await axios.get(
      `${process.env.REACT_APP_URL}/barragens/docRef/${barragemId}`
    );

    const dados = data.data.map((val) => {
      val.dataCadastro = new Date(val.dataCadastro);
      if (val.dataModificacao) {
        val.dataModificacao = new Date(val.dataModificacao);
      }
      return val;
    });
    return dados;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Barragem Error",
        message:
          error.response?.data.message ?? "Erro ao obter dados da barragem",
      };
    } else {
      throw error;
    }
  }
};

export interface EventoBarragem {
  tipo: "seminario" | "simulado" | "treinamento" | "segurancaBarragem";
  evento: Seminario | Simulado | Treinamento | SegurancaBarragem;
}
const getEventos = async (barragemId: number, startDate: Date, endDate: Date): Promise<EventoBarragem[] | RequestError> => {
  try {
    const data: AxiosResponse<EventoBarragem[]> = await axios.get(
      `${process.env.REACT_APP_URL}/barragens/events/${barragemId}`,
      {
        params: {
          start: `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toSignificantDigits("mes")}-${(startDate.getDate()).toSignificantDigits("dia")}`,
          end: `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toSignificantDigits("mes")}-${(endDate.getDate()).toSignificantDigits("dia")}`,
        },
      }
    );

    const dados = data.data.map((val) => {
      return {
        tipo: val.tipo,
        evento: processData(val.evento),
      };
    });
    return dados;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Eventos Error",
        message: error.response?.data.message ?? "Erro ao obter eventos para a barragem",
      };
    } else {
      throw error;
    }
  }
};

// Processar dados da barragem
const processBarragem = (dados: BarragemData): BarragemData => {
  const images = dados.images.map(
    (image: string) => `${process.env.REACT_APP_URL}/files/${image}`
  );
  const dataCadastro = new Date(dados.dataCadastro);
  let dataModificacao = undefined;
  if (dados.dataModificacao) {
    dataModificacao = new Date(dados.dataModificacao);
  }

  return {
    ...dados,
    dataCadastro: dataCadastro,
    dataModificacao: dataModificacao,
    images,
  } as BarragemData;
};

// Processar os eventos da barrgems
function processData(value: Simulado | Treinamento | Seminario | SegurancaBarragem) {
  value.data = new Date(value.data);
  value.dataCadastro = new Date(value.dataCadastro);
  value.dataModificacao &&= new Date(value.dataCadastro);
  value.file &&= `${process.env.REACT_APP_URL}/${value.file}`;
  if (value.anterior) {
    value.anterior.data = new Date(value.anterior.data);
    value.anterior.dataCadastro = new Date(value.anterior.dataCadastro);
    value.anterior.dataModificacao &&= new Date(value.anterior.dataCadastro);
    value.anterior.file &&= `${process.env.REACT_APP_URL}/${value.anterior.file}`;
  }

  return value;
}

export const ApiBarragem = {
  getEventos,
  addGeometry,
  getBarragens,
  updateBarragem,
  updateGeometry,
  removeGeometry,
  getBarragemById,
  getBarragemCard,
  updateDescricao,
  getBarragemDocRef,
  updateBarragemDocRef,
  updateRecMatLogisticos,
};
