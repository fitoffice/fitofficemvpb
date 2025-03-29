import React, { useState } from 'react';
import { X, Search, Users, Filter, Plus, ChevronRight, Activity, Star, Clock, Target, Info, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Segment {
  id: string;
  name: string;
  description: string;
  count: number;
  type: 'active' | 'inactive' | 'new' | 'custom';
  criteria?: {
    activityDays?: number;
    membershipLevel?: string;
    interests?: string[];
    sessionCount?: number;
  };
  stats: {
    avgAge: number;
    topLocation: string;
    avgSessionsPerWeek?: number;
  };
}

interface Props {
  onClose: () => void;
  onSelect: (segments: string[]) => void;
  initialSelected?: string[];
}

const SEGMENTS: Segment[] = [
  {
    id: 'active_members',
    name: 'Miembros Activos',
    description: 'Clientes que han asistido al menos a 3 sesiones en el último mes',
    count: 156,
    type: 'active',
    criteria: {
      activityDays: 30,
      sessionCount: 3
    },
    stats: {
      avgAge: 32,
      topLocation: 'Madrid Centro',
      avgSessionsPerWeek: 3.5
    }
  },
  {
    id: 'inactive_members',
    name: 'Miembros Inactivos',
    description: 'Clientes sin actividad en los últimos 30 días',
    count: 89,
    type: 'inactive',
    criteria: {
      activityDays: 30
    },
    stats: {
      avgAge: 29,
      topLocation: 'Barcelona'
    }
  },
  {
    id: 'new_members',
    name: 'Nuevos Miembros',
    description: 'Clientes que se unieron en los últimos 15 días',
    count: 45,
    type: 'new',
    stats: {
      avgAge: 27,
      topLocation: 'Valencia'
    }
  },
  {
    id: 'premium_members',
    name: 'Miembros Premium',
    description: 'Clientes con suscripción premium activa',
    count: 78,
    type: 'custom',
    criteria: {
      membershipLevel: 'premium'
    },
    stats: {
      avgAge: 35,
      topLocation: 'Madrid Norte',
      avgSessionsPerWeek: 4.2
    }
  },
  {
    id: 'nutrition_interested',
    name: 'Interesados en Nutrición',
    description: 'Clientes que han mostrado interés en planes nutricionales',
    count: 120,
    type: 'custom',
    criteria: {
      interests: ['nutrition', 'meal_planning']
    },
    stats: {
      avgAge: 31,
      topLocation: 'Barcelona',
      avgSessionsPerWeek: 3.8
    }
  }
];

export function SegmentSelectionModal({ onClose, onSelect, initialSelected = [] }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'new' | 'custom'>('all');
  const [selectedSegments, setSelectedSegments] = useState<string[]>(initialSelected);
  const [showNewSegment, setShowNewSegment] = useState(false);
  const [showSegmentInfo, setShowSegmentInfo] = useState<string | null>(null);

  const filteredSegments = SEGMENTS.filter(segment => 
    (filter === 'all' || segment.type === filter) &&
    (segment.name.toLowerCase().includes(search.toLowerCase()) ||
     segment.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const getTotalReach = () => {
    return selectedSegments.reduce((total, segmentId) => {
      const segment = SEGMENTS.find(s => s.id === segmentId);
      return total + (segment?.count || 0);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-indigo-600" />
                Selecciona Segmentos
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Elige o crea segmentos específicos para personalizar tus campañas
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar segmentos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    filter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Todos
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    filter === 'active'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  Activos
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    filter === 'inactive'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Inactivos
                </button>
                <button
                  onClick={() => setFilter('new')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    filter === 'new'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className="h-4 w-4" />
                  Nuevos
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowNewSegment(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Segmento
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSegments.map((segment) => (
              <div
                key={segment.id}
                className={`relative border rounded-xl p-4 transition-all duration-300 ${
                  selectedSegments.includes(segment.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedSegments.includes(segment.id)}
                      onChange={() => handleSegmentToggle(segment.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{segment.name}</h3>
                      <button
                        onClick={() => setShowSegmentInfo(segment.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-indigo-600 font-medium">
                        {segment.count} miembros
                      </span>
                      <span className="text-gray-500">
                        Edad promedio: {segment.stats.avgAge}
                      </span>
                      <span className="text-gray-500">
                        {segment.stats.topLocation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedSegments.length} segmentos seleccionados ({getTotalReach()} miembros)
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => onSelect(selectedSegments)}
                disabled={selectedSegments.length === 0}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                  selectedSegments.length > 0
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Seleccionar Segmentos
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNewSegment && (
        <NewSegmentModal
          onClose={() => setShowNewSegment(false)}
          onSave={(newSegment) => {
            // Aquí iría la lógica para guardar el nuevo segmento
            toast.success('Segmento creado exitosamente');
            setShowNewSegment(false);
          }}
        />
      )}

      {showSegmentInfo && (
        <SegmentInfoModal
          segment={SEGMENTS.find(s => s.id === showSegmentInfo)!}
          onClose={() => setShowSegmentInfo(null)}
        />
      )}
    </div>
  );
}

interface NewSegmentModalProps {
  onClose: () => void;
  onSave: (segment: Partial<Segment>) => void;
}

function NewSegmentModal({ onClose, onSave }: NewSegmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: {
      activityDays: 30,
      sessionCount: 1,
      membershipLevel: '',
      interests: [] as string[]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Crear Nuevo Segmento</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Segmento
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Miembros Premium Activos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Describe las características de este segmento..."
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Criterios de Segmentación</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actividad en los últimos
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.criteria.activityDays}
                      onChange={(e) => setFormData({
                        ...formData,
                        criteria: {
                          ...formData.criteria,
                          activityDays: parseInt(e.target.value)
                        }
                      })}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="1"
                    />
                    <span className="text-gray-600">días</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mínimo de sesiones
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.sessionCount}
                    onChange={(e) => setFormData({
                      ...formData,
                      criteria: {
                        ...formData.criteria,
                        sessionCount: parseInt(e.target.value)
                      }
                    })}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Membresía
                  </label>
                  <select
                    value={formData.criteria.membershipLevel}
                    onChange={(e) => setFormData({
                      ...formData,
                      criteria: {
                        ...formData.criteria,
                        membershipLevel: e.target.value
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Cualquiera</option>
                    <option value="basic">Básica</option>
                    <option value="premium">Premium</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              Crear Segmento
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface SegmentInfoModalProps {
  segment: Segment;
  onClose: () => void;
}

function SegmentInfoModal({ segment, onClose }: SegmentInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{segment.name}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
              <p className="text-gray-600">{segment.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Estadísticas</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Total Miembros:</dt>
                    <dd className="font-medium">{segment.count}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Edad Promedio:</dt>
                    <dd className="font-medium">{segment.stats.avgAge} años</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Ubicación Principal:</dt>
                    <dd className="font-medium">{segment.stats.topLocation}</dd>
                  </div>
                  {segment.stats.avgSessionsPerWeek && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Sesiones/Semana:</dt>
                      <dd className="font-medium">{segment.stats.avgSessionsPerWeek}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {segment.criteria && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Criterios</h4>
                  <dl className="space-y-2">
                    {segment.criteria.activityDays && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Período de Actividad:</dt>
                        <dd className="font-medium">{segment.criteria.activityDays} días</dd>
                      </div>
                    )}
                    {segment.criteria.sessionCount && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Mínimo Sesiones:</dt>
                        <dd className="font-medium">{segment.criteria.sessionCount}</dd>
                      </div>
                    )}
                    {segment.criteria.membershipLevel && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Nivel de Membresía:</dt>
                        <dd className="font-medium">{segment.criteria.membershipLevel}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}