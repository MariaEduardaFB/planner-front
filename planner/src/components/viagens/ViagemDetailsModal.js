import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ViagemDetailsModal = ({ open, onClose, viagem, onAddActivity }) => {
  if (!viagem) return null;

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
          Detalhes da Viagem
        </Typography>
        <Typography><strong>País:</strong> {viagem.pais}</Typography>
        <Typography><strong>Estado:</strong> {viagem.estado}</Typography>
        <Typography><strong>Cidade:</strong> {viagem.cidade}</Typography>
        <Typography><strong>Data de Início:</strong> {viagem.dataInicio}</Typography>
        <Typography><strong>Data Final:</strong> {viagem.dataFinal}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={onAddActivity}
            sx={{ mr: 2 }}
          >
            Adicionar Atividade
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViagemDetailsModal;