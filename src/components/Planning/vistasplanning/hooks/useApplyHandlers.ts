/**
 * Hook para manejar la aplicación de periodos y ejercicios
 */
export const useApplyHandlers = (planningId: string | undefined) => {
  /**
   * Aplica un periodo al planning
   * @param periodId - ID del periodo a aplicar
   */
  const handleApplyPeriod = async (periodId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/periodos/${periodId}/aplicar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al aplicar el periodo');
      }

      // Aquí podrías mostrar una notificación de éxito
      console.log('Periodo aplicado exitosamente');
    } catch (error) {
      console.error('Error al aplicar el periodo:', error);
      // Aquí podrías mostrar una notificación de error
    }
  };

  /**
   * Aplica un ejercicio a un periodo específico
   * @param periodId - ID del periodo
   * @param exerciseId - ID del ejercicio a aplicar
   */
  const handleApplyExercise = async (periodId: string, exerciseId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/periodos/${periodId}/ejercicios/${exerciseId}/aplicar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al aplicar el ejercicio');
      }

      // Aquí podrías mostrar una notificación de éxito
      console.log('Ejercicio aplicado exitosamente');
    } catch (error) {
      console.error('Error al aplicar el ejercicio:', error);
      // Aquí podrías mostrar una notificación de error
    }
  };

  return {
    handleApplyPeriod,
    handleApplyExercise
  };
};