import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Calendar as CalendarIcon, Activity,
  DollarSign, Clock, Target, ChevronDown,
  Dumbbell, Heart, Scale, User, CreditCard,
  Clipboard, CalendarCheck, Ruler, Brain,
  Wallet, Receipt, TrendingUp, FileText,
  LayoutDashboard, Users, BarChart,
  Apple, Coffee, Utensils, Salad, Plus, Edit2, Pencil, X, Eye,
  AlertCircle, MessageCircle, ArrowLeft
} from 'lucide-react';
import Button from '../Common/Button';
import InfoCard from './InfoCard';
import Notes from './Notes';
import ClientCalendar from './Calendar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PanelPlan from './PanelPlan';
import PanelProgreso from './PanelProgreso';
import PanelFinanzas from './PanelFinanzas';
import PanelDietas from './PanelDietas';
import PanelPersonal from './PanelPersonal';
import PanelChat from './PanelChat';
import PanelAgenda from './PanelAgenda';
import AddPlanPopup from './AddPlanPopup';
import AddDietPopup from './AddDietPopup';
import AddPaymentPopup from './AddPaymentPopup';

type Section = 'dashboard' | 'plan' | 'progreso' | 'dietas' | 'finances' | 'personal' | 'chat' | 'agenda';

interface Nota {
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: string;
  _id: string;
}

interface Direccion {
  calle: string;
  numero?: string;
  piso?: string;
  codigoPostal?: string;
  ciudad: string;
  provincia: string;
}

interface PlanActivo {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta: string;
  semanas: number;
}

interface DietaActiva {
  _id: string;
  nombre: string;
  objetivo: string;
  restricciones: string;
  estado: string;
  fechaInicio: string;
  fechaComienzo: string;
  semanas: Array<{
    idSemana: number;
    fechaInicio: string;
    dias: Array<{
      restricciones: {
        calorias: number;
        proteinas: number;
        carbohidratos: number;
        grasas: number;
      };
      fecha: string;
      comidas: Array<{
        numero: number;
        peso: number;
        ingredientes: Array<{
          nombre: string;
          calorias: number;
          proteinas: number;
          carbohidratos: number;
          grasas: number;
        }>;
      }>;
    }>;
  }>;
}

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente' | 'Suspendido';
  direccion: Direccion;
  fechaInicio: string;
  objetivo: string;
  ultimaVisita: string;
  proximaCita: string;
  planActual: string;
  progreso: number;
  pagosAlDia: boolean;
  notas: Nota[];
  planesDePago: any[];
  transacciones: any[];
  trainer: string;
  fechaRegistro: string;
  servicios: string[];
  altura?: number;
  peso?: number;
  nivelActividad?: 'Bajo' | 'Moderado' | 'Alto';
  planningActivo?: PlanActivo;
  dietaActiva?: DietaActiva;
}

interface PanelClienteProps {
  clienteId: string;
  onClose: () => void;
}

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

const PanelCliente: React.FC<PanelClienteProps> = ({ clienteId, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [planningDetails, setPlanningDetails] = useState<{
    nombre: string;
    descripcion: string;
    meta: string;
    semanas: number;
    fechaInicio: string;
  } | null>(null);
  const [dietDetails, setDietDetails] = useState<{
    nombre: string;
    objetivo: string;
    restricciones: string;
    estado: string;
    fechaInicio: string;
    semanas: Array<any>;
  } | null>(null);
  const [editandoDireccion, setEditandoDireccion] = useState(false);
  const [direccionForm, setDireccionForm] = useState<Direccion>({
    calle: cliente?.direccion?.calle || '',
    numero: cliente?.direccion?.numero || '',
    piso: cliente?.direccion?.piso || '',
    codigoPostal: cliente?.direccion?.codigoPostal || '',
    ciudad: cliente?.direccion?.ciudad || '',
    provincia: cliente?.direccion?.provincia || ''
  });
  const [editandoEstado, setEditandoEstado] = useState(false);
  const estadosPosibles: ('Activo' | 'Inactivo' | 'Pendiente' | 'Suspendido')[] = ['Activo', 'Inactivo', 'Pendiente', 'Suspendido'];
  const [editandoFisica, setEditandoFisica] = useState(false);
  const [datosForm, setDatosForm] = useState({
    altura: cliente?.altura || '',
    peso: cliente?.peso || '',
    nivelActividad: cliente?.nivelActividad || 'Moderado'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      console.log('Iniciando fetchCliente con clienteId:', clienteId);
      try {
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token ? 'Token presente' : 'Token no encontrado');

        if (!clienteId) {
          console.error('ClienteId es undefined');
          setError('ID de cliente no válido');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        console.log('Realizando petición a:', `${API_URL}/clientes/${clienteId}`);
        const response = await axios.get(`${API_URL}/clientes/${clienteId}`, config);
        console.log('Respuesta recibida:', response.data);
        setCliente(response.data);

        // Fetch planning details if plannings array is not empty
        if (response.data.plannings && response.data.plannings.length > 0) {
          const planningId = response.data.plannings[0];
          try {
            const planningResponse = await axios.get(`${API_URL}/plannings/${planningId}`, config);
            setPlanningDetails({
              nombre: planningResponse.data.nombre,
              descripcion: planningResponse.data.descripcion,
              meta: planningResponse.data.meta,
              semanas: planningResponse.data.semanas,
              fechaInicio: planningResponse.data.fechaInicio
            });
          } catch (planningError) {
            console.error('Error al obtener los detalles del planning:', planningError);
          }
        } else {
          setPlanningDetails(null);
        }

        // Fetch diet details if dietas array is not empty
        if (response.data.dietas && response.data.dietas.length > 0) {
          const dietaId = response.data.dietas[0];
          try {
            const dietaResponse = await axios.get(`${API_URL}/dietas/${dietaId}`, config);
            setDietDetails({
              nombre: dietaResponse.data.nombre,
              objetivo: dietaResponse.data.objetivo,
              restricciones: dietaResponse.data.restricciones,
              estado: dietaResponse.data.estado,
              fechaInicio: dietaResponse.data.fechaInicio,
              semanas: dietaResponse.data.semanas
            });
          } catch (dietaError) {
            console.error('Error al obtener los detalles de la dieta:', dietaError);
          }
        } else {
          setDietDetails(null);
        }
      } catch (error: any) {
        console.error('Error detallado al obtener el cliente:', {
          mensaje: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        setError('Error al obtener el cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [clienteId]);

  // Add this effect outside the render
  React.useEffect(() => {
    // If current section is disabled, switch to dashboard
    const isCurrentSectionDisabled = 
      (activeSection === 'plan' && !planningDetails) || 
      (activeSection === 'dietas' && !dietDetails);

    if (isCurrentSectionDisabled) {
      setActiveSection('dashboard');
    }
  }, [activeSection, planningDetails, dietDetails]);

  // Handlers
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showDietPopup, setShowDietPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const handleCreatePlan = () => {
    setShowPlanPopup(true);
  };
  
  const handleClosePlanPopup = () => {
    setShowPlanPopup(false);
  };
  
  const handleSavePlan = async (planData: any) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Añadir el clienteId al plan
      const planWithClientId = {
        ...planData,
        clienteId: clienteId
      };
      
      const response = await axios.post(`${API_URL}/plannings`, planWithClientId, config);
      console.log('Plan creado:', response.data);
      
      // Actualizar el estado con el nuevo plan
      setPlanningDetails({
        nombre: response.data.nombre,
        descripcion: response.data.descripcion,
        meta: response.data.meta,
        semanas: response.data.semanas,
        fechaInicio: response.data.fechaInicio
      });
      
      // Cerrar el popup
      setShowPlanPopup(false);
      
      // Opcional: Refrescar los datos del cliente para obtener la lista actualizada de planes
      // fetchCliente();
    } catch (error) {
      console.error('Error al crear el plan:', error);
    }
  };
  
  const handleViewPlan = () => {
    if (cliente?.plannings && cliente.plannings.length > 0) {
      const planningId = cliente.plannings[0];
      navigate(`/edit-planning/${planningId}`);
    }
  };

  const handleNewCheckin = () => {
    console.log('Nuevo check-in para el cliente:', cliente?._id);
  };

  const handleCreateDiet = () => {
    setShowDietPopup(true);
  };
  
  const handleCloseDietPopup = () => {
    setShowDietPopup(false);
  };
  
  const handleSaveDiet = async (dietData: any) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Añadir el clienteId a la dieta
      const dietWithClientId = {
        ...dietData,
        clienteId: clienteId
      };
      
      const response = await axios.post(`${API_URL}/dietas`, dietWithClientId, config);
      console.log('Dieta creada:', response.data);
      
      // Actualizar el estado con la nueva dieta
      setDietDetails({
        nombre: response.data.nombre,
        objetivo: response.data.objetivo,
        restricciones: response.data.restricciones,
        estado: response.data.estado,
        fechaInicio: response.data.fechaInicio,
        semanas: response.data.semanas || []
      });
      
      // Cerrar el popup
      setShowDietPopup(false);
      
      // Opcional: Refrescar los datos del cliente para obtener la lista actualizada de dietas
      // fetchCliente();
    } catch (error) {
      console.error('Error al crear la dieta:', error);
    }
  };  const handleViewDiet = () => {
    if (cliente?.dietas && cliente.dietas.length > 0) {
      const dietaId = cliente.dietas[0];
      navigate(`/edit-diet/${dietaId}`);
    }
  };

  const handleNewPayment = () => {
    setShowPaymentPopup(true);
  };
  
  const handleClosePaymentPopup = () => {
    setShowPaymentPopup(false);
  };
  
  const handleSavePayment = async (paymentData: any) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/pagos`, paymentData, config);
      console.log('Pago registrado:', response.data);
      
      // Cerrar el popup
      setShowPaymentPopup(false);
      
      // Opcional: Refrescar los datos del cliente para obtener la lista actualizada de pagos
      // fetchCliente();
    } catch (error) {
      console.error('Error al registrar el pago:', error);
    }
  };
  const handleAddNote = async (note: Omit<Nota, '_id'>) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/clientes/${clienteId}/notas`, note, config);
      const nuevaNota = response.data.data;
      
      setCliente(prevCliente => ({
        ...prevCliente!,
        notas: [nuevaNota, ...prevCliente!.notas]
      }));
    } catch (error) {
      console.error('Error al agregar nota:', error);
    }
  };

  const handleEditNote = async (id: string, note: Partial<Nota>) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put(`${API_URL}/clientes/${clienteId}/notas/${id}`, note, config);
      setCliente(prevCliente => ({
        ...prevCliente!,
        notas: prevCliente!.notas.map(n => n._id === id ? { ...n, ...note } : n)
      }));
    } catch (error) {
      console.error('Error al editar nota:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!id || !clienteId) {
        throw new Error('Invalid note or client ID');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.delete(`${API_URL}/clientes/${clienteId}/notas/${id}`, config);
      
      if (response.status === 200) {
        setCliente(prevCliente => ({
          ...prevCliente!,
          notas: prevCliente!.notas.filter(n => n._id !== id)
        }));
      }
    } catch (error: any) {
      console.error('Error al eliminar nota:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar la nota');
    }
  };

  const handleUpdateFisica = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/clientes/${cliente?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          altura: Number(datosForm.altura),
          peso: Number(datosForm.peso),
          nivelActividad: datosForm.nivelActividad
        })
      });

      if (!response.ok) throw new Error('Error al actualizar los datos físicos');

      setCliente(cliente => cliente ? {
        ...cliente,
        altura: Number(datosForm.altura),
        peso: Number(datosForm.peso),
        nivelActividad: datosForm.nivelActividad
      } : null);
      
      setEditandoFisica(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateDireccion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/clientes/${cliente?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ direccion: direccionForm })
      });

      if (!response.ok) throw new Error('Error al actualizar la dirección');

      setCliente(cliente => cliente ? { ...cliente, direccion: direccionForm } : null);
      setEditandoDireccion(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateEstado = async (nuevoEstado: 'Activo' | 'Inactivo' | 'Pendiente' | 'Suspendido') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/clientes/${cliente?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      setCliente(cliente => cliente ? { ...cliente, estado: nuevoEstado } : null);
      setEditandoEstado(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const navigationButtons = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'plan', icon: Dumbbell, label: 'Plan' },
    { id: 'progreso', icon: TrendingUp, label: 'Progreso' },
    { id: 'dietas', icon: Utensils, label: 'Dietas' },
    { id: 'finances', icon: Wallet, label: 'Finanzas' },
    { id: 'personal', icon: User, label: 'Personal' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'agenda', icon: CalendarIcon, label: 'Agenda' },
  ];

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return <div>Cargando datos del cliente...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cliente) {
    return <div>No se encontró el cliente.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
      className={`
        w-full overflow-hidden rounded-3xl
        ${isDark ? 'bg-gray-900' : 'bg-white'}
        shadow-2xl
        border ${isDark ? 'border-gray-800' : 'border-gray-200'}
      `}
    >
      <div className="h-[85vh] overflow-y-auto custom-scrollbar">
        <div className="p-8">
          {/* Encabezado */}
          <div className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-gray-900/90' : 'bg-white/90'} mb-8 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4"
              >
                <div className={`
                  p-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105
                  bg-gradient-to-br ${isDark ? 'from-gray-800 to-gray-700' : 'from-blue-50 to-indigo-100'}
                `}>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`text-3xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-800'
                    } bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
                  >
                    {cliente.nombre}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2"
                  >
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      {cliente.email}
                    </span>
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      <Phone className="w-4 h-4 mr-2 text-green-500" />
                      {cliente.telefono}
                    </span>
                    <span className={`flex items-center text-sm px-3 py-1 rounded-full ${
                      cliente.estado === 'Activo' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : cliente.estado === 'Pendiente'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                        : cliente.estado === 'Suspendido'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        cliente.estado === 'Activo' 
                          ? 'bg-green-500 animate-pulse' 
                          : cliente.estado === 'Pendiente'
                          ? 'bg-yellow-500'
                          : cliente.estado === 'Suspendido'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}></div>
                      {cliente.estado}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="hover:rotate-180 transition-transform duration-300 bg-gray-100 dark:bg-gray-800 rounded-full p-2"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </motion.div>
            </div>

            {/* Navegación */}
            <div className="flex flex-wrap gap-2 mt-6 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
              {navigationButtons.map((button) => {
                const Icon = button.icon;
                // Check if button should be disabled
                const isDisabled = (button.id === 'plan' && !planningDetails) || 
                                 (button.id === 'dietas' && !dietDetails);
                // Check if button is active
                const isActive = activeSection === button.id;

                return (
                  <motion.button
                  key={button.id}
                  whileHover={!isDisabled ? { scale: 1.05 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  onClick={() => !isDisabled && setActiveSection(button.id as Section)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg
                    transition-all duration-300 ease-in-out
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  disabled={isDisabled}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                  <span className="text-sm font-medium">
                    {button.label}
                    {isDisabled && ' (Bloqueado)'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>


          {/* Contenido Principal */}
          <div className={`
            grid gap-6
            ${activeSection === 'dashboard' 
              ? 'grid-cols-1 lg:grid-cols-12' 
              : 'grid-cols-1'
            }
          `}>
            {activeSection === 'dashboard' ? (
              <>
                {/* Columna Izquierda - Información Principal */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Planificación Deportiva */}
                    <InfoCard
                      title="Planificación Deportiva"
                      delay={0.8}
                      titleButton={!planningDetails ? {
                        icon: Plus,
                        label: "Añadir planificación",
                        onClick: handleCreatePlan,
                        className: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-1.5 text-sm font-medium"
                      } : {
                        icon: Eye,
                        label: "Ver planificación",
                        onClick: handleViewPlan,
                        className: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-1.5 text-sm font-medium"
                      }}
                      items={[
                        { 
                          icon: Target,
                          text: planningDetails ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="flex flex-col gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50 shadow-sm"
                            >
                              <div className="flex gap-2 items-center">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Nombre:</span>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">{planningDetails.nombre}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Descripción:</span>
                                <span className="text-gray-600 dark:text-gray-400">{planningDetails.descripcion}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Meta:</span>
                                <span className="text-gray-600 dark:text-gray-400">{planningDetails.meta}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Semanas:</span>
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800/50 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">{planningDetails.semanas}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Fecha inicio:</span>
                                <span className="text-gray-600 dark:text-gray-400">{formatearFecha(planningDetails.fechaInicio)}</span>
                              </div>
                            </motion.div>
                          ) : "Sin plan activo"
                        }
                      ]}
                      className="h-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900"
                    />

                    {/* Plan Nutricional */}
                    <InfoCard
                      title="Plan Nutricional"
                      delay={0.6}
                      titleButton={!dietDetails ? {
                        icon: Plus,
                        label: "Añadir dieta",
                        onClick: handleCreateDiet,
                        className: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-1.5 text-sm font-medium"
                      } : {
                        icon: Eye,
                        label: "Ver dieta",
                        onClick: handleViewDiet,
                        className: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-1.5 text-sm font-medium"
                      }}
                      items={[
                        { 
                          icon: Apple,
                          text: dietDetails ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="flex flex-col gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50 shadow-sm"
                            >                              <div className="flex gap-2">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Nombre:</span>
                                <span className="text-green-500">{dietDetails.nombre}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold">Objetivo:</span>
                                <span>{dietDetails.objetivo}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold">Restricciones:</span>
                                <span>{dietDetails.restricciones}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold">Estado:</span>
                                <span className={dietDetails.estado === 'activa' ? 'text-green-500' : 'text-yellow-500'}>
                                  {dietDetails.estado}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold">Fecha inicio:</span>
                                <span>{formatearFecha(dietDetails.fechaInicio)}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold">Semanas:</span>
                                <span>{dietDetails.semanas.length}</span>
                              </div>
                            </motion.div>
                          ) : "Sin dieta activa"
                        }
                      ]}
                      className="h-full"
                    />
                  </div>

                  {/* Check-ins */}
                  <InfoCard
                    title="Check-ins Recientes"
                    delay={0.7}
                    items={
                      cliente.planActual ? [
                        { icon: CalendarCheck, text: `Último check-in: ${cliente.ultimaVisita}` },
                        { icon: Scale, text: `Peso actual: ${cliente.peso}` },
                        { icon: TrendingUp, text: `Progreso mensual: ${cliente.progreso}%` },
                        { icon: Brain, text: "Estado anímico: Excelente" }
                      ] : [
                        { icon: Dumbbell, text: "Antes de registrar check-ins," },
                        { icon: Target, text: "necesitas crear una planificación" },
                        { icon: Activity, text: "deportiva para este cliente." }
                      ]
                    }
                    actionButton={cliente.planActual ? {
                      icon: Clipboard,
                      label: "Nuevo Check-in",
                      onClick: handleNewCheckin
                    } : undefined}
                  />

                  {/* Notas */}
                  <Notes
                    notes={cliente.notas}
                    onAddNote={handleAddNote}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                  />
                </div>

                {/* Columna Derecha - Información Secundaria */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Pagos */}
                  <InfoCard
                    title="Estado de Pagos"
                    delay={0.5}
                    items={[
                      { icon: Receipt, text: `Último pago: ${cliente.ultimoPago || 'No hay pagos registrados'}` },
                      { icon: CreditCard, text: `Plan actual: ${cliente.planActual || 'Sin plan'}` },
                      { icon: Clock, text: `Próximo pago: ${cliente.proximoPago || 'No programado'}` },
                      { icon: AlertCircle, text: cliente.pagosAlDia ? 'Pagos al día' : 'Pagos pendientes' }
                    ]}
                    actionButton={{
                      icon: DollarSign,
                      label: "Registrar Pago",
                      onClick: handleNewPayment
                    }}
                  />

                  {/* Calendario */}
                  <ClientCalendar clientId={clienteId} />
                </div>
              </>
            ) : activeSection === 'plan' && planningDetails ? (
              <div className="col-span-2">
                <PanelPlan 
                  clienteId={clienteId} 
                  planningId={cliente.plannings && cliente.plannings.length > 0 ? cliente.plannings[0] : ''}
                />
              </div>
            ) : activeSection === 'progreso' ? (
              <div className="col-span-2">
                <PanelProgreso clienteId={clienteId} />
              </div>
            ) : activeSection === 'finances' ? (
              <div className="col-span-2">
                <PanelFinanzas 
                  cliente={cliente} 
                  servicioId={cliente.servicios && cliente.servicios.length > 0 ? cliente.servicios[0] : ''}
                  planPagoId={cliente.planesDePago && cliente.planesDePago.length > 0 ? cliente.planesDePago[0] : ''}
                />
              </div>
            ) : activeSection === 'dietas' && dietDetails ? (
              <div className="col-span-2">
                <PanelDietas 
                  clienteId={clienteId} 
                  dietDetails={dietDetails}
                />
              </div>
            ) : activeSection === 'personal' ? (
              <div className="col-span-2">
                <PanelPersonal 
                  cliente={cliente} 
                  clientId={cliente?._id} 
                  onEdit={() => console.log('Editar información personal')} 
                />
              </div>
            ) : activeSection === 'chat' ? (
              <div className="col-span-2">
                <PanelChat clienteId={clienteId} clienteName={cliente.nombre} />
              </div>
            ) : activeSection === 'agenda' ? (
              <div className="col-span-2">
                <PanelAgenda 
                  clienteId={clienteId} 
                  clienteName={cliente.nombre}
                  notas={cliente.notas}
                  onAddNote={handleAddNote}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                />
                              </div>
            ) : null}
          </div>

        </div>
      </div>
      {showPlanPopup && (
        <AddPlanPopup
          onClose={handleClosePlanPopup}
          onSave={handleSavePlan}
          clienteId={clienteId}
        />
      )}
          {showDietPopup && (
        <AddDietPopup
          onClose={handleCloseDietPopup}
          onSave={handleSaveDiet}
          clienteId={clienteId}
        />
      )}
      {showPaymentPopup && (
        <AddPaymentPopup
          onClose={handleClosePaymentPopup}
          onSave={handleSavePayment}
          clienteId={clienteId}
        />
      )}
    </motion.div>
  );
};

export default PanelCliente;