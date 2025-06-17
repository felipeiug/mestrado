import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services";
import { useError } from "./ErrorContext";

export interface EdgeType {
  id: string;
  source: string;
  target: string;
  args?: Record<string, any>;

  insertDate: Date;
  updateDate?: Date;
  updateBy?: string;
}

export interface NodeType {
  id: string
  tipo: string;
  args?: Record<string, any>;
  posX: number;
  posY: number;

  insertDate: Date;
  updateDate?: Date;
  updateBy?: string;
}

export interface FlowType {
  id: number;

  style?: Record<string, any>;

  nodes: NodeType[];
  edges: EdgeType[];

  insertDate: Date;
  updateDate?: Date;
  updateBy?: string;
}

export interface Project {
  id: number;
  user: string;

  name: string;
  description?: string;

  flow?: FlowType;

  insertDate: Date;
  updateDate?: Date;
  updateBy?: string;
}

interface ProjContextProps {
  project: Project;
  setFlow: (flow: FlowType) => void;
}
const ProjectContext = createContext<ProjContextProps | undefined>(undefined);

export const useProject = () => {
  return useContext(ProjectContext);
};

type Props = {
  id: number;
  children?: React.ReactNode;
};

export const ProjectProvider: React.FC<Props> = ({ id, children }) => {
  const api = useApi();
  const setError = useError();

  const [project, setProject] = useState<Project>({
    id: -1,
    user: "",
    name: "",
    insertDate: new Date(),
  });

  useEffect(() => {
    api.projects.getProject(id).then(value => {
      if ("error" in value) {
        setError(value);
        return;
      }
      setProject(value);
    });
  }, []);

  const handleUpdateFlow = (flow: FlowType) => {
    console.log(flow);
  }

  return (
    <ProjectContext.Provider value={{ project, setFlow: handleUpdateFlow }}>
      {children}
    </ProjectContext.Provider>
  );
};