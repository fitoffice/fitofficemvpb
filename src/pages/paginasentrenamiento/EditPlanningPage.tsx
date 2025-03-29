import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Planning, WeekPlan, DayPlan, Session } from '../types/planning';
import { planningService } from '../../services/planningService';
import EditPlanningPageCalendario from '../../components/Planning/EditPlanningPageCalendario';
import VistaSimplificada from '../../components/Planning/vistasplanning/VistaSimplificada';
import VistaCompleja from '../../components/Planning/vistasplanning/VistaCompleja';
import VistaExcel from '../../components/Planning/vistasplanning/VistaExcel';
import VistaResumen from '../../components/Planning/vistasplanning/VistaResumen';
import VistaEjerciciosDetallados from '../../components/Planning/vistasplanning/VistaEjerciciosDetallados';
import VistaProgreso from '../../components/Planning/vistasplanning/VistaProgreso';
import VistaEstadisticas from '../../components/Planning/vistasplanning/VistaEstadisticas';
import VistaNotas from '../../components/Planning/vistasplanning/VistaNotas';
import VistaRutinasPredefinidas from '../../../VistaRutinasPredefinidas';
import VistaConfiguracion from '../../components/Planning/vistasplanning/VistaConfiguracion';
import Button from '../../components/Common/Button';
import PopupConfiguracionPlanning from '../../components/Planning/PopupConfiguracionPlanning';
import {
  Grid,
  List,
  Save,
  ArrowLeft,
  PieChart,
  Dumbbell,
  TrendingUp,
  BarChart2,
  FileText,
  Library,
  Settings,
  X,
  Layout,
  LineChart,
  ClipboardList,
  Table,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditPlanningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [planning, setPlanning] = useState<Planning | null>(null);
  const [semanaActual, setSemanaActual] = useState(1);
  const [planSemanal, setPlanSemanal] = useState<{ [key: string]: DayPlan } | null>(null);
  const [vistaActual, setVistaActual] = useState<
    | 'simplificada'
    | 'compleja'
    | 'excel'
    | 'resumen'
    | 'ejercicios'
    | 'progreso'
    | 'estadisticas'
    | 'notas'
    | 'rutinas'
    | 'configuracion'
  >('simplificada');
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommandAssisterOpen, setIsCommandAssisterOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now()); // Add this line to track updates

  const isHomeRoute = location.pathname === '/';

  useEffect(() => {
    const handleCommandAssisterChange = (event: CustomEvent) => {
      setIsCommandAssisterOpen(event.detail.isOpen);
    };

    window.addEventListener('commandAssisterStateChange', handleCommandAssisterChange as EventListener);
    return () => {
      window.removeEventListener('commandAssisterStateChange', handleCommandAssisterChange as EventListener);
    };
  }, []);

  const fetchPlanning = async (force: boolean = false) => {
    if (!id) return;
    
    if (force) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // Add cache busting parameter to prevent browser caching
        cache: 'no-store',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al obtener la planificación');
      }

      const data: Planning = await response.json();
      setPlanning(data);
      if (data.plan && data.plan[semanaActual - 1]) {
        setPlanSemanal(data.plan[semanaActual - 1].days);
      } else {
        setPlanSemanal(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanning();
  }, [id, semanaActual]);

  useEffect(() => {
    if (planning && planning.plan && planning.plan[semanaActual - 1]) {
      setPlanSemanal(planning.plan[semanaActual - 1].days);
    } else {
      setPlanSemanal(null);
    }
  }, [semanaActual, planning]);

  useEffect(() => {
    const handleViewChange = (event: CustomEvent) => {
      const { view } = event.detail;
      setVistaActual(view);
    };

    window.addEventListener('changeView', handleViewChange as EventListener);

    return () => {
      window.removeEventListener('changeView', handleViewChange as EventListener);
    };
  }, []);

  const handleAddWeek = async () => {
    if (!planning) return;

    try {
      const newWeek = await planningService.addWeekToPlan(planning._id);
      
      // Actualizar el estado local con la nueva semana
      setPlanning(prev => {
        if (!prev) return null;
        return {
          ...prev,
          plan: [...prev.plan, newWeek]
        };
      });

      // Cambiar a la nueva semana
      setSemanaActual(newWeek.weekNumber);
    } catch (error) {
      console.error('Error al añadir nueva semana:', error);
    }
  };

  const savePlanning = async (updatedPlanning: Planning) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${updatedPlanning._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPlanning),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al guardar la planificación');
      }

      const updatedPlanning: Planning = await response.json();
      setPlanning(updatedPlanning);
    } catch (error) {
      console.error('Error al guardar el planning:', error);
    }
  };

  const updatePlan = (updatedDays: { [key: string]: DayPlan }) => {
    if (planning && planning.plan) {
      const updatedPlanning = { ...planning };
      if (!updatedPlanning.plan[semanaActual - 1]) {
        updatedPlanning.plan[semanaActual - 1] = {
          weekNumber: semanaActual,
          days: {}
        };
      }
      
      updatedPlanning.plan[semanaActual - 1].days = updatedDays;
      updatedPlanning.updatedAt = new Date().toISOString();

      setPlanning(updatedPlanning);
      setPlanSemanal(updatedDays);
      setLastUpdate(Date.now()); // Add this line to trigger re-renders
      
      // Guardar en el backend
      savePlanning(updatedPlanning);
    } else {
      console.error('Error al actualizar plan:', {
        hasPlanning: !!planning,
        hasPlanArray: !!(planning?.plan),
        currentWeek: semanaActual
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!planning) return;
  
    try {
      // Obtener el token JWT
      const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado correctamente
  
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
  
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planning._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluir el token en los headers
        },
        body: JSON.stringify(planning),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Data:', errorData);
        throw new Error(errorData.mensaje || 'Error al actualizar la planificación');
      }
  
      const updatedPlanning: Planning = await response.json();
      setPlanning(updatedPlanning);
      alert('Planificación actualizada exitosamente.');
    } catch (err: any) {
      console.error('Error al actualizar la planificación:', err);
      alert(`Error: ${err.message}`);
    }
  };
  const handleVistaChange = (newVista: typeof vistaActual) => {
    // If switching between simplificada and compleja, refresh data
    if ((vistaActual === 'simplificada' && newVista === 'compleja') || 
        (vistaActual === 'compleja' && newVista === 'simplificada')) {
      fetchPlanning(true);
    }
    setVistaActual(newVista);
  };
  const renderVistaActual = () => {
    if (!planSemanal) return null;

    const props = {
      semanaActual,
      planSemanal,
      updatePlan,
    };

    switch (vistaActual) {
      case 'simplificada':
        return <VistaSimplificada {...props} planningId={id} />;
      case 'compleja':
        return (
          <VistaCompleja
          semanaActual={semanaActual}
          planSemanal={planSemanal}
          updatePlan={updatePlan}
          onReload={fetchPlanning}
          planningId={id || ''}
          weekId={planning?.plan?.[semanaActual - 1]?._id} // Pass the actual week ID from the planning data
        />
        );
      case 'excel':
        return <VistaExcel 
          {...props} 
          planningId={id} 
          semanaActual={semanaActual}
        />; // Added semanaActual prop here
          return <VistaResumen {...props} />;
        case 'progreso':
          return <VistaProgreso 
            planSemanal={planSemanal} 
            clientId={planning?.clientId} 
            planningId={planning?._id}
          />;
        case 'estadisticas':
                  return (
          <VistaEstadisticas
            planningId={planning?._id}
            numberOfWeeks={planning?.semanas || 4}
            plan={planning?.plan || []}
            existingPeriods={planning?.periodos || []}
            onPeriodsChange={(newPeriods) => {
              if (planning) {
                const updatedPlanning = {
                  ...planning,
                  periodos: newPeriods
                };
                setPlanning(updatedPlanning);
                // Aquí puedes agregar la lógica para guardar en la base de datos
              }
            }}
            planning={planning} // Añadimos la planificación completa
          />
        );
      case 'ejercicios':
        return <VistaEjerciciosDetallados planSemanal={planSemanal} semanaActual={semanaActual} />;
      case 'notas':
        return <VistaNotas planningId={id} />;
      case 'rutinas':
        return <VistaRutinasPredefinidas 
          {...props} 
          planning={planning} 
          planningId={id || ''} 
          onReload={fetchPlanning}
        />;
      case 'configuracion':
        return (
          <VistaConfiguracion planning={planning} setPlanning={setPlanning} />
        );
      default:
        return null;
    }
  };

  const buttonSections = [
    {
      title: 'Vistas Principales',
      icon: Layout,
      buttons: [
        { icon: List, label: 'Simplificada', value: 'simplificada' },
        { icon: Grid, label: 'Compleja', value: 'compleja' },
        { icon: Table, label: 'Excel', value: 'excel' },
      ],
    },
    {
      title: 'Análisis y Seguimiento',
      icon: LineChart,
      buttons: [
        { icon: Dumbbell, label: 'Ejercicios', value: 'ejercicios' },
        { icon: Library, label: 'Rutinas', value: 'rutinas' },

        { icon: BarChart2, label: 'Formulas', value: 'estadisticas' },
      ],
    },
    {
      title: 'Gestión y Recursos',
      icon: ClipboardList,
      buttons: [
        { icon: TrendingUp, label: 'RMS', value: 'progreso' },
        { icon: FileText, label: 'Notas', value: 'notas' },
        { icon: PieChart, label: 'Resumen', value: 'resumen' },

      ],
    },
  ];

  if (loading) {
    return (
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-center items-center h-full">
          <p>Cargando planificación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`transition-all duration-300 ${isCommandAssisterOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="py-8 relative">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="danger"
              className="!bg-red-600 hover:!bg-red-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-4">
            <Button
                variant="normal"
                onClick={() => setShowConfig(true)}
                className="flex items-center transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg font-semibold"
              >
                <Settings className="w-5 h-5 mr-2" />
                Configuración
              </Button>             
            </div>
          </div>
          <PopupConfiguracionPlanning
            planning={planning}
            setPlanning={setPlanning}
            onClose={() => setShowConfig(false)}
            isOpen={showConfig}
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-10"
          >
            {planning && (
              <>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {planning.nombre}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  {planning.descripcion}
                </p>
              </>
            )}
          </motion.div>

          {planning && planSemanal && (
            <>
              

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-12"
              >
                <div id="week-navigation">
                  <EditPlanningPageCalendario
                    weeks={planning.plan || []}
                    semanaActual={semanaActual}
                    setSemanaActual={setSemanaActual}
                    onAddWeek={handleAddWeek}
                    planningId={planning._id}
                  />
                </div>
              </motion.div>

              {/* Nuevo grid de vistas - 3 secciones en fila */}
              <div id="vista-selector" className="mb-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {buttonSections.map((section, idx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-6 rounded-xl ${
            idx === 0 
              ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-200/50'
              : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          } shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <section.icon className={`w-5 h-5 ${idx === 0 ? 'text-blue-600' : 'text-blue-500'}`} />
            <h3 className={`text-lg font-semibold ${idx === 0 ? 'text-blue-700 dark:text-blue-300' : ''}`}>
              {section.title}
            </h3>
          </div>
          <div className="space-y-3">
            {section.buttons.map(({ icon: Icon, label, value }) => (
                          <Button
                            key={value}
                            variant={idx === 0 ? 'mainView' : vistaActual === value ? 'create' : 'vistas'}
                            onClick={() => handleVistaChange(value as typeof vistaActual)}                            className={`w-full justify-start transform transition-all duration-300 ${
                              idx === 0 
                                ? `hover:scale-105 py-3 ${
                                    vistaActual === value
                                      ? 'bg-gradient-to-r from-violet-600 to-purple-600'
                                      : 'hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-500'
                                  }`
                                : `hover:scale-102 ${
                                    vistaActual === value
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                      : ''
                                  }`
                            }`}
                          >
                            <Icon className={`w-5 h-5 mr-3 ${
                              idx === 0 && !vistaActual.includes(value)
                                ? 'text-violet-200'
                                : ''
                            }`} />
                            <span className={`font-medium ${idx === 0 ? 'text-lg' : ''}`}>
                              {label}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div id="content-area" className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={vistaActual}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderVistaActual()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPlanningPage;