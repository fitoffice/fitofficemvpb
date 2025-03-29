import React, { useState, useEffect, useRef } from 'react'; 
import { Calendar, Plus, Edit2, Trash2, FileText, ChevronLeft, ChevronRight, Filter, Dumbbell, Clock, Percent } from 'lucide-react';
import Button from './Button';
import WeekGrid from './WeekGrid';
import EditExercisePopup from '../../modals/EditExercisePopup';
import ExportaEsqueleto from './ExportaEsqueleto';

import { 
  Exercise, 
  Period, 
  PlanningDay, 
  useFetchExercises, 
  getEjerciciosEnPeriodo, 
  getDayOfWeek, 
  getWeekAndDay, 
  handleExerciseUpdate as updateExercise,
  handleAddWeek as addWeek
} from './utils/estadisticasUtils';
import { useExercise } from '../../../contexts/ExerciseContext';
import PeriodoItem from './PeriodoItem';

interface WeekDay {
  id: string;
  dayNumber: number;
}

interface PlanningData {
  planningId: string;
  periodos: Period[];
  totalPeriodos: number;
}

interface VistaEstadisticasProps {
  planningId: string;
  numberOfWeeks: number;
  existingPeriods: Period[];
  plan: PlanningDay[];
  onPeriodsChange: (periods: Period[]) => void;
  planning?: any; // Añadimos la planificación completa
}

const VistaEstadisticas: React.FC<VistaEstadisticasProps> = ({
  planningId,
  numberOfWeeks,
  existingPeriods,
  plan,
  onPeriodsChange,
  planning // Recibimos la planificación
}) => {
  console.log('VistaEstadisticas - planningId recibido:', planningId);
  console.log('VistaEstadisticas - planning completo:', planning);
  const [selectedWeeks, setSelectedWeeks] = useState<Period[]>(
    planning?.esqueleto?.periodos?.length > 0 
      ? planning.esqueleto.periodos.map((periodo: any) => ({
          id: periodo._id,
          start: (periodo.inicioSemana - 1) * 7 + periodo.inicioDia,
          end: (periodo.finSemana - 1) * 7 + periodo.finDia,
          name: periodo.nombre,
          exercises: periodo.ejercicios || []
        }))
      : existingPeriods
  );
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingPeriodIndex, setEditingPeriodIndex] = useState<number | null>(null);
  const [editingPeriodName, setEditingPeriodName] = useState<string>('');
  const [rmsData, setRmsData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [weekDays, setWeekDays] = useState<WeekDay[]>(
    Array.from({ length: numberOfWeeks * 7 }, (_, i) => ({
      id: `day-${i + 1}`,
      dayNumber: i + 1
    }))
  );
  const prevSelectedWeeksRef = useRef<Period[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    upperBody: false,
    lowerBody: false,
    core: false,
    cardio: false
  });
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [planningData, setPlanningData] = useState<PlanningData | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const { openExerciseModal, selectedExercise, isExerciseModalOpen, closeExerciseModal } = useExercise();
  // Usar el hook personalizado para obtener los ejercicios
  const { exercises, loading, error } = useFetchExercises();
  useEffect(() => {
    const fetchEsqueletoData = async () => {
      if (!planningId) return;
      
      try {
        console.log('Iniciando petición para obtener esqueleto de planificación:', planningId);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        const apiUrl = `http://localhost:3000/api/plannings/${planningId}/esqueleto`;
        console.log('URL de la petición GET esqueleto:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Respuesta recibida de la API esqueleto:', { 
          status: response.status, 
          ok: response.ok,
          statusText: response.statusText 
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error en la respuesta de la API esqueleto:', errorData);
          throw new Error(`Failed to fetch skeleton data: ${response.status} ${response.statusText}`);
        }
        
        const esqueletoData = await response.json();
        console.log('Datos de esqueleto recibidos exitosamente:', esqueletoData);
        
        // Process the data here
        if (esqueletoData && esqueletoData.esqueleto && esqueletoData.esqueleto.periodos) {
          const formattedPeriods = esqueletoData.esqueleto.periodos.map((periodo: any) => {
            // Format exercises to match the Exercise type
            const formattedExercises = periodo.ejercicios.map((ej: any) => ({
              id: ej.ejercicio._id,
              nombre: ej.ejercicio.nombre,
              ejercicioId: ej.ejercicio._id,
              detalles: {
                grupoMuscular: ej.ejercicio.grupoMuscular || [],
                descripcion: ej.ejercicio.descripcion || '',
                equipo: ej.ejercicio.equipo || []
              },
              porcentaje: ej.porcentaje,
              ajuste: ej.ajuste,
              // Include the original data for reference
              ejercicio: ej.ejercicio,
              raw: ej
            }));
            
            return {
              id: periodo._id,
              start: (periodo.inicioSemana - 1) * 7 + periodo.inicioDia,
              end: (periodo.finSemana - 1) * 7 + periodo.finDia,
              name: periodo.nombre,
              exercises: formattedExercises,
              planningId: planningId,
              // Store the original periodo data
              originalData: periodo
            };
          });
          
          console.log('Periodos formateados del esqueleto:', formattedPeriods);
          setSelectedWeeks(formattedPeriods);
        }
        
      } catch (error) {
        console.error('Error detallado al obtener datos del esqueleto:', error);
      }
    };
    
    fetchEsqueletoData();
  }, [planningId]);
  // Add this useEffect after your other useEffect hooks
  useEffect(() => {
    // When an exercise is updated via the ExerciseContext, update the period
    if (selectedExercise && !isExerciseModalOpen) {
      console.log('VistaEstadisticas - Exercise updated via context:', selectedExercise);
      
      // Find the period that contains this exercise
      const periodIndex = selectedWeeks.findIndex(period => 
        period.id === selectedExercise.periodId || // Check by periodId if available
        period.exercises?.some(ex => {
          if (typeof ex === 'string') return ex === selectedExercise.id;
          if (ex.ejercicio && ex.ejercicio._id) return ex.ejercicio._id === selectedExercise.id;
          return ex.id === selectedExercise.id;
        })
      );
      
      if (periodIndex !== -1) {
        // Update the period with the updated exercise
        const newPeriods = [...selectedWeeks];
        const period = newPeriods[periodIndex];
        
        if (period && period.exercises) {
          // Find the index of the exercise in the period
          const exerciseIndex = period.exercises.findIndex(ex => {
            if (typeof ex === 'string') return ex === selectedExercise.id;
            if (ex.ejercicio && ex.ejercicio._id) return ex.ejercicio._id === selectedExercise.id;
            return ex.id === selectedExercise.id;
          });
          
          if (exerciseIndex !== -1) {
            // Update the exercise in the period
            if (typeof period.exercises[exerciseIndex] === 'string') {
              // Replace string ID with full exercise object
              period.exercises[exerciseIndex] = selectedExercise;
            } else {
              // Update existing exercise object
              period.exercises[exerciseIndex] = {
                ...period.exercises[exerciseIndex],
                porcentaje: selectedExercise.porcentaje,
                ajuste: selectedExercise.ajuste
              };
            }
          } else {
            // If exercise not found in period, add it
            period.exercises.push(selectedExercise);
          }
          
          setSelectedWeeks(newPeriods);
          console.log('VistaEstadisticas - Updated period with new exercise:', period);
        }
      }
    }
  }, [selectedExercise, isExerciseModalOpen, selectedWeeks]);
  useEffect(() => {
    // Solo actualizar si realmente hay cambios
    if (JSON.stringify(prevSelectedWeeksRef.current) !== JSON.stringify(selectedWeeks)) {
      prevSelectedWeeksRef.current = selectedWeeks;
      onPeriodsChange(selectedWeeks);
    }
  }, [selectedWeeks, onPeriodsChange]);
  useEffect(() => {
    // Solo actualizar si realmente hay cambios
    if (JSON.stringify(prevSelectedWeeksRef.current) !== JSON.stringify(selectedWeeks)) {
      prevSelectedWeeksRef.current = selectedWeeks;
      onPeriodsChange(selectedWeeks);
    }
  }, [selectedWeeks, onPeriodsChange]);
  
  useEffect(() => {
    const fetchRMData = async () => {
      try {
        // Mock fetching RM data
        console.log('Iniciando petición a la API de RMs...');
        // En una aplicación real, aquí iría la llamada a la API
        const mockRMData = [
          { ejercicio: { _id: 'ex1' }, rm: 100, fecha: new Date().toISOString() },
          { ejercicio: { _id: 'ex2' }, rm: 120, fecha: new Date().toISOString() }
        ];
        setRmsData(mockRMData);
      } catch (err) {
        console.error('Error al cargar los RMs:', err);
      }
    };

    fetchRMData();
  }, []);

  useEffect(() => {
    if (planningId) {
      // Mock data for planning
      const data = {
        planningId: planningId,
        periodos: existingPeriods.map(period => ({
          id: period.id,
          nombre: period.name,
          inicioSemana: period.start,
          finSemana: period.end,
          inicioDia: 1,
          finDia: 7,
          ejercicios: [] // Aquí irían los ejercicios del periodo
        })),
        totalPeriodos: existingPeriods.length
      };
      setPlanningData(data);
    }
  }, [planningId, existingPeriods]);

  const handleEditExercise = (exercise: Exercise, periodIndex: number) => {
    console.log('VistaEstadisticas - Opening Edit Exercise:', {
      exercise,
      periodIndex,
      selectedWeeks,
      planningId,
      periodoId: selectedWeeks[periodIndex]?.id
    });
    
    // Instead of using local state, use the ExerciseContext
    const periodoId = selectedWeeks[periodIndex]?.id;
    if (periodoId && exercise && planningId) {
      // Use the openExerciseModal from ExerciseContext
      openExerciseModal(exercise, periodoId, planningId, periodIndex);
    } else {
      console.error('Missing required data for editing exercise:', { exercise, periodoId, planningId });
      setEditingExercise(exercise);
      setEditingPeriodIndex(periodIndex);
    }
  };

  // Usar la función importada pero adaptada a nuestro componente
  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    updateExercise(
      selectedWeeks, 
      editingPeriodIndex, 
      updatedExercise, 
      setSelectedWeeks, 
      setEditingExercise, 
      setEditingPeriodIndex
    );
  };
  const handleAddWeek = () => {
    // Use the imported function
    const newWeekDays = addWeek(weekDays, setWeekDays);}

  const handleCloseEdit = () => {
    setEditingExercise(null);
    setEditingPeriodIndex(null);
  };

  const handleAdjustPeriod = (periodIndex: number, isStart: boolean, increment: boolean) => {
    const newPeriods = [...selectedWeeks];
    const period = newPeriods[periodIndex];
    
    if (isStart) {
      const newStart = increment ? period.start + 1 : period.start - 1;
      if (newStart < 1 || newStart >= period.end) return;
      period.start = newStart;
    } else {
      const newEnd = increment ? period.end + 1 : period.end - 1;
      if (newEnd > numberOfWeeks * 7 || newEnd <= period.start) return;
      period.end = newEnd;
    }

    // Actualizar ejercicios para el periodo ajustado
    period.exercises = getEjerciciosEnPeriodo(exercises, plan, period.start, period.end);
    
    setSelectedWeeks(newPeriods);
  };

  const handleFilterToggle = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const filterExercises = (ejercicios: Exercise[]) => {
    return ejercicios.filter(ejercicio => {
      // Búsqueda por texto
      const matchesSearch = !searchTerm || 
        ejercicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ejercicio.detalles?.grupoMuscular?.some((musculo: string) => 
          musculo.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filtros por grupo muscular
      const activeFilters = Object.entries(filters).filter(([_, value]) => value).map(([key]) => key);
      const matchesFilters = activeFilters.length === 0 || ejercicio.detalles?.grupoMuscular?.some((musculo: string) => {
        const muscleGroup = musculo.toLowerCase();
        return (
          (filters.upperBody && (muscleGroup.includes('pecho') || muscleGroup.includes('hombro') || muscleGroup.includes('brazo') || muscleGroup.includes('espalda'))) ||
          (filters.lowerBody && (muscleGroup.includes('pierna') || muscleGroup.includes('gluteo'))) ||
          (filters.core && (muscleGroup.includes('abdomen') || muscleGroup.includes('core'))) ||
          (filters.cardio && muscleGroup.includes('cardio'))
        );
      });

      return matchesSearch && matchesFilters;
    });
  };

  const handleApplyPeriod = async (periodId: string) => {
    try {
      console.log('Aplicando periodo:', periodId);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      // Prepare the API URL with the correct endpoint
      const apiUrl = `http://localhost:3000/api/plannings/${planningId}/periodos/${periodId}/aplicar-completo`;
      console.log('URL de la petición:', apiUrl);
      
      // Make the API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error al aplicar periodo: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Periodo aplicado exitosamente:', result);
      
      // Show success message to the user
      alert('Periodo aplicado correctamente');
    } catch (error) {
      console.error('Error al aplicar el periodo:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido al aplicar el periodo');
    }
  };


  const handleApplyExercise = async (periodId: string, exerciseId: string) => {
    try {
      console.log('Aplicando ejercicio:', exerciseId, 'al periodo:', periodId);
      // En una aplicación real, esta sería una llamada a la API
    } catch (error) {
      console.error('Error al aplicar el ejercicio:', error);
    }
  };

  const renderEjercicio = (ejercicio: Exercise) => {
    if (!ejercicio) return null;
    
    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 mb-4 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        <div className="mb-4 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-6 h-6 text-indigo-600 drop-shadow-sm" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
              {ejercicio.nombre || 'Sin nombre'}
            </h3>
          </div>
          <div className="flex gap-2">
            
            <button
              onClick={() => handleEditExercise(ejercicio, selectedWeeks.findIndex(period => 
                period.exercises?.some(ex => ex.id === ejercicio.id)
              ))}
              disabled={!ejercicio.ejercicioId}
              className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {ejercicio.detalles?.grupoMuscular?.map((musculo: string) => (
                <span
                  key={musculo}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700"
                >
                  <Dumbbell className="w-3 h-3" />
                  {musculo}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {ejercicio.apariciones !== undefined && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                  <Clock className="w-3 h-3" />
                  {ejercicio.apariciones} {ejercicio.apariciones === 1 ? 'vez' : 'veces'} en este periodo
                </span>
              )}
              
              {ejercicio.semana !== undefined && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                  <Calendar className="w-3 h-3" />
                  Semana {ejercicio.semana}
                </span>
              )}
            </div>
            
            {ejercicio.detalles?.descripcion && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600 italic">
                  {ejercicio.detalles.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

// ... existing code ...

// ... existing code ...

const handleDaySelect = async (dayNumber: number) => {
  if (!selectionStart) {
    setSelectionStart(dayNumber);
  } else {
    const start = Math.min(selectionStart, dayNumber);
    const end = Math.max(selectionStart, dayNumber);
    
    const isOverlapping = selectedWeeks.some(range => 
      (start <= range.end && end >= range.start)
    );

    if (!isOverlapping) {
      const ejerciciosEnPeriodo = getEjerciciosEnPeriodo(start, end);
      const newPeriod: Period = { 
        id: `period-${Date.now()}`, // Temporary ID
        start, 
        end, 
        name: `Periodo ${selectedWeeks.length + 1}`,
        exercises: ejerciciosEnPeriodo
      };

      try {
        // Get token from localStorage or your auth management system
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token ? 'Token encontrado' : 'Token no encontrado');
        
        // Calculate week and day information
        const startWeekInfo = getWeekAndDay(start);
        const endWeekInfo = getWeekAndDay(end);
        console.log('Información de semanas calculada:', { startWeekInfo, endWeekInfo });

        // Prepare the request payload
        const payload = {
          nombre: newPeriod.name,
          inicioSemana: startWeekInfo.week,
          finSemana: endWeekInfo.week,
          inicioDia: startWeekInfo.day,
          finDia: endWeekInfo.day
        };
        console.log('Payload preparado para enviar a la API:', payload);
        console.log('URL de la petición:', `http://localhost:3000/api/plannings/${planningId}/periodos`);

        // Make the API call
        console.log('Iniciando petición a la API...');
        const response = await fetch(`http://localhost:3000/api/plannings/${planningId}/periodos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        console.log('Respuesta recibida de la API:', { 
          status: response.status, 
          ok: response.ok,
          statusText: response.statusText 
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error en la respuesta de la API:', errorData);
          throw new Error(`Failed to create period: ${response.status} ${response.statusText}`);
        }

        const createdPeriod = await response.json();
        console.log('Periodo creado exitosamente:', createdPeriod);
        
        // Extract the ID from the response - the new period is in the planning.esqueleto.periodos array
        // It should be the last one added
        if (createdPeriod.planning && 
            createdPeriod.planning.esqueleto && 
            createdPeriod.planning.esqueleto.periodos && 
            createdPeriod.planning.esqueleto.periodos.length > 0) {
          
          // Get the last period in the array (the one we just created)
          const newlyCreatedPeriod = createdPeriod.planning.esqueleto.periodos[
            createdPeriod.planning.esqueleto.periodos.length - 1
          ];
          
          // Update the period with the server-generated ID
          newPeriod.id = newlyCreatedPeriod._id;
          console.log('ID asignado al nuevo periodo:', newPeriod.id);
        } else {
          console.warn('No se pudo extraer el ID del periodo de la respuesta de la API');
        }
        
        const newPeriods = [...selectedWeeks, newPeriod];
        setSelectedWeeks(newPeriods);
        console.log('Estado actualizado con el nuevo periodo');
      } catch (error) {
        console.error('Error detallado al crear el periodo:', error);
        // You might want to show an error message to the user here
      }
    } else {
      console.log('No se puede crear el periodo: hay solapamiento con periodos existentes');
    }
    
    setSelectionStart(null);
  }
  setHoveredWeek(null);
};
  const handleDeletePeriod = async (index: number) => {
    const periodToDelete = selectedWeeks[index];
    console.log('VistaEstadisticas - Iniciando eliminación del periodo:', {
      index,
      periodToDelete,
      planningId
    });
  
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token obtenido:', token ? 'Token encontrado' : 'Token no encontrado');
  
      // Prepare the API URL
      const apiUrl = `http://localhost:3000/api/plannings/${planningId}/periodos/${periodToDelete.id}`;
      console.log('URL de la petición DELETE:', apiUrl);
  
      // Make the API call
      console.log('Iniciando petición DELETE a la API...');
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Respuesta recibida de la API:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en la respuesta de la API:', errorData);
        throw new Error(`Failed to delete period: ${response.status} ${response.statusText}`);
      }
  
      // Update local state after successful deletion
      const newPeriods = selectedWeeks.filter((_, i) => i !== index);
      console.log('Actualizando estado local con los periodos restantes:', newPeriods);
      
      setSelectedWeeks(newPeriods);
      console.log('Estado actualizado exitosamente después de eliminar el periodo');
    } catch (error) {
      console.error('Error detallado al eliminar el periodo:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleEditPeriodName = (index: number, currentName: string) => {
    setEditingPeriodIndex(index);
    setEditingPeriodName(currentName);
  };

  const handleSavePeriodName = () => {
    if (editingPeriodIndex !== null && editingPeriodName.trim()) {
      const newPeriods = selectedWeeks.map((period, i) => 
        i === editingPeriodIndex ? { ...period, name: editingPeriodName.trim() } : period
      );
      setSelectedWeeks(newPeriods);
      setEditingPeriodIndex(null);
      setEditingPeriodName('');
    }
  };

  const handleHover = (dayNumber: number | null) => {
    setHoveredWeek(dayNumber);
  };

  const getLatestRM = (ejercicioId: string) => {
    if (!rmsData || rmsData.length === 0) return null;
    
    // Filtrar RMs para este ejercicio en específico y ordenarlos de forma descendente por fecha
    const ejercicioRMs = rmsData
      .filter(rm => rm.ejercicio._id === ejercicioId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    // Retornar el RM más reciente o null si no se encontró ninguno
    return ejercicioRMs.length > 0 ? ejercicioRMs[0].rm : null;
  };

  const handleExport = (format: string) => {
    console.log(`Exporting in ${format} format`);
    // En una aplicación real, aquí se desencadenaría una llamada a la API para generar la exportación
    
    // Exportación mock para desarrollo
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedWeeks));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `training-plan-${planningId}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } 
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Se eliminó el array de ejercicios mock ya que ahora se obtienen de la API
  // const mockExercises: Exercise[] = [];
  
  const renderPeriodo = (periodo: Period, index: number) => {
    const startInfo = getWeekAndDay(periodo.start);
    const endInfo = getWeekAndDay(periodo.end);
    const ejercicios = periodo.exercises || [];
    const isActive = activeAccordion === index;

    return (
      <div className={`p-6 mb-4 bg-white rounded-xl shadow-md border border-indigo-100 transition-all duration-300 ${isActive ? 'ring-2 ring-indigo-200' : ''}`}>
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => toggleAccordion(index)}
        >
          <div className="flex items-center gap-3">
            {editingPeriodIndex === index ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingPeriodName}
                  onChange={(e) => setEditingPeriodName(e.target.value)}
                  className="border border-indigo-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSavePeriodName();
                  }}
                >
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPeriodIndex(null);
                    setEditingPeriodName('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{periodo.name}</h3>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyPeriod(periodo.id);
              }}
              className="flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" />
              Aplicar Periodo
            </Button>
            {editingPeriodIndex !== index && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPeriodName(index, periodo.name);
                }}
                className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePeriod(index);
              }}
              className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
              <ChevronRight className={`w-5 h-5 text-gray-600 transform ${isActive ? 'rotate-90' : ''}`} />
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAdjustPeriod(index, true, false)}
              className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 text-gray-700">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Semana {startInfo.week} día {startInfo.day}</span>
            </div>
            <button
              onClick={() => handleAdjustPeriod(index, true, true)}
              className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-gray-500">a</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAdjustPeriod(index, false, false)}
              className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 text-gray-700">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Semana {endInfo.week} día {endInfo.day}</span>
            </div>
            <button
              onClick={() => handleAdjustPeriod(index, false, true)}
              className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isActive && (
          <div className="mt-4 transition-all duration-300 animate-fadeIn">
            {ejercicios.length > 0 ? (
              <div>
                <div className="flex gap-3 mb-4 items-center">
                  <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center p-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar ejercicios..."
                      className="w-full border-none focus:outline-none text-gray-700"
                    />
                  </div>
                  <div className="relative">
                    <Button
                      variant="exportar"
                      onClick={handleFilterToggle}
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Filtros
                    </Button>
                    {showFilterMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="p-3 border-b border-gray-200">
                          <h4 className="text-sm font-medium text-gray-500">Grupos Musculares</h4>
                        </div>
                        <div className="p-2">
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.upperBody}
                              onChange={() => handleFilterChange('upperBody')}
                              className="mr-2"
                            />
                            <span className="text-sm">Tren Superior</span>
                          </label>
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.lowerBody}
                              onChange={() => handleFilterChange('lowerBody')}
                              className="mr-2"
                            />
                            <span className="text-sm">Tren Inferior</span>
                          </label>
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.core}
                              onChange={() => handleFilterChange('core')}
                              className="mr-2"
                            />
                            <span className="text-sm">Core</span>
                          </label>
                          <label className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.cardio}
                              onChange={() => handleFilterChange('cardio')}
                              className="mr-2"
                            />
                            <span className="text-sm">Cardio</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {filterExercises(ejercicios).map((ejercicio) => (
                  <div key={ejercicio.id}>
                    {renderEjercicio(ejercicio)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay ejercicios en este periodo</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl relative overflow-hidden">
      {/* Borde decorativo superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
      
      <div className="w-full mb-8">
        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
          Esqueleto - {planning?.nombre || 'Sin nombre'}
        </h1>
        
        {planning && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Información de la Planificación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><span className="font-medium">Nombre:</span> {planning.nombre}</p>
                <p className="text-gray-600"><span className="font-medium">Descripción:</span> {planning.descripcion || 'Sin descripción'}</p>
                <p className="text-gray-600"><span className="font-medium">Semanas:</span> {planning.semanas}</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-medium">Fecha de inicio:</span> {new Date(planning.fechaInicio).toLocaleDateString()}</p>
                <p className="text-gray-600"><span className="font-medium">Fecha de creación:</span> {new Date(planning.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600"><span className="font-medium">Última actualización:</span> {new Date(planning.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mb-4">
          <Button
            variant="exportar"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Exportar Esqueleto
          </Button>
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Selecciona los días para crear un periodo
        </h2>
        
        <WeekGrid
          weekDays={weekDays}
          selectedWeeks={selectedWeeks}
          onWeekSelect={handleDaySelect}
          selectionStart={selectionStart}
          hoveredWeek={hoveredWeek}
          onHover={handleHover}
          getPreviewRange={() => {
            if (!selectionStart || !hoveredWeek) return null;
            const start = Math.min(selectionStart, hoveredWeek);
            const end = Math.max(selectionStart, hoveredWeek);
            return { start, end, name: `Periodo ${selectedWeeks.length + 1}` };
          }}
          onAddWeek={handleAddWeek} 
        />
      </div>

      {selectedWeeks.length > 0 && (
        <div className="mt-8 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Periodos Seleccionados
          </h2>
          
          {selectedWeeks.map((periodo, index) => (
            <div key={`period-${periodo.id}`}>
      <PeriodoItem
        periodo={{
          ...periodo, 
          planningId: planningId,
          // Pass the original data from the API
          originalData: periodo.originalData
        }}
        index={index}
        activeAccordion={activeAccordion}
        toggleAccordion={toggleAccordion}
        handleEditPeriodName={handleEditPeriodName}
        handleSavePeriodName={handleSavePeriodName}
        editingPeriodIndex={editingPeriodIndex}
        editingPeriodName={editingPeriodName}
        setEditingPeriodName={setEditingPeriodName}
        handleApplyPeriod={handleApplyPeriod}
        handleDeletePeriod={handleDeletePeriod}
        handleAdjustPeriod={handleAdjustPeriod}
        handleApplyExercise={handleApplyExercise}
        handleEditExercise={handleEditExercise}
        searchTerm={searchTerm}
        showFilterMenu={showFilterMenu}
        handleFilterToggle={handleFilterToggle}
        filters={filters}
        handleFilterChange={handleFilterChange}
        filterExercises={filterExercises}
        renderEjercicio={renderEjercicio}
      />
</div>          ))}
        </div>
      )}
      
      {editingExercise && (
        <>
          {console.log('VistaEstadisticas - Valores que se envían a EditExercisePopup:', {
            planningId: planning?._id || planningId,
            periodoId: editingPeriodIndex !== null && selectedWeeks[editingPeriodIndex] 
              ? selectedWeeks[editingPeriodIndex].id 
              : '',
            planning: planning,
            editingPeriodIndex: editingPeriodIndex,
            selectedWeeks: selectedWeeks
          })}
          <EditExercisePopup
            open={!!editingExercise}
            onClose={handleCloseEdit}
            exercise={editingExercise}
            onSave={handleExerciseUpdate}
            periodIndex={editingPeriodIndex || 0}
            rm={getLatestRM(editingExercise.ejercicioId || '')}
            relativeWeight={0}
            onRMChange={(value) => {
              // Manejar cambio de RM si es necesario
            }}
            onRelativeWeightChange={(value) => {
              // Manejar cambio de peso relativo si es necesario
            }}
            sets={[]}
            onSetsWeightChange={(weights) => {
              // Manejar cambio de pesos en los sets si es necesario
            }}
            planningId={planning?._id || planningId}
            periodoId={editingPeriodIndex !== null && selectedWeeks[editingPeriodIndex] 
              ? selectedWeeks[editingPeriodIndex].id 
              : ''}
          />
        </>
      )}      
      <ExportaEsqueleto
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default VistaEstadisticas;