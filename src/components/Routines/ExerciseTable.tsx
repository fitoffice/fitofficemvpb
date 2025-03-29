import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { Exercise, APIExercise, APIResponse } from './types';

interface ExerciseTableProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  theme?: 'light' | 'dark';
  openMetricDropdown: string | null;
  setOpenMetricDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdateMetric: (metricIndex: number, newType: string) => void;
}

export const ExerciseTable: React.FC<ExerciseTableProps> = ({
  exercises,
  setExercises,
  theme = 'light',
  openMetricDropdown,
  setOpenMetricDropdown,
  onUpdateMetric,
}) => {
  const [apiExercises, setApiExercises] = useState<APIExercise[]>([]);
  const [suggestions, setSuggestions] = useState<APIExercise[]>([]);
  const [focusedExerciseId, setFocusedExerciseId] = useState<string | null>(null);

  const metricOptions = [
    'Repeticiones',
    'Peso',
    'Descanso',
    'Tempo',
    'RPE',
    'RPM',
    'RIR',
    'Tiempo',
    'Velocidad',
    'Cadencia',
    'Distancia',
    'Altura',
    'Calorías',
    'Ronda'
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get<APIResponse>('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises');
      setApiExercises(response.data.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleExerciseNameChange = (exerciseId: string, value: string) => {
    const filteredSuggestions = apiExercises.filter(exercise =>
      exercise.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filteredSuggestions : []);
    setFocusedExerciseId(exerciseId);

    const newExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, name: value } : exercise
    );
    setExercises(newExercises);
  };

  const selectSuggestion = (exerciseId: string, suggestion: APIExercise) => {
    const newExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, name: suggestion.nombre } : exercise
    );
    setExercises(newExercises);
    setSuggestions([]);
    setFocusedExerciseId(null);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const updateMetricValue = (exerciseId: string, metricIndex: number, value: string) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            metrics: exercise.metrics.map((metric, idx) =>
              idx === metricIndex ? { ...metric, value } : metric
            )
          }
        : exercise
    ));
  };

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ejercicio
            </th>
            {exercises[0]?.metrics.map((metric, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider relative">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenMetricDropdown(openMetricDropdown === `header-${index}` ? null : `header-${index}`)}
                    className="hover:text-blue-500 focus:outline-none"
                  >
                    {metric.type}
                  </button>
                  {openMetricDropdown === `header-${index}` && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {metricOptions.map((option) => (
                          <button
                            key={option}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => onUpdateMetric(index, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Notas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {exercises.map((exercise, exerciseIndex) => (
            <tr key={exercise.id} className={exerciseIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
              <td className="px-6 py-4 relative">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => handleExerciseNameChange(exercise.id, e.target.value)}
                  onFocus={() => setFocusedExerciseId(exercise.id)}
                  className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-md"
                  placeholder="Nombre del ejercicio"
                />
                {focusedExerciseId === exercise.id && suggestions.length > 0 && (
                  <div className="absolute z-20 left-0 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion._id}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => selectSuggestion(exercise.id, suggestion)}
                      >
                        {suggestion.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </td>
              {exercise.metrics.map((metric, metricIndex) => (
                <td key={metricIndex} className="px-6 py-4">
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetricValue(exercise.id, metricIndex, e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-md"
                    placeholder={`${metric.type}`}
                  />
                </td>
              ))}
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={exercise.notes || ''}
                  onChange={(e) => {
                    const newExercises = [...exercises];
                    newExercises[exerciseIndex].notes = e.target.value;
                    setExercises(newExercises);
                  }}
                  className="w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-md"
                  placeholder="Notas"
                />
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => removeExercise(exercise.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};