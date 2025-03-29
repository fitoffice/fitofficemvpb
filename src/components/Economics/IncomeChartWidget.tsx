import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Common/Button';
import Dropdown from '../Common/Dropdown';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Ingreso {
  _id: string;
  entrenador: string;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion: string;
}

type ViewType = 'weekly' | 'monthly' | 'annual';

const IncomeChartWidget: React.FC = () => {
  const { theme } = useTheme();
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos');
        }

        const data = await response.json();
        setIngresos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'weekly':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (viewType) {
      case 'weekly':
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
    const filteredIngresos = ingresos.filter(ingreso => {
      const fecha = new Date(ingreso.fecha);
      return fecha >= start && fecha <= end;
    });

    let labels: string[] = [];
    let data: { [key: string]: number } = {};

    switch (viewType) {
      case 'weekly':
        for (let i = 0; i < 7; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          const label = date.toLocaleDateString('es-ES', { weekday: 'short' });
          labels.push(label);
          data[label] = 0;
        }
        filteredIngresos.forEach(ingreso => {
          const fecha = new Date(ingreso.fecha);
          const label = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
          data[label] = (data[label] || 0) + ingreso.monto;
        });
        break;

      case 'monthly':
        const lastDay = end.getDate();
        for (let i = 1; i <= lastDay; i++) {
          labels.push(i.toString());
          data[i.toString()] = 0;
        }
        filteredIngresos.forEach(ingreso => {
          const fecha = new Date(ingreso.fecha);
          const label = fecha.getDate().toString();
          data[label] = (data[label] || 0) + ingreso.monto;
        });
        break;

      case 'annual':
        for (let i = 0; i < 12; i++) {
          const date = new Date(start.getFullYear(), i, 1);
          const label = date.toLocaleDateString('es-ES', { month: 'short' });
          labels.push(label);
          data[label] = 0;
        }
        filteredIngresos.forEach(ingreso => {
          const fecha = new Date(ingreso.fecha);
          const label = fecha.toLocaleDateString('es-ES', { month: 'short' });
          data[label] = (data[label] || 0) + ingreso.monto;
        });
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: labels.map(label => data[label]),
          borderColor: theme === 'dark' ? 'rgb(75, 192, 192)' : 'rgb(53, 162, 235)',
          backgroundColor: theme === 'dark' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(53, 162, 235, 0.5)',
          tension: 0.4,
        },
      ],
    };
  };

  const getTitle = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: viewType !== 'annual' ? 'long' : undefined,
      day: viewType === 'weekly' ? 'numeric' : undefined,
    };
    return currentDate.toLocaleDateString('es-ES', options);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Add this line to allow custom height
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando datos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  if (ingresos.length === 0) {
    return <div className="flex justify-center items-center h-64">No hay datos de ingresos disponibles</div>;
  }

  const viewOptions = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'annual', label: 'Anual' },
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <div className={`flex-grow p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Ingresos</h3>

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
              value={viewType}
              onChange={(value) => setViewType(value as ViewType)}
              placeholder="Seleccionar vista"
              position="left"
            />
          </div>
        </div>
        <div className="h-[300px]"> {/* Changed height from 400px to 300px */}
          <Line options={options} data={processData()} />
        </div>
      </div>
    </div>
  );
};

export default IncomeChartWidget;