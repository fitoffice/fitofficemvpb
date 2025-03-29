import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Save, Calendar as CalendarIcon, DollarSign, CreditCard, FileText, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface AddPaymentPopupProps {
  onClose: () => void;
  onSave: (paymentData: any) => void;
  clienteId: string;
}

const AddPaymentPopup: React.FC<AddPaymentPopupProps> = ({ onClose, onSave, clienteId }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    monto: '',
    concepto: '',
    metodoPago: 'Efectivo',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'completado',
    referencia: '',
    notas: ''
  });
  
  const [errors, setErrors] = useState<{
    monto?: string;
    concepto?: string;
    fecha?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      monto?: string;
      concepto?: string;
      fecha?: string;
    } = {};
    
    if (!formData.monto.trim()) {
      newErrors.monto = 'El monto es obligatorio';
    } else if (isNaN(Number(formData.monto)) || Number(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser un número positivo';
    }
    
    if (!formData.concepto.trim()) {
      newErrors.concepto = 'El concepto es obligatorio';
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Crear una nueva transacción con los datos del formulario
      const transaccionData = {
        ...formData,
        monto: Number(formData.monto),
        clienteId,
        id: Date.now().toString(), // ID temporal
      };
      onSave(transaccionData);
    }
  };

  // Modal content to be rendered through portal
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        w-full max-w-md h-[85vh] flex flex-col
        rounded-xl shadow-2xl overflow-hidden
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      `}
    >
      <div className={`
        flex justify-between items-center p-4 border-b
        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
        sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      `}>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Registrar Nuevo Pago
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
  
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.monto ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: 50.00"
                />
              </div>
              {errors.monto && (
                <p className="mt-1 text-sm text-red-500">{errors.monto}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Concepto
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="concepto"
                  value={formData.concepto}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.concepto ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: Mensualidad Junio"
                />
              </div>
              {errors.concepto && (
                <p className="mt-1 text-sm text-red-500">{errors.concepto}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                >
                  <option value="completado">Completado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Método de Pago
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta de débito">Tarjeta de Débito</option>
                  <option value="Transferencia bancaria">Transferencia Bancaria</option>
                  <option value="Bizum">Bizum</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.fecha ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                />
              </div>
              {errors.fecha && (
                <p className="mt-1 text-sm text-red-500">{errors.fecha}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Referencia (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: Número de factura, recibo..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notas (opcional)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Información adicional sobre el pago..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={onClose}
              className={`
                px-4 py-2
                ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              `}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Registrar Pago
            </Button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  );

  // Use createPortal to render the modal content at the document body level
  return createPortal(modalContent, document.body);
};

export default AddPaymentPopup;