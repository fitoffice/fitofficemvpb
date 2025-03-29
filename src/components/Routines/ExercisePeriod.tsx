import React, { useEffect, useState } from 'react';
import { Search, Plus, Minus, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig {
  type: string;
  value: number;
}

interface Set {
  [key: string]: number;
  campo1: number;
  campo2: number;
  campo3: number;
}

interface ExerciseSet {
  exercise: string;
  sets: Set[];
  config: {
    campo1: string;
    campo2: string;
    campo3: string;
  };
}

interface Variant {
  color: string;
  exercises: ExerciseSet[];
}

interface Day {
  dayNumber: number;
  variants: Variant[];
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
}

interface Period {
  start: number;
  end: number;
  name: string;
}

interface ExercisePeriodProps {
  period: Period;
  onSave?: (day: Day) => void;
}

const fieldOptions = {
  campo1: [
    { value: 'reps', label: 'Repeticiones' },
    { value: 'distance', label: 'Distancia' },
    { value: 'tempo', label: 'Tempo' },
    { value: 'calories', label: 'Calorías' }
  ],
  campo2: [
    { value: 'weight', label: 'Peso' },
    { value: 'speed', label: 'Velocidad' },
    { value: 'height', label: 'Altura' },
    { value: 'cadence', label: 'Cadencia' },
    { value: 'rpm', label: 'RPM' }
  ],
  campo3: [
    { value: 'rest', label: 'Descanso' },
    { value: 'round', label: 'Ronda' },
    { value: 'rpe', label: 'RPE' },
    { value: 'rir', label: 'RIR' }
  ]
};

export function ExercisePeriod({ period, onSave }: ExercisePeriodProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'verde'>('verde');
  const [currentDay, setCurrentDay] = useState<Day>({
    dayNumber: 1,
    variants: [
      { color: 'verde', exercises: [] }
    ]
  });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSetModal, setShowSetModal] = useState(false);
  const [currentSets, setCurrentSets] = useState<Set[]>([]);
  const [currentConfig, setCurrentConfig] = useState({
    campo1: 'reps',
    campo2: 'weight',
    campo3: 'rest'
  });
  const [expandedExercises, setExpandedExercises] = useState<{ [key: string]: boolean }>({});

  const formatDateRange = (start: number, end: number) => {
    const startWeek = Math.ceil(start / 7);
    const startDay = start % 7 === 0 ? 7 : start % 7;
    const endWeek = Math.ceil(end / 7);
    const endDay = end % 7 === 0 ? 7 : end % 7;
    return `Semana ${startWeek} (día ${startDay}) - Semana ${endWeek} (día ${endDay})`
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ejercicios');
        }

        const data = await response.json();
        setExercises(data.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleAddSet = () => {
    setCurrentSets([...currentSets, { campo1: 0, campo2: 0, campo3: 0 }]);
  };

  const handleRemoveSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index: number, field: string, value: number) => {
    const newSets = [...currentSets];
    newSets[index] = { ...newSets[index], [field]: value };
    setCurrentSets(newSets);
  };

  const handleConfigChange = (field: string, value: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentSets([{ campo1: 0, campo2: 0, campo3: 0 }]);

    // Cargar configuración existente si existe
    const existingExercise = getCurrentExercise(exercise._id);
    if (existingExercise) {
      setCurrentConfig(existingExercise.config);
      setCurrentSets(existingExercise.sets);
    } else {
      setCurrentConfig({
        campo1: 'reps',
        campo2: 'weight',
        campo3: 'rest'
      });
    }

    setShowSetModal(true);
  };

  const getCurrentExercise = (exerciseId: string) => {
    const variant = currentDay.variants.find(v => v.color === selectedVariant);
    return variant?.exercises.find(e => e.exercise === exerciseId);
  };

  const getFieldLabel = (field: string, type: string) => {
    if (period.start === 1 && type === 'weight') {
      return 'RM*';
    }
    return fieldOptions[field as keyof typeof fieldOptions]
      .find(option => option.value === type)?.label || type;
  };

  const toggleExerciseExpand = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const getExerciseSets = (exerciseId: string) => {
    const variant = currentDay.variants.find(v => v.color === selectedVariant);
    if (!variant) return null;

    const exerciseData = variant.exercises.find(e => e.exercise === exerciseId);
    return exerciseData?.sets || null;
  };

  const handleSaveExercise = () => {
    if (!selectedExercise) return;

    const newDay = { ...currentDay };
    const variantIndex = newDay.variants.findIndex(v => v.color === selectedVariant);

    if (variantIndex !== -1) {
      const existingExerciseIndex = newDay.variants[variantIndex].exercises.findIndex(
        e => e.exercise === selectedExercise._id
      );

      const exerciseData = {
        exercise: selectedExercise._id,
        sets: currentSets,
        config: currentConfig
      };

      console.log('Datos del ejercicio a guardar:', exerciseData);

      if (existingExerciseIndex !== -1) {
        newDay.variants[variantIndex].exercises[existingExerciseIndex] = exerciseData;
      } else {
        newDay.variants[variantIndex].exercises.push(exerciseData);
      }

      setCurrentDay(newDay);
      if (onSave) {
        console.log('Enviando día actualizado:', newDay);
        onSave(newDay);
      }
    }

    setShowSetModal(false);
  };

  const getCurrentExerciseConfig = (exerciseId: string) => {
    const variant = currentDay.variants.find(v => v.color === selectedVariant);
    const exercise = variant?.exercises.find(e => e.exercise === exerciseId);
    return exercise?.config;
  };

  const getUnitLabel = (type: string): string => {
    if (period.start === 1 && type === 'weight') {
      return '%';
    }
    switch (type) {
      case 'reps':
        return 'reps';
      case 'weight':
        return 'kg';
      case 'rest':
        return 'seg';
      case 'distance':
        return 'm';
      case 'tempo':
        return 'seg';
      case 'calories':
        return 'cal';
      case 'speed':
        return 'km/h';
      case 'height':
        return 'cm';
      case 'cadence':
        return 'bpm';
      case 'rpm':
        return 'rpm';
      case 'round':
        return 'rnd';
      case 'rpe':
        return 'RPE';
      case 'rir':
        return 'RIR';
      default:
        return '';
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.grupoMuscular.some(grupo =>
      grupo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div className="bg-white rounded-lg shadow-lg p-6">Cargando ejercicios...</div>;
  }

  if (error) {
    return <div className="bg-white rounded-lg shadow-lg p-6 text-red-600">Error: {error}</div>;
  }

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case 'rojo': return 'bg-red-600';
      case 'verde': return 'bg-green-600';
      case 'amarillo': return 'bg-yellow-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {period.name}
            </h2>
            <span className="text-sm text-gray-500">
              {formatDateRange(period.start, period.end)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar ejercicios..."
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise._id}
            className="border-2 border-gray-100 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-200 hover:shadow-md"
          >
            <div className="p-4 bg-white flex items-center justify-between">
              <div className="flex flex-col flex-grow">
                <span className="text-lg font-semibold text-gray-800">{exercise.nombre}</span>
                <span className="text-sm text-gray-500 mt-1">
                  {exercise.grupoMuscular.join(', ')}
                </span>
              </div>
              <div className="flex gap-3 items-center">
                {getExerciseSets(exercise._id) ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedExercise(exercise);
                        setCurrentSets(getExerciseSets(exercise._id) || []);
                        setShowSetModal(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => toggleExerciseExpand(exercise._id)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      {expandedExercises[exercise._id] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddExercise(exercise)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                )}
              </div>
            </div>

            {expandedExercises[exercise._id] && getExerciseSets(exercise._id) && (
              <div className={clsx(
                'overflow-hidden transition-all duration-300',
                expandedExercises[exercise._id] ? 'max-h-[500px]' : 'max-h-0'
              )}>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Series Configuradas</h4>
                    <button
                      onClick={() => handleAddExercise(exercise)}
                      className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                    >
                      <Edit2 size={14} />
                      <span>Editar Series</span>
                    </button>
                  </div>

                  {/* Encabezados de columnas */}
                  {getExerciseSets(exercise._id)?.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 px-2">
                      {Object.entries(getCurrentExerciseConfig(exercise._id) || {}).map(([field, type]) => (
                        <div key={field} className="capitalize">
                          {getFieldLabel(field, type)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Series */}
                  <div className="space-y-2">
                    {getExerciseSets(exercise._id)?.map((set, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        {Object.entries(getCurrentExerciseConfig(exercise._id) || {}).map(([field, type]) => (
                          <div key={field} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              {set[field]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getUnitLabel(type)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showSetModal && selectedExercise && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-[700px] max-h-[90vh] overflow-hidden shadow-xl transform transition-all">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
              <h3 className="text-xl font-bold text-white">
                Configurar series para {selectedExercise.nombre}
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Personaliza los campos y valores para cada serie del ejercicio
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Configuración de campos */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800">Configuración de campos</h4>
                  <p className="text-xs text-gray-500 mt-1">Selecciona el tipo de medida para cada campo</p>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4 bg-white">
                  {Object.entries(fieldOptions).map(([field, options]) => (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Campo {field.slice(-1)}
                      </label>
                      <select
                        value={currentConfig[field as keyof typeof currentConfig]}
                        onChange={(e) => handleConfigChange(field, e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      >
                        {options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Series */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800">Series del ejercicio</h4>
                  <p className="text-xs text-gray-500 mt-1">Configura los valores para cada serie</p>
                </div>
                <div className="p-4 space-y-3">
                  {currentSets.map((set, index) => (
                    <div key={index} className="group bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        {Object.entries(currentConfig).map(([field, type]) => (
                          <div key={field} className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500">
                              {getFieldLabel(field, type)}
                            </label>
                            <input
                              type="number"
                              value={set[field]}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (period.start === 1 && currentConfig[field] === 'weight') {
                                  // Para RM, limitar entre 1 y 100
                                  if (value >= 1 && value <= 100) {
                                    handleSetChange(index, field, value);
                                  }
                                } else {
                                  handleSetChange(index, field, value);
                                }
                              }}
                              min={period.start === 1 && currentConfig[field] === 'weight' ? "1" : "0"}
                              max={period.start === 1 && currentConfig[field] === 'weight' ? "100" : undefined}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleRemoveSet(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddSet}
                className="w-full py-3 px-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Plus size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Añadir Nueva Serie</span>
              </button>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowSetModal(false)}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveExercise}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm font-medium text-sm flex items-center gap-2"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}