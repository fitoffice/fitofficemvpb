import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import PanelCliente from '../../components/Clients/PanelCliente';
import ClientListHeader from '../../components/Clients/ClientListHeader';
import ClientListViewSimple from '../../components/Clients/ClientListViewSimple';
import { Cliente } from '../../services/clientService';
import { useFilters } from '../../contexts/FilterContext';

// ⬇ NO BORRAMOS NADA DE TU CÓDIGO, SOLO IMPORTAMOS EL CONTEXTO
import { useClientContext } from '../../contexts/ClientContext';

interface ClientListProps {
  onCreateClient: () => void;
}

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

const ClientList: React.FC<ClientListProps> = ({ onCreateClient }) => {
  const { theme } = useTheme();

  // ⬇ Obtenemos "clients" del contexto (donde se añaden clientes creados con addClient)
  const { clients: contextClients, refreshClients } = useClientContext();
  const { filters, setFilters, isFilterActive } = useFilters();

  // ⬇ Mantenemos tu arreglo local y tu fetch
  const [clientesData, setClientesData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [openPanels, setOpenPanels] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'simple'>('table');

  const [serviciosData, setServiciosData] = useState<{ [key: string]: string }>({});
  const [planesDePagoData, setPlanesDePagoData] = useState<{ [key: string]: string }>({});

  // Estilos base
  const styles = {
    container: `${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen p-6`,
    header: `mb-8`,
  };

  // ⬇ 1) Tu fetch local para cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/clientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const transformedData = Array.isArray(data)
          ? data.map((client: any) => ({
              _id: client._id,
              nombre: client.nombre,
              email: client.email,
              telefono: client.telefono,
              estado: client.estado,
              tags: client.tags || [],
              planesDePago: client.planesDePago || [],
              servicios: client.servicios || [],
              ultimoCheckin:
                client.eventos && client.eventos.length > 0
                  ? client.eventos.find((e: any) => e.tipo === 'checkin')?.fecha
                  : '',
              alertas: client.notas ? client.notas.filter((n: any) => n.esAlerta) : [],
              fechaRegistro: client.fechaRegistro,
            }))
          : [];

        setClientesData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);
  
  // Efecto para recargar clientes cuando cambia el contexto
  useEffect(() => {
    const reloadClientsAfterCreation = async () => {
      if (contextClients.length > 0) {
        console.log('ClientList: Detectado nuevo cliente, recargando lista completa...');
        
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          const response = await fetch(`${API_URL}/clientes`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          const transformedData = Array.isArray(data)
            ? data.map((client: any) => ({
                _id: client._id,
                nombre: client.nombre,
                email: client.email,
                telefono: client.telefono,
                estado: client.estado,
                tags: client.tags || [],
                planesDePago: client.planesDePago || [],
                servicios: client.servicios || [],
                ultimoCheckin:
                  client.eventos && client.eventos.length > 0
                    ? client.eventos.find((e: any) => e.tipo === 'checkin')?.fecha
                    : '',
                alertas: client.notas ? client.notas.filter((n: any) => n.esAlerta) : [],
                fechaRegistro: client.fechaRegistro,
              }))
            : [];
          
          setClientesData(transformedData);
          setError(null);
          console.log('ClientList: Lista de clientes recargada exitosamente');
        } catch (err) {
          console.error('Error reloading clients after creation:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    reloadClientsAfterCreation();
  }, [contextClients.length]);


  // ⬇ 2) Efecto para obtener servicios (sin cambios)
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const serviceIds = new Set<string>();
        clientesData.forEach((client) => {
          if (client.servicios && Array.isArray(client.servicios)) {
            client.servicios.forEach((servicio) => {
              if (typeof servicio === 'string') {
                serviceIds.add(servicio);
              }
            });
          }
        });

        const serviciosMap: { [key: string]: string } = {};

        await Promise.all(
          Array.from(serviceIds).map(async (serviceId) => {
            const response = await fetch(`${API_URL}/servicios/services/${serviceId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const serviceData = await response.json();
              serviciosMap[serviceId] = serviceData.nombre;
            }
          })
        );

        setServiciosData(serviciosMap);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    if (clientesData.length > 0) {
      fetchServicios();
    }
  }, [clientesData]);

  // ⬇ 3) Efecto para obtener planes de pago (sin cambios)
  useEffect(() => {
    const fetchPlanesDePago = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const planIds = new Set<string>();
        clientesData.forEach((client) => {
          if (client.planesDePago && Array.isArray(client.planesDePago)) {
            client.planesDePago.forEach((plan) => {
              if (typeof plan === 'string') {
                planIds.add(plan);
              }
            });
          }
        });

        const planesMap: { [key: string]: string } = {};

        await Promise.all(
          Array.from(planIds).map(async (planId) => {
            const response = await fetch(`${API_URL}/payment-plans/${planId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const planData = await response.json();
              planesMap[planId] = planData.nombre;
            }
          })
        );

        setPlanesDePagoData(planesMap);
      } catch (err) {
        console.error('Error fetching payment plans:', err);
      }
    };

    if (clientesData.length > 0) {
      fetchPlanesDePago();
    }
  }, [clientesData]);


  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRowClick = (clientId: string) => {
    console.log(` Fila de cliente con ID ${clientId} clickeada.`);
    setOpenPanels((prevOpenPanels) => {
      if (prevOpenPanels.includes(clientId)) {
        return prevOpenPanels.filter((id) => id !== clientId);
      } else {
        return [...prevOpenPanels, clientId];
      }
    });
  };

  const handlePanelClose = (clientId: string) => {
    setOpenPanels((prevOpenPanels) => prevOpenPanels.filter((id) => id !== clientId));
  };

  const toggleClientSelection = (clientId: string, event: React.MouseEvent | null) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
    console.log(
      selectedClients.includes(clientId)
        ? ` Cliente con ID ${clientId} deseleccionado.`
        : ` Cliente con ID ${clientId} seleccionado.`
    );
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === clientesData.length) {
      setSelectedClients([]);
      console.log(' Todos los clientes han sido deseleccionados.');
    } else {
      const allClientIds = clientesData.map((c) => c._id);
      setSelectedClients(allClientIds);
      console.log(' Todos los clientes han sido seleccionados.');
    }
  };

  const filteredClients = clientesData.filter((client) => {
    // Primero verificamos el término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (client.nombre && client.nombre.toLowerCase().includes(searchLower)) ||
        (client.email && client.email.toLowerCase().includes(searchLower)) ||
        (client.telefono && client.telefono.toLowerCase().includes(searchLower)) ||
        (client.estado && client.estado.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Luego aplicamos los filtros del contexto
    if (filters.estado && client.estado !== filters.estado) return false;
    
    // Filtro de tag
    if (filters.tag) {
      if (filters.tag === 'Sin etiqueta') {
        if (client.tags && client.tags.length > 0) return false;
      } else {
        const hasTags = client.tags && Array.isArray(client.tags);
        if (!hasTags || !client.tags.some((tag: any) => 
          tag.name === filters.tag || tag === filters.tag)) return false;
      }
    }
    
    // Filtro de tipo de plan
    if (filters.tipoPlan) {
      const hasPlans = client.planesDePago && Array.isArray(client.planesDePago) && client.planesDePago.length > 0;
      if (!hasPlans) return false;
      
      // Aquí asumimos que tienes acceso a los detalles del plan
      const planId = client.planesDePago[0];
      const planName = planesDePagoData[planId];
      if (!planName || !planName.includes(filters.tipoPlan)) return false;
    }
    
    // Filtro de clase
    if (filters.clase) {
      // Asumimos que la clase está en los servicios
      const hasServicios = client.servicios && Array.isArray(client.servicios) && client.servicios.length > 0;
      if (!hasServicios) return false;
      
      // Verificamos si algún servicio coincide con la clase
      const servicioId = client.servicios[0];
      const servicioName = serviciosData[servicioId];
      if (!servicioName || !servicioName.includes(filters.clase)) return false;
    }
    
    // Filtro de servicio
    if (filters.servicio) {
      const hasServicios = client.servicios && Array.isArray(client.servicios) && client.servicios.length > 0;
      if (!hasServicios) return false;
      
      // Verificamos si algún servicio coincide
      const servicioId = client.servicios[0];
      const servicioName = serviciosData[servicioId];
      if (!servicioName || !servicioName.includes(filters.servicio)) return false;
    }
    
    return true;
  });
    useEffect(() => {
    console.log(` Filtrando clientes con término de búsqueda: "${searchTerm}" y filtros:`, filters);
  }, [searchTerm, filters, clientesData]);

  const renderCell = (key: string, value: any, client: Cliente) => {
    switch (key) {
      case 'nombre':
        return (
          <div className="flex items-center">
            {client.estado === 'Activo' && <CheckCircle size={16} className="mr-2 text-green-500" />}
            {`${client.nombre} `}
          </div>
        );
      case 'tags':
        if (!value || value.length === 0) {
          return (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              Sin etiqueta
            </span>
          );
        }

        const tagsToShow = value.slice(0, 3);
        return (
          <div className="flex flex-wrap gap-1">
            {tagsToShow.map((tag: any) => (
              <span
                key={tag._id}
                className="px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  border: `1px solid ${tag.color}`,
                }}
              >
                {tag.name}
              </span>
            ))}
            {value.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{value.length - 3}
              </span>
            )}
          </div>
        );
      case 'email':
        return value;
      case 'telefono':
        return value || '-';
      case 'estado':
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              value === 'Activo'
                ? 'bg-green-500 text-white'
                : value === 'Pendiente'
                ? 'bg-red-500 text-white'
                : 'bg-gray-500 text-white'
            } flex items-center justify-center`}
          >
            {value}
          </span>
        );
      case 'tag':
        return !value || value === 'Sin etiqueta' ? (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Sin etiqueta
          </span>
        ) : (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {value}
          </span>
        );
      case 'planDePago':
        if (!client.planesDePago || !Array.isArray(client.planesDePago) || client.planesDePago.length === 0) {
          return '-';
        }
        {
          // Get the first payment plan ID
        }
        const planId = client.planesDePago[0];
        return planesDePagoData[planId] || 'Cargando...';
      case 'servicio':
        if (!client.servicios || !Array.isArray(client.servicios) || client.servicios.length === 0) {
          return '-';
        }
        const servicioId = client.servicios[0];
        return serviciosData[servicioId] || 'Cargando...';
      case 'ultimoCheckin':
        return formatDate(client.ultimoCheckin);
      case 'alertas':
        return client.alertas && client.alertas.length > 0 ? (
          <div className="flex items-center text-yellow-500">
            <AlertTriangle size={16} className="mr-1" />
            {client.alertas.length}
          </div>
        ) : (
          '-'
        );
      case 'fechaRegistro':
        return formatDate(value);
      default:
        return value || '-';
    }
  };

  const columns = [
    'Nombre',
    'Email',
    'Teléfono',
    'Estado',
    'Tag',
    'Plan de Pago',
    'Servicio',
    'Último Checkin',
    'Alertas',
    'Fecha Registro',
  ];

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <div className="flex items-center gap-3 mb-2">
          <Users className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Lista de Clientes
          </h2>
        </div>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Gestiona y monitorea a tus clientes
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
              : 'bg-white/50 backdrop-blur-sm border border-gray-200'
          } shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Total Clientes
            </h3>
          </div>
          <p className="text-3xl font-bold text-blue-500">{clientesData.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
              : 'bg-white/50 backdrop-blur-sm border border-gray-200'
          } shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Clientes Activos
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-500">
            {clientesData.filter((client) => client.estado === 'Activo').length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
              : 'bg-white/50 backdrop-blur-sm border border-gray-200'
          } shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle
              className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}
            />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Alertas Activas
            </h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">
            {clientesData.reduce((total, client) => total + (client.alertas?.length || 0), 0)}
          </p>
        </motion.div>
      </div>

      <div className="mb-8">
        <ClientListHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          filters={filters}
          setFilters={setFilters}
          selectedClientsCount={selectedClients.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCreateClient={onCreateClient}
        />
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center p-12"
        >
          <div className="animate-spin">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100/50'
          } border ${theme === 'dark' ? 'border-red-800' : 'border-red-200'} text-center`}
        >
          <p className={`text-lg ${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>{error}</p>
        </motion.div>
      ) : viewMode === 'table' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div
              className={`overflow-hidden rounded-xl ${
                theme === 'dark'
                  ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
                  : 'bg-white/50 backdrop-blur-sm border border-gray-200'
              } shadow-lg`}
            >
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead
                  className={`${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/50'
                  }`}
                >
                  <tr>
                    <th scope="col" className="relative px-6 py-4">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedClients.length === clientesData.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredClients.map((cliente, index) => (
                    <React.Fragment key={cliente._id}>
                      <motion.tr
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => handleRowClick(cliente._id)}
                        className={`cursor-pointer transition-all duration-200 ${
                          theme === 'dark'
                            ? 'hover:bg-gray-700/50'
                            : 'hover:bg-blue-50/50'
                        } ${
                          selectedClients.includes(cliente._id)
                            ? theme === 'dark'
                              ? 'bg-gray-700/30'
                              : 'bg-blue-50/70'
                            : ''
                        }`}
                      >
                        <td className="relative px-6 py-4">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedClients.includes(cliente._id)}
                            onChange={(e) => toggleClientSelection(cliente._id, e)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        {Object.entries({
                          nombre: cliente.nombre,
                          email: cliente.email,
                          telefono: cliente.telefono,
                          estado: cliente.estado,
                          tags: cliente.tags,
                          planDePago:
                            cliente.planesDePago && cliente.planesDePago.length > 0
                              ? cliente.planesDePago[0]?.nombre
                              : null,
                          servicio:
                            cliente.servicios && cliente.servicios.length > 0
                              ? cliente.servicios[0]?.nombre
                              : null,
                          ultimoCheckin: cliente.ultimoCheckin,
                          alertas: cliente.alertas,
                          fechaRegistro: cliente.fechaRegistro,
                        }).map(([key, value]) => (
                          <td
                            key={key}
                            className={`px-6 py-4 whitespace-nowrap ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            } ${key === 'nombre' ? 'font-medium' : 'text-sm'}`}
                          >
                            {renderCell(key, value, cliente)}
                          </td>
                        ))}
                      </motion.tr>
                      <AnimatePresence mode="wait">
                        {openPanels.includes(cliente._id) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${
                              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                            }`}
                          >
                            <td colSpan={columns.length + 1} className="p-0">
                              <div
                                className={`border-t ${
                                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}
                              >
                                <PanelCliente
                                  clienteId={cliente._id}
                                  onClose={() => handlePanelClose(cliente._id)}
                                />
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ClientListViewSimple
            clientes={filteredClients}
            selectedClients={selectedClients}
            toggleClientSelection={toggleClientSelection}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ClientList;