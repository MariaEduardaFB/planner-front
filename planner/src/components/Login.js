import React, { useState } from 'react';
import { login } from '../services/auth';
import {
  TextField,
  Container,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Link,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Tema escuro personalizado
const darkTheme = createTheme({
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

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      onLogin();
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRedirectToSignUp = () => {
    navigate('/signup');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #0a192f 100%)', // Gradiente preto para azul escuro
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(30, 30, 30, 0.5)', // Fundo semi-transparente
              backdropFilter: 'blur(10px)', // Efeito de desfoque
              borderRadius: '15px', // Bordas arredondadas
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Sombra suave
              border: '1px solid rgba(255, 255, 255, 0.18)', // Borda sutil
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Entre
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* Campo de Email */}
              <TextField
                fullWidth
                margin="normal"
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!email && !isEmailValid()}
                helperText={!!email && !isEmailValid() ? 'Email inválido' : ''}
                InputProps={{
                  startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
                }}
                sx={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px' }} // Fundo sutil
              />
              {/* Campo de Senha */}
              <TextField
                fullWidth
                margin="normal"
                id="password"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
                }}
                sx={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px' }} // Fundo sutil
              />
              {/* Exibição de Erro */}
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              {/* Botão de Login */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !isEmailValid() || !password}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: 'linear-gradient(135deg, #0a192f 0%, #2575fc 100%)', // Gradiente no botão
                  color: 'white',
                  borderRadius: '8px', // Bordas arredondadas
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2575fc 0%, #0a192f 100%)', // Gradiente invertido ao passar o mouse
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Entrar'}
              </Button>
            </Box>
            {/* Link para a tela de cadastro */}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Não tem uma conta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleRedirectToSignUp}
                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Cadastre-se
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;