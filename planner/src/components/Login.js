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
  CssBaseline,
  Link,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { darkTheme } from '../styles/dark';

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
      const { user } = await login(email, password);
  
      if (user && user.role) {
        localStorage.setItem('userType', user.role);
        onLogin(); 
      } else {
        setError('Tipo de usuário não encontrado.');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRedirectToSignUp = () => {
    navigate('/signup');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #0a192f 100%)',
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
              background: 'rgba(30, 30, 30, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <img
              src="/logo.svg"
              alt=""
              style={{ width: '300px', zIndex: -1 }}
            />
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
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
                  startAdornment: (
                    <Email sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                }}
              />
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
                }}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !isEmailValid() || !password}
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    'linear-gradient(135deg, #0a192f 0%, #2575fc 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #2575fc 0%, #0a192f 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Entrar'}
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Não tem uma conta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleRedirectToSignUp}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
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
