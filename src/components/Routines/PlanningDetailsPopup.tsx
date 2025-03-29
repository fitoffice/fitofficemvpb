import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { 
  Dumbbell, 
  Timer, 
  Repeat, 
  X as CloseIcon, 
  Info,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface PlanningDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  planningId: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(4px);
`;

const DialogContent = styled.div<{ theme: 'dark' | 'light' }>`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: ${props => props.theme === 'dark' ? '#1F2937' : '#F9FAFB'};
  border: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#E5E7EB'};
  border-radius: 1rem;
  padding: 1.5rem;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease-out;
  z-index: 51;

  @media (max-width: 768px) {
    width: 95%;
    max-height: 95vh;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#374151' : '#F3F4F6'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#4B5563' : '#D1D5DB'};
    border-radius: 3px;
    &:hover {
      background: ${props => props.theme === 'dark' ? '#6B7280' : '#9CA3AF'};
    }
  }
`;

const CloseButton = styled.button<{ theme: 'dark' | 'light' }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 9999px;
  color: ${props => props.theme === 'dark' ? '#9CA3AF' : '#6B7280'};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
    color: ${props => props.theme === 'dark' ? '#F3F4F6' : '#111827'};
  }
`;

const HeaderSection = styled.div<{ theme: 'dark' | 'light' }>`
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#E5E7EB'};
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2<{ theme: 'dark' | 'light' }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#F9FAFB' : '#111827'};
  margin-bottom: 0.5rem;
`;

const Description = styled.p<{ theme: 'dark' | 'light' }>`
  color: ${props => props.theme === 'dark' ? '#9CA3AF' : '#6B7280'};
  font-size: 0.875rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ theme: 'dark' | 'light' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${props => props.theme === 'dark' ? '#374151' : '#F3F4F6'};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div<{ theme: 'dark' | 'light' }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: ${props => props.theme === 'dark' ? '#4B5563' : '#E5E7EB'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme === 'dark' ? '#F9FAFB' : '#111827'};
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div<{ theme: 'dark' | 'light' }>`
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9CA3AF' : '#6B7280'};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div<{ theme: 'dark' | 'light' }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#F9FAFB' : '#111827'};
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ExerciseCard = styled.div<{ theme: 'dark' | 'light' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${props => props.theme === 'dark' ? '#374151' : '#F3F4F6'};
  border: 1px solid ${props => props.theme === 'dark' ? '#4B5563' : '#E5E7EB'};
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ExerciseName = styled.h3<{ theme: 'dark' | 'light' }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#F9FAFB' : '#111827'};
`;

const ExerciseDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const DetailItem = styled.div<{ theme: 'dark' | 'light' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#9CA3AF' : '#6B7280'};
  font-size: 0.875rem;
`;

const PlanningDetailsPopup: React.FC<PlanningDetailsPopupProps> = ({
  open,
  onClose,
  planningId
}) => {
  const { theme } = useTheme();

  if (!open) return null;

  // Datos de ejemplo - reemplazar con datos reales de la API
  const sampleRoutine = {
    title: "Rutina de Entrenamiento Full Body",
    description: "Rutina completa para trabajar todo el cuerpo con énfasis en fuerza y resistencia",
    duration: "60 minutos",
    difficulty: "Intermedio",
    exercises: [
      {
        name: "Press de Banca",
        sets: 4,
        reps: "10-12",
        rest: "90 segundos",
        notes: "Mantener escápulas retraídas"
      },
      {
        name: "Sentadillas",
        sets: 4,
        reps: "12-15",
        rest: "120 segundos",
        notes: "Mantener core activado"
      }
    ]
  };

  const content = (
    <DialogOverlay onClick={onClose}>
      <DialogContent
        theme={theme}
        onClick={e => e.stopPropagation()}
      >
        <CloseButton theme={theme} onClick={onClose}>
          <CloseIcon size={24} />
        </CloseButton>

        <HeaderSection theme={theme}>
          <Title theme={theme}>{sampleRoutine.title}</Title>
          <Description theme={theme}>{sampleRoutine.description}</Description>
        </HeaderSection>

        <StatsGrid>
          <StatCard theme={theme}>
            <StatIcon theme={theme}>
              <Timer size={20} />
            </StatIcon>
            <StatInfo>
              <StatLabel theme={theme}>Duración</StatLabel>
              <StatValue theme={theme}>{sampleRoutine.duration}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard theme={theme}>
            <StatIcon theme={theme}>
              <Dumbbell size={20} />
            </StatIcon>
            <StatInfo>
              <StatLabel theme={theme}>Dificultad</StatLabel>
              <StatValue theme={theme}>{sampleRoutine.difficulty}</StatValue>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <ExerciseList>
          {sampleRoutine.exercises.map((exercise, index) => (
            <ExerciseCard key={index} theme={theme}>
              <ExerciseHeader>
                <ExerciseName theme={theme}>{exercise.name}</ExerciseName>
                <ChevronRight size={20} />
              </ExerciseHeader>
              <ExerciseDetails>
                <DetailItem theme={theme}>
                  <Repeat size={16} />
                  {exercise.sets} series x {exercise.reps} reps
                </DetailItem>
                <DetailItem theme={theme}>
                  <Timer size={16} />
                  Descanso: {exercise.rest}
                </DetailItem>
                {exercise.notes && (
                  <DetailItem theme={theme}>
                    <Info size={16} />
                    {exercise.notes}
                  </DetailItem>
                )}
              </ExerciseDetails>
            </ExerciseCard>
          ))}
        </ExerciseList>
      </DialogContent>
    </DialogOverlay>
  );

  return ReactDOM.createPortal(
    content,
    document.body
  );
};

export default PlanningDetailsPopup;
