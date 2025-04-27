import { createTheme } from "@mui/material";

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(217, 125, 45)', // Laranja forte
    },
    secondary: {
      main: 'rgb(192, 77, 24)', // Laranja avermelhado
    },
    background: {
      default: 'rgb(51, 25, 14)', // Marrom bem escuro
      paper: 'rgb(74, 37, 21)',
    },
    text: {
      primary: 'rgb(244, 212, 180)', // Bege claro
      secondary: 'rgb(217, 125, 45)',
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
          backgroundColor: 'rgb(51, 25, 14)',
          color: 'rgb(244, 212, 180)',
        },
      },
    },
  },
});