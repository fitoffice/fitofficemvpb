// DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  Book,
  Send,
  PenTool,
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Users,
  Activity,
  BarChart,
  LineChart
} from 'lucide-react';
import Table from '../components/Common/Table';
import IncomeChart from '../components/Economics/IncomeChart';
import CashFlowChart from '../components/Economics/CashFlowChart';
import MetricCard from '../components/Dashboard/MetricCard';
import Button from '../components/Common/Button';
import ClientTable from '../components/Clients/ClientTable';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api'; // Asegúrate de que coincida con tu backend

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Add these new state variables
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState('todos');

  // Estados para manejar términos de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [classSearchTerm, setClassSearchTerm] = useState('');

  // Estado para el tipo de vista del gráfico (diario, mensual, anual)
  const [viewType, setViewType] = useState<'daily' | 'monthly' | 'annual'>('monthly');

  // Estado para manejar la fecha actual en los gráficos
  const [currentDate, setCurrentDate] = useState(new Date());

  // Estados para controlar la apertura de los modales
  const [isCreateGroupClassModalOpen, setIsCreateGroupClassModalOpen] = useState(false);

  // Estados para almacenar datos de la API
  const [clientesData, setClientesData] = useState<any[]>([]);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [gastos, setGastos] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('🚀 Iniciando la carga de datos del Dashboard...');

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Función para obtener las alertas
        const fetchAlerts = async () => {
          try {
            const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/economic-alerts', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error('Error en la petición de alertas');
            }

            const data = await response.json();
            if (data.status === 'success') {
              setAlerts(data.data.alerts);
              console.log('✅ Alertas obtenidas exitosamente:', data.data.alerts);
            }
          } catch (error) {
            console.error('❗️ Error al obtener las alertas:', error);
          }
        };

        // Función para manejar la petición de clientes
        const fetchClientes = async () => {
          try {
            console.log('🔄 Realizando petición GET a /api/clientes...');
            const response = await axios.get(`${API_URL}/clientes`, {
              withCredentials: true, // Enviar cookies con la solicitud
            });
            setClientesData(response.data);
            console.log('🎉 Datos de Clientes obtenidos exitosamente:', response.data);
          } catch (err: any) {
            console.error('❗️ Error al obtener Clientes:', err);
            if (err.response) {
              console.error('Detalles del error:', err.response.data);
            }
            setError('Error al obtener Clientes');
          }
        };

        // Llamada a la función de fetchClientes
        await fetchClientes();

        // Fetch ingresos
        const ingresosResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos', { headers });
        const ingresosData = await ingresosResponse.json();
        setIngresos(ingresosData);

        // Fetch gastos
        const gastosResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos', { headers });
        const gastosData = await gastosResponse.json();
        setGastos(gastosData);

        // Fetch alerts
        await fetchAlerts();

        setLoading(false);
        console.log('✅ Finalizó la carga de datos del Dashboard.');
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Datos estáticos para tablas como fallback si la API no ha cargado datos
  const clientData = clientesData.length > 0 ? clientesData : [
  ];

  // Función para manejar la navegación a la fecha anterior
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'daily':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
    console.log(`⏮️ Cambió la fecha anterior a: ${newDate}`);
  };

  // Función para manejar la navegación a la fecha siguiente
  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
    console.log(`⏭️ Cambió la fecha siguiente a: ${newDate}`);
  };

  // Función para formatear el rango de fechas según el tipo de vista
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    switch (viewType) {
      case 'daily':
        return currentDate.toLocaleDateString('es-ES', options);
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      case 'annual':
        return currentDate.getFullYear().toString();
    }
  };

  // Manejo de filtrado de clientes desde la API
  const filteredClientData = clientesData.length > 0 ? clientesData.filter((client: any) =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(client => ({
    Nombre: client.nombre,
    Email: client.email,
    'Última Clase': client.ultimaClase || 'N/A',
    Estado: client.estado || 'N/A',
  })) : clientData.filter((client) =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(client => ({
    Nombre: client.nombre,
    Email: client.email,
    'Última Clase': client.ultimaClase || 'N/A',
    Estado: client.estado || 'N/A',
  }));

  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-gray-100 to-blue-100'
    }`}>
      {/* Contenido del Dashboard */}
      <div className="w-full space-y-6 px-4 sm:px-6 animate-fadeIn">
        {/* Título */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
          theme === 'dark'
            ? 'bg-gray-800/90 border-gray-700/50'
            : 'bg-white/90 border-white/50'
        } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="relative">
              <h1 className={`text-4xl font-extrabold ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              } bg-clip-text text-transparent tracking-tight`}>
                Dashboard
              </h1>
              <div className={`absolute -bottom-2 left-0 w-full h-1.5 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              } rounded-full opacity-60 animate-pulse`}></div>
            </div>
            <span className={`
              text-sm font-semibold
              ${theme === 'dark'
                ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 border border-gray-600/30'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-100/50'
              }
              px-4 py-2 rounded-full
              flex items-center gap-2
              shadow-lg
              hover:shadow-xl
              transform hover:scale-105
              transition-all duration-300 ease-out
              animate-fadeIn
              relative
              overflow-hidden
              group
            `}>
              <div className={`
                absolute inset-0 
                bg-gradient-to-r from-transparent via-white/10 to-transparent
                translate-x-[-200%] group-hover:translate-x-[200%]
                transition-transform duration-1000 ease-in-out
              `}/>
              <Activity className={`
                w-4 h-4 
                ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
                animate-pulse
                transform group-hover:rotate-12
                transition-all duration-300
              `} />
              <span className="relative">Panel de Control</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Botones */}
            <button
              onClick={() => navigate('/aistory')}
              className={`group flex items-center justify-center gap-2 px-6 py-3 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800'
              } text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <PenTool className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Generar Historia</span>
            </button>
            <button
              onClick={() => navigate('/aipostcreator')}
              className={`group flex items-center justify-center gap-2 px-6 py-3 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-800'
              } text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <FileText className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Generar Publicación</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Clientes"
            value={clientesData.length.toString()}
            icon={<Users className={`w-7 h-7 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} transform group-hover:scale-110 transition-transform duration-200`} />}
            trend={10}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className={`group ${
              theme === 'dark'
                ? 'bg-gray-800/90 border-gray-700/50 hover:bg-gradient-to-br hover:from-gray-800 hover:to-blue-900/50'
                : 'bg-white/90 border-white/50 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/80'
            } backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border transform hover:-translate-y-1`}
          />
          <MetricCard
            title="Ingresos Mensuales"
            value="$25,000"
            icon={<BarChart className={`w-7 h-7 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transform group-hover:scale-110 transition-transform duration-200`} />}
            trend={15}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className={`group ${
              theme === 'dark'
                ? 'bg-gray-800/90 border-gray-700/50 hover:bg-gradient-to-br hover:from-gray-800 hover:to-indigo-900/50'
                : 'bg-white/90 border-white/50 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/80'
            } backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border transform hover:-translate-y-1`}
          />
          <MetricCard
            title="Alertas Pendientes"
            value={alerts.length.toString()}
            icon={<AlertTriangle className={`w-7 h-7 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} transform group-hover:scale-110 transition-transform duration-200`} />}
            trend={-5}
            trendIcon={<TrendingDown className="w-4 h-4" />}
            className={`group ${
              theme === 'dark'
                ? 'bg-gray-800/90 border-gray-700/50 hover:bg-gradient-to-br hover:from-gray-800 hover:to-amber-900/50'
                : 'bg-white/90 border-white/50 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/80'
            } backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border transform hover:-translate-y-1`}
          />
          <MetricCard
            title="Próximas Actividades"
            value="8"
            icon={<Calendar className={`w-7 h-7 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} transform group-hover:scale-110 transition-transform duration-200`} />}
            trend={0}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className={`group ${
              theme === 'dark'
                ? 'bg-gray-800/90 border-gray-700/50 hover:bg-gradient-to-br hover:from-gray-800 hover:to-emerald-900/50'
                : 'bg-white/90 border-white/50 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/80'
            } backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border transform hover:-translate-y-1`}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${
            theme === 'dark'
              ? 'bg-gray-800/90 border-gray-700/50'
              : 'bg-white/90 border-white/50'
          } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
           
            <IncomeChart data={ingresos} />
          </div>
          <div className={`${
            theme === 'dark'
              ? 'bg-gray-800/90 border-gray-700/50'
              : 'bg-white/90 border-white/50'
          } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
            <CashFlowChart 
              viewType={viewType}
              currentDate={currentDate}
              ingresos={ingresos || []}
              gastos={gastos || { data: { gastos: [] } }}
            />
          </div>
        </div>


        {/* Tabla de Clientes */}
        <ClientTable 
          clientData={clientesData.length > 0 ? clientesData : clientData}
          theme={theme}
        />

      </div>
    </div>
  );
};

export default DashboardPage;
