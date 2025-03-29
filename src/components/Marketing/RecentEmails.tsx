import React from 'react';
import { Mail, Star, BarChart2, Eye, MousePointer, Users, Clock, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface EmailCampaign {
  id: string;
  subject: string;
  status: 'sent' | 'scheduled' | 'draft';
  date: string;
  stats: {
    recipients: number;
    opened: number;
    clicked: number;
  };
  performance: number;
  template: string;
  segment: string;
  previewText: string;
}

const recentEmails: EmailCampaign[] = [
  {
    id: '1',
    subject: "🎉 Descubre nuestras nuevas características",
    status: 'sent',
    date: '2025-01-09 14:30',
    stats: {
      recipients: 2500,
      opened: 1875,
      clicked: 945,
    },
    performance: 92,
    template: 'Newsletter Mensual',
    segment: 'Usuarios Activos',
    previewText: 'Explora las últimas actualizaciones y mejoras en nuestra plataforma...'
  },
  {
    id: '2',
    subject: "📅 Webinar: Estrategias de Marketing 2025",
    status: 'scheduled',
    date: '2025-01-11 10:00',
    stats: {
      recipients: 1200,
      opened: 0,
      clicked: 0,
    },
    performance: 0,
    template: 'Invitación Webinar',
    segment: 'Leads Cualificados',
    previewText: 'No te pierdas nuestro próximo webinar sobre las últimas tendencias...'
  },
  {
    id: '3',
    subject: "🚀 Tips para optimizar tu estrategia",
    status: 'sent',
    date: '2025-01-08 09:15',
    stats: {
      recipients: 3200,
      opened: 2240,
      clicked: 896,
    },
    performance: 88,
    template: 'Consejos Semanales',
    segment: 'Todos los suscriptores',
    previewText: 'Descubre los mejores consejos para mejorar tus campañas de email...'
  },
  {
    id: '4',
    subject: "💡 Guía completa de marketing digital",
    status: 'draft',
    date: '-',
    stats: {
      recipients: 0,
      opened: 0,
      clicked: 0,
    },
    performance: 0,
    template: 'Guía PDF',
    segment: 'Nuevos Suscriptores',
    previewText: 'Aprende todo lo que necesitas saber sobre marketing digital...'
  }
];

export function RecentEmails() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Sparkles className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'draft':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-500';
    if (performance >= 70) return 'text-yellow-500';
    return performance === 0 ? 'text-gray-400' : 'text-red-500';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Correos Recientes</h3>
            <p className="text-sm text-gray-500">Monitorea el rendimiento de tus últimos envíos</p>
          </div>
        </div>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 group">
          Ver todos
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-4">
        {recentEmails.map((email) => (
          <div
            key={email.id}
            className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-purple-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-gray-900">{email.subject}</h4>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(email.status)}`}>
                    {getStatusIcon(email.status)}
                    <span>{email.status === 'sent' ? 'Enviado' : 
                           email.status === 'scheduled' ? 'Programado' : 'Borrador'}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{email.previewText}</p>
              </div>
              {email.performance > 0 && (
                <div className={`flex items-center gap-1 ${getPerformanceColor(email.performance)}`}>
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{email.performance}%</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{email.segment}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{email.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Destinatarios</p>
                <p className="font-semibold text-gray-900">
                  {email.stats.recipients.toLocaleString()}
                </p>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Aperturas</p>
                <p className="font-semibold text-gray-900">
                  {email.stats.opened > 0 ? (
                    `${((email.stats.opened / email.stats.recipients) * 100).toFixed(1)}%`
                  ) : '-'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Clicks</p>
                <p className="font-semibold text-gray-900">
                  {email.stats.clicked > 0 ? (
                    `${((email.stats.clicked / email.stats.recipients) * 100).toFixed(1)}%`
                  ) : '-'}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-500">{email.template}</span>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-50 rounded transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-50 rounded transition-colors">
                  <BarChart2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
