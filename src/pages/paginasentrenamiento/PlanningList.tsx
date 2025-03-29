// src/components/PlanningList.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Upload,
  Edit,
  Plus,
  Filter,
  Download,
  Calendar,
  FileText,
  Users,
  Clock,
  Target,
  Trash2,
  Check,
  Eye,
} from 'lucide-react';
import Button from '../../components/Common/Button';
import TableWithActions from '../../components/Common/TableWithActions';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { usePlanificacionModal } from '../../contexts/PlanificacionModalContext';
import { usePlanning } from '../../contexts/PlanningContext'; // Import the planning context
import ArchivosplanificacionesComponent from '../../components/Routines/ArchivosplanificacionesComponent';
import PlanningDetailsPopup from '../../components/Routines/PlanningDetailsPopup';

// Importa otros componentes si es necesario

interface PlanningSchema {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta: string;
  semanas: number;
  tipo: 'Planificacion' | 'Plantilla';
  esqueleto?: string;
  cliente: {
    _id: string;
    nombre: string;
    email: string;
  };
  trainer: {
    _id: string;
    nombre: string;
    email: string;
  };
  plan: any[];
  createdAt: string;
  updatedAt: string;
}

interface EsqueletoDetails {
  _id: string;
  nombre: string;
  descripcion: string;
  semanas: number;
  plan: any[];
}

const PlanningList: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { openModal } = usePlanificacionModal();
  const { plannings, loading, error, fetchPlannings, deletePlanning } = usePlanning(); // Using context values
  
  // Add the missing planningData state declaration
  const [planningData, setPlanningData] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlannings, setSelectedPlannings] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isEsqueletoModalOpen, setIsEsqueletoModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [activeFilters, setActiveFilters] = useState({
    tipo: 'todos',
    estado: 'todos',
    meta: 'todos',
    duracion: 'todos'
  });

  // Remove the planningData state since we're using the context now
  const [esqueletoDetails, setEsqueletoDetails] = useState<{ [key: string]: EsqueletoDetails }>({});
  // Remove these duplicate declarations since they're coming from the context
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // Datos estáticos para estadísticas (puedes actualizar estos valores dinámicamente si lo deseas)
  const [statsCards, setStatsCards] = useState([
    {
      icon: Target,
      title: 'Planificaciones Activas',
      value: '',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'Clientes Asignados',
      value: '',
      color: 'bg-purple-500',
    },
    {
      icon: Calendar,
      title: 'Semanas Totales',
      value: '',
      color: 'bg-green-500',
    },
    {
      icon: Check,
      title: 'Completadas',
      value: '',
      color: 'bg-yellow-500',
    },
  ]);

  // Función para renderizar las celdas de la tabla
  const renderCell = (key: string, value: any, item: any) => {
    switch (key) {
      case 'tipo':
        return (
          <span className={`px-2 py-1 rounded-full text-sm ${
            value === 'Planificacion' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {value}
          </span>
        );
      case 'estado':
        return (
          <span className={`px-2 py-1 rounded-full text-sm ${
            value === 'Completado'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : value === 'En progreso'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {value}
          </span>
        );
      case 'completado':
        return (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: value }}
            ></div>
          </div>
        );
      default:
        return value;
    }
  };

  // Función para manejar la navegación a plantillas
  const handlePlantillaNavigation = (item: PlanningSchema) => {
    console.log('Navegando a:', item.tipo, item._id); // Añadir log para debugging
    if (item.tipo === 'Plantilla') {
      console.log('Es una plantilla, redirigiendo a /plantilla/');
      navigate(`/plantilla/${item._id}`, {
        state: {
          plantillaData: item
        }
      });
    } else {
      console.log('No es una plantilla, redirigiendo a /edit-planning/');
      navigate(`/edit-planning/${item._id}`);
    }
  };

  // Función para obtener las planificaciones
  const loadPlannings = async () => {
    console.log('Fetching plannings...');
    // Use the context's loading and error states if available
    try {
      // Obtener el token JWT
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Separar las peticiones para mejor visibilidad
      console.log('Fetching planning schemas...');
      const planningsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/schemas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!planningsResponse.ok) {
        const errorData = await planningsResponse.json();
        throw new Error(errorData.mensaje || 'Error al obtener las planificaciones');
      }

      const planningsData = await planningsResponse.json();
      console.log('Planning schemas received:', planningsData);
      console.log('Planning schemas structure:', Array.isArray(planningsData) ? 'Array' : typeof planningsData);
      if (Array.isArray(planningsData) && planningsData.length > 0) {
        console.log('Sample planning schema:', planningsData[0]);
      }

      // Ahora hacer la petición de plantillas por separado
      console.log('Fetching templates...');
      const templatesResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!templatesResponse.ok) {
        const errorData = await templatesResponse.json();
        throw new Error(errorData.mensaje || 'Error al obtener las plantillas');
      }

      const templatesData = await templatesResponse.json();
      console.log('Templates received:', templatesData);
      console.log('Templates structure:', Array.isArray(templatesData) ? 'Array' : typeof templatesData);
      if (Array.isArray(templatesData) && templatesData.length > 0) {
        console.log('Sample template:', templatesData[0]);
      }

      console.log('Raw Planning Data:', Array.isArray(planningsData) ? planningsData.map((p: any) => ({ id: p._id, semanas: p.semanas })) : []);
      console.log('Plannings Data:', planningsData);

      // Ensure planningsData and templatesData are arrays
      const planningsArray = Array.isArray(planningsData) ? planningsData : [];
      const templatesArray = Array.isArray(templatesData) ? templatesData : [];

      // Procesar datos de planificaciones
      const processedPlannings = planningsArray.map((planning: any) => {
        // Normalizar la meta para que coincida con nuestros filtros
        const normalizeMeta = (meta: string) => {
          if (!meta) return 'No especificada';
          const metaLower = meta.toLowerCase();
          if (metaLower.includes('fuerza')) return 'Fuerza';
          if (metaLower.includes('peso') || metaLower.includes('adelgazar')) return 'Pérdida de Peso';
          return meta;
        };

        // Asegurarse de que semanas sea un número
        const semanas = typeof planning.semanas === 'number' ? planning.semanas : 
                       typeof planning.semanas === 'string' ? parseInt(planning.semanas) : 0;

        return {
          _id: planning._id,
          nombre: planning.nombre,
          descripcion: planning.descripcion,
          duracion: '',
          fechaInicio: new Date(planning.fechaInicio).toLocaleDateString(),
          meta: normalizeMeta(planning.meta),
          tipo: planning.tipo || 'Planificacion',
          esqueleto: planning.esqueleto,
          clientesAsociados: '',
          estado: 'En progreso',
          completado: '',
          acciones: '',
          semanas: ''
        };
      });

      // Procesar datos de plantillas
      const processedTemplates = templatesArray.map((template: any) => {
        // Usar la misma función de normalización para las plantillas
        const normalizeMeta = (meta: string) => {
          if (!meta) return 'No especificada';
          const metaLower = meta.toLowerCase();
          if (metaLower.includes('fuerza')) return 'Fuerza';
          if (metaLower.includes('peso') || metaLower.includes('adelgazar')) return 'Pérdida de Peso';
          return meta;
        };

        return {
          _id: template._id,
          nombre: template.nombre,
          descripcion: template.descripcion,
          duracion: '',
          fechaInicio: new Date(template.createdAt).toLocaleDateString(),
          meta: normalizeMeta(template.meta),
          tipo: 'Plantilla',
          esqueleto: template.esqueleto,
          clientesAsociados: '',
          estado: 'En progreso',
          completado: '',
          acciones: '',
          semanas: ''
        };
      });

      // Combinar ambos conjuntos de datos
      setPlanningData([...processedPlannings, ...processedTemplates]);
    } catch (err: any) {
      console.error('Error al obtener las planificaciones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Remove the duplicate deletePlanning function and rename it
  // Mock API para eliminar planificación (renamed to avoid conflict)
  const handleDeletePlanningRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Simular llamada a API
      const response = await fetch(`https://api.ejemplo.com/plannings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la planificación');
      }

      // Actualizar la lista después de eliminar
      fetchPlannings();
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar la planificación');
    }
  };

  useEffect(() => {
    console.log('Current plannings from context:', plannings);
    const fetchEsqueletosForPlannings = async () => {
      const esqueletoIds = plannings
        .map(planning => planning.esqueleto)
        .filter((id): id is string => typeof id === 'string');

      console.log('Filtered esqueleto IDs:', esqueletoIds);
      const uniqueEsqueletoIds = [...new Set(esqueletoIds)];
      console.log('Unique esqueleto IDs:', uniqueEsqueletoIds);

      // Remove the call to fetchEsqueletoDetails since we're removing that function
    };

    fetchEsqueletosForPlannings();
  }, [plannings]);

  const handleCrearEsqueleto = async (updatedPlanning: any) => {
    console.log('Creating esqueleto for planning:', updatedPlanning);
    try {
      // Actualizar la lista de planificaciones con el esqueleto asignado
      setPlanningData(prevData => 
        prevData.map(item => 
          item._id === updatedPlanning._id 
            ? { ...item, esqueleto: updatedPlanning.esqueleto }
            : item
        )
      );
      setIsEsqueletoModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar la planificación:', error);
    }
  };

  const handleExportClick = () => {
    setSelectMode(true);
  };

  const handleCheckboxChange = (planningId: string) => {
    setSelectedPlannings(prev => {
      if (prev.includes(planningId)) {
        return prev.filter(id => id !== planningId);
      } else {
        return [...prev, planningId];
      }
    });
  };

  const handleExportSelected = () => {
    // Aquí implementar la lógica de exportación
    console.log('Planificaciones seleccionadas:', selectedPlannings);
    setSelectMode(false);
    setSelectedPlannings([]);
  };

  // useEffect para obtener las planificaciones al montar el componente
  useEffect(() => {
    fetchPlannings();
  }, []);
  const updateStats = (planningData: PlanningSchema[]) => {
    const activePlannings = planningData.filter(item => item.tipo === 'Planificacion').length;
    const totalClients = new Set(planningData.map(item => item.cliente?._id).filter(Boolean)).size;
    const totalWeeks = planningData.reduce((acc, item) => acc + (item.semanas || 0), 0);
    const completedPlannings = planningData.filter(item => item.estado === 'Completado').length;

    setStatsCards(prev => prev.map((card, index) => {
      switch (index) {
        case 0:
          return { ...card, value: activePlannings.toString() };
        case 1:
          return { ...card, value: totalClients.toString() };
        case 2:
          return { ...card, value: totalWeeks.toString() };
        case 3:
          return { ...card, value: completedPlannings.toString() };
        default:
          return card;
      }
    }));
  };

  // Add this effect to sync context plannings with local planningData
  useEffect(() => {
    if (plannings && plannings.length > 0) {
      console.log('Syncing plannings from context to local state:', plannings);
      // Process plannings from context to match the format expected by the component
      const processedPlannings = plannings.map(planning => {
        const normalizeMeta = (meta: string) => {
          if (!meta) return 'No especificada';
          const metaLower = meta.toLowerCase();
          if (metaLower.includes('fuerza')) return 'Fuerza';
          if (metaLower.includes('peso') || metaLower.includes('adelgazar')) return 'Pérdida de Peso';
          return meta;
        };
        

        return {
          _id: planning._id,
          nombre: planning.nombre,
          descripcion: planning.descripcion,
          duracion: '',
          fechaInicio: new Date(planning.fechaInicio).toLocaleDateString(),
          meta: normalizeMeta(planning.meta || 'No especificada'),
          tipo: planning.tipo || 'Planificacion',
          esqueleto: planning.esqueleto,
          clientesAsociados: planning.cliente ? planning.cliente.nombre : '',
          estado: 'En progreso',
          completado: '',
          acciones: '',
          semanas: planning.semanas,
          // Añadir el plan completo si está disponible
          plan: planning.plan || []
        };
      });
      
      // Log para depuración
      console.log('Processed plannings for UI:', processedPlannings);
      
      // Actualizar el estado local con los datos procesados
      setPlanningData(processedPlannings);
      
      // Actualizar estadísticas
      updateStats(plannings);
    }
  }, [plannings]);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedPlanningId, setSelectedPlanningId] = useState<string | null>(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

  const handleOpenFiles = (planningId: string) => {
    setSelectedPlanningId(planningId);
    setIsFilesModalOpen(true);
  };

  const [openRowId, setOpenRowId] = useState<string | null>(null);

  // Función para manejar la eliminación de una planificación
  const handleDeletePlanning = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta planificación?')) {
      return;
    }

    try {
      // Use the context's deletePlanning instead of the local function
      await deletePlanning(id);
    } catch (error) {
      console.error('Error al eliminar la planificación:', error);
    }
  };

  // Función para manejar la visualización de detalles
  const handleViewDetails = (id: string) => {
    setSelectedPlanningId(id);
    setIsDetailsPopupOpen(true);
  };

  // Función para cerrar el popup de detalles
  const handleCloseDetails = () => {
    setIsDetailsPopupOpen(false);
    setSelectedPlanningId(null);
  };

  // Función para manejar la descarga
  const handleDownload = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${id}/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al descargar la planificación');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planificacion-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar la planificación:', error);
    }
  };

  // Función para manejar el toggle de detalles
  const handleToggleDetails = (id: string) => {
    setOpenRowId(openRowId === id ? null : id);
  };

  // Definir los headers de la tabla
  const headers = [
    { header: 'Nombre', key: 'nombre' },
    { header: 'Descripción', key: 'descripcion' },
    { header: 'Duración', key: 'duracion' },
    { header: 'Fecha de Inicio', key: 'fechaInicio' },
    { header: 'Meta', key: 'meta' },
    { header: 'Tipo', key: 'tipo' },
    { header: 'Estado', key: 'estado' },
    { header: 'Progreso', key: 'progreso' },
    { header: 'Acciones', key: 'acciones' }
  ];

  // Función para procesar los datos antes de mostrarlos
  const processData = (data: PlanningSchema[]) => {
    return data.map(item => {
      // Calcular la duración en formato legible
      const getDuracionText = (semanas: number) => {
        if (semanas === 1) return '1 semana';
        return `${semanas} semanas`;
      };

      // Calcular el progreso (esto es un ejemplo, ajusta según tu lógica real)
      const calcularProgreso = () => {
        // Aquí deberías implementar la lógica real para calcular el progreso
        return '0%'; // Por ahora retornamos un valor estático
      };

      return {
        _id: item._id,
        nombre: item.nombre,
        descripcion: item.descripcion || 'Sin descripción',
        duracion: getDuracionText(item.semanas),
        fechaInicio: new Date(item.fechaInicio).toLocaleDateString(),
        meta: item.meta || 'No especificada',
        tipo: renderCell('tipo', item.tipo || 'Planificacion', item),
        estado: renderCell('estado', item.estado || 'En progreso', item),
        progreso: renderCell('completado', calcularProgreso(), item),
        acciones: (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlantillaNavigation(item);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-700/50 text-blue-400 hover:text-blue-300'
                  : 'hover:bg-blue-50 text-blue-600 hover:text-blue-500'
              }`}
              title="Editar"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(item._id);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-700/50 text-purple-400 hover:text-purple-300'
                  : 'hover:bg-purple-50 text-purple-600 hover:text-purple-500'
              }`}
              title="Ver detalles"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(item._id);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-700/50 text-green-400 hover:text-green-300'
                  : 'hover:bg-green-50 text-green-600 hover:text-green-500'
              }`}
              title="Descargar"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePlanning(item._id);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-700/50 text-red-400 hover:text-red-300'
                  : 'hover:bg-red-50 text-red-600 hover:text-red-500'
              }`}
              title="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )
      };
    });
  };

  const filterRef = useRef<HTMLDivElement>(null);

  // Effect to handle click outside of dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredPlannings = planningData
    .filter((item) => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm
        || item.nombre.toLowerCase().includes(searchString)
        || (item.descripcion || '').toLowerCase().includes(searchString)
        || (item.meta || '').toLowerCase().includes(searchString);

      // Normalizar los valores para la comparación
      const itemTipo = (item.tipo || 'Planificacion').toLowerCase();
      const filterTipo = activeFilters.tipo.toLowerCase();
      
      // Convertir la duración a un rango de semanas
      const getDuracionRange = (duracion: string) => {
        switch (duracion) {
          case 'corta': return { min: 1, max: 4 };
          case 'media': return { min: 5, max: 12 };
          case 'larga': return { min: 13, max: Infinity };
          default: return null;
        }
      };

      const duracionRange = getDuracionRange(activeFilters.duracion);
      const semanas = item.semanas || 0;

      const matchesTipo = activeFilters.tipo === 'todos' || itemTipo === filterTipo;
      const matchesEstado = activeFilters.estado === 'todos' || 
                           (item.estado || 'En progreso').toLowerCase() === activeFilters.estado.toLowerCase();
      const matchesMeta = activeFilters.meta === 'todos' || 
                         (item.meta || '').toLowerCase().includes(activeFilters.meta.toLowerCase());
      const matchesDuracion = activeFilters.duracion === 'todos' || 
                             (duracionRange && 
                              semanas >= duracionRange.min && 
                              semanas <= duracionRange.max);

      return matchesSearch && matchesTipo && matchesEstado && matchesMeta && matchesDuracion;
    });

  useEffect(() => {
    // Update this to use both plannings from context and local planningData
    const activePlannings = plannings.filter(item => item.tipo === 'Planificacion').length;
    const totalClients = new Set(plannings.map(item => item.cliente?._id).filter(Boolean)).size;
    const totalWeeks = plannings.reduce((acc, item) => acc + (item.semanas || 0), 0);
    const completedPlannings = plannings.filter(item => item.estado === 'Completado').length;

    setStatsCards(prev => prev.map((card, index) => {
      switch (index) {
        case 0:
          return { ...card, value: activePlannings.toString() };
        case 1:
          return { ...card, value: totalClients.toString() };
        case 2:
          return { ...card, value: totalWeeks.toString() };
        case 3:
          return { ...card, value: completedPlannings.toString() };
        default:
          return card;
      }
    }));
  }, [plannings]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 animate-fadeIn"
    >
      {/* Header and Stats Section */}
      <div className={`space-y-6 ${
        theme === 'dark'
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className={`p-3 rounded-2xl ${
              theme === 'dark'
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-blue-50 text-blue-600'
            }`}>
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h1 className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              } bg-clip-text text-transparent tracking-tight`}>
                Planificaciones
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gestiona y organiza las planificaciones de entrenamiento
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => openModal()}
              variant="create"
            >
              <Plus className="w-5 h-5" />
              Nueva Planificación
            </Button>
            <Button
              onClick={handleExportClick}
              variant="csv"
            >
              <Download className="w-5 h-5" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-gray-700/50 hover:bg-gray-700'
                  : 'bg-gray-50 hover:bg-gray-100'
              } transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.color} bg-opacity-20`}>
                  <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{card.title}</p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{card.value || '0'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar planificaciones..."
              className={`w-full px-4 py-3 pl-11 rounded-xl ${
                theme === 'dark'
                  ? 'bg-gray-700/50 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className={`absolute left-3 top-3.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <div className="relative" ref={filterRef}>
            <Button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              variant="filter"
            >
                <Filter className="w-5 h-5" />

              <span className="relative">
                Filtros 
                {Object.values(activeFilters).filter(f => f !== 'todos').length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-sm bg-white/20 rounded-full">
                    {Object.values(activeFilters).filter(f => f !== 'todos').length}
                  </span>
                )}
              </span>
            </Button>
            {isFilterDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute right-0 mt-2 w-72 p-4 rounded-2xl shadow-xl z-50 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border border-gray-600'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Tipo
                    </label>
                    <select
                      value={activeFilters.tipo}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, tipo: e.target.value }))}
                      className={`w-full p-2 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white border-gray-500'
                          : 'bg-gray-50 text-gray-900 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="todos">Todos</option>
                      <option value="planificacion">Planificación</option>
                      <option value="plantilla">Plantilla</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Estado
                    </label>
                    <select
                      value={activeFilters.estado}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, estado: e.target.value }))}
                      className={`w-full p-2 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white border-gray-500'
                          : 'bg-gray-50 text-gray-900 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="todos">Todos</option>
                      <option value="en progreso">En Progreso</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Meta
                    </label>
                    <select
                      value={activeFilters.meta}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, meta: e.target.value }))}
                      className={`w-full p-2 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white border-gray-500'
                          : 'bg-gray-50 text-gray-900 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="todos">Todas</option>
                      <option value="fuerza">Fuerza</option>
                      <option value="pérdida de peso">Pérdida de Peso</option>
                      <option value="resistencia">Resistencia</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Duración
                    </label>
                    <select
                      value={activeFilters.duracion}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, duracion: e.target.value }))}
                      className={`w-full p-2 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white border-gray-500'
                          : 'bg-gray-50 text-gray-900 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="todos">Todas</option>
                      <option value="corta">Corta (1-4 semanas)</option>
                      <option value="media">Media (5-12 semanas)</option>
                      <option value="larga">Larga (13+ semanas)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="text-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Calendar className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Cargando planificaciones...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <X className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <TableWithActions
            headers={headers}
            data={processData(filteredPlannings)}
            renderCell={renderCell}
            onRowClick={item => handleToggleDetails(item._id)}
            selectedRows={selectedPlannings}
            onRowSelect={handleCheckboxChange}
            showCheckboxes={selectMode}
          />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isFilesModalOpen && selectedPlanningId && (
          <ArchivosplanificacionesComponent
            planningId={selectedPlanningId}
            onClose={() => {
              setIsFilesModalOpen(false);
              setSelectedPlanningId(null);
            }}
          />
        )}

        {isDetailsPopupOpen && selectedPlanningId && (
          <PlanningDetailsPopup
            open={isDetailsPopupOpen}
            onClose={handleCloseDetails}
            planningId={selectedPlanningId}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlanningList;