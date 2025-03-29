import React from 'react';
import { X, Camera, FileText, Scale, Clock, Dumbbell } from 'lucide-react';

interface BaseCheckin {
  fecha: string;
  notas: string;
  fotos: string[];
  estado: 'success' | 'warning' | 'error';
}

interface EntrenamientoCheckin extends BaseCheckin {
  tipo: 'entrenamiento';
  pesoLevantado: number;
  repeticiones: number;
  series: number;
  ejerciciosCompletados: number;
}

interface DietaCheckin extends BaseCheckin {
  tipo: 'dieta';
  peso: number;
  calorias: number;
  macros: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

type Checkin = EntrenamientoCheckin | DietaCheckin;

interface CheckinPopupProps {
  checkin: Checkin;
  onClose: () => void;
}

const CheckinPopup: React.FC<CheckinPopupProps> = ({ checkin, onClose }) => {
  const isEntrenamiento = checkin.tipo === 'entrenamiento';

  const getEstadoText = (estado: 'success' | 'warning' | 'error') => {
    switch (estado) {
      case 'success':
        return 'Excelente';
      case 'warning':
        return 'Regular';
      case 'error':
        return 'Necesita Mejorar';
    }
  };

  const getEstadoClass = (estado: 'success' | 'warning' | 'error') => {
    switch (estado) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-5 h-5" />
              <h2 className="text-lg font-semibold">
                Check-in {isEntrenamiento ? 'Entrenamiento' : 'Dieta'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            {/* Fecha */}
            <div className="text-sm text-gray-500">
              {new Date(checkin.fecha).toLocaleDateString()}
            </div>

            {/* Estado */}
            <div className={`p-3 rounded-md ${getEstadoClass(checkin.estado)}`}>
              Estado: {getEstadoText(checkin.estado)}
            </div>

            {/* Datos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {isEntrenamiento ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Peso Levantado</div>
                        <div className="text-lg">{checkin.pesoLevantado} kg</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Series y Repeticiones</div>
                        <div className="text-lg">{checkin.series} x {checkin.repeticiones}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Ejercicios Completados</div>
                        <div className="text-lg">{checkin.ejerciciosCompletados}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Peso Actual</div>
                        <div className="text-lg">{checkin.peso} kg</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Calorías</div>
                        <div className="text-lg">{checkin.calorias} kcal</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Notas y Fotos */}
              <div className="space-y-6">
                {checkin.notas && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h3 className="font-medium">Notas</h3>
                    </div>
                    <p className="text-gray-600 pl-7">
                      {checkin.notas}
                    </p>
                  </div>
                )}

                {checkin.fotos.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-gray-400" />
                      <h3 className="font-medium">Fotos</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pl-7">
                      {checkin.fotos.map((foto, index) => (
                        <img
                          key={index}
                          src={foto}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinPopup;
