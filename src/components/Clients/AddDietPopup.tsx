import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Save, Calendar, Apple, FileText, Utensils, AlertCircle, Target, Heart, Clock, Pill, Ban } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface AddDietPopupProps {
  onClose: () => void;
  onSave: (dietData: any) => void;
  clienteId: string;
}

const AddDietPopup: React.FC<AddDietPopupProps> = ({ onClose, onSave, clienteId }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    objetivo: '',
    alergiasIntolerancias: '',
    alimentosProhibidos: '',
    alimentosPreferidos: '',
    horariosComidas: '',
    suplementosRecomendados: '',
    estado: 'activa',
    fechaInicio: new Date().toISOString().split('T')[0],
  });
  
  const [errors, setErrors] = useState<{
    nombre?: string;
    objetivo?: string;
    alergiasIntolerancias?: string;
    alimentosProhibidos?: string;
    alimentosPreferidos?: string;
    horariosComidas?: string;
    suplementosRecomendados?: string;
    fechaInicio?: string;
  }>({});

  const objetivos = [
    "Pérdida de peso",
    "Ganancia muscular",
    "Mantenimiento de peso",
    "Mejora del rendimiento deportivo",
    "Mejora de la salud general",
    "Aumento de la energía",
    "Control de enfermedades",
    "Mejora de la digestión",
    "Reducción de la grasa corporal",
    "Detoxificación",
    "Aumento de la masa corporal",
    "Preparación para competencias",
    "Rehabilitación y recuperación",
    "Otro"
  ];

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
      nombre?: string;
      objetivo?: string;
      fechaInicio?: string;
    } = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.objetivo.trim()) {
      newErrors.objetivo = 'El objetivo es obligatorio';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Add clienteId to the form data
      const dietData = {
        ...formData,
        clienteId
      };
      onSave(dietData);
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
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Añadir Nuevo Plan Nutricional
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
            {/* Nombre del Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del Plan Nutricional
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
                  placeholder="Ej: Dieta Mediterránea"
                />
              </div>
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>
            
            {/* Objetivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Objetivo Principal
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.objetivo ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                >
                  <option value="">Seleccionar objetivo</option>
                  {objetivos.map((obj, i) => (
                    <option key={i} value={obj}>
                      {obj}
                    </option>
                  ))}
                </select>
              </div>
              {errors.objetivo && (
                <p className="mt-1 text-sm text-red-500">{errors.objetivo}</p>
              )}
            </div>
            
            {/* Alergias e intolerancias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alergias e Intolerancias
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="alergiasIntolerancias"
                  value={formData.alergiasIntolerancias}
                  onChange={handleChange}
                  rows={2}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.alergiasIntolerancias ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: lactosa, gluten, frutos secos"
                />
              </div>
              {errors.alergiasIntolerancias && (
                <p className="mt-1 text-sm text-red-500">{errors.alergiasIntolerancias}</p>
              )}
            </div>
            
            {/* Alimentos prohibidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alimentos Prohibidos
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <Ban className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="alimentosProhibidos"
                  value={formData.alimentosProhibidos}
                  onChange={handleChange}
                  rows={2}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.alimentosProhibidos ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: azúcar refinado, carne roja"
                />
              </div>
              {errors.alimentosProhibidos && (
                <p className="mt-1 text-sm text-red-500">{errors.alimentosProhibidos}</p>
              )}
            </div>
            
            {/* Alimentos preferidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alimentos Preferidos
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <Heart className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="alimentosPreferidos"
                  value={formData.alimentosPreferidos}
                  onChange={handleChange}
                  rows={2}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.alimentosPreferidos ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: pescado, legumbres, quinoa"
                />
              </div>
              {errors.alimentosPreferidos && (
                <p className="mt-1 text-sm text-red-500">{errors.alimentosPreferidos}</p>
              )}
            </div>
            
            {/* Horarios de comidas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Horarios de Comidas
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="horariosComidas"
                  value={formData.horariosComidas}
                  onChange={handleChange}
                  rows={2}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.horariosComidas ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: ayuno intermitente 16/8, 5 comidas al día"
                />
              </div>
              {errors.horariosComidas && (
                <p className="mt-1 text-sm text-red-500">{errors.horariosComidas}</p>
              )}
            </div>
            
            {/* Suplementos recomendados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Suplementos Recomendados
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <Pill className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="suplementosRecomendados"
                  value={formData.suplementosRecomendados}
                  onChange={handleChange}
                  rows={2}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-md
                    ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}
                    border ${errors.suplementosRecomendados ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Ej: proteína en polvo, creatina, vitamina D"
                />
              </div>
              {errors.suplementosRecomendados && (
                <p className="mt-1 text-sm text-red-500">{errors.suplementosRecomendados}</p>
              )}
            </div>
            
            {/* Fecha de inicio */}
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

  // Use createPortal to render the modal content at the document body level
  return createPortal(modalContent, document.body);
};

export default AddDietPopup;