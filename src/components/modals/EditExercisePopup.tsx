import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Dumbbell, ArrowDown, ArrowUp, Scale, Percent } from 'lucide-react';
import Button from '../Common/Button';

interface EditExercisePopupProps {
  open: boolean;
  onClose: () => void;
  exercise: any;
  onSave: (exercise: any) => void;
  periodIndex: number;
  rm?: number;
  relativeWeight?: number;
  onRMChange?: (value: number) => void;
  onRelativeWeightChange?: (value: number) => void;
  sets?: Array<{
    weight: number;
    reps: number;
    rest: number;
    _id: string;
  }>;
  onSetsWeightChange?: (weights: number[]) => void;
  planningId: string;
  periodoId: string;
}
interface RMResponse {
  message: string;
  clientId: string;
  clientName: string;
  exercise: {
    id: string;
    nombre: string;
    grupoMuscular: string[];
    descripcion: string;
    equipo: string[];
  };
  rm: {
    id: string;
    value: number;
    date: string;
  };
}

const EditExercisePopup: React.FC<EditExercisePopupProps> = ({
  open,
  onClose,
  exercise,
  onSave,
  periodIndex,
  rm,
  relativeWeight,
  onRMChange,
  onRelativeWeightChange,
  sets,
  onSetsWeightChange,
  planningId,
  periodoId
}) => {
  const [editedExercise, setEditedExercise] = useState<any>(null);
  const [localRM, setLocalRM] = useState<string>('');
  const [showSetPercentages, setShowSetPercentages] = useState<boolean>(false);
  const [setPercentages, setSetPercentages] = useState<string[]>(sets?.map(() => '') || []);
  const [weightAdjustment, setWeightAdjustment] = useState<string>('');
  const [adjustmentType, setAdjustmentType] = useState<'maintain' | 'increase' | 'decrease' | null>(null);
  const [adjustmentUnit, setAdjustmentUnit] = useState<'kg' | 'percentage'>('kg');
  const [fetchedRM, setFetchedRM] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (exercise) {
      console.log('EditExercisePopup - Initial Exercise Data:', {
        exercise,
        periodIndex,
        rm,
        relativeWeight,
        planningId,
        periodoId
      });
      
      // Set the edited exercise
      setEditedExercise({ ...exercise });
      
      // Initialize localRM with the exercise's porcentaje if available
      setLocalRM(exercise.porcentaje?.toString() || relativeWeight?.toString() || '');
      
      // Initialize adjustment type and unit from exercise data if available
      if (exercise.ajuste) {
        setAdjustmentType(exercise.ajuste.tipo || 'maintain');
        setAdjustmentUnit(exercise.ajuste.unidad || 'kg');
        setWeightAdjustment(exercise.ajuste.valor?.toString() || '');
      }
      fetchExerciseRM(exercise.ejercicioId || exercise.id);
    }
  }, [exercise, periodIndex, rm, relativeWeight, planningId, periodoId]);
  const fetchExerciseRM = async (exerciseId: string) => {
    if (!exerciseId || !planningId) {
      console.error('Missing required IDs for RM fetch:', { exerciseId, planningId });
      return;
    }

    try {
      console.log('Fetching RM data for exercise:', {
        exerciseId,
        planningId,
        url: `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/exercises/${exerciseId}/rm`
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/exercises/${exerciseId}/rm`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching RM data:', errorText);
        return;
      }

      const data: RMResponse = await response.json();
      console.log('RM data fetched successfully:', data);
      
      // Update the RM state with the fetched value
      if (data.rm && data.rm.value) {
        console.log('Setting RM value from API:', data.rm.value);
        setFetchedRM(data.rm.value);
        
        // If onRMChange prop exists, call it with the new RM value
        if (onRMChange) {
          console.log('Calling onRMChange with new RM value:', data.rm.value);
          onRMChange(data.rm.value);
        }
      } else {
        console.log('No RM value found in response');
      }
    } catch (error) {
      console.error('Error fetching RM data:', error);
    }
  };

  useEffect(() => {
    // Log the IDs for debugging
    console.log('EditExercisePopup - Received IDs:', {
      planningId,
      periodoId
    });
      
    // Validate IDs early
    if (!planningId || !periodoId) {
      console.error('Missing required IDs on component mount:', { 
        planningId, 
        periodoId,
        message: 'asegurate que el VistaEstadisticas.tsx le pase el planningId al EditExercisePopup.tsx'
      });
        
      // Try to get planning ID from URL if not provided
      if (!planningId && window.location.pathname) {
        const pathSegments = window.location.pathname.split('/');
        const possiblePlanningId = pathSegments.find(segment => 
          segment.length === 24 && /^[0-9a-f]{24}$/i.test(segment)
        );
          
        if (possiblePlanningId) {
          console.log('Found possible planning ID from URL:', possiblePlanningId);
          // Store the planning ID from URL in a ref to use it in requests
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('detectedPlanningId', possiblePlanningId);
          }
        }
      }
    }
  }, [planningId, periodoId]);  

  const handleSave = async () => {
    if (editedExercise) {
      try {
        const token = localStorage.getItem('token');
  
        // Add validation for planningId and periodoId
        let effectivePlanningId = planningId;
        
        // If planningId is missing, try to get it from session storage (set from URL)
        if (!effectivePlanningId) {
          console.warn('planningId is missing, attempting to find alternative source');
          
          // First try to get from session storage (from URL detection)
          const storedPlanningId = typeof window !== 'undefined' ? 
            window.sessionStorage.getItem('detectedPlanningId') : null;
          
          if (storedPlanningId) {
            console.log('Using planning ID from URL (stored in session):', storedPlanningId);
            effectivePlanningId = storedPlanningId;
          } else {
            // Try to extract from URL again as fallback
            const pathSegments = window.location.pathname.split('/');
            const possiblePlanningId = pathSegments.find(segment => 
              segment.length === 24 && /^[0-9a-f]{24}$/i.test(segment)
            );
            
            if (possiblePlanningId) {
              console.log('Using planning ID from URL:', possiblePlanningId);
              effectivePlanningId = possiblePlanningId;
            } else if (exercise && exercise.planningId) {
              console.log('Using planning ID from exercise object:', exercise.planningId);
              effectivePlanningId = exercise.planningId;
            }
          }
        }
        
        // Final validation
        if (!effectivePlanningId || !periodoId) {
          console.error('Still missing required IDs after recovery attempts:', { 
            effectivePlanningId, 
            periodoId 
          });
          alert('Error: Faltan identificadores necesarios para guardar los cambios. Por favor, recarga la página e intenta de nuevo.');
          return;
        }
        
        // Get the correct ejercicioId from the exercise object
        const ejercicioId = editedExercise.ejercicioId || editedExercise.id;
        
        if (!ejercicioId) {
          console.error('Missing ejercicioId in exercise object:', editedExercise);
          alert('Error: No se pudo determinar el ID del ejercicio. Por favor, recarga la página e intenta de nuevo.');
          return;
        }
        
        const requestData = {
          ejercicios: [{
            ejercicioId: ejercicioId,
            porcentaje: Number(localRM),
            ajuste: {
              tipo: adjustmentType || 'maintain',
              unidad: adjustmentUnit,
              valor: adjustmentType === 'maintain' ? calculatedRM : Number(weightAdjustment) || 0
            }
          }]
        };
  
        console.log('DATOS ENVIADOS AL SERVIDOR:', {
          url: `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${effectivePlanningId}/periodos/${periodoId}/porcentajes`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer [token]' // Not showing actual token for security
          },
          body: JSON.stringify(requestData, null, 2),
          ejercicioId: ejercicioId,
          porcentaje: Number(localRM),
          ajusteTipo: adjustmentType || 'maintain',
          ajusteUnidad: adjustmentUnit,
          ajusteValor: adjustmentType === 'maintain' ? calculatedRM : Number(weightAdjustment) || 0,
          calculatedRM: calculatedRM,
          weightAdjustment: Number(weightAdjustment) || 0
        });
        
        console.log('Prepared request data:', requestData);
        console.log('Using Planning ID:', effectivePlanningId);
        console.log('Periodo ID:', periodoId);
        
        const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${effectivePlanningId}/periodos/${periodoId}/porcentajes`;
        console.log('Making PUT request to URL:', url);
  
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        const result = await response.json();
        console.log('PUT request successful with result:', result);
  
        // Update the exercise object with the new values before passing it back
        const updatedExercise = {
          ...editedExercise,
          porcentaje: Number(localRM),
          ajuste: {
            tipo: adjustmentType || 'maintain',
            unidad: adjustmentUnit,
            valor: adjustmentType === 'maintain' ? calculatedRM : Number(weightAdjustment) || 0
          }
        };
        
        onSave(updatedExercise);
        onClose();
      } catch (error) {
        console.error('Detailed error in sending exercise percentages:', error);
        alert('Error al guardar los porcentajes. Por favor, revisa la consola para más detalles.');
      }
    }
  };
  const handleRMChange = (value: string) => {
    console.log('EditExercisePopup - RM Change:', {
      newValue: value,
      periodIndex,
      previousRM: localRM
    });
    setLocalRM(value);
  };

  const handleSetPercentageChange = (index: number, value: string) => {
    const newPercentages = [...setPercentages];
    newPercentages[index] = value;
    setSetPercentages(newPercentages);
  };
  const applySetPercentages = async () => {
    if (sets && onSetsWeightChange) {
      console.log('Applying set percentages...');
      const baseWeight = rm || 0;
      const weights = setPercentages.map(percentage => {
        const percentValue = Number(percentage) || 0;
        return Math.round((baseWeight * percentValue) / 100);
      });
      onSetsWeightChange(weights);
  
      try {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
  
        // Add validation for planningId and periodoId
        let effectivePlanningId = planningId;
        
        // If planningId is missing, try to get it from session storage (set from URL)
        if (!effectivePlanningId) {
          console.warn('planningId is missing, attempting to find alternative source');
          
          // First try to get from session storage (from URL detection)
          const storedPlanningId = typeof window !== 'undefined' ? 
            window.sessionStorage.getItem('detectedPlanningId') : null;
          
          if (storedPlanningId) {
            console.log('Using planning ID from URL (stored in session):', storedPlanningId);
            effectivePlanningId = storedPlanningId;
          } else {
            // Try to extract from URL again as fallback
            const pathSegments = window.location.pathname.split('/');
            const possiblePlanningId = pathSegments.find(segment => 
              segment.length === 24 && /^[0-9a-f]{24}$/i.test(segment)
            );
            
            if (possiblePlanningId) {
              console.log('Using planning ID from URL:', possiblePlanningId);
              effectivePlanningId = possiblePlanningId;
            } else if (exercise && exercise.planningId) {
              console.log('Using planning ID from exercise object:', exercise.planningId);
              effectivePlanningId = exercise.planningId;
            }
          }
        }
        
        // Final validation
        if (!effectivePlanningId || !periodoId) {
          console.error('Still missing required IDs after recovery attempts:', { 
            effectivePlanningId, 
            periodoId 
          });
          alert('Error: Faltan identificadores necesarios para guardar los cambios. Por favor, recarga la página e intenta de nuevo.');
          return;
        }
  
        // Create a safe copy of the IDs to use in the URL
        const safePlanningId = effectivePlanningId.trim();
        const safePeriodoId = periodoId.trim();
          
        const requestData = {
          ejercicios: setPercentages.map((percentage, index) => ({
            ejercicioId: sets[index]._id,
            porcentaje: Number(percentage)
          })).filter(item => item.porcentaje > 0)
        };
  
        console.log('Prepared request data:', requestData);
        console.log('Using IDs for request:', { planningId: safePlanningId, periodoId: safePeriodoId });
        
        const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${safePlanningId}/periodos/${safePeriodoId}/porcentajes`;
        console.log('Making PUT request to URL:', url);
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
        });
  
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        const result = await response.json();
        console.log('PUT request successful with result:', result);
      } catch (error) {
        console.error('Error sending exercise percentages:', error);
        alert('Error al guardar los porcentajes. Por favor, revisa la consola para más detalles.');
      }
    }
  };
  if (!exercise) return null;
  if (!mounted || !open || !exercise) return null;

  const percentage = Number(localRM) || 0;
  const calculatedRM = Math.round(((fetchedRM !== null ? fetchedRM : rm) || 0) * percentage / 100);
  
  // Calculate the adjusted weight based on user input
  let adjustedWeight = calculatedRM;
  if (adjustmentType === 'increase' && weightAdjustment) {
    if (adjustmentUnit === 'kg') {
      adjustedWeight = calculatedRM + Number(weightAdjustment);
    } else { // percentage
      adjustedWeight = calculatedRM + Math.round(calculatedRM * Number(weightAdjustment) / 100);
    }
  } else if (adjustmentType === 'decrease' && weightAdjustment) {
    if (adjustmentUnit === 'kg') {
      adjustedWeight = Math.max(0, calculatedRM - Number(weightAdjustment));
    } else { // percentage
      adjustedWeight = Math.max(0, calculatedRM - Math.round(calculatedRM * Number(weightAdjustment) / 100));
    }
  }

    const modalContent = (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 w-[600px] relative max-h-[90vh] overflow-y-auto border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl animate-gradient-x"></div>
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-full p-2 group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>


        <h2 className="text-3xl font-extrabold mb-6 text-gray-800 mt-2 flex items-center gap-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            <Dumbbell className="w-8 h-8 inline-block mr-2 -mt-1" />
            Editar Ejercicio:
          </span>
          <span className="ml-2 font-mono bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {exercise.nombre}
          </span>
        </h2>
        
        {/* Sección de RM */}
        <div className="mb-8 space-y-4">
          <div className="relative group">
            <label className="block text-sm font-bold text-gray-700 mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent flex items-center gap-2">
              <Scale className="w-4 h-4" />
              {periodIndex === 0 ? 'RM x (%)' : 'Peso anterior x (%)'}
            </label>
            <div className="relative transition-all duration-300 hover:shadow-lg">
              <input
                type="number"
                value={localRM}
                onChange={(e) => handleRMChange(e.target.value)}
                className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:border-indigo-200 bg-white text-lg font-medium"
                placeholder={periodIndex === 0 ? "Ingrese % del RM" : "Ingrese % del peso anterior"}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 font-bold">%</div>
            </div>
          </div>
        </div>

        

        <div className="space-y-4">
          {periodIndex === 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
              <div className="flex items-center justify-center mb-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-semibold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {periodIndex === 0 ? 'Calculando basado en el RM' : 'Calculando basado en el peso anterior'}
              </p>
              <p className="text-sm text-gray-600 text-center">
                Peso calculado: <span className="font-semibold text-indigo-600">
                  {adjustmentType ? adjustedWeight : calculatedRM} kg
                </span> 
                <span className="text-gray-400 mx-2">•</span>
                <span className="font-medium text-gray-600">{percentage}%</span>
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Button
                  onClick={() => {
                    setAdjustmentType('maintain');
                    setWeightAdjustment('');
                  }}
                  variant="plain"
                  className="px-4 py-2 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <Dumbbell className="w-4 h-4" />
                  <span>Mantener peso</span>
                </Button>
                <Button
                  onClick={() => setAdjustmentType('decrease')}
                  variant="plain"
                  className="px-4 py-2 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <ArrowDown className="w-4 h-4" />
                  <span>Bajar peso</span>
                </Button>
                <Button
                  onClick={() => setAdjustmentType('increase')}
                  variant="plain"
                  className="px-4 py-2 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>Subir peso</span>
                </Button>
              </div>
              {(adjustmentType === 'increase' || adjustmentType === 'decrease') && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-center gap-3">
                    <Button
                      onClick={() => setAdjustmentUnit('kg')}
                      variant="plain"
                      className="px-4 py-2.5 flex items-center gap-2 transition-all duration-200 rounded-xl transform hover:scale-105 shadow-sm"
                    >
                      <Scale className="w-4 h-4" />
                      <span className="font-medium">Kilogramos</span>
                    </Button>
                    <Button
                      onClick={() => setAdjustmentUnit('percentage')}
                      variant="plain"
                      className="px-4 py-2.5 flex items-center gap-2 transition-all duration-200 rounded-xl transform hover:scale-105 shadow-sm"
                    >
                      <Percent className="w-4 h-4" />
                      <span className="font-medium">Porcentaje</span>
                    </Button>
                  </div>
                  <div className="relative max-w-xs mx-auto">
                    <input
                      type="number"
                      value={weightAdjustment}
                      onChange={(e) => setWeightAdjustment(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:border-gray-300 bg-white"
                      placeholder={`${adjustmentType === 'increase' ? 'Aumentar' : 'Disminuir'} peso en ${adjustmentUnit === 'kg' ? 'kg' : '%'}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {adjustmentUnit === 'kg' ? 'kg' : '%'}
                    </div>
                  </div>
                  {adjustmentUnit === 'kg' && (
                    <p className="text-sm text-gray-500 text-center">
                      {adjustmentType === 'increase' ? 'Aumentará' : 'Disminuirá'} {weightAdjustment ? `${Number(weightAdjustment)} kg cada serie` : '0 kg'}
                    </p>
                  )}
                  {adjustmentUnit === 'percentage' && (
                    <p className="text-sm text-gray-500 text-center">
                      {adjustmentType === 'increase' ? 'Aumentará' : 'Disminuirá'} {weightAdjustment ? `${(calculatedRM * (Number(weightAdjustment) / 100)).toFixed(1)} kg cada serie` : '0 kg'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-6"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
    );

     return createPortal(
    modalContent,
    document.body
  );
};


export default EditExercisePopup;