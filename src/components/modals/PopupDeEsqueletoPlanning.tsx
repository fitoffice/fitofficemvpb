import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, ChevronUp, Edit2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import Button from '../Common/Button';
import SelectedPeriods from './SelectedPeriods';
import PeriodosPlantilla from './periodosplantilla';
import { Dumbbell } from 'lucide-react';
import EditExercisePopup from './EditExercisePopup';
import PeriodosCreados from './PeriodosCreados';

interface Day {
  id: string;
  dayNumber: number;
}

interface Week {
  weekNumber: number;
  days: Day[];
}

interface WeekRange {
  start: number;
  end: number;
  name: string;
}

interface Set {
  repeticiones: number;
  descanso: number;
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
}

interface PeriodExercise extends Exercise {
  isExpanded?: boolean;
  isEditing?: boolean;
  rm?: number;
  relativeWeight?: number;
  sets?: Set[];
}

interface Period extends WeekRange {
  exercises: PeriodExercise[];
}

function WeekGrid({ 
  weekDays, 
  selectedWeeks, 
  onWeekSelect, 
  selectionStart,
  hoveredWeek,
  onHover,
  getPreviewRange 
}: {
  weekDays: Week[];
  selectedWeeks: Period[];
  onWeekSelect: (weekNumber: number) => void;
  selectionStart: number | null;
  hoveredWeek: number | null;
  onHover: (weekNumber: number | null) => void;
  getPreviewRange: () => WeekRange | null;
}) {
  const isNumberSelected = (number: number) => {
    return selectedWeeks.some(range => 
      number >= range.start && number <= range.end
    );
  };

  const isNumberInPreview = (number: number) => {
    if (!selectionStart || !hoveredWeek) return false;
    const previewRange = getPreviewRange();
    if (!previewRange) return false;
    return number >= previewRange.start && number <= previewRange.end;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left bg-gray-50 border">Semana</th>
            <th className="p-3 text-center bg-gray-50 border">Día 1</th>
            <th className="p-3 text-center bg-gray-50 border">Día 2</th>
            <th className="p-3 text-center bg-gray-50 border">Día 3</th>
            <th className="p-3 text-center bg-gray-50 border">Día 4</th>
            <th className="p-3 text-center bg-gray-50 border">Día 5</th>
            <th className="p-3 text-center bg-gray-50 border">Día 6</th>
            <th className="p-3 text-center bg-gray-50 border">Día 7</th>
          </tr>
        </thead>
        <tbody>
          {weekDays.map((week) => (
            <tr key={week.weekNumber}>
              <td className="p-3 border bg-gray-50 whitespace-nowrap">
                Semana {week.weekNumber}
              </td>
              {week.days.map((day) => (
                <td 
                  key={day.id}
                  className="p-1 border text-center"
                >
                  <button
                    className={clsx(
                      "w-full p-2 rounded transition-all duration-200",
                      isNumberSelected(day.dayNumber) && "bg-green-500 text-white",
                      isNumberInPreview(day.dayNumber) && !isNumberSelected(day.dayNumber) && "bg-green-200",
                      !isNumberSelected(day.dayNumber) && !isNumberInPreview(day.dayNumber) && "hover:bg-gray-100"
                    )}
                    onClick={() => onWeekSelect(day.dayNumber)}
                    onMouseEnter={() => onHover(day.dayNumber)}
                    onMouseLeave={() => onHover(null)}
                  >
                    {day.dayNumber}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PopupDeEsqueletoPlanningProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any, shouldClose?: boolean) => void;
  numberOfWeeks: number;
  planningId: string;
  existingPeriods?: Period[]; 
}

const PopupDeEsqueletoPlanning: React.FC<PopupDeEsqueletoPlanningProps> = ({
  isOpen,
  onClose,
  onSubmit,
  numberOfWeeks,
  planningId,
  existingPeriods
}) => {
  const [formData, setFormData] = useState({});
  const [selectedWeeks, setSelectedWeeks] = useState<Period[]>([]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [showPeriodosPlantilla, setShowPeriodosPlantilla] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{
    periodIndex: number;
    exerciseId: string;
  } | null>(null);
  const [periodosGuardados, setPeriodosGuardados] = useState<Period[]>([]);
  const [mostrarPeriodosCreados, setMostrarPeriodosCreados] = useState(false);
  const [etapa, setEtapa] = useState<'seleccion' | 'revision'>('seleccion');

  useEffect(() => {
    if (existingPeriods && existingPeriods.length > 0) {
      setSelectedWeeks(existingPeriods);
      setPeriodosGuardados(existingPeriods);
      setMostrarPeriodosCreados(true);
      setEtapa('revision');
    }
  }, [existingPeriods]);

  const createVariante = async (periodIndex: number, ejercicioId: string) => {
    if (!planningId) return;
    try {
      const response = await fetch(`/api/planning/${planningId}/variante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo1: "porcentaje",
          numeroVariantePrimeraSerie: 80,
          tipo2: "Kg",
          numeroVariantePosteriorSerie: 5
        })
      });
      if (!response.ok) throw new Error('Error creating variante');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating variante:', error);
    }
  };

  const createEjercicioEsqueleto = async (nombre: string, series: number, ejercicios: any[]) => {
    if (!planningId) return;
    try {
      const response = await fetch(`/api/planning/${planningId}/ejercicio-esqueleto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          series,
          ejercicios
        })
      });
      if (!response.ok) throw new Error('Error creating ejercicio esqueleto');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating ejercicio esqueleto:', error);
    }
  };

  const createPeriodo = async (period: Period) => {
    if (!planningId) {
      console.error('❌ No hay planningId disponible');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No se encontró el token de autenticación');
      return;
    }
    
    // Calculate week and day numbers
    const startWeek = Math.ceil(period.start / 7);
    const startDay = period.start % 7 === 0 ? 7 : period.start % 7;
    const endWeek = Math.ceil(period.end / 7);
    const endDay = period.end % 7 === 0 ? 7 : period.end % 7;

    console.log('📝 Creando periodo con datos:', {
      planningId,
      period,
      calculatedData: {
        inicioSemana: startWeek,
        finSemana: endWeek,
        inicioDia: startDay,
        finDia: endDay
      }
    });

    try {
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/periodo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inicioSemana: startWeek,
          finSemana: endWeek,
          inicioDia: startDay,
          finDia: endDay,
          ejercicios: period.exercises.map(exercise => ({
            nombre: exercise.nombre,
            grupoMuscular: exercise.grupoMuscular,
            descripcion: exercise.descripcion,
            equipo: exercise.equipo
          }))
        })
      });

      const responseData = await response.clone().json();
      console.log('🔄 Respuesta del servidor:', responseData);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error('Error creating periodo');
      }
      
      const data = await response.json();
      console.log('✅ Periodo creado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('💥 Error al crear periodo:', error);
      throw error;
    }
  };

  const handleSaveEsqueleto = async () => {
    console.log('🚀 Iniciando guardado del esqueleto con periodos:', selectedWeeks);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No se encontró el token de autenticación');
        return;
      }

      // Transformar los periodos al formato requerido
      const periodosFormateados = selectedWeeks.map(period => {
        const startWeek = Math.ceil(period.start / 7);
        const startDay = period.start % 7 === 0 ? 7 : period.start % 7;
        const endWeek = Math.ceil(period.end / 7);
        const endDay = period.end % 7 === 0 ? 7 : period.end % 7;

        return {
          nombre: period.name,
          inicioSemana: startWeek,
          finSemana: endWeek,
          inicioDia: startDay,
          finDia: endDay,
          ejercicios: []
        };
      });

      console.log('📦 Periodos formateados:', periodosFormateados);

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/esqueleto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(periodosFormateados)
      });

      const responseData = await response.json();
      console.log('✅ Respuesta del servidor:', responseData);

      if (!response.ok) {
        console.error('❌ Error del servidor:', responseData);
        throw new Error('Error al crear el esqueleto');
      }

      console.log('🎉 Esqueleto creado exitosamente');
      setPeriodosGuardados(selectedWeeks);
      setMostrarPeriodosCreados(true);
      onSubmit({ 
        planning: responseData, 
        message: 'Esqueleto creado exitosamente' 
      }, false);
      setEtapa('revision');
      
    } catch (error) {
      console.error('💥 Error en handleSaveEsqueleto:', error);
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises');
        const data = await response.json();
        setExercises(data.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
      setLoading(false);
    };

    if (showPeriodosPlantilla) {
      fetchExercises();
    }
  }, [showPeriodosPlantilla]);

  const getWeekDays = (numberOfWeeks: number): Week[] => {
    const weeks: Week[] = [];
    let dayCounter = 1;
    
    for (let weekNum = 1; weekNum <= numberOfWeeks; weekNum++) {
      const days: Day[] = [];
      for (let dayNum = 1; dayNum <= 7; dayNum++) {
        days.push({
          id: `week${weekNum}-day${dayNum}`,
          dayNumber: dayCounter++
        });
      }
      weeks.push({
        weekNumber: weekNum,
        days
      });
    }
    
    return weeks;
  };

  const handleWeekSelect = (weekNumber: number) => {
    if (selectionStart === null) {
      setSelectionStart(weekNumber);
    } else {
      const start = Math.min(selectionStart, weekNumber);
      const end = Math.max(selectionStart, weekNumber);
      setSelectedWeeks(prev => [...prev, { start, end, name: `Período ${prev.length + 1}`, exercises: [] }]);
      setSelectionStart(null);
      setHoveredWeek(null);
    }
  };

  const getPreviewRange = (): WeekRange | null => {
    if (selectionStart === null || hoveredWeek === null) return null;
    return {
      start: Math.min(selectionStart, hoveredWeek),
      end: Math.max(selectionStart, hoveredWeek),
      name: `Período ${selectedWeeks.length + 1}`
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">
            {etapa === 'seleccion' ? 'Crear Esqueleto de Planificación' : 'Revisar Periodos Creados'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>

        {etapa === 'seleccion' ? (
          <>
            <div className="mb-6">
              {!showPeriodosPlantilla ? (
                <WeekGrid
                  weekDays={getWeekDays(numberOfWeeks)}
                  selectedWeeks={selectedWeeks}
                  onWeekSelect={handleWeekSelect}
                  selectionStart={selectionStart}
                  hoveredWeek={hoveredWeek}
                  onHover={setHoveredWeek}
                  getPreviewRange={getPreviewRange}
                />
              ) : (
                <PeriodosPlantilla
                  selectedWeeks={selectedWeeks}
                  setSelectedWeeks={setSelectedWeeks}
                  selectionStart={selectionStart}
                  setSelectionStart={setSelectionStart}
                  hoveredWeek={hoveredWeek}
                  setHoveredWeek={setHoveredWeek}
                  plan={[]}
                />
              )}
            </div>

            <div className="space-y-4">
              {selectedWeeks.map((period, index) => (
                <SelectedPeriods
                  key={index}
                  period={period}
                  onPeriodChange={(updatedPeriod) => {
                    const newSelectedWeeks = [...selectedWeeks];
                    newSelectedWeeks[index] = updatedPeriod;
                    setSelectedWeeks(newSelectedWeeks);
                  }}
                  onDelete={() => {
                    const newSelectedWeeks = selectedWeeks.filter((_, i) => i !== index);
                    setSelectedWeeks(newSelectedWeeks);
                  }}
                  onAddExercise={() => {
                    setEditingExercise({ periodIndex: index, exerciseId: '' });
                  }}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={onClose} variant="secondary">
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveEsqueleto} 
                variant="primary"
                disabled={selectedWeeks.length === 0}
              >
                Guardar Esqueleto
              </Button>
            </div>
          </>
        ) : (
          <>
            <PeriodosCreados 
              periodos={periodosGuardados}
              planificacion={[]}
            />
            
            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                onClick={() => setEtapa('seleccion')} 
                variant="secondary"
              >
                Volver
              </Button>
              <Button 
                onClick={() => {
                  console.log('Avanzando a la siguiente etapa con periodos:', periodosGuardados);
                  onSubmit(periodosGuardados, true); // Pasamos true para cerrar el popup
                  onClose();
                }} 
                variant="primary"
              >
                Siguiente Etapa
              </Button>
            </div>
          </>
        )}

        {editingExercise && (
          <EditExercisePopup
            isOpen={true}
            onClose={() => setEditingExercise(null)}
            onSubmit={(exercise) => {
              if (editingExercise) {
                const newSelectedWeeks = [...selectedWeeks];
                newSelectedWeeks[editingExercise.periodIndex].exercises.push(exercise);
                setSelectedWeeks(newSelectedWeeks);
                setEditingExercise(null);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PopupDeEsqueletoPlanning;
