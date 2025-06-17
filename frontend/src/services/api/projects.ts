import axios, { isAxiosError } from "axios";
import { EdgeType, FlowType, MyError, NodeType, Project } from "../../context";



const getAllProjects = async (): Promise<Project[] | MyError> => {
  try {
    const { data } = await axios.get<Project[]>(`${import.meta.env.VITE_URL}/projects/all`);
    return data.map(processProject);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Project Error",
        message: error.response?.data.detail ?? "Erro ao obter os dados do projeto",
      };
    } else {
      throw error;
    }
  }
};

const getProject = async (id: number): Promise<Project | MyError> => {
  try {
    const { data } = await axios.get<Project>(`${import.meta.env.VITE_URL}/projects/${id}`);
    return processProject(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Project Error",
        message: error.response?.data.detail ?? "Erro ao obter o projeto",
      };
    } else {
      throw error;
    }
  }
};

const addProject = async (projectData: Project): Promise<Project | MyError> => {
  try {
    const { data } = await axios.post<Project>(`${import.meta.env.VITE_URL}/projects`, projectData);
    return processProject(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Project Error",
        message: error.response?.data.detail ?? "Erro ao criar o projeto",
      };
    } else {
      throw error;
    }
  }
};

const updateProject = async (projectData: Project): Promise<Project | MyError> => {
  try {
    const { data } = await axios.put<Project>(`${import.meta.env.VITE_URL}/projects`, projectData);
    return processProject(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Project Error",
        message: error.response?.data.detail ?? "Erro ao atualizar o projeto",
      };
    } else {
      throw error;
    }
  }
};

const deleteProject = async (id: number): Promise<Project | MyError> => {
  try {
    const { data } = await axios.delete<Project>(`${import.meta.env.VITE_URL}/projects/${id}`);
    return processProject(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Project Error",
        message: error.response?.data.detail ?? "Erro ao deletar o projeto",
      };
    } else {
      throw error;
    }
  }
};

// Flow
const updateFlow = async (flowData: FlowType): Promise<FlowType | MyError> => {
  try {
    const { data } = await axios.put<FlowType>(`${import.meta.env.VITE_URL}/projects/flow`, flowData);
    return processFlow(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Flow Error",
        message: error.response?.data.detail ?? "Erro ao atualizar o fluxograma",
      };
    } else {
      throw error;
    }
  }
};

// Nodes
const addNode = async (flowId: number, nodeData: NodeType): Promise<NodeType | MyError> => {
  try {
    const { data } = await axios.post<NodeType>(`${import.meta.env.VITE_URL}/projects/node/${flowId}`, nodeData);
    return processNode(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Node Error",
        message: error.response?.data.detail ?? "Erro ao adicionar o nó",
      };
    } else {
      throw error;
    }
  }
};

const updateNode = async (nodeId: number, nodeData: NodeType): Promise<NodeType | MyError> => {
  try {
    const { data } = await axios.put<NodeType>(
      `${import.meta.env.VITE_URL}/projects/node/${nodeId}`,
      nodeData
    );
    return processNode(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Node Error",
        message: error.response?.data.detail ?? "Erro ao atualizar o nó",
      };
    } else {
      throw error;
    }
  }
};

const deleteNode = async (nodeId: number): Promise<NodeType | MyError> => {
  try {
    const { data } = await axios.delete<NodeType>(
      `${import.meta.env.VITE_URL}/projects/node/${nodeId}`
    );
    return processNode(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Node Error",
        message: error.response?.data.detail ?? "Erro ao deletar o nó",
      };
    } else {
      throw error;
    }
  }
};

// Edges
const addEdge = async (flowId: number, edgeData: EdgeType): Promise<EdgeType | MyError> => {
  try {
    const { data } = await axios.post<EdgeType>(
      `${import.meta.env.VITE_URL}/projects/edge/${flowId}`,
      edgeData
    );
    return processEdge(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Edge Error",
        message: error.response?.data.detail ?? "Erro ao adicionar a conexão",
      };
    } else {
      throw error;
    }
  }
};

const updateEdge = async (edgeId: number, edgeData: EdgeType): Promise<EdgeType | MyError> => {
  try {
    const { data } = await axios.put<EdgeType>(
      `${import.meta.env.VITE_URL}/projects/edge/${edgeId}`,
      edgeData
    );
    return processEdge(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Edge Error",
        message: error.response?.data.detail ?? "Erro ao atualizar a conexão",
      };
    } else {
      throw error;
    }
  }
};

const deleteEdge = async (edgeId: number): Promise<EdgeType | MyError> => {
  try {
    const { data } = await axios.delete<EdgeType>(
      `${import.meta.env.VITE_URL}/projects/edge/${edgeId}`
    );
    return processEdge(data);
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data.error ?? "Edge Error",
        message: error.response?.data.detail ?? "Erro ao deletar a conexão",
      };
    } else {
      throw error;
    }
  }
};


function processProject(project: Project) {

  project.insertDate = new Date(project.insertDate);
  if (project.updateDate) project.updateDate = new Date(project.updateDate);

  return project;
}

function processFlow(flow: FlowType) {

  flow.insertDate = new Date(flow.insertDate);
  if (flow.updateDate) flow.updateDate = new Date(flow.updateDate);

  flow.nodes = flow.nodes.map(processNode);
  flow.edges = flow.edges.map(processEdge);

  return flow;
}

function processNode(node: NodeType) {
  node.insertDate = new Date(node.insertDate);
  if (node.updateDate) node.updateDate = new Date(node.updateDate);
  return node;
}

function processEdge(edge: EdgeType) {
  edge.insertDate = new Date(edge.insertDate);
  if (edge.updateDate) edge.updateDate = new Date(edge.updateDate);
  return edge;
}

export const ApiProjects = {
  getAllProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
  updateFlow,
  addNode,
  updateNode,
  deleteNode,
  addEdge,
  updateEdge,
  deleteEdge,
};