import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, FileText, Dumbbell, BarChart, CheckCircle } from 'lucide-react';

interface CheckinDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: any;
  theme: string;
}

const CheckinDetailPopup: React.FC<CheckinDetailPopupProps> = ({
  isOpen,
  onClose,
  checkIn,
  theme
}) => {
  // Datos de ejemplo para mostrar cuando no hay datos reales
  const exampleData = {
    dayPlan: {
      _id: "dayplan123456",
      day: "Lunes",
      fecha: "2023-11-20T08:00:00.000Z",
      sessions: [
        {
          _id: "session123456",
          name: "Entrenamiento de Fuerza - Piernas",
          tipo: "Normal",
          rondas: 3,
          exercises: [
            {
              _id: "planningexercise123",
              exercise: {
                _id: "exercise123",
                nombre: "Sentadilla con Barra",
                descripcion: "Ejercicio compuesto para piernas",
                categoria: "Piernas"
              },
              sets: [
                {
                  _id: "set123",
                  reps: 12,
                  weight: 80,
                  rest: 90,
                  tempo: "2-1-2",
                  rpe: 8,
                  completed: true,
                  renderConfig: {
                    campo1: "reps",
                    campo2: "weight",
                    campo3: "rest"
                  },
                  checkIns: [
                    {
                      _id: "checkin123",
                      color: "#00FF00",
                      comentario: "Completado sin problemas, buena técnica",
                      fecha: "2023-11-20T09:15:00.000Z"
                    }
                  ]
                },
                {
                  _id: "set124",
                  reps: 10,
                  weight: 85,
                  rest: 120,
                  tempo: "2-1-2",
                  rpe: 9,
                  completed: true,
                  renderConfig: {
                    campo1: "reps",
                    campo2: "weight",
                    campo3: "rest"
                  },
                  checkIns: [
                    {
                      _id: "checkin124",
                      color: "#FFFF00",
                      comentario: "Últimas repeticiones con dificultad",
                      fecha: "2023-11-20T09:20:00.000Z"
                    }
                  ]
                }
              ]
            },
            {
              _id: "planningexercise124",
              exercise: {
                _id: "exercise124",
                nombre: "Extensión de Piernas",
                descripcion: "Ejercicio de aislamiento para cuádriceps",
                categoria: "Piernas"
              },
              sets: [
                {
                  _id: "set126",
                  reps: 15,
                  weight: 50,
                  rest: 60,
                  rpe: 7,
                  completed: true,
                  renderConfig: {
                    campo1: "reps",
                    campo2: "weight",
                    campo3: "rpe"
                  },
                  checkIns: [
                    {
                      _id: "checkin126",
                      color: "#00FF00",
                      comentario: "Buena sensación en el cuádriceps",
                      fecha: "2023-11-20T09:40:00.000Z"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          _id: "session123457",
          name: "Cardio",
          tipo: "Normal",
          rondas: 1,
          exercises: [
            {
              _id: "planningexercise125",
              exercise: {
                _id: "exercise125",
                nombre: "Carrera en cinta",
                descripcion: "Cardio moderado",
                categoria: "Cardio"
              },
              sets: [
                {
                  _id: "set128",
                  distance: 5000,
                  speed: 10,
                  calories: 350,
                  time: 30,
                  completed: true,
                  renderConfig: {
                    campo1: "distance",
                    campo2: "speed",
                    campo3: "calories"
                  },
                  checkIns: [
                    {
                      _id: "checkin128",
                      color: "#00FF00",
                      comentario: "Completado sin problemas, buena resistencia",
                      fecha: "2023-11-20T10:30:00.000Z"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    notasPlanning: [
      {
        _id: "nota123",
        titulo: "Observación del entrenamiento",
        contenido: "El cliente mostró buena técnica en general, pero necesita mejorar la postura en sentadillas."
      }
    ]
  };

  // Usar datos de ejemplo si no hay datos reales
  const displayData = checkIn && Object.keys(checkIn).length > 0 ? checkIn : exampleData;

  if (!displayData) return null;
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Función para formatear la hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
            } p-4 rounded-xl shadow-2xl border overflow-y-auto max-h-[80vh]`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Detalles del Check-in</h2>
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
            
            {/* Content */}
            <div className="space-y-3">
              {/* Información básica */}
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 opacity-70" />
                  <span className="font-medium">
                    {displayData.dayPlan?.day || ''} - {displayData.dayPlan?.fecha ? formatDate(displayData.dayPlan.fecha) : displayData.date || 'Fecha no disponible'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 opacity-70" />
                  <span>{displayData.time || (displayData.dayPlan?.fecha ? formatTime(displayData.dayPlan.fecha) : '')}</span>
                </div>
              </div>
              
              {/* Sesiones y ejercicios */}
              {displayData.dayPlan?.sessions && displayData.dayPlan.sessions.map((session: any, sessionIndex: number) => (
                <div key={session._id || sessionIndex} className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-4 h-4" />
                    <h3 className="font-medium">{session.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      theme === 'dark' ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {session.tipo}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    {session.exercises && session.exercises.map((exerciseItem: any, exerciseIndex: number) => (
                      <div key={exerciseItem._id || exerciseIndex} className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-600/50' : 'bg-gray-100'
                      }`}>
                        <p className="font-medium text-sm">{exerciseItem.exercise?.nombre || 'Ejercicio'}</p>
                        
                        <div className="mt-1 space-y-1">
                          {exerciseItem.sets && exerciseItem.sets.map((set: any, setIndex: number) => (
                            <div key={set._id || setIndex} className={`text-xs p-1.5 rounded flex items-center justify-between ${
                              theme === 'dark' 
                                ? set.completed ? 'bg-green-900/20' : 'bg-red-900/20'
                                : set.completed ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: set.checkIns?.[0]?.color || '#888888' }}
                                ></div>
                                <span>
                                  {set.reps && `${set.reps} reps`}
                                  {set.weight && ` × ${set.weight} kg`}
                                  {set.distance && ` ${set.distance}m`}
                                  {set.time && ` ${set.time} min`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {set.completed && <CheckCircle className="w-3 h-3" />}
                                {set.rpe && <span className="text-xs">RPE: {set.rpe}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Notas */}
              {displayData.notes && (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4" />
                    <h3 className="font-medium">Notas</h3>
                  </div>
                  <p className={`mt-1 text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {displayData.notes}
                  </p>
                </div>
              )}
              
              {/* Notas de planificación */}
              {displayData.notasPlanning && displayData.notasPlanning.length > 0 && (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart className="w-4 h-4" />
                    <h3 className="font-medium">Observaciones</h3>
                  </div>
                  <div className="space-y-2 mt-1">
                    {displayData.notasPlanning.map((nota: any, index: number) => (
                      <div key={nota._id || index} className={`p-2 rounded ${
                        theme === 'dark' ? 'bg-gray-600/50' : 'bg-gray-100'
                      }`}>
                        <p className="font-medium text-sm">{nota.titulo}</p>
                        <p className="text-xs mt-1">{nota.contenido}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="mt-4 flex justify-end">
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

export default CheckinDetailPopup;