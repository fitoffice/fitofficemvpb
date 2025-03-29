import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AutomationModal } from './AutomationModal';
import { AutomationPanel } from './AutomationPanel';
import { 
  Plus,
  X,
  AlertTriangle,
  UserPlus,
  Gift,
  UserX,
  MessageSquare,
  Mail,
  Timer,
  CheckCircle,
  Bell,
  ShoppingCart,
  DollarSign,
  Tag,
  Star,
  Box,
  Heart,
  Settings,
  PlusCircle
} from 'lucide-react';
import { useAutomation, Automation } from '../../contexts/AutomationContext';

interface AutomationStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'email';
  name: string;
  description: string;
  icon: any;
}

interface AutomationFlow {
  steps: AutomationStep[];
}

interface Automation {
  id: string;
  name: string;
  status: 'active' | 'paused';
  type: string;
  trigger: string;
  lastRun: string;
  description: string;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
  };
  icon: keyof typeof iconMap;
  flow: AutomationFlow;
}

interface AutomationsProps {
  onClose: () => void;
}

interface AutomationResponse {
  success: boolean;
  count: number;
  data: {
    _id: string;
    nombre: string;
    tipo: string;
    activo: boolean;
    trainer: string | null;
    correos: string[];
    createdAt: string;
    updatedAt: string;
    tracking: any;
  }[];
}

const iconMap = {
  'UserPlus': UserPlus,
  'Gift': Gift,
  'UserX': UserX,
  'MessageSquare': MessageSquare,
  'Mail': Mail,
  'Timer': Timer,
  'CheckCircle': CheckCircle,
  'Bell': Bell,
  'ShoppingCart': ShoppingCart,
  'DollarSign': DollarSign,
  'Tag': Tag,
  'Star': Star,
  'Box': Box,
  'Heart': Heart,
  'AlertTriangle': AlertTriangle
} as const;

// Componente para mostrar un paso del flujo
const FlowStep = ({ step, isLast }: { step: AutomationStep; isLast: boolean }) => (
  <div className="flex flex-col items-center">
    <div className={`w-full flex items-center ${!isLast ? 'mb-2' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        step.type === 'trigger' ? 'bg-blue-100 text-blue-600' :
        step.type === 'condition' ? 'bg-yellow-100 text-yellow-600' :
        step.type === 'action' ? 'bg-green-100 text-green-600' :
        step.type === 'delay' ? 'bg-purple-100 text-purple-600' :
        'bg-gray-100 text-gray-600'
      }`}>
        <step.icon className="w-5 h-5" />
      </div>
      <div className="ml-4 flex-grow">
        <h4 className="font-medium text-gray-800">{step.name}</h4>
        <p className="text-sm text-gray-500">{step.description}</p>
      </div>
    </div>
    {!isLast && (
      <div className="w-px h-8 bg-gray-200 my-1" />
    )}
  </div>
);

export function Automations({ onClose }: AutomationsProps) {
  const { 
    automations, 
    loading, 
    error, 
    toggleAutomationStatus 
  } = useAutomation();
  
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
  const [showNewAutomation, setShowNewAutomation] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // Remove the fetchAutomations, toggleAutomationStatus functions and related state
  // as they are now provided by the context

  const automationTemplates = [
    {
      id: 'welcome',
      name: 'Email de Bienvenida',
      description: 'Da la bienvenida a nuevos usuarios',
      icon: UserPlus
    },
    {
      id: 'birthday',
      name: 'Felicitación de Cumpleaños',
      description: 'Envía felicitaciones y ofertas especiales',
      icon: Gift
    },
    {
      id: 'review',
      name: 'Solicitud de Reseña',
      description: 'Pide opiniones sobre productos comprados',
      icon: Star
    },
    {
      id: 'feedback',
      name: 'Encuesta de Satisfacción',
      description: 'Recopila feedback de los clientes',
      icon: MessageSquare
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Automatizaciones</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Todas las automatizaciones</h3>
                  <p className="text-sm text-gray-500 mt-1">{automations.length} automatizaciones activas</p>
                </div>
                <button
                  onClick={() => setShowNewAutomation(true)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nueva Automatización</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {automations.map((automation) => {
                  const IconComponent = iconMap[automation.icon];
                  const isSelected = selectedAutomation === automation.id;

                  return (
                    <div
                      key={automation.id}
                      className={`bg-white rounded-xl border ${
                        isSelected ? 'border-amber-500' : 'border-gray-200'
                      } p-6 hover:shadow-lg transition-all cursor-pointer`}
                      onClick={() => setSelectedAutomation(automation.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            automation.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {IconComponent && <IconComponent className="w-5 h-5 text-gray-600" />}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{automation.name}</h3>
                            <p className="text-sm text-gray-500">{automation.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAutomationStatus(automation.id);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                              automation.status === 'active'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              automation.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                            {automation.status === 'active' ? 'Activo' : 'Inactivo'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAutomation(automation.trigger);
                              setShowPanel(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          >
                            <Settings className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Enviados</p>
                          <p className="font-medium">{automation.stats.sent}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Abiertos</p>
                          <p className="font-medium">{automation.stats.opened}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Clicks</p>
                          <p className="font-medium">{automation.stats.clicked}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </motion.div>
      
      {showNewAutomation && (
        <AutomationModal 
          onClose={() => setShowNewAutomation(false)}
          onSubmit={(automationData) => {
            // The context will handle adding the new automation
            console.log('Nueva automatización:', automationData);
            setShowNewAutomation(false);
          }}
          onSuccess={() => {
            // This will be called after successful creation
            setShowNewAutomation(false);
          }}
        />
      )}
      
      {showPanel && selectedAutomation && (
        <AutomationPanel
          automationType={selectedAutomation}
          onClose={() => {
            setShowPanel(false);
            setSelectedAutomation(null);
          }}
        />
      )}
    </div>
  );
}
