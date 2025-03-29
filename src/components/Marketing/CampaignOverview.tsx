import React, { useState, useEffect } from 'react';
import { BarChart2, Plus, Settings, Users, Mail, TrendingUp, MousePointerClick, UserCheck, Filter } from 'lucide-react';
import { LeadsTable } from './LeadsTable';
import { Pipeline } from './Pipeline';
import { motion } from 'framer-motion';
import { EmailCampaign } from './EmailCampaign';
import { Automations } from './Automations';
import { Segments } from './Segments';
import { CampaignExpanded } from './CampaignExpanded';
import { CampañaUnica } from './CampañaUnica';
import axios from 'axios';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Tag {
  name: string;
  _id: string;
}

interface Segment {
  _id: string;
  name: string;
  description: string;
}

interface Estadisticas {
  enviados: number;
  abiertos: number;
  clicks: number;
}

interface Campaign {
  _id: string;
  nombre: string;
  descripcion: string;
  tags: Tag[];
  numeroProductos: number;
  segmentos: Segment[];
  estado: string;
  estadisticas: Estadisticas;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaProgramada?: string;
  pipeline?: {
    etapas: any[];
  };
}

interface TransformedCampaign {
  id: string;
  name: string;
  description: string;
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  pipeline: {
    name: string;
    count: number;
    percentage: number;
    emails: any[];
    _id: string;
  }[];
  segmentos: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  status: string;
}

export function CampaignOverview() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const [showEmailCampaign, setShowEmailCampaign] = useState(false);
  const [showAutomations, setShowAutomations] = useState(false);
  const [showSegments, setShowSegments] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<TransformedCampaign | null>(null);
  const [selectedOriginalCampaign, setSelectedOriginalCampaign] = useState<Campaign | null>(null);
  const [showCampañaUnica, setShowCampañaUnica] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    estado: 'todos',
    searchTerm: '',
    selectedTags: [] as string[]
  });
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
  
        const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Respuesta completa de la API:', response);
        console.log('Datos de campañas recibidos:', response.data);
  
        // Aseguramos que cada campaña tenga definidos los segmentos como un arreglo
        const campaignsData = response.data.map((campaign: any) => ({
          ...campaign,
          segmentos: Array.isArray(campaign.segmentos) ? campaign.segmentos : [],
        }));
  
        setCampaigns(campaignsData);
        setLoading(false);
      } catch (error) {
        console.error('Error detallado al obtener campañas:', error);
        if (axios.isAxiosError(error)) {
          console.log('Respuesta de error:', error.response);
          console.log('Configuración de la petición:', error.config);
        }
        setError('Error al cargar las campañas');
        setLoading(false);
      }
    };
  
    fetchCampaigns();
  }, []); // Add this closing bracket and empty dependency array
  
  const transformCampaignData = (data: any) => {
    console.log('transformCampaignData - Input data:', data);
    if (!data) return null;
  
    // Función de transformación para una sola campaña
    const transform = (campaign: any) => {
      console.log('transform - Processing campaign:', campaign);
      console.log('transform - Pipeline structure:', campaign.pipeline);
      
      // Transformar las etapas del pipeline si existen y son un arreglo
      let pipelineStages = [];
      
      try {
        if (campaign.pipeline && typeof campaign.pipeline === 'object') {
          console.log('transform - Pipeline exists:', campaign.pipeline);
          
          if (Array.isArray(campaign.pipeline.etapas)) {
            console.log('transform - Etapas is array with length:', campaign.pipeline.etapas.length);
            
            pipelineStages = campaign.pipeline.etapas.map((etapa: any, index: number) => {
              console.log(`transform - Processing etapa ${index}:`, etapa);
              
              // Verificamos que etapa.correos sea un array antes de acceder a length
              const correosArray = Array.isArray(etapa?.correos) ? etapa.correos : [];
              console.log(`transform - Etapa ${index} correos array:`, correosArray);
              
              return {
                name: etapa?.nombre || 'Sin nombre',
                count: correosArray.length,
                percentage:
                  campaign.estadisticas?.enviados > 0
                    ? (correosArray.length / campaign.estadisticas.enviados) * 100
                    : 0,
                emails: correosArray,
                _id: etapa?._id || `etapa-${Math.random()}`,
              };
            });
          } else {
            console.log('transform - Etapas is not an array:', campaign.pipeline.etapas);
          }
        } else {
          console.log('transform - No pipeline or invalid pipeline structure');
        }
      } catch (error) {
        console.error('transform - Error processing pipeline:', error);
      }
  
      // Aseguramos que los segmentos sean un arreglo
      const segmentos = Array.isArray(campaign.segmentos) ? campaign.segmentos : [];
      console.log('transform - Segmentos:', segmentos);
  
      // Crear el objeto transformado
      const transformed = {
        id: campaign._id,
        name: campaign.nombre,
        description: campaign.descripcion,
        sentDate: campaign.fechaCreacion,
        recipients: campaign.estadisticas?.enviados || 0,
        openRate:
          campaign.estadisticas?.enviados > 0
            ? (campaign.estadisticas.abiertos / campaign.estadisticas.enviados) * 100
            : 0,
        clickRate:
          campaign.estadisticas?.enviados > 0
            ? (campaign.estadisticas.clicks / campaign.estadisticas.enviados) * 100
            : 0,
        pipeline:
          pipelineStages.length > 0
            ? pipelineStages
            : [
                {
                  name: 'Enviados',
                  count: campaign.estadisticas?.enviados || 0,
                  percentage: 100,
                  emails: [],
                  _id: 'enviados',
                },
                {
                  name: 'Recibidos',
                  count: campaign.estadisticas?.enviados || 0,
                  percentage: 98,
                  emails: [],
                  _id: 'recibidos',
                },
                {
                  name: 'Abiertos',
                  count: campaign.estadisticas?.abiertos || 0,
                  percentage:
                    campaign.estadisticas?.enviados > 0
                      ? (campaign.estadisticas.abiertos / campaign.estadisticas.enviados) * 100
                      : 0,
                  emails: [],
                  _id: 'abiertos',
                },
                {
                  name: 'Clicks',
                  count: campaign.estadisticas?.clicks || 0,
                  percentage:
                    campaign.estadisticas?.enviados > 0
                      ? (campaign.estadisticas.clicks / campaign.estadisticas.enviados) * 100
                      : 0,
                  emails: [],
                  _id: 'clicks',
                },
              ],
        status: campaign.estado === 'activa' ? 'active' : 'paused',
        segmentos: segmentos,
      };
      
      console.log('transform - Transformed campaign:', transformed);
      return transformed;
    };
  
    // Si se recibe un arreglo, transformamos cada elemento; de lo contrario, transformamos la campaña individual
    const result = Array.isArray(data) ? data.map(transform) : transform(data);
    console.log('transformCampaignData - Final result:', result);
    return result;
  };
  
  // Update the click handler to simply open CampaignExpanded
  const handleCampaignClick = (campaign: Campaign) => {
    console.log('Campaña original seleccionada:', campaign);
    
    // Establecemos la campaña original
    setSelectedOriginalCampaign(campaign);
    
    // Establecemos la campaña seleccionada directamente
    setSelectedCampaign({
      id: campaign._id,
      name: campaign.nombre,
      description: campaign.descripcion,
      sentDate: campaign.fechaCreacion,
      recipients: campaign.estadisticas?.enviados || 0,
      openRate: 0,
      clickRate: 0,
      pipeline: [],
      status: campaign.estado === 'activa' ? 'active' : 'paused',
      segmentos: campaign.segmentos || []
    });
    
    // Cerrar otros componentes para asegurar que solo se muestre CampaignExpanded
    setShowEmailCampaign(false);
    setShowAutomations(false);
    setShowSegments(false);
    setShowCampañaUnica(false);
  };  
  // Obtener todos los tags únicos de las campañas
  const allTags = Array.from(new Set(campaigns.flatMap(campaign => campaign.tags.map(tag => tag.name))));
  
  const filteredCampaigns = campaigns.filter(campaign => {
    // Filtro por estado
    if (filters.estado !== 'todos' && campaign.estado !== filters.estado) return false;
    
    // Filtro por término de búsqueda
    if (filters.searchTerm && !campaign.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    
    // Filtro por tags
    if (filters.selectedTags.length > 0) {
      const campaignTagNames = campaign.tags.map(tag => tag.name);
      if (!filters.selectedTags.every(tag => campaignTagNames.includes(tag))) return false;
    }
    
    return true;
  });
  
  return (
    <>
 <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`campaign-overview ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'} min-h-screen relative overflow-hidden rounded-xl shadow-lg`}
      >        {/* Decorative elements */}
        <div className={`absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-blue-100 to-purple-100'} rounded-full filter blur-3xl opacity-50`} />
        <div className={`absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 ${isDark ? 'bg-gradient-to-tr from-emerald-900/30 to-blue-900/30' : 'bg-gradient-to-tr from-emerald-100 to-blue-100'} rounded-full filter blur-3xl opacity-50`} />

        <motion.div variants={itemVariants} className="relative">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
            <div className={`p-3 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
            <BarChart2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight`}>
                    Panel de Correos
                  </h1>
                  <div className={`absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full opacity-60 animate-pulse`}></div>
                </div>
                <span className={`
                  text-sm font-semibold
                  bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-100/50
                  px-4 py-2 rounded-full
                  flex items-center gap-2
                  shadow-lg
                  hover:shadow-xl
                  transform hover:scale-105
                  transition-all duration-300 ease-out
                  animate-fadeIn
                  relative
                  overflow-hidden
                  group
                `}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <Mail className="w-4 h-4 text-blue-600 animate-pulse transform group-hover:rotate-12 transition-all duration-300" />
                  <span className="relative">Gestión de Correos</span>
                </span>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2" />
          </div>

          {/* Metric Cards */}
          <div className="stats-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              variants={itemVariants}
              className={`stat-card ${isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-700' 
                : 'bg-gradient-to-br from-white to-blue-50 border-blue-100'} 
                rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>2,567</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Emails</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`stat-card ${isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-700' 
                : 'bg-gradient-to-br from-white to-green-50 border-green-100'} 
                rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                  <MousePointerClick className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>45.8%</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Apertura</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`stat-card ${isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-700' 
                : 'bg-gradient-to-br from-white to-purple-50 border-purple-100'} 
                rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>892</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Suscriptores</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`stat-card ${isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-700' 
                : 'bg-gradient-to-br from-white to-emerald-50 border-emerald-100'} 
                rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>23.5%</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Conversión</p>
            </motion.div>
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-12 gap-8 mb-8">
            {/* Campañas de correo */}
            <motion.div 
              variants={itemVariants}
              className={`col-span-12 lg:col-span-7 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg p-8 border`}
            >

              <div className="mb-8">
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>Campañas de correo</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Gestiona tus campañas y automatizaciones desde aquí
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"></div>
              </div>
              
              <div className="w-full mx-auto mb-8">
                <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                  {loading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="text-red-500 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Sticky header for total campaigns */}
                      <div className={`sticky top-0 z-10 ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm p-4 rounded-xl shadow-sm mb-6`}>
                        <div className="flex items-center justify-between">
                          <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Total campañas: {filteredCampaigns.length}
                          </div>
                          <div className="flex items-center gap-4">
                            
                            <div className="flex gap-4">
                            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Activas: {campaigns.filter(c => c.estado === 'activa').length}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Borradores: {campaigns.filter(c => c.estado === 'borrador').length}
                              </div>

                              <div className="relative">
                              <Button
                                variant="filter"
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center gap-2"
                              >
                                <Filter className="w-4 h-4" />
                                Filtrar
                              </Button>                              
                              {filterOpen && (
                                <div className={`absolute right-0 mt-2 w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow-lg border p-4 z-50`}>
                                  <div className="space-y-4">
                                    <div>
                                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Estado
                                      </label>
                                      <select
                                        value={filters.estado}
                                        onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                                        className={`w-full rounded-md border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'} shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                      >

                                        <option value="todos">Todos</option>
                                        <option value="activa">Activa</option>
                                        <option value="borrador">Borrador</option>
                                        <option value="programada">Programada</option>
                                      </select>
                                    </div>
                                    
                                    <div>
                                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Buscar
                                      </label>
                                      <input
                                        type="text"
                                        value={filters.searchTerm}
                                        onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                                        placeholder="Buscar por nombre..."
                                        className={`w-full rounded-md border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-700'} shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                      />
                                    </div>

                                    <div>
                                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Tags
                                      </label>
                                      <div className={`space-y-2 max-h-40 overflow-y-auto ${isDark ? 'scrollbar-dark' : ''}`}>
                                        {allTags.map((tag) => (
                                          <label key={tag} className={`flex items-center space-x-2 p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded`}>
                                            <input
                                              type="checkbox"
                                              checked={filters.selectedTags.includes(tag)}
                                              onChange={(e) => {
                                                setFilters(prev => ({
                                                  ...prev,
                                                  selectedTags: e.target.checked
                                                    ? [...prev.selectedTags, tag]
                                                    : prev.selectedTags.filter(t => t !== tag)
                                                }));
                                              }}
                                              className={`rounded ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'} text-blue-600 focus:ring-blue-500`}
                                            />
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{tag}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>

                                    {filters.selectedTags.length > 0 && (
                                      <div className="pt-2">
                                        <div className="flex flex-wrap gap-2">
                                          {filters.selectedTags.map((tag) => (
                                                                                      <span
                                                                                      key={tag}
                                                                                      className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}
                                                                                    >
                                        
                                              {tag}
                                              <button
                                                onClick={() => setFilters(prev => ({
                                                  ...prev,
                                                  selectedTags: prev.selectedTags.filter(t => t !== tag)
                                                }))}
                                                className={`ml-1 ${isDark ? 'hover:text-blue-100' : 'hover:text-blue-800'}`}
                                              >
                                                ×
                                              </button>
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {filteredCampaigns.map((campaign) => (
                                         <motion.div
                                         key={campaign._id}
                                         variants={itemVariants}
                                         className={`${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-100 hover:bg-gray-50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border group cursor-pointer hover:-translate-y-1`}
                                         onClick={() => handleCampaignClick(campaign)}
                                       >
               
                          <div className="relative">
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-[#FF1B7A] to-purple-600 p-6 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-full bg-white/5 transform -skew-y-12"></div>
                              <div className="relative flex items-start justify-between">
                                <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">{campaign.nombre}</h3>                                  <p className="text-pink-100 text-sm line-clamp-2">{campaign.descripcion}</p>
                                </div>
                                <span className={`ml-4 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transform transition-all duration-300 group-hover:scale-105 ${
                                  campaign.estado === 'borrador' ? 'bg-white/90 text-gray-700' :
                                  campaign.estado === 'programada' ? 'bg-blue-400 text-white' :
                                  'bg-green-400 text-white'
                                } shadow-lg`}>
                                  {campaign.estado.charAt(0).toUpperCase() + campaign.estado.slice(1)}
                                </span>
                              </div>
                            </div>

                            {/* Tags section with overlap */}
                            <div className="flex flex-wrap gap-2 px-6 -mt-3 relative z-10">
                              {campaign.tags.map((tag) => (
                                                               <span
                                                               key={tag._id}
                                                               className={`${isDark ? 'bg-gray-800 text-[#FF1B7A] border-pink-900' : 'bg-white text-[#FF1B7A] border-pink-100'} text-xs px-4 py-1.5 rounded-full font-medium shadow-md border transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                                             >
                                                               {tag.name}
                                                             </span>
                             
                              ))}
                            </div>

                            {/* Main content */}
                            <div className="p-6 space-y-6">
                              {/* Metadata section */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className={`${isDark 
                                  ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' 
                                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'} 
                                  rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md border`}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <Users className="w-5 h-5 text-[#FF1B7A]" />
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Segmentos
                                    </span>
                                  </div>
                                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {campaign.segmentos?.length ?? 0}
                                  </div>
                                </div>
                                <div className={`${isDark 
                                  ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' 
                                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'} 
                                  rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md border`}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <Mail className="w-5 h-5 text-[#FF1B7A]" />
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      Productos
                                    </span>
                                  </div>
                                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {campaign.numeroProductos}
                                  </div>
                                </div>
                              </div>

                              {/* Statistics section */}
                              <div className={`${isDark 
                                ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' 
                                : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'} 
                                rounded-xl p-6 border transform transition-all duration-300 hover:shadow-md`}>
                                <div className="grid grid-cols-3 gap-6">
                                  <div className="text-center transform transition-all duration-300 hover:scale-105">
                                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                                      {campaign.estadisticas.enviados}
                                    </div>
                                    <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Enviados
                                    </div>
                                    <div className={`mt-2 h-1.5 ${isDark ? 'bg-pink-900/30' : 'bg-pink-100'} rounded-full overflow-hidden`}>
                                      <div className="h-full bg-[#FF1B7A] rounded-full" style={{width: '100%'}}></div>
                                    </div>
                                  </div>
                                  <div className="text-center transform transition-all duration-300 hover:scale-105">
                                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                                      {campaign.estadisticas.abiertos}
                                    </div>
                                    <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Abiertos
                                    </div>
                                    <div className={`mt-2 h-1.5 ${isDark ? 'bg-pink-900/30' : 'bg-pink-100'} rounded-full overflow-hidden`}>
                                      <div 
                                        className="h-full bg-[#FF1B7A] rounded-full" 
                                        style={{
                                          width: `${campaign.estadisticas.enviados ? Math.round((campaign.estadisticas.abiertos / campaign.estadisticas.enviados) * 100) : 0}%`
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="text-center transform transition-all duration-300 hover:scale-105">
                                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                                      {campaign.estadisticas.clicks}
                                    </div>
                                    <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Clicks
                                    </div>
                                    <div className={`mt-2 h-1.5 ${isDark ? 'bg-pink-900/30' : 'bg-pink-100'} rounded-full overflow-hidden`}>
                                      <div 
                                        className="h-full bg-[#FF1B7A] rounded-full" 
                                        style={{
                                          width: `${campaign.estadisticas.enviados ? Math.round((campaign.estadisticas.clicks / campaign.estadisticas.enviados) * 100) : 0}%`
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sección de acciones rápidas */}
            <motion.div 
              variants={itemVariants}
              className={`col-span-12 lg:col-span-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg p-8 border`}
            >
              <div className="mb-8">
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>
                  Acciones Rápidas
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Gestiona tus campañas y automatizaciones desde aquí
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"></div>
              </div>
              

              
              <div className="flex flex-col gap-4 h-[calc(100%-2rem)]">
              <Button
                  variant="create"
                  onClick={() => setShowEmailCampaign(true)}
                  className={`group relative w-full h-48 flex items-center gap-4 overflow-hidden ${isDark ? 'hover:bg-pink-900/20' : ''}`}
                >
                  <div className="p-4 ml-6 bg-opacity-30 rounded-xl">
                    <Plus className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-xl font-bold mb-2">Crear Campaña</span>
                    <span className="text-sm opacity-90">Crea y configura una nueva campaña de marketing</span>
                  </div>
                  <div className="mr-6 group-hover:translate-x-2 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>
                
                {/* Similar changes for other buttons */}

                <Button
                  variant="info"
                  onClick={() => setShowAutomations(true)}
                  className={`group relative w-full h-52 flex items-center gap-4 overflow-hidden ${isDark ? 'hover:bg-blue-900/20' : ''}`}
                >
                  <div className="p-4 ml-6 bg-opacity-30 rounded-xl">
                    <Settings className="h-8 w-8 animate-spin-slow" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-xl font-bold mb-2">Automatizaciones</span>
                    <span className="text-sm opacity-90">Configura y gestiona los flujos automáticos</span>
                  </div>
                  <div className="mr-6 group-hover:translate-x-2 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>

                <Button
                  variant="nature"
                  onClick={() => setShowSegments(true)}
                  className={`group relative w-full h-44 flex items-center gap-4 overflow-hidden ${isDark ? 'hover:bg-green-900/20' : ''}`}
                >
                  <div className="p-4 ml-6 bg-opacity-30 rounded-xl">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-xl font-bold mb-2">Segmentos</span>
                    <span className="text-sm opacity-90">Administra y organiza los grupos de usuarios</span>
                  </div>
                  <div className="mr-6 group-hover:translate-x-2 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>

              </div>
            </motion.div>
          </div>

          {/* Contenido restante */}
          <div className="grid grid-cols-12 gap-8">
          <motion.div variants={itemVariants} className="col-span-12 space-y-8">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm p-6 campaign-table ${isDark ? 'border border-gray-700' : ''}`}>
                <LeadsTable />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Modales */}
        {showEmailCampaign && (
          <EmailCampaign onClose={() => setShowEmailCampaign(false)} />
        )}
        {showAutomations && (
          <Automations onClose={() => setShowAutomations(false)} />
        )}
        {showSegments && (
          <Segments onClose={() => setShowSegments(false)} />
        )}
        {selectedCampaign && selectedOriginalCampaign && (
          <CampaignExpanded
            campaign={selectedCampaign}
            originalCampaign={selectedOriginalCampaign}
            campaignId={selectedOriginalCampaign._id} // Make sure this is correctly passed
            onClose={() => {
              setSelectedCampaign(null);
              setSelectedOriginalCampaign(null);
            }}
          />
        )}
      </motion.main>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c7d2fe;
            border-radius: 4px;
            transition: all 0.2s;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #818cf8;
          }
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #c7d2fe #f1f1f1;
          }
        `}
      </style>
    </>
  );
};