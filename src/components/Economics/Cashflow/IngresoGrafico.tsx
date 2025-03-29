// src/components/Economics/Cashflow/IngresoGrafico.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface Ingreso {
  monto: number;
  fecha: string;
}

interface IngresoData {
  name: string;
  ingresos: number;
}

const IngresoGrafico: React.FC = () => {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<'annual' | 'monthly' | 'weekly'>('annual');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ingresoData, setIngresoData] = useState<IngresoData[]>([]);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos.');
        }

        const data: Ingreso[] = await response.json();
        const processedData = processIngresos(data);
        setIngresoData(processedData);
      } catch (err: any) {
        console.error('Error al obtener ingresos:', err);
      }
    };

    fetchIngresos();
  }, [currentDate, viewType]);

  const processIngresos = (ingresos: Ingreso[]) => {
    const aggregatedData: { [key: string]: number } = {};
    
    ingresos.forEach((ingreso) => {
      const date = new Date(ingreso.fecha);
      let key = '';

      switch (viewType) {
        case 'annual':
          // Procesar vista anual (12 meses del año actual)
          if (date.getFullYear() === currentDate.getFullYear()) {
            key = date.toLocaleDateString('es-ES', { month: 'short' });
            if (!aggregatedData[key]) aggregatedData[key] = 0;
            aggregatedData[key] += ingreso.monto;
          }
          break;

        case 'monthly':
          // Procesar vista mensual (días del mes actual)
          if (date.getMonth() === currentDate.getMonth() && 
              date.getFullYear() === currentDate.getFullYear()) {
            key = date.getDate().toString();
            if (!aggregatedData[key]) aggregatedData[key] = 0;
            aggregatedData[key] += ingreso.monto;
          }
          break;

        case 'weekly':
          // Procesar vista semanal (7 días de la semana actual)
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          if (date >= startOfWeek && date <= endOfWeek) {
            key = date.toLocaleDateString('es-ES', { weekday: 'short' });
            if (!aggregatedData[key]) aggregatedData[key] = 0;
            aggregatedData[key] += ingreso.monto;
          }
          break;
      }
    });

    // Asegurar que todos los períodos estén representados
    const result: IngresoData[] = [];
    
    switch (viewType) {
      case 'annual':
        // Generar todos los meses del año
        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(currentDate.getFullYear(), i, 1);
          return date.toLocaleDateString('es-ES', { month: 'short' });
        });
        months.forEach(month => {
          result.push({
            name: month,
            ingresos: aggregatedData[month] || 0
          });
        });
        break;

      case 'monthly':
        // Generar todos los días del mes
        const daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate();
        
        Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
          .forEach(day => {
            result.push({
              name: day,
              ingresos: aggregatedData[day] || 0
            });
          });
        break;

      case 'weekly':
        // Generar todos los días de la semana
        const weekDays = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
        weekDays.forEach(day => {
          result.push({
            name: day,
            ingresos: aggregatedData[day] || 0
          });
        });
        break;
    }

    return result;
  };

  const handleViewTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewType(e.target.value as 'annual' | 'monthly' | 'weekly');
  };

  const handlePrev = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'annual':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'weekly':
          newDate.setDate(newDate.getDate() - 7);
          break;
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'annual':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'weekly':
          newDate.setDate(newDate.getDate() + 7);
          break;
      }
      return newDate;
    });
  };

  const getDateDisplay = () => {
    switch (viewType) {
      case 'annual':
        return currentDate.getFullYear().toString();
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      case 'weekly':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
  };

  // Definir colores basados en el tema
  const colors = {
    ingresos: theme === 'dark' ? '#3B82F6' : '#60A5FA',
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    axis: theme === 'dark' ? '#9CA3AF' : '#4B5563',
    tooltipBg: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    tooltipBorder: theme === 'dark' ? '#374151' : '#E5E7EB',
    legendText: theme === 'dark' ? '#D1D5DB' : '#1F2937',
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: colors.tooltipBg,
            border: `1px solid ${colors.tooltipBorder}`,
            borderRadius: '0.375rem',
            padding: '10px',
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
          }}
        >
          <p className="label font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: 0 }}>
              {`${entry.name}: ${entry.value.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative h-96 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-200`}>
      {/* Title and controls container */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Title row */}
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          Ingresos
        </h3>
        {/* Controls row */}
        <div className="flex items-center justify-between space-x-2">
          {/* Navigation controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              className={`p-1 rounded-full ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } transition-colors duration-200`}
              title="Anterior"
            >
              <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              {getDateDisplay()}
            </span>
            <button
              onClick={handleNext}
              className={`p-1 rounded-full ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } transition-colors duration-200`}
              title="Siguiente"
            >
              <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
          <div className="relative inline-block text-left">
            <select
              value={viewType}
              onChange={handleViewTypeChange}
              className={`block w-full pl-3 pr-10 py-2 text-base border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option value="annual">Anual</option>
              <option value="monthly">Mensual</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {getDateDisplay()}
        </span>
      </div>

      <div className="w-full h-[calc(100%-100px)]">
        <ResponsiveContainer>
          <BarChart data={ingresoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="name"
              stroke={colors.axis}
              tick={{ fill: colors.axis }}
            />
            <YAxis
              stroke={colors.axis}
              tick={{ fill: colors.axis }}
              tickFormatter={(value) =>
                new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                color: colors.legendText,
              }}
            />
            <Bar
              dataKey="ingresos"
              fill={colors.ingresos}
              name="Ingresos"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IngresoGrafico;
