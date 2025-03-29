import React from 'react';

interface Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const templates = [
  {
    id: 't1',
    name: 'Recordatorio de Sesión',
    type: 'reminder',
  },
  {
    id: 't2',
    name: 'Consejos de Nutrición',
    type: 'newsletter',
  },
  {
    id: 't3',
    name: 'Promoción Especial',
    type: 'promotion',
  },
  {
    id: 't4',
    name: 'Felicitación de Cumpleaños',
    type: 'celebration',
  },
  {
    id: 't5',
    name: 'Motivación Personal',
    type: 'motivation',
  },
];

const segments = [
  { 
    id: 'active_members', 
    name: 'Miembros Activos',
    count: 156,
    avgAge: 32,
  },
  { 
    id: 'inactive_members', 
    name: 'Miembros Inactivos',
    count: 89,
    avgAge: 29,
  },
  { 
    id: 'new_members', 
    name: 'Nuevos Miembros',
    count: 45,
    avgAge: 27,
  },
  { 
    id: 'fitness_enthusiasts', 
    name: 'Entusiastas del Fitness',
    count: 78,
    avgAge: 28,
  },
  { 
    id: 'weight_loss', 
    name: 'Programa Pérdida de Peso',
    count: 120,
    avgAge: 35,
  },
];

export function CampaignSummary({ formData, updateFormData }: Props) {
  const getSelectedSegmentsInfo = () => {
    const selected = segments.filter(s => formData.segments.includes(s.id));
    const totalCount = selected.reduce((acc, s) => acc + s.count, 0);
    const avgAge = selected.reduce((acc, s) => acc + s.avgAge * s.count, 0) / totalCount;
    return { totalCount, avgAge: Math.round(avgAge) };
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Resumen de la Campaña
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Detalles Básicos</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Nombre:</dt>
                <dd className="text-sm font-medium">{formData.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Asunto:</dt>
                <dd className="text-sm font-medium">{formData.subject}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Plantilla:</dt>
                <dd className="text-sm font-medium">
                  {templates.find(t => t.id === formData.template)?.name}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Audiencia</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Total Suscriptores:</dt>
                <dd className="text-sm font-medium">{getSelectedSegmentsInfo().totalCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Edad Promedio:</dt>
                <dd className="text-sm font-medium">{getSelectedSegmentsInfo().avgAge} años</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Segmentos:</dt>
                <dd className="text-sm font-medium">{formData.segments.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Programación
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Envío
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  updateFormData('scheduledDate', e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Envío
              </label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) =>
                  updateFormData('scheduledTime', e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.recurring.enabled}
                onChange={(e) =>
                  updateFormData('recurring', {
                    ...formData.recurring,
                    enabled: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Configurar envío recurrente
              </span>
            </label>

            {formData.recurring.enabled && (
              <div className="mt-4 ml-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia
                  </label>
                  <select
                    value={formData.recurring.frequency}
                    onChange={(e) =>
                      updateFormData('recurring', {
                        ...formData.recurring,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>

                {formData.recurring.frequency === 'weekly' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Días de envío
                    </label>
                    <div className="flex gap-2">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const days = formData.recurring.days.includes(day)
                              ? formData.recurring.days.filter((d: string) => d !== day)
                              : [...formData.recurring.days, day];
                            updateFormData('recurring', {
                              ...formData. recurring,
                              days,
                            });
                          }}
                          className={`w-8 h-8 rounded-full ${
                            formData.recurring.days.includes(day)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Campos Personalizados
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.personalizedFields.useClientName}
              onChange={(e) =>
                updateFormData('personalizedFields', {
                  ...formData.personalizedFields,
                  useClientName: e.target.checked,
                })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              Incluir nombre del cliente
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.personalizedFields.useLastSession}
              onChange={(e) =>
                updateFormData('personalizedFields', {
                  ...formData.personalizedFields,
                  useLastSession: e.target.checked,
                })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              Incluir fecha última sesión
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}