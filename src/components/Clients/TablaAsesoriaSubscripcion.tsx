// TablaAsesoriaSubscripcion.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, ChevronRight, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TablaPlanesServicio from './TablaPlanesServicio';
import type { ServicioAsesoriaSubscripcion, PlanPago } from '../types/servicios';

interface TablaAsesoriaSubscripcionProps {
  datos: ServicioAsesoriaSubscripcion[];
  isDarkMode: boolean;
  onEditService: (servicio: ServicioAsesoriaSubscripcion) => void;
  onAddPaymentPlan: (servicioId: string, nuevoPlan: PlanPago) => void;
  onOpenPaymentPlan: (servicioId: string) => void;
  onOpenAsociarPlanCliente: (paymentPlanId: string) => void;
  onDeletePlan?: (planId: string) => void;
  onDeleteService?: (servicioId: string) => void;
}

import { useTheme } from '../../contexts/ThemeContext';

const TablaAsesoriaSubscripcion: React.FC<TablaAsesoriaSubscripcionProps> = ({
  datos = [],
  isDarkMode,
  onEditService,
  onAddPaymentPlan,
  onOpenPaymentPlan,
  onOpenAsociarPlanCliente,
  onDeletePlan,
  onDeleteService
}) => {
  const { theme } = useTheme();
  console.log('Datos recibidos en TablaAsesoriaSubscripcion:', JSON.stringify(datos, null, 2));

  const getHeaderClass = () => {
    const baseClasses = 'px-6 py-4 text-left text-xs font-medium uppercase tracking-wider backdrop-blur-sm';
    return theme === 'dark' 
      ? `${baseClasses} bg-gray-800/90 text-gray-100`
      : `${baseClasses} bg-white/90 text-gray-600 border-b border-gray-200`;
  };

  const getTableClass = () => {
    const baseClasses = 'min-w-full rounded-xl overflow-hidden shadow-lg border backdrop-filter';
    return theme === 'dark'
      ? `${baseClasses} bg-gray-900/95 divide-y divide-gray-700/50 border-gray-700/30`
      : `${baseClasses} bg-white/95 divide-y divide-gray-200/50 border-gray-200/30`;
  };

  const [servicioExpandido, setServicioExpandido] = useState<string | null>(null);
  const [servicioParaPaymentPlan, setServicioParaPaymentPlan] = useState<string | null>(null);

  useEffect(() => {
    console.log('TablaAsesoriaSubscripcion - Datos actualizados:', datos);
    datos.forEach(servicio => {
      console.log('Servicio:', servicio._id);
      console.log('planDePago:', servicio.planDePago);
      console.log('planesDePago:', servicio.planesDePago);
    });
  }, [datos]);

  // Función para abrir el Popup de Payment Plan
  const handleAddPaymentPlanClick = (servicioId: string) => {
    onOpenPaymentPlan(servicioId);
  };

  // Función para manejar la adición de un nuevo Payment Plan
  const handleAddPaymentPlan = (nuevoPlan: PlanPago) => {
    if (servicioParaPaymentPlan) {
      onAddPaymentPlan(servicioParaPaymentPlan, nuevoPlan);
      setServicioParaPaymentPlan(null);
    }
  };

  // Función para abrir el Popup de Asociar Plan a Cliente
  const handleAsociarPlanClienteClick = (paymentPlanId: string, serviciosAdicionales?: string[]) => {
    console.log('TablaAsesoriaSubscripcion - Abriendo popup para asociar cliente al plan:', paymentPlanId);
    console.log('TablaAsesoriaSubscripcion - Servicios adicionales a pasar:', serviciosAdicionales);
    onOpenAsociarPlanCliente(paymentPlanId, serviciosAdicionales);
  };
  

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className={getTableClass()}>
        <thead className="sticky top-0 z-10">
          <tr>
            {['Nombre del Cliente', 'Fecha de Creación', 'Tipo de Servicio', 'Servicios Adicionales', 'Acciones'].map((header, index) => (
              <th key={index} scope="col" className={getHeaderClass()}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} divide-y ${theme === 'dark' ? 'divide-gray-700/30' : 'divide-gray-200/30'}`}>
          {datos && datos.length > 0 ? (
            datos.map((servicio) => (
              <React.Fragment key={servicio._id}>
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`group transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800/50' 
                      : 'hover:bg-gray-50/90'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      onClick={() => setServicioExpandido(servicioExpandido === servicio._id ? null : servicio._id)}
                      className={`flex items-center space-x-3 text-sm font-medium group-hover:translate-x-1 transition-transform ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.span
                        animate={{
                          rotate: servicioExpandido === servicio._id ? 90 : 0,
                        }}
                        className={`${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                        } transition-colors`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.span>
                      <span className="font-medium">{servicio.nombre}</span>
                    </motion.button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{servicio.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{servicio.tipo || 'No especificado'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{servicio.serviciosAdicionales.join(', ') || 'Ninguno'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-4 items-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditService(servicio)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        aria-label={`Editar ${servicio.nombre}`}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddPaymentPlanClick(servicio._id)}
                        className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                        aria-label={`Agregar Payment Plan a ${servicio.nombre}`}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          console.log('Eliminar servicio:', servicio._id);
                          if (onDeleteService) {
                            onDeleteService(servicio._id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        aria-label={`Eliminar ${servicio.nombre}`}
                      >
                        <Trash className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {servicioExpandido === servicio._id && (
                    <motion.tr
                      key={`expanded-${servicio._id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td colSpan={5} className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'} backdrop-blur-sm`}>
                        <motion.div
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          className="p-6"
                        >
                          <TablaPlanesServicio
                            planes={Array.isArray(servicio.planesDePago) ? servicio.planesDePago : 
                                   servicio.planDePago ? [servicio.planDePago] : []}
                            isDarkMode={theme === 'dark'}
                            servicioId={servicio._id}
                            onAsociarPlanClienteClick={handleAsociarPlanClienteClick}
                            onDeletePlan={onDeletePlan}
                            serviciosAdicionales={servicio.serviciosAdicionales || []}

                          />
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                No hay servicios disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAsesoriaSubscripcion;
