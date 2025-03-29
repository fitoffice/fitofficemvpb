import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Users, Layout, Plus, Calendar, ArrowLeft } from 'lucide-react';
import { VistaClientes } from './VistaClientes';
import { VistaCompleja } from './VistaCompleja';
import { PlantillaPageCalendario } from './PlantillaPageCalendario';
import PeriodosPlantillaCalendario from './PeriodosPlantillaCalendario';
import PopupDeEsqueletoPlantilla from '../../modals/PopupDeEsqueletoPlantilla';
import Button from '../../Common/Button';
import { Box } from '@mui/material';

type Vista = 'clientes' | 'compleja';

interface Exercise {
  _id: string;
  nombre: string;
  tipo: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  imgUrl: string;
}

interface Set {
  reps: number;
  weight: number;
  rest: number;
  tempo: string;
  rpe: number;
  renderConfig: {
    campo1: string;
    campo2: string;
    campo3: string;
    _id: string;
  };
  _id: string;
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: Set[];
  _id: string;
}

interface Session {
  name: string;
  tipo: string;
  rondas: number;
  exercises: ExerciseWithSets[];
  _id: string;
}

interface Day {
  dayNumber: number;
  sessions: Session[];
  _id: string;
}

interface Week {
  weekNumber: number;
  days: Day[];
  _id: string;
}

interface Trainer {
  _id: string;
  nombre: string;
  email: string;
}

interface Client {
  _id: string;
  nombre: string;
  email: string;
}

interface AssignedClient {
  client: Client;
  currentWeek: number;
  currentDay: number;
  status: string;
  _id: string;
  assignedDate: string;
  modifications: any[];
}

interface Rango {
  _id: string;
  nombre: string;
  semanaInicio: number;
  diaInicio: number;
  semanaFin: number;
  diaFin: number;
  days: any[];
}

interface Template {
  _id: string;
  nombre: string;
  descripcion: string;
  trainer: Trainer;
  totalWeeks: number;
  plan: Week[];
  isActive: boolean;
  tags: string[];
  difficulty: string;
  category: string;
  assignedClients: AssignedClient[];
  rangos: Rango[]; // Add rangos property
  createdAt: string;
  updatedAt: string;
}

interface Period {
  start: number;
  end: number;
  color: string;
  _id?: string; // Add _id property to link with rangos
  nombre?: string; // Add nombre property
}

const PlantillaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState<Vista>('clientes');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState<Period[]>([]);
  const [selectedPeriodForView, setSelectedPeriodForView] = useState<Period | null>(null);
  const [isPeriodsCollapsed, setIsPeriodsCollapsed] = useState(false);
  useEffect(() => {
    if (template?.rangos && template.rangos.length > 0) {
      // Map rangos to periods format
      const periodsFromRangos = template.rangos.map((rango, index) => {
        // Calculate start day number (weeks are 1-indexed, days are 1-indexed)
        const start = ((rango.semanaInicio - 1) * 7) + rango.diaInicio;
        
        // Calculate end day number
        const end = ((rango.semanaFin - 1) * 7) + rango.diaFin;
        
        // Assign a color based on index
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
        
        return {
          start,
          end,
          color: periodColors[index % periodColors.length],
          _id: rango._id,
          nombre: rango.nombre
        };
      });
      
      console.log('Periods converted from rangos:', periodsFromRangos);
      setSelectedPeriods(periodsFromRangos);
    }
  }, [template]);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // Always fetch from API to ensure consistent data structure
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar la plantilla');
        }

        const data = await response.json();
        console.log('Datos de plantilla desde API:', data);
        setTemplate(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id]);
  const handleWeekSelect = (weekNumber: number) => {
    console.log('Semana seleccionada:', weekNumber);
    if (!template?._id) {
      console.error('No hay ID de plantilla disponible');
      return;
    }
    console.log('Template ID:', template._id);
    setSelectedWeek(weekNumber);
    setVistaActual('compleja');
  };

  const handlePeriodClick = (period: Period) => {
    setSelectedPeriodForView(period);
    setVistaActual('compleja');
    setIsPeriodsCollapsed(true); // Colapsar el panel al seleccionar un período
  };

  const handlePeriodUpdate = async (updatedPeriod: Period) => {
    // Update local state
    setSelectedPeriods(periods => 
      periods.map(p => 
        p._id === updatedPeriod._id
          ? updatedPeriod
          : p
      )
    );
    
    // If the period has an _id, update it on the server
    if (updatedPeriod._id && template?._id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        // Calculate semanaInicio, diaInicio, semanaFin, diaFin
        const semanaInicio = Math.floor((updatedPeriod.start - 1) / 7) + 1;
        const diaInicio = ((updatedPeriod.start - 1) % 7) + 1;
        const semanaFin = Math.floor((updatedPeriod.end - 1) / 7) + 1;
        const diaFin = ((updatedPeriod.end - 1) % 7) + 1;
        
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${template._id}/rangos/${updatedPeriod._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: updatedPeriod.nombre || 'Periodo actualizado',
            semanaInicio,
            diaInicio,
            semanaFin,
            diaFin,
            days: []
          }),
        });
        
        if (!response.ok) {
          throw new Error('Error al actualizar el periodo');
        }
        
        console.log('Periodo actualizado en el servidor');
      } catch (error) {
        console.error('Error al actualizar el periodo:', error);
      }
    }
  };

  const handlePeriodDelete = async (periodIndex: number) => {
    // Store a reference to the period being deleted
    const periodToDelete = selectedPeriods[periodIndex];
    
    // If the period has an _id, delete it on the server
    if (periodToDelete._id && template?._id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${template._id}/rangos/${periodToDelete._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al eliminar el periodo');
        }
        
        console.log('Periodo eliminado en el servidor');
      } catch (error) {
        console.error('Error al eliminar el periodo:', error);
      }
    }
    
    // Update the periods list
    setSelectedPeriods(prevPeriods => {
      const updatedPeriods = [...prevPeriods];
      updatedPeriods.splice(periodIndex, 1);
      return updatedPeriods;
    });
    
    // If the deleted period was the selected one, clear the selection
    if (selectedPeriodForView && 
        periodToDelete && 
        periodToDelete._id === selectedPeriodForView._id) {
      setSelectedPeriodForView(null);
    }
    
    // Force update the VistaCompleja component if needed
    if (vistaActual === 'compleja') {
      // This will trigger a re-render of the VistaCompleja component
      setSelectedWeek(prev => prev);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: No se encontró la plantilla</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header Section - Modernizado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-600"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-violet-500/10"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/10"></div>
        
        <div className="absolute left-6 z-10">
          <Button
            variant="secondary"
            onClick={() => navigate('/routines')}
            className="flex items-center gap-2 px-4 py-2.5 text-base font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} className="text-white" />
            <span className="text-white">Volver</span>
          </Button>
        </div>
        <div className="flex flex-col items-center z-10">
          <h1 className={`text-3xl font-extrabold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400`}>
            {template?.nombre || 'Cargando...'}
          </h1>
          {template?.descripcion && (
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-lg text-center">
              {template.descripcion}
            </p>
          )}
        </div>
      </motion.div>

      {/* Vista Selector - Modernizado */}
      <div className="flex flex-wrap gap-3 mt-6 mb-8 justify-center">
        <button
          onClick={() => setVistaActual('clientes')}
          className={`
            flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 transform
            ${vistaActual === 'clientes'
              ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 scale-105'
              : 'bg-white hover:bg-violet-50 text-gray-600 hover:text-violet-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-violet-400 hover:shadow-md'
            }
          `}
        >
          <div className={`
            p-2.5 rounded-lg
            ${vistaActual === 'clientes'
              ? 'bg-white/20'
              : 'bg-violet-100 dark:bg-gray-700'
            }
          `}>
            <Users className={`
              w-5 h-5
              ${vistaActual === 'clientes'
                ? 'text-white'
                : 'text-violet-500 dark:text-violet-400'
              }
            `}/>
          </div>
          <div className="text-left">
            <div className="font-semibold">Clientes</div>
            <div className={`
              text-sm
              ${vistaActual === 'clientes'
                ? 'text-white/90'
                : 'text-gray-500 dark:text-gray-400'
              }
            `}>
              Gestionar clientes asignados
            </div>
          </div>
        </button>

        <button
          onClick={() => setVistaActual('compleja')}
          className={`
            flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 transform
            ${vistaActual === 'compleja'
              ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 scale-105'
              : 'bg-white hover:bg-violet-50 text-gray-600 hover:text-violet-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-violet-400 hover:shadow-md'
            }
          `}
        >
          <div className={`
            p-2.5 rounded-lg
            ${vistaActual === 'compleja'
              ? 'bg-white/20'
              : 'bg-violet-100 dark:bg-gray-700'
            }
          `}>
            <Calendar className={`
              w-5 h-5
              ${vistaActual === 'compleja'
                ? 'text-white'
                : 'text-violet-500 dark:text-violet-400'
              }
            `}/>
          </div>
          <div className="text-left">
            <div className="font-semibold">Vista Compleja</div>
            <div className={`
              text-sm
              ${vistaActual === 'compleja'
                ? 'text-white/90'
                : 'text-gray-500 dark:text-gray-400'
              }
            `}>
              Vista detallada de la plantilla
            </div>
          </div>
        </button>
      </div>

      {/* Vista Calendario Section - Modernizado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row gap-6 p-4">
          <div className={`
            flex-grow transition-all duration-300 rounded-xl overflow-hidden
            ${isPeriodsCollapsed ? 'md:flex-grow' : 'md:w-[calc(100%-20rem)]'}
          `}>
            <PlantillaPageCalendario
              plantilla={template}
              onWeekSelect={handleWeekSelect}
              onPeriodsChange={setSelectedPeriods}
              periods={selectedPeriods} // Pass the periods to the calendar component
            />
          </div>
          <div className={`
            transition-all duration-300 rounded-xl
            ${isPeriodsCollapsed ? 'w-[60px]' : 'w-full md:w-80'}
          `}>
                        <PeriodosPlantillaCalendario 
              periods={selectedPeriods}
              onPeriodClick={handlePeriodClick}
              isCollapsed={isPeriodsCollapsed}
              onToggleCollapse={() => setIsPeriodsCollapsed(!isPeriodsCollapsed)}
              onPeriodUpdate={handlePeriodUpdate}
              onPeriodDelete={handlePeriodDelete}
              templateId={template._id} // Pass the template ID to the component
            />
          </div>
        </div>
      </motion.div>

      {/* Vista Content Section - Modernizado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-4">
          {vistaActual === 'clientes' && (
            <VistaClientes 
              assignedClients={template.assignedClients}
              templateId={template._id}
              onClientAssigned={() => {
                const fetchPlantilla = async () => {
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      throw new Error('No se encontró el token de autenticación');
                    }

                    const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${id}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    if (!response.ok) {
                      throw new Error('Error al cargar la plantilla');
                    }

                    const data = await response.json();
                    setTemplate(data);
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                };
                fetchPlantilla();
              }}
            />
          )}
          {vistaActual === 'compleja' && (
           <VistaCompleja
           plantilla={template} // Pass the entire template object
           semana={selectedWeek}
           dia={selectedDay}
           selectedPeriod={selectedPeriodForView}
           onPeriodSelect={(period) => {
             setSelectedPeriodForView(period);
             setVistaActual('compleja');
           }}
           onPeriodUpdate={handlePeriodUpdate}
         />
          )}
        </div>
      </motion.div>
      
      {/* Popup de Esqueleto Plantilla */}
      <PopupDeEsqueletoPlantilla
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={async (formData) => {
          try {
            const token = localStorage.getItem('token');
            const plantillaData = {
              ...formData,
              totalWeeks: 4,
              plan: Array(4).fill().map((_, weekIndex) => ({
                weekNumber: weekIndex + 1,
                days: Array(7).fill().map((_, dayIndex) => ({
                  dayNumber: dayIndex + 1,
                  sessions: [],
                })),
              })),
            };

            const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/templates', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(plantillaData),
            });

            if (!response.ok) {
              throw new Error('Error al crear la plantilla');
            }

            setIsPopupOpen(false);
          } catch (error) {
            console.error('Error:', error);
          }
        }}
      />
    </div>
  );
};

export default PlantillaPage;
