import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Save, Calendar, Target, FileText, Clock, Layers } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface AddPlanPopupProps {
  onClose: () => void;
  onSave: (planData: any) => void;
  clienteId: string;
}

const AddPlanPopup: React.FC<AddPlanPopupProps> = ({ onClose, onSave, clienteId }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    meta: '',
    otraMeta: '',
    semanas: 4,
    fechaInicio: new Date().toISOString().split('T')[0],
    tipo: 'Planificacion'
  });
  
  const [errors, setErrors] = useState<{
    nombre?: string;
    descripcion?: string;
    meta?: string;
    otraMeta?: string;
    semanas?: string;
    fechaInicio?: string;
    tipo?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semanas' ? parseInt(value) : value
    }));
    
    // Clear otraMeta if meta is not "Otra"
    if (name === 'meta' && value !== 'Otra') {
      setFormData(prev => ({
        ...prev,
        otraMeta: ''
      }));
    }
    
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
      nombre?: string;
      descripcion?: string;
      meta?: string;
      otraMeta?: string;
      semanas?: string;
      fechaInicio?: string;
      tipo?: string;
    } = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    
    if (!formData.meta.trim()) {
      newErrors.meta = 'La meta es obligatoria';
    }
    
    if (formData.meta === 'Otra' && !formData.otraMeta.trim()) {
      newErrors.otraMeta = 'Debe especificar la meta';
    }
    
    if (formData.semanas < 1) {
      newErrors.semanas = 'Debe haber al menos 1 semana';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }
    
    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        meta: formData.meta === 'Otra' ? formData.otraMeta : formData.meta,
        clienteId: formData.tipo === 'Planificacion' ? clienteId : undefined
      };
      
      // Remove otraMeta from final submission
      const { otraMeta, ...dataToSubmit } = submissionData;
      
      onSave(dataToSubmit);
    }
  };

  // Portal content
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`
          w-full max-w-2xl h-[85vh] flex flex-col
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
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Añadir Nueva Planificación
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
                Nombre del Plan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.nombre ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: Plan de Fuerza y Resistencia"
                />
              </div>
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className={`
                  block w-full px-3 py-2 rounded-md
                  ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                  border ${errors.descripcion ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                placeholder="Describe el plan y sus objetivos generales"
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>
              )}
            </div>
            
            {/* Tipo Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.tipo ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                >
                  <option value="Planificacion">Planificación</option>
                  <option value="Plantilla">Plantilla</option>
                </select>
              </div>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>
              )}
            </div>
            
            {/* Meta Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Principal
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="meta"
                  value={formData.meta}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.meta ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                >
                  <option value="">Selecciona una meta</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Fuerza">Fuerza</option>
                  <option value="Hipertrofia">Hipertrofia</option>
                  <option value="Resistencia">Resistencia</option>
                  <option value="Movilidad">Movilidad</option>
                  <option value="Coordinación">Coordinación</option>
                  <option value="Definición">Definición</option>
                  <option value="Recomposición">Recomposición</option>
                  <option value="Rehabilitación">Rehabilitación</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>
              {errors.meta && (
                <p className="mt-1 text-sm text-red-500">{errors.meta}</p>
              )}
            </div>
            
            {/* Otra Meta Field - only shown when meta is "Otra" */}
            {formData.meta === 'Otra' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Especifica la meta
                </label>
                <input
                  type="text"
                  name="otraMeta"
                  value={formData.otraMeta}
                  onChange={handleChange}
                  className={`
                    block w-full px-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.otraMeta ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Describe la meta específica"
                />
                {errors.otraMeta && (
                  <p className="mt-1 text-sm text-red-500">{errors.otraMeta}</p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duración (semanas)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="semanas"
                    value={formData.semanas}
                    onChange={handleChange}
                    className={`
                      block w-full pl-10 pr-3 py-2 rounded-md
                      ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                      border ${errors.semanas ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  >
                    {[1, 2, 3, 4, 6, 8, 12, 16, 20, 24].map(num => (
                      <option key={num} value={num}>{num} semanas</option>
                    ))}
                  </select>
                </div>
                {errors.semanas && (
                  <p className="mt-1 text-sm text-red-500">{errors.semanas}</p>
                )}
              </div>
              
              {/* Only show fecha de inicio for Planificacion type */}
              {formData.tipo === 'Planificacion' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha de Inicio
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={handleChange}
                      className={`
                        block w-full pl-10 pr-3 py-2 rounded-md
                        ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                        border ${errors.fechaInicio ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                    />
                  </div>
                  {errors.fechaInicio && (
                    <p className="mt-1 text-sm text-red-500">{errors.fechaInicio}</p>
                  )}
                </div>
              )}
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
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Plan
            </Button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  );

  // Add this at the end of the component, before the export
  return createPortal(modalContent, document.body);
};

export default AddPlanPopup;