import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton, Modal, Typography, Checkbox, 
  FormControlLabel, MenuItem, Select
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '24px',
      background: 'linear-gradient(135deg, #000000 0%, #0a192f 100%)',
      minHeight: '100vh',
      color: '#ffffff',
    },
    searchContainer: {
      display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#0B1421',
    borderRadius: '12px',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    width: '71%', // Ajuste a largura do contêiner
    margin: '0 auto',
    },
    searchInput: {
      width: '300px',
      '& .MuiOutlinedInput-root': {
        color: '#ffffff',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
          borderColor: '#2575fc',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    searchFieldSelect: {
      minWidth: '150px',
      '& .MuiOutlinedInput-root': {
        color: '#ffffff',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
          borderColor: '#2575fc',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
      '& .MuiSvgIcon-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    modalBox: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: 'rgba(30, 30, 30, 0.95)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      padding: '32px',
      maxHeight: '80vh',
      overflowY: 'auto',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
    },
    modalTitle: {
      marginBottom: '24px',
      color: '#ffffff',
      fontWeight: 'bold',
    },
    modalTextField: {
      marginBottom: '20px',
      '& .MuiOutlinedInput-root': {
        color: '#ffffff',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
          borderColor: '#2575fc',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    
  }));

const ViagensList = () => {
  const classes = useStyles();
  const [viagens, setViagens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('pais');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentViagem, setCurrentViagem] = useState({ 
    id: null, 
    dataCriacao: new Date().toISOString().split('T')[0],
    dataInicio: '',
    dataFinal: '',
    confirmada: false,
    organizador: '',
    pais: '',
    estado: '',
    cidade: ''
  });
  const [newViagem, setNewViagem] = useState({
    dataCriacao: new Date().toISOString().split('T')[0],
    dataInicio: '',
    dataFinal: '',
    confirmada: false,
    organizador: '',
    pais: '',
    estado: '',
    cidade: ''
  });

  const fetchViagens = async () => {
    try {
      const response = await api.get(`/viagens`);
      setViagens(response.data.viagens);
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
    }
  };

  const searchViagens = async () => {
    if (!searchTerm.trim()) {
      fetchViagens();
      return;
    }
    try {
      const params = { [searchField]: searchTerm };
      const response = await api.get(`/viagens/search`, { params });
      setViagens(response.data.viagens);
    } catch (error) {
      console.error('Erro ao pesquisar viagens:', error);
    }
  };

  const handleCreateViagem = async () => {
    try {
      await api.post(`/viagem`, newViagem);
      setNewViagem({
        dataCriacao: new Date().toISOString().split('T')[0],
        dataInicio: '',
        dataFinal: '',
        confirmada: false,
        confirmacao: '',
        organizador: '',
        pais: '',
        estado: '',
        cidade: ''
      });
      setOpenCreateModal(false);
      fetchViagens();
    } catch (error) {
      console.log('Erro ao criar viagem:', error);
      console.error('Erro ao criar viagem:', error);
    }
  };

  const handleUpdateViagem = async () => {
    try {
      await api.put(`viagem/${currentViagem.id}`, currentViagem);
      setOpenEditModal(false);
      fetchViagens();
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
    }
  };

  const handleDeleteViagem = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta viagem?')) {
      try {
        await api.delete(`viagem/${id}`);
        fetchViagens();
      } catch (error) {
        console.error('Erro ao deletar viagem:', error);
      }
    }
  };

  const handleChange = (e, isNew = false) => {
    const { name, value, type, checked } = e.target;
    const setter = isNew ? setNewViagem : setCurrentViagem;
    setter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    fetchViagens();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchSubmit = () => {
    searchViagens();
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.searchContainer}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
          <TextField
            label="Pesquisar viagens"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className={classes.searchInput}
          />
          <Select
            value={searchField}
            onChange={handleSearchFieldChange}
            className={classes.searchFieldSelect}
            variant="outlined"
          >
            <MenuItem value="pais">País</MenuItem>
            <MenuItem value="estado">Estado</MenuItem>
            <MenuItem value="cidade">Cidade</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={handleSearchSubmit}
          >
            Buscar
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateModal(true)}
        >
          Nova Viagem
        </Button>
      </Box>

      <TableContainer component={Paper}
      sx={{
        backgroundColor: '#08172D', // Cor de fundo
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', // Sombra para destacar
      borderRadius: '10px', // Bordas arredondadas
      overflow: 'hidden', // Remove rolagem extra
      border: '20px solid #0B1421',
      width: '70%',
      color: '#ffffff',
      margin: '0 auto', // Centraliza horizontalmente
      marginTop: '50px', // Espaço acima da tabela
      }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Organizador</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>País</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Cidade</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Data Início</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Data Final</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Confirmada</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Ações</TableCell>
          </TableRow>
            
          </TableHead>
          <TableBody>
  {viagens.map((viagem) => (
    <TableRow
      key={viagem.id}
      sx={{
        backgroundColor: '#08172D',
        '& td, & th': {
          borderBottom: '2px solid #0B1421',} // Cor de fundo para linhas ímpares
      }}
    >
      <TableCell sx={{ color: '#ffffff' }}>{viagem.id}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>{viagem.organizador}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>{viagem.pais}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>{viagem.estado}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>{viagem.cidade}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>{viagem.dataInicio}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>{viagem.dataFinal || '-'}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>
        {viagem.confirmada ? 'Sim' : 'Não'}
      </TableCell>
      <TableCell>
        <IconButton
          color="primary"
          onClick={() => {
            setCurrentViagem(viagem);
            setOpenEditModal(true);
          }}
        >
          <Edit />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDeleteViagem(viagem.id)}
        >
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      {/* Modal para criar viagem */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box className={classes.modalBox}>
          <Typography variant="h6" className={classes.modalTitle}>
            Criar Nova Viagem
          </Typography>
          
          <TextField
            label="Data de Início"
            name="dataInicio"
            type="date"
            variant="outlined"
            fullWidth
            value={newViagem.dataInicio}
            onChange={(e) => handleChange(e, true)}
            className={classes.modalTextField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <TextField
            label="Data Final"
            name="dataFinal"
            type="date"
            variant="outlined"
            fullWidth
            value={newViagem.dataFinal}
            onChange={(e) => handleChange(e, true)}
            className={classes.modalTextField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                name="confirmada"
                checked={newViagem.confirmada}
                onChange={(e) => handleChange(e, true)}
              />
            }
            label="Confirmada"
            className={classes.modalTextField}
          />
          
          <TextField
            label="Organizador"
            name="organizador"
            variant="outlined"
            fullWidth
            value={newViagem.organizador}
            onChange={(e) => handleChange(e, true)}
            className={classes.modalTextField}
          />
          
          <TextField
            label="País"
            name="pais"
            variant="outlined"
            fullWidth
            value={newViagem.pais}
            onChange={(e) => handleChange(e, true)}
            required
            className={classes.modalTextField}
          />
          
          <TextField
            label="Estado"
            name="estado"
            variant="outlined"
            fullWidth
            value={newViagem.estado}
            onChange={(e) => handleChange(e, true)}
            required
            className={classes.modalTextField}
          />
          
          <TextField
            label="Cidade"
            name="cidade"
            variant="outlined"
            fullWidth
            value={newViagem.cidade}
            onChange={(e) => handleChange(e, true)}
            required
            className={classes.modalTextField}
          />
          
          <Button variant="contained" onClick={handleCreateViagem}>
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar viagem */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalBox}>
          <Typography variant="h6" className={classes.modalTitle}>
            Editar Viagem
          </Typography>
          
          <TextField
            label="Data de Criação"
            name="dataCriacao"
            type="date"
            variant="outlined"
            fullWidth
            value={currentViagem.dataCriacao}
            onChange={handleChange}
            className={classes.modalTextField}
            InputLabelProps={{
              shrink: true,
            }}
            disabled
          />
          
          <TextField
            label="Data de Início"
            name="dataInicio"
            type="date"
            variant="outlined"
            fullWidth
            value={currentViagem.dataInicio}
            onChange={handleChange}
            className={classes.modalTextField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <TextField
            label="Data Final"
            name="dataFinal"
            type="date"
            variant="outlined"
            fullWidth
            value={currentViagem.dataFinal}
            onChange={handleChange}
            className={classes.modalTextField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                name="confirmada"
                checked={currentViagem.confirmada}
                onChange={handleChange}
              />
            }
            label="Confirmada"
            className={classes.modalTextField}
          />
          
          <TextField
            label="Organizador"
            name="organizador"
            variant="outlined"
            fullWidth
            value={currentViagem.organizador}
            onChange={handleChange}
            className={classes.modalTextField}
          />
          
          <TextField
            label="País"
            name="pais"
            variant="outlined"
            fullWidth
            value={currentViagem.pais}
            onChange={handleChange}
            required
            className={classes.modalTextField}
          />
          
          <TextField
            label="Estado"
            name="estado"
            variant="outlined"
            fullWidth
            value={currentViagem.estado}
            onChange={handleChange}
            required
            className={classes.modalTextField}
          />
          
          <TextField
            label="Cidade"
            name="cidade"
            variant="outlined"
            fullWidth
            value={currentViagem.cidade}
            onChange={handleChange}
            required
            className={classes.modalTextField}
          />
          
          <Button variant="contained" onClick={handleUpdateViagem}>
            Atualizar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ViagensList;