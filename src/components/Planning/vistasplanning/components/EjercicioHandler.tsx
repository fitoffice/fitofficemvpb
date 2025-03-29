import React from 'react';
import {
  Box,
  Typography,
  Zoom,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '../../../Common/Button';

interface EjercicioHandlerProps {
  selectedWeeks: any[];
  setSelectedWeeks: React.Dispatch<React.SetStateAction<any[]>>;
  onPeriodsChange: (periods: any[]) => void;
  editingPeriodIndex: number | null;
  setEditingPeriodIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editingExercise: any;
  setEditingExercise: React.Dispatch<React.SetStateAction<any>>;
  handleApplyExercise: (periodId: string, exerciseId: string) => Promise<void>;
}

export const EjercicioHandler: React.FC<EjercicioHandlerProps> = ({
  selectedWeeks,
  setSelectedWeeks,
  onPeriodsChange,
  editingPeriodIndex,
  setEditingPeriodIndex,
  editingExercise,
  setEditingExercise,
  handleApplyExercise
}) => {
  const theme = useTheme();

  const handleExerciseUpdate = (updatedExercise: any) => {
    console.log('VistaEstadisticas - Updating Exercise:', {
      updatedExercise,
      editingPeriodIndex,
      currentPeriods: selectedWeeks
    });
    
    if (editingPeriodIndex !== null) {
      const updatedPeriods = [...selectedWeeks];
      const periodExercises = updatedPeriods[editingPeriodIndex].exercises || [];
      const exerciseIndex = periodExercises.findIndex(ex => ex.id === updatedExercise.id);
      
      console.log('VistaEstadisticas - Exercise Update Details:', {
        periodExercises,
        exerciseIndex,
        foundExercise: exerciseIndex !== -1 ? periodExercises[exerciseIndex] : null
      });
      
      if (exerciseIndex !== -1) {
        periodExercises[exerciseIndex] = updatedExercise;
        updatedPeriods[editingPeriodIndex] = {
          ...updatedPeriods[editingPeriodIndex],
          exercises: periodExercises
        };
        
        console.log('VistaEstadisticas - Updated Periods:', {
          updatedPeriods,
          modifiedPeriod: updatedPeriods[editingPeriodIndex]
        });
        
        setSelectedWeeks(updatedPeriods);
        onPeriodsChange(updatedPeriods);
      }
    }
    setEditingExercise(null);
    setEditingPeriodIndex(null);
  };

  const handleCloseEdit = () => {
    setEditingExercise(null);
    setEditingPeriodIndex(null);
  };

  const handleEditExercise = (ejercicio: any, periodIndex: number) => {
    console.log('VistaEstadisticas - Opening Edit Exercise:', {
      ejercicio,
      periodIndex,
      selectedWeeks
    });
    setEditingExercise(ejercicio);
    setEditingPeriodIndex(periodIndex);
  };

  const renderEjercicio = (ejercicio: any) => {
    if (!ejercicio) return null;
    
    return (
      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
        <Box sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
          borderRadius: '16px',
          p: 2.5,
          mb: 2,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.1),
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          }
        }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FitnessCenterIcon sx={{ 
                fontSize: 24,
                color: 'primary.main',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(90deg, #1a237e 30%, #311b92 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {ejercicio.nombre || 'Sin nombre'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleApplyExercise(selectedWeeks[editingPeriodIndex || 0].id, ejercicio.id)}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 3
                }}
              >
                Aplicar Ejercicio
              </Button>
              <IconButton
                aria-label="Editar ejercicio"
                onClick={() => handleEditExercise(ejercicio, selectedWeeks.findIndex(period => 
                  period.exercises?.some(ex => ex.id === ejercicio.id)
                ))}
                disabled={!ejercicio.ejercicioId}
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  },
                  '&.Mui-disabled': {
                    background: alpha(theme.palette.action.disabled, 0.1),
                  }
                }}
              >
                <EditIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            gap: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {ejercicio.detalles?.grupoMuscular?.map((musculo: string, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      height: '28px',
                      background: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                      fontSize: '0.75rem',
                    }}
                  >
                    <FitnessCenterIcon sx={{ fontSize: 16 }} />
                    {musculo}
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  background: alpha(theme.palette.secondary.main, 0.04),
                  padding: '6px 12px',
                  borderRadius: '10px'
                }}>
                  <AccessTimeIcon sx={{ 
                    fontSize: 18, 
                    color: 'secondary.main',
                    opacity: 0.8
                  }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: 'secondary.main'
                    }}
                  >
                    {ejercicio.apariciones} {ejercicio.apariciones === 1 ? 'vez' : 'veces'} en este periodo
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  background: alpha(theme.palette.secondary.main, 0.04),
                  padding: '6px 12px',
                  borderRadius: '10px'
                }}>
                  <CalendarTodayIcon sx={{ 
                    fontSize: 18, 
                    color: 'secondary.main',
                    opacity: 0.8
                  }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: 'secondary.main'
                    }}
                  >
                    Semana {ejercicio.semana}
                  </Typography>
                </Box>
              </Box>
              
              {ejercicio.detalles?.descripcion && (
                <Box sx={{ 
                  mt: 2,
                  p: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%)',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.1)
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: alpha(theme.palette.text.primary, 0.7),
                      fontStyle: 'italic',
                      lineHeight: 1.6
                    }}
                  >
                    {ejercicio.detalles.descripcion}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Zoom>
    );
  };

  return {
    handleExerciseUpdate,
    handleCloseEdit,
    handleEditExercise,
    renderEjercicio
  };
};

export default EjercicioHandler;