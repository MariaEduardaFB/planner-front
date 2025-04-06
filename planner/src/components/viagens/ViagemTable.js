import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Info, PersonAdd } from '@mui/icons-material';

const ViagemTable = ({ viagens, onEdit, onDetails, onAddParticipant }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Organizador</TableCell>
            <TableCell>País</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Cidade</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {viagens.map((viagem) => (
            <TableRow key={viagem.id}>
              <TableCell>{viagem.id}</TableCell>
              <TableCell>{viagem.organizador?.name || 'Não informado'}</TableCell>
              <TableCell>{viagem.pais}</TableCell>
              <TableCell>{viagem.estado}</TableCell>
              <TableCell>{viagem.cidade}</TableCell>
              <TableCell>
                <IconButton onClick={() => onDetails(viagem)}>
                  <Info />
                </IconButton>
                <IconButton onClick={() => onEdit(viagem)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onAddParticipant(viagem)}>
                  <PersonAdd />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViagemTable;