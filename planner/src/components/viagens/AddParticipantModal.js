import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const AddParticipantModal = ({ open, onClose, viagem, onParticipantAdded }) => {
  const [email, setEmail] = useState('');

  const handleAddParticipant = async () => {
    try {
      // Simula a chamada para adicionar participante
      console.log(`Adicionando participante com email: ${email} à viagem ${viagem.id}`);
      onParticipantAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          Adicionar Participante
        </Typography>
        <TextField
          label="E-mail do Participante"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleAddParticipant}
            sx={{ mr: 2 }}
          >
            Adicionar
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddParticipantModal;