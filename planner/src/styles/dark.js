import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Azul claro
    },
    background: {
      default: '#121212', // Fundo escuro
      paper: 'rgba(30, 30, 30, 0.5)', // Transparência no cartão
    },
    text: {
      primary: '#ffffff', // Texto branco
      secondary: '#b3b3b3', // Texto cinza
    },
  },
});
