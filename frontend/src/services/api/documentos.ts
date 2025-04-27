import axios, { AxiosResponse, isAxiosError } from "axios";
import { DocType } from "./docType";
import { RequestError } from "./api";

const url = `${process.env.REACT_APP_URL}/documentos`;

type StateTypes = "pendent" | "waiting" | "finished";

export interface Documento {
  id: number;
  idContrato: number;
  documento: string;
  tipo: number;
  estado: StateTypes;
  responsavel: string;
  responsavelEmployer: string;
  responsavelBarragem: number;
  revisor: string;
  pendenciaLimit: Date;
  addBy: string;
  addOn: Date;
  file: string;
  message?: string;
}

export interface DocumentoWithTipo {
  id: number;
  idContrato: number;
  documento: string;
  tipo: DocType;
  estado: StateTypes;
  responsavel: string;
  responsavelEmployer: string;
  responsavelBarragem: number;
  revisor: string;
  pendenciaLimit: Date;
  addBy: string;
  addOn: Date;
  file: string;
  message?: string;
}

export interface Pendency {
  waitingEnvio: number;
  waitingReview: number;
  lessOneDay: number;
  lessOneWeek: number;
  missing: number;
}


interface DocumentoPaginated {
  items: number[]; // Id dos documentos
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

const getDocumentoById = async (id: number): Promise<Documento|RequestError> => {
  try {
    const data:AxiosResponse<Documento> = await axios.get(`${url}/${id}`);
    data.data.addOn = new Date(data.data.addOn);
    data.data.pendenciaLimit = new Date(data.data.pendenciaLimit);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getDocumentoByIdAndCompany = async (id: number, company: string): Promise<DocumentoWithTipo|RequestError> => {
  try {
    const data:AxiosResponse<DocumentoWithTipo> = await axios.get(`${url}/by_company/${id}/${company}`);
    data.data.addOn = new Date(data.data.addOn);
    data.data.pendenciaLimit = new Date(data.data.pendenciaLimit);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getDocumentosByCompanyAndEstado = async (barragemId: number, estado: StateTypes | 'all', page: number, perPage: number): Promise<DocumentoPaginated|RequestError> => {
  try {
    const data:AxiosResponse<DocumentoPaginated> = await axios.get(`${url}/by_company/${barragemId}/${estado}/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getCompanyPendency = async (barragemId: number): Promise<Pendency|RequestError> => {
  try {
    const data:AxiosResponse<Pendency> = await axios.get(`${url}/company_pendency/${barragemId}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getDocumentosByEstado = async (estado: StateTypes, page: number, perPage: number): Promise<DocumentoPaginated|RequestError> => {
  try {
    const data:AxiosResponse<DocumentoPaginated> = await axios.get(`${url}/${estado}/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getUserPendency = async (): Promise<Pendency|RequestError> => {
  try {
    const data:AxiosResponse<Pendency> = await axios.get(`${url}/user_pendency`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getAllDocumentos = async (page: number, perPage: number): Promise<DocumentoPaginated|RequestError> => {
  try {
    const data:AxiosResponse<DocumentoPaginated> = await axios.get(`${url}/all/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getDocumentosByContrato = async (idContrato: number, page: number, perPage: number): Promise<DocumentoPaginated|RequestError> => {
  try {
    const data:AxiosResponse<DocumentoPaginated> = await axios.get(`${url}/contrato/${idContrato}/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getDocumentosByRevisor = async (estado: StateTypes, page: number, perPage: number): Promise<DocumentoPaginated|RequestError> => {
  try {
    const data:AxiosResponse<DocumentoPaginated> = await axios.get(`${url}/revisor/${estado}/${page}/${perPage}`);
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const getDocumentoPath = async (id: number): Promise<{ file: string; }|RequestError> => {
  try {
    const data:AxiosResponse<{ file: string; }> = await axios.get(`${url}/file_by_id/${id}`);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
    
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};



const novoDocumento = async (newDoc: Documento, isEmployer: boolean): Promise<Documento|RequestError> => {
  try {
    const data:AxiosResponse<Documento> = await axios.post(
      `${url}/new`,
      {
        'id_contrato': newDoc.idContrato,
        'documento': newDoc.documento,
        'tipo': newDoc.tipo,
        'responsavel': !isEmployer ? newDoc.responsavel : undefined,
        'responsavel_employer': isEmployer ? newDoc.responsavelEmployer : undefined,
        'responsavel_barragem': isEmployer ? newDoc.responsavelBarragem : undefined,
        'revisor': newDoc.revisor,
        'pendencia_limit': newDoc.pendenciaLimit.toLocaleString(),
        'add_by': newDoc.addBy,
      },
    );
    data.data.addOn = new Date(data.data.addOn);
    data.data.pendenciaLimit = new Date(data.data.pendenciaLimit);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const uploadFile = async (id: number, file: File): Promise<Documento|RequestError> => {
  try {
    const data:AxiosResponse<Documento> = await axios.post(
      `${url}/upload`,
      {
        'file': file,
        'id': id,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    data.data.addOn = new Date(data.data.addOn);
    data.data.pendenciaLimit = new Date(data.data.pendenciaLimit);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const uploadFileCompany = async (id: number, idCompany: string, file: File, message?: string): Promise<Documento|RequestError> => {
  try {
    const data:AxiosResponse<Documento> = await axios.post(
      `${url}/uploadCompany/${idCompany}`,
      {
        'file': file,
        'id': id,
        'message': message,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    data.data.addOn = new Date(data.data.addOn);
    data.data.pendenciaLimit = new Date(data.data.pendenciaLimit);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};

const alterarEstado = async (id: number, estado: StateTypes, message?: string): Promise<Documento|RequestError> => {
  try {
    const data:AxiosResponse<Documento> = await axios.post(
      `${url}/set_state`,
      {
        'id': id,
        'state': estado,
        'message': message,
      },
    );
    data.data.addOn = new Date(data.data.addOn);
    data.data.pendenciaLimit = new Date(data.data.pendenciaLimit);
    data.data.file = `${process.env.REACT_APP_URL}/files/${data.data.file}`;
    return data.data;
  }
  catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Document Error",
        message: error.response?.data.message ?? "Erro ao obter dados do documento",
      };
    } else {
      throw error;
    }
  }
};


export const ApiDocumento = {
  getDocumentoById: getDocumentoById,
  getDocumentoByIdAndCompany: getDocumentoByIdAndCompany,
  getUserPendency: getUserPendency,
  getCompanyPendency: getCompanyPendency,
  getDocumentosByEstado: getDocumentosByEstado,
  getDocumentosByCompanyAndEstado: getDocumentosByCompanyAndEstado,
  getAllDocumentos: getAllDocumentos,
  getDocumentosByContrato: getDocumentosByContrato,
  getDocumentosByRevisor: getDocumentosByRevisor,
  getDocumentoPath: getDocumentoPath,
  novoDocumento: novoDocumento,
  uploadFile: uploadFile,
  uploadFileCompany: uploadFileCompany,
  alterarEstado: alterarEstado,
};