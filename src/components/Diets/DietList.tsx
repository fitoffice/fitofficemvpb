// DietList.tsx
import React, { useState, useEffect } from 'react'; 
import { 
  Search, 
  X, 
  Plus, 
  Filter, 
  Download, 
  Salad, 
  Target, 
  Clock, 
  Users, 
  FileText,
  Apple,
  Utensils,
  ChefHat
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import TableWithActions from '../Common/TableWithActions';
import Modal from '../Common/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import CrearDietasPopup from './CrearDietasPopup';
import CrearComidaPopup from './CrearComidaPopup';
import VerDietaPopup from './VerDietaPopup';

const DietList: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoods, setShowFoods] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    objetivo: '',
    estado: '',
    categoria: '',
    rangoKcal: { min: '', max: '' }
  });

  const handleFilterChange = (key: string, value: string | { min: string, max: string }) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = (data: any[]) => {
    return data.filter(item => {
      // First apply search term filter
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = !searchTerm.trim() || (
        (item.nombre && item.nombre.toLowerCase().includes(searchLower)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(searchLower)) ||
        (item.cliente && item.cliente.toLowerCase().includes(searchLower)) ||
        (item.objetivo && item.objetivo.toLowerCase().includes(searchLower))
      );

      if (!matchesSearch) return false;

      // Then apply other filters
      if (showFoods) {
        const matchesCategoria = !filters.categoria || item.categoria === filters.categoria;
        const matchesKcal = !filters.rangoKcal.min && !filters.rangoKcal.max || 
          ((!filters.rangoKcal.min || item.calorias >= Number(filters.rangoKcal.min)) &&
           (!filters.rangoKcal.max || item.calorias <= Number(filters.rangoKcal.max)));
        
        return matchesCategoria && matchesKcal;
      } else {
        const matchesObjetivo = !filters.objetivo || item.objetivo === filters.objetivo;
        const matchesEstado = !filters.estado || item.estado === filters.estado;
        
        return matchesObjetivo && matchesEstado;
      }
    });
  };

  const [dietData, setDietData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getActiveDietsCount = () => {
    return dietData.filter(diet => diet.estado === 'activa').length;
  };

  const statsCards = [
    { 
      icon: showFoods ? Apple : ChefHat,
      title: showFoods ? "Total Alimentos" : "Dietas Activas",
      value: showFoods ? "48" : getActiveDietsCount().toString(),
      color: "bg-blue-500"
    },
    {
      icon: showFoods ? Utensils : Target,
      title: showFoods ? "Categorías" : "Objetivos Cumplidos",
      value: showFoods ? "12" : "85%",
      color: "bg-indigo-500"
    },
    {
      icon: Clock,
      title: showFoods ? "Tiempo Promedio" : "Duración Media",
      value: showFoods ? "25min" : "45 días",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Clientes Asignados",
      value: "156",
      color: "bg-indigo-500"
    }
  ];

  const handleEditDiet = (dietId: string) => {
    navigate(`/edicion-dieta/${dietId}`);
  };

  // Add this state near other state declarations
  const [isViewDietModalOpen, setIsViewDietModalOpen] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);

  // Replace the handleViewDiet function
  const handleViewDiet = (dietId: string) => {
    const diet = dietData.find(d => d._id === dietId);
    if (diet) {
      setSelectedDiet(diet);
      setIsViewDietModalOpen(true);
    }
  };

  const handleDownloadDiet = (dietId: string) => {
    // TODO: Implement download diet functionality
    console.log('Download diet:', dietId);
  };

  const handleDeleteDiet = (dietId: string) => {
    // TODO: Implement delete diet functionality
    console.log('Delete diet:', dietId);
  };

  const renderCell = (key: string, value: any, item: any) => {
    // Convert header labels to lowercase for case-insensitive matching
    const lowerKey = key.toLowerCase().replace(/\s+/g, '').replace(/\//g, '');
    
    console.log('Rendering cell:', key, 'with value:', value);
    
    // Map display keys to actual data keys
    const keyMap: Record<string, string> = {
      'nombre': 'nombre',
      'cliente': 'cliente',
      'fechainicio': 'fechaInicio',
      'objetivo': 'objetivo',
      'alergias/intolerancias': 'alergiasIntolerancias',
      'alergiasintolerancias': 'alergiasIntolerancias',
      'alimentosprohibidos': 'alimentosProhibidos',
      'alimentospreferidos': 'alimentosPreferidos',
      'estado': 'estado',
      'acciones': 'acciones'
    };
    
    // Get the actual data key
    const dataKey = keyMap[lowerKey] || key;
    
    // Get the value using the mapped key
    let displayValue = value;
    if (dataKey !== key && item[dataKey] !== undefined) {
      displayValue = item[dataKey];
      console.log(`Mapped key ${key} to ${dataKey}, value:`, displayValue);
    }
    
    if (key === 'acciones' || dataKey === 'acciones') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditDiet(item._id);
            }}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDiet(item._id);
            }}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Ver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadDiet(item._id);
            }}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Descargar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteDiet(item._id);
            }}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Eliminar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      );
    }
    
    // Handle undefined or null values
    if (displayValue === undefined || displayValue === null) {
      displayValue = '';
    }
    
    switch (dataKey) {
      case 'objetivo':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            displayValue === 'Pérdida de peso' ? 'bg-red-100 text-red-800' :
            displayValue === 'Aumento muscular' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {displayValue}
          </span>
        );
      case 'alergiasIntolerancias':
        console.log('Rendering alergiasIntolerancias:', displayValue);
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            {displayValue || 'Ninguno'}
          </span>
        );
      case 'alimentosProhibidos':
        console.log('Rendering alimentosProhibidos:', displayValue);
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            {displayValue || 'Ninguno'}
          </span>
        );
      case 'alimentosPreferidos':
        console.log('Rendering alimentosPreferidos:', displayValue);
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            {displayValue || 'Ninguno'}
          </span>
        );
      case 'estado':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            displayValue === 'activa' ? 'bg-emerald-100 text-emerald-800' :
            displayValue === 'pendiente' ? 'bg-amber-100 text-amber-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {displayValue}
          </span>
        );
      default:
        return displayValue;
    }
  };

  const renderTable = () => {
    // Define the exact header keys that will be used to access data
    const headerKeys = ['nombre', 'cliente', 'fechaInicio', 'objetivo', 'alergiasIntolerancias', 'alimentosProhibidos', 'alimentosPreferidos', 'estado', 'acciones'];
    const headerLabels = ['Nombre', 'Cliente', 'Fecha Inicio', 'Objetivo', 'Alergias/Intolerancias', 'Alimentos Prohibidos', 'Alimentos Preferidos', 'Estado', 'Acciones'];
    
    console.log('Diet data before processing:', dietData);
    
    const tableData = dietData.map(diet => {
      // Parse the restricciones JSON string if it exists
      let alergias = '';
      let prohibidos = '';
      let preferidos = '';
      
      console.log('Processing diet:', diet.nombre, 'Restricciones:', diet.restricciones);
      
      if (diet.restricciones) {
        if (typeof diet.restricciones === 'string') {
          try {
            // Try to parse as JSON
            const restriccionesObj = JSON.parse(diet.restricciones);
            console.log('Parsed restricciones object:', restriccionesObj);
            alergias = restriccionesObj.alergiasIntolerancias || '';
            prohibidos = restriccionesObj.alimentosProhibidos || '';
            preferidos = restriccionesObj.alimentosPreferidos || '';
          } catch (e) {
            // If parsing fails, use the string as-is for alergias
            console.log('Failed to parse restricciones as JSON:', e.message);
            alergias = diet.restricciones;
          }
        } else if (typeof diet.restricciones === 'object') {
          // If it's already an object, use its properties
          console.log('Restricciones is already an object:', diet.restricciones);
          alergias = diet.restricciones.alergiasIntolerancias || '';
          prohibidos = diet.restricciones.alimentosProhibidos || '';
          preferidos = diet.restricciones.alimentosPreferidos || '';
        }
      } else {
        // Check if the diet has direct properties for these fields
        if (diet.alergiasIntolerancias) {
          if (Array.isArray(diet.alergiasIntolerancias)) {
            alergias = diet.alergiasIntolerancias.join(', ');
          } else {
            alergias = diet.alergiasIntolerancias;
          }
        }
        
        if (diet.alimentosProhibidos) {
          if (Array.isArray(diet.alimentosProhibidos)) {
            prohibidos = diet.alimentosProhibidos.join(', ');
          } else {
            prohibidos = diet.alimentosProhibidos;
          }
        }
        
        if (diet.alimentosPreferidos) {
          if (Array.isArray(diet.alimentosPreferidos)) {
            preferidos = diet.alimentosPreferidos.join(', ');
          } else {
            preferidos = diet.alimentosPreferidos;
          }
        }
      }
      
      const processedDiet = {
        ...diet,
        alergiasIntolerancias: alergias,
        alimentosProhibidos: prohibidos,
        alimentosPreferidos: preferidos,
        acciones: 'actions' // This will be replaced by our custom render
      };
      
      console.log('Processed diet with fields:', {
        nombre: processedDiet.nombre,
        cliente: processedDiet.cliente,
        fechaInicio: processedDiet.fechaInicio,
        objetivo: processedDiet.objetivo,
        alergiasIntolerancias: processedDiet.alergiasIntolerancias,
        alimentosProhibidos: processedDiet.alimentosProhibidos,
        alimentosPreferidos: processedDiet.alimentosPreferidos,
        estado: processedDiet.estado
      });
      
      return processedDiet;
    });

    // Use headerKeys to ensure the data is properly mapped to the table columns
    return (
      <TableWithActions
        headers={headerLabels}
        headerKeys={headerKeys} // Add this line to pass the exact keys
        data={tableData}
        renderCell={renderCell}
        onRowClick={(item) => {
          console.log('Row clicked:', item);
        }}
      />
    );
  };

  const fetchDietas = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/dietas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al obtener las dietas');
      }

      const data = await response.json();
      console.log('Raw diets data from API:', data);

      // Guardamos los datos completos de las dietas
      const dietasCompletas = data;

      const filteredData = data.map((diet: any) => {
        // Parse restricciones if it's a string
        let alergias = '';
        let prohibidos = '';
        let preferidos = '';
        
        console.log('Processing diet in fetchDietas:', diet._id, 'Restricciones:', diet.restricciones);
        
        if (diet.restricciones) {
          if (typeof diet.restricciones === 'string') {
            try {
              // Try to parse as JSON
              const restriccionesObj = JSON.parse(diet.restricciones);
              console.log('Successfully parsed restricciones:', restriccionesObj);
              alergias = restriccionesObj.alergiasIntolerancias || '';
              prohibidos = restriccionesObj.alimentosProhibidos || '';
              preferidos = restriccionesObj.alimentosPreferidos || '';
            } catch (e) {
              // If parsing fails, use the string as-is for alergias
              console.log('Using restricciones as plain text:', diet.restricciones, 'Error:', e.message);
              alergias = diet.restricciones;
            }
          } else if (typeof diet.restricciones === 'object') {
            // If it's already an object, use its properties
            console.log('Restricciones is already an object in fetchDietas:', diet.restricciones);
            alergias = diet.restricciones.alergiasIntolerancias || '';
            prohibidos = diet.restricciones.alimentosProhibidos || '';
            preferidos = diet.restricciones.alimentosPreferidos || '';
          }
        } else {
          // Check if the diet has direct properties for these fields
          if (diet.alergiasIntolerancias) {
            if (Array.isArray(diet.alergiasIntolerancias)) {
              alergias = diet.alergiasIntolerancias.join(', ');
            } else {
              alergias = diet.alergiasIntolerancias;
            }
          }
          
          if (diet.alimentosProhibidos) {
            if (Array.isArray(diet.alimentosProhibidos)) {
              prohibidos = diet.alimentosProhibidos.join(', ');
            } else {
              prohibidos = diet.alimentosProhibidos;
            }
          }
          
          if (diet.alimentosPreferidos) {
            if (Array.isArray(diet.alimentosPreferidos)) {
              preferidos = diet.alimentosPreferidos.join(', ');
            } else {
              preferidos = diet.alimentosPreferidos;
            }
          }
        }

        // Create a processed diet object with all required fields
        const processedDiet = {
          _id: diet._id,
          nombre: diet.nombre,
          cliente: diet.cliente.nombre,
          fechaInicio: new Date(diet.fechaInicio).toLocaleDateString('es-ES'),
          objetivo: diet.objetivo,
          restricciones: diet.restricciones,
          alergiasIntolerancias: alergias,
          alimentosProhibidos: prohibidos,
          alimentosPreferidos: preferidos,
          estado: diet.estado,
          originalDiet: diet,
        };
        
        console.log('Processed diet in fetchDietas with fields:', {
          nombre: processedDiet.nombre,
          cliente: processedDiet.cliente,
          fechaInicio: processedDiet.fechaInicio,
          objetivo: processedDiet.objetivo,
          alergiasIntolerancias: processedDiet.alergiasIntolerancias,
          alimentosProhibidos: processedDiet.alimentosProhibidos,
          alimentosPreferidos: processedDiet.alimentosPreferidos,
          estado: processedDiet.estado
        });
        
        return processedDiet;
      });

      console.log('Final filtered diet data:', filteredData);
      setDietData(filteredData);
    } catch (err: any) {
      console.error('Error in fetchDietas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/comidas', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        switch (response.status) {
          case 401:
            throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
          case 403:
            throw new Error('No tiene permisos para acceder a esta información.');
          case 404:
            throw new Error('No se encontró el recurso solicitado. Por favor, verifique la URL.');
          case 500:
            throw new Error('Error interno del servidor. Por favor, intente más tarde.');
          default:
            throw new Error(`Error al obtener los alimentos (${response.status})`);
        }
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        throw new Error('El formato de datos recibido no es válido');
      }

      const filteredData = data.map((food: any) => ({
        nombre: food.nombre || 'Sin nombre',
        descripcion: food.descripcion || 'Sin descripción',
        calorias: food.calorias || 0,
        carbohidratos: food.carbohidratos || 0,
        proteinas: food.proteinas || 0,
        grasas: food.grasas || 0,
        categoria: food.categoria || 'Sin categoría',
        acciones: (
          <div className="flex space-x-2">
            <Link to={`/edit-food/${food._id}`}>
              <button className="px-3 py-1 text-sm text-blue-500 hover:text-blue-700 transition-colors">
                Editar
              </button>
            </Link>
          </div>
        ),
      }));

      setFoodData(filteredData);
    } catch (err: any) {
      console.error('Error fetching foods:', err);
      setError(err.message || 'Error al cargar los alimentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showFoods) {
      fetchFoods();
    } else {
      fetchDietas();
    }
  }, [showFoods]);

  const handleDietCreated = () => {
    fetchDietas();
  };

  const handleFoodCreated = () => {
    fetchFoods();
  };

  // Make sure filteredData is using the search term
  const filteredData = applyFilters(showFoods ? foodData : dietData);

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl ${
              isDarkMode
                ? 'bg-gray-700/50 hover:bg-gray-700'
                : 'bg-gray-50 hover:bg-gray-100'
            } transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.color} bg-opacity-20`}>
                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{card.title}</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Margin between stat cards and buttons/search section */}
      <div className="mb-8"></div>

      {/* Buttons and Search */}
      <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={`Buscar ${showFoods ? 'alimentos' : 'planes'}...`}
            className={`w-full px-4 py-3 pl-11 rounded-xl ${
              isDarkMode
                ? 'bg-gray-700/50 text-white placeholder-gray-400 border-gray-600'
                : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
            } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={`absolute left-3 top-3.5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
        </div>
        <Button
          variant="create"
          onClick={() => showFoods ? setIsFoodModalOpen(true) : setIsDietModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          {showFoods ? 'Añadir Alimento' : 'Crear Dieta'}
        </Button>
        
        <Button
          variant="csv"
          onClick={() => {/* Add export logic here */}}
        >
          <Download className="w-5 h-5 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            {showFoods ? 
              <Apple className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> :
              <Salad className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            }
          </motion.div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Cargando {showFoods ? 'alimentos' : 'planes'}...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <X className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className={`rounded-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'
        } border ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {showFoods ? (
            <TableWithActions
              headers={['Nombre', 'Descripción', 'Calorías', 'Carbohidratos', 'Proteínas', 'Grasas', 'Categoría', 'Acciones']}
              data={filteredData}
              renderCell={renderCell}
              onRowClick={(item) => {
                console.log('Row clicked:', item);
              }}
            />
          ) : (
            <>
              {console.log('About to render diet table with data:', filteredData)}
              <TableWithActions
                headers={['Nombre', 'Cliente', 'Fecha Inicio', 'Objetivo', 'Alergias/Intolerancias', 'Alimentos Prohibidos', 'Alimentos Preferidos', 'Estado', 'Acciones']}
                data={filteredData}
                renderCell={renderCell}
                onRowClick={(item) => {
                  console.log('Row clicked:', item);
                }}
              />
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isDietModalOpen}
        onClose={() => setIsDietModalOpen(false)}
        title="Crear Nueva Dieta"
      >
        <CrearDietasPopup
          onClose={() => setIsDietModalOpen(false)}
          onDietCreated={() => {
            setIsDietModalOpen(false);
            fetchDietas();
          }}
        />
      </Modal>

      {isFoodModalOpen && (
        <CrearComidaPopup
          onClose={() => setIsFoodModalOpen(false)}
          onCreate={handleFoodCreated}
        />
      )}

      {/* Add VerDietaPopup Modal */}
      {selectedDiet && (
        <VerDietaPopup
          isOpen={isViewDietModalOpen}
          onClose={() => {
            setIsViewDietModalOpen(false);
            setSelectedDiet(null);
          }}
          dietData={selectedDiet}
        />
      )}
    </div>
  );
};

export default DietList;