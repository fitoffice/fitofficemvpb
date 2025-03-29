import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, SlotInfo, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, setHours, setMinutes, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import CalendarioHeader from '../../components/Clients/calendario/CalendarioHeader';
import CalendarioSidebar from '../../components/Clients/calendario/CalendarioSidebar';
import EventoModal from '../../components/Clients/calendario/EventoModal';
import NuevoEventoModal from '../../components/Clients/calendario/NuevoEventoModal';
import HorarioEntrenadorModal from '../../components/Clients/calendario/HorarioEntrenadorModal';
import { useTheme } from '../../contexts/ThemeContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es }
});

interface Evento {
  id: string;
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  color?: string;
  categoria?: string;
  subcategoria?: string;
  cliente?: string;
  ubicacion?: string;
  recordatorios?: string[];
  notas?: string;
}

interface Categoria {
  id: string;
  nombre: string;
  color: string;
  subcategorias?: Array<{ id: string; nombre: string }>;
}

const CATEGORIAS: Categoria[] = [
  {
    id: 'TAREA_PROPIA',
    nombre: 'Tarea Propia',
    color: '#2563EB', // Bright Blue
    subcategorias: []
  },
  {
    id: 'CITA_CON_CLIENTE',
    nombre: 'Cita con Cliente',
    color: '#16A34A', // Green
    subcategorias: []
  },
  {
    id: 'RUTINA_CLIENTE',
    nombre: 'Rutina de Cliente',
    color: '#DC2626', // Red
    subcategorias: []
  },
  {
    id: 'PAGO_CLIENTE',
    nombre: 'Pago de Cliente',
    color: '#9333EA', // Purple
    subcategorias: []
  },
  {
    id: 'ALARMA',
    nombre: 'Alarma',
    color: '#EAB308', // Yellow
    subcategorias: []
  },
  {
    id: 'GENERAL',
    nombre: 'General',
    color: '#64748B', // Slate
    subcategorias: []
  }
];

export default function CalendarioLista() {
  const { theme } = useTheme();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showEntrenadorModal, setShowEntrenadorModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [filtrosActivos, setFiltrosActivos] = useState({
    categorias: CATEGORIAS.map(cat => cat.id),
    subcategorias: CATEGORIAS.flatMap(cat => cat.subcategorias?.map(sub => sub.id) || [])
  });
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarType, setCalendarType] = useState<'total' | 'personal' | 'trainer'>('total');

  // Función para mapear los datos de la API al formato del frontend
  const mapearEventos = (eventos: any[]): Evento[] => {
    console.log("Datos crudos de la API:", eventos);
    return eventos.map(evento => {
      // Usar startDate o date según lo que esté disponible
      const start = new Date(evento.startDate || evento.date);
      const end = evento.endDate ? new Date(evento.endDate) : new Date(start.getTime() + 60 * 60 * 1000); // 1 hora por defecto

      console.log(`Mapeando evento: ${evento.title || evento.name}`);
      console.log(`Start: ${start}, End: ${end}`);

      return {
        id: evento._id,
        title: evento.title || evento.name,
        start: start,
        end: end,
        descripcion: evento.description || evento.type,
        color: CATEGORIAS.find(cat => cat.id === evento.type)?.color || '#4F46E5',
        categoria: evento.type,
        subcategoria: '',
        cliente: evento.client ? `${evento.client.email}` : 'N/A',
        ubicacion: 'Ubicación por Defecto',
        recordatorios: evento.alerts?.map((alert: any) => `${alert.timeBeforeEvent} minutos antes`) || [],
        notas: evento.description || 'Sin notas'
      };
    });
  };

  useEffect(() => {
    const fetchEventos = async () => {
      const token = localStorage.getItem('token');
      console.log("Token obtenido de localStorage:", token);

      if (!token) {
        setError('No se encontró el token de autenticación.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Respuesta de la API:", response);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("Datos recibidos de la API:", responseData);

        if (responseData.status === 'success' && responseData.data.events) {
          const eventosMapeados = mapearEventos(responseData.data.events);
          console.log("Eventos mapeados:", eventosMapeados);
          setEventos(eventosMapeados);
        } else {
          setEventos([]);
        }
      } catch (err: any) {
        console.error("Error al obtener eventos:", err);
        setError(err.message || 'Ocurrió un error al obtener los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const headers = document.querySelectorAll('.rbc-header');
    const daysInSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    headers.forEach((header, index) => {
      header.textContent = daysInSpanish[index];
    });
  }, [view, eventos]);

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    const newDate = new Date(date);
    
    switch (action) {
      case 'PREV':
        if (view === 'month') {
          newDate.setMonth(date.getMonth() - 1);
        } else if (view === 'week') {
          newDate.setDate(date.getDate() - 7);
        } else if (view === 'day') {
          newDate.setDate(date.getDate() - 1);
        } else {
          // Agenda view
          newDate.setDate(date.getDate() - 7); // Default to week for agenda
        }
        break;
      case 'NEXT':
        if (view === 'month') {
          newDate.setMonth(date.getMonth() + 1);
        } else if (view === 'week') {
          newDate.setDate(date.getDate() + 7);
        } else if (view === 'day') {
          newDate.setDate(date.getDate() + 1);
        } else {
          // Agenda view
          newDate.setDate(date.getDate() + 7); // Default to week for agenda
        }
        break;
      case 'TODAY':
        newDate.setTime(new Date().getTime());
        break;
    }
    
    setDate(newDate);
    console.log(`Navegando a: ${newDate}, Vista: ${view}`);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log("Slot seleccionado:", slotInfo);
    setSelectedSlot(slotInfo);
    setShowNewEventModal(true);
  };

  const handleNewEvent = (evento: Evento) => {
    console.log('Nuevo evento creado:', evento);
    setSelectedSlot(null);
    setShowNewEventModal(false);
    // Opcional: actualizar el estado de eventos
    setEventos(prev => [...prev, evento]);
  };

  const handleSelectEvent = (event: Evento) => {
    console.log("Evento seleccionado:", event);
    setSelectedEvent(event);
    setIsEditingEvent(false); // Reset editing state when selecting a new event
  };
  
  const handleEditEvent = (evento: Evento) => {
    console.log('Editando evento:', evento);
    setIsEditingEvent(true);
    setSelectedEvent(evento);
    setShowNewEventModal(true);
  };
  
  const handleUpdateEvent = (updatedEvento: Evento) => {
    console.log('Evento actualizado:', updatedEvento);
    setEventos(prev => prev.map(ev => ev.id === updatedEvento.id ? updatedEvento : ev));
    setSelectedEvent(null);
    setIsEditingEvent(false);
    setShowNewEventModal(false);
  };
  
  const handleToggleFiltro = (categoriaId: string, subcategoriaId?: string) => {
    console.log(`Togling filtro: Categoria - ${categoriaId}, Subcategoria - ${subcategoriaId}`);
    if (categoriaId === 'reset') {
      setFiltrosActivos({
        categorias: CATEGORIAS.map(cat => cat.id),
        subcategorias: CATEGORIAS.flatMap(cat => cat.subcategorias?.map(sub => sub.id) || [])
      });
      return;
    }

    setFiltrosActivos(prev => {
      if (subcategoriaId) {
        const subcategorias = prev.subcategorias.includes(subcategoriaId)
          ? prev.subcategorias.filter(id => id !== subcategoriaId)
          : [...prev.subcategorias, subcategoriaId];
        return { ...prev, subcategorias };
      } else {
        const categorias = prev.categorias.includes(categoriaId)
          ? prev.categorias.filter(id => id !== categoriaId)
          : [...prev.categorias, categoriaId];
        return { ...prev, categorias };
      }
    });
  };

  const eventStyleGetter = (event: Evento) => ({
    className: `event-card hover-lift ${isSameDay(event.start, new Date()) ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`,
    style: {
      backgroundColor: event.color || '#4F46E5',
      borderRadius: '4px',
      color: 'white',
      border: 'none',
      padding: '2px',
    } as React.CSSProperties
  });

  const dayPropGetter = (date: Date) => ({
    className: 'hover-lift',
    style: {
      backgroundColor: 'transparent'
    }
  });

  const eventosFiltrados = useMemo(() => {
    let filtrados = eventos.filter(evento => 
      filtrosActivos.categorias.includes(evento.categoria || '') &&
      (evento.subcategoria ? filtrosActivos.subcategorias.includes(evento.subcategoria) : true)
    );

    // Apply calendar type filtering
    if (calendarType !== 'total') {
      const allowedCategories = calendarType === 'personal' 
        ? ['TAREA_PROPIA', 'ALARMA', 'GENERAL']
        : ['CITA_CON_CLIENTE', 'RUTINA_CLIENTE', 'PAGO_CLIENTE', 'ALARMA'];

      filtrados = filtrados.filter(evento => 
        allowedCategories.includes(evento.categoria || '')
      );
    }

    return filtrados.map(evento => ({
      ...evento,
      start: new Date(evento.start),
      end: new Date(evento.end),
    }));
  }, [filtrosActivos, eventos, calendarType]);
  
  useEffect(() => {
    // Expose filtered events to window for the sidebar to access
    window.calendarEvents = eventosFiltrados;
    window.selectCalendarEvent = (event: Evento) => setSelectedEvent(event);
  }, [eventosFiltrados]); 

  if (loading) {
    return <div className={`flex justify-center items-center h-screen ${
      theme === 'dark' ? 'text-gray-200 bg-gray-900' : ''
    }`}>Cargando eventos...</div>;
  }

  if (error) {
    return <div className={`flex justify-center items-center h-screen text-red-500 ${
      theme === 'dark' ? 'bg-gray-900' : ''
    }`}>{error}</div>;
  }

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'dark' ? 'bg-gray-900' : 'calendar-background'
    }`}>
      <CalendarioHeader
        currentDate={date}
        onNavigate={handleNavigate}
        onViewChange={setView}
        onNewEvent={() => setShowNewEventModal(true)}
        onShowEntrenador={() => setShowEntrenadorModal(true)}
        view={view}
      />
      
      {/* Rest of the component remains the same */}
      <div className="flex-1 flex overflow-hidden">
      <CalendarioSidebar
    categorias={CATEGORIAS}
    filtrosActivos={filtrosActivos}
    onToggleFiltro={handleToggleFiltro}
    onChangeCalendarType={(type) => {
      setCalendarType(type);
      console.log("Calendar type changed:", type);
    }}
  />        <div className="flex-1 p-6 overflow-hidden">
          <div className={`${
            theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700/50' 
              : 'bg-white/80 border-gray-200/50'
          } rounded-2xl shadow-xl border h-full backdrop-blur-sm hover-lift`}>
            <BigCalendar
              localizer={localizer}
              events={eventosFiltrados}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={dayPropGetter}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              components={{
                toolbar: () => null, // Esto elimina la toolbar
              }}
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "No hay eventos en este rango",
                allDay: "Todo el día",
                work_week: "Semana laboral",
              }}
              popup
              className={`calendar-custom ${theme === 'dark' ? 'calendar-dark' : ''}`}
            />
          </div>
        </div>
      </div>
      
      {selectedEvent && !isEditingEvent && (
        <EventoModal
          evento={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => handleEditEvent(selectedEvent)}
        />
      )}
      
      {showNewEventModal && (
        <NuevoEventoModal
          onClose={() => {
            setShowNewEventModal(false);
            setSelectedSlot(null);
            setIsEditingEvent(false);
            setSelectedEvent(null); // Also clear selected event when closing
          }}
          onSave={isEditingEvent ? handleUpdateEvent : handleNewEvent}
          categorias={CATEGORIAS}
          initialDate={selectedSlot?.start || (selectedEvent && isEditingEvent ? selectedEvent.start : new Date())}
          initialEndDate={selectedSlot?.end || (selectedEvent && isEditingEvent ? selectedEvent.end : new Date())}
          eventoToEdit={isEditingEvent ? selectedEvent : undefined}
        />
      )}
      {showEntrenadorModal && (
        <HorarioEntrenadorModal
          onClose={() => setShowEntrenadorModal(false)}
        />
      )}
    </div>
  );
};