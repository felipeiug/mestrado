import React, { createContext, useContext, useEffect, useState } from "react";
import { useAppThemeContext } from "./ThemeContext";

type Props = {
  children?: React.ReactNode;
};

const ShowDebugContext = createContext<boolean | undefined>(undefined);
export const useShowDebug = () => {
  return useContext(ShowDebugContext);
};


export const KeyEventHandler: React.FC<Props> = ({ children }) => {

  const { toggleTheme } = useAppThemeContext();
  const [showDebugScreen, setDebugScreen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Alterar o Thema caso alt+a seja pressionado trocar o thema
      if (!event.repeat && event.key === "a" && event.altKey) {
        toggleTheme();
      }


      // Mostrar as métricas de debug caso alt+s seja pressionado
      if (!event.repeat && event.key === "s" && event.altKey) {
        if (showDebugScreen === undefined) {
          setDebugScreen(false);
        } else {
          setDebugScreen(!showDebugScreen);
        }
      }
    };

    // Adiciona o event listener ao carregar o componente
    document.addEventListener("keydown", handleKeyPress);
    // Remove o event listener ao descarregar o componente
    return () => document.removeEventListener("keydown", handleKeyPress);
  });

  return (
    <ShowDebugContext.Provider value={showDebugScreen}>
      {children}
    </ShowDebugContext.Provider>
  );
};