import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DietConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: DietConfig) => void;
  initialConfig?: DietConfig;
  // Additional props from DietInfo
  title?: string;
  client?: string;
  goal?: string;
  restrictions?: string;
  estado?: string;
  macrosData?: {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fats: { current: number; target: number };
  };
}

export interface DietConfig {
  name: string;
  objective: string;
  status: 'active' | 'paused' | 'completed';
  allergiesIntolerances: string[];
  prohibitedFoods: string[];
  preferredFoods: string[];
  recommendedSupplements: string[];
  mealSchedules: string[];
}

const defaultConfig: DietConfig = {
  name: 'Nueva Dieta',
  objective: 'Pérdida de peso',
  status: 'active',
  allergiesIntolerances: [],
  prohibitedFoods: [],
  preferredFoods: [],
  recommendedSupplements: [],
  mealSchedules: []
};

export default function DietConfigPopup({ 
  isOpen, 
  onClose, 
  onSave, 
  initialConfig = defaultConfig,
  title,
  client,
  goal,
  restrictions,
  estado,
  macrosData
}: DietConfigPopupProps) {
  const [config, setConfig] = useState<DietConfig>(initialConfig);
  const [newItem, setNewItem] = useState('');
  const [activeSection, setActiveSection] = useState('general');
  const { theme } = useTheme();

  // Log the props received from DietInfo
  useEffect(() => {
    console.log('Datos recibidos en DietConfigPopup:', {
      título: title,
      cliente: client,
      objetivo: goal,
      restricciones: restrictions,
      estado: estado,
      macros: macrosData
    });
  }, [title, client, goal, restrictions, estado, macrosData]);

  // Update config with data from props when component mounts or props change
    // Update config with data from props when component mounts or props change
    useEffect(() => {
      if (title || goal || estado || restrictions) {
        // Parse restrictions if it's a string
        let parsedRestrictions = {};
        if (restrictions && typeof restrictions === 'string') {
          try {
            parsedRestrictions = JSON.parse(restrictions);
            console.log('Restricciones parseadas:', parsedRestrictions);
          } catch (error) {
            console.error('Error al parsear restricciones:', error);
          }
        }
  
        setConfig(prev => {
          // Convert string values to arrays if needed
          const allergiesIntolerances = parsedRestrictions.alergiasIntolerancias ? 
            [parsedRestrictions.alergiasIntolerancias] : prev.allergiesIntolerances;
          
          const preferredFoods = parsedRestrictions.alimentosPreferidos ? 
            [parsedRestrictions.alimentosPreferidos] : prev.preferredFoods;
          
          const prohibitedFoods = parsedRestrictions.alimentosProhibidos ? 
            [parsedRestrictions.alimentosProhibidos] : prev.prohibitedFoods;
          
          const mealSchedules = parsedRestrictions.horariosComidas ? 
            [parsedRestrictions.horariosComidas] : prev.mealSchedules;
          
          const recommendedSupplements = parsedRestrictions.suplementosRecomendados ? 
            [parsedRestrictions.suplementosRecomendados] : prev.recommendedSupplements;
  
          return {
            ...prev,
            name: title || prev.name,
            objective: goal || prev.objective,
            status: (estado === 'activa' ? 'active' : 
                    estado === 'pausada' ? 'paused' : 
                    estado === 'completada' ? 'completed' : 
                    prev.status) as 'active' | 'paused' | 'completed',
            allergiesIntolerances,
            preferredFoods,
            prohibitedFoods,
            mealSchedules,
            recommendedSupplements
          };
        });
      }
    }, [title, goal, estado, restrictions]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }
      
      // Extract the diet ID from props or context if available
      // This assumes you have a dietId available in props or context
      // You might need to adjust this based on your actual implementation
      const url = window.location.pathname;
      const dietId = url.split('/').pop() || '';
      
      
      // Send the configuration to the API
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/dietas/${dietId}/configuracion`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        throw new Error(`Error al guardar la configuración: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Configuración guardada exitosamente:', data);
      
      // Call the onSave callback with the config
      onSave(config);
      onClose();
    } catch (error) {
      console.error('Error al guardar la configuración de la dieta:', error);
      // You might want to show an error message to the user here
    }
  };
  
  const addItem = (field: keyof DietConfig) => {
    if (newItem.trim() === '') return;
    if (Array.isArray(config[field])) {
      setConfig({
        ...config,
        [field]: [...(config[field] as string[]), newItem]
      });
      setNewItem('');
    }
  };

  const removeItem = (field: keyof DietConfig, index: number) => {
    if (Array.isArray(config[field])) {
      setConfig({
        ...config,
        [field]: (config[field] as string[]).filter((_, i) => i !== index)
      });
    }
  };

  const renderItemList = (field: keyof DietConfig, title: string) => {
    if (!Array.isArray(config[field])) return null;
    
    return (
      <div className="mb-6">
        <label className="block text-white mb-2 font-medium">{title}</label>
        <div className="space-y-3 mb-4">
          {(config[field] as string[]).map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
              <span className="text-white">{item}</span>
              <button 
                onClick={() => removeItem(field, index)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-300" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Añadir ${title.toLowerCase()}...`}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            onClick={() => addItem(field)}
            className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-blue-900 border-blue-300' 
          : 'bg-gradient-to-br from-blue-900/95 via-indigo-900/95 to-blue-950/95 text-white border-white/10'
        } rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border animate-fade-in`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
            Configuración de Dieta
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${
              theme === 'light' 
                ? 'hover:bg-blue-200 text-blue-800' 
                : 'hover:bg-white/10 text-white'
            } transition-colors`}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex mb-6 border-b ${theme === 'light' ? 'border-blue-300' : 'border-white/20'}`}>
          <button 
            onClick={() => setActiveSection('general')}
            className={`px-4 py-2 font-medium ${
              activeSection === 'general' 
                ? theme === 'light' 
                  ? 'text-blue-700 border-b-2 border-blue-700' 
                  : 'text-blue-400 border-b-2 border-blue-400'
                : theme === 'light'
                  ? 'text-blue-600/70 hover:text-blue-800'
                  : 'text-white/70 hover:text-white'
            }`}
          >
            General
          </button>
          <button 
            onClick={() => setActiveSection('restrictions')}
            className={`px-4 py-2 font-medium ${
              activeSection === 'restrictions' 
                ? theme === 'light' 
                  ? 'text-blue-700 border-b-2 border-blue-700' 
                  : 'text-blue-400 border-b-2 border-blue-400'
                : theme === 'light'
                  ? 'text-blue-600/70 hover:text-blue-800'
                  : 'text-white/70 hover:text-white'
            }`}
          >
            Restricciones
          </button>
        </div>

        {/* General Section */}
        {activeSection === 'general' && (
          <div className="space-y-6">
            {/* Diet Name */}
            <div>
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Nombre de la Dieta
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({...config, name: e.target.value})}
                className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  theme === 'light'
                    ? 'bg-white/80 border border-blue-300 text-blue-900 placeholder-blue-400 focus:ring-blue-500/50'
                    : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-blue-500/50'
                }`}
                placeholder="Nombre de la dieta"
              />
            </div>

            {/* Diet Objective */}
            <div>
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Objetivo
              </label>
              <select
                value={config.objective}
                onChange={(e) => setConfig({...config, objective: e.target.value})}
                className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  theme === 'light'
                    ? 'bg-white/80 border border-blue-300 text-blue-900 focus:ring-blue-500/50'
                    : 'bg-white/10 border border-white/20 text-white focus:ring-blue-500/50'
                }`}
              >
                <option value="Pérdida de peso">Pérdida de peso</option>
                <option value="Ganancia muscular">Ganancia muscular</option>
                <option value="Mantenimiento de peso">Mantenimiento de peso</option>
                <option value="Mejora del rendimiento deportivo">Mejora del rendimiento deportivo</option>
                <option value="Mejora de la salud general">Mejora de la salud general</option>
                <option value="Aumento de la energía">Aumento de la energía</option>
                <option value="Control de enfermedades">Control de enfermedades</option>
                <option value="Mejora de la digestión">Mejora de la digestión</option>
                <option value="Reducción de la grasa corporal">Reducción de la grasa corporal</option>
                <option value="Detoxificación">Detoxificación</option>
                <option value="Aumento de la masa corporal">Aumento de la masa corporal</option>
                <option value="Preparación para competencias">Preparación para competencias</option>
                <option value="Rehabilitación y recuperación">Rehabilitación y recuperación</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            {/* Diet Status */}
            <div>
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Estado
              </label>
              <div className="flex space-x-2">
                {[
                  { value: 'active', label: 'Activa' },
                  { value: 'paused', label: 'Pausada' },
                  { value: 'completed', label: 'Completada' }
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => setConfig({...config, status: status.value as 'active' | 'paused' | 'completed'})}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      config.status === status.value 
                        ? theme === 'light'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : theme === 'light'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Restrictions Section */}
        {activeSection === 'restrictions' && (
          <div className="space-y-6 mt-4">
            <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
              Restricciones Alimenticias
            </h3>
            
            {/* Allergies and Intolerances */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Alergias e Intolerancias
              </label>
              <div className="space-y-3 mb-4">
                {config.allergiesIntolerances && config.allergiesIntolerances.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-white/10'
                  }`}>
                    <span className={theme === 'light' ? 'text-blue-900' : 'text-white'}>{item}</span>
                    <button 
                      onClick={() => removeItem('allergiesIntolerances', index)}
                      className={`p-1 rounded-full ${
                        theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-white/10'
                      } transition-colors`}
                    >
                      <Trash2 className={`w-4 h-4 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Añadir alergia o intolerancia..."
                  className={`flex-1 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    theme === 'light'
                      ? 'bg-white/80 border border-blue-300 text-blue-900 placeholder-blue-400 focus:ring-blue-500/50'
                      : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-blue-500/50'
                  }`}
                />
                <button
                  onClick={() => addItem('allergiesIntolerances')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-600/90 hover:bg-blue-600 text-white'
                      : 'bg-blue-500/80 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Prohibited Foods */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Alimentos Prohibidos
              </label>
              <div className="space-y-3 mb-4">
                {config.prohibitedFoods && config.prohibitedFoods.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-white/10'
                  }`}>
                    <span className={theme === 'light' ? 'text-blue-900' : 'text-white'}>{item}</span>
                    <button 
                      onClick={() => removeItem('prohibitedFoods', index)}
                      className={`p-1 rounded-full ${
                        theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-white/10'
                      } transition-colors`}
                    >
                      <Trash2 className={`w-4 h-4 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Añadir alimento prohibido..."
                  className={`flex-1 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    theme === 'light'
                      ? 'bg-white/80 border border-blue-300 text-blue-900 placeholder-blue-400 focus:ring-blue-500/50'
                      : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-blue-500/50'
                  }`}
                />
                <button
                  onClick={() => addItem('prohibitedFoods')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-600/90 hover:bg-blue-600 text-white'
                      : 'bg-blue-500/80 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Preferred Foods */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Alimentos Preferidos
              </label>
              <div className="space-y-3 mb-4">
                {config.preferredFoods && config.preferredFoods.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-white/10'
                  }`}>
                    <span className={theme === 'light' ? 'text-blue-900' : 'text-white'}>{item}</span>
                    <button 
                      onClick={() => removeItem('preferredFoods', index)}
                      className={`p-1 rounded-full ${
                        theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-white/10'
                      } transition-colors`}
                    >
                      <Trash2 className={`w-4 h-4 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Añadir alimento preferido..."
                  className={`flex-1 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    theme === 'light'
                      ? 'bg-white/80 border border-blue-300 text-blue-900 placeholder-blue-400 focus:ring-blue-500/50'
                      : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-blue-500/50'
                  }`}
                />
                <button
                  onClick={() => addItem('preferredFoods')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-600/90 hover:bg-blue-600 text-white'
                      : 'bg-blue-500/80 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Recommended Supplements */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Suplementos Recomendados
              </label>
              <div className="space-y-3 mb-4">
                {config.recommendedSupplements && config.recommendedSupplements.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-white/10'
                  }`}>
                    <span className={theme === 'light' ? 'text-blue-900' : 'text-white'}>{item}</span>
                    <button 
                      onClick={() => removeItem('recommendedSupplements', index)}
                      className={`p-1 rounded-full ${
                        theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-white/10'
                      } transition-colors`}
                    >
                      <Trash2 className={`w-4 h-4 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Añadir suplemento recomendado..."
                  className={`flex-1 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    theme === 'light'
                      ? 'bg-white/80 border border-blue-300 text-blue-900 placeholder-blue-400 focus:ring-blue-500/50'
                      : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-blue-500/50'
                  }`}
                />
                <button
                  onClick={() => addItem('recommendedSupplements')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-600/90 hover:bg-blue-600 text-white'
                      : 'bg-blue-500/80 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Meal Schedules */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-blue-900' : 'text-white'}`}>
                Horarios de Comidas
              </label>
              <div className="space-y-3 mb-4">
                {config.mealSchedules && config.mealSchedules.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-white/10'
                  }`}>
                    <span className={theme === 'light' ? 'text-blue-900' : 'text-white'}>{item}</span>
                    <button 
                      onClick={() => removeItem('mealSchedules', index)}
                      className={`p-1 rounded-full ${
                        theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-white/10'
                      } transition-colors`}
                    >
                      <Trash2 className={`w-4 h-4 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Añadir horario de comida..."
                  className={`flex-1 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    theme === 'light'
                      ? 'bg-white/80 border border-blue-300 text-blue-900 placeholder-blue-400 focus:ring-blue-500/50'
                      : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-blue-500/50'
                  }`}
                />
                <button
                  onClick={() => addItem('mealSchedules')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-600/90 hover:bg-blue-600 text-white'
                      : 'bg-blue-500/80 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              theme === 'light'
                ? 'bg-blue-700 hover:bg-blue-800'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Save className="w-5 h-5" />
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );}
