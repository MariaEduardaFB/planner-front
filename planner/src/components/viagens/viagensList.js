import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar } from '@mui/material';
import ViagemTable from './ViagemTable';
import ViagemForm from './viagemForm';
import ViagemDetailsModal from './ViagemDetailsModal';
import AddParticipantModal from './AddParticipantModal';
import ActivityModal from './ActivityModal';
import ParticipantDetailsModal from './ParticipantDetailsModal';
import useStyles from './styles';
import api from '../../services/api';

const ViagensList = () => {
  const classes = useStyles();
  const [viagens, setViagens] = useState([]);
  const [currentViagem, setCurrentViagem] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openAddParticipantModal, setOpenAddParticipantModal] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const [openParticipantDetailsModal, setOpenParticipantDetailsModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

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

  return (
    <Box className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateModal(true)}
      >
        Nova Viagem
      </Button>

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
      />

      <ViagemForm
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={fetchViagens}
        initialData={currentViagem}
      />

      <ViagemDetailsModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        viagem={currentViagem}
        onAddActivity={() => setOpenActivityModal(true)}
      />

      <AddParticipantModal
        open={openAddParticipantModal}
        onClose={() => setOpenAddParticipantModal(false)}
        viagem={currentViagem}
        onParticipantAdded={fetchViagens}
      />

      <ActivityModal
        open={openActivityModal}
        onClose={() => setOpenActivityModal(false)}
        viagem={currentViagem}
        onActivityAdded={fetchViagens}
      />

      <ParticipantDetailsModal
        open={openParticipantDetailsModal}
        onClose={() => setOpenParticipantDetailsModal(false)}
        participant={selectedParticipant}
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