import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Activity,
  Target,
  Dumbbell,
  FileText,
  Edit,
  Plus,
  Upload,
  ChevronRight,
} from 'lucide-react';
import PopupRM from '../Planning/PopupRM';
import PopupUploadRM from '../Planning/PopupUploadRM';

interface RM {
  ejercicio: string;
  peso: number;
  fecha: string;
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
  __v: number;
}

interface ExerciseResponse {
  message: string;
  data: Exercise[];
}

interface PlanPlanProps {
  clienteId: string;
  planningId?: string; // Add planningId as an optional prop
  planningDetails?: {
    nombre: string;
    meta: string;
    fechaInicio: string;
    semanas: number;
    semanas_detalle: Array<{
      weekNumber: number;
      startDate: string;
      days: {
        [key: string]: {
          day: string;
          fecha: string;
          sessions: Array<any>;
        }
      }
    }>;
  };
}

const PanelPlan: React.FC<PlanPlanProps> = ({ clienteId, planningId, planningDetails }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [rms, setRMs] = useState<RM[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isRMModalOpen, setIsRMModalOpen] = useState(false);
  const [isUploadRMModalOpen, setIsUploadRMModalOpen] = useState(false);
  const [localPlanningDetails, setLocalPlanningDetails] = useState(planningDetails);

  // Add console log to check incoming props
  console.log('PanelPlan - Props received:', { clienteId, planningId, planningDetails });

  useEffect(() => {
    // If planningId is provided but no planningDetails, fetch the planning details
    const fetchPlanningDetails = async () => {
      if (planningId) {
        try {
          console.log('Fetching planning details for ID:', planningId);
          const token = localStorage.getItem('token');
          console.log('Using token:', token ? 'Token exists' : 'No token found');
          
          const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('API Response status:', response.status, response.statusText);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Raw API response data:', data);
            console.log('Plan structure:', data.plan);
            console.log('First week data:', data.plan?.[0]);
            console.log('Days in first week:', data.plan?.[0]?.days);
            
            // Transform the API response to match the expected format
            const transformedData = {
              nombre: data.nombre,
              meta: data.meta,
              fechaInicio: data.fechaInicio,
              semanas: data.semanas,
              semanas_detalle: data.plan || []
            };
            
            console.log('Transformed planning data:', transformedData);
            console.log('semanas_detalle structure:', transformedData.semanas_detalle);
            setLocalPlanningDetails(transformedData);
          } else {
            console.error('Error fetching planning details:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching planning details:', error);
        }
      }
    };

    fetchPlanningDetails();
  }, [planningId]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('Fetching exercises...');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises');
        if (response.ok) {
          const data: ExerciseResponse = await response.json();
          console.log('Exercises fetched successfully:', data);
          setExercises(data.data);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const fetchRMs = async () => {
      try {
        console.log('Fetching RMs...');
        const token = localStorage.getItem('token');
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/rms`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('RMs fetched successfully:', data);
          setRMs(data);
        }
      } catch (error) {
        console.error('Error loading RMs:', error);
      }
    };

    fetchRMs();
  }, [clienteId]);

  const obtenerSesionesHoy = () => {
    // Check if localPlanningDetails exists
    if (!localPlanningDetails) {
      return {
        tipo: 'error',
        mensaje: 'Cargando detalles del plan...'
      };
    }

    const hoy = new Date();
    const fechaInicioPlan = new Date(localPlanningDetails.fechaInicio);
    
    // Si la fecha actual es anterior al inicio del plan
    if (hoy < fechaInicioPlan) {
      return {
        tipo: 'pendiente',
        mensaje: `La planificación comenzará el ${fechaInicioPlan.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`
      };
    }

    // Verificar si semanas_detalle existe y es un array
    if (!localPlanningDetails.semanas_detalle || !Array.isArray(localPlanningDetails.semanas_detalle)) {
      return {
        tipo: 'error',
        mensaje: 'No hay detalles de planificación disponibles'
      };
    }

    // Buscar la semana actual
    for (const week of localPlanningDetails.semanas_detalle) {
      const fechaInicioSemana = new Date(week.startDate);
      const fechaFinSemana = new Date(fechaInicioSemana);
      fechaFinSemana.setDate(fechaFinSemana.getDate() + 7);

      if (hoy >= fechaInicioSemana && hoy < fechaFinSemana) {
        // Encontrar el día actual
        const nombreDia = hoy.toLocaleDateString('es-ES', { weekday: 'long' });
        const diaCapitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
        const sesionesHoy = week.days[diaCapitalizado]?.sessions || [];

        return {
          tipo: 'sesiones',
          sesiones: sesionesHoy,
          mensaje: sesionesHoy.length === 0 ? 'No hay sesiones programadas para hoy' : undefined
        };
      }
    }

    return {
      tipo: 'error',
      mensaje: 'No se encontraron sesiones para la fecha actual'
    };
  };

  // Only call obtenerSesionesHoy if localPlanningDetails exists
  const sesionesHoy = localPlanningDetails ? obtenerSesionesHoy() : { tipo: 'error', mensaje: 'Cargando detalles del plan...' };  
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Encabezado con nombre del plan */}
      <div className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border-l-4 border-blue-500`}>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          {localPlanningDetails?.nombre || 'Cargando plan...'}
        </h1>
      </div>

      {/* Grid de información del plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-blue-50'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Target className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Meta de la Planificación
            </h3>
          </div>
          <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            {localPlanningDetails?.meta || 'Cargando...'}
          </p>        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-green-50'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <Activity className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Progreso
            </h3>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-in-out" 
                style={{ width: '45%' }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                45% completado
              </p>
              <p className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {Math.floor((localPlanningDetails?.semanas || 0) * 0.45)} / {localPlanningDetails?.semanas || 0} semanas
              </p>
            </div>          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-purple-50'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <CalendarIcon className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Duración
            </h3>
          </div>
          <div className={`mt-3 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {/* Remove this block that's causing the error */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Inicio:</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                {localPlanningDetails?.fechaInicio ? new Date(localPlanningDetails.fechaInicio).toLocaleDateString() : 'Cargando...'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Duración:</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                {localPlanningDetails?.semanas || 0} semanas
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Fin estimado:</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                {(() => {
                  if (!localPlanningDetails?.fechaInicio) return 'Cargando...';
                  const fechaFin = new Date(localPlanningDetails.fechaInicio);
                  fechaFin.setDate(fechaFin.getDate() + (localPlanningDetails.semanas || 0) * 7);
                  return fechaFin.toLocaleDateString();
                })()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de RMs */}
      <div className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } border-t-4 border-violet-500`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-violet-100 dark:bg-violet-900/30">
              <Dumbbell className={`w-6 h-6 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
            </div>
            <h3 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Records Máximos (RMs)
            </h3>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log("Opening RM modal");
                setIsRMModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Añadir RM
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log("Opening Upload RM modal");
                setIsUploadRMModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Upload className="h-5 w-5 mr-2" />
              Subir RM
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } uppercase tracking-wider`}>
                  Ejercicio
                </th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } uppercase tracking-wider`}>
                  Peso (kg)
                </th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } uppercase tracking-wider`}>
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDark ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {exercises.length === 0 ? (
                <tr>
                  <td colSpan={3} className={`px-6 py-6 text-center ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Dumbbell className="w-10 h-10 text-gray-400" />
                      <p>No hay ejercicios registrados</p>
                      <button 
                        onClick={() => setIsRMModalOpen(true)}
                        className="text-blue-500 hover:text-blue-700 font-medium flex items-center"
                      >
                        Añadir primer RM <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                exercises.map((exercise) => (
                  <tr key={exercise._id} className={
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-blue-50'
                  }>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {exercise.nombre}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        Desconocido
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        Desconocida
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rutina de hoy */}
           {/* Rutina de hoy */}
           <div className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'} border-l-4 border-orange-500`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Dumbbell className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Rutina de Hoy
            </h3>
          </div>
          {sesionesHoy.tipo === 'sesiones' && sesionesHoy.sesiones.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => console.log('Editar rutina del día')}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors shadow-sm"
            >
              <Edit size={20} className="text-blue-500" />
            </motion.button>
          )}
        </div>
        
        <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {sesionesHoy.tipo === 'pendiente' ? (
            <p className="text-yellow-500">{sesionesHoy.mensaje}</p>
          ) : sesionesHoy.tipo === 'sesiones' ? (
            sesionesHoy.sesiones.length > 0 ? (
              <div className="space-y-3">
                {sesionesHoy.sesiones.map((sesion, index) => (
                  <motion.div
                    key={index} 
                    whileHover={{ scale: 1.01 }}
                    className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800/50 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">{sesion.nombre}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Dumbbell className="w-4 h-4" />
                      <span>Ejercicios programados</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <CalendarIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <p className="text-gray-500 dark:text-gray-400">{sesionesHoy.mensaje}</p>
              </div>
            )
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <CalendarIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400">{sesionesHoy.mensaje}</p>
            </div>
          )}
        </div>
      </div>
    {/* Notas */}
    <div className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'} border-l-4 border-yellow-500`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <FileText className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
        </div>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Notas
        </h3>
      </div>
      <div className={`p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-800/50 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        <p className="italic leading-relaxed">
          Cliente con molestia leve en rodilla derecha. Evitar ejercicios de alto impacto.
        </p>
      </div>
    </div>

      {/* Modal de RMs */}
      {isRMModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PopupRM
            onClose={() => {
              console.log("Closing RM modal");
              setIsRMModalOpen(false);
            }}
            planningId={clienteId}
          />
        </div>
      )}

      {/* Modal de Subir RMs */}
      {isUploadRMModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PopupUploadRM
            onClose={() => {
              console.log("Closing Upload RM modal");
              setIsUploadRMModalOpen(false);
            }}
            planningId={clienteId}
          />
        </div>
      )}
    </div>
  );
};

export default PanelPlan;
