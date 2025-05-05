import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LayerType } from "../core";
import { useUser } from "./UserContext";
import { useApi } from "../services";
import { useError } from "./ErrorContext";


const LayersContext = createContext<LayerType[]>([]);

export const useLayers = () => {
  return useContext(LayersContext);
};

type Props = { children?: React.ReactNode; };
export const LayersProvider: React.FC<Props> = ({ children }) => {
  const user = useUser();
  const api = useApi();
  const setError = useError();

  const [layers, setLayers] = useState<LayerType[]>([]);
  const timer = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    //TODO:Adicionar o usuário if (!user) return;

    timer.current = setTimeout(() => {
      api.layers.getLayers().then((value) => {
        if ("error" in value) {
          setError(value);
          return;
        }
        setLayers([...value]);
      });
    }, 100);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    }
  }, [user]);

  return <LayersContext.Provider value={layers}>
    {children}
  </LayersContext.Provider>;
};