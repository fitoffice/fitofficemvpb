// src/components/Economics/Cashflow/GastoWidget.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle, CircleSlash2 , Link, XCircle } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import GastoPopup from '../../modals/GastoPopup';
import AsociarGastoPopup from '../../modals/AsociarGastoPopup';
import EdicionDeGastos from './EdicionDeGastos';
import FiltroGastosPopup from './FiltroGastosPopup';
import NuevoGastoPopup from './NuevoGastoPopup';

interface GastoWidgetProps { }

interface Gasto {
  _id: string;
  entrenador: string;
  importe?: number;
  monto?: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'fijo' | 'variable';
  estado?: string;
  client?: {
    _id: string;
    nombre: string;
    email: string;
  };
  plan?: {
    _id: string;
    nombre: string;
  };
  service?: {
    _id: string;
    nombre: string;
    descripcion?: string;
  };
}

const GastoWidget: React.FC<GastoWidgetProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGastoId, setSelectedGastoId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAsociando, setIsAsociando] = useState(false);
  const [expandedServices, setExpandedServices] = useState<number[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAsociacionPopupOpen, setIsAsociacionPopupOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    categoria: '',
    tipo: '',
    montoMinimo: '',
    montoMaximo: ''
  });

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token'); // Asegúrate de que la clave sea correcta
  };
  // Add this new function to handle reverting payment status
  const handleRevertPayment = async (gastoId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${gastoId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'pendiente' }),
      });

      if (!response.ok) {
        throw new Error('Error al desconfirmar el pago');
      }

      // Actualizar el estado del gasto en la lista
      setGastos(gastos.map(gasto => 
        gasto._id === gastoId ? { ...gasto, estado: 'pendiente' } : gasto
      ));
    } catch (error) {
      console.error('Error al desconfirmar:', error);
      setError(error instanceof Error ? error.message : 'Error al desconfirmar el pago');
    }
  };
  // Función para obtener el importe independientemente de si viene como monto o importe
  const getImporte = (gasto: any): number => {
    if (!gasto) return 0;
    // Intentar obtener el valor de importe o monto, convertir a número y validar
    const valor = gasto.importe !== undefined ? gasto.importe : gasto.monto;
    const numeroValor = Number(valor);
    return isNaN(numeroValor) ? 0 : numeroValor;
  };

  // Función para formatear el importe
  const formatImporte = (importe: number | undefined, moneda: string): string => {
    if (importe === undefined || isNaN(Number(importe))) {
      return `0 ${moneda || 'EUR'}`;
    }
    try {
      return `${Number(importe).toLocaleString('es-ES')} ${moneda || 'EUR'}`;
    } catch (error) {
      console.error('Error al formatear importe:', error);
      return `${importe} ${moneda || 'EUR'}`;
    }
  };

  // Función para obtener los gastos desde la API
  const fetchGastos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los gastos');
      }

      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      // Mapear los datos recibidos a la interfaz Gasto
      const gastosFormateados = data.data.gastos.map((gasto: any) => {
        const importeValor = getImporte(gasto);
        console.log('Procesando gasto:', gasto, 'Importe calculado:', importeValor);
        
        return {
          _id: gasto._id || '',
          entrenador: gasto.entrenador || '',
          importe: importeValor,
          moneda: gasto.moneda || 'EUR',
          fecha: gasto.fecha || new Date().toISOString(),
          descripcion: gasto.descripcion || '',
          categoria: gasto.categoria || 'Sin categoría',
          tipo: gasto.tipo || 'fijo',
          estado: gasto.estado || 'pendiente',
          client: gasto.client || null,
          plan: gasto.plan || null,
          service: gasto.service || null,
          fechaConfirmacion: gasto.fechaConfirmacion || null,
          updatedAt: gasto.updatedAt || null
        };
      });
      console.log('Gastos formateados:', gastosFormateados);
      setGastos(gastosFormateados);
    } catch (err) {
      console.error('Error al obtener gastos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  // Función de búsqueda y filtrado
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar gastos');
    // Implementa aquí la lógica de filtrado avanzada si es necesario
  };

  const handleEdit = (gasto: Gasto) => {
    setSelectedGasto(gasto);
    setIsEditing(true);
    setIsPopupOpen(false); // Close the popup when editing
  };

  const handleEditSave = async (gastoActualizado: Gasto) => {
    setGastos(gastos.map(g => 
      g._id === gastoActualizado._id ? gastoActualizado : g
    ));
    setIsEditing(false);
    setSelectedGasto(null);
  };

  const handleDelete = async (gastoId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${gastoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el gasto');
      }

      setGastos(gastos.filter(gasto => gasto._id !== gastoId));
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el gasto');
    }
  };

  const handleConfirmPayment = async (gastoId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${gastoId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'pagado' }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el pago');
      }

      // Actualizar el estado del gasto en la lista
      setGastos(gastos.map(gasto => 
        gasto._id === gastoId ? { ...gasto, estado: 'pagado' } : gasto
      ));
    } catch (error) {
      console.error('Error al confirmar:', error);
      setError(error instanceof Error ? error.message : 'Error al confirmar el pago');
    }
  };

  const handleRemoveAssociation = async (gastoId: string) => {
    console.log('Iniciando desasociación del gasto:', gastoId);
    try {
      const token = getToken();
      if (!token) {
        console.error('Token no encontrado');
        throw new Error('Token no encontrado');
      }
      console.log('Token obtenido correctamente');

      console.log('Enviando solicitud de desasociación a la API...');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${gastoId}/desasociar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta recibida:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error en la respuesta:', errorData);
        throw new Error('Error al desasociar el gasto');
      }

      const responseData = await response.json().catch(() => ({}));
      console.log('Datos de respuesta:', responseData);

      // Actualizar la lista de gastos
      console.log('Actualizando lista de gastos...');
      await fetchGastos();
      console.log('Lista de gastos actualizada');
    } catch (error) {
      console.error('Error en handleRemoveAssociation:', error);
      setError(error instanceof Error ? error.message : 'Error al desasociar el gasto');
    }
  };
  const handleSubmit = async (nuevoGasto: any) => {
    try {
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(nuevoGasto),
      });

      if (!response.ok) {
        throw new Error('Error al crear el gasto');
      }

      const gastoCreado = await response.json();
      setGastos([...gastos, gastoCreado]);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedGastoId(null);
    setIsEditing(false);
  };

  const handleAsociarGasto = (gastoId: string) => {
    setSelectedGastoId(gastoId);
    setIsAsociacionPopupOpen(true);
  };

  const handleAsociacionSubmit = async (data: { serviceId?: string; planId?: string; tipo: 'servicio' | 'planPago' }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedGastoId) return;

      const endpoint = data.tipo === 'servicio' 
        ? `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${selectedGastoId}/asociar-servicio`
        : `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${selectedGastoId}/asociar-plan`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceId: data.serviceId,
          planId: data.planId
        })
      });

      if (!response.ok) {
        throw new Error('Error al asociar el gasto');
      }

      // toast.success('Gasto asociado correctamente');
      setIsAsociacionPopupOpen(false);
      fetchGastos(); // Recargar la lista de gastos
    } catch (error) {
      console.error('Error:', error);
      // toast.error('Error al asociar el gasto');
    }
  };

  const servicios: any[] = [
    {
      id: 1,
      nombre: 'Entrenamiento Personal',
      planes: [
        { id: 1, nombre: 'Plan Básico' },
        { id: 2, nombre: 'Plan Avanzado' },
        { id: 3, nombre: 'Plan Elite' },
      ]
    },
    {
      id: 2,
      nombre: 'Clases Grupales',
      planes: [
        { id: 4, nombre: 'Plan Mensual' },
        { id: 5, nombre: 'Plan Trimestral' },
      ]
    },
    {
      id: 3,
      nombre: 'Nutrición',
      planes: [
        { id: 6, nombre: 'Consulta Individual' },
        { id: 7, nombre: 'Plan Seguimiento' },
      ]
    },
  ];

  const toggleServiceExpansion = (serviceId: number) => {
    setExpandedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddServicio = () => {
    console.log('Añadir nuevo servicio');
    // Implementa aquí la lógica para añadir un nuevo servicio
  };

  const handleAddPlan = (servicioId: number) => {
    console.log(`Añadir nuevo plan al servicio ${servicioId}`);
    // Implementa aquí la lógica para añadir un nuevo plan al servicio correspondiente
  };

  const handleAsociar = (tipo: 'Servicio' | 'Plan', id: number, nombre: string) => {
    if (!selectedGastoId) return;

    setGastos(prevGastos =>
      prevGastos.map(gasto =>
        gasto._id === selectedGastoId
          ? { ...gasto, descripcion: `${tipo}: ${nombre}` } // Ajusta según tus necesidades
          : gasto
      )
    );
    handleClosePopup();
  };

  // Función para contar filtros activos
  const getActiveFiltersCount = () => {
    return Object.values(filterOptions).filter(value => value !== '').length;
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilterOptions({
      fechaInicio: '',
      fechaFin: '',
      estado: '',
      categoria: '',
      tipo: '',
      montoMinimo: '',
      montoMaximo: ''
    });
  };

  const applyFilters = () => {
    const filteredGastos = gastos.filter(gasto => {
      if (filterOptions.fechaInicio && new Date(gasto.fecha) < new Date(filterOptions.fechaInicio)) return false;
      if (filterOptions.fechaFin && new Date(gasto.fecha) > new Date(filterOptions.fechaFin)) return false;
      if (filterOptions.estado && gasto.estado !== filterOptions.estado) return false;
      if (filterOptions.categoria && gasto.categoria !== filterOptions.categoria) return false;
      if (filterOptions.tipo && gasto.tipo !== filterOptions.tipo) return false;
      if (filterOptions.montoMinimo && getImporte(gasto) < parseFloat(filterOptions.montoMinimo)) return false;
      if (filterOptions.montoMaximo && getImporte(gasto) > parseFloat(filterOptions.montoMaximo)) return false;
      return true;
    });

    setGastos(filteredGastos);
  };

  // Filtrar los gastos según el término de búsqueda
  const filteredGastos = gastos.filter((gasto) => {
    console.log('Procesando gasto:', gasto); // Log para depuración

    if (!gasto.categoria) {
      console.warn('Gasto sin categoría:', gasto);
      return false;
    }

    const search = searchTerm.toLowerCase();
    const categoriaMatch = gasto.categoria.toLowerCase().includes(search);
    const descripcionMatch = gasto.descripcion ? gasto.descripcion.toLowerCase().includes(search) : false;

    return categoriaMatch || descripcionMatch;
  });

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          Gastos
        </h3>
        <Button variant="create" onClick={() => setIsPopupOpen(true)} className="px-4 py-2">
          <Plus className="w-5 h-5 mr-2" />
          Añadir Gasto
        </Button>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar gastos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-4 py-2 pr-10 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <div className="relative">
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="filter"
          >
            <Filter className="w-4 h-4" />
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 z-50`}>
              <FiltroGastosPopup
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={() => {
                  applyFilters();
                  setIsFilterOpen(false);
                }}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Table
          headers={['Fecha', 'Descripción', 'Importe', 'Categoría', 'Tipo', 'Estado', 'Asociado a', 'Acciones']}
          data={filteredGastos.map(gasto => ({
            'Fecha': new Date(gasto.fecha).toLocaleDateString(),
            'Descripción': gasto.descripcion || '-',
            'Importe': formatImporte(gasto.importe, gasto.moneda),
            'Categoría': gasto.categoria || 'Sin categoría',
            'Tipo': gasto.tipo || 'fijo',
            'Estado': (
              <span className={`px-2 py-1 rounded-full text-xs ${
                gasto.estado === 'pagado' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {gasto.estado ? gasto.estado.charAt(0).toUpperCase() + gasto.estado.slice(1) : 'Pendiente'}
              </span>
            ),
            'Asociado a': (
              <div>
                {gasto.client?.nombre && <div>Cliente: {gasto.client.nombre}</div>}
                {gasto.plan?.nombre && <div>Plan: {gasto.plan.nombre}</div>}
                {(gasto as any).service?.nombre && <div>Servicio: {(gasto as any).service.nombre}</div>}
                {!gasto.client?.nombre && !gasto.plan?.nombre && !(gasto as any).service?.nombre && 'No asociado'}
              </div>
            ),
            'Acciones': (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(gasto)}
                    className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(gasto._id)}
                    className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  
                  {/* Mostrar botón de asociar solo si no está asociado a nada */}
                  {!gasto.client && !gasto.plan && !gasto.service && (
                    <button
                      onClick={() => {
                        setSelectedGastoId(gasto._id);
                        setIsAsociacionPopupOpen(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                      title="Asociar"
                    >
                      <Link className="w-4 h-4 text-green-500" />
                    </button>
                  )}
                  
                  {/* Mostrar botón de desasociar si está asociado a algo */}
                  {(gasto.client || gasto.plan || gasto.service) && (
                    <button
                      onClick={() => handleRemoveAssociation(gasto._id)}
                      className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                      title="Quitar asociación"
                    >
                      <CircleSlash2  className="w-4 h-4 text-orange-500" />
                    </button>
                  )}
                  
                  {(!gasto.estado || gasto.estado !== 'pagado') && (
                    <button
                      onClick={() => handleConfirmPayment(gasto._id)}
                      className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                      title="Confirmar pago"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </button>
                  )}
                                    {/* Mostrar botón de desconfirmar pago si está pagado */}
                                    {gasto.estado === 'pagado' && (
                    <button
                      onClick={() => handleRevertPayment(gasto._id)}
                      className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                      title="Anular pago"
                    >
                      <XCircle className="w-4 h-4 text-red-500" />
                    </button>
                  )}

                </div>
              )
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        )}
      </div>

      <AnimatePresence>
        {(isPopupOpen || isEditing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isPopupOpen ? (
              <NuevoGastoPopup
                onClose={() => setIsPopupOpen(false)}
                onSubmit={handleSubmit}
              />
            ) : (
              <EdicionDeGastos
                gasto={selectedGasto}
                onClose={() => {
                  setIsEditing(false);
                  setSelectedGasto(null);
                }}
                onSave={handleEditSave}
              />
            )}
          </motion.div>
        )}

        {isAsociacionPopupOpen && selectedGastoId && (
          <AsociarGastoPopup
            gastoId={selectedGastoId}
            onClose={() => setIsAsociacionPopupOpen(false)}
            onSubmit={handleAsociacionSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GastoWidget;
