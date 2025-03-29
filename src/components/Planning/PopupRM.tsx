import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RMData {
  _id: string;
  cliente: {
    _id: string;
    nombre: string;
    planningActivo?: {
      _id: string;
      nombre: string;
      descripcion: string;
      fechaInicio: string;
      meta: string;
      semanas: number;
    };
  };
  ejercicio: {
    _id: string;
    nombre: string;
  };
  trainer: {
    _id: string;
    nombre: string;
  };
  rm: number;
  fecha: string;
}

interface PopupRMProps {
  isOpen?: boolean;
  onClose: () => void;
  planningId: string;
}

const PopupRM: React.FC<PopupRMProps> = ({ isOpen = false, onClose, planningId }) => {
  const [rmData, setRmData] = useState<RMData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRMData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/rms', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos de RM');
        }

        const data = await response.json();
        setRmData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchRMData();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            Registro de RMs
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" my={3}>
            <Typography>Cargando datos...</Typography>
          </Box>
        )}

        {error && (
          <Box display="flex" justifyContent="center" my={3}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {!loading && !error && (
          <Grid container spacing={2}>
            {rmData.map((rm) => (
              <Grid item xs={12} key={rm._id}>
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Cliente:
                      </Typography>
                      <Typography>{rm.cliente.nombre}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Ejercicio:
                      </Typography>
                      <Typography>{rm.ejercicio.nombre}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        RM:
                      </Typography>
                      <Typography>{rm.rm} kg</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Fecha:
                      </Typography>
                      <Typography>
                        {new Date(rm.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PopupRM;
