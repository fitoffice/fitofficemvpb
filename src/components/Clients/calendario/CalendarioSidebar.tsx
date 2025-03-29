import React, { useState } from 'react';
import { Filter, Tag, X, Plus, ChevronDown, ChevronRight, Search, Settings, BarChart2, Calendar, Users, User, Clock } from 'lucide-react';
import HorarioNoDisponible from '../HorarioNoDisponible';
import { useTheme } from '../../../contexts/ThemeContext';

interface Subcategoria {
  id: string;
  nombre: string;
}

interface Categoria {
  id: string;
  nombre: string;
  color: string;
  subcategorias?: Subcategoria[];
}

interface CalendarioSidebarProps {
  categorias: Categoria[];
  filtrosActivos: {
    categorias: string[];
    subcategorias: string[];
  };
  onToggleFiltro: (categoriaId: string, subcategoriaId?: string) => void;
  onChangeCalendarType?: (type: 'total' | 'personal' | 'trainer') => void;
}

export default function CalendarioSidebar({
  categorias,
  filtrosActivos,
  onToggleFiltro,
  onChangeCalendarType
}: CalendarioSidebarProps) {
  const { theme } = useTheme();
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<string[]>(
    categorias.map(cat => cat.id)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [calendarType, setCalendarType] = useState<'total' | 'personal' | 'trainer'>('total');
  const [showHorarioModal, setShowHorarioModal] = useState(false);
  const [horariosNoDisponibles, setHorariosNoDisponibles] = useState<any[]>([]);

  const toggleExpansion = (categoriaId: string) => {
    setCategoriasExpandidas(prev =>
      prev.includes(categoriaId)
        ? prev.filter(id => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const handleCalendarTypeChange = (type: 'total' | 'personal' | 'trainer') => {
    setCalendarType(type);
    
    // Obtener las categorías filtradas para este tipo de calendario
    const selectedType = calendarTypes.find(t => t.value === type);
    
    // Si es calendario total, mostrar todas las categorías
    if (type === 'total') {
      // Usar onToggleFiltro con 'reset' para restablecer todos los filtros
      onToggleFiltro('reset');
    } 
    // Si no, filtrar según las categorías permitidas para este tipo
    else if (selectedType && selectedType.filteredCategories.length > 0) {
      // Primero, desactivar todas las categorías
      onToggleFiltro('reset');
      
      // Luego, activar solo las categorías permitidas para este tipo de calendario
      setTimeout(() => {
        selectedType.filteredCategories.forEach(catId => {
          if (!filtrosActivos.categorias.includes(catId)) {
            onToggleFiltro(catId);
          }
        });
      }, 0);
    }
    
    if (onChangeCalendarType) {
      onChangeCalendarType(type);
    }
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.subcategorias?.some(sub =>
      sub.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getEventosCount = (categoriaId: string) => {
    // Reemplazar la simulación con conteo real de eventos
    if (window.calendarEvents) {
      return window.calendarEvents.filter(
        (evento: any) => evento.categoria === categoriaId
      ).length;
    }
    return 0;
  };

  const calendarTypes = [
    {
      value: 'total',
      label: 'Calendario Total',
      icon: Users,
      description: 'Ver todos los calendarios',
      color: 'indigo',
      filteredCategories: [] // Muestra todas las categorías
    },
    {
      value: 'personal',
      label: 'Calendario Personal',
      icon: User,
      description: 'Ver solo mi calendario',
      color: 'emerald',
      filteredCategories: ['TAREA_PROPIA', 'ALARMA', 'GENERAL'] // Solo muestra estas categorías
    },
    {
      value: 'trainer',
      label: 'Calendario Entrenador',
      icon: Calendar,
      description: 'Ver calendario de entrenador',
      color: 'amber',
      filteredCategories: ['CITA_CLIENTE', 'RUTINA_CLIENTE', 'PAGO_CLIENTE', 'ALARMA'] // Solo muestra estas categorías
    }
  ];

  const getCurrentCalendarType = () => {
    return calendarTypes.find(type => type.value === calendarType) || calendarTypes[0];
  };

  const handleSaveHorarios = (horarios: any[]) => {
    setHorariosNoDisponibles(horarios);
    // Aquí puedes guardar los horarios en tu backend
  };

  return (
    <div className={`w-80 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700/60 shadow-gray-900/50' 
        : 'sidebar-gradient border-gray-200/60 shadow-gray-100/50'
    } border-r shadow-lg flex flex-col`}>
      <div className={`p-6 space-y-4 border-b ${
        theme === 'dark' ? 'border-gray-700/60' : 'border-gray-200/60'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 ${
              theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-50'
            } rounded-xl`}>
              <Filter className={`w-5 h-5 ${
                theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
              }`} />
            </div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Filtros</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowStats(!showStats)}
              className={`p-2 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              } rounded-lg transition-colors`}
              title="Mostrar estadísticas"
            >
              <BarChart2 className="w-5 h-5" />
            </button>
            <button 
              className={`p-2 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              } rounded-lg transition-colors`}
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="group">
          <div className="relative w-64">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`w-full flex items-center gap-2 p-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              } rounded-lg border shadow-sm transition-all duration-200`}
            >
              {React.createElement(getCurrentCalendarType().icon, {
                className: `w-4 h-4 text-${getCurrentCalendarType().color}-${theme === 'dark' ? '400' : '600'}`
              })}
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {getCurrentCalendarType().label}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } truncate`}>
                  {getCurrentCalendarType().description}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
              }`} />
            </button>
            
            <div className={`absolute z-10 w-64 mt-1 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-200'
            } rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
              {calendarTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleCalendarTypeChange(type.value as 'total' | 'personal' | 'trainer')}
                  className={`w-full flex items-center gap-2 p-2 ${
                    theme === 'dark'
                      ? calendarType === type.value ? `bg-${type.color}-900/30` : 'hover:bg-gray-600'
                      : calendarType === type.value ? `bg-${type.color}-50` : 'hover:bg-gray-50'
                  } transition-colors ${
                    calendarType === type.value 
                      ? `text-${type.color}-${theme === 'dark' ? '300' : '600'}` 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {React.createElement(type.icon, {
                    className: `w-4 h-4 ${
                      calendarType === type.value 
                        ? `text-${type.color}-${theme === 'dark' ? '300' : '600'}` 
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                    }`
                  })}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">
                      {type.label}
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } truncate`}>
                      {type.description}
                    </p>
                  </div>
                  {calendarType === type.value && (
                    <div className={`w-1.5 h-1.5 rounded-full bg-${type.color}-${theme === 'dark' ? '300' : '600'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {calendarType === 'trainer' && (
          <button
            onClick={() => setShowHorarioModal(true)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
              theme === 'dark'
                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            } rounded-lg transition-colors`}
          >
            <Clock className="w-4 h-4" />
            Gestionar horarios no disponibles
          </button>
        )}

        {showHorarioModal && (
          <HorarioNoDisponible
            onClose={() => setShowHorarioModal(false)}
            onSave={handleSaveHorarios}
            horariosActuales={horariosNoDisponibles}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6">
          {showStats && (
            <div className={`mb-6 p-4 ${
              theme === 'dark'
                ? 'bg-gray-700/50 border-gray-600/60'
                : 'bg-white/50 border-gray-200/60'
            } rounded-xl border`}>
              <h3 className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              } mb-3`}>Resumen de eventos</h3>
              <div className="space-y-2">
                {categorias.map(categoria => (
                  <div key={`stat-${categoria.id}`} className="flex items-center justify-between">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{categoria.nombre}</span>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>{getEventosCount(categoria.id)} eventos</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <h3 className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Categorías</h3>
              </div>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>{filteredCategorias.length} categorías</span>
            </div>
            
            <div className="space-y-2">
              {filteredCategorias.map((categoria) => (
                <div key={categoria.id} className="space-y-1">
                  <div
                    className={`category-item flex items-center gap-3 p-3 rounded-xl ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 hover:shadow-md'
                        : 'hover:bg-white hover:shadow-md'
                    } transition-all duration-200 cursor-pointer group`}
                  >
                    <button
                      onClick={() => toggleExpansion(categoria.id)}
                      className={`p-1 ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-400 hover:text-gray-600'
                      } rounded-lg transition-colors`}
                    >
                      {categoriasExpandidas.includes(categoria.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="checkbox"
                      checked={filtrosActivos.categorias.includes(categoria.id)}
                      onChange={() => onToggleFiltro(categoria.id)}
                      className="custom-checkbox"
                    />
                    <span className={`flex-1 text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-gray-300 group-hover:text-gray-200'
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {categoria.nombre}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>{getEventosCount(categoria.id)}</span>
                      <span
                        className="w-3 h-3 rounded-full ring-2 ring-offset-2 transition-all duration-200"
                        style={{ 
                          backgroundColor: categoria.color,
                          ringColor: categoria.color 
                        }}
                      />
                    </div>
                  </div>
                  {categoriasExpandidas.includes(categoria.id) && (
                    <div className="ml-8 space-y-3 mt-2">
                      {/* Lista de eventos de esta categoría */}
                      <div className={`p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        {window.calendarEvents && window.calendarEvents.filter(
                          (evento: any) => evento.categoria === categoria.id
                        ).length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {window.calendarEvents.filter(
                              (evento: any) => evento.categoria === categoria.id
                            ).map((evento: any) => (
                              <div 
                                key={evento.id}
                                className={`p-2 rounded-lg text-sm ${
                                  theme === 'dark' 
                                    ? 'bg-gray-800 hover:bg-gray-750' 
                                    : 'bg-white hover:bg-gray-100'
                                } shadow-sm hover:shadow transition-all duration-200 cursor-pointer`}
                                onClick={() => window.selectCalendarEvent && window.selectCalendarEvent(evento)}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: categoria.color }}
                                  />
                                  <span className={`font-medium ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                  } truncate`}>
                                    {evento.title}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <Clock className={`w-3 h-3 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                  }`} />
                                  <span className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {new Date(evento.start).toLocaleString('es', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`text-center py-3 text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            No hay eventos en esta categoría
                          </div>
                        )}
                      </div>
                      
                      {/* Subcategorías si existen */}
                      {categoria.subcategorias && categoria.subcategorias.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {categoria.subcategorias.map((subcategoria) => (
                            <label
                              key={subcategoria.id}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-700/50'
                                  : 'hover:bg-white/50'
                              } transition-all duration-200 cursor-pointer group`}
                            >
                              <input
                                type="checkbox"
                                checked={filtrosActivos.subcategorias.includes(subcategoria.id)}
                                onChange={() => onToggleFiltro(categoria.id, subcategoria.id)}
                                className="custom-checkbox"
                              />
                              <span className={`flex-1 text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400 group-hover:text-gray-300'
                                  : 'text-gray-600 group-hover:text-gray-800'
                              }`}>
                                {subcategoria.nombre}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200/60 bg-white/50">
        <button 
          onClick={() => {
            const allCategories = categorias.map(cat => cat.id);
            const allSubcategories = categorias.flatMap(cat => cat.subcategorias?.map(sub => sub.id) || []);
            onToggleFiltro('reset');
          }}
          className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-gray-200/60"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}