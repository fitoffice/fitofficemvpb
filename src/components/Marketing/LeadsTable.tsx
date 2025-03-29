import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Plus, Search, Gift, Star, Upload, X, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { CsvPreview } from './CsvPreview';
import { useTheme } from '../../contexts/ThemeContext';
import { useCsv } from '../../contexts/CsvContext';
import { CrearLeadPopup } from './CrearLeadPopup';
import { EditLeadPopup } from './EditLeadPopup';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  origen: string;
  createdAt: string;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  shortDescription?: string;
  birthDate?: string;
  gender: 'male' | 'female' | 'other' | '';
  address: string;
  interests: string[];
  origen: string;
}

export function LeadsTable() {
  const { theme } = useTheme();
  const { handleCsvButtonClick } = useCsv();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [csvData, setCsvData] = useState<Array<any>>([]);
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit } = useForm<LeadFormData>();

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setLeads(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los leads');
      toast.error('Error al cargar los leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLead = async (newLead: LeadFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Asegurarse de que los intereses seleccionados se incluyan en el lead
      const leadData = {
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        status: "new",
        origen: newLead.origen,
        shortDescription: newLead.shortDescription || '',
        birthDate: newLead.birthDate || '',
        gender: newLead.gender,
        address: newLead.address,
        interests: selectedInterests // Usar los intereses del estado
      };

      console.log('Datos enviados en la petición POST:', leadData);

      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads',
        leadData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setLeads(prevLeads => [...prevLeads, response.data]);
      setShowNewLeadModal(false);
      setSelectedInterests([]); // Limpiar los intereses seleccionados
      toast.success('Lead creado exitosamente');
    } catch (err) {
      toast.error('Error al crear el lead');
      console.error('Error creating lead:', err);
    }
  };

  const handleEditLead = async (id: string, updatedLead: LeadFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Asegurarse de que los intereses seleccionados se incluyan en el lead
      const leadData = {
        name: updatedLead.name,
        email: updatedLead.email,
        phone: updatedLead.phone,
        status: updatedLead.status,
        origen: updatedLead.origen,
        shortDescription: updatedLead.shortDescription || '',
        birthDate: updatedLead.birthDate || '',
        gender: updatedLead.gender,
        address: updatedLead.address,
        interests: selectedInterests
      };

      const response = await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads/${id}`,
        leadData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Actualizar el lead en el estado local
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === id ? { ...lead, ...response.data } : lead
        )
      );
      
      setShowEditLeadModal(false);
      setSelectedInterests([]);
      toast.success('Lead actualizado exitosamente');
    } catch (err) {
      toast.error('Error al actualizar el lead');
      console.error('Error updating lead:', err);
    }
  };

  const openEditModal = (lead: Lead) => {
    setCurrentLead(lead);
    setShowEditLeadModal(true);
  };

  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(header => header.trim());
        const data = rows.slice(1)
          .filter(row => row.trim()) // Filtrar filas vacías
          .map(row => {
            const values = row.split(',').map(value => value.trim());
            return headers.reduce((obj: any, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
        setCsvData(data);
        setShowCsvPreview(true);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error('Error reading CSV:', err);
      toast.error('Error al leer el archivo CSV');
    }

    // Limpiar el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCsvConfirm = async (mappedData: Array<any>) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads/import-csv',
        { leads: mappedData },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Leads importados exitosamente');
        fetchLeads();
      } else {
        toast.error('Error al importar los leads');
      }
    } catch (err) {
      console.error('Error importing CSV:', err);
      toast.error('Error al importar el archivo CSV');
    }
    setShowCsvPreview(false);
    setCsvData([]);
  };

  const handleCsvCancel = () => {
    setShowCsvPreview(false);
    setCsvData([]);
  };

  // Remove this duplicate function since you're already importing it from context
  // const handleCsvButtonClick = () => {
  //   fileInputRef.current?.click();
  // };

  useEffect(() => {
    fetchLeads();
    
    // Add event listener to refresh leads when imported through the context
    const handleLeadsImported = () => {
      fetchLeads();
    };
    
    window.addEventListener('leads-imported', handleLeadsImported);
    
    return () => {
      window.removeEventListener('leads-imported', handleLeadsImported);
    };
  }, []);

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener color basado en el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto traducido del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Nuevo';
      case 'contacted':
        return 'Contactado';
      case 'qualified':
        return 'Cualificado';
      case 'lost':
        return 'Perdido';
      default:
        return status;
    }
  };

  // Validaciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex =
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(phone);
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const [sortField, setSortField] = useState<keyof Lead | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredSortedLeads = filteredLeads
    .sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const interestCategories = [
    'Fitness',
    'Pérdida de peso',
    'Musculación',
    'Yoga',
    'Pilates',
    'Nutrición',
    'Rehabilitación',
    'Entrenamiento personal',
    'Clases grupales',
    'CrossFit'
  ];

  const origenOptions = [
    'Redes sociales',
    'Sitio web',
    'Referido',
    'Publicidad',
    'Evento',
    'Visita directa',
    'Email marketing',
    'Otro'
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
      {/* Header con búsqueda y botones */}
      <div className={`p-6 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'
      } border-b`}>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Leads</h2>
          <div className="flex items-center space-x-4">
            {/* Búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 text-sm`}
              />
              <Search className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} absolute left-3 top-1/2 transform -translate-y-1/2`} />
            </div>
            
            {/* Botones de acción */}
            <div className="flex space-x-2">
              <button
                onClick={handleCsvButtonClick}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </button>
              <button
                onClick={() => setShowNewLeadModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
            {/* Tabla */}
            <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              {['Nombre', 'Email', 'Teléfono', 'Estado', 'Origen', 'Fecha'].map((header) => (
                <th
                  key={header}
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  } uppercase tracking-wider cursor-pointer transition-colors duration-200`}
                  onClick={() => handleSort(header.toLowerCase() as keyof Lead)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
              ))}
              <th className={`px-6 py-3 text-right text-xs font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className={`${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-blue-300'
                          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600'
                      } flex items-center justify-center`}>
                        <span className="font-medium text-sm">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>{lead.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                  }`}>{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                  }`}>{lead.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                    {getStatusText(lead.status)}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {lead.origen}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className={`${
                      theme === 'dark'
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700'
                        : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                    } mr-3 p-2 rounded-full transition-colors duration-200`}
                    title="Editar"
                    onClick={() => openEditModal(lead)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    className={`${
                      theme === 'dark'
                        ? 'text-red-400 hover:text-red-300 hover:bg-gray-700'
                        : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                    } p-2 rounded-full transition-colors duration-200`}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditLeadModal && currentLead && (
      <EditLeadPopup
        lead={currentLead}
        onClose={() => setShowEditLeadModal(false)}
        onSubmit={handleEditLead}
        selectedInterests={selectedInterests}
        handleInterestToggle={handleInterestToggle}
        interestCategories={interestCategories}
        origenOptions={origenOptions}
        setSelectedInterests={setSelectedInterests}
      />
    )}
      {/* Modal de nuevo lead */}
      {showNewLeadModal && (
        <CrearLeadPopup
          onClose={() => setShowNewLeadModal(false)}
          onSubmit={handleCreateLead}
          selectedInterests={selectedInterests}
          handleInterestToggle={handleInterestToggle}
          interestCategories={interestCategories}
          origenOptions={origenOptions}
        />
      )}


      {/* CSV Preview Modal */}
      {showCsvPreview && (
        <CsvPreview
          csvData={csvData}
          onConfirm={handleCsvConfirm}
          onCancel={handleCsvCancel}
        />
      )}
    </div>
  );
}
