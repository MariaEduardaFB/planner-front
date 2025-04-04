import React, { useState } from 'react';
import {
    Box, Button, TextField, Modal, Typography, Checkbox, FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64ffda',
    },
    secondary: {
      main: '#2575fc',
    },
    background: {
      paper: '#0a192f',
    },
    text: {
      primary: '#e6f1ff',
      secondary: '#8892b0',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#233554',
            },
            '&:hover fieldset': {
              borderColor: '#64ffda',
            },
          },
        },
      },
    },
  },
});

const ViagemForm = ({ open, onClose, onSubmit, initialData, isEdit }) => {
    const [formData, setFormData] = useState(initialData || { 
        dataCriacao: new Date(),
        dataInicio: null,
        dataFinal: null,
        confirmada: false,
        confirmacao: '',
        organizador: '',
        pais: '',
        estado: '',
        cidade: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleDateChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Modal open={open} onClose={onClose}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 500,
                            bgcolor: 'background.paper',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                            p: 4,
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            borderRadius: '12px',
                            border: '1px solid rgba(100, 255, 218, 0.1)',
                        }}
                    >
                        <Typography variant="h6" mb={3} sx={{ 
                            color: '#64ffda',
                            fontWeight: 'bold',
                            borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
                            pb: 1
                        }}>
                            {isEdit ? 'Editar Evento' : 'Criar Novo Evento'}
                        </Typography>
                        
                        <DatePicker
                            label="Data de Criação"
                            value={formData.dataCriacao}
                            onChange={(value) => handleDateChange('dataCriacao', value)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    fullWidth 
                                    sx={{ 
                                        mb: 3,
                                        '& .MuiInputLabel-root': {
                                            color: '#8892b0',
                                        },
                                    }} 
                                />
                            )}
                            disabled={isEdit}
                        />
                        
                        <DatePicker
                            label="Data de Início"
                            value={formData.dataInicio}
                            onChange={(value) => handleDateChange('dataInicio', value)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    fullWidth 
                                    sx={{ 
                                        mb: 3,
                                        '& .MuiInputLabel-root': {
                                            color: '#8892b0',
                                        },
                                    }} 
                                />
                            )}
                        />
                        
                        <DatePicker
                            label="Data Final"
                            value={formData.dataFinal}
                            onChange={(value) => handleDateChange('dataFinal', value)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    fullWidth 
                                    sx={{ 
                                        mb: 3,
                                        '& .MuiInputLabel-root': {
                                            color: '#8892b0',
                                        },
                                    }} 
                                />
                            )}
                        />
                        
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="confirmada"
                                    checked={formData.confirmada}
                                    onChange={handleChange}
                                    sx={{
                                        color: '#64ffda',
                                        '&.Mui-checked': {
                                            color: '#64ffda',
                                        },
                                    }}
                                />
                            }
                            label="Confirmada"
                            sx={{ 
                                mb: 3,
                                color: '#e6f1ff',
                                '& .MuiTypography-root': {
                                    fontSize: '0.875rem',
                                }
                            }}
                        />
                        
                        <TextField
                            label="Confirmação"
                            name="confirmacao"
                            variant="outlined"
                            fullWidth
                            value={formData.confirmacao}
                            onChange={handleChange}
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': {
                                    color: '#8892b0',
                                },
                            }}
                        />
                        
                        <TextField
                            label="Organizador"
                            name="organizador"
                            variant="outlined"
                            fullWidth
                            value={formData.organizador}
                            onChange={handleChange}
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': {
                                    color: '#8892b0',
                                },
                            }}
                        />
                        
                        <TextField
                            label="País"
                            name="pais"
                            variant="outlined"
                            fullWidth
                            value={formData.pais}
                            onChange={handleChange}
                            required
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': {
                                    color: '#8892b0',
                                },
                            }}
                        />
                        
                        <TextField
                            label="Estado"
                            name="estado"
                            variant="outlined"
                            fullWidth
                            value={formData.estado}
                            onChange={handleChange}
                            required
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': {
                                    color: '#8892b0',
                                },
                            }}
                        />
                        
                        <TextField
                            label="Cidade"
                            name="cidade"
                            variant="outlined"
                            fullWidth
                            value={formData.cidade}
                            onChange={handleChange}
                            required
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': {
                                    color: '#8892b0',
                                },
                            }}
                        />

                        
                        
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit}
                            sx={{
                                background: 'linear-gradient(135deg, #0a192f 0%, #2575fc 100%)',
                                color: 'white',
                                borderRadius: '8px',
                                padding: '10px 24px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2575fc 0%, #0a192f 100%)',
                                    boxShadow: '0 4px 8px rgba(37, 117, 252, 0.3)',
                                },
                            }}
                        >
                            {isEdit ? 'Atualizar' : 'Salvar'}
                        </Button>
                    </Box>
                </LocalizationProvider>
            </Modal>
        </ThemeProvider>
    );
};

export default ViagemForm;