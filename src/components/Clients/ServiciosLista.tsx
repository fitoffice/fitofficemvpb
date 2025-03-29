// ServiciosLista.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCircle, Ticket, Calendar, Plus, BookOpen, Target, Activity, Clock, Package } from 'lucide-react';
import TablaClasesGrupales from './TablaClasesGrupales';
import TablaAsesoriaSubscripcion from './TablaAsesoriaSubscripcion';
import TablaCitas from './TablaCitas';
import TablaProductos from './TablaProductos';
import { useTheme } from '../../contexts/ThemeContext';
import type { ServicioAsesoriaSubscripcion, ClaseGrupal } from '../../types/servicios';


// Importar los popups
import NuevoClaseGrupalPopup from './NuevoClaseGrupalPopup';
import NuevaAsesoriaPopup from './NuevaAsesoriaPopup';
import NuevoProductoPopup from './NuevoProductoPopup';
import NuevaSuscripcionPopup from './NuevaSuscripcionPopup';
import NuevoPackCitasPopup from './NuevoPackCitasPopup';
import NuevoPaymentPlanPopup from './NuevoPaymentPlanPopup';
import AsociarPlanClientePopup from './AsociarPlanClientePopup';
import Button from '../Common/Button';


// Estilos base
const styles = {
  container: {
    position: 'relative' as const,
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgba(245,245,245,0.9) 0%, rgba(242,242,255,0.9) 100%)',
  },
  darkContainer: {
    background: 'linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.95) 100%)',
  },
  categoriesContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '10px',
    overflowX: 'auto' as const,
    padding: '10px',
    marginBottom: '20px',
    width: '100%',
  },
  categoryCard: (isActive: boolean, isDarkMode: boolean) => ({
    background: isActive
      ? isDarkMode
        ? 'linear-gradient(45deg, #2c3440, #1a2030)'
        : 'linear-gradient(45deg, #ffffff, #f0f4f8)'
      : 'transparent',
    border: `2px solid ${isActive ? '#4a90e2' : isDarkMode ? '#ffffff20' : '#00000020'}`,
    borderRadius: '12px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1',
    minWidth: '200px',
    justifyContent: 'center',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  }),
};


const categoriasServicios = [
  {
    id: 'suscripciones',
    titulo: 'Suscripción',
    tipo: 'Suscripción',
    icono: <BookOpen style={{ color: '#4a90e2' }} />,
    visible: true
  },
  {
    id: 'asesorias',
    titulo: 'Asesoría Individual',
    tipo: 'Asesoría Individual',
    icono: <Target style={{ color: '#4a90e2' }} />,
    visible: true
  },
  {
    id: 'clases-grupales',
    titulo: 'Clase Grupal',
    tipo: 'ClaseGrupal',
    icono: <Users style={{ color: '#4a90e2' }} />,
    visible: true
  },
  {
    id: 'citas',
    titulo: 'Pack de Citas',
    tipo: 'Pack de Citas',
    icono: <Clock style={{ color: '#4a90e2' }} />,
    visible: true
  },
  {
    id: 'productos',
    titulo: 'Productos',
    tipo: 'Productos',
    icono: <Package style={{ color: '#4a90e2' }} />,
    visible: false // Hide productos category
  },
];


interface ServiciosListaProps {
  onEditService?: (servicio: ServicioAsesoriaSubscripcion) => void;
  onEditClase?: (claseId: string) => void;
  onEditCita?: (citaId: string) => void;
  onEditProducto?: (productoId: string) => void;
}


const ServiciosLista: React.FC<ServiciosListaProps> = ({
  onEditService,
  onEditClase,
  onEditCita,
  onEditProducto
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [categoriaActiva, setCategoriaActiva] = useState('suscripciones');
  const [servicios, setServicios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const [isNuevoClaseGrupalOpen, setIsNuevoClaseGrupalOpen] = useState(false);
  const [isNuevaAsesoriaOpen, setIsNuevaAsesoriaOpen] = useState(false);
  const [isNuevaSuscripcionOpen, setIsNuevaSuscripcionOpen] = useState(false);
  const [isNuevoPackCitasOpen, setIsNuevoPackCitasOpen] = useState(false);
  const [isPaymentPlanPopupOpen, setIsPaymentPlanPopupOpen] = useState(false);
  const [isAsociarPlanClienteOpen, setIsAsociarPlanClienteOpen] = useState(false);
  const [selectedServicioId, setSelectedServicioId] = useState<string | null>(null);
  const [selectedPaymentPlanId, setSelectedPaymentPlanId] = useState<string | null>(null);
  const [serviciosAdicionalesSeleccionados, setServiciosAdicionalesSeleccionados] = useState<string[]>([]);
  const [isNuevoProductoOpen, setIsNuevoProductoOpen] = useState(false);


  const getActionButtonText = () => {
    switch (categoriaActiva) {
      case 'clases-grupales':
        return 'Nueva Clase';
      case 'asesorias':
        return 'Nueva Asesoría';
      case 'suscripciones':
        return 'Nueva Suscripción';
      case 'citas':
        return 'Nuevo Pack de Citas';
      case 'productos':
        return 'Nuevo Producto';
      default:
        return 'Nuevo';
    }
  };


  const handleActionButtonClick = () => {
    switch (categoriaActiva) {
      case 'clases-grupales':
        setIsNuevoClaseGrupalOpen(true);
        break;
      case 'asesorias':
        setIsNuevaAsesoriaOpen(true);
        break;
      case 'suscripciones':
        setIsNuevaSuscripcionOpen(true);
        break;
      case 'citas':
        setIsNuevoPackCitasOpen(true);
        break;
      case 'productos':
        setIsNuevoProductoOpen(true);
        break;
      default:
        break;
    }
  };


  const handleAddServicio = async (nuevoServicio: any) => {
    try {
      console.log('Añadiendo nuevo servicio:', nuevoServicio);
     
      // If we already have the created service data (from NuevoClaseGrupalPopup)
      if (nuevoServicio && nuevoServicio._id && categoriaActiva === 'clases-grupales') {
        console.log('Clase grupal ya creada, actualizando estado local:', nuevoServicio);
       
        // Just update the state with the received data
        setServicios(serviciosActuales => {
          const nuevosServicios = [...serviciosActuales, nuevoServicio];
          console.log('Lista actualizada de servicios:', nuevosServicios);
          return nuevosServicios;
        });
       
        // Close the modal
        setIsNuevoClaseGrupalOpen(false);
        return;
      }
     
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }


      // Determinar el endpoint según la categoría activa
      let endpoint = '';
      switch (categoriaActiva) {
        case 'citas':
          endpoint = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/pack-citas';
          break;
        case 'clases-grupales':
          endpoint = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/grupal';
          break;
        case 'asesorias':
        case 'suscripciones':
          endpoint = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services';
          break;
        default:
          endpoint = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services';
      }


      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoServicio),
      });


      if (!response.ok) {
        throw new Error('Error al crear el servicio');
      }


      const servicioCreado = await response.json();
      setServicios(serviciosActuales => {
        const nuevosServicios = [...serviciosActuales, servicioCreado];
        console.log('Lista actualizada de servicios:', nuevosServicios);
        return nuevosServicios;
      });


      // Cerrar el modal correspondiente
      switch (categoriaActiva) {
        case 'citas':
          setIsNuevoPackCitasOpen(false);
          break;
        case 'clases-grupales':
          setIsNuevoClaseGrupalOpen(false);
          break;
        case 'asesorias':
          setIsNuevaAsesoriaOpen(false);
          break;
        case 'suscripciones':
          setIsNuevaSuscripcionOpen(false);
          break;
      }
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };


  const handleDeleteServicio = async (servicioId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }


      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/${servicioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      if (!response.ok) {
        throw new Error('Error al eliminar el servicio');
      }


      // Actualizar la lista de servicios eliminando el servicio borrado
      setServicios(serviciosActuales =>
        serviciosActuales.filter(servicio => servicio._id !== servicioId)
      );
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      setError('Error al eliminar el servicio');
    }
  };


  const handleDeletePlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/payment-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });


      if (!response.ok) {
        throw new Error('Error al eliminar el plan de pago');
      }


      // Actualizar la lista de servicios después de eliminar el plan
      setServicios(serviciosActuales => {
        return serviciosActuales.map(servicio => ({
          ...servicio,
          planesDePago: servicio.planesDePago?.filter((plan: any) => plan._id !== planId) || []
        }));
      });
    } catch (error) {
      console.error('Error al eliminar el plan:', error);
    }
  };


  const fetchServiciosPorTipo = async (tipo: string) => {
    setIsLoading(true);
    setError(null);
    console.log('Iniciando fetchServiciosPorTipo para tipo:', tipo);


    // Si es la categoría de productos, hacemos una llamada específica para productos
    if (tipo === 'Productos') {
      try {
        console.log('Obteniendo productos desde la API...');
        const token = localStorage.getItem('token');
       
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
       
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/tipo/Producto', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
       
        console.log('Respuesta de productos:', {
          status: response.status,
          statusText: response.statusText
        });
       
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error en la respuesta de productos:', errorData);
          throw new Error(errorData.mensaje || 'Error al obtener productos');
        }
       
        const data = await response.json();
        console.log('Datos de productos recibidos:', data);
        setServicios(data);
      } catch (err: any) {
        console.error('Error al obtener productos:', err);
        setError(err instanceof Error ? err.message : 'Error al obtener los productos');
      } finally {
        setIsLoading(false);
      }
      return;
    }


    try {
      const token = localStorage.getItem('token'); // Obtener el token
      console.log('Token obtenido:', token ? 'Token presente' : 'Token no encontrado');


      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }


      const encodedTipo = encodeURIComponent(tipo);
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/tipo/${encodedTipo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText
      });


      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        throw new Error(errorData.mensaje || `Error al obtener servicios de tipo ${tipo}`);
      }


      const data = await response.json();
      console.log('Datos de servicios recibidos:', data);
      setServicios(data);
    } catch (err: any) {
      console.error('Error en fetchServiciosPorTipo:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener los servicios');
    } finally {
      setIsLoading(false);
    }
  };


  const handleOpenPaymentPlan = (servicioId: string) => {
    setSelectedServicioId(servicioId);
    setIsPaymentPlanPopupOpen(true);
  };


  const handleClosePaymentPlan = () => {
    setIsPaymentPlanPopupOpen(false);
    setSelectedServicioId(null);
  };


  const handleAddPaymentPlan = async (paymentPlan: any) => {
    try {
      // Update the services state to include the new payment plan
      setServicios(serviciosActuales => {
        return serviciosActuales.map(servicio => {
          if (servicio._id === paymentPlan.servicio._id) {
            // If this is the service we're updating
            return {
              ...servicio,
              planesDePago: [...(servicio.planesDePago || []), paymentPlan.planDePago]
            };
          }
          return servicio;
        });
      });


      handleClosePaymentPlan();
    } catch (error) {
      console.error('Error al agregar el plan de pago:', error);
    }
  };


  const handleOpenAsociarPlanCliente = (paymentPlanId: string, serviciosAdicionales?: string[]) => {
    console.log('ServiciosLista - Opening asociar plan cliente with paymentPlanId:', paymentPlanId);
    console.log('ServiciosLista - Servicios adicionales a pasar:', serviciosAdicionales);
    setSelectedPaymentPlanId(paymentPlanId);
    // Store servicios adicionales in state
    setServiciosAdicionalesSeleccionados(serviciosAdicionales || []);
    setIsAsociarPlanClienteOpen(true);
  };




  const handleCloseAsociarPlanCliente = () => {
    setIsAsociarPlanClienteOpen(false);
    setSelectedPaymentPlanId(null);
  };


  const renderTabla = () => {
    const categoria = categoriasServicios.find(c => c.id === categoriaActiva);
    if (!categoria) return null;


    if (isLoading) {
      return <div className="text-center py-4">Cargando servicios...</div>;
    }


    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }


    // Manejo especial para la categoría de productos
    if (categoria.id === 'productos') {
      console.log('Renderizando tabla de productos con datos:', servicios);
      return <TablaProductos
        productos={servicios}
        onEditProducto={onEditProducto}
      />;
    }


    // Para otras categorías, verificar si hay servicios
    if (!servicios || servicios.length === 0) {
      return (
        <div className="p-8 text-center">
          <span>No hay {categoria.titulo.toLowerCase()}</span>
        </div>
      );
    }


    switch (categoria.id) {
      case 'clases-grupales':
        return (
          <TablaClasesGrupales
            datos={servicios}
            isDarkMode={isDarkMode}
            onEditClase={onEditClase}
            onOpenPaymentPlan={(claseId) => {
              console.log('Abrir plan de pago para clase:', claseId);
              setSelectedServicioId(claseId);
              setIsPaymentPlanPopupOpen(true);
            }}
            onAddPaymentPlan={(claseId, nuevoPlan) => {
              console.log('Añadir plan de pago:', { claseId, nuevoPlan });
              // Actualizar la lista de servicios después de añadir el plan
              setServicios(serviciosActuales => {
                const nuevosServicios = [...serviciosActuales];
                const servicioIndex = nuevosServicios.findIndex(servicio => servicio._id === claseId);
                if (servicioIndex !== -1) {
                  nuevosServicios[servicioIndex].planesDePago = [...(nuevosServicios[servicioIndex].planesDePago || []), nuevoPlan];
                }
                return nuevosServicios;
              });
            }}
            onOpenAsociarPlanCliente={(planId) => {
              console.log('Asociar cliente al plan:', planId);
              setSelectedPaymentPlanId(planId);
              setIsAsociarPlanClienteOpen(true);
            }}
            onDeletePlan={(planId) => {
              console.log('Eliminar plan:', planId);
              handleDeletePlan(planId);
            }}
          />
        );
      case 'asesorias':
      case 'suscripciones':
        return (
          <TablaAsesoriaSubscripcion
        datos={servicios}
        isDarkMode={isDarkMode}
        onEditService={onEditService || (() => {})}
        onServiceUpdated={(servicioActualizado) => {
          console.log('Servicio actualizado:', servicioActualizado);
          setServicios(serviciosActuales =>
            serviciosActuales.map(servicio =>
              servicio._id === servicioActualizado._id ? servicioActualizado : servicio
            )
          );
        }}
        onAddPaymentPlan={(servicioId, nuevoPlan) => {
          console.log('Nuevo plan de pago añadido:', { servicioId, nuevoPlan });
          setServicios(serviciosActuales =>
            serviciosActuales.map(servicio =>
              servicio._id === servicioId
                ? {
                    ...servicio,
                    planDePago: [...(servicio.planDePago || []), nuevoPlan]
                  }
                : servicio
            )
          );
        }}
        onOpenPaymentPlan={handleOpenPaymentPlan}
        onOpenAsociarPlanCliente={handleOpenAsociarPlanCliente}
        onDeleteService={handleDeleteServicio}
        onDeletePlan={handleDeletePlan}
      />
    );
      case 'citas':
        return (
          <TablaCitas
            datos={servicios}
            isDarkMode={isDarkMode}
            onEditCita={onEditCita}
          />
        );
      default:
        return null;
    }
  };


  useEffect(() => {
    const categoriaSeleccionada = categoriasServicios.find(c => c.id === categoriaActiva);
    if (categoriaSeleccionada) {
      fetchServiciosPorTipo(categoriaSeleccionada.tipo);
    }
  }, [categoriaActiva]);


  const categoriaSeleccionada = categoriasServicios.find(c => c.id === categoriaActiva);


  return (
    <div className={`w-full space-y-6 animate-fadeIn`}>
      {/* Header Section */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="relative">
            <h2 className={`text-4xl font-extrabold ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
            } bg-clip-text text-transparent tracking-tight`}>
              Servicios y Planes
            </h2>
            <div className={`absolute -bottom-2 left-0 w-full h-1.5 ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
            } rounded-full opacity-60 animate-pulse`}></div>
          </div>
          <span className={`
            text-sm font-semibold
            ${isDarkMode
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
            `}></div>
            <Activity className={`
              w-4 h-4
              ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
              animate-pulse
              transform group-hover:rotate-12
              transition-all duration-300
            `} />
            <span className="relative">Panel de Control</span>
          </span>
        </div>
        <Button
          onClick={handleActionButtonClick}
          variant="create"
          className="flex items-center gap-2 transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5 animate-spin-slow" />
          <span>{getActionButtonText()}</span>
        </Button>
      </div>


      {/* Categories Section */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${categoriasServicios.filter(c => c.visible).length} gap-4 p-6`}>
        {categoriasServicios.filter(categoria => categoria.visible).map((categoria) => (
          <motion.div
            key={categoria.id}
            className={`
              relative flex items-center gap-4 px-6 py-5
              ${categoriaActiva === categoria.id
                ? `${isDarkMode
                    ? 'bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-pink-500/30 border-violet-400/50 shadow-[0_0_25px_rgba(139,92,246,0.3)]'
                    : 'bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 border-violet-500/50 shadow-[0_0_25px_rgba(139,92,246,0.15)]'
                  }`
                : `${isDarkMode
                    ? 'hover:bg-gray-800/40 border-gray-600/50'
                    : 'hover:bg-white/90 border-gray-200'
                  }`
              }
              group
              border rounded-3xl cursor-pointer
              backdrop-blur-xl
              transition-all duration-500 ease-out
              hover:shadow-xl hover:shadow-violet-500/10
              ${categoriaActiva === categoria.id ? 'scale-[1.02]' : ''}
              w-full
            `}
            onClick={() => setCategoriaActiva(categoria.id)}
            whileHover={{
              scale: categoriaActiva === categoria.id ? 1.03 : 1.02,
              y: -4,
            }}
            whileTap={{ scale: 0.97 }}
          >
            <div className={`
              p-3 rounded-2xl
              ${categoriaActiva === categoria.id
                ? `${isDarkMode
                    ? 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 shadow-lg shadow-violet-500/20'
                    : 'bg-gradient-to-br from-violet-100/80 to-fuchsia-100/80 shadow-lg shadow-violet-500/10'
                  }`
                : `${isDarkMode
                    ? 'bg-gray-800/50 group-hover:bg-gray-700/50'
                    : 'bg-white/50 group-hover:bg-violet-50/50'
                  }`
              }
              transition-all duration-300 ease-in-out
            `}>
              {React.cloneElement(categoria.icono, {
                className: `w-6 h-6 transform transition-all duration-300 ${
                  categoriaActiva === categoria.id
                    ? 'text-violet-400 scale-110 rotate-6'
                    : isDarkMode
                      ? 'text-gray-400 group-hover:text-violet-400/70'
                      : 'text-gray-600 group-hover:text-violet-500/70'
                }`
              })}
            </div>
            <span className={`
              font-semibold text-sm tracking-wide
              ${categoriaActiva === categoria.id
                ? `${isDarkMode
                    ? 'text-violet-300'
                    : 'text-violet-600'
                  }`
                : `${isDarkMode
                    ? 'text-gray-300 group-hover:text-violet-400/70'
                    : 'text-gray-600 group-hover:text-violet-500/70'
                  }`
              }
              transition-all duration-300
            `}>
              {categoria.titulo}
            </span>
            {categoriaActiva === categoria.id && (
              <motion.div
                className={`
                  absolute -bottom-1 left-1/2 transform -translate-x-1/2
                  w-2 h-2 rounded-full
                  ${isDarkMode ? 'bg-violet-400' : 'bg-violet-500'}
                `}
                layoutId="activeIndicator"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
              />
            )}
          </motion.div>
        ))}
      </div>


      {/* Content Section */}
      <div className={`rounded-2xl ${
        isDarkMode
          ? 'bg-gray-900/50 border-gray-700/50'
          : 'bg-gray-50/50 border-gray-200/50'
      } border backdrop-blur-sm p-4`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={categoriaActiva}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabla()}
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Modals */}
      <NuevoClaseGrupalPopup
        isOpen={isNuevoClaseGrupalOpen}
        onClose={() => setIsNuevoClaseGrupalOpen(false)}
        onAdd={handleAddServicio}
        isDarkMode={isDarkMode}
      />
      <NuevaAsesoriaPopup
        isOpen={isNuevaAsesoriaOpen}
        onClose={() => setIsNuevaAsesoriaOpen(false)}
        onAdd={handleAddServicio}
        isDarkMode={isDarkMode}
      />
      <NuevaSuscripcionPopup
        isOpen={isNuevaSuscripcionOpen}
        onClose={() => setIsNuevaSuscripcionOpen(false)}
        onAdd={handleAddServicio}
        isDarkMode={isDarkMode}
      />
      <NuevoPackCitasPopup
        isOpen={isNuevoPackCitasOpen}
        onClose={() => setIsNuevoPackCitasOpen(false)}
        onAdd={handleAddServicio}
        isDarkMode={isDarkMode}
      />
      <NuevoPaymentPlanPopup
        isOpen={isPaymentPlanPopupOpen}
        onClose={handleClosePaymentPlan}
        onAdd={handleAddPaymentPlan}
        isDarkMode={isDarkMode}
        servicioId={selectedServicioId}
      />
            <AsociarPlanClientePopup
        isOpen={isAsociarPlanClienteOpen}
        onClose={handleCloseAsociarPlanCliente}
        paymentPlanId={selectedPaymentPlanId || ''}
        isDarkMode={isDarkMode}
        serviciosAdicionales={serviciosAdicionalesSeleccionados}
      />
      <NuevoProductoPopup
        isOpen={isNuevoProductoOpen}
        onClose={() => setIsNuevoProductoOpen(false)}
        onSuccess={handleAddServicio}
      />
    </div>
  );
};


export default ServiciosLista;