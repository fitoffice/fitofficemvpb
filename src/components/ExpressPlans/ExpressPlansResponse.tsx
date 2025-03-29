import React from 'react';
import { motion } from 'framer-motion';

interface PlanOverview {
  overview: string;
  trainingDistribution: {
    [key: string]: string;
  };
  successTips: string[];
  precautions: string;
  nutrition: string;
  recovery: string;
}

interface DailyRoutines {
  dailyRoutines: {
    [key: string]: { rutina: string };
  };
  exercises: {
    [key: string]: string[];
  };
  setsAndReps: {
    [key: string]: string;
  };
  intensificationTechniques: {
    [key: string]: string;
  };
  executionNotes: {
    [key: string]: string;
  };
  alternatives: {
    [key: string]: string;
  };
}

interface ApiResponse {
  timestamp: string;
  planOverview: PlanOverview;
  dailyRoutines: DailyRoutines;
  status: string;
  version: string;
}

interface ExpressPlansResponseProps {
  apiResponse: ApiResponse | null;
  onClose: () => void;
}

const ExpressPlansResponse: React.FC<ExpressPlansResponseProps> = ({
  apiResponse,
  onClose,
}) => {
  if (!apiResponse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tu Plan de Entrenamiento Personalizado
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Vista General del Plan */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Vista General
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {apiResponse.planOverview.overview}
          </p>
        </div>
      </section>

      {/* Distribución del Entrenamiento */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Distribución del Entrenamiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(apiResponse.planOverview.trainingDistribution).map(
            ([day, activity]) => (
              <div
                key={day}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">{activity}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Rutinas Diarias */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Rutinas Diarias
        </h3>
        <div className="space-y-4">
          {Object.entries(apiResponse.dailyRoutines.dailyRoutines).map(
            ([day, { rutina }]) => {
              const exercises = apiResponse.dailyRoutines.exercises[rutina] || [];
              return (
                <div
                  key={day}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {day}
                  </h4>
                  <div className="space-y-2">
                    {exercises.map((exercise, index) => (
                      <div
                        key={`${exercise}-${index}`}
                        className="bg-white dark:bg-gray-600 rounded p-3"
                      >
                        <h5 className="font-medium text-gray-800 dark:text-gray-200">
                          {exercise}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Series y Reps:{' '}
                          {apiResponse.dailyRoutines.setsAndReps[exercise]}
                        </p>
                        {apiResponse.dailyRoutines.executionNotes[exercise] && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Notas:{' '}
                            {apiResponse.dailyRoutines.executionNotes[exercise]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Consejos de Éxito */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Consejos para el Éxito
        </h3>
        <ul className="list-disc list-inside space-y-2">
          {apiResponse.planOverview.successTips.map((tip, index) => (
            <li
              key={index}
              className="text-gray-700 dark:text-gray-300"
            >
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Precauciones y Nutrición */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Precauciones
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300">
              {apiResponse.planOverview.precautions}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Nutrición
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300">
              {apiResponse.planOverview.nutrition}
            </p>
          </div>
        </section>
      </div>

      {/* Recuperación */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Recuperación
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {apiResponse.planOverview.recovery}
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default ExpressPlansResponse;
