import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ParticipantDetailsModal = ({ open, onClose, participant }) => {
  if (!participant) return null;

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
          Detalhes do Participante
        </Typography>
        <Typography><strong>Nome:</strong> {participant.name}</Typography>
        <Typography><strong>E-mail:</strong> {participant.email}</Typography>
        <Typography>
          <strong>Status:</strong>{' '}
          <span style={{ color: participant.UserViagem.confirmada ? '#4caf50' : '#f44336' }}>
            {participant.UserViagem.confirmada ? 'Confirmado' : 'Não Confirmado'}
          </span>
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ParticipantDetailsModal;