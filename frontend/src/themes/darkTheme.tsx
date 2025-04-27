import { createTheme } from "@mui/material";

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d97c2d', // Laranja forte
    },
    secondary: {
      main: '#c04d18', // Laranja avermelhado
    },
    background: {
      default: '#33190e', // Marrom bem escuro
      paper: '#4a2515',
    },
    text: {
      primary: '#f4d4b4', // Bege claro
      secondary: '#d97c2d',
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
          backgroundImage: 'linear-gradient(45deg, #d97c2d 30%, #c04d18 90%)',
          color: '#fff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundColor: '#4a2515',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#33190e',
          color: '#f4d4b4',
        },
      },
    },
  },
});