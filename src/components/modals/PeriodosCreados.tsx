import React, { useEffect, useState } from 'react';
import { Period } from '../../types/planning';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import EditExercisePopup from './EditExercisePopup';
import VariantesEjerciciosPeriodos from './VariantesEjerciciosPeriodos';
import { Box, Typography, Paper, IconButton, Collapse, Button, Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Set {
  reps: number;
  weight: number;
  rest: number;
  tempo?: string;
  rpe?: number;
}

interface ExerciseDetails {
  nombre: string;
  sets: Set[];
  _id: string;
  exerciseId: string;
  rm?: number;
  relativeWeight?: number;
  variant?: {
    type: string;
    percentage?: number;
    initialWeight?: number;
    remainingWeight?: number;
    incrementType?: 'porcentaje' | 'peso_fijo' | null;
    incrementValue?: number;
  };
  periodId?: number;
}

interface Exercise {
  _id: string;
  nombre: string;
  tipo?: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  imgUrl?: string;
  fechaCreacion?: string;
  sets: {
    _id: string;
    reps: number;
    weight: number;
    rest: number;
    tempo?: string;
    rir?: number;
    rpe?: number;
    completed?: boolean;
    round?: number;
  }[];
}

interface Session {
  _id: string;
  exercises: Exercise[];
}

interface PeriodosCreadosProps {
  periodos?: Period[];
  onBack: () => void;
}

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: '#ffffff',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const PeriodosCreados: React.FC<PeriodosCreadosProps> = ({ periodos = [], onBack }) => {
  const [expandedExercises, setExpandedExercises] = useState<{ [key: string]: boolean }>({});

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ mb: 3, borderRadius: '20px' }}
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Periodos Creados
        </Typography>
      </Box>

      {periodos.length === 0 ? (
        <StyledPaper>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No hay periodos creados
            </Typography>
          </Box>
        </StyledPaper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {periodos.map((periodo, index) => (
            <AnimatedBox key={index}>
              <StyledPaper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {periodo.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Semanas: {periodo.start} - {periodo.end}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {periodo.exercises?.map((exercise, exerciseIndex) => (
                      <Paper 
                        key={exerciseIndex}
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(0,0,0,0.02)',
                          borderRadius: '12px'
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleExercise(exercise._id)}
                        >
                          <Typography variant="subtitle1">
                            {exercise.nombre}
                          </Typography>
                          <IconButton size="small">
                            {expandedExercises[exercise._id] ? <ChevronUp /> : <ChevronDown />}
                          </IconButton>
                        </Box>

                        <Collapse in={expandedExercises[exercise._id]}>
                          <Box sx={{ mt: 2, pl: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Grupos musculares: {exercise.grupoMuscular.join(', ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Equipo necesario: {exercise.equipo.join(', ')}
                            </Typography>
                          </Box>
                        </Collapse>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </StyledPaper>
            </AnimatedBox>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PeriodosCreados;
