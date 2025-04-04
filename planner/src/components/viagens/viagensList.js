import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton, Modal, Typography, Checkbox, 
  FormControlLabel, MenuItem, Select,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { Edit, Delete, PersonAdd, Info, CheckCircle,} from '@mui/icons-material';
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState(null);

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

  const [confirmationMessage, setConfirmationMessage] = useState(''); // Estado para a mensagem de confirmação

  const handleConfirmViagem = async (viagemId) => {
    try {
      await api.post(`/viagens/${viagemId}/confirmar`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Atualiza o estado local para refletir a confirmação
      setViagens((prevViagens) =>
        prevViagens.map((viagem) =>
          viagem.id === viagemId ? { ...viagem, confirmada: true } : viagem
        )
      );
  
      setConfirmationMessage('Viagem confirmada com sucesso!'); // Define a mensagem de confirmação
    } catch (error) {
      console.error('Erro ao confirmar viagem:', error);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    // Exibe uma mensagem de confirmação antes de excluir
    const confirmDelete = window.confirm('Tem certeza que deseja remover este participante?');
    if (!confirmDelete) {
      return; // Cancela a exclusão se o usuário clicar em "Cancelar"
    }
  
    try {
      // Chama a rota correta do backend
      await api.delete(`/viagens/${currentViagem.id}/participantes/${participantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Atualiza a lista de participantes localmente
      setCurrentViagem((prev) => ({
        ...prev,
        convidados: prev.convidados.filter((p) => p.id !== participantId),
      }));
  
      console.log(`Participante com ID ${participantId} removido com sucesso.`);
    } catch (error) {
      console.error('Erro ao remover participante:', error.response?.data || error.message);
    }
  };

  const [showParticipantDetailsModal, setShowParticipantDetailsModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

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
        {userRole === 'organizador' && (
  <Button
    variant="contained"
    color="primary"
    onClick={() => setOpenCreateModal(true)}
  >
    Nova Viagem
  </Button>
)}
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
        {/* Botões para organizador */}
        {userRole === 'organizador' && (
          <>
            <IconButton
              sx={{ color: '#64ffda' }} // Cor personalizada para o ícone de detalhes
              onClick={() => {
                setCurrentViagem(viagem);
                setShowDetailsModal(true);
              }}
            >
              <Info />
            </IconButton>
            <IconButton
              sx={{ color: '#ff9800' }} // Cor personalizada para o ícone de edição
              onClick={() => {
                setCurrentViagem(viagem);
                setOpenEditModal(true);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              sx={{ color: '#f44336' }} // Cor personalizada para o ícone de exclusão
              onClick={() => handleDeleteViagem(viagem.id)}
            >
              <Delete />
            </IconButton>
            <IconButton
              sx={{ color: '#2196f3' }} // Cor personalizada para o ícone de adicionar participante
              onClick={() => {
                setCurrentViagem(viagem);
                setShowAddParticipantModal(true);
              }}
            >
              <PersonAdd />
            </IconButton>
          </>
        )}

        {/* Botões para convidado */}
        {userRole === 'convidado' && (
          <>
            {/* Ícone para convidado confirmar a viagem */}
            {userRole === 'convidado' && !viagem.confirmada && (
                <IconButton
                  color="primary"
                  onClick={() => handleConfirmViagem(viagem.id)}
                >
                  <CheckCircle />
                </IconButton>
              )}
              {/* Ícone para ver detalhes */}
              <IconButton
                color="primary"
                onClick={() => {
                  setCurrentViagem(viagem);
                  setShowDetailsModal(true);
                }}
              >
                <Info />
              </IconButton>
          
          </>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
<Snackbar
        open={!!confirmationMessage}
        autoHideDuration={3000}
        onClose={() => setConfirmationMessage('')}
        message={confirmationMessage}
      />

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

    {/* Campos do formulário */}
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

    {/* Lista de participantes */}
    <Typography variant="h6" className={classes.modalTitle}>
      Participantes
    </Typography>
    {currentViagem.convidados && currentViagem.convidados.length > 0 ? (
      currentViagem.convidados.map((p, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography>
            {p.name} ({p.email})
          </Typography>
          <IconButton
          sx={{ color: '#f44336' }}
          onClick={() => {
            setParticipantToRemove(p.id); // Define o participante a ser removido
            setShowConfirmModal(true); // Abre o modal de confirmação
          }}
        >
          <Delete />
        </IconButton>
        </Box>
      ))
    ) : (
      <Typography>Nenhum participante adicionado.</Typography>
    )}

<Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
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
            Confirmar Remoção
          </Typography>
          <Typography mb={3}>
            Tem certeza que deseja remover este participante?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowConfirmModal(false)} // Fecha o modal
              sx={{
                color: '#f44336',
                borderColor: '#f44336',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                await handleRemoveParticipant(participantToRemove); // Remove o participante
                setShowConfirmModal(false); // Fecha o modal
              }}
              sx={{
                backgroundColor: '#64ffda',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#52e0c4',
                },
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>

    {/* Botões de ação */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
      <Button
        variant="outlined"
        onClick={() => setOpenEditModal(false)} // Fecha o modal sem salvar
        sx={{
          color: '#f44336',
          borderColor: '#f44336',
          '&:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
          },
        }}
      >
        Cancelar
      </Button>
      <Button
        variant="contained"
        onClick={handleUpdateViagem} // Salva as alterações
        sx={{
          backgroundColor: '#64ffda',
          color: '#000',
          '&:hover': {
            backgroundColor: '#52e0c4',
          },
        }}
      >
        Atualizar
      </Button>
    </Box>
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
    <Box
      key={index}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <Typography>
        {p.name} ({p.email})
      </Typography>
      <IconButton
        sx={{ color: '#64ffda' }}
        onClick={() => {
          setSelectedParticipant(p); // Define o participante selecionado
          setShowParticipantDetailsModal(true); // Abre o modal de detalhes
        }}
      >
        <Info />
      </IconButton>
    </Box>
  ))
) : (
  <Typography>Nenhum participante adicionado.</Typography>
)}
<Modal
  open={showParticipantDetailsModal}
  onClose={() => setShowParticipantDetailsModal(false)}
>
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
      Detalhes do Participante
    </Typography>
    {selectedParticipant && (
      <>
        <Typography><strong>Nome:</strong> {selectedParticipant.name}</Typography>
        <Typography><strong>Email:</strong> {selectedParticipant.email}</Typography>
        <Typography>
          <strong>Status de Confirmação:</strong>{' '}
          {selectedParticipant.UserViagem?.confirmada ? 'Confirmado' : 'Não Confirmado'}
        </Typography>
      </>
    )}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
      <Button
        variant="outlined"
        onClick={() => setShowParticipantDetailsModal(false)}
        sx={{
          color: '#f44336',
          borderColor: '#f44336',
          '&:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
          },
        }}
      >
        Fechar
      </Button>
    </Box>
  </Box>
</Modal>
  </Box>
</Modal>

    </Box>
  );
};

export default ViagensList;