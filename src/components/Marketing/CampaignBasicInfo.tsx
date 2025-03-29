import React, { useState } from 'react';
import { Search, Plus, Info } from 'lucide-react';

interface Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const segments = [
  { 
    id: 'active_members', 
    name: 'Miembros Activos',
    description: 'Clientes que han asistido al menos a 3 sesiones en el último mes',
    count: 156,
    avgAge: 32,
    topLocation: 'Madrid Centro'
  },
  { 
    id: 'inactive_members', 
    name: 'Miembros Inactivos',
    description: 'Clientes sin actividad en los últimos 30 días',
    count: 89,
    avgAge: 29,
    topLocation: 'Barcelona'
  },
  { 
    id: 'new_members', 
    name: 'Nuevos Miembros',
    description: 'Clientes que se unieron en los últimos 15 días',
    count: 45,
    avgAge: 27,
    topLocation: 'Valencia'
  },
  { 
    id: 'fitness_enthusiasts', 
    name: 'Entusiastas del Fitness',
    description: 'Clientes que asisten a más de 4 sesiones por semana',
    count: 78,
    avgAge: 28,
    topLocation: 'Madrid Norte'
  },
  { 
    id: 'weight_loss', 
    name: 'Programa Pérdida de Peso',
    description: 'Clientes inscritos en el programa de pérdida de peso',
    count: 120,
    avgAge: 35,
    topLocation: 'Sevilla'
  },
];

export function CampaignBasicInfo({ formData, updateFormData }: Props) {
  const [searchSegment, setSearchSegment] = useState('');

  const filteredSegments = segments.filter(segment => 
    segment.name.toLowerCase().includes(searchSegment.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchSegment.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Campaña
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: Campaña de Verano 2024"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Segmentos
          </label>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchSegment}
                onChange={(e) => setSearchSegment(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Buscar segmentos..."
              />
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Segmento
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filteredSegments.map((segment) => (
            <label
              key={segment.id}
              className="flex flex-col p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.segments.includes(segment.id)}
                    onChange={(e) => {
                      const newSegments = e.target.checked
                        ? [...formData.segments, segment.id]
                        : formData.segments.filter((s: string) => s !== segment.id);
                      updateFormData('segments', newSegments);
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 font-medium">{segment.name}</span>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  title="Más información"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 ml-7">{segment.description}</p>
              <div className="mt-2 ml-7 flex gap-4 text-xs text-gray-500">
                <span>{segment.count} suscriptores</span>
                <span>Edad promedio: {segment.avgAge}</span>
                <span>{segment.topLocation}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}