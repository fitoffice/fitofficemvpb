import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Filter } from 'lucide-react';

interface Client {
  _id: string;
  email: string;
  planningActivo?: {
    _id: string;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    meta: string;
    semanas: number;
  };
  dietaActiva?: {
    _id: string;
    nombre: string;
    objetivo: string;
    estado: string;
  };
}

interface Lead {
  _id: string;
  email: string;
}

interface Segment {
  _id: string;
  name: string;
  description: string;
  clients: Client[];
  leads: Lead[];
  createdAt: string;
  updatedAt: string;
}

interface ModalDeSegmentoProps {
  onClose: () => void;
  editingSegment?: Segment | null;
  onSave: (segmentData: {
    name: string;
    description: string;
    clientIds: string[];
    leadIds: string[];
  }) => Promise<void>;
}

interface FilterCriteria {
  minAge?: string;
  maxAge?: string;
  location?: string;
  gender?: string;
  interests?: string;
  origin?: string[];
}

export function ModalDeSegmento({ onClose, editingSegment, onSave }: ModalDeSegmentoProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [segmentData, setSegmentData] = useState({
    name: editingSegment?.name || '',
    description: editingSegment?.description || '',
    selectedClients: editingSegment?.clients.map(client => client._id) || [],
    selectedLeads: editingSegment?.leads.map(lead => lead._id) || [],
  });
  const [showClientFilters, setShowClientFilters] = useState(false);
  const [showLeadFilters, setShowLeadFilters] = useState(false);
  const [clientFilters, setClientFilters] = useState<FilterCriteria>({});
  const [leadFilters, setLeadFilters] = useState<FilterCriteria>({});

  useEffect(() => {
    fetchClientsAndLeads();
  }, []);

  const fetchClientsAndLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch clients
      const clientsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
        headers
      });
      const clientsData = await clientsResponse.json();
      setClients(clientsData);

      // Fetch leads
      const leadsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads', {
        headers
      });
      const leadsData = await leadsResponse.json();
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    try {
      await onSave({
        name: segmentData.name,
        description: segmentData.description,
        clientIds: segmentData.selectedClients,
        leadIds: segmentData.selectedLeads
      });
      onClose();
    } catch (error) {
      console.error('Error saving segment:', error);
    }
  };

  const FilterDropdown = ({ 
    isClient = false, 
    show, 
    onClose,
    filters,
    setFilters,
    position = 'bottom'
  }: { 
    isClient?: boolean;
    show: boolean;
    onClose: () => void;
    filters: FilterCriteria;
    setFilters: (filters: FilterCriteria) => void;
    position?: 'top' | 'bottom';
  }) => {
    if (!show) return null;

    return (
      <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200`}>
        <div className="flex flex-col h-[500px]">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Filtros de Búsqueda</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Edad
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Mín"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  value={filters.minAge || ''}
                  onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="Máx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  value={filters.maxAge || ''}
                  onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                placeholder="Ej: Madrid"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={filters.location || ''}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={filters.gender || 'Todos'}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              >
                <option value="Todos">Todos</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intereses
              </label>
              <input
                type="text"
                placeholder="Ej: fitness, nutrición, yoga"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={filters.interests || ''}
                onChange={(e) => setFilters({ ...filters, interests: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origen
              </label>
              <div className="space-y-2">
                {['Instagram', 'Facebook', 'Web', 'Referido', 'Otro'].map((origin) => (
                  <label key={origin} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                      checked={filters.origin?.includes(origin) || false}
                      onChange={(e) => {
                        const newOrigins = filters.origin || [];
                        if (e.target.checked) {
                          setFilters({ ...filters, origin: [...newOrigins, origin] });
                        } else {
                          setFilters({
                            ...filters,
                            origin: newOrigins.filter(o => o !== origin)
                          });
                        }
                      }}
                    />
                    <span className="ml-2">{origin}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setFilters({});
                  onClose();
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Limpiar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#FF3366] text-white rounded-lg hover:bg-[#FF1F59]"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingSegment ? 'Editar Segmento' : 'Nuevo Segmento'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Segamento
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ej: Clientes VIP"
              value={segmentData.name}
              onChange={(e) => setSegmentData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Describe este segmento..."
              value={segmentData.description}
              onChange={(e) => setSegmentData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Clientes
              </label>
              <div className="relative">
                <FilterDropdown
                  isClient={true}
                  show={showClientFilters}
                  onClose={() => setShowClientFilters(false)}
                  filters={clientFilters}
                  setFilters={setClientFilters}
                  position="bottom"
                />
                <button
                  className="px-3 py-1 text-sm text-white bg-[#FF3366] rounded-lg hover:bg-[#FF1F59] flex items-center gap-1"
                  onClick={() => setShowClientFilters(!showClientFilters)}
                >
                  <Filter className="h-4 w-4" />
                  criterios de segmentación
                </button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {clients.map((client) => (
                <label key={`client-${client._id}`} className="flex items-center space-x-2 p-1">
                  <input
                    type="checkbox"
                    checked={segmentData.selectedClients.includes(client._id)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSegmentData(prev => ({
                        ...prev,
                        selectedClients: isChecked
                          ? [...prev.selectedClients, client._id]
                          : prev.selectedClients.filter(id => id !== client._id)
                      }));
                    }}
                  />
                  <span>{client.email}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Leads
              </label>
              <div className="relative">
                <FilterDropdown
                  show={showLeadFilters}
                  onClose={() => setShowLeadFilters(false)}
                  filters={leadFilters}
                  setFilters={setLeadFilters}
                  position="top"
                />
                <button
                  className="px-3 py-1 text-sm text-white bg-[#FF3366] rounded-lg hover:bg-[#FF1F59] flex items-center gap-1"
                  onClick={() => setShowLeadFilters(!showLeadFilters)}
                >
                  <Filter className="h-4 w-4" />
                  criterios de segmentación
                </button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {leads.map((lead) => (
                <label key={`lead-${lead._id}`} className="flex items-center space-x-2 p-1">
                  <input
                    type="checkbox"
                    checked={segmentData.selectedLeads.includes(lead._id)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSegmentData(prev => ({
                        ...prev,
                        selectedLeads: isChecked
                          ? [...prev.selectedLeads, lead._id]
                          : prev.selectedLeads.filter(id => id !== lead._id)
                      }));
                    }}
                  />
                  <span>{lead.email}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            {editingSegment ? 'Guardar Cambios' : 'Crear Segmento'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
