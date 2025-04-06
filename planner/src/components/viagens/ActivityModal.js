import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const ActivityModal = ({ open, onClose, viagem, onActivityAdded }) => {
  const [activity, setActivity] = useState({ titulo: '', descricao: '' });

  const handleAddActivity = async () => {
    try {
      // Simula a chamada para adicionar atividade
      console.log(`Adicionando atividade: ${activity.titulo} à viagem ${viagem.id}`);
      onActivityAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
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
          Adicionar Atividade
        </Typography>
        <TextField
          label="Título"
          name="titulo"
          fullWidth
          value={activity.titulo}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />
        <TextField
          label="Descrição"
          name="descricao"
          fullWidth
          multiline
          rows={3}
          value={activity.descricao}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleAddActivity}
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

export default ActivityModal;