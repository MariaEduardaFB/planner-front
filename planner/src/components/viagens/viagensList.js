import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton, Modal, Typography, Checkbox, 
  FormControlLabel, MenuItem, Select
} from '@mui/material';
import { Edit, Delete, PersonAdd, Info} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import api from '../../services/api';

const useStyles = makeStyles(() => ({
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
    width: '71%',
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentViagem, setCurrentViagem] = useState({
    id: null,
    dataCriacao: new Date().toISOString().split('T')[0],
    dataInicio: '',
    dataFinal: '',
    confirmada: false,
    organizador: '',
    pais: '',
    estado: '',
    cidade: '',
  });
  const [newViagem, setNewViagem] = useState({
    dataCriacao: new Date().toISOString().split('T')[0],
    dataInicio: '',
    dataFinal: '',
    confirmada: false,
    organizador: '',
    pais: '',
    estado: '',
    cidade: '',
    participantes: [],
  });
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [participantEmail, setParticipantEmail] = useState('');
  const [participant, setParticipant] = useState(null);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [participantError, setParticipantError] = useState('');

  const [userRole, setUserRole] = useState('');

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do JWT
    setUserRole(decoded.role);
  }
  fetchViagens();
}, []);

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
        organizador: '',
        pais: '',
        estado: '',
        cidade: '',
        participantes: [],
      });
      setOpenCreateModal(false);
      fetchViagens();
    } catch (error) {
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

  const handleSearchParticipant = async () => {
    if (!participantEmail.trim()) {
      setParticipantError('Por favor, insira um e-mail válido.');
      return;
    }
  
    try {
      const response = await api.get(`/user-viagem/search?email=${participantEmail}`);
      console.log('Resposta da API ao buscar participante:', response.data);
      setParticipant(response.data.user); // Certifique-se de que a propriedade correta está sendo usada
      setParticipantError('');
    } catch (error) {
      console.error('Erro ao buscar participante:', error);
      setParticipant(null);
      setParticipantError('Participante não encontrado.');
    }
  };

  const handleAddParticipant = async () => {
    if (!currentViagem.id) {
      setInviteError('A viagem precisa ser selecionada antes de convidar participantes.');
      setInviteSuccess(false);
      return;
    }
  
    if (!participant) {
      setInviteError('Nenhum participante foi selecionado.');
      setInviteSuccess(false);
      return;
    }
  
    try {
      console.log('ID da viagem:', currentViagem.id);
      console.log('ID do participante:', participant.id);
  
      await api.post(`/user-viagem/${currentViagem.id}`, { userId: participant.id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInviteSuccess(true);
      setInviteError('');
      setParticipant(null);
      setParticipantEmail('');
    } catch (error) {
      console.error('Erro ao convidar participante:', error);
      setInviteError(error.response?.data?.message || 'Erro ao convidar participante.');
      setInviteSuccess(false);
    }
  };

  const handleCloseAddParticipantModal = () => {
    setShowAddParticipantModal(false);
    setInviteError('');
    setInviteSuccess(false);
    setParticipant(null);
    setParticipantEmail('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchSubmit = () => {
    searchViagens();
  };

  const handleChange = (e, isNew = false) => {
    const { name, value, type, checked } = e.target;
    const setter = isNew ? setNewViagem : setCurrentViagem;
    setter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    fetchViagens();
  }, []);

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
      <TableCell sx={{ color: '#ffffff' }}>
        {viagem.organizador?.name || 'Não informado'}
      </TableCell>
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
            setCurrentViagem(viagem); // Define a viagem atual
            setShowAddParticipantModal(true); // Abre o modal de adicionar participante
          }}
        >
          <IconButton
    color="primary"
    onClick={() => {
      setCurrentViagem(viagem); // Define a viagem atual
      setShowDetailsModal(true); // Abre o modal de detalhes
      console.log('Dados da viagem selecionada:', currentViagem);
    }}
  >
    <Info /> {/* Ícone para exibir informações */}
  </IconButton>
          <PersonAdd /> {/* Ícone para adicionar participante */}
        </IconButton>
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
<TableBody>
  {viagens.map((viagem) => (
    <TableRow
      key={viagem.id}
      sx={{
        backgroundColor: '#08172D',
        '& td, & th': {
          borderBottom: '2px solid #0B1421',
        },
      }}
    >
      <TableCell sx={{ color: '#ffffff' }}>{viagem.id}</TableCell>
      <TableCell sx={{ color: '#ffffff' }}>
        {viagem.organizador?.name || 'Não informado'}
      </TableCell>
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
            setShowDetailsModal(true);
          }}
        >
          <Info />
        </IconButton>
        {userRole === 'convidado' && !viagem.confirmada && (
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              try {
                await api.post(`/viagens/${viagem.id}/confirmar`, null, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                });
                fetchViagens(); // Atualiza a lista de viagens
              } catch (error) {
                console.error('Erro ao confirmar participação:', error);
              }
            }}
          >
            Confirmar
          </Button>
        )}
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

<Button
  variant="outlined"
  onClick={() => setShowAddParticipantModal(true)} // Abre o modal de adicionar participante
  sx={{
    marginRight: 2,
    color: '#64ffda',
    borderColor: '#64ffda',
    '&:hover': {
      backgroundColor: 'rgba(100, 255, 218, 0.1)',
    },
  }}
>
  Adicionar Participante
</Button>

          
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
      <Modal open={showAddParticipantModal} onClose={() => setShowAddParticipantModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '12px',
          }}
        >
          <Typography variant="h6" mb={2}>
            Adicionar Participante à Viagem: {currentViagem.pais} - {currentViagem.cidade}
          </Typography>
          <TextField
            label="Buscar por e-mail"
            fullWidth
            value={participantEmail}
            onChange={(e) => setParticipantEmail(e.target.value)}
            sx={{ mb: 2 }}
            error={!!participantError}
            helperText={participantError}
    />


          <Button
            variant="contained"
            onClick={handleSearchParticipant}
            sx={{
              background: 'linear-gradient(135deg, #0a192f 0%, #2575fc 100%)',
              color: 'white',
              borderRadius: '8px',
              '&:hover': {
                background: 'linear-gradient(135deg, #2575fc 0%, #0a192f 100%)',
              },
            }}
          >
            Buscar
          </Button>
          {participant && (
            <Box mt={2}>
              <Typography>Nome: {participant.name}</Typography>
              <Button
                variant="outlined"
                onClick={handleAddParticipant}
                sx={{
                  marginTop: 2,
                  color: '#64ffda',
                  borderColor: '#64ffda',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 255, 218, 0.1)',
                  },
                }}
              >
                Convidar
              </Button>
              {/* Exibe mensagens de erro ou sucesso */}
          {inviteError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {inviteError}
            </Typography>
          )}
          {inviteSuccess && (
            <Typography color="success" sx={{ mt: 2 }}>
              Convite enviado com sucesso!
            </Typography>
          )}

              <Typography variant="h6" mb={2}>
          Participantes Adicionados
        </Typography>
        {newViagem.participantes.map((p, index) => (
          <Typography key={index}>{p.name} ({p.email})</Typography>
        ))}
        {participantError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {participantError}
        </Typography>
      )}
            </Box>
          )}
          {inviteError && <Typography color="error">{inviteError}</Typography>}
          {inviteSuccess && <Typography color="success">Convite enviado com sucesso!</Typography>}
        </Box>
      </Modal>
      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '12px',
    }}
  >
    <Typography variant="h6" mb={2}>
      Detalhes da Viagem
    </Typography>
    <Typography><strong>Organizador:</strong> {currentViagem.organizador?.name || 'Não informado'}</Typography>
    <Typography><strong>País:</strong> {currentViagem.pais}</Typography>
    <Typography><strong>Estado:</strong> {currentViagem.estado}</Typography>
    <Typography><strong>Cidade:</strong> {currentViagem.cidade}</Typography>
    <Typography><strong>Data de Início:</strong> {currentViagem.dataInicio}</Typography>
    <Typography><strong>Data Final:</strong> {currentViagem.dataFinal || '-'}</Typography>
    <Typography><strong>Confirmada:</strong> {currentViagem.confirmada ? 'Sim' : 'Não'}</Typography>

    <Typography variant="h6" mt={3}>Participantes</Typography>
    {currentViagem.convidados && currentViagem.convidados.length > 0 ? (
      currentViagem.convidados.map((p, index) => (
        <Box key={index} sx={{ mt: 1 }}>
          <Typography>
            {p.name} ({p.email}) - {p.UserViagem.confirmada ? 'Confirmado' : 'Não Confirmado'}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography>Nenhum participante adicionado.</Typography>
      
    )}
  </Box>
</Modal>
<Typography variant="h6" mt={3}>Participantes Confirmados</Typography>
{currentViagem.convidados && currentViagem.convidados.length > 0 ? (
  currentViagem.convidados.map((p, index) => (
    <Box key={index} sx={{ mt: 1 }}>
      <Typography>
        {p.name} ({p.email})
      </Typography>
    </Box>
  ))
) : (
  <Typography>Nenhum participante confirmado.</Typography>
)}
    </Box>
  );
};

export default ViagensList;