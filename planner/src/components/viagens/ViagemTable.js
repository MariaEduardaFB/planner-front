import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Info, PersonAdd, Delete } from '@mui/icons-material';

const ViagemTable = ({ viagens, onEdit, onDetails, onAddParticipant, onDelete, onConfirm, userType }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: '#0a192f', 
        color: '#ffffff', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        width: '80%', 
    margin: '0 auto'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Organizador</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>País</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Cidade</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {viagens.map((viagem) => (
            <TableRow key={viagem.id}
            >
              <TableCell sx={{ color: '#ffffff' }}>{viagem.id}</TableCell>
              <TableCell sx={{ color: '#ffffff' }}>{viagem.organizador?.name || 'Não informado'}</TableCell>
              <TableCell sx={{ color: '#ffffff' }}>{viagem.pais}</TableCell>
              <TableCell sx={{ color: '#ffffff' }}>{viagem.estado}</TableCell>
              <TableCell sx={{ color: '#ffffff' }}>{viagem.cidade}</TableCell>
              <TableCell>
                {/* Todos podem ver os detalhes */}
                <IconButton onClick={() => onDetails(viagem)}>
                  <Info sx={{ color: '	#87CEFA' }} />
                </IconButton>

                {/* Apenas organizadores podem editar, excluir e adicionar participantes */}
                {userType === 'organizador' && (
                  <>
                    <IconButton onClick={() => onEdit(viagem)}>
                      <Edit sx={{ color: 'yellow' }} />
                    </IconButton>
                    <IconButton onClick={() => onAddParticipant(viagem)}>
                      <PersonAdd sx={{ color: '#00FF7F' }} />
                    </IconButton>
                    <IconButton onClick={() => onDelete(viagem)}>
                      <Delete sx={{ color: '#FF0000' }} />
                    </IconButton>
                  </>
                )}

                {/* Apenas convidados (participantes) podem confirmar presença */}
                {userType === 'convidado' && (
                  <IconButton onClick={() => onConfirm(viagem)}>
                    ✅
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViagemTable;