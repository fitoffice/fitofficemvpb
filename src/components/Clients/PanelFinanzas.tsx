import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  FileText,
  TrendingUp,
  Receipt,
  Wallet,
  AlertCircle,
  Edit3,
  Save,
  X,
  BarChart2,
  PieChart as PieChartIcon
} from 'lucide-react';
import Button from '../Common/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AddPaymentPopup from './AddPaymentPopup';

// Define interfaces for the component props and data structures
interface PanelFinanzasProps {
  cliente: any; // Updated to receive the full cliente object
  servicioId: string; // New prop for service ID
  planPagoId: string; // New prop for payment plan ID
}

// Update the interfaces to match the actual API response structure
interface PlanPago {
  _id: string;
  nombre: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  duracion: number;
  detalles: string;
  activo: boolean;
  fechaCreacion: string;
  servicio: any;
  // Add other fields as needed
}

interface Servicio {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  entrenador: any;
  fechaCreacion: string;
  planesDePago: any[];
  ingresos: string[];
  // Add other fields as needed
}

interface Pago {
  id: string;
  fecha: string;
  monto: number;
  metodoPago: string;
  aTiempo: boolean;
  concepto: string;
}

const PanelFinanzas: React.FC<PanelFinanzasProps> = ({ cliente, servicioId, planPagoId }) => {
  const { theme } = useTheme();
  const [notas, setNotas] = useState<string>('');
  const [editandoNotas, setEditandoNotas] = useState(false);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [tempNotas, setTempNotas] = useState<string>('');
  
  // Add state for API data
  const [planPago, setPlanPago] = useState<PlanPago | null>(null);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState({
    plan: false,
    servicio: false
  });
  const [error, setError] = useState({
    plan: null,
    servicio: null
  });

  // Calculate next payment date based on frequency
  const calcularProximoPago = (plan: PlanPago) => {
    if (!plan) return 'N/A';
    
    const fechaCreacion = new Date(plan.fechaCreacion);
    const hoy = new Date();
    
    // Calculate next payment date based on frequency
    let proximoPago = new Date(fechaCreacion);
    
    if (plan.frecuencia === 'Mensual') {
      // Find the next payment date by adding months until we get a future date
      while (proximoPago < hoy) {
        proximoPago.setMonth(proximoPago.getMonth() + 1);
      }
    } else if (plan.frecuencia === 'Semanal') {
      // Find the next payment date by adding weeks until we get a future date
      while (proximoPago < hoy) {
        proximoPago.setDate(proximoPago.getDate() + 7);
      }
    } else if (plan.frecuencia === 'Anual') {
      // Find the next payment date by adding years until we get a future date
      while (proximoPago < hoy) {
        proximoPago.setFullYear(proximoPago.getFullYear() + 1);
      }
    }
    
    return proximoPago.toLocaleDateString();
  };

  // Log the received props to verify data
  useEffect(() => {
    console.log('PanelFinanzas - Props received:', { 
      clienteId: cliente._id,
      servicioId, 
      planPagoId,
      cliente
    });
    
    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Create headers with the token
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Fetch payment plan data if ID is provided
    if (planPagoId) {
      setLoading(prev => ({ ...prev, plan: true }));
      fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/payment-plans/${planPagoId}`, {
        headers: headers
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error fetching payment plan');
          }
          return response.json();
        })
        .then(data => {
          console.log('Payment plan data:', data);
          setPlanPago(data);
          setLoading(prev => ({ ...prev, plan: false }));
        })
        .catch(err => {
          console.error('Error fetching payment plan:', err);
          setError(prev => ({ ...prev, plan: err.message }));
          setLoading(prev => ({ ...prev, plan: false }));
        });
    }
    
    // Fetch service data if ID is provided
    if (servicioId) {
      setLoading(prev => ({ ...prev, servicio: true }));
      fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/${servicioId}`, {
        headers: headers
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error fetching service');
          }
          return response.json();
        })
        .then(data => {
          console.log('Service data:', data);
          setServicio(data);
          setLoading(prev => ({ ...prev, servicio: false }));
        })
        .catch(err => {
          console.error('Error fetching service:', err);
          setError(prev => ({ ...prev, servicio: err.message }));
          setLoading(prev => ({ ...prev, servicio: false }));
        });
    }
  }, [cliente, servicioId, planPagoId]);
  
  // Mock data - in a real app, this would come from an API or props
  const pagos: Pago[] = [
    {
      id: '1',
      fecha: '2023-05-15',
      monto: 150.00,
      metodoPago: 'Tarjeta de crédito',
      aTiempo: true,
      concepto: 'Mensualidad Mayo'
    },
    {
      id: '2',
      fecha: '2023-06-15',
      monto: 150.00,
      metodoPago: 'Transferencia',
      aTiempo: true,
      concepto: 'Mensualidad Junio'
    },
    {
      id: '3',
      fecha: '2023-07-18',
      monto: 150.00,
      metodoPago: 'Tarjeta de crédito',
      aTiempo: false,
      concepto: 'Mensualidad Julio'
    }
  ];

  // Use fetched plan data or fallback to mock data
  const planesPago: PlanPago[] = planPago 
    ? [planPago] 
    : [
      {
        _id: '1',
        nombre: 'Plan Premium',
        precio: 150.00,
        moneda: 'EUR',
        frecuencia: 'Mensual',
        duracion: 12,
        detalles: 'Plan premium con todos los servicios',
        activo: true,
        fechaCreacion: '2023-08-15',
        servicio: null
      }
    ];

  // Use fetched service data or fallback to mock data
  const serviciosContratados: Servicio[] = servicio 
    ? [servicio] 
    : [
      {
        _id: '1',
        nombre: 'Entrenamiento Personal',
        descripcion: 'Entrenamiento personalizado',
        tipo: 'Suscripción',
        entrenador: null,
        fechaCreacion: '2023-01-15',
        planesDePago: [],
        ingresos: []
      }
    ];

  // Calculate derived data
  const totalPagado = pagos.reduce((total, pago) => total + pago.monto, 0);
  const pagosATiempo = pagos.filter(pago => pago.aTiempo).length;
  const ratioPagosATiempo = pagos.length > 0 ? (pagosATiempo / pagos.length) * 100 : 0;
  
  // Find most used payment method
  const metodosUsados = pagos.reduce((acc: Record<string, number>, pago) => {
    acc[pago.metodoPago] = (acc[pago.metodoPago] || 0) + 1;
    return acc;
  }, {});
  
  const metodoPagoPreferido = Object.entries(metodosUsados).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Data for pie chart - update to use real data if available
  const pieData = servicio 
    ? [{ name: servicio.nombre, value: planPago?.precio || 0 }]
    : [
        { name: 'Entrenamiento', value: 1800 },
        { name: 'Nutrición', value: 600 },
      ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleNewPayment = () => {
    setShowNewPaymentForm(true);
  };

  const handleSavePayment = (paymentData: any) => {
    // Implement saving payment logic here
    console.log('Saving payment:', paymentData);
    setShowNewPaymentForm(false);
    // You would typically update your state or call an API here
  };

  const handleEditNotas = () => {
    setTempNotas(notas);
    setEditandoNotas(true);
  };

  const handleSaveNotas = () => {
    setNotas(tempNotas);
    setEditandoNotas(false);
  };

  const handleCancelNotas = () => {
    setTempNotas('');
    setEditandoNotas(false);
  };

  const sections = [
    { id: 'all', name: 'Todo', icon: <FileText size={18} /> },
    { id: 'services', name: 'Servicios', icon: <Receipt size={18} /> },
    { id: 'transactions', name: 'Transacciones', icon: <CreditCard size={18} /> },
    { id: 'stats', name: 'Estadísticas', icon: <BarChart2 size={18} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full rounded-lg shadow-lg overflow-hidden transition-colors duration-300 ease-in-out
        ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
    >
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Finanzas</h2>
            <p className="text-green-100">Gestión de pagos y servicios</p>
          </div>
          
          <Button
            onClick={handleNewPayment}
            className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-full transition-all shadow-md flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Nuevo Pago
          </Button>
        </div>
        
        {/* Section tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                px-4 py-2 rounded-full transition-all flex items-center
                ${activeSection === section.id 
                  ? 'bg-white text-green-600 shadow-md' 
                  : 'bg-green-600 bg-opacity-30 hover:bg-opacity-40 text-white'}
              `}
            >
              {section.icon}
              <span className="ml-2">{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading indicators */}
      {(loading.plan || loading.servicio) && (
        <div className="p-4 text-center">
          <p className="text-gray-500">Cargando datos financieros...</p>
        </div>
      )}

      {/* Error messages */}
      {(error.plan || error.servicio) && (
        <div className="p-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-md m-4">
          <p>Error al cargar datos: {error.plan || error.servicio}</p>
        </div>
      )}

      {/* Resumen Financiero Cards */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {(activeSection === 'all' || activeSection === 'stats') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                      <Wallet className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </div>
                    <h3 className="font-semibold">Total Pagado</h3>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">${totalPagado.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Últimos 3 meses</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="font-semibold">Plan Actual</h3>
                  </div>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {planesPago[0]?.nombre || 'Sin plan'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {planesPago[0]?.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                      <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h3 className="font-semibold">Próximo Pago</h3>
                  </div>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {calcularProximoPago(planesPago[0])}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {planesPago[0]?.precio} {planesPago[0]?.moneda}/{planesPago[0]?.frecuencia.toLowerCase()}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                      <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                    </div>
                    <h3 className="font-semibold">Pagos a Tiempo</h3>
                  </div>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{ratioPagosATiempo.toFixed(0)}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{pagosATiempo} de {pagos.length} pagos</p>
                </motion.div>
              </div>
            )}

            {/* Servicios Contratados */}
            {(activeSection === 'all' || activeSection === 'services') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className={`rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Receipt className="w-5 h-5 mr-2 text-blue-500" />
                  Servicios Contratados
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Servicio
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha Inicio
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Importe
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {serviciosContratados.map((servicio, index) => (
                        <motion.tr 
                          key={servicio._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">{servicio.nombre}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{new Date(servicio.fechaCreacion).toLocaleDateString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {servicio.tipo}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-green-600 dark:text-green-400">
                            ${planPago?.precio || 'N/A'} {planPago?.moneda || ''}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Plan de Pago Actual */}
            {(activeSection === 'all' || activeSection === 'services') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                className={`rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Plan de Pago Actual
                </h3>
                {planesPago[0] ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-600">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Monto</p>
                        <p className="font-semibold">${planesPago[0].precio}/{planesPago[0].frecuencia.toLowerCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-600">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Frecuencia</p>
                        <p className="font-semibold capitalize">{planesPago[0].frecuencia}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-600">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                        <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Estado</p>
                        <p className="font-semibold capitalize">{planesPago[0].activo ? 'Activo' : 'Inactivo'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-600 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No hay planes de pago activos</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Historial de Pagos */}
            {(activeSection === 'all' || activeSection === 'transactions') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                className={`rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-500" />
                  Historial de Pagos
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Concepto
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Método
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {pagos.map((pago, index) => (
                        <motion.tr 
                          key={pago.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">{pago.fecha}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{pago.concepto}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{pago.metodoPago}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pago.aTiempo 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {pago.aTiempo ? 'A tiempo' : 'Retrasado'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-green-600 dark:text-green-400">
                            ${pago.monto.toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Estadísticas */}
            {activeSection === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className={`rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2 text-indigo-500" />
                  Distribución de Gastos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Importe']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Método de Pago Preferido</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">{metodoPagoPreferido}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {metodosUsados[metodoPagoPreferido] || 0} pagos
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Puntualidad de Pagos</h4>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${ratioPagosATiempo}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{ratioPagosATiempo.toFixed(0)}% a tiempo</span>
                        <span>{pagosATiempo} de {pagos.length} pagos</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Resumen de Servicios</h4>
                      <ul className="space-y-2">
                        {serviciosContratados.map((servicio, index) => (
                          <li key={servicio._id} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">{servicio.nombre}</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              ${planPago?.precio || 'N/A'} {planPago?.moneda || ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Payment Popup */}
      {showNewPaymentForm && (
        <AddPaymentPopup
          onClose={() => setShowNewPaymentForm(false)}
          onSave={handleSavePayment}
          clienteId={cliente._id}
          servicioId={servicioId}
          planPagoId={planPagoId}
        />
      )}
    </motion.div>
  );
};

export default PanelFinanzas;