import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Box, Typography, Paper, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import { Plus } from 'lucide-react';
import Button from '../../Common/Button';

interface Period {
  start: number;
  end: number;
  color: string;
  name?: string;
}

interface PlantillaPageCalendarioProps {
  plantilla: any;
  onWeekSelect: (weekNumber: number) => void;
  onPeriodsChange?: (periods: Period[]) => void;
  periods?: Period[]; // Add this prop to receive periods from parent
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
  },
}));

const GridCell = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'isSelected' && 
    prop !== 'isPreview' && 
    prop !== 'background' &&
    prop !== 'isWeekend'
})<{ 
  isSelected?: boolean; 
  isPreview?: boolean; 
  background?: string;
  isWeekend?: boolean;
}>(({ theme, isSelected, isPreview, background, isWeekend }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  background: background || (
    isSelected 
      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
      : isPreview
        ? 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)'
        : isWeekend
          ? alpha(theme.palette.primary.light, 0.02)
          : '#ffffff'
  ),
  border: '1px solid',
  borderColor: isSelected 
    ? '#6366f1'
    : isPreview
      ? '#a5b4fc'
      : alpha(theme.palette.divider, 0.08),
  boxShadow: isSelected
    ? '0 12px 24px ' + alpha(theme.palette.primary.main, 0.2)
    : '0 4px 12px ' + alpha(theme.palette.primary.main, 0.05),
}));

const WeekHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
  borderBottom: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.08),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontWeight: 600,
  color: theme.palette.primary.main,
  position: 'relative',
  overflow: 'hidden',
}));

const PlantillaPageCalendario: React.FC<PlantillaPageCalendarioProps> = ({ 
  plantilla,
  onWeekSelect,
  onPeriodsChange,
  periods = [] // Default to empty array if not provided
}) => {
  const { theme } = useTheme();
  console.log("PlantillaPageCalendario: Received periods:", periods);
  console.log("PlantillaPageCalendario: Received plantilla:", plantilla);
  
  const getMaxWeekFromRangos = () => {
    if (!plantilla?.rangos || plantilla.rangos.length === 0) {
      return plantilla?.totalWeeks || 4;
    }
    
    // Find the highest semanaFin value in all rangos
    const maxWeek = Math.max(...plantilla.rangos.map(rango => rango.semanaFin || 0));
    console.log("Maximum week from rangos:", maxWeek);
    
    // Return at least 1 week if no valid weeks found
    return maxWeek > 0 ? maxWeek : (plantilla?.totalWeeks || 4);
  };

  const [totalWeeks, setTotalWeeks] = useState(getMaxWeekFromRangos());
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<Period[]>(periods);
  const [currentSelection, setCurrentSelection] = useState<{start: number | null; end: number | null}>({
    start: null,
    end: null
  });

  // Convert rangos to periods format when plantilla changes
  useEffect(() => {
    if (plantilla?.rangos && plantilla.rangos.length > 0) {
      // Map rangos to periods format
      const periodsFromRangos = plantilla.rangos.map((rango, index) => {
        // Calculate start day number (weeks are 1-indexed, days are 1-indexed)
        const start = ((rango.semanaInicio - 1) * 7) + rango.diaInicio;
        
        // Calculate end day number
        const end = ((rango.semanaFin - 1) * 7) + rango.diaFin;
        
        // Assign a color based on index
        const color = periodColors[index % periodColors.length];
        
        return {
          start,
          end,
          color,
          name: rango.nombre,
          _id: rango._id
        };
      });
      
      console.log('Periods converted from rangos:', periodsFromRangos);
      setSelectedPeriods(periodsFromRangos);
    }
  }, [plantilla]);

  // Update totalWeeks if plantilla or rangos change
  useEffect(() => {
    setTotalWeeks(getMaxWeekFromRangos());
  }, [plantilla]);
  
  const periodColors = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  ];
  
  const getNextColor = () => {
    const usedColors = selectedPeriods.map(p => p.color);
    return periodColors.find(color => !usedColors.includes(color)) || periodColors[0];
  };
  const [locallyModified, setLocallyModified] = useState(false);

  // Notificar cambios en los períodos
  useEffect(() => {
    console.log("PlantillaPageCalendario: selectedPeriods changed", selectedPeriods);
    if (onPeriodsChange && locallyModified) {
      console.log("PlantillaPageCalendario: notifying parent of period changes");
      onPeriodsChange(selectedPeriods);
      setLocallyModified(false);
    }
  }, [selectedPeriods, onPeriodsChange, locallyModified]);
  const isDayInExistingPeriod = (dayNumber: number) => {
    return selectedPeriods.some(period => 
      dayNumber >= period.start && dayNumber <= period.end
    );
  };


  const handleDayClick = async (dayNumber: number, weekNumber: number) => {
    // Check if the day is already part of an existing period
    if (isDayInExistingPeriod(dayNumber)) {
      console.log(`Día ${dayNumber} ya forma parte de un período existente`);
      return; // Exit the function early if the day is already in a period
    }
    
    if (!currentSelection.start) {
      // Iniciamos una nueva selección
      setCurrentSelection({
        start: dayNumber,
        end: dayNumber
      });
    } else {
      // Completamos la selección actual
      const start = Math.min(currentSelection.start, dayNumber);
      const end = Math.max(currentSelection.start, dayNumber);
      
      // Check if any day in the range is already part of an existing period
      let rangeHasExistingPeriod = false;
      for (let day = start; day <= end; day++) {
        if (isDayInExistingPeriod(day)) {
          rangeHasExistingPeriod = true;
          break;
        }
      }
      
      if (rangeHasExistingPeriod) {
        console.log('La selección incluye días que ya forman parte de un período existente');
        // Reset the current selection
        setCurrentSelection({
          start: null,
          end: null
        });
        return;
      }
      
      // Calculamos las semanas y días para el API
      const startWeek = Math.floor((start - 1) / 7) + 1;
      const startDay = ((start - 1) % 7) + 1;
      const endWeek = Math.floor((end - 1) / 7) + 1;
      const endDay = ((end - 1) % 7) + 1;
      
      // Añadimos el nuevo período a la lista de períodos seleccionados con un color único
      const newPeriod = { 
        start, 
        end,
        color: getNextColor()
      };
      
      try {
        // Realizar la petición a la API
        const token = localStorage.getItem('token');
        if (!token || !plantilla?._id) {
          throw new Error('No se encontró el token o ID de plantilla');
        }
        
        const periodNumber = selectedPeriods.length + 1;
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${plantilla._id}/rangos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: `Periodo ${periodNumber}`,
            semanaInicio: startWeek,
            diaInicio: startDay,
            semanaFin: endWeek,
            diaFin: endDay,
            days: []
          })
        });
        
        if (!response.ok) {
          throw new Error('Error al crear el periodo');
        }
        
        // Si la petición fue exitosa, actualizamos el estado local
        const updatedPeriods = [...selectedPeriods, newPeriod];
        setSelectedPeriods(updatedPeriods);
        setLocallyModified(true);
        
        if (onPeriodsChange) {
          onPeriodsChange(updatedPeriods);
        }
        
        // Calculamos las semanas afectadas para la vista
        const viewStartWeek = Math.floor(start / 7) + 1;
        const viewEndWeek = Math.floor(end / 7) + 1;
        
        // Notificamos todas las semanas seleccionadas
        for (let week = viewStartWeek; week <= viewEndWeek; week++) {
          onWeekSelect(week);
        }
        
      } catch (error) {
        console.error('Error al crear el periodo:', error);
      } finally {
        // Reseteamos la selección actual
        setCurrentSelection({
          start: null,
          end: null
        });
      }
    }
  };
  const handleAddWeek = () => {
    // Simply increment the total weeks without making an API call
    setTotalWeeks(prev => prev + 1);
    console.log('Semana añadida localmente, nuevo total:', totalWeeks + 1);
  };

  const getPeriodColor = (dayNumber: number) => {
    const period = selectedPeriods.find(p => 
      dayNumber >= p.start && dayNumber <= p.end
    );
    return period?.color;
  };

  const isDaySelected = (dayNumber: number) => {
    // Verificar si el día está en la selección actual
    if (currentSelection.start !== null) {
      const start = Math.min(currentSelection.start, currentSelection.end || currentSelection.start);
      const end = Math.max(currentSelection.start, currentSelection.end || currentSelection.start);
      if (dayNumber >= start && dayNumber <= end) return true;
    }
    
    // Verificar si el día está en algún período seleccionado previamente
    return selectedPeriods.some(period => 
      dayNumber >= period.start && dayNumber <= period.end
    );
  };

  const isDayInSelectedWeek = (dayNumber: number) => {
    const weekNumber = Math.floor(dayNumber / 7) + 1;
    return selectedWeek === weekNumber;
  };

const handleWeekClick = async (weekNumber: number) => {
  setSelectedWeek(weekNumber);
  onWeekSelect(weekNumber);
  
  // Seleccionamos automáticamente todos los días de la semana
  const startDay = (weekNumber - 1) * 7 + 1;
  const endDay = weekNumber * 7;
  
  // Añadimos la semana completa a los períodos seleccionados con un color único
  const newPeriod = { 
    start: startDay, 
    end: endDay,
    color: getNextColor()
  };
  
  try {
    // Realizar la petición a la API
    const token = localStorage.getItem('token');
    if (!token || !plantilla?._id) {
      throw new Error('No se encontró el token o ID de plantilla');
    }
    
    const periodNumber = selectedPeriods.length + 1;
    const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${plantilla._id}/rangos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: `Periodo ${periodNumber}`,
        semanaInicio: weekNumber,
        diaInicio: 1,
        semanaFin: weekNumber,
        diaFin: 7,
        days: []
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al crear el periodo');
    }
    
    // Si la petición fue exitosa, actualizamos el estado local
    const updatedPeriods = [...selectedPeriods, newPeriod];
    setSelectedPeriods(updatedPeriods);
    setLocallyModified(true);
    
    if (onPeriodsChange) {
      onPeriodsChange(updatedPeriods);
    }
    
  } catch (error) {
    console.error('Error al crear el periodo:', error);
  }
};

  const isWeekend = (dayNumber: number) => {
    const dayOfWeek = dayNumber % 7;
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Si no hay plantilla, mostrar un mensaje de carga o estado vacío
  if (!plantilla) {
    return (
      <Box sx={{ my: 3 }}>
        <StyledPaper elevation={0}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No hay plantilla disponible</Typography>
          </Box>
        </StyledPaper>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 3 }}>
      <StyledPaper elevation={0}>
        <Box sx={{ 
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha('#6366f1', 0.05),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha('#6366f1', 0.2),
            borderRadius: '4px',
            '&:hover': {
              background: alpha('#6366f1', 0.3),
            },
          },
        }}>
          <Box sx={{ minWidth: 800, p: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'auto repeat(7, 1fr)', 
              gap: 2.5 
            }}>
              {/* Header */}
              <WeekHeader>
                <EventIcon />
                <Typography>Semana</Typography>
              </WeekHeader>
              {Array.from({ length: 7 }, (_, i) => (
                <WeekHeader key={i}>
                  <CalendarTodayIcon />
                  <Typography>Día {i + 1}</Typography>
                </WeekHeader>
              ))}

              {/* Grid */}
              {Array.from({ length: totalWeeks }, (_, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  <GridCell
                    onClick={() => handleWeekClick(weekIndex + 1)}
                    isSelected={selectedWeek === weekIndex + 1}
                    onMouseEnter={() => setHoveredWeek(weekIndex + 1)}
                    onMouseLeave={() => setHoveredWeek(null)}
                  >
                    <Typography className="week-label">
                      Semana {weekIndex + 1}
                    </Typography>
                  </GridCell>
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const dayNumber = weekIndex * 7 + dayIndex + 1;
                    const displayDayNumber = dayNumber;
                    const periodColor = getPeriodColor(dayNumber);
                    return (
                      <GridCell
                        key={dayIndex}
                        isWeekend={isWeekend(dayIndex + 1)}
                        isSelected={isDaySelected(dayNumber) || isDayInSelectedWeek(dayNumber)}
                        onClick={() => handleDayClick(dayNumber, weekIndex + 1)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          background: periodColor || 'inherit',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <Typography sx={{ 
                          color: periodColor ? 'white' : 'inherit',
                          fontWeight: periodColor ? 600 : 'inherit'
                        }}>
                          Día {displayDayNumber}
                        </Typography>
                      </GridCell>
                    );
                  })}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="create"
            onClick={handleAddWeek}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Añadir Semana
          </Button>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export { PlantillaPageCalendario };