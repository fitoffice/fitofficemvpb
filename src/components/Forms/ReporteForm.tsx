import React, { useState, useEffect, useMemo } from 'react';

interface Cliente {
  _id: string;
  nombre: string;
}

interface Ingreso {
  _id: string;
  monto: number;
  moneda: string;
  estado: string;
  fecha: string;
}

interface Gasto {
  _id: string;
  importe: number;
  moneda: string;
  categoria: string;
  fecha: string;
}

interface Servicio {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  cantidadPlanesPago: number;
}

interface ReporteFormData {
  nombre: string;
  frecuencia: string;
  campos: {
    clientes: boolean;
    ingresos: boolean;
    gastos: boolean;
    servicios: boolean;
  };
  clientesSeleccionados: string[];
  ingresosSeleccionados: string[];
  gastosSeleccionados: string[];
  serviciosSeleccionados: string[];
}

interface ReporteFormProps {
  onSubmit: (formData: ReporteFormData) => void;
}

const ReporteForm: React.FC<ReporteFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ReporteFormData>({
    nombre: '',
    frecuencia: '',
    campos: {
      clientes: false,
      ingresos: false,
      gastos: false,
      servicios: false
    },
    clientesSeleccionados: [],
    ingresosSeleccionados: [],
    gastosSeleccionados: [],
    serviciosSeleccionados: []
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState({
    clientes: false,
    ingresos: false,
    gastos: false,
    servicios: false
  });
  const [error, setError] = useState<{
    clientes: string | null;
    ingresos: string | null;
    gastos: string | null;
    servicios: string | null;
  }>({
    clientes: null,
    ingresos: null,
    gastos: null,
    servicios: null
  });

  const [expandedSections, setExpandedSections] = useState({
    clientes: true,
    ingresos: true,
    gastos: true,
    servicios: true
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    clientes: false,
    ingresos: false,
    gastos: false,
    servicios: false
  });

  const [filters, setFilters] = useState({
    clientes: {
      nombre: '',
    },
    ingresos: {
      estado: '',
      moneda: '',
      fecha: '',
    },
    gastos: {
      categoria: '',
      moneda: '',
      fecha: '',
    },
    servicios: {
      tipo: '',
    }
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleDropdown = (section: keyof typeof dropdownOpen, event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownOpen(prev => {
      const newState = {
        clientes: false,
        ingresos: false,
        gastos: false,
        servicios: false
      };
      newState[section] = !prev[section];
      return newState;
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen({
        clientes: false,
        ingresos: false,
        gastos: false,
        servicios: false
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (section: keyof typeof filters, category: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [category]: value
      }
    }));
  };

  const filteredClientes = useMemo(() => {
    if (!filters.clientes.nombre) return clientes;
    const searchTerm = filters.clientes.nombre.toLowerCase();
    return clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(searchTerm)
    );
  }, [clientes, filters.clientes.nombre]);

  const filteredIngresos = useMemo(() => {
    return ingresos.filter(ingreso => {
      if (filters.ingresos.estado && !ingreso.estado.toLowerCase().includes(filters.ingresos.estado.toLowerCase())) return false;
      if (filters.ingresos.moneda && ingreso.moneda !== filters.ingresos.moneda) return false;
      if (filters.ingresos.fecha) {
        const ingresoDate = new Date(ingreso.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
        if (ingresoDate !== filters.ingresos.fecha) return false;
      }
      return true;
    });
  }, [ingresos, filters.ingresos]);

  const filteredGastos = useMemo(() => {
    return gastos.filter(gasto => {
      if (filters.gastos.categoria && !gasto.categoria.toLowerCase().includes(filters.gastos.categoria.toLowerCase())) return false;
      if (filters.gastos.moneda && gasto.moneda !== filters.gastos.moneda) return false;
      if (filters.gastos.fecha) {
        const gastoDate = new Date(gasto.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
        if (gastoDate !== filters.gastos.fecha) return false;
      }
      return true;
    });
  }, [gastos, filters.gastos]);

  const filteredServicios = useMemo(() => {
    if (!servicios || !Array.isArray(servicios)) return [];
    if (!filters.servicios.tipo) return servicios;
    return servicios.filter(servicio => 
      servicio.tipo.toLowerCase().includes(filters.servicios.tipo.toLowerCase())
    );
  }, [servicios, filters.servicios.tipo]);

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(prev => ({ ...prev, clientes: true }));
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/basico', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los clientes');
        }
        
        const data = await response.json();
        console.log('Datos de clientes recibidos:', data);
        setClientes(data);
      } catch (err) {
        console.error('Error en la llamada API de clientes:', err);
        setError(prev => ({
          ...prev,
          clientes: err instanceof Error ? err.message : 'Error al cargar los clientes'
        }));
      } finally {
        setLoading(prev => ({ ...prev, clientes: false }));
      }
    };

    const fetchIngresos = async () => {
      setLoading(prev => ({ ...prev, ingresos: true }));
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos/basico', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los ingresos');
        }
        
        const data = await response.json();
        console.log('Datos de ingresos recibidos:', data);
        setIngresos(data);
      } catch (err) {
        console.error('Error en la llamada API de ingresos:', err);
        setError(prev => ({
          ...prev,
          ingresos: err instanceof Error ? err.message : 'Error al cargar los ingresos'
        }));
      } finally {
        setLoading(prev => ({ ...prev, ingresos: false }));
      }
    };

    const fetchGastos = async () => {
      setLoading(prev => ({ ...prev, gastos: true }));
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/basico', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los gastos');
        }
        
        const data = await response.json();
        console.log('Datos de gastos recibidos:', data);
        setGastos(data);
      } catch (err) {
        console.error('Error en la llamada API de gastos:', err);
        setError(prev => ({
          ...prev,
          gastos: err instanceof Error ? err.message : 'Error al cargar los gastos'
        }));
      } finally {
        setLoading(prev => ({ ...prev, gastos: false }));
      }
    };

    const fetchServicios = async () => {
      setLoading(prev => ({ ...prev, servicios: true }));
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/basico', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los servicios');
        }
        
        const data = await response.json();
        console.log('Datos de servicios recibidos:', data);
        // Fix: Extract the servicios array from the response
        setServicios(data.servicios || []);
      } catch (err) {
        console.error('Error en la llamada API de servicios:', err);
        setError(prev => ({
          ...prev,
          servicios: err instanceof Error ? err.message : 'Error al cargar los servicios'
        }));
      } finally {
        setLoading(prev => ({ ...prev, servicios: false }));
      }
    };

    fetchClientes();
    fetchIngresos();
    fetchGastos();
    fetchServicios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (campo: keyof typeof formData.campos) => {
    if (campo === 'clientes') {
      setFormData(prev => ({
        ...prev,
        campos: {
          ...prev.campos,
          [campo]: !prev.campos[campo]
        },
        clientesSeleccionados: !prev.campos[campo] ? clientes.map(cliente => cliente._id) : []
      }));
    } else if (campo === 'ingresos') {
      setFormData(prev => ({
        ...prev,
        campos: {
          ...prev.campos,
          [campo]: !prev.campos[campo]
        },
        ingresosSeleccionados: !prev.campos[campo] ? ingresos.map(ingreso => ingreso._id) : []
      }));
    } else if (campo === 'gastos') {
      setFormData(prev => ({
        ...prev,
        campos: {
          ...prev.campos,
          [campo]: !prev.campos[campo]
        },
        gastosSeleccionados: !prev.campos[campo] ? gastos.map(gasto => gasto._id) : []
      }));
    } else if (campo === 'servicios') {
      setFormData(prev => ({
        ...prev,
        campos: {
          ...prev.campos,
          [campo]: !prev.campos[campo]
        },
        serviciosSeleccionados: !prev.campos[campo] ? servicios.map(servicio => servicio._id) : []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        campos: {
          ...prev.campos,
          [campo]: !prev.campos[campo]
        }
      }));
    }
  };

  const handleClienteCheckboxChange = (clienteId: string) => {
    setFormData(prev => {
      const nuevosClientesSeleccionados = prev.clientesSeleccionados.includes(clienteId)
        ? prev.clientesSeleccionados.filter(id => id !== clienteId)
        : [...prev.clientesSeleccionados, clienteId];
      
      return {
        ...prev,
        clientesSeleccionados: nuevosClientesSeleccionados,
        campos: {
          ...prev.campos,
          clientes: nuevosClientesSeleccionados.length === clientes.length
        }
      };
    });
  };

  const handleIngresoCheckboxChange = (ingresoId: string) => {
    setFormData(prev => {
      const nuevosIngresosSeleccionados = prev.ingresosSeleccionados.includes(ingresoId)
        ? prev.ingresosSeleccionados.filter(id => id !== ingresoId)
        : [...prev.ingresosSeleccionados, ingresoId];
      
      return {
        ...prev,
        ingresosSeleccionados: nuevosIngresosSeleccionados,
        campos: {
          ...prev.campos,
          ingresos: nuevosIngresosSeleccionados.length === ingresos.length
        }
      };
    });
  };

  const handleGastoCheckboxChange = (gastoId: string) => {
    setFormData(prev => {
      const nuevosGastosSeleccionados = prev.gastosSeleccionados.includes(gastoId)
        ? prev.gastosSeleccionados.filter(id => id !== gastoId)
        : [...prev.gastosSeleccionados, gastoId];
      
      return {
        ...prev,
        gastosSeleccionados: nuevosGastosSeleccionados,
        campos: {
          ...prev.campos,
          gastos: nuevosGastosSeleccionados.length === gastos.length
        }
      };
    });
  };

  const handleServicioCheckboxChange = (servicioId: string) => {
    setFormData(prev => {
      const nuevosServiciosSeleccionados = prev.serviciosSeleccionados.includes(servicioId)
        ? prev.serviciosSeleccionados.filter(id => id !== servicioId)
        : [...prev.serviciosSeleccionados, servicioId];
      
      return {
        ...prev,
        serviciosSeleccionados: nuevosServiciosSeleccionados,
        campos: {
          ...prev.campos,
          servicios: nuevosServiciosSeleccionados.length === servicios.length
        }
      };
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMonto = (monto: number, moneda: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda
    }).format(monto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Clientes seleccionados:', formData.clientesSeleccionados);
    console.log('Ingresos seleccionados:', formData.ingresosSeleccionados);
    console.log('Gastos seleccionados:', formData.gastosSeleccionados);
    console.log('Servicios seleccionados:', formData.serviciosSeleccionados);
    console.log('Datos completos del formulario:', formData);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró token de autenticación');
        alert('Error: No se encontró token de autenticación');
        return;
      }
      
      // Prepare data for API request
      const reportData = {
        nombre: formData.nombre,
        frecuencia: formData.frecuencia,
        datos: {
          clientes: formData.campos.clientes ? formData.clientesSeleccionados : [],
          ingresos: formData.campos.ingresos ? formData.ingresosSeleccionados : [],
          gastos: formData.campos.gastos ? formData.gastosSeleccionados : [],
          servicios: formData.campos.servicios ? formData.serviciosSeleccionados : []
        }
      };
      
      console.log('Enviando datos al servidor:', reportData);
      console.log('URL de la petición:', 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/reports');
      
      // Make POST request to create report
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });
      
      console.log('Respuesta recibida, status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en la respuesta:', errorData);
        throw new Error(`Error al crear el reporte: ${response.status} - ${errorData}`);
      }
      
      const result = await response.json();
      console.log('Reporte creado exitosamente:', result);
      
      // Call the onSubmit prop with the form data
      onSubmit(formData);
      
      // Optional: Show success message
      alert('Reporte creado exitosamente');
      
    } catch (error) {
      console.error('Error detallado al enviar el reporte:', error);
      alert('Error al crear el reporte. Por favor, revisa la consola para más detalles.');
    } finally {
      console.log('Proceso de envío de reporte finalizado');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Reporte
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej: Reporte Mensual de Ventas"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ¿Cada cuánto quieres los reportes?
        </label>
        <select
          name="frecuencia"
          value={formData.frecuencia}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar frecuencia</option>
          <option value="diario">Diariamente</option>
          <option value="semanal">Semanalmente</option>
          <option value="quincenal">Quincenalmente</option>
          <option value="mensual">Mensualmente</option>
          <option value="trimestral">Trimestralmente</option>
          <option value="anual">Anualmente</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ¿Qué campos quieres usar para el informe?
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="clientes"
                checked={formData.campos.clientes}
                onChange={() => handleCheckboxChange('clientes')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="clientes" className="ml-2 text-sm text-gray-700">
                Clientes ({filteredClientes.length})
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('clientes', e)}
                  className={`p-1 hover:bg-gray-100 rounded-full ${dropdownOpen.clientes ? 'bg-purple-100' : ''}`}
                  title="Filtrar clientes"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                {dropdownOpen.clientes && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="p-2">
                      <select
                        value={filters.clientes.nombre}
                        onChange={(e) => handleFilterChange('clientes', 'nombre', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todos los clientes</option>
                        {[...new Set(clientes.map(c => c.nombre))].sort().map(nombre => (
                          <option key={nombre} value={nombre}>{nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleSection('clientes')}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.clientes ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {expandedSections.clientes && (
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
              {loading.clientes ? (
                <p className="text-sm text-gray-500">Cargando clientes...</p>
              ) : error.clientes ? (
                <p className="text-sm text-red-500">{error.clientes}</p>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {filteredClientes.map(cliente => (
                    <div key={cliente._id} className="flex items-center py-1 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`cliente-${cliente._id}`}
                        checked={formData.clientesSeleccionados.includes(cliente._id)}
                        onChange={() => handleClienteCheckboxChange(cliente._id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`cliente-${cliente._id}`} className="ml-2 text-sm text-gray-700">
                        {cliente.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ingresos"
                checked={formData.campos.ingresos}
                onChange={() => handleCheckboxChange('ingresos')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="ingresos" className="ml-2 text-sm text-gray-700">
                Ingresos ({filteredIngresos.length})
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('ingresos', e)}
                  className={`p-1 hover:bg-gray-100 rounded-full ${dropdownOpen.ingresos ? 'bg-purple-100' : ''}`}
                  title="Filtrar ingresos"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                {dropdownOpen.ingresos && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="p-2 space-y-2">
                      <select
                        value={filters.ingresos.estado}
                        onChange={(e) => handleFilterChange('ingresos', 'estado', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todos los estados</option>
                        {[...new Set(ingresos.map(i => i.estado))].sort().map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                      <select
                        value={filters.ingresos.moneda}
                        onChange={(e) => handleFilterChange('ingresos', 'moneda', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todas las monedas</option>
                        {[...new Set(ingresos.map(i => i.moneda))].sort().map(moneda => (
                          <option key={moneda} value={moneda}>{moneda}</option>
                        ))}
                      </select>
                      <select
                        value={filters.ingresos.fecha}
                        onChange={(e) => handleFilterChange('ingresos', 'fecha', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todas las fechas</option>
                        {[...new Set(ingresos.map(i => 
                          new Date(i.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
                        ))].sort().map(fecha => (
                          <option key={fecha} value={fecha}>{fecha}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleSection('ingresos')}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.ingresos ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {expandedSections.ingresos && (
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
              {loading.ingresos ? (
                <p className="text-sm text-gray-500">Cargando ingresos...</p>
              ) : error.ingresos ? (
                <p className="text-sm text-red-500">{error.ingresos}</p>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {filteredIngresos.map(ingreso => (
                    <div key={ingreso._id} className="flex items-center py-1 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`ingreso-${ingreso._id}`}
                        checked={formData.ingresosSeleccionados.includes(ingreso._id)}
                        onChange={() => handleIngresoCheckboxChange(ingreso._id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`ingreso-${ingreso._id}`} className="ml-2 text-sm text-gray-700 flex-grow">
                        <span className="font-medium">{formatMonto(ingreso.monto, ingreso.moneda)}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          ingreso.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 
                          ingreso.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {ingreso.estado}
                        </span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-gray-500">{formatDate(ingreso.fecha)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="gastos"
                checked={formData.campos.gastos}
                onChange={() => handleCheckboxChange('gastos')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="gastos" className="ml-2 text-sm text-gray-700">
                Gastos ({filteredGastos.length})
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('gastos', e)}
                  className={`p-1 hover:bg-gray-100 rounded-full ${dropdownOpen.gastos ? 'bg-purple-100' : ''}`}
                  title="Filtrar gastos"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                {dropdownOpen.gastos && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="p-2 space-y-2">
                      <select
                        value={filters.gastos.categoria}
                        onChange={(e) => handleFilterChange('gastos', 'categoria', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todas las categorías</option>
                        {[...new Set(gastos.map(g => g.categoria))].sort().map(categoria => (
                          <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                      </select>
                      <select
                        value={filters.gastos.moneda}
                        onChange={(e) => handleFilterChange('gastos', 'moneda', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todas las monedas</option>
                        {[...new Set(gastos.map(g => g.moneda))].sort().map(moneda => (
                          <option key={moneda} value={moneda}>{moneda}</option>
                        ))}
                      </select>
                      <select
                        value={filters.gastos.fecha}
                        onChange={(e) => handleFilterChange('gastos', 'fecha', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todas las fechas</option>
                        {[...new Set(gastos.map(g => 
                          new Date(g.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
                        ))].sort().map(fecha => (
                          <option key={fecha} value={fecha}>{fecha}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleSection('gastos')}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.gastos ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {expandedSections.gastos && (
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
              {loading.gastos ? (
                <p className="text-sm text-gray-500">Cargando gastos...</p>
              ) : error.gastos ? (
                <p className="text-sm text-red-500">{error.gastos}</p>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {filteredGastos.map(gasto => (
                    <div key={gasto._id} className="flex items-center py-1 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`gasto-${gasto._id}`}
                        checked={formData.gastosSeleccionados.includes(gasto._id)}
                        onChange={() => handleGastoCheckboxChange(gasto._id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`gasto-${gasto._id}`} className="ml-2 text-sm text-gray-700 flex-grow">
                        <span className="font-medium">{formatMonto(gasto.importe, gasto.moneda)}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          {gasto.categoria}
                        </span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-gray-500">{formatDate(gasto.fecha)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="servicios"
                checked={formData.campos.servicios}
                onChange={() => handleCheckboxChange('servicios')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="servicios" className="ml-2 text-sm text-gray-700">
                Servicios ({filteredServicios.length})
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('servicios', e)}
                  className={`p-1 hover:bg-gray-100 rounded-full ${dropdownOpen.servicios ? 'bg-purple-100' : ''}`}
                  title="Filtrar servicios"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                {dropdownOpen.servicios && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="p-2">
                      <select
                        value={filters.servicios.tipo}
                        onChange={(e) => handleFilterChange('servicios', 'tipo', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Todos los tipos</option>
                        {[...new Set(servicios.map(s => s.tipo))].sort().map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleSection('servicios')}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.servicios ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {expandedSections.servicios && (
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
              {loading.servicios ? (
                <p className="text-sm text-gray-500">Cargando servicios...</p>
              ) : error.servicios ? (
                <p className="text-sm text-red-500">{error.servicios}</p>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {filteredServicios.map(servicio => (
                    <div key={servicio._id} className="flex items-center py-1 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`servicio-${servicio._id}`}
                        checked={formData.serviciosSeleccionados.includes(servicio._id)}
                        onChange={() => handleServicioCheckboxChange(servicio._id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`servicio-${servicio._id}`} className="ml-2 text-sm text-gray-700 flex-grow">
                        <span className="font-medium">{servicio.nombre}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                          {servicio.tipo}
                        </span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-gray-500">{servicio.cantidadPlanesPago} planes</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Crear Reporte
        </button>
      </div>

      {/* Resumen de selección */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen de selección:</h3>
        <div className="space-y-2 text-xs text-gray-600">
          {formData.campos.clientes && (
            <div>
              <span className="font-medium">Clientes:</span> {formData.clientesSeleccionados.length} seleccionados
            </div>
          )}
          {formData.campos.ingresos && (
            <div>
              <span className="font-medium">Ingresos:</span> {formData.ingresosSeleccionados.length} seleccionados
            </div>
          )}
          {formData.campos.gastos && (
            <div>
              <span className="font-medium">Gastos:</span> {formData.gastosSeleccionados.length} seleccionados
            </div>
          )}
          {formData.campos.servicios && (
            <div>
              <span className="font-medium">Servicios:</span> {formData.serviciosSeleccionados.length} seleccionados
            </div>
          )}
          {!formData.campos.clientes && !formData.campos.ingresos && !formData.campos.gastos && !formData.campos.servicios && (
            <div className="italic">No hay campos seleccionados</div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ReporteForm;