// Funciones de utilidad generales
export const formatDate = (date: Date): string => {
  // Implementación para formatear fechas
  return date.toLocaleDateString();
};

export const calculateBMI = (weight: number, height: number): number => {
  // Implementación para calcular el IMC
  return weight / (height * height);
};

// ... más funciones de utilidad