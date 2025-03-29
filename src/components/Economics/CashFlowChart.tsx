import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { Settings } from 'lucide-react';
import ChartConfigModal from './ChartConfigModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Common/Button';
import Dropdown from '../Common/Dropdown';

interface CashFlowChartProps {
  viewType: 'weekly' | 'monthly' | 'annual';
  currentDate: Date;
  ingresos: any[];
  gastos: any;
  onDateChange?: (date: Date) => void;
  onViewTypeChange?: (viewType: 'weekly' | 'monthly' | 'annual') => void;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ 
  viewType, 
  currentDate, 
  ingresos, 
  gastos,
  onDateChange: externalOnDateChange,
  onViewTypeChange: externalOnViewTypeChange
}) => {
  const { theme } = useTheme();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>(viewType === 'monthly' ? 'line' : 'bar');
  const [visibleSeries, setVisibleSeries] = useState({
    ingresos: true,
    gastos: true,
    beneficio: true,
  });
  const [internalDate, setInternalDate] = useState(currentDate);
  const [internalViewType, setInternalViewType] = useState(viewType);
  
   // Actualizar useEffect para que reaccione a cambios en internalViewType
   useEffect(() => {
    setChartType(viewType === 'monthly' ? 'line' : 'bar');
  }, [viewType]);

  // Añadir un nuevo useEffect para actualizar cuando cambia la vista
  useEffect(() => {
    // Actualizar el tipo de gráfico según la vista
    setChartType(internalViewType === 'monthly' ? 'line' : 'bar');
  }, [internalViewType]);

  // Función para manejar cambios de tipo de vista
  const handleViewTypeChange = (newViewType: 'weekly' | 'monthly' | 'annual') => {
    setInternalViewType(newViewType);
    
    if (externalOnViewTypeChange) {
      externalOnViewTypeChange(newViewType);
    }
  };

  // Función para generar todas las fechas del período
  // Función para generar todas las fechas del período
  const generateDateRange = () => {
    const dates = [];
    let startDate = new Date(internalDate); // Usar internalDate en lugar de currentDate
    let endDate = new Date(internalDate); // Usar internalDate en lugar de currentDate

    switch (internalViewType) {
      case 'weekly':
        // Mostrar los 7 días de la semana actual (lunes a domingo)
        startDate = new Date(internalDate); // Usar internalDate
        // Ir al lunes de la semana actual (lunes = 1)
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que la semana comience en lunes
        startDate = new Date(startDate.setDate(diff));
        
        // Generar los 7 días de la semana
        for (let i = 0; i < 7; i++) {
          const dayDate = new Date(startDate);
          dayDate.setDate(startDate.getDate() + i);
          dates.push(new Date(dayDate));
        }
        break;

      case 'monthly':
        // Mostrar todos los días del mes actual
        startDate = new Date(internalDate.getFullYear(), internalDate.getMonth(), 1); // Usar internalDate
        endDate = new Date(internalDate.getFullYear(), internalDate.getMonth() + 1, 0); // Usar internalDate
        const daysInMonth = endDate.getDate();
        
        for (let d = 1; d <= daysInMonth; d++) {
          dates.push(new Date(internalDate.getFullYear(), internalDate.getMonth(), d)); // Usar internalDate
        }
        break;

      case 'annual':
        // Mostrar los 12 meses del año actual
        const year = internalDate.getFullYear(); // Usar internalDate
        for (let m = 0; m < 12; m++) {
          dates.push(new Date(year, m, 1));
        }
        break;
    }

    return dates;
  };
  // Función para formatear la clave de fecha según el tipo de vista
    // Función para formatear la clave de fecha según el tipo de vista
    const formatDateKey = (date: Date) => {
      switch (internalViewType) {
        case 'weekly':
          // Formato para días: "Lunes", "Martes", etc.
          const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          return weekdays[date.getDay()];
        case 'monthly':
          // Formato para días del mes: "1", "2", etc.
          return date.getDate().toString();
        case 'annual':
          // Formato para meses: "Ene", "Feb", etc.
          return date.toLocaleDateString('es-ES', { month: 'short' });
        default:
          return '';
      }
    };

  // Actualizar la función navigateDate para que se ajuste a las nuevas vistas
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(internalDate);
    
    switch (internalViewType) {
      case 'weekly':
        // Mover a la semana anterior o siguiente
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        // Mover al mes anterior o siguiente
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'annual':
        // Mover al año anterior o siguiente
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setInternalDate(newDate);
    if (externalOnDateChange) {
      externalOnDateChange(newDate);
    }
  };

  const getTitle = () => {
    switch (internalViewType) {
      case 'weekly':
        // Para vista semanal: "Semana del DD/MM al DD/MM de YYYY"
        const weekStart = new Date(internalDate); // Usar internalDate
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return `Semana del ${weekStart.getDate()}/${weekStart.getMonth() + 1} al ${weekEnd.getDate()}/${weekEnd.getMonth() + 1} de ${weekStart.getFullYear()}`;
      
      case 'monthly':
        // Para vista mensual: "Mes de MMMM YYYY"
        return `Mes de ${internalDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`; // Usar internalDate
      
      case 'annual':
        // Para vista anual: "Año YYYY"
        return `Año ${internalDate.getFullYear()}`; // Usar internalDate
    }
  };
    // Función para procesar los datos basados en el tipo de vista
    const processData = () => {
      const dates = generateDateRange();
      const dataMap = new Map();
      
      // Calcular el rango de fechas para filtrar
      let startDate = new Date(internalDate);
      let endDate = new Date(internalDate);
      
      switch (internalViewType) {
        case 'weekly':
          // Ajustar al lunes de la semana actual
          const day = startDate.getDay();
          const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
          startDate = new Date(startDate.setDate(diff));
          
          // Establecer el fin de semana (domingo)
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
          
        case 'monthly':
          // Primer día del mes
          startDate = new Date(internalDate.getFullYear(), internalDate.getMonth(), 1);
          // Último día del mes
          endDate = new Date(internalDate.getFullYear(), internalDate.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
          
        case 'annual':
          // Primer día del año
          startDate = new Date(internalDate.getFullYear(), 0, 1);
          // Último día del año
          endDate = new Date(internalDate.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
      }
  
      // Inicializar todas las fechas con valores en 0
      dates.forEach(date => {
        const key = formatDateKey(date);
        dataMap.set(key, { name: key, ingresos: 0, gastos: 0 });
      });
  
      // Filtrar y procesar ingresos dentro del rango de fechas
      ingresos.forEach(ingreso => {
        const fecha = new Date(ingreso.fecha);
        // Verificar si la fecha está dentro del rango seleccionado
        if (fecha >= startDate && fecha <= endDate) {
          const key = formatDateKey(fecha);
          if (dataMap.has(key)) {
            const existing = dataMap.get(key);
            existing.ingresos += ingreso.monto;
            dataMap.set(key, existing);
          }
        }
      });
  
      // Filtrar y procesar gastos dentro del rango de fechas
      if (Array.isArray(gastos?.data?.gastos)) {
        gastos.data.gastos.forEach(gasto => {
          const fecha = new Date(gasto.fecha);
          // Verificar si la fecha está dentro del rango seleccionado
          if (fecha >= startDate && fecha <= endDate) {
            const key = formatDateKey(fecha);
            if (dataMap.has(key)) {
              const existing = dataMap.get(key);
              existing.gastos -= gasto.importe; // Convertir a negativo
              dataMap.set(key, existing);
            }
          }
        });
      }
  
      // Convertir el mapa a array y calcular beneficios
      return Array.from(dataMap.values())
        .map(item => ({
          ...item,
          beneficio: item.ingresos + item.gastos // Sumamos porque gastos ya es negativo
        }));
    };

  // Función para formatear la clave de fecha según el tipo de vista

  const data = processData();

  const toggleSeries = (series: 'ingresos' | 'gastos' | 'beneficio') => {
    setVisibleSeries(prev => ({ ...prev, [series]: !prev[series] }));
  };
  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    return (
      <ChartComponent
        data={data}
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
              toggleSeries(dataKey as 'ingresos' | 'gastos' | 'beneficio');
            }
          }}
          verticalAlign="top"
          height={36}
        />

        {visibleSeries.ingresos && (chartType === 'line' ? 
          <Line 
            type="monotone" 
            dataKey="ingresos" 
            stroke="#4ADE80" 
            strokeWidth={2}
            name="ingresos"
          /> :
          <Bar 
            dataKey="ingresos" 
            fill="#4ADE80"
            name="ingresos"
          />
        )}
        {visibleSeries.gastos && (chartType === 'line' ? 
          <Line 
            type="monotone" 
            dataKey="gastos" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="gastos"
          /> :
          <Bar 
            dataKey="gastos" 
            fill="#EF4444"
            name="gastos"
          />
        )}
        {visibleSeries.beneficio && (chartType === 'line' ? 
          <Line 
            type="monotone" 
            dataKey="beneficio" 
            stroke="#60A5FA" 
            strokeWidth={2}
            name="beneficio"
          /> :
          <Bar 
            dataKey="beneficio" 
            fill="#60A5FA"
            name="beneficio"
          />
        )}
      </ChartComponent>
    );
  };

  const viewOptions = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'annual', label: 'Anual' },
  ];

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        Cash Flow 
      </h3>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium">{getTitle()}</span>
          <Button variant="secondary" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="w-48">
        <Dropdown
            options={viewOptions}
            value={internalViewType}
            onChange={(value) => handleViewTypeChange(value as 'weekly' | 'monthly' | 'annual')}
            placeholder="Seleccionar vista"
            position="left"
          />
        </div>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={700}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowChart;