import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, Send, X } from 'lucide-react';
import axios from 'axios';
import { SegmentModal } from './components/SegmentModal';
import { EmailConfigurationPanel } from './components/EmailConfigurationPanel';
import { useTheme } from '../../contexts/ThemeContext';

interface Segment {
  _id: string;
  name: string;
}

interface Tag {
  name: string;
}

interface Email {
  asunto: string;
  contenido: string;
}

interface Etapa {
  nombre: string;
  emails: Email[];
}

interface EmailCampaignProps {
  onClose: () => void;
}

export function EmailCampaign({ onClose }: EmailCampaignProps) {
  const { theme } = useTheme();

  const [step, setStep] = useState(1);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [campaignData, setCampaignData] = useState({
    nombre: '',
    descripcion: '',
    tags: [] as Tag[],
    numeroProductos: 0,
    segmentos: [] as string[],
    etapas: [] as Etapa[]
  });
  const [showSegmentModal, setShowSegmentModal] = useState(false);

  const [segmentData, setSegmentData] = useState({
    name: '',
    description: '',
    selectedClients: [] as string[],
    selectedLeads: [] as string[]
  });
  const [clientFilterState, setClientFilterState] = useState({ isOpen: false });
  const [leadFilterState, setLeadFilterState] = useState({ isOpen: false });

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSegments(response.data);
      } catch (error) {
        console.error('Error fetching segments:', error);
      }
    };

    fetchSegments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaignData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => ({ name: tag.trim() }));
    setCampaignData(prev => ({ ...prev, tags }));
  };

  const handleSegmentChange = (segmentId: string) => {
    setSelectedSegments(prev => {
      const isSelected = prev.includes(segmentId);
      const newSegments = isSelected
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId];
      
      setCampaignData(prevData => ({
        ...prevData,
        segmentos: newSegments
      }));
      
      return newSegments;
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo',
        campaignData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Campaign created:', response.data);
      onClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600'} p-6 flex justify-between items-center`}>
      <div className="flex items-center gap-3">
      <Mail className="text-white h-6 w-6" />
            <h2 className="text-xl font-bold text-white">Nueva Campaña de Email</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-600 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`flex items-center ${num < 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > num 
                        ? 'bg-blue-500' 
                        : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Nombre de la Campaña
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={campaignData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Ej: Black Friday 2025"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={campaignData.descripcion}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Ej: Ofertas especiales para clientes VIP"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Tags (separados por coma)
                </label>
                <input
                  type="text"
                  onChange={handleTagsChange}
                  className={`w-full px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Ej: descuentos, black-friday"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Número de Productos
                </label>
                <input
                  type="number"
                  name="numeroProductos"
                  value={campaignData.numeroProductos}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Seleccionar Segmentos</h3>
                <button
                  onClick={() => setShowSegmentModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Crear Segmento
                </button>
              </div>
              <div className="space-y-2">
                {segments.map((segment) => (
                  <div key={segment._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={segment._id}
                      checked={selectedSegments.includes(segment._id)}
                      onChange={() => handleSegmentChange(segment._id)}
                      className="mr-2"
                    />
                    <label htmlFor={segment._id} className={theme === 'dark' ? 'text-gray-300' : ''}>{segment.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <EmailConfigurationPanel
              etapas={campaignData.etapas}
              onEtapasChange={(nuevasEtapas) => {
                setCampaignData(prev => ({ ...prev, etapas: nuevasEtapas }));
              }}
              numeroProductos={campaignData.numeroProductos}
              segmentosSeleccionados={segments.filter(seg => selectedSegments.includes(seg._id))}
              theme={theme}
            />
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between`}>
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              step === 1
                ? `${theme === 'dark' ? 'text-gray-500 bg-gray-700 cursor-not-allowed' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`
                : `${theme === 'dark' ? 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700' : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'}`
            }`}
            disabled={step === 1}
          >
            Anterior
          </button>
          <button
            onClick={() => {
              if (step < 3) {
                setStep(prev => prev + 1);
              } else {
                handleSubmit();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {step === 3 ? 'Crear Campaña' : 'Siguiente'}
          </button>
        </div>
      </div>      

      {/* Segment Creation Modal */}
  {showSegmentModal && (
    <SegmentModal
      isEditing={false}
      segment={segmentData}
      onSegmentChange={(updates) => setSegmentData(prev => ({ ...prev, ...updates }))}
      clientFilterState={clientFilterState}
      onClientFilterStateChange={setClientFilterState}
      leadFilterState={leadFilterState}
      onLeadFilterStateChange={setLeadFilterState}
      onClose={() => setShowSegmentModal(false)}
      onSave={async () => {
        try {
          const token = localStorage.getItem('token');
          await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: segmentData.name,
              description: segmentData.description,
              selectedClients: segmentData.selectedClients,
              selectedLeads: segmentData.selectedLeads
            })
          });
          // Refresh segments list after creating new segment
          const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setSegments(response.data);
          setShowSegmentModal(false);
        } catch (error) {
          console.error('Error creating segment:', error);
        }
      }}
    />
  )}
    </motion.div>
  );
}