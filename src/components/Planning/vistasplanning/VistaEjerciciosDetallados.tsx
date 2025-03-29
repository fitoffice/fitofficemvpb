import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  Dumbbell,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Weight,
  Repeat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Set {
  _id: string;
  reps: number;
  weight: number;
  rest: number;
  tempo?: string;
  rpe?: number;
  completed: boolean;
}

interface Exercise {
  _id: string;
  exercise: {
    _id: string;
    nombre: string;
    grupoMuscular: string[];
    descripcion?: string;
  };
  sets: Set[];
}

interface Session {
  _id: string;
  name: string;
  tipo: string;
  exercises: Exercise[];
}

interface DayPlan {
  _id: string;
  day: string;
  fecha: string;
  sessions: Session[];
}

interface WeekPlan {
  days: {
    [key: string]: DayPlan;
  };
}

interface VistaEjerciciosDetalladosProps {
  semanaActual: number;
  planSemanal: WeekPlan['days'];
  updatePlan?: (plan: WeekPlan['days']) => void;
}

const VistaEjerciciosDetallados: React.FC<VistaEjerciciosDetalladosProps> = ({
  semanaActual,
  planSemanal,
}) => {
  const { theme } = useTheme();
  const [expandedDay, setExpandedDay] = React.useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (!planSemanal) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-900'
      } rounded-xl p-6 shadow-lg`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Ejercicios Detallados - Semana {semanaActual}
      </h2>
      {Object.entries(planSemanal).map(([day, dayPlan]) => (
        <motion.div
          key={dayPlan._id}
          className={`mb-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-md overflow-hidden`}
        >
          <motion.button
            className={`w-full p-4 flex justify-between items-center ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors duration-200`}
            onClick={() => toggleDay(day)}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">{day}</span>
              <span className="text-sm text-gray-500">
                {dayPlan.sessions.length} sesiones
              </span>
            </div>
            {expandedDay === day ? <ChevronUp /> : <ChevronDown />}
          </motion.button>
          <AnimatePresence>
            {expandedDay === day && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {dayPlan.sessions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No hay sesiones programadas para este día
                  </div>
                ) : (
                  dayPlan.sessions.map((session) => (
                    <div
                      key={session._id}
                      className="p-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <span className="mr-2">{session.name}</span>
                        <span className="text-sm px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {session.tipo}
                        </span>
                      </h4>
                      <div className="space-y-6">
                        {session.exercises.map((exercise) => (
                          <div
                            key={exercise._id}
                            className="ml-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                          >
                            <div className="flex items-center mb-3">
                              <Dumbbell className="mr-2 w-5 h-5 text-blue-500" />
                              <span className="font-medium">
                                {exercise.exercise.nombre}
                              </span>
                            </div>
                            {exercise.exercise.descripcion && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 ml-7">
                                {exercise.exercise.descripcion}
                              </p>
                            )}
                            <div className="ml-7 space-y-2">
                              {exercise.sets.map((set, index) => (
                                <div
                                  key={set._id}
                                  className={`flex items-center text-sm p-2 rounded ${
                                    set.completed
                                      ? 'bg-green-100 dark:bg-green-900'
                                      : 'bg-gray-100 dark:bg-gray-600'
                                  }`}
                                >
                                  <span className="w-16">Set {index + 1}:</span>
                                  <span className="flex items-center mr-4">
                                    <Repeat className="w-4 h-4 mr-1" />
                                    {set.reps} reps
                                  </span>
                                  <span className="flex items-center mr-4">
                                    <Weight className="w-4 h-4 mr-1" />
                                    {set.weight} kg
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {set.rest}s
                                  </span>
                                  {set.tempo && (
                                    <span className="ml-4">
                                      Tempo: {set.tempo}
                                    </span>
                                  )}
                                  {set.completed && (
                                    <span className="ml-auto text-green-600 dark:text-green-400">
                                      Completado ✓
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VistaEjerciciosDetallados;
