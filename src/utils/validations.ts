// Funciones de validación
export const isValidEmail = (email: string): boolean => {
  // Implementación para validar emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  // Implementación para validar contraseñas fuertes
  return password.length >= 8;
};

// ... más funciones de validación