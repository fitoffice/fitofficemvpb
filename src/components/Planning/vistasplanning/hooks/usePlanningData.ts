import { useState, useEffect } from 'react';

interface Period {
  id: string;
  start: number;
  end: number;
  name: string;
  exercises?: any[];
}

interface PlanningData {
  planningId: string;
  periodos: Period[];
  totalPeriodos: number;
}

export const usePlanningData = (
  planningId: string | undefined,
  existingPeriods: Period[],
  onPeriodsChange: (periods: Period[]) => void
) => {
  const [selectedWeeks, setSelectedWeeks] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rmsData, setRmsData] = useState<any[]>([]);
  const [planningData, setPlanningData] = useState<PlanningData | null>(null);

  // Cargar datos de RM
  useEffect(() => {
    const fetchRMData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        console.log('Iniciando petición a la API de RMs...');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/rms', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos de RMs');
        }

        const data = await response.json();
        console.log('Datos de RMs recibidos:', data);
        setRmsData(data);
      } catch (err) {
        console.error('Error al cargar los RMs:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchRMData();
  }, []);

  // Cargar periodos
  useEffect(() => {
    // Add a ref to track if we've already loaded the periods for this planningId
    const fetchPeriods = async () => {
      if (!planningId) {
        console.log('No hay planningId, saliendo...');
        return;
      }
      
      // Skip if we already have data for this planning
      if (selectedWeeks.length > 0 && !loading) {
        console.log('Ya tenemos periodos cargados, omitiendo fetchPeriods');
        return;
      }
      
      console.log('Iniciando fetchPeriods con planningId:', planningId);
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        console.log('Token obtenido, iniciando petición a la API...');
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/periodos`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error('Error en la respuesta:', response.status, response.statusText);
          throw new Error('Error al obtener los periodos');
        }

        // Log the raw response text first
        const rawResponseText = await response.text();
        console.log('=== RESPUESTA RAW DE LA API ===');
        console.log('Respuesta texto completo:', rawResponseText);
        console.log('================================');

        // Parse the response text to JSON
        const data = JSON.parse(rawResponseText);
        
        console.log('=== RESPUESTA PARSEADA DE LA API ===');
        console.log('Datos exactos recibidos:', data);
        console.log('Tipo de datos:', typeof data);
        if (data.periodos) {
          console.log('Estructura de periodos:', {
            esTipoArray: Array.isArray(data.periodos),
            longitud: data.periodos.length,
            primerPeriodo: data.periodos[0],
            propiedadesPrimerPeriodo: data.periodos[0] ? Object.keys(data.periodos[0]) : 'No hay periodos'
          });
        }
        console.log('================================');

        // Convertir los periodos recibidos al formato que espera el componente
        const periodsFormatted = data.periodos.map((periodo: any) => {
          console.log('=== PERIODO INDIVIDUAL ===');
          console.log('Periodo original:', periodo);
          
          // Formatear los ejercicios para incluir el porcentaje en el nombre
          const formattedExercises = periodo.ejercicios?.map((ejercicio: any) => {
            // Add null checks to prevent accessing properties of null
            if (!ejercicio || !ejercicio.ejercicio) {
              console.log('Ejercicio nulo o sin propiedad ejercicio:', ejercicio);
              return null;
            }
            
            const porcentaje = ejercicio.variante?.porcentaje;
            return {
              ejercicio: {
                ...ejercicio.ejercicio,
                nombre: ejercicio.ejercicio.nombre 
                  ? (porcentaje 
                    ? `${ejercicio.ejercicio.nombre} (${porcentaje}%)`
                    : ejercicio.ejercicio.nombre)
                  : 'Ejercicio sin nombre'
              },
              variante: ejercicio.variante
            };
          }).filter(Boolean) || []; // Filter out null values

          const formatted = {
            id: periodo.id,
            start: periodo.inicioSemana,
            end: periodo.finSemana,
            name: periodo.nombre || 'Periodo sin nombre', // Add fallback for name
            exercises: formattedExercises
          };
          console.log('Periodo formateado:', formatted);
          console.log('========================');
          return formatted;
        });

        console.log('=== PERIODOS FORMATEADOS FINAL ===');
        console.log(JSON.stringify(periodsFormatted, null, 2));
        console.log('================================');

        setSelectedWeeks(periodsFormatted);
        onPeriodsChange(periodsFormatted);
      } catch (err) {
        console.error('Error al cargar los periodos:', err);
        console.error('Stack trace:', (err as Error).stack);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPeriods();
  }, [planningId, onPeriodsChange]);

  // Cargar datos del planning
  useEffect(() => {
    if (planningId) {
      // Aquí iría la lógica para cargar los datos del planning
      // Por ahora usamos datos de ejemplo
      const data = {
        planningId: planningId,
        periodos: existingPeriods.map(period => ({
          id: period.id,
          nombre: period.name,
          inicioSemana: period.start,
          finSemana: period.end,
          inicioDia: 1,
          finDia: 7,
          ejercicios: [] // Aquí irían los ejercicios del periodo
        })),
        totalPeriodos: existingPeriods.length
      };
      setPlanningData(data);
    }
  }, [planningId, existingPeriods]);

  return {
    selectedWeeks,
    setSelectedWeeks,
    loading,
    error,
    rmsData,
    planningData
  };
};