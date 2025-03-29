import React, { useState } from 'react';
import { Clock, X, Calendar, Check, Repeat, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface HorarioNoDisponible {
  repetir: 'una-vez' | 'semanal' | 'diario';
  fecha?: string; // Para una-vez
  dia?: string;   // Para diario
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

interface HorarioNoDisponibleProps {
  onClose: () => void;
  onSave: (horarios: HorarioNoDisponible[]) => void;
  horariosActuales?: HorarioNoDisponible[];
}

const diasSemana = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

export default function HorarioNoDisponible({ onClose, onSave, horariosActuales = [] }: HorarioNoDisponibleProps) {
  const [horarios, setHorarios] = useState<HorarioNoDisponible[]>(horariosActuales);
  const [nuevoHorario, setNuevoHorario] = useState<HorarioNoDisponible>({
    repetir: 'semanal',
    horaInicio: '09:00',
    horaFin: '10:00',
    disponible: false
  });
  const [error, setError] = useState('');

  const handleRepetirChange = (tipo: 'una-vez' | 'semanal' | 'diario') => {
    const horarioBase = {
      horaInicio: nuevoHorario.horaInicio,
      horaFin: nuevoHorario.horaFin,
      disponible: nuevoHorario.disponible,
      repetir: tipo
    };

    if (tipo === 'una-vez') {
      const hoy = new Date().toISOString().split('T')[0];
      setNuevoHorario({ ...horarioBase, fecha: hoy });
    } else if (tipo === 'diario') {
      setNuevoHorario({ ...horarioBase, dia: 'Lunes' });
    } else {
      setNuevoHorario(horarioBase);
    }
  };

  const handleAgregarHorario = () => {
    if (nuevoHorario.horaInicio >= nuevoHorario.horaFin) {
      setError('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    const horariosSuperpuestos = horarios.some(h => {
      if (nuevoHorario.repetir === 'una-vez' && h.repetir === 'una-vez') {
        return h.fecha === nuevoHorario.fecha &&
          ((nuevoHorario.horaInicio >= h.horaInicio && nuevoHorario.horaInicio < h.horaFin) ||
           (nuevoHorario.horaFin > h.horaInicio && nuevoHorario.horaFin <= h.horaFin));
      } else if (nuevoHorario.repetir === 'diario' && h.repetir === 'diario') {
        return h.dia === nuevoHorario.dia &&
          ((nuevoHorario.horaInicio >= h.horaInicio && nuevoHorario.horaInicio < h.horaFin) ||
           (nuevoHorario.horaFin > h.horaInicio && nuevoHorario.horaFin <= h.horaFin));
      }
      return false;
    });

    if (horariosSuperpuestos) {
      setError('Este horario se superpone con otro ya existente');
      return;
    }

    setError('');
    setHorarios([...horarios, nuevoHorario]);
    
    // Resetear el formulario manteniendo el tipo de repetición
    const tipo = nuevoHorario.repetir;
    handleRepetirChange(tipo);
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Horario No Disponible
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Selector de disponibilidad */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setNuevoHorario({ ...nuevoHorario, disponible: true })}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  nuevoHorario.disponible
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Disponible
              </button>
              <button
                onClick={() => setNuevoHorario({ ...nuevoHorario, disponible: false })}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  !nuevoHorario.disponible
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <XCircle className="w-4 h-4" />
                No Disponible
              </button>
            </div>

            {/* Selector de repetición */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              {(['una-vez', 'semanal', 'diario'] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => handleRepetirChange(tipo)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    nuevoHorario.repetir === tipo
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tipo === 'una-vez' ? 'Una vez' : tipo === 'semanal' ? 'Semanal' : 'Diario'}
                </button>
              ))}
            </div>

            {/* Campo de fecha o día según el tipo de repetición */}
            {nuevoHorario.repetir === 'una-vez' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={nuevoHorario.fecha}
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, fecha: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ) : nuevoHorario.repetir === 'diario' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Día de la semana
                </label>
                <select
                  value={nuevoHorario.dia}
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, dia: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {diasSemana.map((dia) => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* Selectores de hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="time"
                  value={nuevoHorario.horaInicio}
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaInicio: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="time"
                  value={nuevoHorario.horaFin}
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaFin: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Botón agregar */}
            <button
              onClick={handleAgregarHorario}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Agregar horario
            </button>
          </div>

          {/* Lista de horarios */}
          {horarios.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Horarios configurados:</h3>
              <div className="space-y-2">
                {horarios.map((horario, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        horario.disponible ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {horario.disponible ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {horario.repetir === 'una-vez' ? formatFecha(horario.fecha!) :
                           horario.repetir === 'semanal' ? 'Cada semana' :
                           horario.dia}, {horario.horaInicio} - {horario.horaFin}
                        </p>
                        <p className="text-xs text-gray-500">
                          {horario.repetir === 'una-vez' ? 'Una vez' :
                           horario.repetir === 'semanal' ? 'Se repite cada semana' :
                           'Se repite todos los días'} • {horario.disponible ? 'Disponible' : 'No disponible'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setHorarios(horarios.filter((_, i) => i !== index))}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave(horarios);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
