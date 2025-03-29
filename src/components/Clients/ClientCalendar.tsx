import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useTheme } from '../../contexts/ThemeContext';

interface Event {
  _id: string;
  name: string;
  type: string;
  date: string;
  client: {
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ClientCalendarProps {
  clientId: string;
}

const ClientCalendar: React.FC<ClientCalendarProps> = ({ clientId }) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        // Obtener eventos directamente usando el ID del cliente
        const eventResponse = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/events/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!eventResponse.ok) {
          throw new Error('Error al obtener los eventos');
        }

        const eventData = await eventResponse.json();
        setEvents(Array.isArray(eventData) ? eventData : [eventData]);
      } catch (err) {
        console.error('Error al obtener eventos:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientEvents();
    }
  }, [clientId]);

  // Función para verificar si una fecha tiene eventos
  const hasEvents = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Función para obtener los eventos de una fecha específica
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando eventos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className={`rounded-md border ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
        }`}
        modifiers={{
          hasEvent: (date) => hasEvents(date),
        }}
        modifiersStyles={{
          hasEvent: {
            backgroundColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#60A5FA' : '#2563EB',
          },
        }}
      />
      
      {selectedDate && getEventsForDate(selectedDate).length > 0 && (
        <div className={`mt-4 p-4 rounded-md ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h3 className="font-semibold mb-2">Eventos para {selectedDate.toLocaleDateString()}</h3>
          <ul className="space-y-2">
            {getEventsForDate(selectedDate).map((event) => (
              <li
                key={event._id}
                className={`p-2 rounded ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                }`}
              >
                <div className="font-medium">{event.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-500">
                  Tipo: {event.type}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientCalendar;
