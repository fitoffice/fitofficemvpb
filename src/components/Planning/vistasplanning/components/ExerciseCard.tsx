import React from 'react';
import { Dumbbell, Edit2, Clock, Calendar } from 'lucide-react';
import Button from '../Button';
import { Exercise } from '../utils/estadisticasUtils';

interface ExerciseCardProps {
  exercise: Exercise;
  handleApplyExercise: (periodId: string, exerciseId: string) => void;
  handleEditExercise: (exercise: Exercise, periodIndex: number) => void;
  periodId: string;
  periodIndex: number;
  onClick: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  handleApplyExercise,
  handleEditExercise,
  periodId,
  periodIndex,
  onClick
}) => {
  return (
    <div 
      className="relative bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 mb-4 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="mb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-6 h-6 text-indigo-600 drop-shadow-sm" />
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
            {exercise.nombre || 'Sin nombre'}
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleApplyExercise(periodId, exercise.id);
            }}
          >
            Aplicar Ejercicio
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditExercise(exercise, periodIndex);
            }}
            disabled={!exercise.ejercicioId}
            className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {exercise.detalles?.grupoMuscular?.map((musculo: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700"
              >
                <Dumbbell className="w-3 h-3" />
                {musculo}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {exercise.apariciones !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                <Clock className="w-3 h-3" />
                {exercise.apariciones} {exercise.apariciones === 1 ? 'vez' : 'veces'} en este periodo
              </span>
            )}
            
            {exercise.semana !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                <Calendar className="w-3 h-3" />
                Semana {exercise.semana}
              </span>
            )}
          </div>
          
          {exercise.detalles?.descripcion && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600 italic">
                {exercise.detalles.descripcion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;