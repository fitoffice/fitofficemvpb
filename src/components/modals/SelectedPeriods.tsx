import React, { useState } from 'react';
import { Period } from '../../types/planning';
import { Edit2, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SelectedPeriodsProps {
  periods: Period[];
  onDeletePeriod: (index: number) => void;
  onPeriodNameChange: (index: number, newName: string) => void;
  onAddExercise?: (periodIndex: number) => void;
  onDeleteExercise?: (periodIndex: number, exerciseId: string) => void;
  onEditExercise?: (periodIndex: number, exerciseId: string) => void;
  onToggleExercise?: (periodIndex: number, exerciseId: string) => void;
  onUpdateExercise?: (periodIndex: number, exerciseId: string, updates: any) => void;
}

const SelectedPeriods: React.FC<SelectedPeriodsProps> = ({
  periods,
  onDeletePeriod,
  onPeriodNameChange,
  onAddExercise,
  onDeleteExercise,
  onEditExercise,
  onToggleExercise,
  onUpdateExercise
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [expandedPeriods, setExpandedPeriods] = useState<number[]>([]);

  if (!periods || periods.length === 0) {
    return null;
  }

  const formatDateRange = (start: number, end: number) => {
    const startWeek = Math.ceil(start / 7);
    const startDay = start % 7 === 0 ? 7 : start % 7;
    const endWeek = Math.ceil(end / 7);
    const endDay = end % 7 === 0 ? 7 : end % 7;

    return `Semana ${startWeek} (día ${startDay}) - Semana ${endWeek} (día ${endDay})`;
  };

  const handleStartEditing = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditingName(currentName);
  };

  const handleSaveEdit = (index: number) => {
    onPeriodNameChange(index, editingName);
    setEditingIndex(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingName("");
  };

  const togglePeriod = (index: number) => {
    setExpandedPeriods(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const isPeriodExpanded = (index: number) => {
    return expandedPeriods.includes(index);
  };

  return (
    <div className="space-y-4">
      {periods.map((period, index) => (
        <div key={index} className="bg-blue-50 rounded-lg overflow-hidden">
          <div className="flex flex-col bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              {editingIndex === index ? (
                <div className="flex items-center gap-2 flex-grow">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder="Nombre del período"
                    className="text-lg font-semibold text-gray-800 border rounded px-2 py-1 flex-grow"
                    autoFocus
                  />
                  <button 
                    className="text-green-500 hover:text-green-700 p-1 rounded"
                    onClick={() => handleSaveEdit(index)}
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700 p-1 rounded"
                    onClick={handleCancelEdit}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-grow">
                  <button
                    onClick={() => togglePeriod(index)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded transition-transform duration-200"
                  >
                    {isPeriodExpanded(index) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 flex-grow">
                    {period.name || `Periodo ${index + 1}`}
                  </h3>
                  <button 
                    className="text-blue-500 hover:text-blue-700 p-1 rounded"
                    onClick={() => handleStartEditing(index, period.name || `Periodo ${index + 1}`)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    className="text-red-400 hover:text-red-600 p-1 rounded"
                    onClick={() => onDeletePeriod(index)}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {formatDateRange(period.start, period.end)}
            </div>
            {isPeriodExpanded(index) && (
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Detalles del periodo:</h4>
                  <div className="text-sm text-gray-600">
                    <p>• Duración: {period.end - period.start + 1} días</p>
                    <p>• Días totales de entrenamiento: {period.end - period.start + 1} días</p>
                    {/* Aquí puedes añadir más detalles del periodo */}
                  </div>
                  {period.exercises && period.exercises.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Ejercicios:</h4>
                      <ul className="mt-1 space-y-1">
                        {period.exercises.map((exercise, exerciseIndex) => (
                          <li 
                            key={exercise._id || exerciseIndex} 
                            className="flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50 p-1 rounded"
                          >
                            <span 
                              className="cursor-pointer"
                              onClick={() => onToggleExercise?.(index, exercise._id)}
                            >
                              {exercise.nombre}
                            </span>
                            <div className="flex gap-2">
                              {onEditExercise && (
                                <button
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() => onEditExercise(index, exercise._id)}
                                >
                                  Editar
                                </button>
                              )}
                              {onDeleteExercise && (
                                <button
                                  className="text-red-400 hover:text-red-600"
                                  onClick={() => onDeleteExercise(index, exercise._id)}
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedPeriods;
