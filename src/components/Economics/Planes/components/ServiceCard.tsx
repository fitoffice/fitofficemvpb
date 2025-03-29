import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, DollarSign, Users } from 'lucide-react';
import Table from '../../../Common/Table';
import { Cliente, PlanDePago } from '../types';
import axios from 'axios';

interface FinancialMetricProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  theme: 'dark' | 'light';
}

const FinancialMetric: React.FC<FinancialMetricProps> = ({ label, value, icon, trend, theme }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -3 }}
    className={`flex items-center gap-4 p-6 rounded-2xl ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-700/80 backdrop-blur-sm'
        : 'bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 backdrop-blur-sm'
    } shadow-xl border ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-100/70'}`}
  >
    <div
      className={`p-4 rounded-xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 border border-violet-700/20'
          : 'bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200/50'
      } shadow-inner`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  </motion.div>
);

interface ServiceCardProps {
  planDePago: PlanDePago;
  expandedPlan: string | null;
  onToggleExpand: (planId: string) => void;
  theme: 'dark' | 'light';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  planDePago,
  expandedPlan,
  onToggleExpand,
  theme,
}) => {
  const clientesActivos = planDePago.clientes?.filter(cliente => cliente.estado === 'Activo').length || 0;
  const [clientesData, setClientesData] = useState<any[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [error, setError] = useState('');

  // Función para obtener los datos de los clientes
  const fetchClientesData = async () => {
    if (expandedPlan !== planDePago._id || !planDePago.clientes || planDePago.clientes.length === 0) {
      return;
    }

    setLoadingClientes(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      // Assuming clientes array contains the client IDs directly
      const clientesPromises = planDePago.clientes.map(async (clienteId) => {
        try {
          console.log('Fetching data for client:', clienteId); // Debug log
          const response = await axios.get(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${clienteId}/datos-basicos`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          return {
            _id: clienteId,
            datosCompletos: response.data
          };
        } catch (err) {
          console.error(`Error fetching data for client ${clienteId}:`, err);
          return {
            _id: clienteId,
            error: true
          };
        }
      });

      const clientesDataResult = await Promise.all(clientesPromises);
      console.log('Clientes data result:', clientesDataResult); // Debug log
      setClientesData(clientesDataResult);
    } catch (err) {
      console.error('Error fetching client data:', err);
      setError('Error al cargar los datos de los clientes');
    } finally {
      setLoadingClientes(false);
    }
  };

  // Efecto para cargar los datos de los clientes cuando se expande el plan
  useEffect(() => {
    if (expandedPlan === planDePago._id) {
      fetchClientesData();
    }
  }, [expandedPlan, planDePago._id]);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`rounded-3xl border backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 border-gray-700/50'
          : 'bg-gradient-to-br from-white/90 via-gray-50/90 to-white/90 border-gray-200/50'
      } shadow-2xl hover:shadow-3xl transition-all duration-300`}
    >
      <div className="p-8">
        {/* Status indicator */}
        <div className="flex justify-end mb-2">
          <div className={`px-4 py-1.5 rounded-full text-xs font-medium ${
            planDePago.activo
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-300 border border-green-700/30'
                : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
              : theme === 'dark'
                ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 text-red-300 border border-red-700/30'
                : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
          } flex items-center gap-2`}>
            <span className={`w-2 h-2 rounded-full ${
              planDePago.activo
                ? theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
                : theme === 'dark' ? 'bg-red-400' : 'bg-red-500'
            }`}></span>
            {planDePago.activo ? 'Activo' : 'Inactivo'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <h5 className={`font-bold text-2xl mb-3 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600'
            } bg-clip-text text-transparent`}>{planDePago.nombre}</h5>
            <div className={`p-4 rounded-xl mb-4 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-gray-50/50 border border-gray-200/50'
            } backdrop-blur-sm`}>
              <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {planDePago.detalles}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${
                theme === 'dark'
                  ? 'bg-gray-800/30 border border-gray-700/30'
                  : 'bg-gray-50/30 border border-gray-200/30'
              } backdrop-blur-sm hover:shadow-md transition-all duration-300`}>
                <p className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-violet-400' : 'text-violet-600'
                }`}>
                  Frecuencia
                </p>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {planDePago.frecuencia}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                theme === 'dark'
                  ? 'bg-gray-800/30 border border-gray-700/30'
                  : 'bg-gray-50/30 border border-gray-200/30'
              } backdrop-blur-sm hover:shadow-md transition-all duration-300`}>
                <p className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  Duración
                </p>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {planDePago.duracion} {planDePago.frecuencia === 'Mensual' ? 'meses' : 
                    planDePago.frecuencia === 'Anual' ? 'años' : 
                    planDePago.frecuencia === 'Semanal' ? 'semanas' : 'periodos'}
                </p>
              </div>
            </div>
          </div>
          <div className={`md:ml-6 p-6 rounded-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-violet-700/30'
              : 'bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200'
          } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
            <p className={`font-bold text-4xl mb-2 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600'
            } bg-clip-text text-transparent`}>
              {planDePago.precio} {planDePago.moneda}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              por {planDePago.frecuencia.toLowerCase()}
            </p>
            <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-700/30' : 'border-gray-200/50'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Creado: {new Date(planDePago.fechaCreacion).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FinancialMetric
            label="Ingresos Totales"
            value={`${planDePago.precio * clientesActivos} ${planDePago.moneda}`}
            icon={<DollarSign className={`w-7 h-7 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-500'}`} />}
            trend="+12%"
            theme={theme}
          />
          <FinancialMetric
            label="Clientes Activos"
            value={clientesActivos}
            icon={<Users className={`w-7 h-7 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />}
            theme={theme}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onToggleExpand(planDePago._id)}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 hover:from-violet-900/40 hover:to-fuchsia-900/40 border border-violet-700/30' 
              : 'bg-gradient-to-r from-violet-50 to-fuchsia-50 hover:from-violet-100 hover:to-fuchsia-100 border border-violet-200/50'
          } shadow-lg`}
        >
          {expandedPlan === planDePago._id ? (
            <>
              <ChevronUp className={`w-5 h-5 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Ocultar Clientes</span>
            </>
          ) : (
            <>
              <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                Ver Clientes ({planDePago.clientes?.length || 0})
              </span>
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {expandedPlan === planDePago._id && planDePago.clientes && planDePago.clientes.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`mt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="pt-8">
                  <Table
                    headers={['Cliente', 'Email', 'Teléfono', 'Inicio', 'Estado', 'Pagos', 'Último Pago']}
                    data={clientesData.map((cliente) => {
                      const datosCliente = cliente.datosCompletos || {};
                      return {
                        key: `cliente-${cliente._id}`,
                        Cliente: datosCliente.nombre || 'N/A',
                        Email: datosCliente.email || 'N/A',
                        Teléfono: datosCliente.telefono || 'N/A',
                        Inicio: datosCliente.fechaInicio ? new Date(datosCliente.fechaInicio).toLocaleDateString() : 'N/A',
                        Estado: (
                          <span
                            key={`estado-${cliente._id}`}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                              datosCliente.estado === 'Activo'
                                ? theme === 'dark'
                                  ? 'bg-gradient-to-r from-green-900 to-emerald-900 text-green-100'
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                : theme === 'dark'
                                ? 'bg-gradient-to-r from-yellow-900 to-orange-900 text-yellow-100'
                                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                            } shadow-lg`}
                          >
                            {datosCliente.estado || 'Pendiente'}
                          </span>
                        ),
                        Pagos: datosCliente.pagosRealizados || '0',
                        'Último Pago': datosCliente.ultimoPago ? new Date(datosCliente.ultimoPago).toLocaleDateString() : 'N/A'
                      };
                    })}
                    variant={theme === 'dark' ? 'dark' : 'white'}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
