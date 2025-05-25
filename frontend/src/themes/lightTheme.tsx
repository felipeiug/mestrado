import { createTheme } from "@mui/material";

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(217, 125, 45)', // Laranja forte
    },
    secondary: {
      main: 'rgb(138, 68, 31)', // Marrom-alaranjado
    },
    background: {
      default: 'rgb(240, 240, 240)', // Bege
      paper: 'rgb(255, 255, 255)',
    },
    text: {
      primary: 'rgb(97, 47, 27)', // Marrom escuro
      secondary: 'rgb(138, 68, 31)',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Fira Sans", "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});