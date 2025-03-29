import React, { useState } from 'react';
import { X, Mail, Send, Eye, TestTube } from 'lucide-react';
import { CampaignBasicInfo } from './CampaignBasicInfo';
import { CampaignContent } from './CampaignContent';
import { CampaignSummary } from './CampaignSummary';
import { toast } from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSubmit: (campaignData: any) => void;
}

export function NewCampaignModal({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preheader: '',
    template: '',
    segments: [] as string[],
    scheduledDate: '',
    scheduledTime: '',
    enableABTesting: false,
    abTestSubject: '',
    abTestContent: false,
    abTestContentVariant: '',
    personalizedFields: {
      useClientName: false,
      useLastSession: false,
    },
    recurring: {
      enabled: false,
      frequency: 'weekly',
      days: [] as string[],
    },
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <CampaignBasicInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <CampaignContent
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <CampaignSummary
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-6 w-6 text-indigo-600" />
              Nueva Campaña
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
            <div className="flex justify-between items-center mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        step > s ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Anterior
                </button>
              )}
              <div className="ml-auto flex gap-3">
                {step === 3 && (
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Vista Previa
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Crear Campaña
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Vista Previa del Email</h3>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Para: ejemplo@correo.com</p>
                <p className="text-sm font-medium mt-1">Asunto: {formData.subject}</p>
                <p className="text-sm text-gray-500 mt-1">{formData.preheader}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-gray-600">Contenido de la plantilla seleccionada...</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    toast.success('Email de prueba enviado');
                    setPreviewMode(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <TestTube className="h-4 w-4" />
                  Enviar Prueba
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}