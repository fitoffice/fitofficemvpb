import React, { useState } from 'react';
import { PlusCircle, Zap, LayoutTemplate, Users } from 'lucide-react';
import { NewCampaignModal } from './NewCampaignModal';
import { AutomationModal } from './AutomationModal';
import { TemplateSelectionModal } from './TemplateSelectionModal';
import { SegmentSelectionModal } from './SegmentSelectionModal';
import { emailService } from "../../services/mockEmailService";
import { NewCampaignData, AutomationRule, Template } from '../types/campaign';
import { toast } from 'react-hot-toast';

export function QuickActions() {
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSegments, setShowSegments] = useState(false);

  const actions = [
    {
      icon: <PlusCircle className="h-6 w-6" />,
      label: 'Nueva Campaña',
      description: 'Crear campaña de email',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      onClick: () => setShowNewCampaign(true),
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: 'Automatización',
      description: 'Configurar emails automáticos',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      hoverColor: 'hover:bg-amber-100',
      onClick: () => setShowAutomation(true),
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      label: 'Plantillas',
      description: 'Gestionar plantillas',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      hoverColor: 'hover:bg-violet-100',
      onClick: () => setShowTemplates(true),
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: 'Segmentos',
      description: 'Gestionar suscriptores',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
      onClick: () => setShowSegments(true),
    },
  ];

  const handleNewCampaign = async (formData: NewCampaignData) => {
    try {
      const scheduledDate = formData.scheduledDate && formData.scheduledTime
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
        : undefined;

      const campaignData: NewCampaignData = {
        name: formData.name,
        subject: formData.subject,
        preheader: formData.preheader,
        template: formData.template,
        segments: formData.segments,
        scheduledDate,
        abTesting: formData.enableABTesting ? {
          enabled: true,
          alternativeSubject: formData.abTestSubject
        } : undefined,
        personalizedFields: {
          useClientName: formData.personalizedFields.useClientName,
          useLastSession: formData.personalizedFields.useLastSession
        }
      };

      const newCampaign = await emailService.createCampaign(campaignData);
      toast.success('Campaña creada exitosamente');
      setShowNewCampaign(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear la campaña');
    }
  };

  const handleNewAutomation = async (automationData: Partial<AutomationRule>) => {
    try {
      // Aquí iría la lógica para crear la automatización
      toast.success('Automatización creada exitosamente');
      setShowAutomation(false);
    } catch (error) {
      toast.error('Error al crear la automatización');
    }
  };

  const handleTemplateSelect = (template: Template) => {
    // Aquí iría la lógica para manejar la selección de la plantilla
    toast.success(`Plantilla "${template.name}" seleccionada`);
    setShowTemplates(false);
  };

  const handleSegmentSelect = (segments: string[]) => {
    toast.success(`${segments.length} segmentos seleccionados`);
    setShowSegments(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex flex-col items-center p-4 rounded-xl ${action.bgColor} ${action.hoverColor} transition-all duration-300 hover:scale-105`}
          >
            <div className={`${action.color} mb-3`}>{action.icon}</div>
            <span className="text-sm font-semibold text-gray-900">{action.label}</span>
            <span className="text-xs text-gray-600 text-center mt-1">{action.description}</span>
          </button>
        ))}
      </div>

      {showNewCampaign && (
        <NewCampaignModal
          onClose={() => setShowNewCampaign(false)}
          onSubmit={handleNewCampaign}
        />
      )}

      {showAutomation && (
        <AutomationModal
          onClose={() => setShowAutomation(false)}
          onSubmit={handleNewAutomation}
        />
      )}

      {showTemplates && (
        <TemplateSelectionModal
          onClose={() => setShowTemplates(false)}
          onSelect={handleTemplateSelect}
        />
      )}

      {showSegments && (
        <SegmentSelectionModal
          onClose={() => setShowSegments(false)}
          onSelect={handleSegmentSelect}
        />
      )}
    </div>
  );
}