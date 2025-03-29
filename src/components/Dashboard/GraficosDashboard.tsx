import React, { useEffect, useState } from 'react';
import { Book, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart, Bar, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Dropdown from '../Common/Dropdown';
import ChartConfigModal from '../Economics/ChartConfigModal';
import Button from '../Common/Button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface GraficosDashboardProps {
  theme: string;
  viewType: 'daily' | 'monthly' | 'annual';
  setViewType: (value: 'daily' | 'monthly' | 'annual') => void;
  currentDate: Date;
  ingresos: any[];
  gastos: any;
}

interface Ingreso {
  _id: string;
  entrenador: string;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion: string;
}

const GraficosDashboard: React.FC<GraficosDashboardProps> = ({
  theme,
  viewType,
  setViewType,
  currentDate,
  ingresos: ingresosProps,
  gastos,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>(viewType === 'monthly' ? 'line' : 'bar');
  const [visibleSeries, setVisibleSeries] = useState({
    ingresos: true,
    gastos: true,
    beneficio: true,
  });
  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
  
    switch (viewType) {
      case 'daily':
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() - end.getDay() + 6);
        break;
      case 'monthly':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        break;
      case 'annual':
        start.setMonth(0, 1);
        end.setMonth(11, 31);
        break;
    }
  
    return { start, end };
  };
  const processData = () => {
    const { start, end } = getDateRange();
    const filteredIngresos = ingresosProps.filter(ingreso => {
      const fecha = new Date(ingreso.fecha);
      return fecha >= start && fecha <= end;
    });

    let labels: string[] = [];
    let ingresosData: number[] = [];

    switch (viewType) {
      case 'daily':
        for (let i = 0; i < 7; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          labels.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));
          
          const dayIngresos = filteredIngresos.filter(ingreso => {
            const ingresoDate = new Date(ingreso.fecha);
            return ingresoDate.getDate() === date.getDate() &&
                   ingresoDate.getMonth() === date.getMonth() &&
                   ingresoDate.getFullYear() === date.getFullYear();
          });
          
          ingresosData.push(dayIngresos.reduce((sum, ingreso) => sum + ingreso.monto, 0));
        }
        break;

      case 'monthly':
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
          labels.push(i.toString());
          
          const dayIngresos = filteredIngresos.filter(ingreso => {
            const ingresoDate = new Date(ingreso.fecha);
            return ingresoDate.getDate() === i;
          });
          
          ingresosData.push(dayIngresos.reduce((sum, ingreso) => sum + ingreso.monto, 0));
        }
        break;

      case 'annual':
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        for (let i = 0; i < 12; i++) {
          labels.push(months[i]);
          
          const monthIngresos = filteredIngresos.filter(ingreso => {
            const ingresoDate = new Date(ingreso.fecha);
            return ingresoDate.getMonth() === i;
          });
          
          ingresosData.push(monthIngresos.reduce((sum, ingreso) => sum + ingreso.monto, 0));
        }
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: ingresosData,
          borderColor: theme === 'dark' ? 'rgb(75, 192, 192)' : 'rgb(53, 162, 235)',
          backgroundColor: theme === 'dark' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(53, 162, 235, 0.5)',
          tension: 0.1,
        }
      ],
    };
  };
  const getTitle = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: viewType !== 'annual' ? 'long' : undefined,
      day: viewType === 'daily' ? 'numeric' : undefined,
    };
    return currentDate.toLocaleDateString('es-ES', options);
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
      title: {
        display: true,
        text: getTitle(),
        color: theme === 'dark' ? '#fff' : '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
          callback: (value: number) => `$${value}`,
        },
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
    },
  };
  // Add CashFlow functions
  const generateDateRange = () => {
    const dates = [];
    let startDate = new Date(currentDate);
    let endDate = new Date(currentDate);
  
    switch (viewType) {
      case 'daily':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        break;
  
      case 'monthly':
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        for (let m = 0; m < 12; m++) {
          dates.push(new Date(currentDate.getFullYear(), m, 1));
        }
        break;
  
      case 'annual':
        const currentYear = currentDate.getFullYear();
        for (let y = currentYear - 4; y <= currentYear; y++) {
          dates.push(new Date(y, 0, 1));
        }
        break;
    }
  
    return dates;
  };
  const formatDateKey = (date: Date) => {
    switch (viewType) {
      case 'daily':
        return date.toLocaleDateString('es-ES', { 
          day: 'numeric',
          month: 'short'
        });
      case 'monthly':
        return date.toLocaleDateString('es-ES', { 
          month: 'short'
        });
      case 'annual':
        return date.getFullYear().toString();
      default:
        return '';
    }
  };
  const processCashFlowData = () => {
    const dates = generateDateRange();
    const dataMap = new Map();
  
    dates.forEach(date => {
      const key = formatDateKey(date);
      dataMap.set(key, { name: key, ingresos: 0, gastos: 0 });
    });
  
    ingresos.forEach(ingreso => {
      const fecha = new Date(ingreso.fecha);
      const key = formatDateKey(fecha);
      if (dataMap.has(key)) {
        const existing = dataMap.get(key);
        existing.ingresos += ingreso.monto;
        dataMap.set(key, existing);
      }
    });
  
    if (Array.isArray(gastos?.data?.gastos)) {
      gastos.data.gastos.forEach(gasto => {
        const fecha = new Date(gasto.fecha);
        const key = formatDateKey(fecha);
        if (dataMap.has(key)) {
          const existing = dataMap.get(key);
          existing.gastos -= gasto.importe;
          dataMap.set(key, existing);
        }
      });
    }
  
    return Array.from(dataMap.values())
      .map(item => ({
        ...item,
        beneficio: item.ingresos + item.gastos
      }));
  };
  const toggleSeries = (series: 'ingresos' | 'gastos' | 'beneficio') => {
    setVisibleSeries(prev => ({ ...prev, [series]: !prev[series] }));
  };
  const renderCashFlowChart = () => {
    const chartData = processCashFlowData();
    if (!chartData || chartData.length === 0) {
      return null;
    }

    const ChartComponent = chartType === 'line' ? LineChart : BarChart;

    return (
      <div className="relative h-[300px]">
        <ChartComponent
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="name" 
            stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
            tick={{
              angle: -45,
              textAnchor: 'end',
              fontSize: 12,
              dy: 10,
              dx: -10
            }}
            height={60}
            interval={0}
          />
          <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
              color: theme === 'dark' ? '#F3F4F6' : '#1F2937',
            }}
            formatter={(value: any, name: string) => {
              if (typeof value !== 'number') return ['0€', ''];
              const absValue = Math.abs(value);
              let label = '';
              switch(name) {
                case 'ingresos':
                  label = 'Ingresos';
                  break;
                case 'gastos':
                  label = 'Gastos';
                  break;
                case 'beneficio':
                  label = 'Beneficio';
                  break;
                default:
                  label = name;
              }
              return [`${value >= 0 ? '+' : '-'}${absValue.toLocaleString('es-ES')}€`, label];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Legend
            formatter={(value) => {
              switch(value) {
                case 'ingresos': return 'Ingresos';
                case 'gastos': return 'Gastos';
                case 'beneficio': return 'Beneficio';
                default: return value;
              }
            }}
            onClick={(e) => {
              const dataKey = e.dataKey as string | undefined;
              if (dataKey === 'ingresos' || dataKey === 'gastos' || dataKey === 'beneficio') {
                toggleSeries(dataKey);
              }
            }}
          />
  
          {visibleSeries.ingresos && (chartType === 'line' ? 
            <Line type="monotone" dataKey="ingresos" stroke="#4ADE80" strokeWidth={2} /> :
            <Bar dataKey="ingresos" fill="#4ADE80" />
          )}
          {visibleSeries.gastos && (chartType === 'line' ? 
            <Line type="monotone" dataKey="gastos" stroke="#EF4444" strokeWidth={2} /> :
            <Bar dataKey="gastos" fill="#EF4444" />
          )}
          {visibleSeries.beneficio && (chartType === 'line' ? 
            <Line type="monotone" dataKey="beneficio" stroke="#60A5FA" strokeWidth={2} /> :
            <Bar dataKey="beneficio" fill="#60A5FA" />
          )}
        </ChartComponent>
      </div>
    );
  };
  // Modify the return statement to use the new integrated cash flow chart
  const chartData = processData();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={`${
        theme === 'dark'
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        {loading ? (
          <div className="flex justify-center items-center h-64">Cargando datos...</div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
        ) : ingresos.length === 0 ? (
          <div className="flex justify-center items-center h-64">No hay datos de ingresos disponibles</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Ingresos</h3>
              <div className="flex items-center gap-3">
                <Dropdown
                  options={timeRangeOptions}
                  value={timeRange}
                  onChange={setTimeRange}
                  className="w-40"
                  position="right"
                />
                <Dropdown
                  options={chartViewOptions}
                  value={chartView}
                  onChange={setChartView}
                  className="w-32"
                  position="right"
                />
              </div>
            </div>
            <div className="relative h-[300px]">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      },
                      ticks: {
                        color: theme === 'dark' ? '#fff' : '#666',
                      },
                    },
                    x: {
                      grid: {
                        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      },
                      ticks: {
                        color: theme === 'dark' ? '#fff' : '#666',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        color: theme === 'dark' ? '#fff' : '#666',
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className={`${
        theme === 'dark'
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Cash Flow</h3>
          <div className="flex items-center gap-2">
            <Tooltip content="Flujo de caja mensual">
              <Book className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} cursor-help transition-colors duration-200`} />
            </Tooltip>
            <button
              onClick={() => setIsConfigOpen(true)}
              className={`p-1 rounded-full ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              } hover:bg-opacity-80 transition-colors duration-200`}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            {renderCashFlowChart()}
          </ResponsiveContainer>
        </div>
        {isConfigOpen && (
          <ChartConfigModal
            onClose={() => setIsConfigOpen(false)}
            onSave={(newChartType) => {
              setChartType(newChartType);
              setIsConfigOpen(false);
            }}
            currentChartType={chartType}
            viewType={viewType}
          />
        )}
      </div>
    </div>
  );
};

export default GraficosDashboard;