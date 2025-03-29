import { Period } from './types';

interface WeekSelectHandlerProps {
  planningId: string | undefined;
  selectedWeeks: Period[];
  setSelectedWeeks: React.Dispatch<React.SetStateAction<Period[]>>;
  setSelectionStart: React.Dispatch<React.SetStateAction<number | null>>;
  setHoveredWeek: React.Dispatch<React.SetStateAction<number | null>>;
  onPeriodsChange: (periods: Period[]) => void;
  getEjerciciosEnPeriodo: (start: number, end: number) => any[];
}

const useWeekSelectHandler = ({
  planningId,
  selectedWeeks,
  setSelectedWeeks,
  setSelectionStart,
  setHoveredWeek,
  onPeriodsChange,
  getEjerciciosEnPeriodo
}: WeekSelectHandlerProps) => {
  
  const handleWeekSelect = async (weekNumber: number, selectionStart: number | null) => {
    if (!selectionStart) {
      setSelectionStart(weekNumber);
      return;
    } else {
      const start = Math.min(selectionStart, weekNumber);
      const end = Math.max(selectionStart, weekNumber);
      
      const isOverlapping = selectedWeeks.some(range => 
        (start <= range.end && end >= range.start)
      );

      if (!isOverlapping) {
        const ejerciciosEnPeriodo = getEjerciciosEnPeriodo(start, end);
        const newPeriod = { 
          start, 
          end, 
          name: `Periodo ${selectedWeeks.length + 1}`,
          exercises: ejerciciosEnPeriodo
        };
        
        // Asegurarnos de que no haya ejercicios duplicados en el nuevo periodo
        const ejerciciosUnicos = ejerciciosEnPeriodo.filter((ejercicio, index, self) =>
          index === self.findIndex((e) => e.ejercicioId === ejercicio.ejercicioId)
        );
        
        newPeriod.exercises = ejerciciosUnicos;

        try {
          console.log('Enviando petición para crear periodo...');
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No se encontró el token de autenticación');
          }

          const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/periodos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              nombre: newPeriod.name,
              inicioSemana: start,
              finSemana: end,
              inicioDia: 1,
              finDia: 7
            })
          });

          console.log('Respuesta del servidor:', response);
          
          if (!response.ok) {
            throw new Error('Error al crear el periodo');
          }

          const data = await response.json();
          console.log('Periodo creado exitosamente:', data);
          
          const newPeriods = [...selectedWeeks, newPeriod];
          setSelectedWeeks(newPeriods);
          onPeriodsChange(newPeriods);
        } catch (error) {
          console.error('Error al crear el periodo:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      }
      
      setSelectionStart(null);
    }
    setHoveredWeek(null);
  };

  return { handleWeekSelect };
};

export default useWeekSelectHandler;