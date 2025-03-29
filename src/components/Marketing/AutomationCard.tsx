import React from 'react';
import { Zap, Clock, Mail, MessageSquare, Users, Settings, PlayCircle, PauseCircle } from 'lucide-react';

interface AutomationProps {
  name: string;
  status: 'active' | 'paused' | 'draft';
  type: 'email' | 'sms' | 'whatsapp';
  triggers: string[];
  lastRun?: string;
  nextRun?: string;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
  };
}

const automations: AutomationProps[] = [
  {
    name: "Bienvenida Nuevos Leads",
    status: 'active',
    type: 'email',
    triggers: ['Nuevo registro', 'Formulario completado'],
    lastRun: '2025-01-09 15:30',
    nextRun: '2025-01-10 10:00',
    stats: {
      sent: 1250,
      opened: 892,
      clicked: 435
    }
  },
  {
    name: "Seguimiento Inactivos",
    status: 'active',
    type: 'whatsapp',
    triggers: ['7 días sin actividad'],
    lastRun: '2025-01-09 18:00',
    nextRun: '2025-01-10 18:00',
    stats: {
      sent: 320,
      opened: 289,
      clicked: 145
    }
  },
  {
    name: "Recordatorio Cita",
    status: 'paused',
    type: 'sms',
    triggers: ['24h antes de cita'],
    lastRun: '2025-01-08 12:00',
    nextRun: '-',
    stats: {
      sent: 890,
      opened: 890,
      clicked: 234
    }
  }
];

export function AutomationCard() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-50';
      case 'paused':
        return 'text-yellow-500 bg-yellow-50';
      case 'draft':
        return 'text-gray-500 bg-gray-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="w-4 h-4" />;
      case 'paused':
        return <PauseCircle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Automatizaciones</h3>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Configurar</span>
        </button>
      </div>

      <div className="space-y-5">
        {automations.map((automation, index) => (
          <div
            key={index}
            className="p-5 border border-gray-200 rounded-xl hover:border-blue-200 transition-all duration-300 bg-white hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getTypeIcon(automation.type)}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">{automation.name}</h4>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(automation.status)}`}>
                  {getStatusIcon(automation.status)}
                  {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
                </span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Última ejecución: <span className="font-medium">{automation.lastRun}</span></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Próxima ejecución: <span className="font-medium">{automation.nextRun}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {automation.triggers.map((trigger, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-gray-200"
                >
                  {trigger}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1.5">Enviados</p>
                <p className="font-bold text-gray-900 text-lg">{automation.stats.sent}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1.5">Abiertos</p>
                <p className="font-bold text-gray-900 text-lg">{automation.stats.opened}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1.5">Clicks</p>
                <p className="font-bold text-gray-900 text-lg">{automation.stats.clicked}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
