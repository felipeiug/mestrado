import * as React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/system";
import { DarkTheme, LightTheme } from "../themes";

interface IThemeContextData {
  themeType: boolean;
  toggleTheme: (theme?: boolean) => void;
}

const ThemeContext = createContext({} as IThemeContextData);

export const useAppThemeContext = () => {
  return useContext(ThemeContext);
};

export const AppThemeProvider: React.FC<Props> = ({ children }) => {
  const [themeType, setThemeType] = useState<boolean>(true);
  const theme = useMemo(() => themeType ? LightTheme : DarkTheme, [themeType]);

  const setTheme = (theme?: boolean) => {
    setThemeType(theme ?? !themeType);
  };

  return (
    <ThemeContext.Provider value={{ themeType: themeType, toggleTheme: setTheme }}>
      <ThemeProvider theme={theme}>
        <Box width='100vw' height='100vh' bgcolor={theme.palette.background.default}>
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

type Props = { children?: React.ReactNode; };