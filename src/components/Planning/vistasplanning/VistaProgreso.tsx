import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Chip, IconButton, LinearProgress, Fade, Zoom } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';

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

interface NewRM {
  ejercicio: string;
  rm: number;
}

interface VistaProgresoProps {
  planSemanal: { [key: string]: DayPlan };
  clientId?: string; // Optional in case it's not always available
  planningId?: string; // Optional in case it's not always available
}
// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(145deg, #f0f4ff 0%, #ffffff 100%)',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 50%)',
    zIndex: 0,
  },
  '& .MuiPaper-root': {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 1,
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #0d47a1 50%, #1976d2 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.01)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
    '&::before': {
      opacity: 1,
    }
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  }
}));

const StyledTableContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  background: '#ffffff',
  margin: '24px 0',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
  },
  '& table': {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    '& thead': {
      background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
      '& th': {
        color: '#ffffff',
        padding: '20px 24px',
        fontWeight: 600,
        fontSize: '0.95rem',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        textAlign: 'left',
        transition: 'all 0.3s ease',
        '&:last-child': {
          textAlign: 'right'
        }
      }
    },
    '& tbody tr': {
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
        '& td': {
          color: theme.palette.primary.main,
        }
      },
      '& td': {
        padding: '20px 24px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        '&:last-child': {
          textAlign: 'right',
          color: theme.palette.primary.main,
          fontWeight: 600,
        }
      }
    }
  }
}));

const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  '@keyframes slideUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(40px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
  padding: theme.spacing(4),
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  position: 'relative',
  overflow: 'visible',
  zIndex: 1,
  '& .header-content': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '& .MuiTypography-h4': {
    background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    position: 'relative',
    zIndex: 1,
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '12px 32px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  letterSpacing: '0.5px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
  color: '#ffffff',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  zIndex: 2,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    background: 'linear-gradient(135deg, #1976d2 0%, #1a237e 100%)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
    boxShadow: '0 5px 12px rgba(0,0,0,0.2)',
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    padding: theme.spacing(2),
    background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
  },
  '& .MuiDialogTitle-root': {
    background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2, 3),
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: theme.palette.primary.main,
      }
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    }
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    }
  }
}));

const VistaProgreso: React.FC<VistaProgresoProps> = ({ planSemanal, clientId: propClientId, planningId }) => {
  const [rmData, setRmData] = useState<RMData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRM, setNewRM] = useState<NewRM>({
    ejercicio: '',
    rm: 0
  });
  const [ejercicios, setEjercicios] = useState<Array<{ _id: string, nombre: string }>>([]);
  const [clientId, setClientId] = useState<string | undefined>(propClientId);
  useEffect(() => {
    const loadData = async () => {
      try {
        // First fetch the client ID if not provided
        if (!clientId && planningId) {
          await fetchClientId();
        }
        await Promise.all([fetchRMData(), fetchEjercicios()]);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, [planningId, clientId]);

  // New function to fetch client ID from planning
  const fetchClientId = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      if (!planningId) {
        throw new Error('No se encontró el ID de la planificación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/client`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener el ID del cliente');
      }

      const data = await response.json();
      if (data && data.clientId) {
        // Store the client ID in component state
        setClientId(data.clientId);
        console.log('Client ID fetched successfully:', data.clientId);
      } else {
        throw new Error('Formato de respuesta inválido al obtener el ID del cliente');
      }
    } catch (err) {
      console.error('Error al obtener el ID del cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener el ID del cliente');
    }
  };


  const fetchEjercicios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener ejercicios');
      }

      const responseData = await response.json();
      
      if (!responseData.data || !Array.isArray(responseData.data)) {
        throw new Error('Formato de datos inválido');
      }
      
      setEjercicios(responseData.data.filter(ejercicio => ejercicio && ejercicio._id && ejercicio.nombre));
    } catch (err) {
      console.error('Error al cargar ejercicios:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar ejercicios');
      setEjercicios([]);
    }
  };

  const fetchRMData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/rms', {
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

  const handleAddRM = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token de autenticación');

      console.log('Adding RM with clientId:', clientId); // Debug log
      
      if (!clientId) {
        throw new Error('No se encontró el ID del cliente');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/rms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ejercicio: newRM.ejercicio,
          rm: newRM.rm,
          planningId,
          cliente: clientId
        }),
      });
      if (!response.ok) throw new Error('Error al añadir RM');

      await fetchRMData();
      setOpenDialog(false);
      setNewRM({ ejercicio: '', rm: 0 });
    } catch (err) {
      console.error('Error al añadir RM:', err);
    }
  };
  const getProgressColor = (rm: number) => {
    if (rm >= 100) return '#4caf50';
    if (rm >= 50) return '#2196f3';
    return '#ff9800';
  };

  const getRMsByExercise = () => {
    if (!Array.isArray(rmData)) {
      console.error('rmData no es un array:', rmData);
      return {};
    }

    const grouped = rmData.reduce((acc, rm) => {
      // Verificar que rm y ejercicio existan y tengan las propiedades necesarias
      if (!rm || !rm.ejercicio || !rm.ejercicio._id || !rm.ejercicio.nombre) {
        console.warn('RM inválido encontrado:', rm);
        return acc;
      }

      const ejercicioId = rm.ejercicio._id;
      if (!acc[ejercicioId]) {
        acc[ejercicioId] = {
          nombre: rm.ejercicio.nombre,
          rms: []
        };
      }

      // Verificar que los datos del RM sean válidos
      if (typeof rm.rm === 'number' && rm.fecha && rm._id) {
        acc[ejercicioId].rms.push({
          rm: rm.rm,
          fecha: rm.fecha,
          _id: rm._id
        });
      }

      return acc;
    }, {} as { [key: string]: { nombre: string, rms: Array<{ rm: number, fecha: string, _id: string }> } });

    // Ordenar los RMs por fecha para cada ejercicio
    Object.values(grouped).forEach(ejercicio => {
      ejercicio.rms.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    });

    return grouped;
  };

  return (
    <StyledContainer>
      <Fade in={true} timeout={1000}>
        <Box>
          <HeaderBox>
            <div className="header-content">
              <Typography variant="h4">
                Seguimiento del progreso de tus ejercicios
              </Typography>
              <StyledButton
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Añadir RM
              </StyledButton>
            </div>
          </HeaderBox>

          <StyledDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2,
              background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Añadir Nuevo RM
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <StyledFormControl fullWidth>
                  <InputLabel>Ejercicio</InputLabel>
                  <Select
                    value={newRM.ejercicio}
                    label="Ejercicio"
                    onChange={(e) => setNewRM({ ...newRM, ejercicio: e.target.value })}
                    sx={{
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    {ejercicios.map((ejercicio) => (
                      <MenuItem key={ejercicio._id} value={ejercicio._id}>
                        {ejercicio.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <StyledTextField
                  label="RM (kg)"
                  type="number"
                  value={newRM.rm}
                  onChange={(e) => setNewRM({ ...newRM, rm: Number(e.target.value) })}
                  fullWidth
                  InputProps={{
                    startAdornment: <FitnessCenterIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setOpenDialog(false)}
                variant="outlined"
                sx={{ 
                  borderRadius: '20px',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddRM} 
                variant="contained" 
                sx={{ 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1976d2 0%, #1a237e 100%)',
                  },
                }}
              >
                Guardar
              </Button>
            </DialogActions>
          </StyledDialog>

          {loading && (
            <Box sx={{ width: '100%', mb: 4 }}>
              <LinearProgress 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
                  }
                }} 
              />
            </Box>
          )}

          {error && (
            <Box sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2, 
              bgcolor: '#ffebee',
              border: '1px solid #ef5350',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          <Zoom in={!loading && !error} timeout={500}>
            <Box>
              {Object.entries(getRMsByExercise()).map(([ejercicioId, { nombre, rms }]) => (
                <StyledTableContainer key={ejercicioId}>
                  <Box sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <FitnessCenterIcon />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {nombre}
                    </Typography>
                  </Box>
                  
                  <table>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>RM (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rms.map((rm) => (
                        <tr key={rm._id}>
                          <td>
                            {new Date(rm.fecha).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td>{rm.rm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </StyledTableContainer>
              ))}
            </Box>
          </Zoom>
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default VistaProgreso;