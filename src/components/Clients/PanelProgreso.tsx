import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useCheckin } from '../../contexts/CheckinContext';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Camera,
  Scale,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
  Package,
  Clock,
  FileText,
  Dumbbell,
  Utensils,
  Eye
} from 'lucide-react';
import Button from '../Common/Button';

interface BaseCheckin {
  fecha: string;
  notas: string;
  fotos: string[];
  estado: 'success' | 'warning' | 'error';
}

interface EntrenamientoCheckin extends BaseCheckin {
  tipo: 'entrenamiento';
  pesoLevantado: number;
  repeticiones: number;
  series: number;
  ejerciciosCompletados: number;
}

interface DietaCheckin extends BaseCheckin {
  tipo: 'dieta';
  peso: number;
  calorias: number;
  macros: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

type Checkin = EntrenamientoCheckin | DietaCheckin;

interface ServicioContratado {
  id: string;
  nombre: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'pendiente' | 'finalizado';
}

interface PanelProgresoProps {
}

const PanelProgreso: React.FC<PanelProgresoProps> = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { setSelectedCheckin } = useCheckin();
  const navigate = useNavigate();

  // Datos de ejemplo se mantienen igual
  const checkins: Checkin[] = [
    {
      tipo: 'entrenamiento',
      fecha: '2024-02-08',
      pesoLevantado: 80,
      repeticiones: 12,
      series: 4,
      ejerciciosCompletados: 8,
      fotos: ['/entrenamiento1.jpg'],
      notas: 'Buena sesión de entrenamiento. Aumentó peso en press banca.',
      estado: 'success'
    },
    {
      tipo: 'dieta',
      fecha: '2024-02-08',
      peso: 75,
      calorias: 2200,
      macros: {
        proteinas: 180,
        carbohidratos: 220,
        grasas: 70
      },
      fotos: ['/dieta1.jpg'],
      notas: 'Cumpliendo bien con la dieta. Manteniendo macros.',
      estado: 'warning'
    }
  ];

  const datosGrafico = [
    { fecha: '2024-01-01', peso: 78 },
    { fecha: '2024-01-15', peso: 76.5 },
    { fecha: '2024-02-01', peso: 75.2 },
    { fecha: '2024-02-08', peso: 75 },
  ];

  const serviciosContratados: ServicioContratado[] = [
    {
      id: '1',
      nombre: 'Plan Entrenamiento Personal',
      tipo: 'entrenamiento',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      estado: 'activo'
    },
    {
      id: '2',
      nombre: 'Asesoramiento Nutricional',
      tipo: 'nutricion',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-06-30',
      estado: 'activo'
    }
  ];

  const ultimoCheckinEntrenamiento = checkins.find(
    (checkin): checkin is EntrenamientoCheckin => checkin.tipo === 'entrenamiento'
  );

  const ultimoCheckinDieta = checkins.find(
    (checkin): checkin is DietaCheckin => checkin.tipo === 'dieta'
  );

  const getStatusColor = (estado: 'success' | 'warning' | 'error') => {
    switch (estado) {
      case 'success':
        return {
          border: 'border-l-4 border-green-500',
          bg: 'bg-green-50 dark:bg-green-900/20',
          icon: 'text-green-500'
        };
      case 'warning':
        return {
          border: 'border-l-4 border-yellow-500',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          icon: 'text-yellow-500'
        };
      case 'error':
        return {
          border: 'border-l-4 border-red-500',
          bg: 'bg-red-50 dark:bg-red-900/20',
          icon: 'text-red-500'
        };
    }
  };

  const renderCheckin = (checkin: Checkin) => {
    const isEntrenamiento = checkin.tipo === 'entrenamiento';
    const statusStyles = getStatusColor(checkin.estado);
    
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300 ${statusStyles.border} ${statusStyles.bg}`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isEntrenamiento ? (
              <Dumbbell className={`w-5 h-5 ${statusStyles.icon}`} />
            ) : (
              <Utensils className={`w-5 h-5 ${statusStyles.icon}`} />
            )}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Último Check-in {isEntrenamiento ? 'Entrenamiento' : 'Dieta'}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({new Date(checkin.fecha).toLocaleDateString()})
            </span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVerDetalles(checkin)}
            className="flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {isEntrenamiento ? (
              <>
                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Scale className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Peso levantado:</span> {(checkin as EntrenamientoCheckin).pesoLevantado} kg
                </p>
                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Series:</span> {(checkin as EntrenamientoCheckin).series} x {(checkin as EntrenamientoCheckin).repeticiones} reps
                </p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Scale className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Peso actual:</span> {(checkin as DietaCheckin).peso} kg
                </p>
                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Utensils className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Calorías:</span> {(checkin as DietaCheckin).calorias} kcal
                </p>
              </>
            )}
            {checkin.notas && (
              <div className="flex gap-2 mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                  {checkin.notas}
                </p>
              </div>
            )}
          </div>
          {checkin.fotos.length > 0 && (
            <div className="flex gap-3 justify-end">
              {checkin.fotos.map((foto, index) => (
                <div key={index} className="relative group">
                  <img
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    className="w-28 h-28 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleVerDetalles = (checkin: Checkin) => {
    setSelectedCheckin(checkin);
    navigate('/checkin-detalle');
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
        Panel de Progreso
      </h1>
      
      {/* Check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ultimoCheckinEntrenamiento && renderCheckin(ultimoCheckinEntrenamiento)}
        {ultimoCheckinDieta && renderCheckin(ultimoCheckinDieta)}
      </div>

      {/* Gráfico de Progreso */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Progreso de Peso
          </span>
        </h2>
        <div className="h-72 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="fecha" 
                tick={{ fill: isDark ? '#d1d5db' : '#4b5563' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                stroke={isDark ? '#6b7280' : '#9ca3af'}
              />
              <YAxis 
                tick={{ fill: isDark ? '#d1d5db' : '#4b5563' }} 
                stroke={isDark ? '#6b7280' : '#9ca3af'}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                  color: isDark ? '#f9fafb' : '#111827',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '10px',
                  color: isDark ? '#f9fafb' : '#111827'
                }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                name="Peso (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Servicios Contratados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Servicios Contratados
          </span>
        </h2>
        <div className="space-y-4">
          {serviciosContratados.map((servicio, index) => (
            <div
              key={index}
              onClick={() => navigate('/servicios')}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    servicio.estado === 'activo'
                      ? 'bg-green-500 animate-pulse'
                      : servicio.estado === 'pendiente'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">{servicio.nombre}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                  {servicio.fechaInicio} - {servicio.fechaFin}
                </div>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanelProgreso;
