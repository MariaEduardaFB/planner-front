import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import api from '../../services/api';

const AddParticipantModal = ({ open, onClose, viagem, onParticipantAdded }) => {
  const [email, setEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  const handleAddParticipant = async () => {
    if (!viagem || !viagem.id) {
      setInviteError('A viagem precisa ser selecionada antes de convidar participantes.');
      setInviteSuccess(false);
      return;
    }

    if (!email) {
      setInviteError('O e-mail do participante é obrigatório.');
      setInviteSuccess(false);
      return;
    }

    try {
      console.log('ID da viagem:', viagem.id);
      console.log('E-mail do participante:', email);

      await api.post(`/user-viagem/${viagem.id}`, { email });
      setInviteSuccess('Participante adicionado com sucesso!');
      setInviteError('');
      setEmail(''); // Limpa o campo de e-mail
      onParticipantAdded(); // Atualiza a lista de participantes
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao convidar participante:', error);
      setInviteError(error.response?.data?.message || 'Erro ao convidar participante.');
      setInviteSuccess(false);
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
            bgcolor: '#0a192f', // Cor de fundo do modal (alterada para um tom escuro)
            color: '#ffffff', // Cor do texto no modal
            boxShadow: 24,
            p: 4,
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)', // Borda sutil para destacar o modal
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
          sx={{
            mb: 3,
            '& .MuiInputBase-input': {
              color: '#ffffff', // Cor do texto do input
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff', // Cor do rótulo (label)
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ffffff', // Cor da borda
              },
              '&:hover fieldset': {
                borderColor: '#64ffda', // Cor da borda ao passar o mouse
              },
              '&.Mui-focused fieldset': {
                borderColor: '#64ffda', // Cor da borda ao focar
              },
            },
          }}
        />
        {inviteError && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {inviteError}
          </Typography>
        )}
        {inviteSuccess && (
          <Typography color="success" variant="body2" sx={{ mb: 2 }}>
            {inviteSuccess}
          </Typography>
        )}
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