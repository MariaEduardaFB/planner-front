import React, { useEffect, useState } from 'react';
import { Box, Button, Snackbar } from '@mui/material';
import ViagemTable from './ViagemTable';
import ViagemForm from './viagemForm';
import ViagemDetailsModal from './ViagemDetailsModal';
import AddParticipantModal from './AddParticipantModal';
import ActivityModal from './ActivityModal';
import ParticipantDetailsModal from './ParticipantDetailsModal';
import ConfirmModal from './ConfirmModal';
import useStyles from './styles';
import api from '../../services/api';

const ViagensList = () => {
  const classes = useStyles();
  const [viagens, setViagens] = useState([]);
  const [currentViagem, setCurrentViagem] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openAddParticipantModal, setOpenAddParticipantModal] = useState(false);
  const [openParticipantInfoModal, setOpenParticipantInfoModal] = useState(false);
  const [openEditActivityModal, setOpenEditActivityModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [openActivityModal, setOpenActivityModal] = useState(false);

  const [openAddActivityModal, setOpenAddActivityModal] = useState(false);
  const [selectedViagem, setSelectedViagem] = useState(null);

  const userType = localStorage.getItem('userType') || 'convidado';

  const handleAddActivityClick = (viagem) => {
    setSelectedViagem(viagem);
    setOpenAddActivityModal(true);
  };

  useEffect(() => {
    fetchViagens();
  }, []);

  const fetchViagens = async () => {
    try {
      const response = await api.get('/viagens');
      setViagens(response.data.viagens);
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
    }
  };

  const handleCreateViagem = async (formData) => {
    try {
      await api.post('/viagem', formData);
      setOpenCreateModal(false);
      fetchViagens();
    } catch (error) {
      console.error('Erro ao criar viagem:', error);
    }
  };

  const handleUpdateViagem = async (formData) => {
    try {
      await api.put(`/viagem/${formData.id}`, formData);
      setViagens((prevViagens) =>
        prevViagens.map((viagem) =>
          viagem.id === formData.id ? { ...viagem, ...formData } : viagem
        )
      );
      setOpenCreateModal(false);
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
    }
  };

  const handleDeleteViagem = async (viagem) => {
    try {
      await api.delete(`/viagem/${viagem.id}`);
      setViagens((prevViagens) => prevViagens.filter((v) => v.id !== viagem.id));
      setConfirmationMessage('Viagem excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir viagem:', error);
      setConfirmationMessage('Erro ao excluir viagem.');
    }
  };

  const handleViewParticipantInfo = (participant) => {
    setSelectedParticipant(participant || {});
    setOpenParticipantInfoModal(true);
  };

  const handleConfirmPresenca = async (viagem) => {
    try {
      const response = await api.post(`/viagens/${viagem.id}/confirmar`);
      const mensagem = response.data.message;
  
      setViagens((prevViagens) =>
        prevViagens.map((v) =>
          v.id === viagem.id ? { ...v, confirmada: true } : v
        )
      );
  
      setConfirmationMessage(mensagem || 'Presença confirmada com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      setConfirmationMessage('Erro ao confirmar presença.');
    }
  };

  return (
    <Box className={classes.root}>
      {userType === 'organizador' && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          mb: 2, 
          marginRight: 18,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentViagem(null);
            setOpenCreateModal(true);
          }}
          sx={{
            background: 'linear-gradient(135deg, #0a192f 0%, #2575fc 100%)',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #2575fc 0%, #0a192f 100%)',
            },
          }}
        >
          Nova Viagem
        </Button>
      </Box>
    )}

      <ViagemTable
        viagens={viagens}
        onEdit={(viagem) => {
          setCurrentViagem(viagem);
          setOpenCreateModal(true);
        }}
        onDetails={(viagem) => {
          setCurrentViagem(viagem);
          setOpenDetailsModal(true);
        }}
        onAddParticipant={(viagem) => {
          setCurrentViagem(viagem);
          setOpenAddParticipantModal(true);
        }}
        onDelete={handleDeleteViagem}
        onConfirm={handleConfirmPresenca}
        userType={userType} 
      />

      <ViagemForm
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={currentViagem ? handleUpdateViagem : handleCreateViagem}
        initialData={currentViagem}
        isEdit={!!currentViagem}
      />

      <ViagemDetailsModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        viagem={currentViagem}
        onAddActivity={() => setOpenEditActivityModal(true)}
        userType={userType} 
      />

      <AddParticipantModal
        open={openAddParticipantModal}
        onClose={() => setOpenAddParticipantModal(false)}
        viagem={currentViagem}
        onParticipantAdded={fetchViagens}
      />

      <ParticipantDetailsModal
        open={openParticipantInfoModal}
        onClose={() => setOpenParticipantInfoModal(false)}
        participant={selectedParticipant || {}}
      />

      <ActivityModal
        open={openActivityModal}
        onClose={() => setOpenActivityModal(false)}
        viagem={currentViagem}
        activity={selectedActivity}
        onActivityUpdated={(novaOuAtualizada) => {
          if (novaOuAtualizada.dataAtividade && !isNaN(new Date(novaOuAtualizada.dataAtividade).getTime())) {
            novaOuAtualizada.dataAtividade = new Date(novaOuAtualizada.dataAtividade);
          } else {
            console.warn('Data inválida recebida do backend:', novaOuAtualizada.dataAtividade);
            novaOuAtualizada.dataAtividade = null;
          }

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

      <Snackbar
        open={!!confirmationMessage}
        autoHideDuration={3000}
        onClose={() => setConfirmationMessage('')}
        message={confirmationMessage}
      />
    </Box>
  );
};

export default ViagensList;
