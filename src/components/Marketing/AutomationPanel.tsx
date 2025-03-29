import React, { useState, useEffect } from 'react';
import { Settings, Mail, User, Calendar, Bell } from 'lucide-react';
import { BirthdayPanel } from './BirthdayPanel';
import { WelcomePanel } from './WelcomePanel';
import { TipsPanel } from './TipsPanel';
import { ReactivationPanel } from './ReactivationPanel';
import { RemindersPanel } from './RemindersPanel';
import { clientService, Cliente } from '../../services/clientService';

interface Props {
  automationType: string;
  onClose: () => void;
}

export function AutomationPanel({ automationType, onClose }: Props) {
  const [isSelectable, setIsSelectable] = useState(false);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await clientService.getClients();
        setClients(clientsData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los clientes');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Renderizar el panel específico según el tipo
  if (automationType === 'cumpleanos_aniversarios') {
    return <BirthdayPanel onClose={onClose} />;
  }
  
  if (automationType === 'bienvenida_nuevos_clientes') {
    return <WelcomePanel onClose={onClose} />;
  }

  if (automationType === 'consejos_periodicos') {
    return <TipsPanel onClose={onClose} />;
  }

  if (automationType === 'recuperacion_inactivos') {
    return <ReactivationPanel onClose={onClose} />;
  }

  if (automationType === 'recordatorios') {
    return <RemindersPanel onClose={onClose} />;
  }

  const getAutomationIcon = () => {
    switch (automationType) {
      case 'bienvenida_nuevos_clientes':
        return <User className="h-6 w-6 text-amber-500" />;
      case 'cumpleanos_aniversarios':
        return <Calendar className="h-6 w-6 text-amber-500" />;
      case 'recuperacion_clientes_inactivos':
        return <Settings className="h-6 w-6 text-amber-500" />;
      case 'consejos_periodicos':
        return <Mail className="h-6 w-6 text-amber-500" />;
      case 'recordatorios':
        return <Bell className="h-6 w-6 text-blue-500" />;
      default:
        return <Settings className="h-6 w-6 text-amber-500" />;
    }
  };

  const getAutomationTitle = () => {
    switch (automationType) {
      case 'bienvenida_nuevos_clientes':
        return 'Bienvenida a Nuevos Clientes';
      case 'cumpleanos_aniversarios':
        return 'Cumpleaños y Aniversarios';
      case 'recuperacion_clientes_inactivos':
        return 'Recuperación de Clientes Inactivos';
      case 'consejos_periodicos':
        return 'Consejos Periódicos';
      case 'recordatorios':
        return 'Recordatorios Automáticos';
      default:
        return 'Automatización';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getAutomationIcon()}
            <h2 className="text-xl font-semibold text-gray-900">
              {getAutomationTitle()}
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

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Configuración</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Lista de Correos
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className={`text-sm ${!isSelectable ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>Manual</span>
                      <label className="relative inline-flex items-center cursor-pointer mx-3">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isSelectable}
                          onChange={(e) => setIsSelectable(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                      <span className={`text-sm ${isSelectable ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>Seleccionar</span>
                    </div>
                  </div>
                </div>

                {/* Manual Input */}
                {!isSelectable && (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={4}
                    placeholder="Ingresa los correos electrónicos separados por comas"
                  />
                )}
                
                {/* Selectable List */}
                {isSelectable && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Cargando clientes...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-4 text-red-500">
                        {error}
                      </div>
                    ) : clients.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No hay clientes disponibles
                      </div>
                    ) : (
                      clients.map((client) => (
                        <div key={client._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            id={`client-${client._id}`}
                            className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                          />
                          <label htmlFor={`client-${client._id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium text-gray-900">{`${client.nombre} ${client.apellido}`}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </label>
                          <div className="text-sm text-gray-500">
                            Último acceso: {new Date(client.ultimoCheckin).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {/* Subject Section */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto del Correo
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ingresa el asunto del correo"
                />
              </div>

              {/* Message Section */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Escribe el mensaje del correo..."
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {message.length} caracteres
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                  <span>Variables disponibles:</span>
                  <button 
                    onClick={() => setMessage(message + '{{nombre}}')}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    {'{{nombre}}'}
                  </button>
                  <button 
                    onClick={() => setMessage(message + '{{apellido}}')}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    {'{{apellido}}'}
                  </button>
                  <button 
                    onClick={() => setMessage(message + '{{email}}')}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    {'{{email}}'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia de Envío
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-amber-600">0</div>
                <div className="text-sm text-gray-500">Enviados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-amber-600">0</div>
                <div className="text-sm text-gray-500">Abiertos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-amber-600">0</div>
                <div className="text-sm text-gray-500">Clicks</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
