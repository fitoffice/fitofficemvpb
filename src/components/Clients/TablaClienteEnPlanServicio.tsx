import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TablaClienteEnPlanServicioProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  isDarkMode: boolean;
}

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  estado: string;
  planningActivo?: {
    _id: string;
    nombre: string;
    fechaInicio: string;
  };
  dietaActiva?: {
    _id: string;
    nombre: string;
    fechaInicio: string;
  };
}

const TablaClienteEnPlanServicio: React.FC<TablaClienteEnPlanServicioProps> = ({
  isOpen,
  onClose,
  planId,
  isDarkMode
}) => {
  console.log('TablaClienteEnPlanServicio - Props recibidas:', { isOpen, planId, isDarkMode });
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesDetalles, setClientesDetalles] = useState<{ [key: string]: Cliente }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      console.log('TablaClienteEnPlanServicio - Iniciando fetchClientes para planId:', planId);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        console.log('TablaClienteEnPlanServicio - Obteniendo clientes del plan...');
        // Primero obtenemos la lista de clientes del plan
        const responsePlan = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planes-servicio/${planId}/clientes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!responsePlan.ok) {
          console.error('TablaClienteEnPlanServicio - Error en la respuesta del plan:', responsePlan.status);
          throw new Error('Error al cargar los clientes del plan');
        }

        const dataPlan = await responsePlan.json();
        console.log('TablaClienteEnPlanServicio - Datos del plan recibidos:', dataPlan);
        const clientesDelPlan = dataPlan.data || [];
        setClientes(clientesDelPlan);

        console.log('TablaClienteEnPlanServicio - Obteniendo detalles de clientes...');
        // Luego obtenemos los detalles de cada cliente
        const detallesPromises = clientesDelPlan.map(async (cliente: any) => {
          console.log('TablaClienteEnPlanServicio - Solicitando detalles para cliente:', cliente._id);
          const responseCliente = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${cliente._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!responseCliente.ok) {
            console.error(`TablaClienteEnPlanServicio - Error al obtener detalles del cliente ${cliente._id}:`, responseCliente.status);
            return null;
          }

          const clienteDetalle = await responseCliente.json();
          console.log(`TablaClienteEnPlanServicio - Detalles recibidos para cliente ${cliente._id}:`, clienteDetalle);
          return { id: cliente._id, data: clienteDetalle };
        });

        const detallesResults = await Promise.all(detallesPromises);
        console.log('TablaClienteEnPlanServicio - Todos los detalles de clientes recibidos:', detallesResults);
        
        const detallesMap = detallesResults.reduce((acc, result) => {
          if (result) {
            acc[result.id] = result.data;
          }
          return acc;
        }, {});

        console.log('TablaClienteEnPlanServicio - Mapa de detalles de clientes:', detallesMap);
        setClientesDetalles(detallesMap);
        setLoading(false);
      } catch (err) {
        console.error('TablaClienteEnPlanServicio - Error en fetchClientes:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    if (isOpen) {
      console.log('TablaClienteEnPlanServicio - Componente abierto, iniciando fetch...');
      fetchClientes();
    }
  }, [planId, isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  console.log('TablaClienteEnPlanServicio - Estado actual:', {
    loading,
    error,
    clientesCount: clientes.length,
    detallesCount: Object.keys(clientesDetalles).length
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`w-full max-w-4xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Clientes en el Plan
              </h2>
              <button
                onClick={onClose}
                className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Nombre</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Email</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Plan Activo</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Fecha Inicio</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Estado</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {clientes.map((cliente) => {
                      const detallesCliente = clientesDetalles[cliente._id];
                      return (
                        <tr key={cliente._id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {detallesCliente?.nombre || 'Cargando...'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {detallesCliente?.email || 'Cargando...'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {detallesCliente?.planningActivo?.nombre || 'Sin plan activo'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {detallesCliente?.planningActivo?.fechaInicio 
                              ? formatDate(detallesCliente.planningActivo.fechaInicio)
                              : 'N/A'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${detallesCliente?.estado === 'Activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'}`}>
                              {detallesCliente?.estado || 'Desconocido'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TablaClienteEnPlanServicio;
