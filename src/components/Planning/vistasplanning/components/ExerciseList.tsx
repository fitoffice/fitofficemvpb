import React from 'react';
import { Exercise } from '../utils/estadisticasUtils';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  handleApplyExercise: (periodId: string, exerciseId: string) => void;
  handleEditExercise: (exercise: Exercise, periodIndex: number) => void;
  periodId: string;
  periodIndex: number;
  handleEjercicioClick: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  loading,
  error,
  handleApplyExercise,
  handleEditExercise,
  periodId,
  periodIndex,
  handleEjercicioClick
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!exercises.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No se encontraron ejercicios</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          handleApplyExercise={handleApplyExercise}
          handleEditExercise={handleEditExercise}
          periodId={periodId}
          periodIndex={periodIndex}
          onClick={() => handleEjercicioClick(exercise)}
        />
      ))}
    </div>
  );
};

export default ExerciseList;