import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Calendar,
  Target,
  Clock,
  FileText,
  ChevronRight,
  Plus,
  Edit2,
  Activity,
  UtensilsCrossed,
  StickyNote
} from 'lucide-react';
import Button from '../Common/Button';

interface Comida {
  nombre: string;
  horario: string;
  alimentos: {
    nombre: string;
    cantidad: string;
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  }[];
}

interface DietaHoy {
  fecha: string;
  comidas: Comida[];
  totalCalorias: number;
  totalProteinas: number;
  totalCarbohidratos: number;
  totalGrasas: number;
}

interface PlanDieta {
  nombre: string;
  meta: string;
  fechaInicio: string;
  fechaFin: string;
  duracionSemanas: number;
  semanasCompletadas: number;
  dietaHoy: DietaHoy;
  notas: string[];
}

interface PanelDietasProps {
  clienteId: string;
  dietDetails: {
    nombre: string;
    objetivo: string;
    restricciones: string;
    estado: string;
    fechaInicio: string;
    semanas: any[];
    dietaHoy?: DietaHoy;
    notas?: string[];
  };
}

const PanelDietas: React.FC<PanelDietasProps> = ({ clienteId, dietDetails }) => {
  const { theme } = useTheme();
  const [nuevaNota, setNuevaNota] = useState('');
  const [notas, setNotas] = useState<string[]>(dietDetails.notas || []);
  
  const calcularProgreso = () => {
    const semanasCompletadas = dietDetails.semanas.filter(semana => {
      return true;
    }).length;
    return (semanasCompletadas / dietDetails.semanas.length) * 100;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const agregarNota = () => {
    if (nuevaNota.trim()) {
      setNotas([...notas, nuevaNota.trim()]);
      setNuevaNota('');
    }
  };

  return (
    <div className={`
      rounded-xl border-2
      ${theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700/50' 
        : 'bg-white/50 border-gray-200/50'}
      shadow-xl hover:shadow-2xl
      transition-all duration-500 ease-in-out
      backdrop-blur-sm
      overflow-hidden
    `}>
      {/* Encabezado del Plan */}
      <div className="p-8 border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <h2 className={`
              text-3xl font-bold 
              ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
              bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent
            `}>
              {dietDetails.nombre}
            </h2>
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500 animate-pulse" />
              <p className={`
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                text-lg
              `}>
                {dietDetails.objetivo}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Editar plan')}
            className="
              transform hover:scale-105 active:scale-95
              transition-all duration-300 ease-in-out
              bg-gradient-to-r from-blue-500/10 to-purple-500/10
              hover:from-blue-500/20 hover:to-purple-500/20
              rounded-xl px-4 py-2
            "
          >
            <Edit2 size={16} className="mr-2" />
            Editar Plan
          </Button>
        </div>

        {/* Barra de Progreso */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Progreso del Plan
            </span>
            <span className={`
              text-sm font-medium px-3 py-1 rounded-full
              ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}
            `}>
              {dietDetails.semanas.length} semanas
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${calcularProgreso()}%` }}
            />
          </div>
        </div>

        {/* Duración */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="
            p-4 rounded-xl
            ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}
            backdrop-blur-sm
            transform hover:scale-105
            transition-all duration-300 ease-in-out
          ">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-green-500" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Fecha de inicio
                </p>
                <p className={`font-medium text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {formatearFecha(dietDetails.fechaInicio)}
                </p>
              </div>
            </div>
          </div>
          <div className="
            p-4 rounded-xl
            ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}
            backdrop-blur-sm
            transform hover:scale-105
            transition-all duration-300 ease-in-out
          ">
            <div className="flex items-center">
              <Activity className="w-6 h-6 mr-3 text-red-500" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Estado
                </p>
                <p className={`
                  font-medium text-lg
                  ${dietDetails.estado === 'Activo'
                    ? 'text-green-500'
                    : 'text-red-500'}
                `}>
                  {dietDetails.estado}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restricciones */}
      <div className="p-8 border-b border-gray-200/20 dark:border-gray-700/20">
        <h3 className={`
          text-xl font-semibold mb-4
          ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
          flex items-center
        `}>
          <div className="
            w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mr-3
            transform rotate-3
          ">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
          Restricciones
        </h3>
        <p className={`
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
          p-4 rounded-xl
          ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}
          backdrop-blur-sm
          leading-relaxed
        `}>
          {dietDetails.restricciones}
        </p>
      </div>

      {/* Dieta de Hoy */}
      <div className="p-8 border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`
            text-xl font-semibold
            ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
            flex items-center
          `}>
            <div className="
              w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mr-3
              transform -rotate-3
            ">
              <UtensilsCrossed className="w-5 h-5 text-amber-500" />
            </div>
            Dieta de Hoy
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Editar dieta de hoy')}
            className="
              transform hover:scale-105 active:scale-95
              transition-all duration-300 ease-in-out
              bg-gradient-to-r from-amber-500/10 to-orange-500/10
              hover:from-amber-500/20 hover:to-orange-500/20
              rounded-xl px-4 py-2
            "
          >
            <Edit2 size={16} className="mr-2" />
            Editar
          </Button>
        </div>

        {dietDetails.dietaHoy ? (
          <div className="space-y-6">
            {dietDetails.dietaHoy.comidas.map((comida, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-xl
                  ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}
                  backdrop-blur-sm
                  transform hover:scale-[1.02]
                  transition-all duration-300 ease-in-out
                  border-2 border-transparent hover:border-amber-500/20
                  group
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`
                    text-lg font-medium
                    ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
                    group-hover:text-amber-500
                    transition-colors duration-300
                  `}>
                    {comida.nombre}
                  </h4>
                  <span className={`
                    text-sm px-3 py-1 rounded-full
                    ${theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-amber-100 text-amber-600'}
                  `}>
                    {comida.horario}
                  </span>
                </div>
                <div className="space-y-3">
                  {comida.alimentos.map((alimento, idx) => (
                    <div
                      key={idx}
                      className="
                        flex justify-between items-center p-3 rounded-lg
                        ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}
                        hover:bg-amber-500/5
                        transition-all duration-300
                      "
                    >
                      <div className="flex-1">
                        <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {alimento.nombre}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {alimento.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}
                        `}>
                          {alimento.calorias} kcal
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          P: {alimento.proteinas}g | C: {alimento.carbohidratos}g | G: {alimento.grasas}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Totales del día */}
            <div className={`
              mt-6 p-6 rounded-xl
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
              transform hover:scale-[1.02]
              transition-all duration-300 ease-in-out
              border-2 border-transparent hover:border-amber-500/20
            `}>
              <h4 className={`font-medium mb-4 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Totales del Día
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}
                  text-center
                ">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Calorías
                  </p>
                  <p className={`
                    font-medium text-xl mt-1
                    ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}
                  `}>
                    {dietDetails.dietaHoy.totalCalorias}
                    <span className="text-sm ml-1">kcal</span>
                  </p>
                </div>
                <div className="
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}
                  text-center
                ">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Proteínas
                  </p>
                  <p className={`
                    font-medium text-xl mt-1
                    ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
                  `}>
                    {dietDetails.dietaHoy.totalProteinas}
                    <span className="text-sm ml-1">g</span>
                  </p>
                </div>
                <div className="
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}
                  text-center
                ">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Carbohidratos
                  </p>
                  <p className={`
                    font-medium text-xl mt-1
                    ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}
                  `}>
                    {dietDetails.dietaHoy.totalCarbohidratos}
                    <span className="text-sm ml-1">g</span>
                  </p>
                </div>
                <div className="
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}
                  text-center
                ">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Grasas
                  </p>
                  <p className={`
                    font-medium text-xl mt-1
                    ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}
                  `}>
                    {dietDetails.dietaHoy.totalGrasas}
                    <span className="text-sm ml-1">g</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`
            text-center py-12
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
            animate-pulse
          `}>
            No hay dieta programada para hoy
          </div>
        )}
      </div>

      {/* Notas */}
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`
            text-xl font-semibold
            ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
            flex items-center
          `}>
            <div className="
              w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3
              transform rotate-3
            ">
              <StickyNote className="w-5 h-5 text-yellow-500" />
            </div>
            Notas
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              placeholder="Agregar una nota..."
              className={`
                flex-1 p-4 rounded-xl border-2
                ${theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white'
                  : 'bg-white/50 border-gray-200 text-gray-800'}
                focus:outline-none focus:ring-2 focus:ring-yellow-500/50
                focus:border-yellow-500
                placeholder-gray-400
                transition-all duration-300
              `}
              onKeyPress={(e) => e.key === 'Enter' && agregarNota()}
            />
            <Button
              variant="secondary"
              onClick={agregarNota}
              disabled={!nuevaNota.trim()}
              className="
                transform hover:scale-105 active:scale-95
                transition-all duration-300 ease-in-out
                bg-gradient-to-r from-yellow-500/10 to-amber-500/10
                hover:from-yellow-500/20 hover:to-amber-500/20
                disabled:opacity-50
                rounded-xl px-4
              "
            >
              <Plus size={24} />
            </Button>
          </div>

          {notas.length > 0 ? (
            <div className="space-y-3">
              {notas.map((nota, index) => (
                <div
                  key={index}
                  className={`
                    p-4 rounded-xl
                    ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}
                    backdrop-blur-sm
                    transform hover:scale-[1.02]
                    transition-all duration-300 ease-in-out
                    border-2 border-transparent hover:border-yellow-500/20
                  `}
                >
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {nota}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className={`
              text-center py-8
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              animate-pulse
            `}>
              No hay notas registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelDietas;
