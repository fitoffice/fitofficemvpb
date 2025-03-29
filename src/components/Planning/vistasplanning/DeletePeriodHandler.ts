/**
 * Utility for handling period deletion in the planning system
 */
export const useDeletePeriodHandler = () => {
  /**
   * Deletes a period from the planning
   * @param planningId - The ID of the planning
   * @param selectedWeeks - The current periods
   * @param setSelectedWeeks - Function to update the periods state
   * @param onPeriodsChange - Callback to notify parent component of periods change
   * @param index - Index of the period to delete
   */
  const handleDeletePeriod = async (
    planningId: string | undefined,
    selectedWeeks: any[],
    setSelectedWeeks: React.Dispatch<React.SetStateAction<any[]>>,
    onPeriodsChange: (periods: any[]) => void,
    index: number
  ) => {
    const periodToDelete = selectedWeeks[index];
    console.log('VistaEstadisticas - Iniciando eliminación del periodo:', {
      index,
      periodToDelete
    });

    try {
      // Si el periodo tiene ID, eliminarlo del servidor
      if (periodToDelete.id) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        console.log('Enviando petición DELETE al servidor...');
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/periodos/${periodToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Respuesta del servidor:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Error al eliminar el periodo: ${response.status} ${response.statusText}`);
        }

        console.log('Periodo eliminado exitosamente del servidor');
      } else {
        console.log('El periodo no tiene ID, solo se eliminará del estado local');
      }
      
      // Actualizar el estado local
      const newPeriods = selectedWeeks.filter((_, i) => i !== index);
      console.log('Actualizando estado local con los periodos restantes:', newPeriods);
      
      setSelectedWeeks(newPeriods);
      onPeriodsChange(newPeriods);
      
      console.log('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error detallado al eliminar el periodo:', error);
      console.error('Stack trace:', (error as Error).stack);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return { handleDeletePeriod };
};