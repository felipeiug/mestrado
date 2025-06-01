import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services";
import { useError } from "./ErrorContext";
import { useNavigate } from "react-router-dom";
import { useAppThemeContext } from "./ThemeContext";
import { Edge, Node } from "@xyflow/react";

export interface Project {
  // Identificação
  id: number;

  nodes: Node[];
  edges: Edge[];
}

interface ProjectContextProps {
  id: number;
  name: string;
  description?: string;
}


const ProjectsContext = createContext<ProjectContextProps[]>([]);
const SetProjectContext = createContext<(id: number) => void>(() => {
  // 
});

export const useProjects = () => {
  return useContext(ProjectsContext);
};

export const setProject = () => {
  return useContext(SetProjectContext);
};

export const ProjectsProvider: React.FC<Props> = ({ children }) => {
  const api = useApi();
  const setError = useError();

  const [project, setProject] = useState<Project>();
  const [projects, setProjects] = useState<ProjectContextProps[]>([]);

  useEffect(() => {
    // api.user.getUser().then((user) => {
    //   if ("error" in user) {
    //     user.onClose = () => navigate("/login");
    //     setError(user);
    //     return;
    //   }
    //   toggleTheme(user.theme ?? false);
    //   setUser(user);
    // });
  }, []);

  const handleSetProject = (_: number) => {

  };

  return (
    <ProjectsContext.Provider value={projects}>
      <SetProjectContext.Provider value={handleSetProject}>
        {children}
      </SetProjectContext.Provider>
    </ProjectsContext.Provider>
  );
};

type Props = { children?: React.ReactNode; };