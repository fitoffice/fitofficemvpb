import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Mail, Users, Calendar, Save, Edit2, DollarSign, Package, LogOut } from 'lucide-react';
import Button from '../components/Common/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import SeccionEmpresa from '../components/Forms/SeccionEmpresa';

interface Servicio {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
}

interface Ingreso {
  _id: string;
  cantidad: number;
  fecha: string;
  concepto: string;
}

interface Gasto {
  _id: string;
  cantidad: number;
  fecha: string;
  concepto: string;
}

interface TrainerData {
  nombre: string;
  email: string;
  rol: string;
  servicios: Servicio[];
  ingresos: Ingreso[];
  gastos: Gasto[];
  clientes: string[];
  ingresosTotales: number;
  fechaRegistro: string;
  tokensUsados: number;
  _id: string;
  // Add these new fields
  nombreEmisor?: string;
  direccionEmisor?: string;
  nifEmisor?: string;
}

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [clientCount, setClientCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCompanyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!trainerData) return;
    
    const { name, value } = e.target;
    setTrainerData(prev => prev ? { ...prev, [name]: value } : null);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.patch(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/entrenadores/perfil',
        { [name]: value },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      console.error('Error updating company data:', err);
    }
  };

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token para perfil:', token);
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/entrenadores/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Respuesta del perfil:', response.data);
        setTrainerData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error en fetchTrainerProfile:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los datos del perfil');
        setLoading(false);
      }
    };
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token para servicios:', token);
        if (!token) return;

        const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Respuesta de servicios:', response.data);
        console.log('Número de servicios:', response.data.length);
        setServiceCount(response.data.length);
      } catch (err) {
        console.error('Error en fetchServices:', err);
      }
    };

    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token para clientes:', token);
        if (!token) return;

        const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Respuesta de clientes:', response.data);
        console.log('Número de clientes:', response.data.length);
        setClientCount(response.data.length);
      } catch (err) {
        console.error('Error en fetchClients:', err);
      }
    };

    fetchTrainerProfile();
    fetchServices();
    fetchClients();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Banner de perfil */}
      <div className={`relative ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500'
      }`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii4xIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY1MTJIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] bg-cover opacity-50"></div>
        <div className="container mx-auto px-4 py-8 relative z-10 flex justify-between items-center">
          <h1 className="text-white text-4xl font-bold tracking-tight">Mi Perfil</h1>
          <Button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className={`max-w-4xl mx-auto ${
          theme === 'dark' ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'
        } rounded-2xl shadow-2xl p-8 relative overflow-hidden`}>
          
          {trainerData && (
            <>
            
              {/* Información básica */}
              <div className="flex flex-col md:flex-row items-center gap-12 pb-8 border-b border-gray-200/20">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Perfil"
                        className="w-48 h-48 rounded-full object-cover ring-4 ring-white/10 dark:ring-gray-800/50"
                      />
                    ) : (
                      <div className={`w-48 h-48 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/80'
                      }`}>
                        <User size={72} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                      </div>
                    )}
                    <button
                      onClick={triggerFileInput}
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300"
                    >
                      <Camera size={24} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nombre
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          value={trainerData.nombre}
                          readOnly
                          className={`block w-full px-4 py-3 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-gray-700/50 text-white' 
                              : 'bg-gray-50 text-gray-900'
                          } border border-gray-300 focus:ring-2 focus:ring-blue-500/20`}
                        />
                        <User className="absolute right-3 top-3 text-gray-400" size={20} />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="email"
                          value={trainerData.email}
                          readOnly
                          className={`block w-full px-4 py-3 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-gray-700/50 text-white' 
                              : 'bg-gray-50 text-gray-900'
                          } border border-gray-300 focus:ring-2 focus:ring-blue-500/20`}
                        />
                        <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección Empresa */}
              

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                      <Users className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={24} />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Clientes</p>
                      <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {clientCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                      <DollarSign className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} size={24} />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ingresos Totales</p>
                      <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(trainerData.ingresosTotales)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                      <Package className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} size={24} />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Servicios</p>
                      <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {serviceCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Servicios */}
              <div className="mt-8">
                <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Mis Servicios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainerData.servicios.map((servicio) => (
                    <div
                      key={servicio._id}
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                    >
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {servicio.nombre}
                      </h3>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {servicio.descripcion}
                      </p>
                      <p className={`text-lg font-semibold mt-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        {formatCurrency(servicio.precio)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Últimos Ingresos
                  </h2>
                  <div className="space-y-3">
                    {trainerData.ingresos.slice(0, 5).map((ingreso) => (
                      <div
                        key={ingreso._id}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            {ingreso.concepto}
                          </span>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            {formatCurrency(ingreso.cantidad)}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(ingreso.fecha)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Últimos Gastos
                  </h2>
                  <div className="space-y-3">
                    {trainerData.gastos.slice(0, 5).map((gasto) => (
                      <div
                        key={gasto._id}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            {gasto.concepto}
                          </span>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                            {formatCurrency(gasto.cantidad)}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(gasto.fecha)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <SeccionEmpresa
                  formData={{
                    nombreEmisor: trainerData.nombreEmisor || '',
                    direccionEmisor: trainerData.direccionEmisor || '',
                    nifEmisor: trainerData.nifEmisor || ''
                  }}
                  handleChange={handleCompanyChange}
                />
              </div>
              {/* Información del registro */}
              <div className="mt-8 pt-6 border-t border-gray-200/20">
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Miembro desde: {formatDate(trainerData.fechaRegistro)}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tokens utilizados: {trainerData.tokensUsados}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;