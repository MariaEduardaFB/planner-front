import React, { useState } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Email, Lock, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // Adicionando o estado para o papel
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Insira um email válido.');
      setLoading(false);
      return;
    }

    try {
      // Simulação de cadastro
      console.log('Cadastro realizado:', { name, email, password });
      const response = await api.post('/auth/signup', { name, email, password, role });
      setSuccess(true);
    } catch (err) {
      setError('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    navigate('/login');
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
            <img
              src="/logo.svg"
              alt=""
              style={{
                width: '300px',
                zIndex: -1,
              }}
            />
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Cadastre-se
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              {/* Campo de Nome */}
              <TextField
                fullWidth
                margin="normal"
                id="name"
                label="Nome"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Person sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                }} // Fundo sutil
              />
              {/* Campo de Email */}
              <TextField
                fullWidth
                margin="normal"
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                helperText={
                  !!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? 'Email inválido'
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <Email sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                }} // Fundo sutil
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
                  startAdornment: (
                    <Lock sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                }} // Fundo sutil
              />
              {/* Campo de Confirmação de Senha */}
              <TextField
                fullWidth
                margin="normal"
                id="confirmPassword"
                label="Confirme a Senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Lock sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                }} // Fundo sutil
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Função</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                  }}
                >
                  <MenuItem value="organizador">Organizador</MenuItem>
                  <MenuItem value="convidado">Convidado</MenuItem>
                </Select>
              </FormControl>
              {/* Exibição de Erro */}
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              {/* Exibição de Erro */}
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
               {/* Exibição de Sucesso */}
               {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Cadastro realizado com sucesso!
                </Alert>
              )}
              {/* Botão de Cadastro */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={handleSubmit}
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    'linear-gradient(135deg, #0a192f 0%, #2575fc 100%)', // Gradiente no botão
                  color: 'white',
                  borderRadius: '8px', // Bordas arredondadas
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #2575fc 0%, #0a192f 100%)', // Gradiente invertido ao passar o mouse
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
              </Button>
            </Box>
            {/* Link para a tela de login */}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Já tem uma conta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleRedirectToLogin}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Entrar
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp;
