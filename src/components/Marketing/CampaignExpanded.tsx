import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Mail, Users, Calendar, BarChart, Search, 
  Clock, CheckCircle2, AlertCircle, Inbox, 
  ArrowUpRight, ChevronDown, Filter,
  Settings, Plus, GripVertical, Edit2, Trash2,
  Save, PlusCircle, Send, Pause, Play, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { ManageStagePopup } from './ManageStagePopup';
import { GestionSegmento } from './GestionSegmento';
import PipelineStages from './PipelineStages';
import SeccionPipeline from './SeccionPipeline';
import { useTheme } from '../../contexts/ThemeContext';


interface EmailItem {
  id: string;
  recipient: string;
  email: string;
  status: 'sent' | 'received' | 'opened' | 'clicked' | 'converted';
  date: string;
}

interface PipelineStage {
  name: string;
  count: number;
  percentage: number;
  emails: EmailItem[];
  _id?: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  pipeline: PipelineStage[];
  status?: 'active' | 'paused';
}

interface CampaignOriginal {
  _id: string;
  nombre: string;
  descripcion: string;
  tags: Array<{ name: string; _id: string }>;
  numeroProductos: number;
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
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaProgramada?: string;
  pipeline?: {
    etapas: any[];
  };
}

interface CampaignExpandedProps {
  campaign: Campaign;
  originalCampaign: CampaignOriginal;
  campaignId: string; // Add this line
  onClose: () => void;
}

interface Segment {
  _id: string;
  name: string;
  description: string;
  clients: Array<{
    _id: string;
    email: string;
    dietaActiva?: any;
    planningActivo?: any;
  }>;
  leads: Array<{
    _id: string;
    email: string;
    name: string;
    phone: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Update the function signature to include campaignId
export function CampaignExpanded({ campaign, originalCampaign, campaignId, onClose }: CampaignExpandedProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [showEmailStats, setShowEmailStats] = useState(false);
  const [isCustomizingPipeline, setIsCustomizingPipeline] = useState(false);
  const [customPipeline, setCustomPipeline] = useState(campaign.pipeline || []);
  const [campaignStatus, setCampaignStatus] = useState<'active' | 'paused'>(campaign.status || 'active');  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [editingStage, setEditingStage] = useState<{ index: number; name: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);
  const [newEmail, setNewEmail] = useState({ recipient: '', email: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: '',
    selectedEmails: [] as string[]
  });
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isLoadingSegments, setIsLoadingSegments] = useState(false);
  const [stageViewModes, setStageViewModes] = useState<Record<number, 'clients' | 'emails'>>({});
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({});
  const [showManageStagePopup, setShowManageStagePopup] = useState(false);
  const [showGestionSegmento, setShowGestionSegmento] = useState(false);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        // Use campaignId instead of campaign.id
        const response = await axios.get(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo/${campaignId}`);
        console.log('Datos originales de la campaña:', response.data);
        setCampaignData(response.data);
        
        // Update the customPipeline with the fetched data
        if (response.data && response.data.pipeline && response.data.pipeline.etapas) {
          const fetchedPipeline = response.data.pipeline.etapas.map((etapa: any) => ({
            name: etapa.nombre,
            count: etapa.emails?.length || 0,
            percentage: response.data.estadisticas.enviados > 0 
              ? (etapa.emails?.length / response.data.estadisticas.enviados) * 100 
              : 0,
            emails: etapa.emails || [],
            _id: etapa._id
          }));
          
          console.log('Pipeline transformado:', fetchedPipeline);
          setCustomPipeline(fetchedPipeline);
        }
      } catch (error) {
        console.error('Error al obtener datos de la campaña:', error);
      }
    };
    
    fetchCampaignData();
  }, [campaignId]); // Update dependency array to use campaignId

  const filteredEmails = campaign?.pipeline
    ? campaign.pipeline
        .flatMap(stage => stage.emails)
        .filter(email => 
          email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

    const emailStats = {
      delivered: campaign?.pipeline?.find(s => s.name === 'Recibidos')?.percentage || 0,
      bounced: 100 - (campaign?.pipeline?.find(s => s.name === 'Recibidos')?.percentage || 0),
      spam: 2.1,
      avgOpenTime: '2.5 horas',
      deviceStats: {
        mobile: 65,
        desktop: 30,
        tablet: 5
      },
      timeStats: [
        { hour: '8:00', opens: 120 },
        { hour: '10:00', opens: 350 },
        { hour: '12:00', opens: 280 },
        { hour: '14:00', opens: 220 },
        { hour: '16:00', opens: 180 },
      ]
    };
  
  const handleAddStage = () => {
    const newStage = {
      name: 'Nueva Etapa',
      count: 0,
      percentage: 0,
      emails: [],
      _id: `temp-${Date.now()}` // ID temporal para nuevas etapas
    };
    setCustomPipeline([...customPipeline, newStage]);
  };

  const handleUpdateStageName = async (index: number, newName: string) => {
    try {
      setSaveMessage(null);
      const token = localStorage.getItem('token');

      // Datos para enviar a la API
      const updateData = {
        etapaIndex: index,
        nuevoNombre: newName
      };

      console.log('Datos enviados a la API:', {
        url: `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo/${campaign.id}/etapa-nombre`,
        data: updateData,
        token
      });

      const response = await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo/${campaignId}/etapa-nombre`, // Use campaignId
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta de la API:', response.data);

      // Actualizar el estado local solo si la API responde exitosamente
      const updatedPipeline = [...customPipeline];
      updatedPipeline[index] = { 
        ...updatedPipeline[index], 
        name: newName
      };
      setCustomPipeline(updatedPipeline);
      setEditingStage(null);
      setSaveMessage({ type: 'success', text: 'Nombre de etapa actualizado con éxito' });

      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Error al actualizar el nombre de la etapa:', error);
      console.log('Detalles del error:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      setSaveMessage({ type: 'error', text: 'Error al actualizar el nombre de la etapa' });
      setEditingStage(null);
    }
  };

  const handleDeleteStage = async (index: number) => {
    try {
      // Por ahora solo actualizamos la UI
      const updatedPipeline = customPipeline.filter((_, i) => i !== index);
      setCustomPipeline(updatedPipeline);
    } catch (error) {
      console.error('Error al eliminar la etapa:', error);
      setSaveMessage({ type: 'error', text: 'Error al eliminar la etapa' });
    }
  };

  const handleSavePipeline = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      const token = localStorage.getItem('token');
      
      // Transformar el pipeline al formato esperado por la API
      const pipelineData = {
        etapas: customPipeline.map(stage => ({
          nombre: stage.name,
          correos: stage.emails || [],
          _id: stage._id // Mantener el ID si existe
        }))
      };

      await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campaign/${campaign.id}/pipeline`,
        { pipeline: pipelineData },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Actualizar el pipeline local
      campaign.pipeline = customPipeline;
      setIsCustomizingPipeline(false);
      setSaveMessage({ type: 'success', text: 'Pipeline actualizado con éxito' });
      
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error al guardar el pipeline:', error);
      setSaveMessage({ type: 'error', text: 'Error al guardar los cambios del pipeline' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveStage = (fromIndex: number, toIndex: number) => {
    const updatedPipeline = [...customPipeline];
    const [movedStage] = updatedPipeline.splice(fromIndex, 1);
    updatedPipeline.splice(toIndex, 0, movedStage);
    setCustomPipeline(updatedPipeline);
  };

  const handleAddEmail = async (stageIndex: number) => {
    try {
      const token = localStorage.getItem('token');
      
      // Validar el email
      if (!newEmail.email || !newEmail.recipient) {
        setSaveMessage({ type: 'error', text: 'Por favor completa todos los campos' });
        return;
      }

      const emailData = {
        ...newEmail,
        id: `email-${Date.now()}`,
        status: 'sent',
        date: new Date().toISOString()
      };

      console.log('Añadiendo correo a la etapa:', {
        stageIndex,
        emailData
      });

      const response = await axios.post(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo/${campaign.id}/etapa/${stageIndex}/correo`,
        emailData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta de la API:', response.data);

      // Actualizar el estado local
      const updatedPipeline = [...customPipeline];
      if (!updatedPipeline[stageIndex].emails) {
        updatedPipeline[stageIndex].emails = [];
      }
      updatedPipeline[stageIndex].emails.push(emailData);
      setCustomPipeline(updatedPipeline);

      // Limpiar el formulario y cerrar el modal
      setNewEmail({ recipient: '', email: '' });
      setShowAddEmailModal(false);
      setSaveMessage({ type: 'success', text: 'Correo añadido con éxito' });

      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error al añadir correo:', error);
      setSaveMessage({ type: 'error', text: 'Error al añadir el correo' });
    }
  };

  const handleSendEmail = async (stageIndex: number) => {
    try {
      setIsSendingEmail(true);
      const token = localStorage.getItem('token');
      
      console.log('Enviando email:', {
        stageIndex,
        emailContent
      });

      const response = await axios.post(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo/${campaign.id}/etapa/${stageIndex}/enviar-email`,
        {
          subject: emailContent.subject,
          body: emailContent.body,
          recipients: emailContent.selectedEmails
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta de la API:', response.data);

      setSaveMessage({ type: 'success', text: 'Emails enviados con éxito' });
      setShowSendEmailModal(false);
      setEmailContent({
        subject: '',
        body: '',
        selectedEmails: []
      });

      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Error al enviar emails:', error);
      setSaveMessage({ type: 'error', text: 'Error al enviar los emails' });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const fetchSegments = async () => {
    setIsLoadingSegments(true);
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      console.log('Token obtenido:', token?.substring(0, 20) + '...');
      
      if (!token) {
        console.error('No se encontró el token de autorización');
        return;
      }

      console.log('Iniciando petición a la API de segmentos...');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Estado de la respuesta:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos recibidos de la API:', data);
      console.log('Tipo de data:', typeof data);
      console.log('¿Es un array?', Array.isArray(data));
      
      if (Array.isArray(data)) {
        console.log('Número de segmentos:', data.length);
        console.log('Primer segmento:', data[0]);
      } else if (data.segments) {
        console.log('Número de segmentos en data.segments:', data.segments.length);
        console.log('Primer segmento en data.segments:', data.segments[0]);
      }

      setSegments(Array.isArray(data) ? data : data.segments || []);
      console.log('Segments establecidos en el estado:', segments);
    } catch (error) {
      console.error('Error detallado al obtener segmentos:', error);
      setSegments([]);
    } finally {
      setIsLoadingSegments(false);
    }
  };

  const handleOpenAddEmailModal = (index: number) => {
    setSelectedStageIndex(index);
    setShowAddEmailModal(true);
    fetchSegments();
  };

  const handleCampaignStatusToggle = async () => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = campaignStatus === 'active' ? 'paused' : 'active';
      
      const token = localStorage.getItem('token');
      await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo/${campaign.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setCampaignStatus(newStatus);
      setSaveMessage({ 
        type: 'success', 
        text: `Campaña ${newStatus === 'active' ? 'reanudada' : 'pausada'} con éxito` 
      });

      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating campaign status:', error);
      setSaveMessage({ 
        type: 'error', 
        text: 'Error al actualizar el estado de la campaña' 
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSegmentClick = () => {
    console.log('Abriendo gestión de segmentos...');
    console.log('ID de campaña a pasar:', originalCampaign._id);
    console.log('Campaña original completa:', originalCampaign);
    setShowGestionSegmento(true);
  };

  const handleCopyCampaign = () => {
    setNewCampaignName(`Copia de ${campaign.name}`);
    setShowCopyModal(true);
  };

  const handleConfirmCopy = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campaign/${campaign.id}/copy`,
        { nombre: newCampaignName },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Mostrar mensaje de éxito y cerrar los modales
      setSaveMessage({ type: 'success', text: 'Campaña copiada con éxito' });
      setShowCopyModal(false);
      setTimeout(() => {
        setSaveMessage(null);
        onClose(); // Cerrar el modal principal después de copiar
      }, 2000);
    } catch (error) {
      console.error('Error al copiar la campaña:', error);
      setSaveMessage({ type: 'error', text: 'Error al copiar la campaña' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl`}>
        {/* Header con gradiente */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
              <p className="text-blue-100">{campaign.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyCampaign}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-blue-500 hover:bg-blue-600 text-white"
              >
                <PlusCircle className="w-4 h-4" />
                Hacer copia de campaña
              </button>
              <button
                onClick={handleCampaignStatusToggle}
                disabled={isUpdatingStatus}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isUpdatingStatus 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : campaignStatus === 'active'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isUpdatingStatus ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : campaignStatus === 'active' ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {campaignStatus === 'active' ? 'Pausar Campaña' : 'Reanudar Campaña'}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5" />
                <span className="text-sm font-medium">Enviados</span>
              </div>
              <p className="text-2xl font-bold">{campaign.recipients}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Tasa de Apertura</span>
              </div>
              <p className="text-2xl font-bold">{(campaign.openRate || 0).toFixed(1)}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-5 h-5" />
                <span className="text-sm font-medium">Tasa de Clics</span>
              </div>
              <p className="text-2xl font-bold">{(campaign.clickRate || 0).toFixed(1)}%</p>
            </div>            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Fecha de Envío</span>
              </div>
              <p className="text-sm font-medium">{new Date(campaign.sentDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Content area with scroll */}
        <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <SeccionPipeline 
            customPipeline={customPipeline}
            isCustomizingPipeline={isCustomizingPipeline}
            editingStage={editingStage}
            expandedStages={expandedStages}
            saveMessage={saveMessage}
            segmentosLength={originalCampaign.segmentos?.length || 0}
            setCustomPipeline={setCustomPipeline}
            setEditingStage={setEditingStage}
            setExpandedStages={setExpandedStages}
            setSelectedStageIndex={setSelectedStageIndex}
            setShowManageStagePopup={setShowManageStagePopup}
            setIsCustomizingPipeline={setIsCustomizingPipeline}
            setSaveMessage={setSaveMessage}
            handleUpdateStageName={handleUpdateStageName}
            handleAddStage={handleAddStage}
            handleSegmentClick={handleSegmentClick}
            campaignPipeline={campaign.pipeline}
          />
        </div>
      </div>

      {/* Modal para gestionar etapa */}
      {showManageStagePopup && selectedStageIndex !== null && (
    <ManageStagePopup
      onClose={() => setShowManageStagePopup(false)}
      campaignId={campaignId}
      stageIndex={selectedStageIndex}
      stageName={customPipeline[selectedStageIndex]?.name || ''}
      stageEmails={customPipeline[selectedStageIndex]?.emails || []}
      onEmailsUpdated={(newEmails) => {
        // Create a copy of the pipeline
        const updatedPipeline = [...customPipeline];
        // Update the emails for the selected stage
        updatedPipeline[selectedStageIndex] = {
          ...updatedPipeline[selectedStageIndex],
          emails: newEmails
        };
        // Update the state
        setCustomPipeline(updatedPipeline);
        console.log("Updated stage emails:", newEmails);
      }}
    />
  )}
      {showGestionSegmento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <GestionSegmento 
              campaign={originalCampaign} 
              onClose={() => setShowGestionSegmento(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para nombrar la copia de campaña */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md`}>
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Nombre de la nueva campaña</h3>
            <input
              type="text"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'border border-gray-300 text-gray-700'
              }`}
              placeholder="Introduce el nombre de la campaña"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCopyModal(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCopy}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Crear copia
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}