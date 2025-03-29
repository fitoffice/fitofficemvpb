import React, { useState } from 'react';
import { Box, Typography, Paper, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CalendarDays, ChevronRight, ChevronDown, Pencil, Check, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Period {
  start: number;
  end: number;
  color: string;
  name?: string;
  _id?: string; // Add _id property
}

interface PeriodosPlantillaCalendarioProps {
  periods: Period[];
  onPeriodClick?: (period: Period) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onPeriodUpdate?: (updatedPeriod: Period) => void;
  onPeriodDelete?: (periodIndex: number) => void;
  templateId?: string; // Add templateId property

}

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  padding: theme.spacing(3),
}));

const PeriodItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateX(8px)',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const ColorIndicator = styled(Box)<{ background: string }>(({ background }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  background,
  flexShrink: 0,
}));

const PeriodosPlantillaCalendario: React.FC<PeriodosPlantillaCalendarioProps> = ({
  periods,
  onPeriodClick,
  isCollapsed,
  onToggleCollapse,
  onPeriodUpdate,
  onPeriodDelete,
  templateId
}) => {
  console.log("PeriodosPlantillaCalendario: Received periods:", periods);
  console.log("PeriodosPlantillaCalendario: Periods length:", periods.length);
  console.log("PeriodosPlantillaCalendario: Periods details:", JSON.stringify(periods, null, 2));

  const [editingPeriod, setEditingPeriod] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const getWeekNumber = (dayNumber: number) => Math.floor((dayNumber - 1) / 7) + 1;

  const handleEditStart = (period: Period, index: number) => {
    setEditingPeriod(index);
    setEditingName(period.name || `Período ${Math.floor((period.start - 1) / 7) + 1}`);
  };

  const handleEditSave = (period: Period) => {
    if (onPeriodUpdate) {
      onPeriodUpdate({
        ...period,
        name: editingName.trim() || `Período ${Math.floor((period.start - 1) / 7) + 1}`
      });
    }
    setEditingPeriod(null);
  };

  const handleEditCancel = () => {
    setEditingPeriod(null);
    setEditingName('');
  };

  const handlePeriodClick = (period: Period) => {
    if (onPeriodClick) {
      onPeriodClick(period);
    }
  };

  // The handleDeletePeriod function looks correct, but let's enhance it with a confirmation dialog
  const handleDeletePeriod = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const period = periods[index];
    
    // Add confirmation before deleting
    if (window.confirm('¿Estás seguro de que deseas eliminar este período?')) {
      try {
        // Check if we have the necessary data to make the API call
        if (!templateId || !period._id) {
          console.error('Missing templateId or period._id for API call');
          // Still call the parent handler even if API call can't be made
          if (onPeriodDelete) {
            onPeriodDelete(index);
          }
          return;
        }
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        console.log(`Deleting period: ${period._id} from template: ${templateId}`);
        
        // Make the DELETE request to the API
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${templateId}/rangos/${period._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error al eliminar el periodo: ${response.status}`);
        }
        
        console.log('Periodo eliminado correctamente en el servidor');
        
        // Call the parent handler to update the UI
        if (onPeriodDelete) {
          onPeriodDelete(index);
        }
      } catch (error) {
        console.error('Error al eliminar el periodo:', error);
        alert('Error al eliminar el periodo. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <StyledPaper elevation={0}>
      <button
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={24} />
          <Typography variant="h6" component="h2">
            Períodos Seleccionados
          </Typography>
        </div>
        <div className="text-gray-400">
          {isCollapsed ? (
            <ChevronRight size={24} />
          ) : (
            <ChevronDown size={24} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2">
              {periods.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay períodos seleccionados
                </Typography>
              ) : (
                periods.map((period, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PeriodItem onClick={() => handlePeriodClick(period)}>
                      <ColorIndicator background={period.color} />
                      {editingPeriod === index ? (
                        <div className="flex items-center gap-2 flex-grow">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-grow border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                            placeholder="Nombre del período"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSave(period);
                            }}
                            className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                            title="Guardar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCancel();
                            }}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (

                        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {period.name || `Período ${Math.floor((period.start - 1) / 7) + 1}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Semana {getWeekNumber(period.start)} (Día {period.start}) - 
                              Semana {getWeekNumber(period.end)} (Día {period.end})
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(period, index);
                              }}
                              className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeletePeriod(index, e)}
                              className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Box>
                        </Box>
                      )}
                    </PeriodItem>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledPaper>
  );
};

export default PeriodosPlantillaCalendario;
