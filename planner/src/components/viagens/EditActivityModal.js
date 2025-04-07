import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const EditActivityModal = ({ open, onClose, activity, onSave }) => {
  const [formData, setFormData] = useState({ titulo: '', dataAtividade: null });

  useEffect(() => {
    if (activity) {
      setFormData({
        titulo: activity.titulo,
        dataAtividade: new Date(activity.dataAtividade),
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (value) => {
    setFormData({ ...formData, dataAtividade: value });
  };

  const handleSubmit = () => {
    onSave({ ...activity, ...formData }); // Chama a função de salvar com os dados atualizados
    onClose(); // Fecha o modal
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
          Editar Atividade
        </Typography>
        <TextField
          label="Título"
          name="titulo"
          fullWidth
          value={formData.titulo}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />
        <TextField
          label="Data da Atividade"
          type="date"
          fullWidth
          value={formData.dataAtividade?.toISOString().split('T')[0] || ''}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>
            Salvar
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditActivityModal;