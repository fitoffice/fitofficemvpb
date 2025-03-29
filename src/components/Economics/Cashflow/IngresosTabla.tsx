import React, { useState, useEffect, useRef } from 'react';
import Table from '../../Common/Table';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle, Download, XCircle } from 'lucide-react';
import Button from '../../Common/Button';
import NuevoIngresoPopup from './NuevoIngresoPopup';
import EdicionDeIngresos from './EdicionDeIngresos';
import { motion, AnimatePresence } from 'framer-motion';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

interface PlanDePago {
  _id: string;
  nombre: string;
  precio: number;
}

interface Ingreso {
  _id: string;
  entrenador: string;
  cliente: Cliente;
  planDePago: PlanDePago;
  monto: number;
  moneda: string;
  estado: string;
  metodoPago: string;
  fecha: string;
  fechaPagoRealizado: string | null;
  descripcion: string;
}

interface FilterOptions {
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  planDePago: string;
  metodoPago: string;
  montoMinimo: string;
  montoMaximo: string;
}

const IngresosTabla: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [ingresosOriginales, setIngresosOriginales] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState<Ingreso | null>(null);
  const [planesDePago, setPlanesDePago] = useState<PlanDePago[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filterRef = useRef<HTMLDivElement>(null);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    planDePago: '',
    metodoPago: '',
    montoMinimo: '',
    montoMaximo: ''
  });

  const getToken = () => localStorage.getItem('token');

  const fetchIngresos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      console.log('Iniciando petición a la API de ingresos...');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los ingresos.');
      }

      const data: Ingreso[] = await response.json();
      console.log('Datos crudos de ingresos recibidos:', data);

      // Log de cada ingreso individual
      data.forEach((ingreso, index) => {
        
      });

      setIngresos(data);
      setIngresosOriginales(data);
    } catch (err: any) {
      console.error('Error al obtener ingresos:', err);
      setError(err.message || 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Cerrar el filtro cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar planes de pago
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const token = getToken();
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planes-de-pago', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch planes de pago');
        }
        const data = await response.json();
        setPlanesDePago(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching planes:', error);
        setPlanesDePago([]);
      }
    };

    fetchPlanes();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    const filtrarDatosLocalmente = () => {
      let datosFiltrados = [...ingresosOriginales];

      // Aplicar filtros
      if (filterOptions.fechaInicio) {
        datosFiltrados = datosFiltrados.filter(ingreso => 
          new Date(ingreso.fecha) >= new Date(filterOptions.fechaInicio)
        );
      }
      if (filterOptions.fechaFin) {
        datosFiltrados = datosFiltrados.filter(ingreso => 
          new Date(ingreso.fecha) <= new Date(filterOptions.fechaFin)
        );
      }
      if (filterOptions.estado) {
        datosFiltrados = datosFiltrados.filter(ingreso => 
          ingreso.estado.toLowerCase() === filterOptions.estado.toLowerCase()
        );
      }
      if (filterOptions.planDePago) {
        datosFiltrados = datosFiltrados.filter(ingreso => 
          ingreso.planDePago._id === filterOptions.planDePago
        );
      }
      if (filterOptions.metodoPago) {
        datosFiltrados = datosFiltrados.filter(ingreso => 
          ingreso.metodoPago.toLowerCase() === filterOptions.metodoPago.toLowerCase()
        );
      }
      if (filterOptions.montoMinimo) {
        datosFiltrados = datosFiltrados.filter(ingreso => 
          ingreso.monto >= parseFloat(filterOptions.montoMinimo)
        );
      }
      if (filterOptions.montoMaximo) {
        datosFiltrados = datosFiltrados.filter(ingreso => 
          ingreso.monto <= parseFloat(filterOptions.montoMaximo)
        );
      }

      setIngresos(datosFiltrados);
    };

    filtrarDatosLocalmente();
  }, [filterOptions, ingresosOriginales]);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      const token = getToken();
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el ingreso');
      }

      const newIngreso = await response.json();
      setIngresos([...ingresos, newIngreso]);
      setIngresosOriginales([...ingresosOriginales, newIngreso]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error al crear ingreso:', error);
    }
  };

  const handleEdit = (ingreso: Ingreso) => {
    setSelectedIngreso(ingreso);
    setShowEditModal(true);
  };

  const handleEditSave = async (ingresoActualizado: Ingreso) => {
    setIngresos(ingresos.map(ing => 
      ing._id === ingresoActualizado._id ? ingresoActualizado : ing
    ));
    setIngresosOriginales(ingresosOriginales.map(ing => 
      ing._id === ingresoActualizado._id ? ingresoActualizado : ing
    ));
    setShowEditModal(false);
    setSelectedIngreso(null);
  };

  const handleDelete = async (ingresoId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
      try {
        const token = getToken();
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos/${ingresoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el ingreso');
        }

        setIngresos(ingresos.filter(ing => ing._id !== ingresoId));
        setIngresosOriginales(ingresosOriginales.filter(ing => ing._id !== ingresoId));
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const handleConfirm = async (ingresoId: string) => {
    try {
      const token = getToken();
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos/${ingresoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'pagado' }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el pago');
      }

      const updatedIngreso = await response.json();
      // Actualizar el estado del ingreso en la lista con los datos devueltos por el servidor
      setIngresos(ingresos.map(ing => 
        ing._id === ingresoId ? updatedIngreso : ing
      ));
      setIngresosOriginales(ingresosOriginales.map(ing => 
        ing._id === ingresoId ? updatedIngreso : ing
      ));
    } catch (error) {
      console.error('Error al confirmar:', error);
    }
  };

  const handleUnconfirm = async (ingresoId: string) => {
    try {
      const token = getToken();
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos/${ingresoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'pendiente' }),
      });

      if (!response.ok) {
        throw new Error('Error al desconfirmar el pago');
      }

      const updatedIngreso = await response.json();
      setIngresos(ingresos.map(ing => 
        ing._id === ingresoId ? updatedIngreso : ing
      ));
      setIngresosOriginales(ingresosOriginales.map(ing => 
        ing._id === ingresoId ? updatedIngreso : ing
      ));
    } catch (error) {
      console.error('Error al desconfirmar:', error);
    }
  };

  const downloadCSV = () => {
    // Crear las cabeceras del CSV
    const headers = ['Fecha', 'Cliente', 'Plan de Pago', 'Monto', 'Moneda', 'Estado', 'Método de Pago', 'Descripción'];
    
    // Convertir los datos a formato CSV
    const csvData = ingresos.map(ingreso => [
      ingreso.fecha || '',
      ingreso.cliente?.nombre || 'Sin cliente',
      ingreso.planDePago?.nombre || 'Sin plan',
      ingreso.monto || 0,
      ingreso.moneda || '',
      ingreso.estado || '',
      ingreso.metodoPago || '',
      ingreso.descripcion || ''
    ]);

    // Unir cabeceras y datos
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Crear el blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ingresos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredIngresos = ingresos.filter(ingreso => {
    // First apply search term filter
    const matchesSearch = 
      ingreso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.moneda?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.monto?.toString().includes(searchTerm) ||
      ingreso.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.planDePago?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase());

    // If there are no active filters or search term doesn't match, return early
    if (!filterOptions.fechaInicio && !filterOptions.fechaFin && !filterOptions.estado && !filterOptions.planDePago && !filterOptions.metodoPago && !filterOptions.montoMinimo && !filterOptions.montoMaximo || !matchesSearch) return matchesSearch;

    // Then apply active filters
    const {
      fechaInicio,
      fechaFin,
      estado,
      planDePago,
      metodoPago,
      montoMinimo,
      montoMaximo
    } = filterOptions;

    // Date filter
    const ingresoDate = new Date(ingreso.fecha);
    if (fechaInicio && new Date(fechaInicio) > ingresoDate) return false;
    if (fechaFin && new Date(fechaFin) < ingresoDate) return false;

    // Estado filter
    if (estado && ingreso.estado !== estado) return false;

    // Plan de pago filter
    if (planDePago && ingreso.planDePago?._id !== planDePago) return false;

    // Método de pago filter
    if (metodoPago && ingreso.metodoPago !== metodoPago) return false;

    // Monto filter
    if (montoMinimo && ingreso.monto < parseFloat(montoMinimo)) return false;
    if (montoMaximo && ingreso.monto > parseFloat(montoMaximo)) return false;

    return true;
  });

  const paginatedIngresos = filteredIngresos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredIngresos.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Cargando ingresos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Ingresos
          </h3>
          <div className="flex items-center space-x-4">
            <Button
              variant="csv"
              onClick={downloadCSV}
              className="flex items-center space-x-2"
            >
              <Download size={18} />
              <span>CSV</span>
            </Button>
            <Button variant="create" onClick={handleAdd} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Ingreso
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar ingresos..."
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
          <div className="relative" ref={filterRef}>
            <Button variant="filter" onClick={handleFilter}>
              <Filter className="w-4 h-4" />
            </Button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 mt-10 p-4 rounded-lg shadow-lg z-50 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  } min-w-[300px]`}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Estado</label>
                      <select
                        name="estado"
                        value={filterOptions.estado}
                        onChange={handleFilterChange}
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        <option value="">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Plan de Pago</label>
                      <select
                        name="planDePago"
                        value={filterOptions.planDePago}
                        onChange={handleFilterChange}
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        <option value="">Todos</option>
                        {Array.isArray(planesDePago) && planesDePago.map(plan => (
                          <option key={plan._id} value={plan._id}>
                            {plan.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Método de Pago</label>
                      <select
                        name="metodoPago"
                        value={filterOptions.metodoPago}
                        onChange={handleFilterChange}
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        <option value="">Todos</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha desde</label>
                      <input
                        type="date"
                        name="fechaInicio"
                        value={filterOptions.fechaInicio}
                        onChange={handleFilterChange}
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha hasta</label>
                      <input
                        type="date"
                        name="fechaFin"
                        value={filterOptions.fechaFin}
                        onChange={handleFilterChange}
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Importe mínimo</label>
                      <input
                        type="number"
                        name="montoMinimo"
                        value={filterOptions.montoMinimo}
                        onChange={handleFilterChange}
                        placeholder="0"
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Importe máximo</label>
                      <input
                        type="number"
                        name="montoMaximo"
                        value={filterOptions.montoMaximo}
                        onChange={handleFilterChange}
                        placeholder="999999"
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
         
          </div>
        </div>
      </div>

      <div className={`max-h-[600px] overflow-y-auto ${
        theme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'
      }`}>
        <style jsx>{`
          .scrollbar-dark::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-dark::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 4px;
          }
          .scrollbar-dark::-webkit-scrollbar-thumb {
            background: #4B5563;
            border-radius: 4px;
          }
          .scrollbar-dark::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
          }
          .scrollbar-light::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-light::-webkit-scrollbar-track {
            background: #F3F4F6;
            border-radius: 4px;
          }
          .scrollbar-light::-webkit-scrollbar-thumb {
            background: #D1D5DB;
            border-radius: 4px;
          }
          .scrollbar-light::-webkit-scrollbar-thumb:hover {
            background: #9CA3AF;
          }
        `}</style>

        <Table
          headers={[
            'Fecha',
            'Descripción',
            'Importe',
            'Estado de pago',
            'Cliente',
            'Plan',
            'Método de pago',
            'Fecha de pago',
            'Acciones'
          ]}
          data={paginatedIngresos.map(ingreso => ({
            Fecha: ingreso.fecha ? new Date(ingreso.fecha).toLocaleDateString() : 'Fecha no disponible',
            Descripción: ingreso.descripcion || 'Sin descripción',
            Importe: `${ingreso.monto?.toLocaleString() || 0} ${ingreso.moneda || 'EUR'}`,
            'Estado de pago': (
              <span className={`px-2 py-1 rounded-full text-xs ${
                ingreso.estado === 'pagado' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {ingreso.estado 
                  ? ingreso.estado.charAt(0).toUpperCase() + ingreso.estado.slice(1)
                  : 'Pendiente'
                }
              </span>
            ),
            Cliente: ingreso.cliente?.nombre || 'Sin cliente',
            Plan: ingreso.planDePago?.nombre || 'Sin plan',
            'Método de pago': ingreso.metodoPago 
              ? ingreso.metodoPago.charAt(0).toUpperCase() + ingreso.metodoPago.slice(1)
              : 'No especificado',
            'Fecha de pago': ingreso.fechaPagoRealizado 
              ? new Date(ingreso.fechaPagoRealizado).toLocaleDateString()
              : 'No pagado aún',
            Acciones: (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(ingreso)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                  }`}
                  title="Modificar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(ingreso._id)}
                  className={`p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
                {(!ingreso.metodoPago || ingreso.metodoPago.toLowerCase() === 'efectivo') && 
                (!ingreso.estado || ingreso.estado !== 'pagado') && (
                  <button
                    onClick={() => handleConfirm(ingreso._id)}
                    className={`p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-colors ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}
                    title="Confirmar pago"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                {ingreso.estado === 'pagado' && (
                  <button
                    onClick={() => handleUnconfirm(ingreso._id)}
                    className={`p-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors ${
                      theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                    }`}
                    title="Anular pago"
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>

      {filteredIngresos.length > 10 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Mostrando 10 de {filteredIngresos.length} ingresos. Desplázate para ver más.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {showAddModal && (
        <NuevoIngresoPopup
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}
      
      {showEditModal && selectedIngreso && (
        <EdicionDeIngresos
          ingreso={selectedIngreso}
          onClose={() => {
            setShowEditModal(false);
            setSelectedIngreso(null);
          }}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default IngresosTabla;