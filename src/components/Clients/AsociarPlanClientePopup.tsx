import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paymentPlanId: string;
  isDarkMode: boolean;
  serviciosAdicionales?: string[]; // Add this new prop
}

const AsociarPlanClientePopup: React.FC<Props> = ({ isOpen, onClose, paymentPlanId, isDarkMode,serviciosAdicionales = [] }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<string>('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Nuevos estados para las secciones
  const [nombrePlanificacion, setNombrePlanificacion] = useState<string>('');
  const [objetivo, setObjetivo] = useState<string>('');
  const [nombreDieta, setNombreDieta] = useState<string>('');
  const [objetivoDieta, setObjetivoDieta] = useState<string>('');
  const [nombrePackCitas, setNombrePackCitas] = useState<string>('');
  const [numeroCitas, setNumeroCitas] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      console.log('AsociarPlanClientePopup - Servicios adicionales recibidos:', serviciosAdicionales);
      // Fetch clients when the popup opens
      fetchClientes();
    }
  }, [isOpen, serviciosAdicionales]);

  // Helper function to check if a service is included
  // Helper function to check if a service is included
  const includesServicio = (servicio: string): boolean => {
    return serviciosAdicionales.some(s => {
      const servicioLower = s.toLowerCase();
      const searchLower = servicio.toLowerCase();
      
      // Check for exact match or plural/singular variations
      return servicioLower === searchLower || 
             servicioLower === `${searchLower}s` || 
             `${servicioLower}s` === searchLower;
    });
  };
  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCliente) {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        // Preparar datos solo de las secciones que corresponden a los servicios adicionales
        const datosAdicionales: any = {};
        
        if (includesServicio('Planificacion')) {
          datosAdicionales.planificacion = {
            nombrePlanificacion,
            objetivo
          };
        }
        
        if (includesServicio('Dieta')) {
          datosAdicionales.dieta = {
            nombreDieta,
            objetivoDieta
          };
        }
        
        if (includesServicio('Pack de Citas') || includesServicio('PackCitas')) {
          datosAdicionales.packCitas = {
            nombrePackCitas,
            numeroCitas
          };
        }

        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/paymentplans/${paymentPlanId}/associate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clientId: selectedCliente,
            metodoPago: metodoPago,
            ...datosAdicionales,
            serviciosAdicionales // Incluir los servicios adicionales en la petición
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al asociar el plan al cliente');
        }

        onClose();
      } catch (err: any) {
        setError(err.message);
        console.error('Error al asociar el plan:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4">Asociar Plan a Cliente</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Cliente</label>
              <select
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre} - {cliente.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
                required
              >
                <option value="efectivo">Efectivo</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            {/* Sección de Planificaciones - Condicional */}
            {includesServicio('Planificacion') && (
              <div className={`mb-6 p-5 rounded-lg border-l-4 border-blue-500 shadow-md ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Planificaciones
                </h3>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Nombre de la Planificación</label>
                  <input
                    type="text"
                    value={nombrePlanificacion}
                    onChange={(e) => setNombrePlanificacion(e.target.value)}
                    placeholder="Ej: Plan de entrenamiento personalizado"
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 focus:border-blue-400' 
                        : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-200 transition-all`}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-2 font-medium text-sm">Objetivo</label>
                  <select
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 focus:border-blue-400' 
                        : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-200 transition-all`}
                    required
                  >
                    <option value="">Seleccionar objetivo</option>
                    <option value="perdida_peso">Pérdida de peso</option>
                    <option value="ganancia_muscular">Ganancia muscular</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="rendimiento">Rendimiento deportivo</option>
                    <option value="salud">Mejora de salud</option>
                  </select>
                </div>
              </div>
            )}

            {/* Sección de Dietas - Condicional */}
            {includesServicio('Dieta') && (
              <div className={`mb-6 p-5 rounded-lg border-l-4 border-green-500 shadow-md ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Dietas
                </h3>
                {/* ... existing dieta fields ... */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Nombre de la Dieta</label>
                  <input
                    type="text"
                    value={nombreDieta}
                    onChange={(e) => setNombreDieta(e.target.value)}
                    placeholder="Ej: Dieta equilibrada"
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 focus:border-green-400' 
                        : 'bg-gray-50 border-gray-300 focus:border-green-500'
                    } focus:ring-2 focus:ring-green-200 transition-all`}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-2 font-medium text-sm">Objetivo</label>
                  <select
                    value={objetivoDieta}
                    onChange={(e) => setObjetivoDieta(e.target.value)}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 focus:border-green-400' 
                        : 'bg-gray-50 border-gray-300 focus:border-green-500'
                    } focus:ring-2 focus:ring-green-200 transition-all`}
                    required
                  >
                    <option value="">Seleccionar objetivo</option>
                    <option value="perdida_peso">Pérdida de peso</option>
                    <option value="ganancia_muscular">Ganancia muscular</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="intolerancias">Intolerancias alimentarias</option>
                    <option value="vegana">Dieta vegana</option>
                    <option value="vegetariana">Dieta vegetariana</option>
                  </select>
                </div>
              </div>
            )}

            {/* Sección de Pack de Citas - Condicional */}
            {(includesServicio('Pack de Citas') || includesServicio('PackCitas')) && (
              <div className={`mb-6 p-5 rounded-lg border-l-4 border-purple-500 shadow-md ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Pack de Citas
                </h3>
                {/* ... existing pack citas fields ... */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Nombre del Pack de Citas</label>
                  <input
                    type="text"
                    value={nombrePackCitas}
                    onChange={(e) => setNombrePackCitas(e.target.value)}
                    placeholder="Ej: Pack mensual"
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 focus:border-purple-400' 
                        : 'bg-gray-50 border-gray-300 focus:border-purple-500'
                    } focus:ring-2 focus:ring-purple-200 transition-all`}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-2 font-medium text-sm">Número de Citas</label>
                  <input
                    type="number"
                    min="1"
                    value={numeroCitas}
                    onChange={(e) => setNumeroCitas(parseInt(e.target.value))}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 focus:border-purple-400' 
                        : 'bg-gray-50 border-gray-300 focus:border-purple-500'
                    } focus:ring-2 focus:ring-purple-200 transition-all`}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Asociar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AsociarPlanClientePopup;