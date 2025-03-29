import React, { useState, useEffect } from 'react';
import { useDiet } from '../contexts/DietContext';
import { useTheme } from '../../contexts/ThemeContext';

interface MacrosEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dietId: string;
  date: string;
  initialMacros: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  onMacrosUpdated: (updatedMacros: any) => void;
}

export default function MacrosEditModal({ 
  isOpen, 
  onClose, 
  dietId,
  date,
  initialMacros,
  onMacrosUpdated 
}: MacrosEditModalProps) {
  const [macros, setMacros] = useState(initialMacros);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saveMacrosToAPI, loading: contextLoading } = useDiet();
  const { theme } = useTheme();
  
  // Reset macros when modal opens with new initialMacros
  useEffect(() => {
    if (isOpen && initialMacros) {
      setMacros(initialMacros);
    }
  }, [isOpen, initialMacros]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      // Validate all macro values are numeric and positive
      const macroValues = {
        calorias: Math.round(Number(macros.calorias)),
        proteinas: Math.round(Number(macros.proteinas)),
        carbohidratos: Math.round(Number(macros.carbohidratos)),
        grasas: Math.round(Number(macros.grasas))
      };

      if (Object.entries(macroValues).some(([key, value]) => isNaN(value) || value < 0)) {
        throw new Error('Todos los valores deben ser números positivos');
      }

      // Format and validate date
      const formattedDate = new Date(date).toISOString();
      
      console.log('\n🎯 ACTUALIZANDO MACROS:');
      console.log('DietId:', dietId);
      console.log('Fecha:', formattedDate);
      console.log('Valores validados:', macroValues);
      
      // Format the data according to the API expectations
      const macronutrientes = {
        calorias: macroValues.calorias,
        proteinas: macroValues.proteinas,
        carbohidratos: macroValues.carbohidratos,
        grasas: macroValues.grasas
      };
      
      // Use the token to make the API request directly
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/dietas/${dietId}/dias/${formattedDate}/macros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ macronutrientes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar macros');
      }

      const updatedData = await response.json();
      console.log('✅ Macros actualizados correctamente:', updatedData);
      
      // Call the callback to update parent component
      onMacrosUpdated(macroValues);
      onClose();
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof macros) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMacros(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 w-full max-w-md ${
        theme === 'dark' 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-gray-800'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Editar Macros para {new Date(date).toLocaleDateString()}</h2>
        {error && (
          <div className={`mb-4 p-3 rounded ${
            theme === 'dark'
              ? 'bg-red-900/50 border border-red-700 text-red-300'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Calorías
              <input
                type="number"
                value={macros.calorias}
                onChange={handleInputChange('calorias')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                min="0"
                disabled={isLoading || contextLoading}
              />
            </label>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Proteínas (g)
              <input
                type="number"
                value={macros.proteinas}
                onChange={handleInputChange('proteinas')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                min="0"
                disabled={isLoading || contextLoading}
              />
            </label>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Carbohidratos (g)
              <input
                type="number"
                value={macros.carbohidratos}
                onChange={handleInputChange('carbohidratos')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                min="0"
                disabled={isLoading || contextLoading}
              />
            </label>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Grasas (g)
              <input
                type="number"
                value={macros.grasas}
                onChange={handleInputChange('grasas')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                min="0"
                disabled={isLoading || contextLoading}
              />
            </label>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading || contextLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isLoading || contextLoading
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : theme === 'dark'
                    ? 'bg-blue-700 hover:bg-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading || contextLoading}
            >
              {isLoading || contextLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}