import React from 'react';
import { X } from 'lucide-react';
import { Campaign } from '../types/campaign';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const historicalData = [
  { date: '01/03', openRate: 42, clickRate: 15 },
  { date: '02/03', openRate: 45, clickRate: 18 },
  { date: '03/03', openRate: 48, clickRate: 20 },
  { date: '04/03', openRate: 51, clickRate: 22 },
  { date: '05/03', openRate: 47, clickRate: 19 },
  { date: '06/03', openRate: 45, clickRate: 17 },
  { date: '07/03', openRate: 43, clickRate: 16 },
];

interface Props {
  campaign: Campaign;
  onClose: () => void;
}

export function CampaignMetricsModal({ campaign, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Métricas Detalladas - {campaign.name}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Evolución Histórica
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="openRate"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ fill: '#4F46E5', strokeWidth: 2 }}
                    name="Tasa de Apertura"
                  />
                  <Line
                    type="monotone"
                    dataKey="clickRate"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2 }}
                    name="Tasa de Clics"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricDetailCard
              title="Engagement"
              metrics={[
                { label: 'Tasa de Apertura', value: `${campaign.stats.openRate}%` },
                { label: 'Tasa de Clics', value: `${campaign.stats.clickRate}%` },
                { label: 'CTR', value: `${(campaign.stats.clickRate / campaign.stats.openRate * 100).toFixed(1)}%` }
              ]}
            />
            <MetricDetailCard
              title="Conversión"
              metrics={[
                { label: 'Tasa de Conversión', value: `${campaign.stats.conversionRate}%` },
                { label: 'Tasa de Rebote', value: `${campaign.stats.bounceRate}%` },
                { label: 'ROI', value: 'Calculando...' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricDetailCard({ 
  title, 
  metrics 
}: { 
  title: string; 
  metrics: Array<{ label: string; value: string }> 
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{metric.label}</span>
            <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}