import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Clock, Mail } from 'lucide-react';
import { clientService, Cliente as ClienteType } from '../../services/clientService';

interface Props {
  onClose: () => void;
}

// Update Cliente interface to match the service
interface Cliente {
  id: string;
  nombre: string;
  fechaNacimiento?: string; // Make it optional as it might not exist in all clients
  email: string;
}

export function BirthdayPanel({ onClose }: Props) {
  const [selectedClients, setSelectedClients] = useState<Cliente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [emailConfig, setEmailConfig] = useState({
    asunto: '¡Feliz Cumpleaños! 🎉',
    mensaje: '',
    horaEnvio: '09:00',
    diasAntes: '0'
  });

  // Remove the hardcoded clientes array and keep the useEffect that fetches real data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const clientsData = await clientService.getClients();
        
        // Transform the data to match our interface
        const transformedClients: Cliente[] = clientsData.map(client => ({
          id: client._id,
          nombre: `${client.nombre} ${client.apellido}`,
          email: client.email,
          fechaNacimiento: client.fechaRegistro // You might want to add a proper birthDate field in your API
        }));

        setClientes(transformedClients);
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error('Error fetching clients:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      const data = {
        tipo: 'cumpleanos_aniversarios',
        configuracion: {
          clientes: selectedClients.map(c => ({
            id: c.id,
            email: c.email,
            fechaNacimiento: c.fechaNacimiento
          })),
          email: {
            asunto: emailConfig.asunto,
            mensaje: emailConfig.mensaje,
            horaEnvio: emailConfig.horaEnvio,
            diasAntes: parseInt(emailConfig.diasAntes)
          }
        }
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations/birthday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la configuración');
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Automatización de Cumpleaños y Aniversarios
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-500" />
                Configuración del Email
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto del Email
                  </label>
                  <input
                    type="text"
                    value={emailConfig.asunto}
                    onChange={(e) => setEmailConfig({...emailConfig, asunto: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej: ¡Feliz Cumpleaños! 🎉"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={emailConfig.mensaje}
                    onChange={(e) => setEmailConfig({...emailConfig, mensaje: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Escribe aquí tu mensaje personalizado..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Configuración de Tiempo
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Envío
                  </label>
                  <input
                    type="time"
                    value={emailConfig.horaEnvio}
                    onChange={(e) => setEmailConfig({...emailConfig, horaEnvio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Anticipación
                  </label>
                  <select
                    value={emailConfig.diasAntes}
                    onChange={(e) => setEmailConfig({...emailConfig, diasAntes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="0">El mismo día</option>
                    <option value="1">1 día antes</option>
                    <option value="2">2 días antes</option>
                    <option value="3">3 días antes</option>
                    <option value="7">1 semana antes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-500" />
              Lista de Clientes
            </h3>
            <div className="space-y-4">
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <p className="text-gray-600">Cargando clientes...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : clientes.length === 0 ? (
                  <p className="text-gray-600">No hay clientes disponibles</p>
                ) : (
                  clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClients.some(c => c.id === cliente.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedClients([...selectedClients, cliente]);
                          } else {
                            setSelectedClients(selectedClients.filter(c => c.id !== cliente.id));
                          }
                        }}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cliente.nombre}</p>
                        <p className="text-sm text-gray-500">{cliente.email}</p>
                        {cliente.fechaNacimiento && (
                          <p className="text-xs text-gray-400">
                            Cumpleaños: {new Date(cliente.fechaNacimiento).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {selectedClients.length} clientes seleccionados
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
