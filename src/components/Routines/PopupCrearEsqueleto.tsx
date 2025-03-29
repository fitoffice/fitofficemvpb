import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { WeekSelector } from './WeekSelector';
import { ExercisePeriod } from './ExercisePeriod';
import { NavigationButtons } from './NavigationButtons';
import { EdicionExercisePeriod } from './EdicionExercisePeriod';
import clsx from 'clsx';

interface WeekRange {
  start: number;
  end: number;
  name: string;
  semanaInicio: number;
  diaInicio: number;
  semanaFin: number;
  diaFin: number;
  variants: any[];
}

interface RenderConfig {
  campo1: string;
  campo2: string;
  campo3: string;
}

interface Set {
  reps: number;
  weight: number;
  rest: number;
}

interface Exercise {
  exercise: string;
  sets: Set[];
}

interface Variant {
  color: string;
  exercises: Exercise[];
}

interface Period {
  nombre: string;
  semanaInicio: number;
  diaInicio: number;
  semanaFin: number;
  diaFin: number;
  variants: Variant[];
}

interface Skeleton {
  _id?: string;
  nombre: string;
  descripcion: string;
  periodos: Period[];
  plannings: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface PopupCrearEsqueletoProps {
  onClose: () => void;
  onSubmit?: (data: Skeleton) => void;
}

const PopupCrearEsqueleto: React.FC<PopupCrearEsqueletoProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [skeletonData, setSkeletonData] = useState<Skeleton>({
    nombre: '',
    descripcion: '',
    periodos: []
  });
  const [editingSkeletonId, setEditingSkeletonId] = useState<string | null>(null);
  const [skeletons, setSkeletons] = useState<Skeleton[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState<WeekRange[]>([]);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  useEffect(() => {
    const fetchSkeletons = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/esqueleto', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los esqueletos');
        }

        const data = await response.json();
        setSkeletons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los esqueletos');
      } finally {
        setLoading(false);
      }
    };

    fetchSkeletons();
  }, []);

  const handleWeekSelect = (weekNumber: number) => {
    console.log('handleWeekSelect - Número seleccionado:', weekNumber);
    console.log('handleWeekSelect - Estado actual:', { selectionStart, selectedWeeks });

    if (!selectionStart) {
      setSelectionStart(weekNumber);
      console.log('handleWeekSelect - Estableciendo inicio:', weekNumber);
    } else {
      const start = Math.min(selectionStart, weekNumber);
      const end = Math.max(selectionStart, weekNumber);

      const hasOverlap = selectedWeeks.some(range => 
        (start <= range.end && end >= range.start)
      );

      console.log('handleWeekSelect - Verificando solapamiento:', { start, end, hasOverlap });

      if (!hasOverlap) {
        const startWeek = Math.ceil(start / 7);
        const startDay = start % 7 === 0 ? 7 : start % 7;
        const endWeek = Math.ceil(end / 7);
        const endDay = end % 7 === 0 ? 7 : end % 7;

        const newPeriod = { 
          start, 
          end, 
          name: `Período ${selectedWeeks.length + 1}`,
          semanaInicio: startWeek,
          diaInicio: startDay,
          semanaFin: endWeek,
          diaFin: endDay,
          variants: []
        };

        console.log('handleWeekSelect - Nuevo período creado:', newPeriod);
        setSelectedWeeks([...selectedWeeks, newPeriod]);
      }

      setSelectionStart(null);
    }
  };

  const handleUpdatePeriodName = (index: number, name: string) => {
    console.log('handleUpdatePeriodName:', { index, name });
    const newSelectedWeeks = [...selectedWeeks];
    newSelectedWeeks[index] = { ...newSelectedWeeks[index], name };
    setSelectedWeeks(newSelectedWeeks);
  };

  const handleSaveExercise = (periodIndex: number, variants: Variant[]) => {
    console.log('handleSaveExercise - Inicio:', { periodIndex, variants });
    
    const newPeriodos = [...skeletonData.periodos];
    const period = selectedWeeks[periodIndex];
    
    const newPeriod = {
      nombre: period.name,
      semanaInicio: period.semanaInicio,
      diaInicio: period.diaInicio,
      semanaFin: period.semanaFin,
      diaFin: period.diaFin,
      variants: variants
    };

    console.log('handleSaveExercise - Nuevo período:', newPeriod);
    
    newPeriodos[periodIndex] = newPeriod;

    const newSkeletonData = {
      ...skeletonData,
      periodos: newPeriodos
    };

    console.log('handleSaveExercise - Nuevo estado del esqueleto:', newSkeletonData);
    setSkeletonData(newSkeletonData);
  };

  const handleEditSkeleton = async (skeletonId: string) => {
    try {
      console.log('Obteniendo esqueleto para editar:', skeletonId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/esqueleto/${skeletonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el esqueleto');
      }

      const data = await response.json();
      console.log('Datos del esqueleto a editar:', data);
      setSkeletonData(data);
      setEditingSkeletonId(skeletonId);
      setStep(0);
    } catch (err) {
      console.error('Error al obtener el esqueleto para editar:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleEditPeriod = (skeleton: Skeleton) => {
    console.log('PopupCrearEsqueleto - Editando periodos del esqueleto:', skeleton);
    setSelectedPeriod(skeleton.periodos[0]);
    setSkeletonData(skeleton);
    setIsEditing(true);
  };

  const handleSavePeriods = (updatedPeriods: Period[]) => {
    console.log('PopupCrearEsqueleto - Guardando periodos actualizados:', updatedPeriods);
    setSkeletonData({
      ...skeletonData,
      periodos: updatedPeriods
    });
    setIsEditing(false);
    setSelectedPeriod(null);
  };

  const handleSubmit = async () => {
    try {
      console.log('handleSubmit - Iniciando envío con datos:', skeletonData);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const url = editingSkeletonId 
        ? `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/esqueleto/${editingSkeletonId}`
        : 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/esqueleto';

      const method = editingSkeletonId ? 'PUT' : 'POST';

      console.log(`handleSubmit - Preparando petición ${method} a ${url}`);
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(skeletonData)
      });

      if (!response.ok) {
        throw new Error(`Error al ${editingSkeletonId ? 'actualizar' : 'crear'} el esqueleto`);
      }

      const data = await response.json();
      console.log('handleSubmit - Respuesta del servidor:', data);

      if (onSubmit) {
        onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error('handleSubmit - Error:', error);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!skeletonData.nombre || !skeletonData.descripcion)) {
      return;
    }
    setStep(step + 1);
  };

  const handleStartCreation = () => {
    setSkeletonData({
      nombre: '',
      descripcion: '',
      periodos: []
    });
    setStep(1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        {isEditing ? (
          <EdicionExercisePeriod
            periods={skeletonData.periodos}
            onSave={handleSavePeriods}
            onClose={() => {
              setIsEditing(false);
              setSelectedPeriod(null);
            }}
          />
        ) : (
          <>
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {step === 0 ? 'Esqueletos de Rutina' : 'Crear Esqueleto de Rutina'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {step === 0 ? (
                <div>
                  <div className="mb-6">
                    {/* Lista de periodos con botón de editar */}
                    {skeletonData.periodos.map((period, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded mb-2">
                        <span>{period.nombre}</span>
                        <button
                          onClick={() => handleEditPeriod(skeletonData)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                        >
                          Editar
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Esqueletos Existentes</h3>
                      <button
                        onClick={handleStartCreation}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                      >
                        Crear Nuevo Esqueleto
                      </button>
                    </div>
                    {loading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : error ? (
                      <div className="text-red-500 p-4 rounded bg-red-50">
                        {error}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                              </th>
                              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                              </th>
                              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Períodos
                              </th>
                              <th className="px-6 py-3 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {skeletons.map((skeleton) => (
                              <tr key={skeleton._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {skeleton.nombre}
                                </td>
                                <td className="px-6 py-4">
                                  {skeleton.descripcion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {skeleton.periodos?.length || 0} períodos
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() => handleEditPeriod(skeleton)}
                                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                                    >
                                      Editar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {skeletons.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                  No hay esqueletos creados
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : step === 1 ? (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Crear Nuevo Esqueleto</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Esqueleto *
                      </label>
                      <input
                        type="text"
                        value={skeletonData.nombre}
                        onChange={(e) => setSkeletonData({...skeletonData, nombre: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ingrese el nombre del esqueleto"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                      </label>
                      <textarea
                        value={skeletonData.descripcion}
                        onChange={(e) => setSkeletonData({...skeletonData, descripcion: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ingrese una descripción para el esqueleto"
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : step === 2 ? (
                <div className="mt-6">
                  <WeekSelector
                    selectedWeeks={selectedWeeks}
                    onWeekSelect={handleWeekSelect}
                    hoveredWeek={hoveredWeek}
                    onWeekHover={setHoveredWeek}
                    onUpdatePeriodName={handleUpdatePeriodName}
                  />
                </div>
              ) : (
                <div className="mt-6">
                  {selectedWeeks.map((period, index) => (
                    <ExercisePeriod
                      key={index}
                      period={period}
                      onSave={(variants) => handleSaveExercise(index, variants)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={() => step === 1 ? setStep(0) : setStep(step - 1)}
                  className={clsx(
                    "px-4 py-2 rounded",
                    "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                  disabled={step === 0}
                >
                  {step === 1 ? 'Volver a la lista' : 'Anterior'}
                </button>
                <button
                  onClick={step === 3 ? handleSubmit : handleNext}
                  disabled={step === 1 && (!skeletonData.nombre || !skeletonData.descripcion)}
                  className={clsx(
                    "px-4 py-2 rounded",
                    step === 3
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700",
                    (step === 1 && (!skeletonData.nombre || !skeletonData.descripcion)) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {step === 3 ? 'Guardar' : 'Siguiente'}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PopupCrearEsqueleto;