import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface WorkoutPlan {
  dailySchedule: Record<string, string>;
  workoutRoutines: Record<string, string>;
  bodyweightAlternatives: Record<string, string>;
  consistencyStrategies: string;
  contingencyPlan: string;
  nutritionTips: string;
}

interface TravelTrainingResponseProps {
  workoutPlan: WorkoutPlan;
  onBack: () => void;
}

const TravelTrainingResponse: React.FC<TravelTrainingResponseProps> = ({
  workoutPlan,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
        {/* Horario diario */}
        {Object.keys(workoutPlan.dailySchedule).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>📅</span> HORARIO DIARIO
            </h3>
            <div className="pl-4 space-y-4">
              {Object.entries(workoutPlan.dailySchedule).map(([dia, actividad]) => (
                <div key={dia} className="space-y-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{dia}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{actividad}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rutinas de entrenamiento */}
        {Object.keys(workoutPlan.workoutRoutines).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>💪</span> RUTINAS DE ENTRENAMIENTO
            </h3>
            <div className="pl-4 space-y-4">
              {Object.entries(workoutPlan.workoutRoutines).map(([nombre, rutina]) => (
                <div key={nombre} className="space-y-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{nombre}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{rutina}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternativas sin equipo */}
        {Object.keys(workoutPlan.bodyweightAlternatives).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🏃</span> ALTERNATIVAS SIN EQUIPO
            </h3>
            <div className="pl-4 space-y-4">
              {Object.entries(workoutPlan.bodyweightAlternatives).map(([nombre, alternativa]) => (
                <div key={nombre} className="space-y-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{nombre}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{alternativa}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consejos de nutrición */}
        {workoutPlan.nutritionTips && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🥗</span> CONSEJOS DE NUTRICIÓN
            </h3>
            <div className="pl-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{workoutPlan.nutritionTips}</p>
            </div>
          </div>
        )}

        {/* Estrategias de consistencia */}
        {workoutPlan.consistencyStrategies && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🎯</span> ESTRATEGIAS DE CONSISTENCIA
            </h3>
            <div className="pl-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{workoutPlan.consistencyStrategies}</p>
            </div>
          </div>
        )}

        {/* Plan de contingencia */}
        {workoutPlan.contingencyPlan && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>⚠️</span> PLAN DE CONTINGENCIA
            </h3>
            <div className="pl-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{workoutPlan.contingencyPlan}</p>
            </div>
          </div>
        )}
      </div>

      <motion.button
        onClick={onBack}
        className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-xl py-3 px-4 font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RotateCcw className="w-4 h-4" />
        Volver al Formulario
      </motion.button>
    </motion.div>
  );
};

export default TravelTrainingResponse;
