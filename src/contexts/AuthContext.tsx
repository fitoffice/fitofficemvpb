// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Interface para el usuario autenticado
interface User {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

// Interface para el token decodificado
interface DecodedToken {
  exp: number;
}

// Interface para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL de la API
const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api'; // Asegúrate de usar la URL correcta

// Función para verificar si el token ha expirado
const isTokenExpired = (token: string): boolean => {
  const decoded: DecodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000; // Tiempo actual en segundos
  console.log('⏰ Decoded exp:', decoded.exp);
  console.log('⏰ Current time:', currentTime);
  if (!decoded.exp) {
    console.warn('El token no tiene campo exp, se considerará válido.');
    return false;
  }
  return decoded.exp < currentTime;
};

// Componente proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      try {
        // Validar si el token ha expirado
        if (isTokenExpired(token)) {
          console.warn('Token expirado, cerrando sesión automáticamente.');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setLoading(false);
          return;
        }

        const parsedUser: User = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setUser(parsedUser);
          localStorage.setItem('userId', parsedUser.id);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          if (location.pathname === '/login') {
            navigate('/');
          }
        } else {
          throw new Error('Datos de usuario inválidos.');
        }
      } catch (error) {
        console.error('Error al procesar los datos guardados:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    }
    setLoading(false);
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    try {
      // Solicitar inicio de sesión al backend
      const response = await axios.post(`${API_URL}/auth/login/entrenador`, {
        email,
        password,
      });
  
      console.log('🔑 Respuesta del backend:', response.data);
  
      const { token, user: loggedInUser } = response.data;
  
      if (!loggedInUser || !token) {
        throw new Error('Respuesta del servidor incompleta.');
      }
  

      // Almacenar el usuario y el token
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', loggedInUser.id);
      console.log('📝 Usuario guardado en localStorage:', loggedInUser);
      console.log('🔐 Token guardado en localStorage:', token);
      console.log('👤 UserId guardado en localStorage:', loggedInUser.id);
      
      // Configurar headers para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirigir al usuario
      navigate('/');
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Error en el inicio de sesión. Inténtalo de nuevo.');
      }
    }
  };

  const logout = () => {
    // Eliminar datos de usuario y token
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider.');
  }
  return context;
};
