import React, { useState, useEffect } from 'react';
import { X, Plus, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

interface Session {
  id: string;
  fecha: string;
  hora: string;
  lugar: string;
}

interface Client {
  id: string;
  nombre: string;
  email: string;
}

interface EditarClasePopup2Props {
  onClose: () => void;
  onEdit: () => void;
  claseId: string;
  initialSessions?: Array<{
    fecha: string;
    hora: string;
    lugar: string;
    _id: string;
  }>;
  initialClients?: Array<{
    _id: string;
    nombre: string;
    apellido?: string;
    email: string;
  }>;
}

const EditarClasePopup2: React.FC<EditarClasePopup2Props> = ({ 
  onClose, 
  onEdit, 
  claseId,
  initialSessions = [], 
  initialClients = []
}) => {  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'sesiones' | 'clientes'>('info');
  const [sessions, setSessions] = useState<Session[]>(
    initialSessions.map(session => ({
      id: session._id,
      fecha: session.fecha,
      hora: session.hora,
      lugar: session.lugar
    }))
  );
  const [clients, setClients] = useState<Client[]>(
    initialClients?.map(client => ({
      id: client._id,
      nombre: client.nombre || '',
      email: client.email || ''
    })) || []
  );  const [availableClients, setAvailableClients] = useState<{_id: string, nombre: string}[]>([]);
  const [newSession, setNewSession] = useState({
    fecha: '',
    hora: '',
    lugar: ''
  });
  const fetchAvailableClients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/basico', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAvailableClients(response.data);
    } catch (err) {
      console.error('Error al obtener clientes disponibles:', err);
      setError('Error al cargar la lista de clientes');
    }
  };
  useEffect(() => {
    if (activeTab === 'clientes') {
      fetchAvailableClients();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchClaseData = async () => {
      if (!claseId) return;
      
      try {
        setLoading(true);
        setError(null); // Resetear el error al iniciar la carga
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/servicios/services/${claseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const claseData = response.data;
        setFormData({
          nombre: claseData.nombre || '',
          descripcion: claseData.descripcion || '',
          capacidad: claseData.capacidad?.toString() || '',
        });

        // If we didn't receive initialSessions, fetch them here
        if (initialSessions.length === 0 && claseData.sesiones) {
          const mappedSessions = claseData.sesiones.map((session: any) => ({
            id: session._id,
            fecha: session.fecha,
            hora: session.hora,
            lugar: session.lugar
          }));
          setSessions(mappedSessions);
        }
        
      } catch (err) {
        console.error('Error al obtener datos de la clase:', err);
        // Solo establecer el error si realmente hay un problema con la carga
        if (!formData.nombre) {
          setError('No se pudieron cargar los datos de la clase');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClaseData();
  }, [claseId, initialSessions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.post(
        `${API_URL}/servicios/services/${claseId}/sessions`,
        newSession,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Use the response data directly instead of making another request
      if (response.data && response.data.servicio && response.data.servicio.sesiones) {
        // Map the sessions from the response to match our Session interface
        const updatedSessions = response.data.servicio.sesiones.map((sesion: any) => ({
          id: sesion._id,
          fecha: sesion.fecha,
          hora: sesion.hora,
          lugar: sesion.lugar
        }));
        
        setSessions(updatedSessions);
      } else {
        // Fallback to the original approach if response format is different
        const sessionsResponse = await axios.get(
          `${API_URL}/servicios/services/${claseId}/sessions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSessions(sessionsResponse.data);
      }
      
      // Clear form
      setNewSession({ fecha: '', hora: '', lugar: '' });
      
      // Show success message if needed
      setError(null);
    } catch (err) {
      console.error('Error al añadir sesión:', err);
      setError('Error al añadir la sesión');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.put(`${API_URL}/servicios/services/${claseId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        onEdit();
        onClose();
      } else {
        throw new Error('Error al actualizar la clase grupal');
      }
    } catch (error) {
      console.error('Error al actualizar la clase grupal:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar la clase grupal');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClient = async (clientId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.post(
        `${API_URL}/servicios/services/${claseId}/addclient`,
        { clientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Use the response data directly instead of making another request
      if (response.data && response.data.servicio && response.data.servicio.clientes) {
        // Map the clients from the response to match our Client interface
        const updatedClients = response.data.servicio.clientes.map((cliente: any) => ({
          id: cliente._id || cliente.id,
          nombre: cliente.nombre,
          email: cliente.email
        }));
        
        setClients(updatedClients);
      } else {
        // Fallback to the original approach if response format is different
        const clientsResponse = await axios.get(
          `${API_URL}/servicios/services/${claseId}/clients`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClients(clientsResponse.data);
      }
    } catch (err) {
      console.error('Error al asignar cliente:', err);
      setError('Error al asignar el cliente');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-screen px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Editar Clase Grupal
              </h3>
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'info'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Información
              </button>
              <button
                onClick={() => setActiveTab('sesiones')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'sesiones'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Sesiones
              </button>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'clientes'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Clientes
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando datos...</p>
              </div>
            ) : (
              <>
                {/* Info Tab */}
                {activeTab === 'info' && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-semibold mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Nombre de la clase"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="descripcion" className="block text-sm font-semibold mb-2">
                        Descripción
                      </label>
                      <textarea
                        name="descripcion"
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Describe la clase grupal"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="capacidad" className="block text-sm font-semibold mb-2">
                        Capacidad
                      </label>
                      <input
                        type="number"
                        name="capacidad"
                        id="capacidad"
                        value={formData.capacidad}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-medium transition-colors
                                 bg-gray-100 hover:bg-gray-200 text-gray-700
                                 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg font-medium text-white 
                                 bg-gradient-to-r from-blue-600 to-blue-400 
                                 hover:from-blue-700 hover:to-blue-500 transition-all
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Sessions Tab */}
                {activeTab === 'sesiones' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-lg font-medium mb-4">Añadir Nueva Sesión</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Fecha</label>
                          <input
                            type="date"
                            name="fecha"
                            value={newSession.fecha}
                            onChange={handleSessionChange}
                            className="w-full px-3 py-2 rounded border dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Hora</label>
                          <input
                            type="time"
                            name="hora"
                            value={newSession.hora}
                            onChange={handleSessionChange}
                            className="w-full px-3 py-2 rounded border dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Lugar</label>
                          <input
                            type="text"
                            name="lugar"
                            value={newSession.lugar}
                            onChange={handleSessionChange}
                            className="w-full px-3 py-2 rounded border dark:bg-gray-600 dark:border-gray-500"
                            placeholder="Sala 1"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleAddSession}
                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir Sesión
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Sesiones Programadas</h4>
                      {sessions.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          No hay sesiones programadas
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {sessions.map((session) => (
                            <div
                              key={session.id}
                              className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 
                                       rounded-lg border border-gray-200 dark:border-gray-600"
                            >
                              <div>
                                <p className="font-medium">
                                  {format(new Date(session.fecha), "EEEE d 'de' MMMM", { locale: es })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {session.hora} - {session.lugar}
                                </p>
                              </div>
                              <button
                                onClick={() => {/* Handle delete session */}}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Clients Tab */}
                {activeTab === 'clientes' && (
                                      <div className="space-y-6">
                                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium mb-4">Asignar Cliente</h4>
                                        <div className="flex gap-4">
                                          {/* Replacing input with select dropdown */}
                                                                                    <select
                                            className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-600 dark:border-gray-500"
                                            onChange={(e) => handleAssignClient(e.target.value)}
                                            defaultValue=""
                                          >
                                            <option value="" disabled>Seleccionar cliente...</option>
                                            {availableClients
                                              .filter(availableClient => 
                                                !clients.some(client => client.id === availableClient._id)
                                              )
                                              .map((client) => (
                                                <option key={client._id} value={client._id}>
                                                  {client.nombre}
                                                </option>
                                              ))}
                                          </select>
                                          <button
                                            onClick={() => fetchAvailableClients()}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                                     flex items-center gap-2"
                                          >
                                            <Plus className="w-4 h-4" />
                                            Actualizar Lista
                                          </button>
                                        </div>
                                      </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Clientes Asignados</h4>
                      {clients.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          No hay clientes asignados
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {clients.map((client) => (
                            <div
                              key={client.id}
                              className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 
                                       rounded-lg border border-gray-200 dark:border-gray-600"
                            >
                              <div>
                                <p className="font-medium">{client.nombre}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {client.email}
                                </p>
                              </div>
                              <button
                                onClick={() => {/* Handle remove client */}}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditarClasePopup2;