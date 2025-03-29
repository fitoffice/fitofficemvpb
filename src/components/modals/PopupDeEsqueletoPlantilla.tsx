import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, ChevronUp, Edit2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import Button from '../Common/Button';
import SelectedPeriods from './SelectedPeriods';
import PeriodosPlantilla from './periodosplantilla';
import { Dumbbell } from 'lucide-react';
import EditExercisePopup from './EditExercisePopup';

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

interface PopupDeEsqueletoPlantillaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const PopupDeEsqueletoPlantilla: React.FC<PopupDeEsqueletoPlantillaProps> = ({
  isOpen,
  onClose,
  onSubmit,
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
      handleAddPeriod({ start, end, name: `Período ${selectedWeeks.length + 1}` });
      setSelectionStart(null);
      setHoveredWeek(null);
    }
  };

  const handleAddPeriod = (weekRange: WeekRange) => {
    const newPeriod: Period = {
      ...weekRange,
      exercises: [],
      name: `Periodo ${selectedWeeks.length + 1}`
    };
    setSelectedWeeks([...selectedWeeks, newPeriod]);
    setSelectionStart(null);
  };

  const getPreviewRange = () => {
    if (!selectionStart || !hoveredWeek) return null;
    const start = Math.min(selectionStart, hoveredWeek);
    const end = Math.max(selectionStart, hoveredWeek);
    return { start, end, name: '' };
  };

  const handleRemovePeriod = (index: number) => {
    setSelectedWeeks(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdatePeriodName = (index: number, name: string) => {
    setSelectedWeeks(prev => 
      prev.map((range, i) => 
        i === index ? { ...range, name } : range
      )
    );
  };

  const toggleExerciseExpand = (periodIndex: number, exerciseId: string) => {
    setSelectedWeeks(prev => prev.map((period, idx) => {
      if (idx === periodIndex) {
        return {
          ...period,
          exercises: period.exercises.map(exercise => {
            if (exercise._id === exerciseId) {
              return {
                ...exercise,
                isExpanded: !exercise.isExpanded
              };
            }
            return exercise;
          })
        };
      }
      return period;
    }));
  };

  const toggleEditExercise = (periodIndex: number, exerciseId: string) => {
    setSelectedWeeks(prev => prev.map((period, idx) => {
      if (idx === periodIndex) {
        return {
          ...period,
          exercises: period.exercises.map(exercise => {
            if (exercise._id === exerciseId) {
              return {
                ...exercise,
                isEditing: !exercise.isEditing
              };
            }
            return exercise;
          })
        };
      }
      return period;
    }));
  };

  const handleRMChange = (periodIndex: number, exerciseId: string, value: number) => {
    setSelectedWeeks(prev => {
      const newWeeks = [...prev];
      const exercise = newWeeks[periodIndex].exercises.find(e => e._id === exerciseId);
      
      if (exercise) {
        exercise.rm = value;
        // Actualizar los pesos relativos en los periodos posteriores
        for (let i = periodIndex + 1; i < newWeeks.length; i++) {
          const nextPeriodExercise = newWeeks[i].exercises.find(e => e._id === exerciseId);
          if (nextPeriodExercise) {
            nextPeriodExercise.relativeWeight = nextPeriodExercise.relativeWeight || 100;
          }
        }
      }
      
      return newWeeks;
    });
  };

  const handleRelativeWeightChange = (periodIndex: number, exerciseId: string, value: number) => {
    setSelectedWeeks(prev => prev.map((period, idx) => {
      if (idx === periodIndex) {
        return {
          ...period,
          exercises: period.exercises.map(exercise => {
            if (exercise._id === exerciseId) {
              return {
                ...exercise,
                relativeWeight: value
              };
            }
            return exercise;
          })
        };
      }
      return period;
    }));
  };

  const handleExerciseChange = (periodIndex: number, exerciseId: string) => {
    setSelectedWeeks(prev => prev.map((period, idx) => {
      if (idx === periodIndex) {
        const exerciseExists = period.exercises.some(e => e._id === exerciseId);
        if (!exerciseExists) {
          const exerciseToAdd = exercises.find(e => e._id === exerciseId);
          if (exerciseToAdd) {
            return {
              ...period,
              exercises: [...period.exercises, {
                ...exerciseToAdd,
                isExpanded: false,
                isEditing: false,
                rm: undefined,
                relativeWeight: undefined,
                sets: [
                  { repeticiones: 12, descanso: 60 },
                  { repeticiones: 10, descanso: 60 },
                  { repeticiones: 8, descanso: 60 },
                  { repeticiones: 8, descanso: 60 }
                ]
              }]
            };
          }
        }
      }
      return period;
    }));
  };

  const handleRemoveExercise = (periodIndex: number, exerciseId: string) => {
    setSelectedWeeks(prev => prev.map((period, idx) => {
      if (idx === periodIndex) {
        return {
          ...period,
          exercises: period.exercises.filter(ex => ex._id !== exerciseId)
        };
      }
      return period;
    }));
  };

  const handleSetChange = (periodIndex: number, exerciseId: string, setIndex: number, field: keyof Set, value: number) => {
    setSelectedWeeks(prev => prev.map((period, idx) => {
      if (idx === periodIndex) {
        return {
          ...period,
          exercises: period.exercises.map(exercise => {
            if (exercise._id === exerciseId) {
              const newSets = [...(exercise.sets || [])];
              newSets[setIndex] = {
                ...newSets[setIndex],
                [field]: value
              };
              return {
                ...exercise,
                sets: newSets
              };
            }
            return exercise;
          })
        };
      }
      return period;
    }));
  };

  const handleEditExercise = (periodIndex: number, exerciseId: string) => {
    setEditingExercise({ periodIndex, exerciseId });
  };

  const handleCloseEdit = () => {
    setEditingExercise(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWeeks.length >= 2) {
      setShowPeriodosPlantilla(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {showPeriodosPlantilla ? 'Configurar Períodos' : 'Crear Nueva Plantilla'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!showPeriodosPlantilla ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selecciona los períodos de la plantilla (4 semanas)
              </h3>
              <WeekGrid
                weekDays={getWeekDays(4)}
                selectedWeeks={selectedWeeks}
                onWeekSelect={handleWeekSelect}
                selectionStart={selectionStart}
                hoveredWeek={hoveredWeek}
                onHover={setHoveredWeek}
                getPreviewRange={getPreviewRange}
              />
            </div>

            {selectedWeeks.length > 0 && (
              <SelectedPeriods
                selectedWeeks={selectedWeeks}
                onRemovePeriod={handleRemovePeriod}
                onUpdatePeriodName={handleUpdatePeriodName}
              />
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={onClose}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={selectedWeeks.length < 2}
              >
                {selectedWeeks.length >= 2 ? 'Seguir' : 'Crear Plantilla'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-600" />
                Configuración de Períodos
              </h3>
              {loading ? (
                <div className="text-center py-4">
                  <span className="text-gray-600">Cargando ejercicios...</span>
                </div>
              ) : (
                <div className="space-y-8">
                  {selectedWeeks.map((period, periodIndex) => (
                    <div key={periodIndex} className="space-y-4">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-indigo-700">
                          Período {periodIndex + 1}: Semana {period.start} a Semana {period.end}
                        </h4>
                      </div>
                      
                      <div className="pl-4 space-y-4">
                        <h5 className="text-md font-medium text-gray-700">
                          Ejercicios del período
                        </h5>
                        <div className="grid grid-cols-1 gap-4">
                          {exercises.map((exercise) => (
                            <div
                              key={exercise._id}
                              className="bg-white border border-gray-200 rounded-lg shadow-sm"
                            >
                              <div className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-lg font-medium text-gray-900">
                                      {exercise.nombre}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      Grupos musculares: {exercise.grupoMuscular.join(', ')}
                                    </p>
                                    {period.exercises.find(e => e._id === exercise._id)?.isEditing && (
                                      <div className="mt-2">
                                        {periodIndex === 0 ? (
                                          <div className="flex items-center space-x-2">
                                            <label className="text-sm font-medium text-gray-700">
                                              RM:
                                            </label>
                                            <input
                                              type="number"
                                              min="0"
                                              value={period.exercises.find(e => e._id === exercise._id)?.rm || ''}
                                              onChange={(e) => handleRMChange(periodIndex, exercise._id, parseInt(e.target.value))}
                                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              placeholder="Kg"
                                            />
                                            <span className="text-sm text-gray-500">Kg</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center space-x-2">
                                            <label className="text-sm font-medium text-gray-700">
                                              Peso relativo al periodo 1:
                                            </label>
                                            <input
                                              type="number"
                                              min="0"
                                              max="200"
                                              value={period.exercises.find(e => e._id === exercise._id)?.relativeWeight || 100}
                                              onChange={(e) => handleRelativeWeightChange(periodIndex, exercise._id, parseInt(e.target.value))}
                                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              placeholder="%"
                                            />
                                            <span className="text-sm text-gray-500">%</span>
                                            {period.exercises.find(e => e._id === exercise._id)?.rm && (
                                              <span className="text-sm text-gray-500">
                                                ({Math.round(period.exercises.find(e => e._id === exercise._id)?.rm * (period.exercises.find(e => e._id === exercise._id)?.relativeWeight || 100) / 100)} Kg)
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleEditExercise(periodIndex, exercise._id)}
                                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                      title="Editar peso"
                                    >
                                      <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => toggleExerciseExpand(periodIndex, exercise._id)}
                                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                      title={period.exercises.find(e => e._id === exercise._id)?.isExpanded ? "Contraer" : "Expandir"}
                                    >
                                      {period.exercises.find(e => e._id === exercise._id)?.isExpanded ? (
                                        <ChevronUp className="w-5 h-5" />
                                      ) : (
                                        <ChevronDown className="w-5 h-5" />
                                      )}
                                    </button>
                                    {!period.exercises?.some(e => e._id === exercise._id) ? (
                                      <button
                                        onClick={() => handleExerciseChange(periodIndex, exercise._id)}
                                        className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                                        title="Agregar ejercicio al período"
                                      >
                                        <Plus className="w-5 h-5" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleRemoveExercise(periodIndex, exercise._id)}
                                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                        title="Quitar ejercicio del período"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                
                                {period.exercises.find(e => e._id === exercise._id)?.isExpanded && (
                                  <div className="mt-4 pt-4 border-t border-gray-100">
                                    {!exercise.descripcion && !exercise.equipo?.length ? (
                                      <div className="text-center py-4">
                                        <div className="flex flex-col items-center space-y-2">
                                          <AlertCircle className="w-12 h-12 text-gray-400" />
                                          <p className="text-gray-500 font-medium">
                                            Este ejercicio no está configurado o no tenemos información disponible
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-700">Descripción:</h5>
                                          <p className="text-sm text-gray-600">{exercise.descripcion}</p>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-700">Equipo necesario:</h5>
                                          <ul className="list-disc list-inside text-sm text-gray-600">
                                            {exercise.equipo.map((eq, idx) => (
                                              <li key={idx}>{eq}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-700 mb-2">Series:</h5>
                                          <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                              <thead className="bg-gray-50">
                                                <tr>
                                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Set</th>
                                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Repeticiones</th>
                                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descanso (seg)</th>
                                                </tr>
                                              </thead>
                                              <tbody className="bg-white divide-y divide-gray-200">
                                                {period.exercises.find(e => e._id === exercise._id)?.sets?.map((set, idx) => (
                                                  <tr key={idx}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                      {idx + 1}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                      <input
                                                        type="number"
                                                        min="1"
                                                        value={set.repeticiones}
                                                        onChange={(e) => handleSetChange(periodIndex, exercise._id, idx, 'repeticiones', parseInt(e.target.value))}
                                                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                      />
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                      <input
                                                        type="number"
                                                        min="0"
                                                        step="5"
                                                        value={set.descanso}
                                                        onChange={(e) => handleSetChange(periodIndex, exercise._id, idx, 'descanso', parseInt(e.target.value))}
                                                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                      />
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {period.exercises?.some(e => e._id === exercise._id) && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <span className="text-sm text-green-600 font-medium">
                                      ✓ Ejercicio seleccionado para este período
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowPeriodosPlantilla(false)}
                type="button"
              >
                Volver
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onSubmit({
                    ...formData,
                    totalWeeks: 4,
                    selectedPeriods: selectedWeeks
                  });
                  onClose();
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        )}
      </div>
      {editingExercise && (
        <EditExercisePopup
          isOpen={true}
          onClose={handleCloseEdit}
          exerciseName={exercises.find(e => e._id === editingExercise.exerciseId)?.nombre || ''}
          periodIndex={editingExercise.periodIndex}
          rm={selectedWeeks[0]?.exercises.find(e => e._id === editingExercise.exerciseId)?.rm}
          relativeWeight={selectedWeeks[editingExercise.periodIndex]?.exercises.find(e => e._id === editingExercise.exerciseId)?.relativeWeight}
          onRMChange={(value) => {
            handleRMChange(editingExercise.periodIndex, editingExercise.exerciseId, value);
          }}
          onRelativeWeightChange={(value) => {
            handleRelativeWeightChange(editingExercise.periodIndex, editingExercise.exerciseId, value);
          }}
        />
      )}
    </div>
  );
};

export default PopupDeEsqueletoPlantilla;
