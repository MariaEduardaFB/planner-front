import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip
} from '@mui/material';
import { Info, Delete, Edit, Add } from '@mui/icons-material';
import api from '../../services/api';
import ParticipantDetailsModal from './ParticipantDetailsModal';
import ActivityModal from './ActivityModal';

const ViagemDetailsModal = ({ open, onClose, viagem, userType }) => {
  const [atividades, setAtividades] = useState([]);
  const [participantes, setParticipantes] = useState([]);

  const [openParticipantInfoModal, setOpenParticipantInfoModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const [openActivityModal, setOpenActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null); // null = criar nova

  useEffect(() => {
    if (viagem?.id) {
      fetchViagemDetails(viagem.id);
    }
  }, [viagem]);

  const fetchViagemDetails = async (viagemId) => {
    try {
      const response = await api.get(`/viagem/${viagemId}`);
      setAtividades(response.data.viagem.atividades || []);
      setParticipantes(response.data.viagem.convidados || []);
    } catch (error) {
      console.error('Erro ao buscar detalhes da viagem:', error);
    }
  };

  const handleDeleteParticipant = async (userId) => {
    try {
      await api.delete(`/viagens/${viagem.id}/participantes/${userId}`);
      setParticipantes((prev) =>
        prev.filter((p) => p.id !== userId)
      );
    } catch (error) {
      console.error('Erro ao excluir participante:', error);
    }
  };

  const handleDeleteActivity = async (atividadeId) => {
    try {
      await api.delete(`/atividade/${atividadeId}`);
      setAtividades((prev) =>
        prev.filter((a) => a.id !== atividadeId)
      );
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
    }
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setOpenActivityModal(true);
  };

  const handleEditActivity = (atividade) => {
    setSelectedActivity(atividade);
    setOpenActivityModal(true);
  };

  const handleViewParticipantInfo = (participante) => {
    setSelectedParticipant(participante);
    setOpenParticipantInfoModal(true);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#0a192f', // Cor de fundo do modal
    color: '#ffffff', // Cor da fonte
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)', // Borda sutil para destacar o modal
  };

  // Fallback se nenhuma viagem estiver selecionada
  if (!viagem) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Nenhuma viagem selecionada
          </Typography>
          <Button variant="outlined" onClick={onClose}>
            Fechar
          </Button>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>Detalhes da Viagem</Typography>
        <Typography><strong>País:</strong> {viagem.pais}</Typography>
        <Typography><strong>Estado:</strong> {viagem.estado}</Typography>
        <Typography><strong>Cidade:</strong> {viagem.cidade}</Typography>
        <Typography><strong>Data de Início:</strong> {viagem.dataInicio}</Typography>
        <Typography><strong>Data Final:</strong> {viagem.dataFinal}</Typography>

        {/* PARTICIPANTES */}
        <Typography variant="subtitle1" mt={3} mb={2}>Participantes:</Typography>
        <List>
  {participantes.map((p) => (
    <ListItem
      key={p.id}
      secondaryAction={
        <>
          <IconButton onClick={() => handleViewParticipantInfo(p)}>
            <Info />
          </IconButton>
          <IconButton onClick={() => handleDeleteParticipant(p.id)}>
            <Delete />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={p.name}
        secondary={
          <>
            <Typography variant="body2" color="#d3d3d3">
              Email: {p.email}
            </Typography>
            <Typography
              variant="body2"
              color={p.UserViagem?.confirmada ? 'success.main' : 'warning.main'}
            >
              {p.UserViagem?.confirmada ? 'Confirmado' : 'Pendente'}
            </Typography>
          </>
        }
      />
    </ListItem>
  ))}
</List>

        {/* ATIVIDADES */}
        <Typography variant="subtitle1" mt={3} mb={2}>Atividades:</Typography>
        <List>
  {atividades.map((a) => (
    <ListItem
      key={a.id} // Certifique-se de que "a.id" é único
      secondaryAction={
        userType === 'organizador' && (
          <>
            <IconButton onClick={() => handleEditActivity(a)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteActivity(a.id)}>
              <Delete />
            </IconButton>
          </>
        )
      }
    >
      <ListItemText
  primary={a.titulo}
  secondary={
    <Typography variant="body2" sx={{ color: '#d3d3d3' }}>
      Data: {a.dataAtividade ? new Date(a.dataAtividade).toLocaleDateString() : 'Data inválida'}
    </Typography>
  }
/>
    </ListItem>
  ))}
</List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddActivity}
            sx={{ mr: 2 }}
          >
            Adicionar Atividade
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Fechar
          </Button>
        </Box>

        {/* MODAIS */}
        <ParticipantDetailsModal
          open={openParticipantInfoModal}
          onClose={() => setOpenParticipantInfoModal(false)}
          participant={selectedParticipant || {}}
        />

        <ActivityModal
          open={openActivityModal}
          onClose={() => setOpenActivityModal(false)}
          viagem={viagem}
          activity={selectedActivity}
          onActivityUpdated={(novaOuAtualizada) => {
            setAtividades((prev) => {
              const exists = prev.find((a) => a.id === novaOuAtualizada.id);
              if (exists) {
                return prev.map((a) => a.id === novaOuAtualizada.id ? novaOuAtualizada : a);
              } else {
                return [...prev, novaOuAtualizada];
              }
            });
          }}
        />
      </Box>
    </Modal>
  );
};



export default ViagemDetailsModal;
