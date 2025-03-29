import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, FileText, BarChart2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface CompareRoutinePopupProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: any;
  theme: string;
}

const CompareRoutinePopup: React.FC<CompareRoutinePopupProps> = ({
  isOpen,
  onClose,
  checkIn,
  theme
}) => {
  if (!checkIn) return null;

  // Datos de ejemplo para la comparación
  // En una implementación real, estos datos vendrían de la API o props
  const routineComparison = {
    date: checkIn.date,
    plannedExercises: [
      { 
        name: 'Press de banca', 
        planned: { sets: 4, reps: 10, weight: 80 },
        actual: { sets: 4, reps: 10, weight: 80 },
        completed: true 
      },
      { 
        name: 'Sentadillas', 
        planned: { sets: 4, reps: 12, weight: 100 },
        actual: { sets: 4, reps: 10, weight: 90 }, // Ejemplo de diferencia
        completed: true 
      },
      { 
        name: 'Peso muerto', 
        planned: { sets: 3, reps: 8, weight: 120 },
        actual: { sets: 0, reps: 0, weight: 0 },
        completed: false 
      },
      { 
        name: 'Pull-ups', 
        planned: { sets: 3, reps: 10, weight: 0 },
        actual: { sets: 3, reps: 8, weight: 0 },
        completed: true 
      },
    ],
    completionRate: 75, // porcentaje
  };

  // Función para determinar si hay diferencia entre lo planeado y lo realizado
  const hasDifference = (planned, actual) => {
    return planned !== actual;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed top-[10%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl ${
            theme === 'dark' 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-900 border-gray-200'
          } p-4 rounded-xl shadow-2xl border max-h-[80vh] flex flex-col`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <BarChart2 className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                }`} />
              </div>
              <h2 className="text-xl font-bold">Comparación con Rutina</h2>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content - Added overflow-y-auto to make the content scrollable */}
          <div className="space-y-3 overflow-y-auto flex-grow pr-1">
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5" />
                <h3 className="font-medium">{checkIn.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-70" />
                  <span>{routineComparison.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 opacity-70" />
                  <span>{checkIn.time}</span>
                </div>
              </div>
            </div>
            
            {/* Completion Rate */}
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h3 className="font-medium mb-2">Tasa de Cumplimiento</h3>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div 
                  className={`h-full ${
                    routineComparison.completionRate >= 80 
                      ? 'bg-green-500' 
                      : routineComparison.completionRate >= 50 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${routineComparison.completionRate}%` }}
                ></div>
              </div>
              <p className={`mt-1 text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {routineComparison.completionRate}% completado
              </p>
            </div>
            
            {/* Exercise Comparison - Redesigned */}
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h3 className="font-medium mb-2">Comparación de Ejercicios</h3>
              <div className="max-h-[200px] overflow-y-auto">
                {routineComparison.plannedExercises.map((exercise, index) => (
                  <div 
                    key={index} 
                    className={`mb-3 p-2 rounded-lg ${
                      theme === 'dark' 
                        ? exercise.completed ? 'bg-gray-700/70' : 'bg-red-900/20' 
                        : exercise.completed ? 'bg-gray-100' : 'bg-red-100/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{exercise.name}</h4>
                      {exercise.completed ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                        }`}>
                          Completado
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          theme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
                        }`}>
                          No completado
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <div className="font-medium text-center">Parámetro</div>
                      <div className={`font-medium text-center ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                      }`}>Planificado</div>
                      <div className={`font-medium text-center ${
                        theme === 'dark' ? 'text-green-300' : 'text-green-600'
                      }`}>Realizado</div>
                      
                      {/* Series */}
                      <div className="text-center">Series</div>
                      <div className="text-center">{exercise.planned.sets}</div>
                      <div className={`text-center ${
                        exercise.completed && hasDifference(exercise.planned.sets, exercise.actual.sets)
                          ? theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
                          : ''
                      }`}>
                        {exercise.completed ? exercise.actual.sets : '-'}
                      </div>
                      
                      {/* Repeticiones */}
                      <div className="text-center">Repeticiones</div>
                      <div className="text-center">{exercise.planned.reps}</div>
                      <div className={`text-center ${
                        exercise.completed && hasDifference(exercise.planned.reps, exercise.actual.reps)
                          ? theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
                          : ''
                      }`}>
                        {exercise.completed ? exercise.actual.reps : '-'}
                      </div>
                      
                      {/* Peso */}
                      <div className="text-center">Peso</div>
                      <div className="text-center">
                        {exercise.planned.weight > 0 ? `${exercise.planned.weight} kg` : 'Peso corporal'}
                      </div>
                      <div className={`text-center ${
                        exercise.completed && hasDifference(exercise.planned.weight, exercise.actual.weight)
                          ? theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
                          : ''
                      }`}>
                        {exercise.completed 
                          ? exercise.actual.weight > 0 ? `${exercise.actual.weight} kg` : 'Peso corporal'
                          : '-'
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {checkIn.notes && (
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-medium">Notas del Check-in</h3>
                </div>
                <p className={`mt-1 text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {checkIn.notes}
                </p>
              </div>
            )}
            
            {/* Legend */}
            <div className={`p-2 rounded-lg text-xs ${
              theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${
                  theme === 'dark' ? 'bg-yellow-300' : 'bg-yellow-500'
                }`}></div>
                <span>Valores diferentes a lo planificado</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-4 flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cerrar
            </button>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompareRoutinePopup;