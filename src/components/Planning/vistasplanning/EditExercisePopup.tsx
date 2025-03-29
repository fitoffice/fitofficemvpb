import React, { useState, useEffect } from 'react';
import { X, Save, Dumbbell, Percent } from 'lucide-react';
import Button from './Button';

interface Exercise {
  id: string;
  ejercicioId?: string;
  nombre?: string;
  detalles?: {
    descripcion?: string;
    grupoMuscular?: string[];
    equipo?: string[];
  };
  variante?: {
    porcentaje?: number;
    series?: number;
    repeticiones?: number;
    descanso?: number;
  };
}

interface EditExercisePopupProps {
  open: boolean;
  onClose: () => void;
  exercise: Exercise;
  onSave: (updatedExercise: Exercise) => void;
  periodIndex: number;
  rm: number | null;
  planningId: string;
  periodoId: string;
}

const EditExercisePopup: React.FC<EditExercisePopupProps> = ({
  open,
  onClose,
  exercise,
  onSave,
  periodIndex,
  rm,
  planningId,
  periodoId
}) => {
  const [updatedExercise, setUpdatedExercise] = useState<Exercise>(exercise);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  
  useEffect(() => {
    setUpdatedExercise(exercise);
    
    // Calculate weight based on RM and percentage if both exist
    if (rm && exercise.variante?.porcentaje) {
      const weight = (rm * exercise.variante.porcentaje) / 100;
      setCalculatedWeight(Math.round(weight * 10) / 10); // Round to 1 decimal place
    } else {
      setCalculatedWeight(null);
    }
  }, [exercise, rm]);
  
  const handleChange = (field: string, value: any) => {
    setUpdatedExercise(prev => {
      const updated = { ...prev };
      
      if (field.startsWith('variante.')) {
        const varianteField = field.split('.')[1];
        updated.variante = { ...updated.variante, [varianteField]: value };
        
        // Recalculate weight if percentage changes and RM exists
        if (varianteField === 'porcentaje' && rm) {
          const weight = (rm * value) / 100;
          setCalculatedWeight(Math.round(weight * 10) / 10);
        }
      } else {
        (updated as any)[field] = value;
      }
      
      return updated;
    });
  };
  
  const handleSave = async () => {
    console.log('EditExercisePopup - Saving exercise:', updatedExercise);
    
    // In development environment, just update locally
    onSave(updatedExercise);
    
    // The following code is kept for production environments
    if (process.env.NODE_ENV === 'production') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/periodos/${periodoId}/ejercicios/${updatedExercise.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            variante: updatedExercise.variante
          })
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el ejercicio');
        }

        console.log('Ejercicio actualizado exitosamente en el servidor');
      } catch (error) {
        console.error('Error al actualizar el ejercicio:', error);
        // Aquí podrías mostrar una notificación de error
      }
    }
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-indigo-600" />
          Editar Ejercicio
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Información del Ejercicio</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={updatedExercise.nombre || ''}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled
              />
            </div>
            
            {updatedExercise.detalles?.grupoMuscular && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo Muscular
                </label>
                <div className="flex flex-wrap gap-2">
                  {updatedExercise.detalles.grupoMuscular.map((musculo, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700"
                    >
                      <Dumbbell className="w-3 h-3" />
                      {musculo}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {updatedExercise.detalles?.descripcion && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={updatedExercise.detalles.descripcion}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
                  disabled
                />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Parámetros de Entrenamiento</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Porcentaje de RM (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={updatedExercise.variante?.porcentaje || ''}
                  onChange={(e) => handleChange('variante.porcentaje', Number(e.target.value))}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  max="100"
                />
                <Percent className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              </div>
            </div>
            
            {rm && (
              <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-700">RM Actual:</span>
                  <span className="font-bold text-indigo-900">{rm} kg</span>
                </div>
                
                {calculatedWeight !== null && (
                  <div className="mt-2 pt-2 border-t border-indigo-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-700">Peso Calculado:</span>
                    <span className="font-bold text-indigo-900">{calculatedWeight} kg</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series
              </label>
              <input
                type="number"
                value={updatedExercise.variante?.series || ''}
                onChange={(e) => handleChange('variante.series', Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeticiones
              </label>
              <input
                type="number"
                value={updatedExercise.variante?.repeticiones || ''}
                onChange={(e) => handleChange('variante.repeticiones', Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descanso (segundos)
              </label>
              <input
                type="number"
                value={updatedExercise.variante?.descanso || ''}
                onChange={(e) => handleChange('variante.descanso', Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditExercisePopup;