import axios, { AxiosResponse, isAxiosError } from "axios";
import { ZAS } from "../../context";
import { RequestError } from "./api";
import {
  AreaSirene,
  PaintMarker,
  PolyZas,
  PolyZasData,
  PolyZss,
  PontoEncontro,
  PontoEncontroData,
  RotaAlternativa,
  RotaFuga,
  Sirene,
  SireneData,
  UnidadeSensivel,
} from "../../components";
import {
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
} from "geojson";
import { Theme } from "@mui/material";
import { LatLng, LatLngExpression } from "leaflet";
import { Cadastro, CadastroData } from "../../components/zas/cadastro";

const updateZas = async (id: number, zas: ZAS): Promise<ZAS | RequestError> => {
  try {
    const zasUpdate = {
      ...zas,
      polygon: (!zas.polygon || "error" in zas.polygon) ? undefined : zas.polygon.toGeoJSON().geometry,
      polygonZss: (!zas.polygonZss || "error" in zas.polygonZss) ? undefined : zas.polygonZss.toGeoJSON().geometry,
      sirenes: (!zas.sirenes || "error" in zas.sirenes) ? undefined : zas.sirenes.map((a) => {
        return { ...a.properties, areaCobertura: a.properties.areaCobertura?.toGeoJSON().geometry };
      }),
      cadastros: (!zas.cadastros || "error" in zas.cadastros) ? undefined : zas.cadastros.map(a => a.properties),
      pontosEncontro: (!zas.pontosEncontro || "error" in zas.pontosEncontro) ? undefined : zas.pontosEncontro.map(a => a.properties),
      uniSensivel: (!zas.uniSensivel || "error" in zas.uniSensivel) ? undefined : zas.uniSensivel.map(a => a.properties),
      rotasFuga: (!zas.rotasFuga || "error" in zas.rotasFuga) ? undefined : zas.rotasFuga.map((a) => { return { ...a.properties, geometry: a.toGeoJSON().geometry }; }),
      rotasAlternativas: (!zas.rotasAlternativas || "error" in zas.rotasAlternativas) ? undefined : zas.rotasAlternativas.map((a) => { return { ...a.properties, geometry: a.toGeoJSON().geometry }; }),
    };

    const data: AxiosResponse<ZAS> = await axios.put(
      `${process.env.REACT_APP_URL}/zas/${id}`,
      zasUpdate,
    );
    return processZAS(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "ZAS Error",
        message: error.response?.data.message ?? "Erro ao atualizar dados da ZAS",
      };
    } else {
      throw error;
    }
  }
};

const getZAS = async (id: number): Promise<ZAS | RequestError> => {
  try {
    const data: AxiosResponse<ZAS> = await axios.get(
      `${process.env.REACT_APP_URL}/zas/${id}`
    );
    return processZAS(data.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "ZAS Error",
        message: error.response?.data.message ?? "Erro ao obter dados da ZAS",
      };
    } else {
      throw error;
    }
  }
};

const getRotasFuga = async (
  id: number,
  theme?: Theme
): Promise<RotaFuga[] | RequestError> => {
  try {
    const data: AxiosResponse<
      {
        id: number;
        idZas: number;
        nome: string;
        tempoSaida: number;
        tempoChegada: number;
        nivelValidade: number;
        comprimento?: number;
        obs?: string;
        idUpdate?: string;
        dataCadastro: string | number;
        dataModificacao?: string | number;
        geometry?: LineString | MultiLineString;
      }[]
    > = await axios.get(`${process.env.REACT_APP_URL}/zas/${id}/rotas_fuga`);

    const rotas: RotaFuga[] = [];
    for (const feature of data.data) {
      if (!feature.geometry) continue;
      const { geometry, dataCadastro, dataModificacao, idUpdate, ...data } =
        feature;

      const _dataCadastro = new Date(dataCadastro);
      let _dataModificacao: Date | undefined = undefined;
      if (dataModificacao) {
        _dataModificacao = new Date(dataModificacao);
      }

      rotas.push(
        new RotaFuga(
          geometry,
          {
            ...data,
            dataCadastro: _dataCadastro,
            dataModificacao: _dataModificacao,
            idModificou: idUpdate,
          },
          theme?.palette.geometries.rotaFuga
        )
      );
    }

    return rotas;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "ZAS Error",
        message: error.response?.data.message ?? "Erro ao obter dados da ZAS",
      };
    } else {
      throw error;
    }
  }
};

const getRotasAlternativas = async (
  id: number,
  theme?: Theme
): Promise<RotaAlternativa[] | RequestError> => {
  try {
    const data: AxiosResponse<
      {
        id: number;
        idZas: number;
        nome: string;
        distanciaPercorrida: number;
        tempoDeslocamento: number;
        geometry?: LineString | MultiLineString;
      }[]
    > = await axios.get(`${process.env.REACT_APP_URL}/zas/${id}/rotas_alternativas`);

    const rotas: RotaAlternativa[] = [];
    for (const feature of data.data) {
      if (!feature.geometry) continue;
      const { geometry, ...data } = feature;
      rotas.push(
        new RotaAlternativa(
          geometry,
          data,
          theme?.palette.geometries.rotaAlternativa
        )
      );
    }

    return rotas;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Rotas Alternativas Error",
        message: error.response?.data.message ?? "Erro ao obter rotas alternativas",
      };
    } else {
      throw error;
    }
  }
};

const getSirenes = async (
  id: number,
  theme?: Theme
): Promise<Sirene[] | RequestError> => {
  try {
    const data: AxiosResponse<
      {
        id: number;
        idZas: number;
        lat: number;
        lon: number;
        dataInstalacao?: string | number;
        municipio: number;
        idUpdate?: string;
        dataCadastro: number | string;
        dataModificacao?: number | string;
        areaCobertura?: Polygon | MultiPolygon;
      }[]
    > = await axios.get(`${process.env.REACT_APP_URL}/zas/${id}/sirenes`);

    const sirenes: Sirene[] = [];
    for (const feature of data.data) {
      const {
        lat,
        lon,
        areaCobertura,
        dataInstalacao,
        dataCadastro,
        dataModificacao,
        idUpdate,
        ...data
      } = feature;

      const _dataCadastro = new Date(dataCadastro);
      let _dataInstalacao: Date | undefined = undefined;
      if (dataInstalacao) _dataInstalacao = new Date(dataInstalacao);

      let _dataModificacao: Date | undefined = undefined;
      if (dataModificacao) _dataModificacao = new Date(dataModificacao);

      let area: AreaSirene | undefined;
      if (areaCobertura) {
        const convertCoords = (coords: number[]): LatLngExpression => [
          coords[1], // lat
          coords[0]  // lng
        ];

        let leafletCoords: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];

        if (areaCobertura.type === "Polygon") {
          leafletCoords = (areaCobertura.coordinates as number[][][]).map((ring) =>
            ring.map(convertCoords)
          );
        } else {
          leafletCoords = (areaCobertura.coordinates as number[][][][]).map((polygon) =>
            polygon.map((ring) => ring.map(convertCoords))
          );
        }

        area = !areaCobertura ? undefined : new AreaSirene(
          leafletCoords,
          theme?.palette.geometries.areaCoberturaSirene
        );
      }

      sirenes.push(
        new Sirene(
          new LatLng(lat, lon),
          {
            ...data,
            dataInstalacao: _dataInstalacao,
            dataCadastro: _dataCadastro,
            dataModificacao: _dataModificacao,
            idUpdate: idUpdate,
            areaCobertura: area,
          } as SireneData,
          theme?.palette.geometries.sirenes,
        )
      );
    }

    return sirenes;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Sirenes Error",
        message: error.response?.data.message ?? "Erro ao obter dados das sirenes",
      };
    } else {
      throw error;
    }
  }
};

const getCadastros = async (id: number): Promise<Cadastro[] | RequestError> => {
  try {
    const data: AxiosResponse<CadastroData[]> = await axios.get(`${process.env.REACT_APP_URL}/zas/${id}/cadastros`);

    const cadastros: Cadastro[] = [];
    for (const feature of data.data) {
      feature.icon = `${process.env.REACT_APP_URL}/files/icons_cadastro/${feature.icon}.png`;
      cadastros.push(new Cadastro(feature, {}));
    }

    return cadastros;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "cadastros Error",
        message: error.response?.data.message ?? "Erro ao obter os cadastros",
      };
    } else {
      throw error;
    }
  }
};

const getCadastroIcons = async (): Promise<{ [key: string]: string; } | RequestError> => {
  try {
    const data: AxiosResponse<{ [key: string]: string; }> = await axios.get(`${process.env.REACT_APP_URL}/zas/cadastro_icons`);

    const dataReturn: { [key: string]: string; } = {};
    for (const icon in data.data) {
      dataReturn[icon] = `${process.env.REACT_APP_URL}/files/${data.data[icon]}`;
    }
    return dataReturn;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Cadastro Error",
        message: error.response?.data.message ?? "Erro ao obter os icones dos cadastros",
      };
    } else {
      throw error;
    }
  }
};

const getPolyZas = async (
  id: number,
  theme?: Theme
): Promise<PolyZas | RequestError> => {
  try {
    const data: AxiosResponse<Polygon, PolyZasData> =
      await axios.get(`${process.env.REACT_APP_URL}/zas/${id}/poly_zas`);

    return new PolyZas(
      data.data.coordinates.map((coords) =>
        coords.map((coord) => [coord[1], coord[0]])
      ) as LatLngExpression[][],
      {},
      theme?.palette.geometries.polyZas
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "ZAS Error",
        message: error.response?.data.message ?? "Erro ao obter dados da ZAS",
      };
    } else {
      throw error;
    }
  }
};

const getPolyZss = async (
  id: number,
  theme?: Theme
): Promise<PolyZss | RequestError> => {
  try {
    const data: AxiosResponse<Polygon | MultiPolygon> = await axios.get(`${process.env.REACT_APP_URL}/zas/${id}/poly_zss`);

    let geoms: [number, number][][] | [number, number][][][] = [];
    if (data.data.type === "Polygon") {
      geoms = data.data.coordinates.map((coords) =>
        coords.map((coord) => {
          return [coord[1], coord[0]];
        })
      );
    } else {
      geoms = data.data.coordinates.map((coordsEnvelope) =>
        coordsEnvelope.map((coords) =>
          coords.map((coord) => [coord[1], coord[0]] as [number, number])
        )
      );
    }

    return new PolyZss(
      geoms,
      {},
      theme?.palette.geometries.polyZss
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "ZAS Error",
        message: error.response?.data.message ?? "Erro ao obter dados da ZAS",
      };
    } else {
      throw error;
    }
  }
};

const getPontosEncontro = async (
  id: number,
  theme?: Theme
): Promise<PontoEncontro[] | RequestError> => {
  try {
    const data: AxiosResponse<PontoEncontroData[]> = await axios.get(
      `${process.env.REACT_APP_URL}/zas/${id}/pontos_encontro`
    );

    const dados = data.data.map((ponto) => {
      ponto.dataCadastro = new Date(ponto.dataCadastro);
      if (ponto.dataModificacao)
        ponto.dataModificacao = new Date(ponto.dataModificacao);
      return ponto;
    });

    return dados.map(
      (propertie) =>
        new PontoEncontro(
          propertie,
          theme?.palette.geometries.pontoEncontro ?? {}
        )
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "ZAS Error",
        message:
          error.response?.data.message ?? "Erro ao obter pontos de encontro",
      };
    } else {
      throw error;
    }
  }
};

const getUniSensivel = async (
  id: number,
  theme?: Theme
): Promise<UnidadeSensivel[] | RequestError> => {
  try {
    const data: AxiosResponse<
      {
        id: number;
        idZas: number;
        nome: string;
        lat: number;
        lng: number;
        dataCadastro: number | string;
        dataModificacao?: number | string;
        alt?: number;
        style?: PaintMarker;
      }[]
    > = await axios.get(
      `${process.env.REACT_APP_URL}/zas/${id}/unidades_sensiveis`
    );

    const dados = data.data.map(
      (unidade) =>
        new UnidadeSensivel(new LatLng(unidade.lat, unidade.lng, unidade.alt), {
          id: unidade.id,
          lat: unidade.lat,
          lon: unidade.lng,
          alt: unidade.alt,
          nome: unidade.nome,
          style: unidade.style ?? theme?.palette.geometries.uniSensivel ?? {},
          dataCadastro: new Date(unidade.dataCadastro),
          dataModificacao: unidade.dataModificacao
            ? new Date(unidade.dataModificacao)
            : undefined,
        })
    );

    return dados;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "ZAS Error",
        message:
          error.response?.data.message ?? "Erro ao obter unidades sensíveis",
      };
    } else {
      throw error;
    }
  }
};

// Processar dados da ZAS
const processZAS = (dados: ZAS): ZAS => {
  const dataCadastro = new Date(dados.dataCadastro);
  let dataModificacao = undefined;
  if (dados.dataModificacao) {
    dataModificacao = new Date(dados.dataModificacao);
  }

  return {
    ...dados,
    dataCadastro: dataCadastro,
    dataModificacao: dataModificacao,
  } as ZAS;
};

export const ApiZAS = {
  getZAS: getZAS,
  updateZas: updateZas,
  getSirenes: getSirenes,
  getCadastros: getCadastros,
  getCadastroIcons: getCadastroIcons,
  getRotasAlternativas: getRotasAlternativas,
  getRotasFuga: getRotasFuga,
  getPolyZas: getPolyZas,
  getPolyZss: getPolyZss,
  getPontosEncontro: getPontosEncontro,
  getUniSensivel: getUniSensivel,
};
