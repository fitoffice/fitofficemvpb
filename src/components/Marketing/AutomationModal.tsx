import React, { useState } from 'react';
import { Mail, Gift, UserX, BookOpen, ChevronRight, TestTube, Zap, Calendar } from 'lucide-react';
import { AutomationRule } from '@/types/automation';
import { AutomationPanel } from './AutomationPanel';
import { X, Activity, Clock, Users, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAutomation } from '../../contexts/AutomationContext';

interface Props {
  onClose: () => void;
  onSubmit: (automationData: Partial<AutomationRule>) => void;
  onSuccess?: (data: any) => void;
}

const AUTOMATION_TYPES = [
  {
    id: 'welcome',
    name: 'Bienvenida a Nuevos Clientes',
    description: 'Envía un mensaje de bienvenida automático a nuevos clientes',
    icon: Mail,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'birthday',
    name: 'Cumpleaños y Aniversarios',
    description: 'Felicita automáticamente a tus clientes en sus fechas especiales',
    icon: Gift,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'inactive',
    name: 'Recuperación de Clientes Inactivos',
    description: 'Reconecta con clientes que no han visitado en un tiempo',
    icon: UserX,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'periodic_tips',
    name: 'Consejos Periódicos',
    description: 'Envía consejos y contenido valioso a tus clientes regularmente',
    icon: BookOpen,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'reminders',
    name: 'Recordatorios',
    description: 'Envía recordatorios automáticos para citas y eventos programados',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
];

const TRIGGER_TYPES = [
  { id: 'subscription', name: 'Evento de Suscripción' },
  { id: 'date', name: 'Evento de Fecha' },
  { id: 'inactivity', name: 'Inactividad' },
  { id: 'interaction', name: 'Evento de Interacción' }
];

export function AutomationModal({ onClose, onSubmit, onSuccess }: Props) {
  const { createAutomation, selectedType, setSelectedType } = useAutomation();
  const [step, setStep] = useState(1);
  const [showPanel, setShowPanel] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    triggerType: '',
    frequency: 'once',
    scheduledTime: '09:00',
    daysOfWeek: [] as string[],
    inactivityDays: 30,
    subject: '',
    emailBody: '',
    trackEmail: true
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      // Mapear el tipo seleccionado al formato esperado por la API
      const tipoMap: { [key: string]: string } = {
        'welcome': 'bienvenida_nuevos_clientes',
        'birthday': 'cumpleanos_aniversarios',
        'inactive': 'recuperacion_clientes_inactivos',
        'periodic_tips': 'consejos_periodicos',
        'reminders': 'recordatorios'
      };

      const automationData = {
        nombre: formData.name,
        tipo: tipoMap[selectedType],
        activo: true,
        trainer: localStorage.getItem('userId') || null,
        correos: [],
        asuntoCorreo: selectedType === 'welcome' ? formData.subject : null,
        contenidoCorreo: selectedType === 'welcome' ? formData.emailBody : null
      };

      const createdAutomation = await createAutomation(automationData);
      
      if (createdAutomation) {
        if (onSuccess) {
          onSuccess(createdAutomation);
        }
        onClose();
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al conectar con el servidor');
    }
  };

  // Función auxiliar para determinar el icono según el tipo
  const getIconForType = (tipo: string): string => {
    switch (tipo) {
      case 'bienvenida_nuevos_clientes':
        return 'UserPlus';
      case 'cumpleanos_aniversarios':
        return 'Gift';
      case 'recuperacion_clientes_inactivos':
        return 'UserX';
      case 'consejos_periodicos':
        return 'MessageSquare';
      case 'recordatorios':
        return 'Calendar';
      default:
        return 'MessageSquare';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-6 w-6 text-amber-600" />
              Nueva Automatización
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
           
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AUTOMATION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(type.id);
                        setStep(2);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedType === type.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50/50'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Automatización
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder={
                      selectedType === 'birthday' 
                        ? "Ej: Felicitación de Cumpleaños"
                        : selectedType === 'inactive'
                        ? "Ej: Recuperación de Clientes 30 días"
                        : selectedType === 'periodic_tips'
                        ? "Ej: Consejos Semanales de Nutrición"
                        : selectedType === 'reminders'
                        ? "Ej: Recordatorio de Citas"
                        : "Ej: Bienvenida Nuevos Miembros"
                    }
                  />
                </div>

                {selectedType === 'welcome' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asunto del Correo
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Ej: ¡Bienvenido/a a nuestra comunidad!"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido del Correo
                      </label>
                      <textarea
                        value={formData.emailBody}
                        onChange={(e) => setFormData({ ...formData, emailBody: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 h-32"
                        placeholder="Escribe aquí el contenido del correo..."
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.trackEmail}
                          onChange={(e) => setFormData({ ...formData, trackEmail: e.target.checked })}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">Trackear apertura y clicks del correo</span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Resumen de la Automatización
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Tipo:</dt>
                      <dd className="text-sm font-medium">
                        {AUTOMATION_TYPES.find(t => t.id === selectedType)?.name}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Nombre:</dt>
                      <dd className="text-sm font-medium">{formData.name}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex justify-end space-x-3">
                  
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Atrás
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.name}
                  >
                    Siguiente
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedType || !formData.name}
                  >
                    Crear Automatización
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>

          {showPanel && selectedType && (
            <AutomationPanel
              automationType={tipoMap[selectedType]}
              onClose={() => setShowPanel(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}