// src/components/popups/NuevoPaymentPlanPopup.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NuevoPaymentPlanPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (paymentPlan: PaymentPlanInput) => void;
  isDarkMode: boolean;
  servicioId: string; // ID del servicio al que se le agregará el payment plan
}

interface PaymentPlanInput {
  nombre: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  duracion: number;
  detalles: string;
  servicio: string;
  pagoUnico: boolean; // New field for one-time payment
}

const NuevoPaymentPlanPopup: React.FC<NuevoPaymentPlanPopupProps> = ({
  isOpen,
  onClose,
  onAdd,
  isDarkMode,
  servicioId,
}) => {
  const [formData, setFormData] = useState<PaymentPlanInput>({
    nombre: '',
    precio: 0,
    moneda: 'EUR',
    frecuencia: 'Mensual',
    duracion: 12,
    detalles: '',
    servicio: servicioId,
    pagoUnico: false, // Initialize as false
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      servicio: servicioId,
    }));
  }, [servicioId]);

  const getFrecuenciaMeses = (frecuencia: string): number => {
    switch (frecuencia) {
      case 'Mensual':
        return 1;
      case 'Trimestral':
        return 3;
      case 'Semestral':
        return 6;
      case 'Anual':
        return 12;
      default:
        return 1;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const fieldValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: isCheckbox 
          ? fieldValue 
          : (name === 'precio' || name === 'duracion' ? Number(value) : value),
      };

      // If pagoUnico is checked, set default values for frequency and duration
      if (name === 'pagoUnico' && fieldValue === true) {
        newData.frecuencia = 'Único';
        newData.duracion = 1;
      } else if (name === 'pagoUnico' && fieldValue === false) {
        // Reset to default values when unchecked
        newData.frecuencia = 'Mensual';
        newData.duracion = 12;
      }

      // Si cambia la frecuencia o la duración, actualizar la duración en meses
      if ((name === 'frecuencia' || name === 'duracion') && !prev.pagoUnico) {
        const mesesPorFrecuencia = getFrecuenciaMeses(newData.frecuencia);
        newData.duracion = Number(name === 'duracion' ? value : prev.duracion) * mesesPorFrecuencia;
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      servicio: servicioId,
    };

    // Mostrar los datos que se van a enviar
    console.log('Datos del plan de pago a enviar:', {
      ...dataToSend,
      duracionPeriodos: formData.duracion / getFrecuenciaMeses(formData.frecuencia),
      duracionMeses: formData.duracion,
    });

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/paymentplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error('Error al crear el Payment Plan');
      }

      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      onAdd(data);
      onClose();
    } catch (error) {
      console.error('Error al crear el Payment Plan:', error);
      // Aquí puedes manejar el error mostrando un mensaje al usuario
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.3 } }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.90)' : 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2vh 0',
              zIndex: 1000,
              minHeight: '100vh',
              overflowY: 'auto'
            }}
            onClick={onClose}
          >
            <motion.div
              variants={{
                hidden: { scale: 0.95, opacity: 0, y: 20 },
                visible: { 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }
                }
              }}
              style={{
                background: isDarkMode ? '#1a1a1a' : '#ffffff',
                padding: '2.8rem',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '600px',
                position: 'relative',
                margin: '20px auto',
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-2.5 rounded-full ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                } transition-all duration-300 hover:scale-105`}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className={`text-3xl font-bold mb-8 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              } tracking-tight flex items-center`}>
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                  Nuevo Payment Plan
                </span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-7">
                  <div className="group transition-all duration-200 hover:scale-[1.01]">
                    <label
                      htmlFor="nombre"
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      } tracking-wide group-hover:text-blue-500 transition-colors duration-200`}
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full px-4 py-3.5 rounded-xl shadow-sm ${
                        isDarkMode 
                          ? 'bg-gray-800/80 text-white border-gray-700' 
                          : 'bg-white/80 text-gray-900 border-gray-200'
                      } backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 focus:outline-none border-2 hover:border-blue-400`}
                      placeholder="Nombre del plan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group transition-all duration-200 hover:scale-[1.01]">
                      <label
                        htmlFor="precio"
                        className={`block text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        } tracking-wide group-hover:text-blue-500 transition-colors duration-200`}
                      >
                        Precio
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="precio"
                          id="precio"
                          value={formData.precio}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className={`mt-1 block w-full pl-8 pr-4 py-3.5 rounded-xl shadow-sm ${
                            isDarkMode 
                              ? 'bg-gray-800/80 text-white border-gray-700' 
                              : 'bg-white/80 text-gray-900 border-gray-200'
                          } backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 hover:border-blue-400`}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      </div>
                    </div>

                    <div className="group transition-all duration-200 hover:scale-[1.01]">
                      <label
                        htmlFor="moneda"
                        className={`block text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        } tracking-wide group-hover:text-blue-500 transition-colors duration-200`}
                      >
                        Moneda
                      </label>
                      <select
                        name="moneda"
                        id="moneda"
                        value={formData.moneda}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full px-4 py-3.5 rounded-xl shadow-sm ${
                          isDarkMode 
                            ? 'bg-gray-800/80 text-white border-gray-700' 
                            : 'bg-white/80 text-gray-900 border-gray-200'
                        } backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 hover:border-blue-400`}
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>

                  {/* Add the Pago Único checkbox after the nombre field */}
                  <div className="group transition-all duration-200 hover:scale-[1.01]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="pagoUnico"
                        id="pagoUnico"
                        checked={formData.pagoUnico}
                        onChange={handleChange}
                        className={`w-5 h-5 rounded ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-blue-500' 
                            : 'bg-white border-gray-300 text-blue-600'
                        } focus:ring-blue-500`}
                      />
                      <label
                        htmlFor="pagoUnico"
                        className={`ml-2 text-sm font-semibold ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        } tracking-wide group-hover:text-blue-500 transition-colors duration-200`}
                      >
                        Pago Único
                      </label>
                    </div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } mt-1 ml-7 italic`}>
                      Marcar si es un pago de una sola vez
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group transition-all duration-200 hover:scale-[1.01]">
                      <label
                        htmlFor="frecuencia"
                        className={`block text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        } tracking-wide group-hover:text-blue-500 transition-colors duration-200 ${
                          formData.pagoUnico ? 'opacity-50' : ''
                        }`}
                      >
                        Frecuencia
                      </label>
                      <select
                        name="frecuencia"
                        id="frecuencia"
                        value={formData.frecuencia}
                        onChange={handleChange}
                        required
                        disabled={formData.pagoUnico}
                        className={`mt-1 block w-full px-4 py-3.5 rounded-xl shadow-sm ${
                          isDarkMode 
                            ? 'bg-gray-800/80 text-white border-gray-700' 
                            : 'bg-white/80 text-gray-900 border-gray-200'
                        } backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 hover:border-blue-400 ${
                          formData.pagoUnico ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="Mensual">Mensual</option>
                        <option value="Trimestral">Trimestral</option>
                        <option value="Semestral">Semestral</option>
                        <option value="Anual">Anual</option>
                        {formData.pagoUnico && <option value="Único">Único</option>}
                      </select>
                    </div>

                    <div className="group transition-all duration-200 hover:scale-[1.01]">
                      <label
                        htmlFor="duracion"
                        className={`block text-sm font-semibold mb-2 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        } tracking-wide group-hover:text-blue-500 transition-colors duration-200 ${
                          formData.pagoUnico ? 'opacity-50' : ''
                        }`}
                      >
                        Duración
                      </label>
                      <input
                        type="number"
                        name="duracion"
                        id="duracion"
                        value={formData.pagoUnico ? 1 : formData.duracion / getFrecuenciaMeses(formData.frecuencia)}
                        onChange={handleChange}
                        required
                        min="1"
                        disabled={formData.pagoUnico}
                        className={`mt-1 block w-full px-4 py-3.5 rounded-xl shadow-sm ${
                          isDarkMode 
                            ? 'bg-gray-800/80 text-white border-gray-700' 
                            : 'bg-white/80 text-gray-900 border-gray-200'
                        } backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 hover:border-blue-400 ${
                          formData.pagoUnico ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } mt-2 block italic ${formData.pagoUnico ? 'opacity-50' : ''}`}>
                        Total en meses: {formData.pagoUnico ? 1 : formData.duracion}
                      </span>
                    </div>
                  </div>

                  <div className="group transition-all duration-200 hover:scale-[1.01]">
                    <label
                      htmlFor="detalles"
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      } tracking-wide group-hover:text-blue-500 transition-colors duration-200`}
                    >
                      Detalles
                    </label>
                    <textarea
                      name="detalles"
                      id="detalles"
                      value={formData.detalles}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`mt-1 block w-full px-4 py-3.5 rounded-xl shadow-sm ${
                        isDarkMode 
                          ? 'bg-gray-800/80 text-white border-gray-700' 
                          : 'bg-white/80 text-gray-900 border-gray-200'
                      } backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-2 hover:border-blue-400 resize-none`}
                      placeholder="Describe los detalles del plan..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-6 py-3.5 rounded-xl font-medium ${
                      isDarkMode
                        ? 'bg-gray-800/90 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 backdrop-blur-sm`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  >
                    Crear Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NuevoPaymentPlanPopup;
