// src/components/Economics/Cashflow/CashflowWidget.tsx
import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface CashflowData {
  label: string;
  ingresos: number;
  gastos: number;
  beneficio: number;
}

interface CashflowWidgetProps {
  ingresos: number;
  gastos: number;
  isEditMode: boolean;
  onRemove: () => void;
  onUpdate: () => void;
}

const CashflowWidget: React.FC<CashflowWidgetProps> = ({
  ingresos,
  gastos,
  isEditMode,
  onRemove,
  onUpdate,
}) => {
  const [viewType, setViewType] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { theme } = useTheme();

  // Datos de ejemplo para el gráfico
  const weeklyData: CashflowData[] = useMemo(
    () => [
      { label: 'Lun', ingresos, gastos, beneficio: ingresos - gastos },
      { label: 'Mar', ingresos: 1200, gastos: 900, beneficio: 1200 - 900 },
      { label: 'Mié', ingresos: 1100, gastos: 850, beneficio: 1100 - 850 },
      { label: 'Jue', ingresos: 1300, gastos: 950, beneficio: 1300 - 950 },
      { label: 'Vie', ingresos: 1500, gastos: 1100, beneficio: 1500 - 1100 },
      { label: 'Sáb', ingresos: 1400, gastos: 1000, beneficio: 1400 - 1000 },
      { label: 'Dom', ingresos: 900, gastos: 700, beneficio: 900 - 700 },
    ],
    [ingresos, gastos]
  );

  const monthlyData: CashflowData[] = useMemo(
    () => [
      { label: 'Ene', ingresos, gastos, beneficio: ingresos - gastos },
      { label: 'Feb', ingresos: 4000, gastos: 2000, beneficio: 4000 - 2000 },
      { label: 'Mar', ingresos: 3200, gastos: 1800, beneficio: 3200 - 1800 },
      { label: 'Abr', ingresos: 5000, gastos: 2300, beneficio: 5000 - 2300 },
      { label: 'May', ingresos: 4500, gastos: 2100, beneficio: 4500 - 2100 },
      { label: 'Jun', ingresos: 4800, gastos: 2200, beneficio: 4800 - 2200 },
      { label: 'Jul', ingresos: 5200, gastos: 2600, beneficio: 5200 - 2600 },
      { label: 'Ago', ingresos: 4300, gastos: 2100, beneficio: 4300 - 2100 },
      { label: 'Sep', ingresos: 4100, gastos: 2000, beneficio: 4100 - 2000 },
      { label: 'Oct', ingresos: 3900, gastos: 1900, beneficio: 3900 - 1900 },
      { label: 'Nov', ingresos: 5700, gastos: 2700, beneficio: 5700 - 2700 },
      { label: 'Dic', ingresos: 5900, gastos: 2900, beneficio: 5900 - 2900 },
    ],
    [ingresos, gastos]
  );

  const annualData: CashflowData[] = useMemo(
    () => [
      { label: '2020', ingresos, gastos, beneficio: ingresos - gastos },
      { label: '2021', ingresos: 55000, gastos: 42000, beneficio: 55000 - 42000 },
      { label: '2022', ingresos: 60000, gastos: 45000, beneficio: 60000 - 45000 },
      { label: '2023', ingresos: 65000, gastos: 48000, beneficio: 65000 - 48000 },
      { label: '2024', ingresos: 70000, gastos: 50000, beneficio: 70000 - 50000 },
    ],
    [ingresos, gastos]
  );

  const getData = () => {
    switch (viewType) {
      case 'weekly':
        return weeklyData;
      case 'annual':
        return annualData;
      default:
        return monthlyData;
    }
  };

  const handlePrev = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'weekly':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'annual':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'weekly':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'annual':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
      }
      return newDate;
    });
  };

  const getDateDisplay = () => {
    switch (viewType) {
      case 'weekly':
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Lunes
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Domingo
        return `Semana del ${weekStart.toLocaleDateString()} al ${weekEnd.toLocaleDateString()}`;
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      case 'annual':
        return currentDate.getFullYear().toString();
    }
  };

  // Definir colores basados en el tema
  const colors = {
    ingresos: theme === 'dark' ? '#3B82F6' : '#60A5FA', // Azul
    gastos: theme === 'dark' ? '#EF4444' : '#F87171',   // Rojo
    beneficio: theme === 'dark' ? '#10B981' : '#34D399', // Verde
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    axis: theme === 'dark' ? '#9CA3AF' : '#4B5563',
    tooltipBg: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    tooltipBorder: theme === 'dark' ? '#374151' : '#E5E7EB',
    legendText: theme === 'dark' ? '#D1D5DB' : '#1F2937',
    background: theme === 'dark' ? '#2D3748' : '#FFFFFF',
  };

  // Personalizar Tooltip
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
    <div
      className={`relative p-4 h-full flex flex-col ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } rounded-lg shadow-md transition-colors duration-200`}
    >
      {isEditMode && (
        <>
          <button
            onClick={onRemove}
            className={`absolute top-2 right-2 ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            } bg-transparent rounded-full p-1`}
            title="Eliminar Widget"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button
            onClick={onUpdate}
            className={`absolute top-2 right-10 ${
              theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            } bg-transparent rounded-full p-1`}
            title="Actualizar Widget"
          >
            Actualizar
          </button>
        </>
      )}
      {/* Title and controls container */}
            <div className="flex flex-col gap-4 mb-2">
              {/* Title row */}
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                Cash Flow
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
                    <ChevronLeft className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
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
                    <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                </div>
                {/* View type dropdown */}
                <div className="relative inline-block text-left">
                  <select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value as 'weekly' | 'monthly' | 'annual')}
                    className={`block w-full pl-2 pr-8 py-1 text-sm border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="annual">Anual</option>
                  </select>
                </div>
              </div>
            </div>
      <div className="flex-grow min-h-0 overflow-x-auto">
        <div style={{ minWidth: '800px', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={getData()}
              margin={{ top: 10, right: 25, left: 10, bottom: 25 }}
            >
              {/* Rejilla del gráfico */}
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />

              {/* Eje X */}
              <XAxis
                dataKey="label"
                stroke={colors.axis}
                tick={{ 
                  fill: colors.axis,
                  angle: -45,
                  textAnchor: 'end',
                  fontSize: 12,
                  dy: 8,
                  dx: -8
                }}
                height={50}
                interval={0}
              />

              {/* Eje Y Primario */}
              <YAxis
                yAxisId="left"
                stroke={colors.axis}
                tick={{ fill: colors.axis }}
                fontSize={12}
                label={{
                  value: 'Euros',
                  angle: -90,
                  position: 'insideLeft',
                  fill: colors.axis,
                  fontSize: 12,
                }}
              />

              {/* Eje Y Secundario para Beneficio */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={colors.axis}
                tick={{ fill: colors.axis }}
                fontSize={12}
                label={{
                  value: 'Beneficio (€)',
                  angle: 90,
                  position: 'insideRight',
                  fill: colors.axis,
                  fontSize: 12,
                }}
              />

              {/* Tooltip Personalizado */}
              <Tooltip content={<CustomTooltip />} />

              {/* Leyenda */}
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  color: colors.legendText,
                  fontSize: 12,
                }}
              />

              {/* Barras de Ingresos */}
              <Bar
                yAxisId="left"
                dataKey="ingresos"
                name="Ingresos"
                fill={colors.ingresos}
                barSize={30}
                radius={[4, 4, 0, 0]}
              />

              {/* Barras de Gastos */}
              <Bar
                yAxisId="left"
                dataKey="gastos"
                name="Gastos"
                fill={colors.gastos}
                barSize={30}
                radius={[4, 4, 0, 0]}
              />

              {/* Línea de Beneficio */}
              <Line
                type="monotone"
                dataKey="beneficio"
                name="Beneficio"
                stroke={colors.beneficio}
                strokeWidth={3}
                dot={{ fill: colors.beneficio, r: 4 }}
                activeDot={{ r: 6 }}
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div
        className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        } mt-2 text-center`}
      >
        Resumen de ingresos, gastos y beneficios para {getDateDisplay()}
      </div>
    </div>
  );
};

export default CashflowWidget;
