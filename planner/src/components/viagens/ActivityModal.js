import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import api from '../../services/api';

const ActivityModal = ({ open, onClose, viagem, activity: initialActivity = null, onActivityUpdated }) => {
  const isEditing = !!initialActivity;

  const [activity, setActivity] = useState({
    dataAtividade: null,
    titulo: '',
    viagemId: viagem?.id || null,
  });

  useEffect(() => {
    if (isEditing) {
      setActivity({
        dataAtividade: initialActivity?.dataAtividade ? new Date(initialActivity.dataAtividade) : null,
        titulo: initialActivity?.titulo || '',
        viagemId: initialActivity?.viagemId || viagem?.id || null,
        id: initialActivity?.id,
      });
    } else {
      setActivity({
        dataAtividade: null,
        titulo: '',
        viagemId: viagem?.id || null,
      });
    }
  }, [initialActivity, viagem, isEditing]);

  const handleSave = async () => {
    try {
      const formattedActivity = {
        ...activity,
        dataAtividade: activity.dataAtividade ? activity.dataAtividade.toISOString() : null,
      };

      if (isEditing) {
        const response = await api.put(`/atividade/${activity.id}`, formattedActivity);
        onActivityUpdated(response.data);
      } else {
        const response = await api.post('/atividade', formattedActivity);
        onActivityUpdated(response.data);
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value) => {
    setActivity((prev) => ({ ...prev, dataAtividade: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
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
            {isEditing ? 'Editar Atividade' : 'Adicionar Atividade'}
          </Typography>

          <DatePicker
            label="Data da Atividade"
            value={activity.dataAtividade}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
          />

          <TextField
            label="Título"
            name="titulo"
            fullWidth
            value={activity.titulo}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Modal>
  );
};

export default ActivityModal;
