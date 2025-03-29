import React, { useState, useEffect } from 'react';
import { Link, Filter, Calendar, Users, BookOpen, ArrowUpDown } from 'lucide-react';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Importar tipos
import { ServiceType, Servicio, PlanDePago, FilterOptions } from './types';

// Importar componentes
import SearchBar from './components/SearchBar';
import ServiceTypeButtons from './components/ServiceTypeButtons';
import FilterDropdown from './components/FilterDropdown';
import ServiceCard from './components/ServiceCard';

const ClientesServicioWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ServiceType>('all');
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [planesDePago, setPlanesDePago] = useState<{ [key: string]: PlanDePago }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    tipo: 'todos',
    cantidadPlanes: 'todos',
    cantidadClientes: 'todos',
    fechaCreacion: 'todos',
    ordenarPor: 'nombre'
  });

  const { theme } = useTheme();

  const buttonClass = (isSelected: boolean) => `
  w-full text-left px-4 py-3 text-sm transition-all duration-200
  flex items-center gap-2 rounded-lg
  ${isSelected 
    ? theme === 'dark'
      ? 'bg-violet-900/30 text-violet-300 border border-violet-700'
      : 'bg-violet-50 text-violet-700 border border-violet-200'
    : theme === 'dark'
      ? 'text-gray-300 hover:bg-gray-800'
      : 'text-gray-600 hover:bg-gray-50'
  }
`;

const sectionClass = `
  p-4 space-y-2 border-b 
  ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
  last:border-b-0
`;

const titleClass = `
  flex items-center gap-2 px-2 py-2 text-sm font-medium
  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
`;
const toggleServiceExpansion = (servicioId: string) => {
  setExpandedServices(prevExpanded => {
    const newExpanded = new Set(prevExpanded);
    if (newExpanded.has(servicioId)) {
      newExpanded.delete(servicioId);
    } else {
      newExpanded.add(servicioId);
    }
    return newExpanded;
  });
};

  const fetchPlanDePago = async (planId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/paymentplans/${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      console.error(`Error fetching plan de pago ${planId}:`, err);
      return null;
    }
  };

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token utilizado para autenticación:', token);
      
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const serviciosData = response.data;
      console.log('Servicios recibidos:', serviciosData);

      if (!Array.isArray(serviciosData)) {
        console.error('serviciosData no es un array:', serviciosData);
        throw new Error('Formato de datos inválido');
      }

      setServicios(serviciosData);

      // Crear un mapa de planes de pago directamente desde los datos recibidos
      const planesMap: { [key: string]: PlanDePago } = {};
      serviciosData.forEach(servicio => {
        if (servicio.planesDePago && Array.isArray(servicio.planesDePago)) {
          servicio.planesDePago.forEach(plan => {
            if (plan && plan._id) {
              planesMap[plan._id] = plan;
            }
          });
        }
      });

      console.log('Planes de pago obtenidos:', planesMap);
      setPlanesDePago(planesMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching servicios:', err);
      setError('Error al cargar los servicios');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  // Agregar este useEffect para depuración
  useEffect(() => {
    if (servicios.length > 0) {
      console.log('Tipos de servicios disponibles:', servicios.map(s => s.tipo));
    }
  }, [servicios]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (opcion: string, valor: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [opcion]: valor
    }));
  };

  const filteredServices = servicios
    .filter((s) => {
      // Añadir log para depuración
      if (selectedType !== 'all') {
        console.log(`Comparando: selectedType=${selectedType}, servicio.tipo=${s.tipo}`);
      }
      
      // Mejorar la comparación para manejar diferentes casos
      if (selectedType !== 'all') {
        const tipoServicio = s.tipo?.trim().toLowerCase() || '';
        const tipoSeleccionado = selectedType.trim().toLowerCase();
        
        // Mapeo de tipos para manejar posibles variaciones
        const tiposEquivalentes: Record<string, string[]> = {
          'citas': ['cita', 'citas', 'pack de citas'],
          'suscripciones': ['suscripcion', 'suscripción', 'suscripciones'],
          'asesorias': ['asesoria', 'asesoría', 'asesorias', 'asesorías', 'asesoría individual'],
          'clases-grupales': ['clase', 'clases', 'clase grupal', 'clases grupales'],
          'productos': ['producto', 'productos']
        };
        
        // Verificar si el tipo del servicio coincide con alguna variante del tipo seleccionado
        const variantesSeleccionadas = tiposEquivalentes[tipoSeleccionado] || [];
        
        // Si no encontramos variantes para el tipo seleccionado, intentamos buscar en todas las claves
        if (variantesSeleccionadas.length === 0) {
          for (const [tipo, variantes] of Object.entries(tiposEquivalentes)) {
            if (tipo.includes(tipoSeleccionado) || tipoSeleccionado.includes(tipo)) {
              // Si encontramos coincidencia en la clave, verificamos si el servicio coincide con alguna variante
              const coincide = variantes.some(v => tipoServicio.includes(v));
              if (coincide) return true;
            }
          }
          return false;
        }
        
        // Verificar si el tipo de servicio coincide con alguna de las variantes del tipo seleccionado
        const coincide = variantesSeleccionadas.some(v => tipoServicio.includes(v));
        return coincide;
      }

      // Si no hay tipo seleccionado (all), continuar con el resto de filtros
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const hasMatchInService = s.nombre?.toLowerCase().includes(searchLower) ||
          s.descripcion?.toLowerCase().includes(searchLower);

        const hasMatchInPlanes = (Array.isArray(s.planesDePago) ? s.planesDePago : [])
          .some(plan => {
            if (!plan) return false;
            return plan.nombre?.toLowerCase().includes(searchLower) ||
              plan.detalles?.toLowerCase().includes(searchLower);
          });

        const hasMatchInClientes = s.clientes?.some(cliente =>
          cliente.nombre?.toLowerCase().includes(searchLower) ||
          cliente.email?.toLowerCase().includes(searchLower) ||
          cliente.telefono?.includes(searchTerm)
        );

        if (!hasMatchInService && !hasMatchInPlanes && !hasMatchInClientes) {
          return false;
        }
      }

      const cantidadPlanes = Array.isArray(s.planesDePago) ? s.planesDePago.length : 0;
      if (filterOptions.cantidadPlanes !== 'todos') {
        switch (filterOptions.cantidadPlanes) {
          case 'sin_planes':
            if (cantidadPlanes !== 0) return false;
            break;
          case 'un_plan':
            if (cantidadPlanes !== 1) return false;
            break;
          case 'multiple_planes':
            if (cantidadPlanes <= 1) return false;
            break;
        }
      }

      const cantidadClientes = s.clientes?.length || 0;
      if (filterOptions.cantidadClientes !== 'todos') {
        switch (filterOptions.cantidadClientes) {
          case 'sin_clientes':
            if (cantidadClientes !== 0) return false;
            break;
          case 'pocos':
            if (cantidadClientes <= 0 || cantidadClientes > 5) return false;
            break;
          case 'muchos':
            if (cantidadClientes <= 5) return false;
            break;
        }
      }

      const fechaCreacion = new Date(s.fechaCreacion);
      const hoy = new Date();
      const unDia = 24 * 60 * 60 * 1000;
      const unaSemana = 7 * unDia;
      const unMes = 30 * unDia;

      if (filterOptions.fechaCreacion !== 'todos') {
        switch (filterOptions.fechaCreacion) {
          case 'hoy':
            if ((hoy.getTime() - fechaCreacion.getTime()) > unDia) return false;
            break;
          case 'semana':
            if ((hoy.getTime() - fechaCreacion.getTime()) > unaSemana) return false;
            break;
          case 'mes':
            if ((hoy.getTime() - fechaCreacion.getTime()) > unMes) return false;
            break;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filterOptions.ordenarPor) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'clientes':
          return (b.clientes?.length || 0) - (a.clientes?.length || 0);
        case 'planes':
          // Update to use planesDePago instead of planDePago
          const planesA = Array.isArray(a.planesDePago) ? a.planesDePago.length : 0;
          const planesB = Array.isArray(b.planesDePago) ? b.planesDePago.length : 0;
          return planesB - planesA;
        case 'fecha':
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} rounded-3xl shadow-2xl`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className={`text-3xl font-bold mb-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400'
              : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600'
          } bg-clip-text text-transparent`}>
            Gestión de Planes y Clientes
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Administra tus planes y clientes de manera eficiente
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`${
            theme === 'dark'
              ? 'bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900'
              : 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500'
          } p-4 rounded-2xl shadow-lg`}
        >
          <Link className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
               <motion.div  className="relative">
            <Button variant="filter" onClick={toggleFilterDropdown}>
              <Filter className="w-5 h-5" />
            </Button>
            <AnimatePresence>
              {isFilterOpen && (
                <div className="fixed" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 9999 }}>
                  <motion.div
                    
                    style={{ zIndex: 9999 }}
                    className={`
                      absolute right-0 mt-2 w-72 overflow-hidden
                      ${theme === 'dark' 
                        ? 'bg-gray-900 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                      }
                      rounded-2xl shadow-xl backdrop-blur-sm
                      ${theme === 'dark' ? 'shadow-black/20' : 'shadow-gray-200/80'}
                    `}
                  >
                    {/* Cantidad de Planes */}
                    <div className={sectionClass}>
                      <div className={titleClass}>
                        <BookOpen className="w-4 h-4" />
                        <span>Cantidad de Planes</span>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleFilterChange('cantidadPlanes', 'todos')}
                          className={buttonClass(filterOptions.cantidadPlanes === 'todos')}
                        >
                          Todos los planes
                        </button>
                        <button
                          onClick={() => handleFilterChange('cantidadPlanes', 'sin_planes')}
                          className={buttonClass(filterOptions.cantidadPlanes === 'sin_planes')}
                        >
                          Sin planes
                        </button>
                        <button
                          onClick={() => handleFilterChange('cantidadPlanes', 'un_plan')}
                          className={buttonClass(filterOptions.cantidadPlanes === 'un_plan')}
                        >
                          Un plan
                        </button>
                        <button
                          onClick={() => handleFilterChange('cantidadPlanes', 'multiple_planes')}
                          className={buttonClass(filterOptions.cantidadPlanes === 'multiple_planes')}
                        >
                          Múltiples planes
                        </button>
                      </div>
                    </div>

                    {/* Cantidad de Clientes */}
                    <div className={sectionClass}>
                      <div className={titleClass}>
                        <Users className="w-4 h-4" />
                        <span>Cantidad de Clientes</span>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleFilterChange('cantidadClientes', 'todos')}
                          className={buttonClass(filterOptions.cantidadClientes === 'todos')}
                        >
                          Todos los clientes
                        </button>
                        <button
                          onClick={() => handleFilterChange('cantidadClientes', 'sin_clientes')}
                          className={buttonClass(filterOptions.cantidadClientes === 'sin_clientes')}
                        >
                          Sin clientes
                        </button>
                        <button
                          onClick={() => handleFilterChange('cantidadClientes', 'pocos')}
                          className={buttonClass(filterOptions.cantidadClientes === 'pocos')}
                        >
                          1-5 clientes
                        </button>
                        <button
                          onClick={() => handleFilterChange('cantidadClientes', 'muchos')}
                          className={buttonClass(filterOptions.cantidadClientes === 'muchos')}
                        >
                          Más de 5 clientes
                        </button>
                      </div>
                    </div>

                    {/* Fecha de Creación */}
                    <div className={sectionClass}>
                      <div className={titleClass}>
                        <Calendar className="w-4 h-4" />
                        <span>Fecha de Creación</span>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleFilterChange('fechaCreacion', 'todos')}
                          className={buttonClass(filterOptions.fechaCreacion === 'todos')}
                        >
                          Todas las fechas
                        </button>
                        <button
                          onClick={() => handleFilterChange('fechaCreacion', 'hoy')}
                          className={buttonClass(filterOptions.fechaCreacion === 'hoy')}
                        >
                          Hoy
                        </button>
                        <button
                          onClick={() => handleFilterChange('fechaCreacion', 'semana')}
                          className={buttonClass(filterOptions.fechaCreacion === 'semana')}
                        >
                          Última semana
                        </button>
                        <button
                          onClick={() => handleFilterChange('fechaCreacion', 'mes')}
                          className={buttonClass(filterOptions.fechaCreacion === 'mes')}
                        >
                          Último mes
                        </button>
                      </div>
                    </div>

                    {/* Ordenar por */}
                    <div className={sectionClass}>
                      <div className={titleClass}>
                        <ArrowUpDown className="w-4 h-4" />
                        <span>Ordenar por</span>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleFilterChange('ordenarPor', 'nombre')}
                          className={buttonClass(filterOptions.ordenarPor === 'nombre')}
                        >
                          Nombre
                        </button>
                        <button
                          onClick={() => handleFilterChange('ordenarPor', 'clientes')}
                          className={buttonClass(filterOptions.ordenarPor === 'clientes')}
                        >
                          Cantidad de clientes
                        </button>
                        <button
                          onClick={() => handleFilterChange('ordenarPor', 'planes')}
                          className={buttonClass(filterOptions.ordenarPor === 'planes')}
                        >
                          Cantidad de planes
                        </button>
                        <button
                          onClick={() => handleFilterChange('ordenarPor', 'fecha')}
                          className={buttonClass(filterOptions.ordenarPor === 'fecha')}
                        >
                          Fecha de creación
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
                            </div>

        <ServiceTypeButtons
          selectedType={selectedType}
          onSelect={setSelectedType}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </div>

      <div className="space-y-10">
        {loading ? (
          <div className="text-center py-4">Cargando servicios...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          filteredServices.map((servicio) => (
            <motion.div
            key={`servicio-${servicio._id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-2xl border ${
              theme === 'dark' 
                ? 'border-gray-700 bg-gradient-to-br from-gray-800/80 via-gray-800/50 to-gray-800/30' 
                : 'border-gray-200 bg-gradient-to-br from-white/80 via-white/50 to-white/30'
            } shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
          >
              <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
              <h4 className={`font-bold text-xl ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-violet-400 to-fuchsia-400'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
                  } bg-clip-text text-transparent`}>
                    {servicio.nombre}
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' 
                      ? 'bg-violet-900/30 text-violet-300 border border-violet-700'
                      : 'bg-violet-100 text-violet-800 border border-violet-200'
                  } flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${
                      theme === 'dark' ? 'bg-violet-400' : 'bg-violet-500'
                    }`}></span>
                    {servicio.tipo}
                  </div>
                </div>

                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                } leading-relaxed`}>
                  {servicio.descripcion}
                </p>

                <div className={`mt-4 pt-4 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                  <h5 className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Planes de Pago Disponibles
                      {!expandedServices.has(servicio._id) && servicio.planesDePago && Array.isArray(servicio.planesDePago) && servicio.planesDePago.length > 0 && (
                        <span className="ml-2">
                          ({servicio.planesDePago.length})
                        </span>
                      )}
                    </h5>
                    <button 
                      onClick={() => toggleServiceExpansion(servicio._id)}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      {expandedServices.has(servicio._id) ? 'Ocultar planes' : 'Mostrar planes'}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedServices.has(servicio._id) && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-4 overflow-hidden"
                      >
                        {servicio.planesDePago && Array.isArray(servicio.planesDePago) && servicio.planesDePago.length > 0 ? (
                          servicio.planesDePago.map((plan) => (
                            <ServiceCard
                              key={`plan-${plan._id}`}
                              planDePago={plan}
                              expandedPlan={expandedPlan}
                              onToggleExpand={setExpandedPlan}
                              theme={theme === 'dark' ? 'dark' : 'light'}
                            />
                          ))
                        ) : (
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            No hay planes de pago disponibles
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!expandedServices.has(servicio._id) && servicio.planesDePago && Array.isArray(servicio.planesDePago) && servicio.planesDePago.length > 0 && (
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {servicio.planesDePago.length} {servicio.planesDePago.length === 1 ? 'plan disponible' : 'planes disponibles'}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
                      ))
        )}
      </div>
    </div>
  );
};

export default ClientesServicioWidget;
