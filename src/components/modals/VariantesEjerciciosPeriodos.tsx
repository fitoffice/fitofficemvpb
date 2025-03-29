import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Variant {
  name: string;
  description: string;
  type: 'mantenimiento' | 'intensidad' | 'volumen' | 'peso_fijo_series';
}

interface VariantesEjerciciosPeriodosProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  exerciseId: string;
  onSelectVariant: (type: string, percentage?: number, initialWeight?: number, remainingWeight?: number, incrementType?: 'porcentaje' | 'peso_fijo' | null, incrementValue?: number) => void;
}

const VariantesEjerciciosPeriodos: React.FC<VariantesEjerciciosPeriodosProps> = ({
  isOpen,
  onClose,
  exerciseName,
  exerciseId,
  onSelectVariant
}) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(5);
  const [initialWeight, setInitialWeight] = useState<number>(0);
  const [remainingWeight, setRemainingWeight] = useState<number>(0);
  const [incrementType, setIncrementType] = useState<'porcentaje' | 'peso_fijo' | null>(null);
  const [incrementValue, setIncrementValue] = useState<number>(0);
  
  const variants: Variant[] = [
    { 
      name: 'Mantenimiento', 
      description: 'Mismo peso y mismas repeticiones - Mantiene la intensidad y volumen actuales',
      type: 'mantenimiento'
    },
    { 
      name: 'Intensidad', 
      description: 'Más peso, menos repeticiones - Enfoque en fuerza y potencia',
      type: 'intensidad'
    },
    { 
      name: 'Volumen', 
      description: 'Menos peso, más repeticiones - Enfoque en resistencia y volumen',
      type: 'volumen'
    },
    {
      name: 'Peso Fijo por Series',
      description: 'Primera serie con un peso específico y el resto con otro peso, con opción de incremento',
      type: 'peso_fijo_series'
    }
  ];

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant.type);
  };

  const handleConfirm = () => {
    if (selectedVariant) {
      console.log('VariantesEjerciciosPeriodos - Datos a enviar:', {
        selectedVariant,
        percentage,
        initialWeight,
        remainingWeight,
        incrementType,
        incrementValue
      });
      
      if (selectedVariant === 'peso_fijo_series') {
        onSelectVariant(
          selectedVariant,
          undefined,
          initialWeight,
          remainingWeight,
          incrementType,
          incrementValue
        );
      } else {
        console.log('Llamando a onSelectVariant con:', selectedVariant, percentage);
        onSelectVariant(selectedVariant, percentage);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Variantes de {exerciseName}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant) => (
            <div 
              key={variant.type} 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedVariant === variant.type ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-300'
              }`}
              onClick={() => handleVariantSelect(variant)}
            >
              <h3 className="font-semibold">{variant.name}</h3>
              <p className="text-sm text-gray-600">{variant.description}</p>
              
              {selectedVariant === variant.type && (variant.type === 'intensidad' || variant.type === 'volumen') && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {variant.type === 'intensidad' ? 'Porcentaje de incremento' : 'Porcentaje de reducción'} por serie
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      min="1"
                      max="100"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              )}
              
              {selectedVariant === variant.type && variant.type === 'peso_fijo_series' && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Peso para la primera serie (kg)
                    </label>
                    <input
                      type="number"
                      value={initialWeight}
                      onChange={(e) => setInitialWeight(Number(e.target.value))}
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Peso para el resto de series (kg)
                    </label>
                    <input
                      type="number"
                      value={remainingWeight}
                      onChange={(e) => setRemainingWeight(Number(e.target.value))}
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de incremento para series restantes
                    </label>
                    <div className="mt-1 space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-purple-600"
                          name="incrementType"
                          checked={incrementType === 'porcentaje'}
                          onChange={() => {
                            setIncrementType('porcentaje');
                            setIncrementValue(0);
                          }}
                        />
                        <span className="ml-2">Porcentaje</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-purple-600"
                          name="incrementType"
                          checked={incrementType === 'peso_fijo'}
                          onChange={() => {
                            setIncrementType('peso_fijo');
                            setIncrementValue(0);
                          }}
                        />
                        <span className="ml-2">Peso Fijo (kg)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-purple-600"
                          name="incrementType"
                          checked={incrementType === null}
                          onChange={() => {
                            setIncrementType(null);
                            setIncrementValue(0);
                          }}
                        />
                        <span className="ml-2">Sin incremento</span>
                      </label>
                    </div>
                    
                    {incrementType && (
                      <div className="mt-2 flex items-center">
                        <input
                          type="number"
                          value={incrementValue}
                          onChange={(e) => setIncrementValue(Number(e.target.value))}
                          className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          min="0"
                          step={incrementType === 'porcentaje' ? '1' : '0.5'}
                        />
                        <span className="ml-2">{incrementType === 'porcentaje' ? '%' : 'kg'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
            disabled={!selectedVariant}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantesEjerciciosPeriodos;
