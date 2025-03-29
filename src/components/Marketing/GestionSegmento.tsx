import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2, Users, Mail, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

interface Campaign {
  _id: string;
  nombre: string;
  descripcion: string;
  segmentos: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  estado: string;
  estadisticas: {
    enviados: number;
    abiertos: number;
    clicks: number;
  };
  pipeline?: {
    id: string;
    etapas: Array<{
      _id: string;
      nombre: string;
      emails: Array<any>;
      servicioId: string;
      requiereCompra: boolean;
    }>;
  };
}

interface Etapa {
  id: string;
  nombre: string;
  clientes: Array<{
    _id: string;
    nombre: string;
    email: string;
  }>;
  leads: Array<{
    _id: string;
    email: string;
    name?: string;
  }>;
  _id?: string;
  servicioId?: string;
  requiereCompra?: boolean;
}

interface Segment {
  _id: string;
  name: string;
  description: string;
  clients?: Array<{
    _id: string;
    nombre: string;
    email: string;
  }>;
  leads?: Array<{
    _id: string;
    email: string;
    name?: string;
  }>;
  etapas?: Etapa[];
}

export function GestionSegmento({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddSegment, setShowAddSegment] = useState(false);
  const [newSegment, setNewSegment] = useState({ name: '', description: '' });
  const [expandedEtapas, setExpandedEtapas] = useState<Record<string, boolean>>({});
  const [newEtapa, setNewEtapa] = useState({ nombre: '' });
  const [showAddEtapa, setShowAddEtapa] = useState<Record<string, boolean>>({});

  // Convertir las etapas del pipeline a nuestro formato de etapas
  const getEtapasFromPipeline = (): Etapa[] => {
    if (!campaign.pipeline?.etapas) {
      return [];
    }

    console.log('Etapas del pipeline:', campaign.pipeline.etapas);
    
    return campaign.pipeline.etapas.map(etapa => ({
      id: etapa._id,
      _id: etapa._id,
      nombre: etapa.nombre,
      servicioId: etapa.servicioId,
      requiereCompra: etapa.requiereCompra,
      clientes: [],
      leads: []
    }));
  };

  useEffect(() => {
    const fetchSegments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        console.log('ID de campaña recibido en GestionSegmento:', campaign._id);
        console.log('Campaña completa recibida:', campaign);

        const response = await axios.get(
          `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments/campaign/${campaign._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('URL de la petición:', `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments/campaign/${campaign._id}`);
        console.log('Respuesta completa de la API:', response);
        console.log('Segmentos obtenidos:', response.data);
        
        // Obtener etapas del pipeline de la campaña
        const etapasPipeline = getEtapasFromPipeline();
        
        // Añadir etapas del pipeline a cada segmento si no las tienen
        const segmentosConEtapas = response.data.map((segmento: Segment) => ({
          ...segmento,
          etapas: segmento.etapas || etapasPipeline
        }));
        
        setSegments(segmentosConEtapas);
      } catch (err) {
        console.error('Error al obtener los segmentos:', err);
        setError(err instanceof Error ? err.message : 'Error al obtener los segmentos');
      } finally {
        setLoading(false);
      }
    };

    if (campaign._id) {
      console.log('Iniciando fetchSegments con campaign._id:', campaign._id);
      fetchSegments();
    } else {
      console.warn('No se encontró ID de campaña');
    }
  }, [campaign._id, campaign]);

  const handleAddSegment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Obtener etapas del pipeline
      const etapasPipeline = getEtapasFromPipeline();
      
      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments',
        {
          ...newSegment,
          campaignId: campaign._id,
          etapas: etapasPipeline
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Nuevo segmento creado:', response.data);
      setSegments(prev => [...prev, {...response.data, etapas: etapasPipeline}]);
      setShowAddSegment(false);
      setNewSegment({ name: '', description: '' });
    } catch (err) {
      console.error('Error al crear segmento:', err);
      setError('Error al crear el segmento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSegment = async (segmentoId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments/${segmentoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSegments(prev => prev.filter(s => s._id !== segmentoId));
    } catch (err) {
      console.error('Error al eliminar segmento:', err);
      setError('Error al eliminar el segmento');
    } finally {
      setLoading(false);
    }
  };

  const toggleEtapa = (segmentId: string, etapaId: string) => {
    const key = `${segmentId}-${etapaId}`;
    setExpandedEtapas(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMoveToEtapa = async (segmentId: string, etapaId: string, itemId: string, itemType: 'cliente' | 'lead') => {
    // Implementación para mover clientes/leads entre etapas
    // Esta función se llamaría desde un menú desplegable en cada cliente/lead
    console.log(`Mover ${itemType} ${itemId} a etapa ${etapaId} en segmento ${segmentId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Gestión de Segmentos</h2>
            <p className="text-gray-600">Campaña: {campaign.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {segments.map((segment) => (
              <div
                key={segment._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{segment.name}</h3>
                    <p className="text-gray-600 mb-4">{segment.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSegment(segment._id)}
                    className="p-2 hover:bg-red-100 rounded-full text-red-500"
                    title="Eliminar segmento"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Sección de Etapas */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <Layers className="mr-2" size={20} />
                    Etapas del Pipeline
                  </h4>
                  
                  <div className="space-y-3">
                    {segment.etapas && segment.etapas.length > 0 ? (
                      segment.etapas.map((etapa) => (
                        <div key={etapa.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="bg-gray-100 p-3 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleEtapa(segment._id, etapa.id)}
                          >
                            <h5 className="font-medium">{etapa.nombre}</h5>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-3">
                                {etapa.clientes.length} clientes, {etapa.leads.length} leads
                              </span>
                              {expandedEtapas[`${segment._id}-${etapa.id}`] ? 
                                <ChevronUp size={18} /> : 
                                <ChevronDown size={18} />
                              }
                            </div>
                          </div>
                          
                          {expandedEtapas[`${segment._id}-${etapa.id}`] && (
                            <div className="p-4">
                              <div className="grid grid-cols-2 gap-4">
                                {/* Clientes en esta etapa */}
                                <div>
                                  <h6 className="font-medium mb-2 flex items-center">
                                    <Users size={16} className="mr-1" />
                                    Clientes
                                  </h6>
                                  <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                                    {etapa.clientes.length > 0 ? (
                                      etapa.clientes.map(cliente => (
                                        <div key={cliente._id} className="text-sm p-2 hover:bg-gray-100 rounded">
                                          <p className="font-medium">{cliente.nombre}</p>
                                          <p className="text-gray-600">{cliente.email}</p>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-sm text-center">No hay clientes en esta etapa</p>
                                    )}
                                  </div>
                                  <button 
                                    className="mt-2 text-blue-600 text-sm flex items-center"
                                    onClick={() => {/* Implementar función para añadir cliente a etapa */}}
                                  >
                                    <Plus size={14} className="mr-1" />
                                    Añadir cliente
                                  </button>
                                </div>
                                
                                {/* Leads en esta etapa */}
                                <div>
                                  <h6 className="font-medium mb-2 flex items-center">
                                    <Mail size={16} className="mr-1" />
                                    Leads
                                  </h6>
                                  <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                                    {etapa.leads.length > 0 ? (
                                      etapa.leads.map(lead => (
                                        <div key={lead._id} className="text-sm p-2 hover:bg-gray-100 rounded">
                                          <p className="font-medium">{lead.email}</p>
                                          {lead.name && <p className="text-gray-600">Nombre: {lead.name}</p>}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-sm text-center">No hay leads en esta etapa</p>
                                    )}
                                  </div>
                                  <button 
                                    className="mt-2 text-blue-600 text-sm flex items-center"
                                    onClick={() => {/* Implementar función para añadir lead a etapa */}}
                                  >
                                    <Plus size={14} className="mr-1" />
                                    Añadir lead
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
                        No hay etapas definidas en el pipeline de esta campaña
                      </p>
                    )}
                  </div>
                </div>

                               {/* Sección de Clientes */}
                               <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <Users className="mr-2" size={20} />
                    Clientes ({segment.clients?.length || 0})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {segment.clients && segment.clients.length > 0 ? (
                      <div className="space-y-3">
                        {segment.clients.map((client) => (
                          <div key={client._id} className="flex items-start space-x-3 p-2 hover:bg-gray-100 rounded-md">
                            <div className="flex-grow">
                              <p className="font-medium">{client.nombre}</p>
                              <p className="text-sm text-gray-600">{client.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No hay clientes en este segmento</p>
                    )}
                  </div>
                </div>

                {/* Sección de Leads */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <Mail className="mr-2" size={20} />
                    Leads ({segment.leads?.length || 0})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {segment.leads && segment.leads.length > 0 ? (
                      <div className="space-y-3">
                        {segment.leads.map((lead) => (
                          <div key={lead._id} className="flex items-start space-x-3 p-2 hover:bg-gray-100 rounded-md">
                            <div className="flex-grow">
                              <p className="font-medium">{lead.email}</p>
                              {lead.name && <p className="text-sm text-gray-600">Nombre: {lead.name}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No hay leads en este segmento</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};