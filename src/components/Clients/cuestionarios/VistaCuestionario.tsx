import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Clock, Calendar, Users, CheckCircle, 
  AlertTriangle, ArrowLeft, Edit2, Trash2,
  Download, Share2, Eye, UserPlus
} from 'lucide-react';
import Button from '../../Common/Button';
import axios from 'axios';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  estado: string;
}

interface Pregunta {
  _id: string;
  texto: string;
  categoria: string;
}

interface Cuestionario {
  _id: string;
  titulo: string;
  descripcion: string;
  frecuencia: string;
  preguntas: Pregunta[];
  fechaCreacion: string;
  estado: string;
  responses: number;
  completion: string;
  clientes: Cliente[];
}

interface VistaCuestionarioProps {
  cuestionario: Cuestionario;
  cuestionarioId: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const VistaCuestionario: React.FC<VistaCuestionarioProps> = ({
  cuestionario,
  cuestionarioId,
  onClose,
  onEdit,
  onDelete
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'detalles' | 'respuestas' | 'clientes'>('detalles');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cuestionarioData, setCuestionarioData] = useState<Cuestionario>(cuestionario);

  useEffect(() => {
    fetchClientes();
    fetchCuestionarioData();
  }, [cuestionarioId]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar los clientes:', error);
    }
  };

  const fetchCuestionarioData = async () => {
    try {
      const response = await axios.get(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/cuestionarios/${cuestionarioId}`);
      console.log('Datos del cuestionario recibidos:', response.data);
      setCuestionarioData(response.data);
    } catch (error) {
      console.error('Error al cargar el cuestionario:', error);
    }
  };

  const handleClienteSelect = (clienteId: string) => {
    setSelectedClientes(prev => 
      prev.includes(clienteId)
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const handleAsignarClientes = async () => {
    if (selectedClientes.length === 0) return;
    
    setLoading(true);
    try {
      await axios.post(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/cuestionarios/${cuestionarioId}/clientes`, {
        clienteIds: selectedClientes
      });
      // Recargar los datos del cuestionario
      await fetchCuestionarioData();
      setSelectedClientes([]);
    } catch (error) {
      console.error('Error al asignar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      icon: Users,
      title: "Respuestas Totales",
      value: cuestionarioData.responses,
      color: "bg-blue-500"
    },
    {
      icon: CheckCircle,
      title: "Tasa de Completado",
      value: cuestionarioData.completion,
      color: "bg-green-500"
    },
    {
      icon: Clock,
      title: "Frecuencia",
      value: cuestionarioData.frecuencia,
      color: "bg-purple-500"
    },
    {
      icon: Calendar,
      title: "Última Actualización",
      value: new Date(cuestionarioData.fechaCreacion).toLocaleDateString(),
      color: "bg-amber-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
          <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-left">
                {cuestionarioData.titulo}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-left">
                {cuestionarioData.descripcion}
              </p>
            </div>
            <div className="flex space-x-2">
             
              <button
                className="p-2 text-gray-500 hover:text-white hover:bg-green-500 rounded-full transition-colors focus:outline-none"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-white hover:bg-purple-500 rounded-full transition-colors focus:outline-none"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-500 hover:text-white hover:bg-red-500 rounded-full transition-colors focus:outline-none"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-white hover:bg-blue-500 rounded-full transition-colors focus:outline-none"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>            

                      </div>
        </div>

        {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer hover:border-l-4 hover:border-${card.color.split('-')[1]}-500`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${card.color} p-3 rounded-lg transition-all duration-300 hover:scale-110`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

               {/* Tabs */}
               <div className="px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('detalles')}
              className={`py-3 px-5 rounded-t-lg focus:outline-none transition-all duration-300 flex items-center ${
                activeTab === 'detalles'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500'
              }`}
            >
              <Eye className={`w-5 h-5 mr-2 ${activeTab === 'detalles' ? 'text-white' : 'text-blue-500'}`} />
              <span className="font-medium">Detalles</span>
            </button>
            <button
              onClick={() => setActiveTab('respuestas')}
              className={`py-3 px-5 rounded-t-lg focus:outline-none transition-all duration-300 flex items-center ${
                activeTab === 'respuestas'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-500'
              }`}
            >
              <CheckCircle className={`w-5 h-5 mr-2 ${activeTab === 'respuestas' ? 'text-white' : 'text-green-500'}`} />
              <span className="font-medium">Respuestas</span>
            </button>
            <button
              onClick={() => setActiveTab('clientes')}
              className={`py-3 px-5 rounded-t-lg focus:outline-none transition-all duration-300 flex items-center ${
                activeTab === 'clientes'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-500'
              }`}
            >
              <Users className={`w-5 h-5 mr-2 ${activeTab === 'clientes' ? 'text-white' : 'text-purple-500'}`} />
              <span className="font-medium">Clientes</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 400px)' }}>
          {activeTab === 'detalles' ? (
                        <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                            Preguntas del Cuestionario
                          </h3>
                          <div className="space-y-5">
                            {cuestionarioData.preguntas.map((pregunta, index) => (
                              <motion.div
                                key={pregunta._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-5 rounded-lg border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300 ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                                }`}
                                whileHover={{ scale: 1.01 }}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transform transition-transform hover:scale-110">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-lg mb-2">{pregunta.texto}</p>
                                      <div className="flex items-center">
                                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
                                          theme === 'dark' 
                                            ? 'bg-blue-900/30 text-blue-300' 
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                          {pregunta.categoria}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
          ) : activeTab === 'respuestas' ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Próximamente</h3>
              <p className="text-gray-500">
                La visualización de respuestas estará disponible en una próxima actualización.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Gestión de Clientes
                </h3>
                <Button 
                  variant="primary" 
                  onClick={handleAsignarClientes}
                  disabled={selectedClientes.length === 0 || loading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Asignar Seleccionados ({selectedClientes.length})
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Assigned Clients Section */}
                <div className="space-y-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold flex items-center text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-3">
                <CheckCircle className="w-5 h-5 mr-2" />
                    Clientes Asignados ({cuestionarioData.clientes?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {clientes
                      .filter(cliente => cuestionarioData.clientes?.some(c => c._id === cliente._id))
                      .map((cliente) => (
                        <motion.div
                          key={cliente._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border-l-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300 ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{cliente.nombre}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.email}</p>
                              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                cliente.estado === 'Activo' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {cliente.estado}
                              </span>
                            </div>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          </div>
                        </motion.div>
                    ))}
                  </div>
                </div>

                {/* Unassigned Clients Section */}
                <div className="space-y-4 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/10 dark:to-indigo-800/10 p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold flex items-center text-purple-600 dark:text-purple-400 border-b border-purple-200 dark:border-purple-800 pb-3">
                <Users className="w-5 h-5 mr-2" />
                    Clientes Disponibles ({clientes.filter(cliente => !cuestionarioData.clientes?.some(c => c._id === cliente._id)).length})
                  </h4>
                  <div className="space-y-3">
                    {clientes
                      .filter(cliente => !cuestionarioData.clientes?.some(c => c._id === cliente._id))
                      .map((cliente) => {
                        const isSelected = selectedClientes.includes(cliente._id);
                        return (
                          <motion.div
                            key={cliente._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                            } ${isSelected ? 'border-l-4 border-purple-500' : ''}`}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-lg">{cliente.nombre}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.email}</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                  cliente.estado === 'Activo' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {cliente.estado}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleClienteSelect(cliente._id)}
                                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VistaCuestionario;