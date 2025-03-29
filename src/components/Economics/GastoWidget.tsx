// src/components/Economics/GastoWidget.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DollarSign, TrendingDown, Search, Filter, Plus, Copy, Link, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { forwardRef, useImperativeHandle } from 'react';
import { useGastos } from '../../contexts/GastosContext';
import { useGastoEditModal } from '../../contexts/GastoEditModalContext';

interface GastoWidgetProps {
  title: string;
  onAddClick: () => void;
  onFilterClick: () => void;
  isFilterOpen: boolean;
  onGastoAdded?: (newGasto: Gasto) => void;
}

// Add forwardRef to expose methods
const GastoWidget = forwardRef<{ fetchGastos: () => Promise<void> }, GastoWidgetProps>(({
  title, 
  onAddClick,
  onFilterClick,
  isFilterOpen,
  onGastoAdded 
}, ref) => {
  const { theme = 'light' } = useTheme();
  const { nuevoGasto, refreshGastos } = useGastos();
  const { openEditModal } = useGastoEditModal();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const filterRef = useRef<HTMLDivElement>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGastoId, setSelectedGastoId] = useState<string | null>(null);
  const [isAsociacionPopupOpen, setIsAsociacionPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token'); // Asegúrate de que la clave sea correcta
  };

  // Función para obtener los gastos
  const fetchGastos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Log para depuración
      console.log('Respuesta de la API:', response.data);

      if (response.data?.data?.gastos && Array.isArray(response.data.data.gastos)) {
        setGastos(response.data.data.gastos);
      } else {
        console.error('Estructura de datos inválida:', response.data);
        setGastos([]);
        setError('La respuesta de la API no tiene el formato esperado');
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      setGastos([]);
      
      // Manejo específico de errores
      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que cae fuera del rango 2xx
        console.error('Error de respuesta:', error.response.data);
        console.error('Estado:', error.response.status);
        setError(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('Error de petición:', error.request);
        setError('No se pudo conectar con el servidor');
      } else {
        // Algo sucedió al configurar la petición que provocó un error
        console.error('Error de configuración:', error.message);
        setError('Error al procesar la petición');
      }
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchGastos method to parent component
  useImperativeHandle(ref, () => ({
    fetchGastos
  }));

  // Add useEffect to fetch gastos when component mounts
  useEffect(() => {
    fetchGastos();
  }, []);

  useEffect(() => {
    if (nuevoGasto) {
      console.log('Nuevo gasto recibido desde el contexto:', nuevoGasto);
      // Add the new gasto to the list
      setGastos(prevGastos => [...prevGastos, nuevoGasto]);
      
      // Call the callback if provided
      if (onGastoAdded) {
        onGastoAdded(nuevoGasto);
      }
    }
  }, [nuevoGasto, onGastoAdded]);

  // Filtrar los gastos según el término de búsqueda y los filtros seleccionados
  const filteredGastos = useMemo(() => {
    return gastos.filter((gasto) => {
      if (!gasto) return false;
      
      // Aplicar filtro de búsqueda
      const searchTermLower = searchTerm.toLowerCase();
      const fechaStr = new Date(gasto.fecha).toLocaleDateString();
      const importeStr = gasto.importe.toString();
      const descripcionStr = (gasto.descripcion || '').toLowerCase();
      const categoriaStr = (gasto.categoria || '').toLowerCase();
      const tipoStr = (gasto.tipo || '').toLowerCase();
      const clienteStr = (gasto.client?.nombre || '').toLowerCase();

      const matchesSearch = 
        fechaStr.includes(searchTermLower) ||
        importeStr.includes(searchTermLower) ||
        descripcionStr.includes(searchTermLower) ||
        categoriaStr.includes(searchTermLower) ||
        tipoStr.includes(searchTermLower) ||
        clienteStr.includes(searchTermLower);

      if (!matchesSearch) return false;

      // Aplicar filtro de fecha
      if (dateFilter !== 'all') {
        const gastoDate = new Date(gasto.fecha);
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        switch (dateFilter) {
          case 'today':
            if (gastoDate.toDateString() !== new Date().toDateString()) return false;
            break;
          case 'week':
            if (gastoDate < startOfWeek) return false;
            break;
          case 'month':
            if (gastoDate < startOfMonth) return false;
            break;
          case 'year':
            if (gastoDate < startOfYear) return false;
            break;
        }
      }

      // Aplicar filtro de importe
      if (amountFilter !== 'all') {
        const amount = gasto.importe;
        switch (amountFilter) {
          case '0-100':
            if (amount < 0 || amount > 100) return false;
            break;
          case '100-500':
            if (amount < 100 || amount > 500) return false;
            break;
          case '500-1000':
            if (amount < 500 || amount > 1000) return false;
            break;
          case '1000+':
            if (amount < 1000) return false;
            break;
        }
      }

      // Aplicar filtro de categoría
      if (categoryFilter !== 'all' && gasto.categoria !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [gastos, searchTerm, dateFilter, amountFilter, categoryFilter]);
  
  // Renderizar la tabla
  const renderTable = () => {
    if (loading) {
      return <div>Cargando...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
      <Table
        headers={['Fecha', 'Descripción', 'Importe', 'Categoría', 'Tipo', 'Asociado a', 'Acciones']}
        data={filteredGastos.map(gasto => ({
          'Fecha': new Date(gasto.fecha).toLocaleDateString(),
          'Descripción': gasto.descripcion || '-',
          'Importe': `${gasto.importe} ${gasto.moneda}`,
          'Categoría': gasto.categoria || 'Sin categoría',
          'Tipo': gasto.tipo || '-',
          'Asociado a': gasto.client?.nombre || 'No asociado',
          'Acciones': (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(gasto)}
                className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4 text-blue-500" />
              </button>
              <button
                onClick={() => handleDelete(gasto._id)}
                className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              <button
                onClick={() => {
                  setSelectedGastoId(gasto._id);
                  setIsAsociacionPopupOpen(true);
                }}
                className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              >
                <Link className="w-4 h-4 text-green-500" />
              </button>
            </div>
          )
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    );
  };

  // Función para eliminar un gasto
  const handleDelete = async (id: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualizar la lista de gastos después de eliminar
      setGastos(prevGastos => prevGastos.filter(gasto => gasto._id !== id));
      toast.success('Gasto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
      toast.error('Error al eliminar el gasto');
    }
  };

  // Función para editar un gasto
  const handleEdit = (gasto: Gasto) => {
    openEditModal(gasto);
  };

  // Función para guardar la edición
  const handleSaveEdit = async (editedGasto: Gasto) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      await axios.patch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${editedGasto._id}`, editedGasto, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualizar la lista de gastos
      setGastos(prevGastos =>
        prevGastos.map(g => g._id === editedGasto._id ? editedGasto : g)
      );

      setIsEditMode(false);
      setSelectedGasto(null);
      toast.success('Gasto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el gasto:', error);
      toast.error('Error al actualizar el gasto');
    }
  };

  // Add this function
  const handleGastoAdded = (newGasto: Gasto) => {
    setGastos(prevGastos => [...prevGastos, newGasto]);
    if (onGastoAdded) {
      onGastoAdded(newGasto);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
        <div className="flex gap-2 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 pr-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          <div className="relative" ref={filterRef}>
            <Button 
              variant="filter"
              onClick={onFilterClick}
              className={`flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-red-900 hover:bg-red-800 text-red-400' 
                  : 'bg-red-100 hover:bg-red-200 text-red-500'
              }`}
            >
              <Filter size={16} />
              Filtrar
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="p-4  overflow-y-auto custom-scrollbar">
                    <div className="mb-4">
                      <label className={`block mb-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Fecha
                      </label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className={`w-full p-2 rounded-md border ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="all">Todas las fechas</option>
                        <option value="today">Hoy</option>
                        <option value="week">Esta semana</option>
                        <option value="month">Este mes</option>
                        <option value="year">Este año</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className={`block mb-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Importe
                      </label>
                      <select
                        value={amountFilter}
                        onChange={(e) => setAmountFilter(e.target.value)}
                        className={`w-full p-2 rounded-md border ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="all">Todos los importes</option>
                        <option value="0-100">0€ - 100€</option>
                        <option value="100-500">100€ - 500€</option>
                        <option value="500-1000">500€ - 1000€</option>
                        <option value="1000+">Más de 1000€</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className={`block mb-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Categoría
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={`w-full p-2 rounded-md border ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="all">Todas las categorías</option>
                        <option value="suministros">Suministros</option>
                        <option value="personal">Personal</option>
                        <option value="marketing">Marketing</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setDateFilter('all');
                          setAmountFilter('all');
                          setCategoryFilter('all');
                        }}
                        className={`text-sm ${
                          theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        Limpiar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => onFilterClick()}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="primary"
            onClick={onAddClick}
            className={`flex items-center gap-2 ${
              theme === 'dark' 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            <Plus size={16} />
            Añadir
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto custom-scrollbar">
        <div className="overflow-x-auto min-w-full">
          {renderTable()}
        </div>
      </div>
      
    </div>
  );
});

export default GastoWidget;
