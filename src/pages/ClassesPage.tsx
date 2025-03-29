// src/pages/ClassesPage.tsx (o donde sea que tengas la lista)

import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Filter, Download, Users, Calendar, Clock, Target, Edit, Trash } from 'lucide-react';
import Button from '../components/Common/Button';
import TableWithActions from '../components/Common/TableWithActions';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CrearClasePopup from '../components/Classes/CrearClasePopup';
import EditarClasePopup2 from '../components/modals/EditarClasePopup2';

interface Entrenador {
  _id: string;
  nombre: string;
  email: string;
  // otros campos
}

interface PlanDePago {
  _id: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  detalles: string;
  stripeProductId: string;
  stripePriceId: string;
  servicio: string;
  clientes: string[];
  fechaCreacion: string;
  __v: number;
}

interface ClaseGrupal {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  entrenador: Entrenador;
  clientes: any[];
  serviciosAdicionales: any[];
  sesiones: any[];
  fechaCreacion: string;
  __v: number;
  planDePago: PlanDePago[];
}

const ClassesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classData, setClassData] = useState<ClaseGrupal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    capacity: 'all',
    sessions: 'all',
    trainer: 'all'
  });

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ClaseGrupal[]>(
          'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/tipo/ClaseGrupal',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setClassData(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error al obtener las clases:', err);
        setError('No se pudieron cargar las clases. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isFilterOpen && !target.closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  const refreshClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ClaseGrupal[]>(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/tipo/ClaseGrupal',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setClassData(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error al actualizar las clases:', err);
      setError('No se pudieron actualizar las clases. Por favor, intenta de nuevo más tarde.');
      setLoading(false);
    }
  };

    // ... existing code ...
  
    const transformedClassData = classData.map((item) => ({
      id: item._id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      clientes: item.clientes?.length || 0,
      // Suponiendo que 'capacidad' viene en el objeto, si no, pon un valor por defecto
      maxParticipantes: (item as any).capacidad || 15,
      sesiones: item.sesiones && item.sesiones.length > 0 ? `${item.sesiones.length}/semana` : 'N/A',
      acciones: 'Editar'
    }));
    
    // ... existing code ...

  const filteredClassData = transformedClassData.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCapacity =
      filters.capacity === 'all'
        ? true
        : filters.capacity === 'available'
        ? item.clientes < item.maxParticipantes
        : item.clientes >= item.maxParticipantes;

    const matchesSessions =
      filters.sessions === 'all'
        ? true
        : filters.sessions === '1-2'
        ? parseInt(item.sesiones) <= 2
        : filters.sessions === '3-4'
        ? parseInt(item.sesiones) >= 3 && parseInt(item.sesiones) <= 4
        : parseInt(item.sesiones) >= 5;

    // Si implementas un filtro de entrenador, ajusta aquí
    const matchesTrainer = filters.trainer === 'all' ? true : true;

    return matchesSearch && matchesCapacity && matchesSessions && matchesTrainer;
  });

  const statsCards = [
    {
      icon: Users,
      title: 'Clases Activas',
      value: '156',
      color: 'bg-red-500'
    },
    {
      icon: Calendar,
      title: 'Clases Semanales',
      value: '24',
      color: 'bg-green-500'
    },
    {
      icon: Clock,
      title: 'Horas Impartidas',
      value: '96h',
      color: 'bg-yellow-500'
    },
    {
      icon: Target,
      title: 'Ocupación Media',
      value: '85%',
      color: 'bg-green-600'
    }
  ];

  const handleEdit = (id: string) => {
    // Find the class data for the selected ID
    const selectedClass = classData.find(item => item._id === id);
    setSelectedClassId(id);
    setIsEditModalOpen(true);
  };


  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar esta clase?'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      refreshClassData();
    } catch (err: any) {
      console.error('Error al eliminar la clase:', err);
      setError('No se pudo eliminar la clase. Por favor, intenta de nuevo más tarde.');
    }
  };

  const renderCell = (key: string, value: any, row: any) => {
    switch (key) {
      case 'clientes':
        return (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{value}</span>
          </div>
        );
      case 'capacidad':
        const porcentaje = (row.clientes / row.maxParticipantes) * 100;
        return (
          <div className="flex flex-col space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {row.clientes}/{row.maxParticipantes} participantes
            </div>
            <div className="w-48">
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          </div>
        );
      case 'sesiones':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="font-medium">{value}</span>
          </div>
        );
      case 'acciones':
        return (
          <div className="flex space-x-2">
            <button
              className={`${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-800'
              } transition-colors duration-150`}
              onClick={() => handleEdit(row.id)}
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              className={`${
                isDarkMode
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-red-600 hover:text-red-800'
              } transition-colors duration-150`}
              onClick={() => handleDelete(row.id)}
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        );
      default:
        return value;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        {/* Header Section */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
            isDarkMode
              ? 'bg-gray-800/90 border-gray-700/50'
              : 'bg-white/90 border-white/50'
          } backdrop-blur-xl p-6 rounded-none shadow-lg border-x-0 hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="relative">
              <h1
                className={`text-4xl font-extrabold ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
                } bg-clip-text text-transparent tracking-tight`}
              >
                Clases Grupales
              </h1>
              <div
                className={`absolute -bottom-2 left-0 w-full h-1.5 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
                } rounded-full opacity-60 animate-pulse`}
              ></div>
            </div>
            <span
              className={`
                text-sm font-semibold
                ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 border border-gray-600/30'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-100/50'
                }
                px-4 py-2 rounded-full
                flex items-center gap-2
                shadow-lg
                hover:shadow-xl
                transform hover:scale-105
                transition-all duration-300 ease-out
                animate-fadeIn
                relative
                overflow-hidden
                group
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <Users
                className={`w-4 h-4 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                } animate-pulse transform group-hover:rotate-12 transition-all duration-300`}
              />
              <span className="relative">Gestión de Clases</span>
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="create"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nueva Clase</span>
            </Button>
            <Button
              variant="csv"
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Exportar</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${
            isDarkMode
              ? 'bg-gray-800/90 border-gray-700/50'
              : 'bg-white/90 border-white/50'
          } backdrop-blur-xl p-10 rounded-none shadow-lg border-x-0 hover:shadow-xl transition-all duration-300`}
        >
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden p-8 rounded-2xl ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:from-gray-600/50 hover:to-gray-700/50 border-[3px] border-gray-700/50'
                  : 'bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white border-[3px] border-gray-200/50'
              } transition-all duration-500 hover:shadow-[0_10px_40px_rgb(0,0,0,0.15)] hover:-translate-y-2 group hover:border-opacity-100 hover:border-${
                card.color
              } hover:shadow-${card.color}/30`}
            >
              <div className="relative z-10 flex items-start gap-5">
                <div
                  className={`p-4 rounded-2xl ${card.color} bg-opacity-10 backdrop-blur-xl 
                    group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 
                    border-[3px] border-${card.color} border-opacity-20 group-hover:border-opacity-50
                    shadow-xl shadow-${card.color}/10 group-hover:shadow-${card.color}/40`}
                >
                  <card.icon
                    className={`w-8 h-8 ${card.color.replace(
                      'bg-',
                      'text-'
                    )} group-hover:animate-pulse`}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-base font-medium mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    } group-hover:text-opacity-75 transition-colors`}
                  >
                    {card.title}
                  </p>
                  <p
                    className={`text-4xl font-bold tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } group-hover:scale-105 transition-transform`}
                  >
                    {card.value}
                  </p>
                </div>
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-40 h-40 rounded-full ${card.color} 
                  opacity-10 blur-3xl group-hover:opacity-25 group-hover:scale-110 transition-all duration-500`}
              />
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div
          className={`${
            isDarkMode
              ? 'bg-gray-800/90 border-gray-700/50'
              : 'bg-white/90 border-white/50'
          } backdrop-blur-xl p-6 rounded-none shadow-lg border-x-0 hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar clases..."
                className={`w-full px-4 py-3 pl-11 rounded-xl ${
                  isDarkMode
                    ? 'bg-gray-700/50 text-white placeholder-gray-400 border-gray-600'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className={`absolute left-3 top-3.5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
            </div>
            <div className="relative">
              <Button
                variant="filter"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </Button>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2 w-72 p-4 rounded-2xl shadow-xl z-50 filter-dropdown ${
                    isDarkMode
                      ? 'bg-gray-700 border border-gray-600'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="mb-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      Capacidad
                    </label>
                    <select
                      value={filters.capacity}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }))
                      }
                      className={`w-full p-2 rounded ${
                        isDarkMode
                          ? 'bg-gray-600 text-white border-gray-600'
                          : 'bg-gray-100 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="all">Todas</option>
                      <option value="available">Con cupo disponible</option>
                      <option value="full">Cupo lleno</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      Sesiones
                    </label>
                    <select
                      value={filters.sessions}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sessions: e.target.value,
                        }))
                      }
                      className={`w-full p-2 rounded ${
                        isDarkMode
                          ? 'bg-gray-600 text-white border-gray-600'
                          : 'bg-gray-100 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="all">Todas</option>
                      <option value="1-2">1-2 sesiones/semana</option>
                      <option value="3-4">3-4 sesiones/semana</option>
                      <option value="5+">5+ sesiones/semana</option>
                    </select>
                  </div>
                  {/* Si tuvieras un filtro de entrenador, etc. */}
                </motion.div>
              )}
            </div>
          </div>

          {/* Table Section */}
          {loading ? (
            <div className="text-center py-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Users
                  className={`w-8 h-8 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                />
              </motion.div>
              <p
                className={`mt-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Cargando clases...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <X className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div
              className={`rounded-2xl overflow-hidden ${
                isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'
              } border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <TableWithActions
                headers={[
                  { header: 'Nombre', key: 'nombre' },
                  { header: 'Descripción', key: 'descripcion' },
                  // Se elimina la línea: { header: 'Clientes', key: 'clientes' },
                  { header: 'Capacidad', key: 'capacidad' },
                  { header: 'Sesiones', key: 'sesiones' },
                  { header: 'Acciones', key: 'acciones' }
                ]}
                data={filteredClassData.map((item) => ({
                  id: item.id,
                  _id: item.id,
                  nombre: item.nombre,
                  descripcion: item.descripcion,
                  clientes: item.clientes,
                  maxParticipantes: item.maxParticipantes,
                  sesiones: item.sesiones,
                  acciones: item.acciones
                }))}
                renderCell={renderCell}
                variant={isDarkMode ? 'dark' : 'white'}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <CrearClasePopup
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={refreshClassData}
            isDarkMode={isDarkMode}
          />
        )}

        {isEditModalOpen && selectedClassId && (
         <EditarClasePopup2
         onClose={() => {
           setIsEditModalOpen(false);
           setSelectedClassId(null);
         }}
         onEdit={refreshClassData}
         claseId={selectedClassId}
         initialSessions={classData.find(item => item._id === selectedClassId)?.sesiones || []}
         initialClients={classData.find(item => item._id === selectedClassId)?.clientes || []}
       />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassesPage;