import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit, Trash, X } from 'lucide-react';
import TablaClientes from './TablaClientes';
import TablaClienteEnPlanServicio from './TablaClienteEnPlanServicio';
import Portal from '../Common/Portal';
import type { PlanPago } from '../types/servicios';

interface Props {
  planes: any[];
  isDarkMode: boolean;
  servicioId: string;
  onAsociarPlanClienteClick: (paymentPlanId: string) => void;
  onDeletePlan?: (planId: string) => void;
  serviciosAdicionales?: string[]; // Add this new prop

}

const TablaPlanesServicio: React.FC<Props> = ({ 
  planes, 
  isDarkMode, 
  servicioId,
  onAsociarPlanClienteClick,
  onDeletePlan ,
  serviciosAdicionales = [] // Default to empty array

}) => {
  // Add this check at the beginning
  const planesArray = Array.isArray(planes) ? planes : [];

  // Add a more detailed log of the planes data
  console.log('AAAAATablaPlanesServicio - Servicios adicionales recibidos:', serviciosAdicionales);

  console.log('TablaPlanesServicio - Datos brutos de planes:', JSON.stringify(planes, null, 2));
  
  // Remove the old check and logging since we're handling it above
  console.log('TablaPlanesServicio - Planes procesados:', planesArray);
  console.log('TablaPlanesServicio - ID del servicio:', servicioId);
  console.log('TablaPlanesServicio - Tipo de planes:', typeof planes);
  console.log('TablaPlanesServicio - ¿Es array?:', Array.isArray(planes));

  // Si planes es un string (ID), mostrar mensaje apropiado
  if (typeof planes === 'string') {
    console.log('TablaPlanesServicio - planes es un ID:', planes);
    return (
      <div className="mt-4">
        <p className="text-center py-4">
          Cargando detalles del plan...
        </p>
      </div>
    );
  }


  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [clientesExpandidos, setClientesExpandidos] = useState<string | null>(null);
  const [planEditando, setPlanEditando] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showClientesPopup, setShowClientesPopup] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [clientesDetalles, setClientesDetalles] = useState<{ [key: string]: any }>({});
  const [loadingClientes, setLoadingClientes] = useState<{ [key: string]: boolean }>({});
  const [clientesError, setClientesError] = useState<{ [key: string]: string | null }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    nombre: string;
    precio: number;
    moneda: string;
    detalles: string;
  }>({
    nombre: '',
    precio: 0,
    moneda: '',
    detalles: ''
  });

  const fetchClienteDetalles = async (clienteId: string, planId: string) => {
    console.log(`TablaPlanesServicio - Iniciando fetchClienteDetalles para cliente ${clienteId} en plan ${planId}`);
    
    // Log the state before updating
    console.log(`TablaPlanesServicio - Estado de loadingClientes antes de actualizar:`, {...loadingClientes});
    
    setLoadingClientes(prev => {
      const newState = { ...prev, [clienteId]: true };
      console.log(`TablaPlanesServicio - Nuevo estado de loadingClientes:`, newState);
      return newState;
    });
    
    setClientesError(prev => ({ ...prev, [clienteId]: null }));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log(`TablaPlanesServicio - Realizando petición para cliente ${clienteId}`);
      console.log(`TablaPlanesServicio - URL de la petición: https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${clienteId}`);
      console.log(`TablaPlanesServicio - Token utilizado: ${token.substring(0, 10)}...`);
      
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${clienteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(`TablaPlanesServicio - Respuesta HTTP para cliente ${clienteId}:`, response.status, response.statusText);
      
      if (!response.ok) {
        console.error(`TablaPlanesServicio - Error en la respuesta del cliente ${clienteId}:`, response.status);
        throw new Error(`Error al obtener detalles del cliente: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`TablaPlanesServicio - Detalles recibidos para cliente ${clienteId}:`, data);
      console.log(`TablaPlanesServicio - Estructura completa del cliente:`, JSON.stringify(data, null, 2));
      
      setClientesDetalles(prev => {
        const newState = {
          ...prev,
          [clienteId]: data
        };
        console.log(`TablaPlanesServicio - Nuevo estado de clientesDetalles después de recibir datos:`, newState);
        return newState;
      });
    } catch (err) {
      console.error(`TablaPlanesServicio - Error al obtener detalles del cliente ${clienteId}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error(`TablaPlanesServicio - Mensaje de error para cliente ${clienteId}:`, errorMessage);
      
      setClientesError(prev => ({
        ...prev,
        [clienteId]: errorMessage
      }));
    } finally {
      console.log(`TablaPlanesServicio - Finalizando petición para cliente ${clienteId}`);
      setLoadingClientes(prev => {
        const newState = { ...prev, [clienteId]: false };
        console.log(`TablaPlanesServicio - Estado final de loadingClientes para ${clienteId}:`, newState);
        return newState;
      });
    }
  };
  const fetchPaymentPlanDetails = async (planId: string) => {
    console.log(`🔍 Fetching payment plan details for ID: ${planId}`);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      console.log(`TablaPlanesServicio - Realizando petición para plan ${planId}`);
      console.log(`TablaPlanesServicio - URL de la petición: https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/paymentplans/${planId}`);
      
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/paymentplans/${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`TablaPlanesServicio - Respuesta HTTP para plan ${planId}:`, response.status, response.statusText);
      
      if (!response.ok) {
        console.error(`TablaPlanesServicio - Error en la respuesta del plan ${planId}:`, response.status);
        throw new Error(`Error al obtener detalles del plan: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`TablaPlanesServicio - Detalles recibidos para plan ${planId}:`, data);
      console.log(`TablaPlanesServicio - Estructura completa del plan:`, JSON.stringify(data, null, 2));
      
      return data;
    } catch (err) {
      console.error(`TablaPlanesServicio - Error al obtener detalles del plan ${planId}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error(`TablaPlanesServicio - Mensaje de error para plan ${planId}:`, errorMessage);
      throw err;
    }
  };

  const toggleExpand = (planId: string) => {
    console.log('TablaPlanesServicio - toggleExpand called for planId:', planId);
    console.log(`🔍 Plan ID: ${planId}`);
    
    // Call the new function to fetch plan details
    fetchPaymentPlanDetails(planId).catch(err => {
      console.error('Error fetching payment plan details:', err);
    });

    // If we're expanding a plan, fetch client details for all clients in that plan
    if (expandedPlanId !== planId) {
      const plan = planesArray.find(p => p._id === planId);
      console.log('TablaPlanesServicio - Plan being expanded:', plan);
      console.log('TablaPlanesServicio - Plan structure:', JSON.stringify(plan, null, 2));
      
      if (plan && plan.clientes && Array.isArray(plan.clientes)) {
        console.log('TablaPlanesServicio - Clients in plan:', plan.clientes);
        console.log('TablaPlanesServicio - Número de clientes en el plan:', plan.clientes.length);
        
        // Fetch details for each client in the plan
        plan.clientes.forEach(clienteId => {
          console.log('TablaPlanesServicio - Procesando cliente ID:', clienteId);
          console.log('TablaPlanesServicio - ¿Cliente ya cargado?:', !!clientesDetalles[clienteId]);
          console.log('TablaPlanesServicio - ¿Cliente en carga?:', !!loadingClientes[clienteId]);
          
          if (!clientesDetalles[clienteId] && !loadingClientes[clienteId]) {
            console.log('TablaPlanesServicio - Fetching details for client:', clienteId);
            fetchClienteDetalles(clienteId, planId);
          } else {
            console.log('TablaPlanesServicio - Client details already loaded or loading:', clienteId);
          }
        });
      } else {
        console.log('TablaPlanesServicio - No clients found in plan or invalid plan structure');
        console.log('TablaPlanesServicio - Plan tiene clientes?:', !!plan?.clientes);
        console.log('TablaPlanesServicio - Clientes es array?:', Array.isArray(plan?.clientes));
      }
    }
    
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleEditClick = (plan: any) => {
    setPlanEditando(plan);
    setFormData({
      nombre: plan.nombre,
      precio: plan.precio,
      moneda: plan.moneda,
      detalles: plan.detalles || '',
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPlanEditando(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica para actualizar el plan de pago
    console.log('Actualizando plan de pago:', planEditando?._id, formData);
    setIsModalOpen(false);
    setPlanEditando(null);
    // Actualizar el estado local o volver a obtener los datos
  };

  const handleAsociarClick = (planId: string) => {
    console.log('TablaPlanesServicio - Asociar cliente al plan:', planId);
    console.log('TablaPlanesServicio - Servicios adicionales a pasar:', serviciosAdicionales);
    if (!planId) {
      console.error('TablaPlanesServicio - Error: planId is undefined or empty');
      return;
    }
    onAsociarPlanClienteClick(planId, serviciosAdicionales);
  };
  

  const handleDeleteClick = async (planId: string) => {
    setPlanToDelete(planId);
    setIsDeleteModalOpen(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!planToDelete || !onDeletePlan) return;
    
    try {
      await onDeletePlan(planToDelete);
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
      setDeleteError(null);
    } catch (error) {
      console.error('Error al eliminar el plan:', error);
      setDeleteError('No se pudo eliminar el plan. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div>
      <div className="mt-4 p-6 rounded-xl shadow-lg bg-opacity-60 backdrop-blur-md transition-all duration-300 hover:shadow-xl">
        <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
          Planes de Pago ({planesArray.length})
        </h3>
        <div className="overflow-hidden rounded-xl border border-opacity-50 transition-all duration-300 hover:border-opacity-100">
          <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-200' : 'divide-gray-200'}`}>
            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase transition-colors duration-300`}>
                  Nombre
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase transition-colors duration-300`}>
                  Precio
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase transition-colors duration-300`}>
                  Moneda
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase transition-colors duration-300`}>
                  Frecuencia
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase transition-colors duration-300`}>
                  Detalles
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase transition-colors duration-300`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-200' : 'divide-gray-200'}`}>
              {planesArray && planesArray.length > 0 ? (
                planesArray.map((plan, index) => (
                  <React.Fragment key={plan._id || index}>
                    <tr 
                      key={plan._id} 
                      className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors duration-200`}
                    >
                      <td className={`px-8 py-5 text-sm font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleExpand(plan._id)}
                            className="mr-2 focus:outline-none"
                          >
                            <AnimatePresence initial={false} mode="wait">
                              {expandedPlanId === plan._id ? (
                                <motion.div
                                  key="chevron-up"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="chevron-down"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                          {plan.nombre}
                        </div>
                      </td>
                      <td className={`px-8 py-5 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        <span className="font-semibold">{plan.precio}</span>
                      </td>
                      <td className={`px-8 py-5 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {plan.moneda}
                      </td>
                      <td className={`px-8 py-5 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          isDarkMode 
                            ? 'bg-blue-900/80 text-blue-200' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {plan.frecuencia}
                        </span>
                      </td>
                      <td className={`px-8 py-5 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {plan.detalles}
                      </td>
                      <td className="px-8 py-5 text-sm whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleEditClick(plan)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              isDarkMode
                                ? 'hover:bg-gray-700/80 text-blue-400 hover:text-blue-300 hover:shadow-md hover:shadow-gray-900/20'
                                : 'hover:bg-gray-100 text-blue-600 hover:text-blue-500 hover:shadow-md hover:shadow-gray-200/50'
                            }`}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAsociarClick(plan._id)}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                              isDarkMode
                                ? 'bg-blue-900/80 hover:bg-blue-800/80 text-blue-200 hover:shadow-md hover:shadow-blue-900/20'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-900 hover:shadow-md hover:shadow-blue-200/50'
                            }`}
                          >
                            Asociar Clientes
                          </button>
                          <button
                            onClick={() => toggleExpand(plan._id || index)}
                            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-blue-900/90 hover:bg-blue-800 text-blue-100 hover:shadow-md hover:shadow-blue-900/20'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-900 hover:shadow-md hover:shadow-blue-200/50'
                            }`}
                          >
                            Ver Clientes
                          </button>
                          <button
                            onClick={() => handleDeleteClick(plan._id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              isDarkMode
                                ? 'hover:bg-gray-700/80 text-red-400 hover:text-red-300 hover:shadow-md hover:shadow-gray-900/20'
                                : 'hover:bg-gray-100 text-red-600 hover:text-red-500 hover:shadow-md hover:shadow-gray-200/50'
                            }`}
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Tabla expandible de clientes */}
                    {expandedPlanId === (plan._id || index) && (
                      <tr>
                        <td colSpan={6}>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`p-6 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'}`}
                          >
                            <div className="overflow-hidden rounded-lg border border-opacity-50">
                              <table className={`min-w-full divide-y ${
                                isDarkMode ? 'divide-gray-700 bg-gray-800/95' : 'divide-gray-200 bg-white'
                              }`}>
                                <thead className={isDarkMode ? 'bg-gray-900/95' : 'bg-gray-100'}>
                                  <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Cliente
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Email
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Teléfono
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Fecha Inicio
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Estado
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className={`divide-y ${
                                  isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                                }`}>
                                  {plan.clientes && plan.clientes.length > 0 ? (
                                    plan.clientes.map((clienteId) => {
                                      console.log(`TablaPlanesServicio - Rendering client ${clienteId}, details:`, clientesDetalles[clienteId]);
                                      console.log(`TablaPlanesServicio - Loading state for client ${clienteId}:`, loadingClientes[clienteId]);
                                      
                                      const clienteDetalle = clientesDetalles[clienteId];
                                      const isLoading = loadingClientes[clienteId];
                                      const error = clientesError[clienteId];
                                      if (error) {
                                        return (
                                          <tr key={clienteId} className={`${
                                            isDarkMode
                                              ? 'bg-red-900/20'
                                              : 'bg-red-50'
                                          }`}>
                                            <td colSpan={5} className="px-6 py-4 text-sm text-red-500">
                                              Error al cargar cliente: {error}
                                            </td>
                                          </tr>
                                        );
                                      }

                                      if (isLoading) {
                                        return (
                                          <tr key={clienteId} className={`${
                                            isDarkMode
                                              ? 'bg-gray-800/95'
                                              : 'bg-white'
                                          }`}>
                                            <td colSpan={5} className="px-6 py-4">
                                              <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                                <span className="ml-2">Cargando detalles del cliente...</span>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }

                                      return (
                                        <tr key={clienteId} className={`${
                                          isDarkMode
                                            ? 'hover:bg-gray-700/80 bg-gray-800/95'
                                            : 'hover:bg-blue-50/90 bg-white'
                                          } transition-all duration-200 ease-in-out`}>
                                          <td className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.nombre || 'Nombre no disponible'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.email || 'Email no disponible'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.telefono || 'Teléfono no disponible'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.planningActivo?.fechaInicio 
                                              ? formatDate(clienteDetalle.planningActivo.fechaInicio)
                                              : 'N/A'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap`}>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                              ${clienteDetalle?.estado === 'Activo'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'}`}>
                                              {clienteDetalle?.estado || 'Estado desconocido'}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan={5} className="px-6 py-4 text-sm text-center">
                                        No hay clientes disponibles
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-5 text-center text-sm text-gray-500">
                    No hay planes de pago disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && planEditando && (
        <Portal>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999]"
              onClick={handleModalClose}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className={`relative p-8 rounded-2xl shadow-2xl ${
                  isDarkMode 
                    ? 'bg-gray-800/95 border border-gray-700/50' 
                    : 'bg-white/95 border border-gray-200/50'
                } max-w-2xl w-full mx-4 backdrop-blur-xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleModalClose}
                  className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-200 ${
                    isDarkMode
                      ? 'hover:bg-gray-700/80 text-gray-400 hover:text-gray-300 hover:shadow-lg hover:shadow-black/20'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800 hover:shadow-lg hover:shadow-gray-200/50'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className={`text-2xl font-bold mb-6 ${
                  isDarkMode 
                    ? 'text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent' 
                    : 'text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                }`}>
                  Editar Plan de Pago
                </h3>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-700/80 border-gray-600 text-gray-200 focus:border-blue-500'
                          : 'bg-white/80 border-gray-300 text-gray-900 focus:border-blue-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Precio
                    </label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-700/80 border-gray-600 text-gray-200 focus:border-blue-500'
                          : 'bg-white/80 border-gray-300 text-gray-900 focus:border-blue-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Moneda
                    </label>
                    <input
                      type="text"
                      name="moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-700/80 border-gray-600 text-gray-200 focus:border-blue-500'
                          : 'bg-white/80 border-gray-300 text-gray-900 focus:border-blue-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Detalles
                    </label>
                    <textarea
                      name="detalles"
                      value={formData.detalles}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-700/80 border-gray-600 text-gray-200 focus:border-blue-500'
                          : 'bg-white/80 border-gray-300 text-gray-900 focus:border-blue-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow-lg hover:shadow-black/20'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow-lg hover:shadow-gray-200/50'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/20'
                      }`}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Portal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Portal>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999]"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className={`relative p-8 rounded-2xl shadow-2xl ${
                  isDarkMode 
                    ? 'bg-gray-800/95 border border-gray-700/50' 
                    : 'bg-white/95 border border-gray-200/50'
                } max-w-md w-full mx-4 backdrop-blur-xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Confirmar Eliminación
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ¿Está seguro de que desea eliminar este plan de pago? Esta acción no se puede deshacer.
                </p>

                {deleteError && (
                  <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    {deleteError}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-3 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Portal>
      )}
    </div>
  );
};

export default TablaPlanesServicio;