import React, { useState } from 'react';
import { Sparkles, X, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const templates = [
  {
    id: 't1',
    name: 'Recordatorio de Sesión',
    type: 'reminder',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    suggestedSubject: '¡No olvides tu sesión de mañana! 💪',
    suggestedPreheader: 'Te esperamos para una sesión increíble'
  },
  {
    id: 't2',
    name: 'Consejos de Nutrición',
    type: 'newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300',
    suggestedSubject: 'Tips nutricionales para maximizar tus resultados 🥗',
    suggestedPreheader: 'Descubre cómo mejorar tu alimentación'
  },
  {
    id: 't3',
    name: 'Promoción Especial',
    type: 'promotion',
    thumbnail: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=300',
    suggestedSubject: '¡Oferta especial solo para ti! 🎉',
    suggestedPreheader: 'Aprovecha estos descuentos exclusivos'
  },
  {
    id: 't4',
    name: 'Felicitación de Cumpleaños',
    type: 'celebration',
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300',
    suggestedSubject: '¡Feliz Cumpleaños! 🎂',
    suggestedPreheader: 'Un regalo especial te espera'
  },
  {
    id: 't5',
    name: 'Motivación Personal',
    type: 'motivation',
    thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300',
    suggestedSubject: '¡Sigue adelante con tus objetivos! 🎯',
    suggestedPreheader: 'Inspiración para alcanzar tus metas'
  }
];

interface AIGeneratorModalProps {
  onClose: () => void;
  onGenerate: (content: {
    subject: string;
    preheader: string;
    abTestSubject?: string;
    abTestPreheader?: string;
  }) => void;
}

function AIGeneratorModal({ onClose, onGenerate }: AIGeneratorModalProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [includeABTest, setIncludeABTest] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    // Simular llamada a la API de IA
    setTimeout(() => {
      const generatedContent = {
        subject: '🎯 ¡Transforma tu rutina fitness con nuestro nuevo programa!',
        preheader: 'Descubre cómo alcanzar tus objetivos más rápido',
        ...(includeABTest && {
          abTestSubject: '💪 ¿Listo para llevar tu entrenamiento al siguiente nivel?',
          abTestPreheader: 'Un nuevo enfoque para maximizar tus resultados'
        })
      };
      onGenerate(generatedContent);
      setGenerating(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-lg w-full mx-4 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Asistente de IA
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué tipo de contenido quieres generar?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Un email motivacional para clientes que no han asistido en 2 semanas..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeABTest}
                onChange={(e) => setIncludeABTest(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Generar variante A/B
              </span>
            </label>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Wand2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-indigo-900">
                  Sugerencia de IA
                </h4>
                <p className="text-sm text-indigo-700 mt-1">
                  Incluye detalles sobre el tono (formal/casual), objetivo principal
                  y cualquier elemento específico que quieras destacar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                generating || !prompt.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generar
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CampaignContent({ formData, updateFormData }: Props) {
  const [showAIModal, setShowAIModal] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      updateFormData('template', templateId);
      updateFormData('subject', template.suggestedSubject);
      updateFormData('preheader', template.suggestedPreheader);
    }
  };

  const handleAIGenerate = (content: {
    subject: string;
    preheader: string;
    abTestSubject?: string;
    abTestPreheader?: string;
  }) => {
    updateFormData('subject', content.subject);
    updateFormData('preheader', content.preheader);
    if (content.abTestSubject) {
      updateFormData('enableABTesting', true);
      updateFormData('abTestSubject', content.abTestSubject);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plantillas
        </label>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                formData.template === template.id
                  ? 'ring-2 ring-indigo-500'
                  : 'hover:border-indigo-500'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-medium text-gray-900">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {template.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Asunto
            </label>
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              Generar con IA
            </button>
          </div>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => updateFormData('subject', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Asunto del email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preheader
          </label>
          <input
            type="text"
            value={formData.preheader}
            onChange={(e) => updateFormData('preheader', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Texto previo visible en la bandeja de entrada"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.enableABTesting}
              onChange={(e) =>
                updateFormData('enableABTesting', e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Habilitar prueba A/B
            </span>
          </label>
        </div>

        {formData.enableABTesting && (
          <div className="ml-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto alternativo
              </label>
              <input
                type="text"
                value={formData.abTestSubject}
                onChange={(e) =>
                  updateFormData('abTestSubject', e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Versión alternativa del asunto"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.abTestContent}
                  onChange={(e) =>
                    updateFormData('abTestContent', e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Probar variante de contenido
                </span>
              </label>
              {formData.abTestContent && (
                <textarea
                  value={formData.abTestContentVariant}
                  onChange={(e) =>
                    updateFormData('abTestContentVariant', e.target.value)
                  }
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Versión alternativa del contenido"
                  rows={4}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAIModal && (
          <AIGeneratorModal
            onClose={() => setShowAIModal(false)}
            onGenerate={handleAIGenerate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}