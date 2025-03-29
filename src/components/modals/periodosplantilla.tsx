import React, { useState } from 'react';
import { Dumbbell, ArrowRight, X, Calendar, Info } from 'lucide-react';
import Button from '../Common/Button';

interface Period {
  start: number;
  end: number;
  name: string;
}

interface PeriodosPlantillaProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPeriods: Period[];
  onSubmit: (formData: any) => void;
}

const PeriodosPlantilla: React.FC<PeriodosPlantillaProps> = ({
  isOpen,
  onClose,
  selectedPeriods,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Configurar Períodos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-indigo-600" />
              Períodos Seleccionados
            </h2>
            <div className="group relative">
              <Info className="w-5 h-5 text-indigo-400 hover:text-indigo-600 transition-colors cursor-help" />
              <div className="absolute right-0 w-64 p-3 bg-white rounded-lg shadow-xl border border-indigo-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-sm text-gray-600">
                Configure los detalles de cada período seleccionado.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-indigo-600" />
              Detalles de los períodos
            </h3>
            <div className="space-y-4">
              {selectedPeriods.map((period, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-indigo-700 font-medium">
                      Período {index + 1}: Semana {period.start} a Semana {period.end}
                    </h4>
                  </div>
                  {/* Aquí puedes añadir más campos para configurar cada período */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => onSubmit({ periods: selectedPeriods })}
            type="submit"
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PeriodosPlantilla;
