import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

interface EditPlanningPageCalendarioProps {
  weeks: WeekPlan[];
  semanaActual: number;
  setSemanaActual: (semana: number) => void;
  onAddWeek: () => void;
  planningId: string;
}

interface WeekPlan {
  _id: string;
  weekNumber: number;
  startDate: string;
  days: { [key: string]: DayPlan };
}

interface DayPlan {
  _id: string;
  day: string;
  fecha: string;
  sessions: Session[];
}

interface Session {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: Array<{
    id: string;
    reps: number;
    weight?: number;
    rest?: number;
  }>;
}

const EditPlanningPageCalendario: React.FC<EditPlanningPageCalendarioProps> = ({
  weeks = [],
  semanaActual,
  setSemanaActual,
  onAddWeek,
  planningId,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    const handleWeekChange = (event: CustomEvent) => {
      const { weekNumber, action } = event.detail;
      
      if (weekNumber !== undefined) {
        // Ir a una semana específica
        if (weekNumber > 0 && weekNumber <= weeks.length) {
          setSemanaActual(weekNumber);
        }
      } else if (action === 'next') {
        // Ir a la siguiente semana
        cambiarSemana('siguiente');
      } else if (action === 'previous') {
        // Ir a la semana anterior
        cambiarSemana('anterior');
      }
    };

    const handleWeeksList = () => {
      if (weeks && weeks.length > 0) {
        const weeksList = weeks.map(week => {
          const fechas = getFechasRango(week.startDate);
          return `Semana ${week.weekNumber}: ${fechas}`;
        }).join('\n');
        
        const event = new CustomEvent('assistantResponse', { 
          detail: { 
            message: `Lista de semanas disponibles:\n${weeksList}` 
          }
        });
        window.dispatchEvent(event);
      } else {
        const event = new CustomEvent('assistantResponse', { 
          detail: { 
            message: 'No hay semanas disponibles en la planificación.' 
          }
        });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('changeWeek', handleWeekChange as EventListener);
    window.addEventListener('requestWeeksList', handleWeeksList as EventListener);

    return () => {
      window.removeEventListener('changeWeek', handleWeekChange as EventListener);
      window.removeEventListener('requestWeeksList', handleWeeksList as EventListener);
    };
  }, [weeks, setSemanaActual]);

  const cambiarSemana = (direccion: 'anterior' | 'siguiente') => {
    if (!weeks) return;

    const currentIndex = weeks.findIndex((week) => week.weekNumber === semanaActual);
    if (direccion === 'anterior') {
      if (currentIndex > 0) {
        setSemanaActual(weeks[currentIndex - 1].weekNumber);
      }
    } else {
      if (currentIndex < weeks.length - 1) {
        setSemanaActual(weeks[currentIndex + 1].weekNumber);
      }
    }
  };

  const getFechasRango = (startDate: string) => {
    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 6);

    return `${fechaInicio.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })} - ${fechaFin.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  };

  const addWeekToPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      
      console.log('Request config:', config);
      console.log('Request URL:', `${API_URL}/plannings/${planningId}/anadirsemanasiguiente`);
      
      const response = await axios.post(
        `${API_URL}/plannings/${planningId}/anadirsemanasiguiente`,
        {},
        config,
      );
      

      return response.data;
    } catch (error) {
      console.error('Error adding week to plan:', error);
      throw error;
    }
  };

  const handleAddWeek = async () => {
    await addWeekToPlan();
    onAddWeek();
  };

  return (
    <div
      className={`p-8 rounded-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900'
          : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700'
      } shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] relative overflow-hidden transition-all duration-700 ease-in-out transform ${
        isHovered ? 'scale-[1.02] translate-y-[-5px]' : ''
      } hover:shadow-[0_30px_60px_rgba(8,_112,_184,_0.8)]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 text-white">
          <button
            onClick={() => cambiarSemana('anterior')}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 transform hover:scale-110 hover:rotate-[-5deg] active:scale-95 disabled:opacity-50 disabled:pointer-events-none backdrop-blur-sm"
            disabled={semanaActual === 1}
          >
            <ChevronLeft className="w-6 h-6 animate-pulse" />
          </button>
          <div className="flex items-center space-x-4 transform transition-all duration-500 hover:scale-105">
            <Calendar className="w-8 h-8 animate-bounce hover:text-blue-300 transition-colors duration-300" />
            <h2 className="text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Semana {semanaActual} de {weeks.length}
            </h2>
          </div>
          <button
            onClick={() => cambiarSemana('siguiente')}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 transform hover:scale-110 hover:rotate-[5deg] active:scale-95 disabled:opacity-50 disabled:pointer-events-none backdrop-blur-sm"
            disabled={semanaActual === weeks.length}
          >
            <ChevronRight className="w-6 h-6 animate-pulse" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          {weeks.map((week) => (
            <button
              key={week._id}
              onClick={() => setSemanaActual(week.weekNumber)}
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                semanaActual === week.weekNumber
                  ? `${theme === 'dark' 
                      ? 'bg-indigo-600/80' 
                      : 'bg-white/20'} 
                     shadow-lg transform scale-105`
                  : `${theme === 'dark' 
                      ? 'bg-gray-700/50' 
                      : 'bg-white/10'} 
                     hover:bg-white/20`
              } backdrop-blur-sm`}
            >
              <div className="p-4 text-white">
                <div className="text-lg font-semibold">Semana {week.weekNumber}</div>
                <div className="text-sm mt-1 opacity-80">{getFechasRango(week.startDate)}</div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </button>
          ))}
          <button
            onClick={handleAddWeek}
            className="group relative overflow-hidden rounded-xl transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          >
            <div className="p-4 text-white flex flex-col items-center justify-center h-full">
              <Plus className="w-6 h-6 mb-2 transition-transform duration-300 group-hover:rotate-180" />
              <span className="font-semibold">Añadir Semana</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </button>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default EditPlanningPageCalendario;