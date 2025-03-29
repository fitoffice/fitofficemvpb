import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { User, Clock, CheckCircle, XCircle, Plus, Calendar, AlertCircle, Dumbbell } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PopupRM from '../../Planning/PopupRM';

interface Client {
  _id: string;
  nombre: string;
  email: string;
  plannings?: string[];
  estado?: string;
}

interface AssignedClient {
  client: Client;
  currentWeek: number;
  currentDay: number;
  status: string;
  _id: string;
  assignedDate: string;
  modifications: any[];
}

interface VistaClientesProps {
  assignedClients?: AssignedClient[];
  templateId: string;
  onClientAssigned: () => void;
}

export const VistaClientes: React.FC<VistaClientesProps> = ({ 
  assignedClients = [], 
  templateId,
  onClientAssigned 
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isRMModalOpen, setIsRMModalOpen] = useState(false);

  const fetchAvailableClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes');
      setAvailableClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClient = async (clientId: string) => {
    try {
      await axios.post(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${templateId}/assign`, {
        clientId
      });
      onClientAssigned();
      setShowPopup(false);
    } catch (error) {
      console.error('Error assigning client:', error);
    }
  };

  const navigateToPlanning = (clientId: string) => {
    navigate(`/planning/${templateId}/client/${clientId}`);
  };

  return (
    <div className="relative mt-10">
      <div className="mb-4 flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Clientes Asignados
        </h2>
        <button
          onClick={() => {
            setShowPopup(true);
            fetchAvailableClients();
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Asignar Cliente
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`relative w-full max-w-md p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Asignar Nuevo Cliente
            </h3>
            {loading ? (
              <div className="text-center py-4">Cargando clientes...</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {availableClients.map((client) => (
                  <div
                    key={client._id}
                    className={`p-4 mb-2 rounded-lg ${
                      client.plannings && client.plannings.length > 0
                        ? theme === 'dark' ? 'bg-yellow-900/50' : 'bg-yellow-50'
                        : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    } cursor-pointer`}
                    onClick={() => handleAssignClient(client._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {client.nombre}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {client.email}
                        </div>
                        <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Estado: {client.estado || 'No especificado'}
                        </div>
                      </div>
                      {client.plannings && client.plannings.length > 0 && (
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <span className="ml-2 text-sm text-yellow-600 dark:text-yellow-400">
                            Ya tiene planificación
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!assignedClients || assignedClients.length === 0 ? (
        <div className="text-center p-4">
          <p className={`text-gray-500 ${theme === 'dark' ? 'dark:text-gray-400' : ''}`}>
            No hay clientes asignados actualmente.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Cliente
                  </div>
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Email
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Progreso
                  </div>
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Estado
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Fecha de Asignación
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}>
              {assignedClients.map((assigned) => (
                <tr key={assigned._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {assigned.client.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {assigned.client.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Semana {assigned.currentWeek}, Día {assigned.currentDay}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      assigned.status === 'active' 
                        ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                        : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      {assigned.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {assigned.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(assigned.assignedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigateToPlanning(assigned.client._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Ver Planificación
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedClientId(assigned.client._id);
                          setIsRMModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                      >
                        <Dumbbell className="h-4 w-4 mr-1" />
                        RMs
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal de RMs */}
      {isRMModalOpen && selectedClientId && (
        <PopupRM
          onClose={() => {
            setIsRMModalOpen(false);
            setSelectedClientId(null);
          }}
          planningId={selectedClientId}
        />
      )}
    </div>
  );
};
