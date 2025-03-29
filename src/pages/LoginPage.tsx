// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Dumbbell } from 'lucide-react';
import Button from '../components/Common/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const styles = {
    container: `min-h-screen flex items-center justify-center relative ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 to-gray-50'
    }`,
    card: `max-w-md w-full mx-4 ${
      theme === 'dark'
        ? 'bg-gray-800/40 backdrop-blur-sm hover:backdrop-blur-md'
        : 'bg-white/60 backdrop-blur-sm hover:backdrop-blur-md'
    } rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-blue-500/20 hover:-translate-y-1`,
    header: 'relative h-40 bg-gradient-to-r from-blue-600 to-blue-400',
    title: `text-2xl font-bold text-center mb-8 ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      setError(error.message || 'Credenciales inválidas. Usa admin@example.com / password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
          </div>
          <div className="relative flex flex-col items-center justify-center h-full">
            <div className="flex items-center gap-4">
              <Dumbbell className="w-12 h-12 text-white" />
              <h1 className="text-3xl font-bold text-white tracking-wider">FitOffice</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className={styles.title}>
            <span className="flex items-center justify-center">
              Bienvenido de Nuevo
            </span>
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-shake" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Correo Electrónico
            </label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'
              } transition-colors`} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                placeholder="juan.perez@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Contraseña
            </label>
            <div className="relative group">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'
              } transition-colors`} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                placeholder="contraseña123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform"
              >
                {showPassword ? (
                  <EyeOff className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                ) : (
                  <Eye className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={`ml-2 text-sm ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Recordarme
              </span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
