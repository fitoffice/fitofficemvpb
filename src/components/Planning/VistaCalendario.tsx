import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Plus,
  Target,
  X,
  Calendar,
  BarChart2,
  Users,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Common/Button';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
}

interface Session {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface DayPlan {
  id: string;
  sessions: Session[];
}

interface WeekPlan {
  [key: string]: DayPlan;
}

interface VistaCalendarioProps {
  semanaActual: number;
  planSemanal: WeekPlan;
  updatePlan: (plan: WeekPlan) => void;
}

const VistaCalendario: React.FC<VistaCalendarioProps> = ({
  semanaActual,
  planSemanal,
  updatePlan,
}) => {
  const { theme } = useTheme();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const currentDate = new Date();
  const currentMonth = meses[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const handleAddSession = (dia: string) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: 'Nueva Sesión',
      exercises: [],
    };
    const updatedPlan = {
      ...planSemanal,
      [dia]: {
        ...planSemanal[dia],
        sessions: [...planSemanal[dia].sessions, newSession],
      },
    };
    updatePlan(updatedPlan);
  };

  const getSessionColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-emerald-500 to-emerald-600',
      'from-amber-500 to-amber-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  const getSessionStats = (session: Session) => {
    const totalExercises = session.exercises.length;
    const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const estimatedDuration = session.exercises.reduce((acc, ex) => acc + (ex.sets * ex.rest || 0), 0) / 60;
    
    return { totalExercises, totalSets, estimatedDuration };
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-white to-gray-50'}`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Calendario de Entrenamiento
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {currentMonth} {currentYear} · Semana {semanaActual}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="normal"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-lg`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </Button>
            <Button
              variant="normal"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-lg`}
            >
              <span>Siguiente</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-6">
          {dias.map((dia) => (
            <div key={dia} className="text-center">
              <span className={`inline-block px-4 py-2 rounded-lg font-medium
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md mb-4`}>
                {dia}
              </span>
            </div>
          ))}

          {dias.map((dia) => (
            <motion.div
              key={dia}
              className={`relative min-h-[250px] rounded-2xl p-4 transition-all duration-300
                ${theme === 'dark'
                  ? selectedDay === dia
                    ? 'bg-gray-700 shadow-2xl'
                    : 'bg-gray-800 hover:bg-gray-750'
                  : selectedDay === dia
                  ? 'bg-white shadow-2xl'
                  : 'bg-gray-50 hover:bg-white'
                } backdrop-blur-sm`}
              onClick={() => setSelectedDay(dia)}
            >
              <motion.div
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <Button
                  variant="create"
                  className="p-2 rounded-xl shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSession(dia);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>

              <div className="space-y-3 mt-4">
                {planSemanal[dia].sessions.map((session, index) => {
                  const stats = getSessionStats(session);
                  return (
                    <motion.div
                      key={session.id}
                      className={`relative p-3 rounded-xl cursor-pointer shadow-lg
                        bg-gradient-to-r ${getSessionColor(index)}
                        hover:shadow-xl transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                      onHoverStart={() => setHoveredSession(session.id)}
                      onHoverEnd={() => setHoveredSession(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSession(session);
                      }}
                    >
                      <div className="text-white">
                        <div className="font-semibold mb-2">{session.name}</div>
                        <AnimatePresence>
                          {hoveredSession === session.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <Dumbbell className="w-3 h-3" />
                                <span>{stats.totalExercises} ejercicios</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <BarChart2 className="w-3 h-3" />
                                <span>{stats.totalSets} series</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Timer className="w-3 h-3" />
                                <span>~{Math.round(stats.estimatedDuration)} min</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={() => setSelectedSession(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl p-6 rounded-2xl shadow-2xl
                ${theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                  : 'bg-gradient-to-br from-white to-gray-50'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {selectedSession.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Detalles de la sesión
                  </p>
                </div>
                <Button
                  variant="normal"
                  className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setSelectedSession(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Dumbbell, label: 'Ejercicios', value: selectedSession.exercises.length },
                  { icon: BarChart2, label: 'Series Totales', value: selectedSession.exercises.reduce((acc, ex) => acc + ex.sets, 0) },
                  { icon: Clock, label: 'Duración Est.', value: `${Math.round(selectedSession.exercises.reduce((acc, ex) => acc + (ex.sets * ex.rest || 0), 0) / 60)} min` },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}
                  >
                    <stat.icon className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {selectedSession.exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl shadow-lg
                      ${theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-650'
                        : 'bg-white hover:bg-gray-50'}
                      transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <Dumbbell className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <span className="font-medium">{exercise.name}</span>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Ejercicio {index + 1}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-lg text-sm
                          ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4 text-green-500" />
                            <span>{exercise.sets}x{exercise.reps}</span>
                          </div>
                        </div>
                        {exercise.weight && (
                          <div className={`px-3 py-1 rounded-lg text-sm
                            ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                            {exercise.weight}kg
                          </div>
                        )}
                        {exercise.rest && (
                          <div className={`px-3 py-1 rounded-lg text-sm
                            ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-purple-500" />
                              <span>{exercise.rest}s</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VistaCalendario;