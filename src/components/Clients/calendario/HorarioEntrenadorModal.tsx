import React, { useState, useEffect } from 'react';
import { X, Clock, Save, Plus, Trash, Calendar } from 'lucide-react';
interface HorarioEntrenadorModal {
  onClose: () => void;
}

interface HorarioTurno {
  inicio: string;
  fin: string;
}

interface HorarioDia {
  turnos: HorarioTurno[];
  activo: boolean;
}

interface HorarioEspecial {
  fecha: string;
  turnos: HorarioTurno[];
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


export default function HorarioEntrenadorModal({ onClose }: HorarioEntrenadorModal) {
  const [horarios, setHorarios] = useState<Record<string, HorarioDia>>({
    Lunes: { turnos: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }], activo: true },
    Martes: { turnos: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }], activo: true },
    Miércoles: { turnos: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }], activo: true },
    Jueves: { turnos: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }], activo: true },
    Viernes: { turnos: [{ inicio: '09:00', fin: '13:00' }, { inicio: '16:00', fin: '20:00' }], activo: true },
    Sábado: { turnos: [{ inicio: '10:00', fin: '14:00' }], activo: true },
    Domingo: { turnos: [], activo: false }
  });


  const [diasEspeciales, setDiasEspeciales] = useState<HorarioEspecial[]>([]);
  const [activeTab, setActiveTab] = useState<'regular' | 'especial'>('regular');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  
   useEffect(() => {
    const fetchHorarios = async () => {
      try {
        setIsFetching(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No se encontró el token de autenticación');
          setIsFetching(false);
          return;
        }
        
        // Make the API request
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/horarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los horarios');
        }
        
        const result = await response.json();
        console.log('Horarios obtenidos:', result);
        
        // Update state with fetched data if available
        if (result.data) {
          if (result.data.horarios) {
            setHorarios(result.data.horarios);
          }
          
          if (result.data.diasEspeciales) {
            setDiasEspeciales(result.data.diasEspeciales);
          }
          
          // Store the schedule ID if it exists
          if (result.data._id) {
            setScheduleId(result.data._id);
            console.log('Schedule ID found:', result.data._id);
          }
        } else if (result._id) {
          // Alternative structure - directly in result
          if (result.horarios) {
            setHorarios(result.horarios);
          }
          
          if (result.diasEspeciales) {
            setDiasEspeciales(result.diasEspeciales);
          }
          
          setScheduleId(result._id);
          console.log('Schedule ID found (alt):', result._id);
        }
        
      } catch (err) {
        console.error('Error al obtener horarios:', err);
        setError(err instanceof Error ? err.message : 'Error al obtener los horarios');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchHorarios();
  }, []);
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró el token de autenticación');
        return;
      }
      
      // Prepare data in the required format
      const data = {
        horarios,
        diasEspeciales
      };
      
      console.log('Schedule ID before request:', scheduleId);
      
      // Determine if we're updating or creating
      // Always use PUT if we have a scheduleId
      const method = scheduleId ? 'PUT' : 'POST';
      const url = scheduleId 
        ? `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/horarios/${scheduleId}`
        : 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/horarios';
      
      console.log(`Making ${method} request to ${url}`);
      
      // Make the API request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${scheduleId ? 'actualizar' : 'guardar'} los horarios`);
      }
      
      const result = await response.json();
      console.log(`Horarios ${scheduleId ? 'actualizados' : 'guardados'}:`, result);
      
      setSuccess(true);
      
      // Close the modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error(`Error al ${scheduleId ? 'actualizar' : 'guardar'} horarios:`, err);
      setError(err instanceof Error ? err.message : `Error al ${scheduleId ? 'actualizar' : 'guardar'} los horarios`);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleHorarioChange = (dia: string, turnoIndex: number, tipo: 'inicio' | 'fin', valor: string) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        turnos: prev[dia].turnos.map((turno, index) => 
          index === turnoIndex ? { ...turno, [tipo]: valor } : turno
        )
      }
    }));
  };

  const agregarTurno = (dia: string) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        turnos: [...prev[dia].turnos, { inicio: '09:00', fin: '13:00' }]
      }
    }));
  };

  const eliminarTurno = (dia: string, turnoIndex: number) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        turnos: prev[dia].turnos.filter((_, index) => index !== turnoIndex)
      }
    }));
  };

  const toggleDiaActivo = (dia: string) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        activo: !prev[dia].activo
      }
    }));
  };

  const agregarDiaEspecial = () => {
    const fecha = new Date().toISOString().split('T')[0];
    setDiasEspeciales(prev => [...prev, {
      fecha,
      turnos: [{ inicio: '09:00', fin: '13:00' }]
    }]);
  };

  const eliminarDiaEspecial = (index: number) => {
    setDiasEspeciales(prev => prev.filter((_, i) => i !== index));
  };

  const handleDiaEspecialChange = (diaIndex: number, turnoIndex: number, tipo: 'inicio' | 'fin' | 'fecha', valor: string) => {
    setDiasEspeciales(prev => prev.map((dia, index) => {
      if (index !== diaIndex) return dia;
      if (tipo === 'fecha') return { ...dia, fecha: valor };
      return {
        ...dia,
        turnos: dia.turnos.map((turno, tIndex) =>
          tIndex === turnoIndex ? { ...turno, [tipo]: valor } : turno
        )
      };
    }));
  };

  const agregarTurnoEspecial = (diaIndex: number) => {
    setDiasEspeciales(prev => prev.map((dia, index) => {
      if (index !== diaIndex) return dia;
      return {
        ...dia,
        turnos: [...dia.turnos, { inicio: '09:00', fin: '13:00' }]
      };
    }));
  };

  const eliminarTurnoEspecial = (diaIndex: number, turnoIndex: number) => {
    setDiasEspeciales(prev => prev.map((dia, index) => {
      if (index !== diaIndex) return dia;
      return {
        ...dia,
        turnos: dia.turnos.filter((_, tIndex) => tIndex !== turnoIndex)
      };
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Horario del Entrenador</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="relative flex bg-gradient-to-r from-indigo-50 to-blue-50 p-1.5 rounded-2xl shadow-inner">
              <div 
                className="absolute transition-all duration-300 ease-out bg-white rounded-xl shadow-md"
                style={{
                  width: '50%',
                  height: 'calc(100% - 0.75rem)',
                  top: '0.375rem',
                  left: activeTab === 'regular' ? '0.375rem' : '50%',
                  transform: activeTab === 'especial' ? 'translateX(-0.375rem)' : 'none',
                  zIndex: 0
                }}
              />
              <button
                onClick={() => setActiveTab('regular')}
                className={`relative z-10 flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'regular'
                    ? 'text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className={`w-4 h-4 ${activeTab === 'regular' ? 'text-indigo-600' : 'text-gray-500'}`} />
                Horario Regular
              </button>
              <button
                onClick={() => setActiveTab('especial')}
                className={`relative z-10 flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'especial'
                    ? 'text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className={`w-4 h-4 ${activeTab === 'especial' ? 'text-indigo-600' : 'text-gray-500'}`} />
                Días Especiales
              </button>
            </div>


            {/* Tab Content */}
            {activeTab === 'regular' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    Horario Regular
                  </h3>
                </div>
                <div className="grid gap-6">
                  {diasSemana.map((dia) => (
                    <div 
                      key={dia} 
                      className={`group relative overflow-hidden p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                        horarios[dia].activo 
                          ? 'bg-white shadow-lg border border-indigo-100 hover:shadow-xl' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <input
                              type="checkbox"
                              id={`dia-${dia}`}
                              checked={horarios[dia].activo}
                              onChange={() => toggleDiaActivo(dia)}
                              className="sr-only peer"
                            />
                            <label 
                              htmlFor={`dia-${dia}`}
                              className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-300 p-1 peer-checked:bg-indigo-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 transition-all duration-300"
                            >
                              <div className="h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-5"></div>
                            </label>
                          </div>
                          <span className={`font-medium text-lg transition-colors duration-200 ${
                            horarios[dia].activo ? 'text-indigo-700' : 'text-gray-500'
                          }`}>
                            {dia}
                          </span>
                        </div>
                        {horarios[dia].activo && (
                          <button
                            onClick={() => agregarTurno(dia)}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all duration-200 hover:scale-110"
                            title="Agregar turno"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      
                      {horarios[dia].activo && (
                        <div className="space-y-4 pl-16 mt-4">
                          {horarios[dia].turnos.map((turno, turnoIndex) => (
                            <div 
                              key={turnoIndex} 
                              className="grid grid-cols-[1fr,1fr,auto] gap-4 items-center bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <div className="relative group/input">
                                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover/input:text-indigo-500 transition-colors duration-200" />
                                <input
                                  type="time"
                                  value={turno.inicio}
                                  onChange={(e) => handleHorarioChange(dia, turnoIndex, 'inicio', e.target.value)}
                                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white hover:border-indigo-300 transition-all duration-200"
                                />
                                <span className="absolute -top-2 left-10 text-xs text-gray-500 bg-white px-1">Inicio</span>
                              </div>
                              <div className="relative group/input">
                                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover/input:text-indigo-500 transition-colors duration-200" />
                                <input
                                  type="time"
                                  value={turno.fin}
                                  onChange={(e) => handleHorarioChange(dia, turnoIndex, 'fin', e.target.value)}
                                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white hover:border-indigo-300 transition-all duration-200"
                                />
                                <span className="absolute -top-2 left-10 text-xs text-gray-500 bg-white px-1">Fin</span>
                              </div>
                              {horarios[dia].turnos.length > 1 && (
                                <button
                                  onClick={() => eliminarTurno(dia, turnoIndex)}
                                  className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:rotate-12"
                                  title="Eliminar turno"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            
            {activeTab === 'especial' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    Días Especiales
                  </h3>
                  <button
                    onClick={agregarDiaEspecial}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar día especial</span>
                  </button>
                </div>

                {diasEspeciales.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center mb-4">No hay días especiales configurados</p>
                    <button
                      onClick={agregarDiaEspecial}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar primer día especial</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {diasEspeciales.map((dia, diaIndex) => (
                      <div key={diaIndex} className="space-y-4 p-5 rounded-xl bg-white shadow-sm border border-indigo-100">
                        <div className="flex items-center justify-between">
                          <div className="relative flex-1 max-w-xs">
                            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="date"
                              value={dia.fecha}
                              onChange={(e) => handleDiaEspecialChange(diaIndex, 0, 'fecha', e.target.value)}
                              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => agregarTurnoEspecial(diaIndex)}
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                              title="Agregar turno"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => eliminarDiaEspecial(diaIndex)}
                              className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                              title="Eliminar día especial"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 pl-10">
                          {dia.turnos.map((turno, turnoIndex) => (
                            <div key={turnoIndex} className="grid grid-cols-[1fr,1fr,auto] gap-4 items-center bg-gray-50 p-3 rounded-lg">
                              <div className="relative">
                                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                  type="time"
                                  value={turno.inicio}
                                  onChange={(e) => handleDiaEspecialChange(diaIndex, turnoIndex, 'inicio', e.target.value)}
                                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                />
                              </div>
                              <div className="relative">
                                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                  type="time"
                                  value={turno.fin}
                                  onChange={(e) => handleDiaEspecialChange(diaIndex, turnoIndex, 'fin', e.target.value)}
                                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                />
                              </div>
                              {dia.turnos.length > 1 && (
                                <button
                                  onClick={() => eliminarTurnoEspecial(diaIndex, turnoIndex)}
                                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Eliminar turno"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="w-4 h-4" />
              {scheduleId ? 'Actualizar Horario' : 'Guardar Horario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}