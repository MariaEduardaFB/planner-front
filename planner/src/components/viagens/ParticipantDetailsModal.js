import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ParticipantDetailsModal = ({ open, onClose, participant = {} }) => {
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
          <Typography>
            <strong>Nome:</strong> {participant.name || 'Não informado'}
          </Typography>
          <Typography>
            <strong>Email:</strong> {participant.email || 'Não informado'}
          </Typography>
          <Typography>
            <strong>Status:</strong>{' '}
            {participant.confirmada ? 'Confirmado' : 'Pendente'}
          </Typography>
          <Button variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
            Fechar
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default ParticipantDetailsModal;