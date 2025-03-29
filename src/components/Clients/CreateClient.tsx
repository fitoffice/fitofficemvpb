import React, { useState } from 'react';
import axios from 'axios';
import { X, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useClientContext } from '../../contexts/ClientContext';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

interface Address {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
}

interface SocialMedia {
  plataforma: 'instagram' | 'facebook' | 'twitter';
  nombreUsuario: string;
}

interface Tag {
  nombre: string;
  color: string;
}

interface CreateClientProps {
  onClose: () => void;
  onClientCreated?: () => void;
}

const CreateClient: React.FC<CreateClientProps> = ({ onClose, onClientCreated }) => {
  const { theme } = useTheme();
  const { addClient } = useClientContext();
  const isDark = theme === 'dark';
  
  // Información personal básica
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dirección
  const [direccion, setDireccion] = useState<Address>({
    calle: '',
    ciudad: '',
    codigoPostal: '',
    pais: ''
  });

  // Redes sociales
  const [redesSociales, setRedesSociales] = useState<SocialMedia[]>([]);

  // Tags
  const [tags, setTags] = useState<Tag[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddSocialMedia = () => {
    setRedesSociales([...redesSociales, { plataforma: 'instagram', nombreUsuario: '' }]);
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMedia, value: string) => {
    const newRedesSociales = [...redesSociales];
    newRedesSociales[index] = {
      ...newRedesSociales[index],
      [field]: value
    };
    setRedesSociales(newRedesSociales);
  };

  const handleDireccionChange = (field: keyof Address, value: string) => {
    setDireccion({
      ...direccion,
      [field]: value
    });
  };

  const handleAddTag = () => {
    setTags([...tags, { nombre: '', color: '#000000' }]);
  };

  const handleTagChange = (index: number, field: keyof Tag, value: string) => {
    const newTags = [...tags];
    newTags[index] = {
      ...newTags[index],
      [field]: value
    };
    setTags(newTags);
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // This is the handleSubmit function in CreateClient.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    const requestData = {
      nombre,
      apellidos,
      email,
      telefono,
      fechaNacimiento,
      genero,
      password,
      direccion,
      redesSociales,
      tags
    };
  
    console.log('Sending request to:', `${API_URL}/clientes/registro`);
    console.log('Request data:', requestData);
  
    try {
      const response = await axios.post(`${API_URL}/clientes/registro`, requestData);
      console.log('API Response:', response.data);
  
      // Check if we have a valid client object in the response
      if (response.data && response.data.cliente) {
        const newClient = response.data.cliente;
        console.log('New client created:', newClient);
        
        // Add the new client to the context
        addClient(newClient);
        
        setSuccessMessage('Cliente registrado exitosamente');
        
        // Reset all fields
        setNombre('');
        setApellidos('');
        setEmail('');
        setTelefono('');
        setFechaNacimiento('');
        setGenero('');
        setPassword('');
        setDireccion({ calle: '', ciudad: '', codigoPostal: '', pais: '' });
        setRedesSociales([]);
        setTags([]);
  
        if (onClientCreated) {
          onClientCreated();
        }
  
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('API Error:', error);
      if (error.response?.data) {
        setError(error.response.data.mensaje || 'Error al registrar el cliente');
      } else {
        setError('Error de conexión: Por favor, intente nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillWithFakeData = () => {
    setNombre('Juan');
    setApellidos('Pérez García');
    setEmail('juan.perez@example.com');
    setTelefono('612345678');
    setFechaNacimiento('1990-01-01');
    setGenero('masculino');
    setPassword('password123');
    
    setDireccion({
      calle: 'Calle Principal 123',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      pais: 'España'
    });

    setRedesSociales([
      { plataforma: 'instagram', nombreUsuario: 'juanperez' },
      { plataforma: 'facebook', nombreUsuario: 'juan.perez' }
    ]);

    setTags([
      { nombre: 'VIP', color: '#FFD700' },
      { nombre: 'Activo', color: '#00FF00' }
    ]);
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${
      isDark ? 'from-gray-900/90 to-black/95' : 'from-black/80 to-gray-900/90'
    } backdrop-blur-md flex items-center justify-center p-4 z-50`}>
      <div className={`${
        isDark ? 'bg-gray-800/95 border-gray-700 text-gray-100' : 'bg-white/95 border-gray-100'
      } rounded-2xl shadow-2xl w-full max-w-2xl relative animate-fadeIn overflow-y-auto max-h-[90vh] border`}>
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 ${
            isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
          } transition-all duration-300 transform hover:rotate-90`}
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              Registrar Nuevo Cliente
            </h2>
            <button
              type="button"
              onClick={fillWithFakeData}
              className={`px-4 py-2 text-sm ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } rounded-lg transition-all duration-200`}
            >
              Rellenar con datos de prueba
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Personal */}
            <div className={`space-y-6 ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
            } p-6 rounded-xl shadow-sm border`}>
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              } border-b pb-2 flex items-center gap-2`}>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="nombre" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="apellidos" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Apellidos
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="email" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="telefono" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="fechaNacimiento" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="genero" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Género
                  </label>
                  <select
                    id="genero"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  >
                    <option value="">Seleccionar género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="group">
                  <label htmlFor="password" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-2.5 border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                          : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                      } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 pr-10`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                      } transition-colors focus:outline-none`}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
    
                       {/* Dirección */}
                       <div className={`space-y-6 ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
            } p-6 rounded-xl shadow-sm border`}>
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              } border-b pb-2 flex items-center gap-2`}>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Dirección
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="calle" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Calle
                  </label>
                  <input
                    type="text"
                    id="calle"
                    value={direccion.calle}
                    onChange={(e) => handleDireccionChange('calle', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="ciudad" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="ciudad"
                    value={direccion.ciudad}
                    onChange={(e) => handleDireccionChange('ciudad', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="codigoPostal" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    Código Postal
                  </label>
                  <input
                    type="text"
                    id="codigoPostal"
                    value={direccion.codigoPostal}
                    onChange={(e) => handleDireccionChange('codigoPostal', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="pais" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } mb-1 transition-colors`}>
                    País
                  </label>
                  <input
                    type="text"
                    id="pais"
                    value={direccion.pais}
                    onChange={(e) => handleDireccionChange('pais', e.target.value)}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>
              </div>
            </div>
    
            {/* Redes Sociales */}
            <div className={`space-y-6 ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
            } p-6 rounded-xl shadow-sm border`}>
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className={`text-xl font-semibold ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                } flex items-center gap-2`}>
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Redes Sociales
                </h3>
                <button
                  type="button"
                  onClick={handleAddSocialMedia}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                >
                  <span>Agregar Red Social</span>
                  <span className="text-xl">+</span>
                </button>
              </div>

              <div className="space-y-4">
                {redesSociales.map((red, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    isDark 
                      ? 'border-gray-700 bg-gray-800 hover:shadow-gray-900/50' 
                      : 'border-gray-200 bg-white hover:shadow-md'
                  } shadow-sm transition-shadow duration-200`}>
                    <div className="group">
                      <label className={`block text-sm font-medium ${
                        isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                      } mb-1 transition-colors`}>
                        Plataforma
                      </label>
                      <select
                        value={red.plataforma}
                        onChange={(e) => handleSocialMediaChange(index, 'plataforma', e.target.value as any)}
                        className={`w-full px-4 py-2.5 border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                            : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>

                    <div className="group mt-4">
                      <label className={`block text-sm font-medium ${
                        isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                      } mb-1 transition-colors`}>
                        Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        value={red.nombreUsuario}
                        onChange={(e) => handleSocialMediaChange(index, 'nombreUsuario', e.target.value)}
                        className={`w-full px-4 py-2.5 border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                            : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
                        {/* Tags */}
                        <div className={`space-y-6 ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
            } p-6 rounded-xl shadow-sm border`}>
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              } border-b pb-2 flex items-center gap-2`}>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Tags
              </h3>

              {tags.map((tag, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="group">
                    <label className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                    } mb-1 transition-colors`}>
                      Nombre del Tag
                    </label>
                    <input
                      type="text"
                      value={tag.nombre}
                      onChange={(e) => handleTagChange(index, 'nombre', e.target.value)}
                      className={`w-full px-4 py-2.5 border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                          : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                      } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="Nombre del tag"
                    />
                  </div>
                  <div className="group flex items-center gap-4">
                    <div className="flex-grow">
                      <label className={`block text-sm font-medium ${
                        isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                      } mb-1 transition-colors`}>
                        Color
                      </label>
                      <input
                        type="color"
                        value={tag.color}
                        onChange={(e) => handleTagChange(index, 'color', e.target.value)}
                        className={`w-full h-10 px-1 py-1 border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className={`mt-6 p-2 ${
                        isDark 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                          : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                      } rounded-full transition-colors`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddTag}
                className={`w-full mt-4 px-4 py-2 ${
                  isDark 
                    ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                } rounded-lg transition-colors flex items-center justify-center gap-2`}
              >
                Agregar Tag
              </button>
            </div>

            {error && (
              <div className={`${
                isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50'
              } text-sm mt-2 p-4 border-l-4 border-red-500 rounded-lg animate-fadeIn`}>
                {error}
              </div>
            )}

            {successMessage && (
              <div className={`${
                isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50'
              } text-sm mt-2 p-4 border-l-4 border-green-500 rounded-lg animate-fadeIn`}>
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-1 hover:shadow-xl'
              }`}
            >
              {loading ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;