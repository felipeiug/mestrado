import { createTheme } from "@mui/material";

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d97c2d', // Laranja forte
    },
    secondary: {
      main: '#8a441f', // Marrom-alaranjado
    },
    background: {
      default: '#f4d4b4', // Bege
      paper: '#ffffff',
    },
    text: {
      primary: '#612f1b', // Marrom escuro
      secondary: '#8a441f',
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '8px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});