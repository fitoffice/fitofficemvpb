import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { FilterPanel } from './FilterPanel';
import { FilterState, Segment } from '../types';
import { useTheme } from '../../../contexts/ThemeContext';

interface SegmentModalProps {
  isEditing: boolean;
  segment: {
    name: string;
    description?: string;
    region?: string;
    interests?: string[];
    source?: string;
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    selectedClients?: string[];
    selectedLeads?: string[];
    registrationDateStart?: string;
    registrationDateEnd?: string;
  };
  onSegmentChange: (updates: Partial<typeof segment>) => void;
  clientFilterState: FilterState;
  onClientFilterStateChange: (newState: FilterState) => void;
  leadFilterState: FilterState;
  onLeadFilterStateChange: (newState: FilterState) => void;
  onClose: () => void;
  onSave: () => void;
}

const interestOptions = ['Fitness', 'Nutrición', 'Yoga', 'Pilates', 'Crossfit', 'Running', 'Otro'];
const sourceOptions = ['Instagram', 'Facebook', 'Web', 'Referido', 'Email', 'WhatsApp', 'Otro'];
const genderOptions = ['Masculino', 'Femenino', 'No especificado'];

export function SegmentModal({
  isEditing,
  segment,
  onSegmentChange,
  clientFilterState,
  onClientFilterStateChange,
  leadFilterState,
  onLeadFilterStateChange,
  onClose,
  onSave
}: SegmentModalProps) {
  const { theme } = useTheme();

  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token);

        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        // Fetch leads
        const leadsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!leadsResponse.ok) {
          throw new Error(`Error fetching leads: ${leadsResponse.status}`);
        }

        const leadsData = await leadsResponse.json();
        console.log('Leads data fetched:', leadsData);
        setLeads(Array.isArray(leadsData) ? leadsData : []);

        // Fetch clients
        try {
          const clientsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!clientsResponse.ok) {
            throw new Error(`Error fetching clients: ${clientsResponse.status}`);
          }

          const clientsData = await clientsResponse.json();
          console.log('Clients data fetched:', clientsData);
          setClients(Array.isArray(clientsData) ? clientsData : []);
        } catch (clientError) {
          console.error('Error fetching clients:', clientError);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filterClients = (clients: any[]) => {
    console.log('Filtering clients:', clients);
    console.log('Filter state:', clientFilterState);
    
    if (!clientFilterState.options) {
      console.log('No filter options, returning all clients');
      return clients;
    }
    
    const filteredClients = clients.filter(client => {
      // Filter by age - using fechaNacimiento instead of edad
      if (clientFilterState.options.minAge || clientFilterState.options.maxAge) {
        // Calculate age from fechaNacimiento
        const birthDate = client.fechaNacimiento ? new Date(client.fechaNacimiento) : null;
        if (birthDate) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          if (clientFilterState.options.minAge && age < parseInt(clientFilterState.options.minAge)) return false;
          if (clientFilterState.options.maxAge && age > parseInt(clientFilterState.options.maxAge)) return false;
        }
      }
  
      // Filter by gender - using genero
      if (clientFilterState.options.gender?.length > 0) {
        if (!client.genero || !clientFilterState.options.gender.includes(client.genero)) {
          return false;
        }
      }
  
      // Filter by region - check all address fields
      if (clientFilterState.options.region && client.direccion) {
        const searchTerm = clientFilterState.options.region.toLowerCase();
        const addressFields = [
          client.direccion.calle || '',
          client.direccion.ciudad || '',
          client.direccion.provincia || '',
          client.direccion.pais || '',
          client.direccion.codigoPostal || ''
        ];
        
        // Check if any address field contains the search term
        const matchesRegion = addressFields.some(field => 
          field.toLowerCase().includes(searchTerm)
        );
        
        if (!matchesRegion) {
          return false;
        }
      }
  
      // Rest of the filter logic remains the same
      // Filter by source
      if (clientFilterState.options.source?.length > 0) {
        if (!client.source || !clientFilterState.options.source.includes(client.source)) {
          return false;
        }
      }
  
      // Filter by interests
      if (clientFilterState.options.interests?.length > 0) {
        // Check if any tags match interests
        const hasTags = client.tags && client.tags.some((tag: any) => 
          clientFilterState.options.interests.includes(tag.name || tag));
        
        // Check if any services match interests
        const hasServices = client.servicios && client.servicios.some((service: any) => 
          clientFilterState.options.interests.includes(service.name || service));
        
        if (!hasTags && !hasServices) {
          return false;
        }
      }
  
      return true;
    });
  
    console.log('Filtered clients:', filteredClients);
    return filteredClients;
  }  
  const filterLeads = (leads: any[]) => {
    console.log('Filtering leads:', leads);
    console.log('Lead filter state:', leadFilterState);
    
    if (!leadFilterState.options) {
      console.log('No lead filter options, returning all leads');
      return leads;
    }
    
    const filteredLeads = leads.filter(lead => {
      console.log('Processing lead:', lead);
      
      // Filter by age - using birthDate instead of age
      if (leadFilterState.options.minAge || leadFilterState.options.maxAge) {
        // Calculate age from birthDate
        const birthDate = lead.birthDate ? new Date(lead.birthDate) : null;
        if (birthDate) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          console.log('Lead age calculated:', age, 'Min age:', leadFilterState.options.minAge, 'Max age:', leadFilterState.options.maxAge);
          if (leadFilterState.options.minAge && age < parseInt(leadFilterState.options.minAge)) return false;
          if (leadFilterState.options.maxAge && age > parseInt(leadFilterState.options.maxAge)) return false;
        }
      }

      // Filter by gender - map 'male' to 'Masculino' and 'female' to 'Femenino'
      if (leadFilterState.options.gender?.length > 0) {
        let mappedGender = '';
        if (lead.gender === 'male') mappedGender = 'Masculino';
        else if (lead.gender === 'female') mappedGender = 'Femenino';
        else mappedGender = 'No especificado';
        
        console.log('Lead gender:', lead.gender, 'Mapped gender:', mappedGender, 'Filter genders:', leadFilterState.options.gender);
        if (!leadFilterState.options.gender.includes(mappedGender)) {
          return false;
        }
      }

      // Filter by region - using address
      if (leadFilterState.options.region) {
        console.log('Lead address:', lead.address, 'Filter region:', leadFilterState.options.region);
        if (!lead.address || !lead.address.toLowerCase().includes(leadFilterState.options.region.toLowerCase())) {
          return false;
        }
      }

      // Filter by interests
      if (leadFilterState.options.interests?.length > 0) {
        console.log('Lead interests:', lead.interests, 'Filter interests:', leadFilterState.options.interests);
        if (!lead.interests || !leadFilterState.options.interests.some(interest => 
          lead.interests.includes(interest))) {
          return false;
        }
      }

      // Filter by source (origen)
      if (leadFilterState.options.source?.length > 0) {
        console.log('Lead source:', lead.origen, 'Filter sources:', leadFilterState.options.source);
        if (!lead.origen || !leadFilterState.options.source.includes(lead.origen)) {
          return false;
        }
      }

      return true;
    });
    
    console.log('Filtered leads:', filteredLeads);
    return filteredLeads;
  };

  const isSegmentValid = () => {
    return segment.name && 
           (segment.selectedClients?.length > 0 || segment.selectedLeads?.length > 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
 <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col`}
          >      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Editar Segmento' : 'Nuevo Segmento'}
        </h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50" style={{ maxHeight: "70vh" }}>
      <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <div className="border-b pb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Segmento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="Ej: Clientes VIP"
                  value={segment.name}
                  onChange={(e) => onSegmentChange({ name: e.target.value })}
                />

          </div>
          
          <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-gray-400">(Opcional)</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Describe este segmento..."
              value={segment.description || ''}
              onChange={(e) => onSegmentChange({ description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Región/Dirección <span className="text-gray-400">(Opcional)</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ej: Madrid, España"
              value={segment.region || ''}
              onChange={(e) => onSegmentChange({ region: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intereses <span className="text-gray-400">(Opcional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-2 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
              {interestOptions.map((interest) => (
                <label key={interest} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    checked={segment.interests?.includes(interest)}
                    onChange={(e) => {
                      const newInterests = e.target.checked
                        ? [...(segment.interests || []), interest]
                        : (segment.interests || []).filter(i => i !== interest);
                      onSegmentChange({ interests: newInterests });
                    }}
                  />
                  <span className="text-sm text-gray-600">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rango de Edad <span className="text-gray-400">(Opcional)</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Edad mínima"
                  value={segment.ageMin || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    onSegmentChange({ ageMin: value });
                  }}
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Edad máxima"
                  value={segment.ageMax || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    onSegmentChange({ ageMax: value });
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género <span className="text-gray-400">(Opcional)</span>
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={segment.gender || ''}
              onChange={(e) => onSegmentChange({ gender: e.target.value })}
            >
              <option value="">Seleccionar género</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Registro <span className="text-gray-400">(Opcional)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Desde</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  value={segment.registrationDateStart || ''}
                  onChange={(e) => onSegmentChange({ registrationDateStart: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Hasta</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  value={segment.registrationDateEnd || ''}
                  onChange={(e) => onSegmentChange({ registrationDateEnd: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origen <span className="text-gray-400">(Opcional)</span>
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={segment.source || ''}
              onChange={(e) => onSegmentChange({ source: e.target.value })}
            >
              <option value="">Seleccionar origen</option>
              {sourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Seleccionar Clientes <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => onClientFilterStateChange({ ...clientFilterState, isOpen: !clientFilterState.isOpen })}
                        className="px-4 py-2 bg-gradient-to-r from-[#FF385C] to-[#FF385C] text-white rounded-lg hover:bg-[#E6314F] focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 shadow-md flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95"
                      >
                        <Filter className="h-4 w-4 animate-pulse" />
                        criterios de segmentación
                      </button>
                      
                      {clientFilterState.isOpen && (
                        <FilterPanel
                          filterState={clientFilterState}
                          onFilterStateChange={onClientFilterStateChange}
                          onClose={() => onClientFilterStateChange({ ...clientFilterState, isOpen: false })}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
                      </div>
                    ) : clients && clients.length > 0 ? (
                      <div className="space-y-3">
                        {filterClients(clients).map((client: any) => (
                          <div key={client._id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
                            <div className="flex flex-col">
                              <span className="font-medium">{`${client.nombre || ''} ${client.apellido || ''}`}</span>
                              <span className="text-sm text-gray-500">{client.email}</span>
                              <span className="text-xs text-gray-400">{client.telefono}</span>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                              checked={segment.selectedClients?.includes(client._id)}
                              onChange={(e) => {
                                const newSelectedClients = e.target.checked
                                  ? [...(segment.selectedClients || []), client._id]
                                  : (segment.selectedClients || []).filter(id => id !== client._id);
                                onSegmentChange({ selectedClients: newSelectedClients });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="text-gray-400 mb-2">
                          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No hay clientes disponibles</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Seleccionar Leads <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => onLeadFilterStateChange({ ...leadFilterState, isOpen: !leadFilterState.isOpen })}
                        className="px-4 py-2 bg-gradient-to-r from-[#FF385C] to-[#FF385C] text-white rounded-lg hover:bg-[#E6314F] focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 shadow-md flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95"
                      >
                        <Filter className="h-4 w-4 animate-pulse" />
                        criterios de segmentación
                      </button>
                      
                      {leadFilterState.isOpen && (
                        <FilterPanel
                          filterState={leadFilterState}
                          onFilterStateChange={onLeadFilterStateChange}
                          onClose={() => onLeadFilterStateChange({ ...leadFilterState, isOpen: false })}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
                      </div>
                    ) : leads.length > 0 ? (
                      <div className="space-y-3">
      {filterLeads(leads).map((lead: any) => (
        <div key={lead._id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
                            <div className="flex flex-col">
                              <span className="font-medium">{lead.name}</span>
                              <span className="text-sm text-gray-500">{lead.email}</span>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{lead.phone}</span>
                                {lead.interests && lead.interests.length > 0 && (
                                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                                    {lead.interests[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                              checked={segment.selectedLeads?.includes(lead._id)}
                              onChange={(e) => {
                                const newSelectedLeads = e.target.checked
                                  ? [...(segment.selectedLeads || []), lead._id]
                                  : (segment.selectedLeads || []).filter(id => id !== lead._id);
                                onSegmentChange({ selectedLeads: newSelectedLeads });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="text-gray-400 mb-2">
                          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No hay leads disponibles</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
         
        <button
          onClick={() => {
            if (isSegmentValid()) {
              // Ensure we're sending valid data
              const validSegment = {
                ...segment,
                // Make sure arrays are initialized properly
                selectedClients: segment.selectedClients || [],
                selectedLeads: segment.selectedLeads || [],
                interests: segment.interests || []
              };
              console.log('Datos del segmento a enviar desde Modal:', validSegment);
              onSave();
            }
          }}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          disabled={!isSegmentValid()}
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Segmento'}
        </button>
        </div>
        </div>
      </motion.div>
    </div>
  );
}