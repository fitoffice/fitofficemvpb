import React, { useState } from 'react';
import { Search, Bell, Settings, ChevronDown, User, Calendar, TrendingUp, Filter, AlertCircle, ArrowUp, ArrowDown, Minus, ArrowRight } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  photo?: string;
  goal?: string;
  hasPlan: boolean;
  weight?: number;
  targetWeight?: number;
  adherence?: number;
  lastUpdate?: string;
  nextReview?: string;
  createdAt?: string;
  weightTrend?: 'up' | 'down' | 'stable';
  status?: 'active' | 'pending' | 'finished' | 'expired';
  adherenceHistory?: number[];
  dietaryRestrictions?: string[];
  lastDataEntry?: string;
}

const mockClients: Client[] = [
  { 
    id: '1', 
    name: 'Ana García', 
    goal: 'Pérdida de peso', 
    hasPlan: true, 
    weight: 70, 
    targetWeight: 65, 
    adherence: 85, 
    lastUpdate: '2025-01-09',
    nextReview: '2025-01-17',
    createdAt: '2024-12-15',
    weightTrend: 'down',
    status: 'active',
    adherenceHistory: [82, 84, 85, 85],
    lastDataEntry: '2025-01-09'
  },
  { 
    id: '2', 
    name: 'Carlos Ruiz', 
    goal: 'Ganancia muscular', 
    hasPlan: false,
    status: 'pending'
  },
  { 
    id: '3', 
    name: 'María López', 
    goal: 'Mantenimiento', 
    hasPlan: true, 
    weight: 58, 
    targetWeight: 58, 
    adherence: 92, 
    lastUpdate: '2025-01-08',
    nextReview: '2025-01-15',
    createdAt: '2024-12-20',
    weightTrend: 'stable',
    status: 'active',
    adherenceHistory: [90, 91, 92, 92],
    lastDataEntry: '2025-01-08'
  },
];

const ClientCard: React.FC<{ client: Client }> = ({ client }) => {
  const getWeightTrendIcon = () => {
    switch (client.weightTrend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-red-500 animate-bounce" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-green-500 animate-bounce" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAdherenceColor = (adherence?: number) => {
    if (!adherence) return 'bg-gray-200';
    if (adherence >= 90) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (adherence >= 70) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  const getDaysUntilReview = () => {
    if (!client.nextReview) return null;
    const days = Math.ceil((new Date(client.nextReview).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
        ${client.adherence && client.adherence < 70 ? 'border-l-4 border-red-500' : ''}
        ${!client.hasPlan ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center shadow-inner overflow-hidden group-hover:shadow-lg transition-all duration-300">
            {client.photo ? (
              <img src={client.photo} alt={client.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{client.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              {client.goal}
              {client.status === 'active' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Activo
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500 dark:text-gray-400">Última actualización</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{client.lastUpdate || 'N/A'}</p>
        </div>
      </div>

      {client.hasPlan && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Peso actual</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="font-semibold text-gray-800 dark:text-white">{client.weight}kg</span>
                {getWeightTrendIcon()}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Objetivo</p>
              <span className="font-semibold text-gray-800 dark:text-white">{client.targetWeight}kg</span>
            </div>
            <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Adherencia</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getAdherenceColor(client.adherence)} transition-all duration-500 ease-out`}
                    style={{ width: `${client.adherence}%` }}
                  />
                </div>
                <span className="font-semibold text-sm text-gray-800 dark:text-white">{client.adherence}%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Próxima revisión: </span>
              <span className={`font-medium ${
                getDaysUntilReview() && getDaysUntilReview()! <= 3 
                  ? 'text-orange-500 dark:text-orange-400 animate-pulse' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {getDaysUntilReview() ? `${getDaysUntilReview()} días` : 'N/A'}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                Ver Plan
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                Reajustar
              </button>
            </div>
          </div>
        </>
      )}

      {!client.hasPlan && (
        <div className="flex justify-center mt-4">
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-2">
            <span>Generar Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {client.adherenceHistory && client.adherenceHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Historial de adherencia</p>
          <div className="flex gap-1 h-8">
            {client.adherenceHistory.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-sm relative group"
              >
                <div
                  className={`absolute bottom-0 w-full rounded-sm transition-all duration-300 ${getAdherenceColor(value)}`}
                  style={{ height: `${value}%` }}
                />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {value}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NutritionAgentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'finished' | 'expired'>('all');
  const [filterGoal, setFilterGoal] = useState<string>('all');
  const [filterAdherence, setFilterAdherence] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState(false);

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilterStatus = filterStatus === 'all' 
      || (filterStatus === 'active' && client.status === 'active')
      || (filterStatus === 'pending' && client.status === 'pending')
      || (filterStatus === 'finished' && client.status === 'finished')
      || (filterStatus === 'expired' && client.status === 'expired');
    const matchesFilterGoal = filterGoal === 'all' 
      || (filterGoal === 'weightLoss' && client.goal === 'Pérdida de peso')
      || (filterGoal === 'muscleGain' && client.goal === 'Ganancia muscular')
      || (filterGoal === 'maintenance' && client.goal === 'Mantenimiento');
    const matchesFilterAdherence = filterAdherence === 'all' 
      || (filterAdherence === 'high' && client.adherence >= 80)
      || (filterAdherence === 'medium' && client.adherence >= 50 && client.adherence < 80)
      || (filterAdherence === 'low' && client.adherence < 50);
    return matchesSearch && matchesFilterStatus && matchesFilterGoal && matchesFilterAdherence;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white">
        <div className="container mx-auto">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="relative px-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <span className="bg-white/10 p-2 rounded-lg">
                      <TrendingUp className="w-8 h-8" />
                    </span>
                    Agente de Nutrición & Dietas
                  </h1>
                  <p className="text-green-100 text-lg">
                    ¡Agente Activado! Ya puedes asignar planes de alimentación a tus clientes de forma automática.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowConfigModal(true)}
                    className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <Settings className="w-6 h-6" />
                  </button>
                  <button className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Clientes con Plan</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {mockClients.filter(c => c.hasPlan).length}
                </h3>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-2xl">
                <User className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Adherencia Promedio</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  88.5%
                </h3>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Próximas Revisiones</p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                  5
                </h3>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-2xl">
                <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'pending' | 'finished' | 'expired')}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="pending">Pendientes</option>
                <option value="finished">Finalizados</option>
                <option value="expired">Expirados</option>
              </select>
              <select
                value={filterGoal}
                onChange={(e) => setFilterGoal(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Todos los objetivos</option>
                <option value="weightLoss">Pérdida de peso</option>
                <option value="muscleGain">Ganancia muscular</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
              <select
                value={filterAdherence}
                onChange={(e) => setFilterAdherence(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">Todas las adherencias</option>
                <option value="high">Alta (&gt;80%)</option>
                <option value="medium">Media (50-80%)</option>
                <option value="low">Baja (&lt;50%)</option>
              </select>
              <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-2">
                <span>Nuevo Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Configuración del Agente</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Plan por Defecto</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                  <option>Hipocalórico</option>
                  <option>Hipercalórico</option>
                  <option>Balanceado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frecuencia de Comidas</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                  <option>3 comidas al día</option>
                  <option>5 comidas al día</option>
                  <option>6 comidas al día</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enviar Recordatorios</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionAgentPage;
