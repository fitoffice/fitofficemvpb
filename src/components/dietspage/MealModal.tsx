import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  Apple,
  Scale,
  Beef,
  Wheat,
  Droplet,
  Search,
  Sparkles,
  Hash,
  Weight,
  Plus,
  Trash2
} from 'lucide-react';
import { Meal, Ingredient } from './views/types';
import { useTheme } from '../../contexts/ThemeContext';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeal?: Meal;
  isEdit?: boolean;
  onSave: (meal: Meal) => void;
  mealTime?: string;
  dietId?: string;         // Add dietId prop
  dayDate?: string;        // Add dayDate prop
  mealId?: string;         // Add mealId for editing
}

// Interfaces para la respuesta de la API
interface ApiAlimento {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

interface ApiComida {
  _id: string;
  nombre: string;
  macronutrientes: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    fibra: number;
  };
  alimentos: ApiAlimento[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Base de datos de alimentos comunes con valores nutricionales por 100g (fallback)
const commonFoods = [
  { name: 'Pollo a la plancha', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Arroz blanco cocido', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { name: 'Huevo entero', calories: 155, protein: 13, carbs: 1.1, fats: 11 },
  { name: 'Atún en agua', calories: 116, protein: 26, carbs: 0, fats: 0.8 },
  { name: 'Pan integral', calories: 247, protein: 13, carbs: 41, fats: 3.4 },
  { name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { name: 'Yogur natural', calories: 59, protein: 3.5, carbs: 4.7, fats: 3.3 },
  { name: 'Avena', calories: 389, protein: 16.9, carbs: 66, fats: 6.9 },
  { name: 'Almendras', calories: 579, protein: 21, carbs: 22, fats: 49 },
  { name: 'Salmón', calories: 208, protein: 22, carbs: 0, fats: 13 }
];

function MealModal({
  isOpen,
  onClose,
  initialMeal,
  isEdit = false,
  onSave,
  mealTime,
  dietId,
  dayDate,
  mealId
}: MealModalProps) {
  const { theme } = useTheme();
  const [meal, setMeal] = useState<Meal>({
    nombre: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    hora: '',
    numero: 1,
    peso: 100, // Default to 100g en lugar de 0
    ingredientes: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Estado para almacenar las comidas de la API
  const [apiComidas, setApiComidas] = useState<ApiComida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para manejar el ingrediente actual antes de añadirlo a la lista
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    nombre: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  // Función para obtener las comidas de la API
  useEffect(() => {
    const fetchComidas = async () => {
      if (isOpen) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/comidas');
          if (!response.ok) {
            throw new Error('Error al obtener las comidas');
          }
          const data = await response.json();
          setApiComidas(data);
        } catch (err) {
          console.error('Error fetching comidas:', err);
          setError('No se pudieron cargar las comidas. Usando datos locales.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchComidas();
  }, [isOpen]);

  // -------------------------------
  // 1. Función para calcular totales
  // -------------------------------
  function calcularTotales(ingredientes: Ingredient[]) {
    const totalCalorias = ingredientes.reduce((acc, ing) => acc + ing.calorias, 0);
    const totalProteinas = ingredientes.reduce((acc, ing) => acc + ing.proteinas, 0);
    const totalCarbohidratos = ingredientes.reduce((acc, ing) => acc + ing.carbohidratos, 0);
    const totalGrasas = ingredientes.reduce((acc, ing) => acc + ing.grasas, 0);

    return {
      calorias: totalCalorias,
      proteinas: totalProteinas,
      carbohidratos: totalCarbohidratos,
      grasas: totalGrasas
    };
  }

  // Se ejecuta al abrir el modal: si es edición, cargamos los datos de la comida inicial
  useEffect(() => {
    if (isOpen && initialMeal && isEdit) {
      setMeal({
        nombre: initialMeal.nombre || '',
        calorias: initialMeal.calorias || 0,
        proteinas: initialMeal.proteinas || 0,
        carbohidratos: initialMeal.carbohidratos || 0,
        grasas: initialMeal.grasas || 0,
        hora: initialMeal.hora || '',
        numero: initialMeal.numero || 1,
        peso: initialMeal.peso || 100, // Default a 100g si no está establecido
        ingredientes: initialMeal.ingredientes || []
      });
    } else if (isOpen && !isEdit) {
      setMeal({
        nombre: '',
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
        hora: mealTime?.split(' - ')[0] || '',
        numero: 1,
        peso: 100, // Default a 100g
        ingredientes: []
      });
    }
  }, [isOpen, initialMeal, isEdit, mealTime]);

  // Cierra las sugerencias si haces click fuera de ellas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejador del cambio de nombre de la comida
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMeal({ ...meal, nombre: value });

    if (value.length > 1) {
      // Buscar en las comidas de la API
      let filtered = [];
      
      if (apiComidas.length > 0) {
        // Buscar en comidas de la API
        filtered = apiComidas
          .filter(comida => comida.nombre.toLowerCase().includes(value.toLowerCase()))
          .map(comida => ({
            id: comida._id,
            name: comida.nombre,
            calories: comida.macronutrientes.calorias,
            protein: comida.macronutrientes.proteinas,
            carbs: comida.macronutrientes.carbohidratos,
            fats: comida.macronutrientes.grasas,
            isApiData: true,
            alimentos: comida.alimentos
          }));
      }
      
      // Si no hay resultados de la API o hay un error, buscar en commonFoods
      if (filtered.length === 0 || error) {
        const localFiltered = commonFoods
          .filter(food => food.name.toLowerCase().includes(value.toLowerCase()))
          .map(food => ({
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fats: food.fats,
            isApiData: false
          }));
        
        filtered = [...filtered, ...localFiltered];
      }
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Al hacer click en una sugerencia, asignamos ese nombre y macros a la comida
  const handleSuggestionClick = (food: any) => {
    if (food.isApiData && food.alimentos) {
      // Si es de la API y tiene alimentos, añadimos todos los alimentos como ingredientes
      const weight = meal.peso || 100;
      const multiplier = weight / 100;
      
      const ingredientes = food.alimentos.map((alimento: ApiAlimento) => ({
        nombre: alimento.nombre,
        calorias: Math.round(alimento.calorias * multiplier),
        proteinas: Math.round(alimento.proteinas * multiplier * 10) / 10,
        carbohidratos: Math.round(alimento.carbohidratos * multiplier * 10) / 10,
        grasas: Math.round(alimento.grasas * multiplier * 10) / 10
      }));
      
      // Calculamos los totales
      const { calorias, proteinas, carbohidratos, grasas } = calcularTotales(ingredientes);
      
      setMeal({
        ...meal,
        nombre: food.name,
        calorias,
        proteinas,
        carbohidratos,
        grasas,
        ingredientes
      });
    } else {
      // Si es de commonFoods o no tiene alimentos, comportamiento original
      const weight = meal.peso || 100;
      const multiplier = weight / 100;
      
      setMeal({
        ...meal,
        nombre: food.name,
        calorias: Math.round(food.calories * multiplier),
        proteinas: Math.round(food.protein * multiplier * 10) / 10,
        carbohidratos: Math.round(food.carbs * multiplier * 10) / 10,
        grasas: Math.round(food.fats * multiplier * 10) / 10
      });
    }
    
    setShowSuggestions(false);
  };

  // Add a new handler for weight changes
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = Number(e.target.value);
    const oldWeight = meal.peso || 100;
    const weightRatio = newWeight / oldWeight;
    
    // Update all ingredients with the new weight ratio
    const updatedIngredientes = meal.ingredientes.map(ingrediente => ({
      ...ingrediente,
      calorias: Math.round(ingrediente.calorias * weightRatio),
      proteinas: Math.round(ingrediente.proteinas * weightRatio * 10) / 10,
      carbohidratos: Math.round(ingrediente.carbohidratos * weightRatio * 10) / 10,
      grasas: Math.round(ingrediente.grasas * weightRatio * 10) / 10
    }));
    
    // Recalculate totals or adjust the meal's macros directly if no ingredients
    if (updatedIngredientes.length > 0) {
      const { calorias, proteinas, carbohidratos, grasas } = calcularTotales(updatedIngredientes);
      
      setMeal({
        ...meal,
        peso: newWeight,
        calorias,
        proteinas,
        carbohidratos,
        grasas,
        ingredientes: updatedIngredientes
      });
    } else {
      // If no ingredients, adjust the meal's macros directly
      setMeal({
        ...meal,
        peso: newWeight,
        calorias: Math.round(meal.calorias * weightRatio),
        proteinas: Math.round(meal.proteinas * weightRatio * 10) / 10,
        carbohidratos: Math.round(meal.carbohidratos * weightRatio * 10) / 10,
        grasas: Math.round(meal.grasas * weightRatio * 10) / 10
      });
    }
  };

  // -----------------------------
  // 2. Búsqueda y añadido de food
  // -----------------------------
  const handleSearchFood = () => {
    // Primero buscar en la API
    const apiMatch = apiComidas.find(
      comida => comida.nombre.toLowerCase() === meal.nombre.toLowerCase()
    );
    
    if (apiMatch) {
      // Si encontramos coincidencia en la API
      const weight = meal.peso || 100;
      const multiplier = weight / 100;
      
      // Crear ingredientes a partir de los alimentos de la API
      const newIngredientes = apiMatch.alimentos.map(alimento => ({
        nombre: alimento.nombre,
        calorias: Math.round(alimento.calorias * multiplier),
        proteinas: Math.round(alimento.proteinas * multiplier * 10) / 10,
        carbohidratos: Math.round(alimento.carbohidratos * multiplier * 10) / 10,
        grasas: Math.round(alimento.grasas * multiplier * 10) / 10
      }));
      
      // Añadimos los nuevos ingredientes a la lista actual
      const allIngredientes = [...meal.ingredientes, ...newIngredientes];
      
      // Recalculamos los totales
      const { calorias, proteinas, carbohidratos, grasas } = calcularTotales(allIngredientes);
      
      setMeal({
        ...meal,
        ingredientes: allIngredientes,
        calorias,
        proteinas,
        carbohidratos,
        grasas
      });
      
      return;
    }
    
    // Si no hay coincidencia en la API, buscar en commonFoods (comportamiento original)
    const matchingFood = commonFoods.find(
      (food) => food.name.toLowerCase() === meal.nombre.toLowerCase()
    );

    if (matchingFood) {
      // Código original para commonFoods
      const weight = meal.peso || 100;
      const multiplier = weight / 100;

      const newIngredient = {
        nombre: matchingFood.name,
        calorias: Math.round(matchingFood.calories * multiplier),
        proteinas: Math.round(matchingFood.protein * multiplier * 10) / 10,
        carbohidratos: Math.round(matchingFood.carbs * multiplier * 10) / 10,
        grasas: Math.round(matchingFood.fats * multiplier * 10) / 10
      };

      const newIngredientes = [...meal.ingredientes, newIngredient];
      const { calorias, proteinas, carbohidratos, grasas } = calcularTotales(newIngredientes);

      setMeal({
        ...meal,
        ingredientes: newIngredientes,
        calorias,
        proteinas,
        carbohidratos,
        grasas
      });
    }
  };

  // -------------------------------------
  // 3. Añadir y eliminar ingredientes a mano
  // -------------------------------------
  const handleAddIngredient = () => {
    if (currentIngredient.nombre.trim() === '') return;

    const newIngredient = {
      nombre: currentIngredient.nombre,
      calorias: Number(currentIngredient.calorias),
      proteinas: Number(currentIngredient.proteinas),
      carbohidratos: Number(currentIngredient.carbohidratos),
      grasas: Number(currentIngredient.grasas)
    };

    const newIngredientes = [...meal.ingredientes, newIngredient];

    // Recalcular totales con la nueva lista de ingredientes
    const { calorias, proteinas, carbohidratos, grasas } =
      calcularTotales(newIngredientes);

    setMeal({
      ...meal,
      ingredientes: newIngredientes,
      calorias,
      proteinas,
      carbohidratos,
      grasas
    });

    // Reseteamos el ingrediente actual
    setCurrentIngredient({
      nombre: '',
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredientes = [...meal.ingredientes];
    updatedIngredientes.splice(index, 1);

    // Recalcular totales tras eliminar
    const { calorias, proteinas, carbohidratos, grasas } =
      calcularTotales(updatedIngredientes);

    setMeal({
      ...meal,
      ingredientes: updatedIngredientes,
      calorias,
      proteinas,
      carbohidratos,
      grasas
    });
  };

  // ------------------------------------
  // 4. Al enviar, guardamos la comida con ingredientes y totales
  // ------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si no hay ingredientes, creamos uno por defecto con la info de la comida
    let finalIngredientes = meal.ingredientes;
    if (finalIngredientes.length === 0) {
      finalIngredientes = [
        {
          nombre: meal.nombre,
          calorias: Number(meal.calorias),
          proteinas: Number(meal.proteinas),
          carbohidratos: Number(meal.carbohidratos),
          grasas: Number(meal.grasas)
        }
      ];
    }

    // Preparamos la comida final asegurándonos de que todos los campos sean correctos
    const finalMeal = {
      nombre: meal.nombre,
      calorias: Number(meal.calorias) || 0,
      proteinas: Number(meal.proteinas) || 0,
      carbohidratos: Number(meal.carbohidratos) || 0,
      grasas: Number(meal.grasas) || 0,
      hora: meal.hora || '',
      numero: Number(meal.numero) || 1,
      peso: Number(meal.peso) || 100,
      ingredientes: finalIngredientes
    };

    // Si tenemos dietId y dayDate, realizamos la petición a la API
    if (dietId && dayDate) {
      try {
        console.log('\n🍽️ GUARDANDO COMIDA:');
        console.log('Comida a guardar:', finalMeal);

        // Obtenemos el token del almacenamiento local
        const token = localStorage.getItem('token');

        // Construimos la URL base
        let endpoint = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/dietas/${dietId}/dias/${dayDate}/comidas`;
        let method = 'POST';

        // Si es edición y tenemos el mealId, actualizamos el endpoint y el método
        if (isEdit && mealId) {
          endpoint = `${endpoint}/${mealId}`;
          method = 'PUT';
        }

        // Mostramos en consola los datos que se enviarán
        console.log('\n📊 DATOS ENVIADOS A LA API:', {
          url: endpoint,
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer [token]'
          },
          body: JSON.stringify(finalMeal, null, 2)
        });

        // Limpiamos el objeto para evitar propiedades circulares
        const cleanedMeal = JSON.parse(JSON.stringify(finalMeal));

        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(cleanedMeal)
        });

        if (!response.ok) {
          throw new Error('Error al guardar la comida');
        }

        const savedMeal = await response.json();
        console.log('✅ Comida guardada correctamente:', savedMeal);

        // Llamamos al callback con la comida guardada
        onSave(savedMeal);
      } catch (error) {
        console.error('❌ Error al guardar la comida:', error);
        // En caso de error, pasamos la comida al callback para que la UI se actualice
        onSave(finalMeal);
      }
    } else {
      // Si no tenemos dietId o dayDate, simplemente llamamos al callback
      onSave(finalMeal);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
      onClick={() => onClose()}
    >
      <div
        className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'} rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} sticky top-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} z-10 rounded-t-2xl`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} flex items-center gap-3`}>
                {isEdit ? 'Editar Comida' : 'Añadir Nueva Comida'}
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Completa los detalles de tu comida
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-xl transition-all duration-200 group`}
            >
              <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} group-hover:scale-110 transition-transform`} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Nombre de la comida */}
              <div className="relative">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <div className="flex items-center space-x-2">
                    <Apple className="w-4 h-4 text-amber-600" />
                    <span>Nombre de la comida</span>
                  </div>
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={meal.nombre}
                      onChange={handleNameChange}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-600 focus:border-blue-600' : 'bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500'} border rounded-xl transition-all`}
                      placeholder="Ej: Pollo a la plancha"
                      required
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        ref={suggestionRef}
                        className={`absolute z-10 w-full mt-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-lg border max-h-60 overflow-auto`}
                      >
                        {suggestions.map((food, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`w-full px-4 py-3 text-left ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center justify-between group transition-all duration-200`}
                            onClick={() => handleSuggestionClick(food)}
                          >
                            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'}`}>
                              {food.name}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-medium px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                {food.calories} kcal
                              </span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                                {food.protein}g prot
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchFood}
                    className={`px-4 py-3 ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} rounded-xl transition-all duration-200 flex items-center space-x-2 group`}
                  >
                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Buscar</span>
                  </button>
                </div>
              </div>

              {/* Número y Peso */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-green-600" />
                      <span>Número</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={meal.numero}
                    onChange={(e) => setMeal({ ...meal, numero: Number(e.target.value) })}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-green-600 focus:border-green-600' : 'bg-white border-gray-200 focus:ring-green-500 focus:border-green-500'} border rounded-xl transition-all`}
                    placeholder="Número de comida"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Weight className="w-4 h-4 text-orange-600" />
                      <span>Peso (g)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={meal.peso}
                    onChange={handleWeightChange}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-orange-600 focus:border-orange-600' : 'bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500'} border rounded-xl transition-all`}
                    placeholder="Peso en gramos"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Hora */}
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Hora</span>
                  </div>
                </label>
                <input
                  type="time"
                  value={meal.hora}
                  onChange={(e) => setMeal({ ...meal, hora: e.target.value })}
                  className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-600 focus:border-blue-600' : 'bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500'} border rounded-xl transition-all`}
                  required
                />
              </div>

              {/* Calorías, Proteínas, Carbohidratos y Grasas */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/30' : 'bg-gradient-to-br from-amber-50 to-amber-100/50'} p-4 rounded-xl`}>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-amber-300' : 'text-amber-800'} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Scale className={`w-4 h-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                      <span>Calorías</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={meal.calorias}
                    onChange={(e) => {
                      const value = e.target.value.replace(',', '.');
                      setMeal({ ...meal, calorias: Number(value) || 0 });
                    }}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-amber-700 text-gray-100 focus:ring-amber-600 focus:border-amber-600' : 'bg-white border-amber-200 focus:ring-amber-500 focus:border-amber-500'} border rounded-xl transition-all`}
                    placeholder="kcal"
                    required
                    min="0"
                  />
                </div>

                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-red-900/30 to-red-800/30' : 'bg-gradient-to-br from-red-50 to-red-100/50'} p-4 rounded-xl`}>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-800'} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Beef className={`w-4 h-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                      <span>Proteínas</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={meal.proteinas}
                    onChange={(e) => {
                      const value = e.target.value.replace(',', '.');
                      setMeal({ ...meal, proteinas: Number(value) || 0 });
                    }}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-red-700 text-gray-100 focus:ring-red-600 focus:border-red-600' : 'bg-white border-red-200 focus:ring-red-500 focus:border-red-500'} border rounded-xl transition-all`}
                    placeholder="gramos"
                    required
                    min="0"
                  />
                </div>

                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-blue-100/50'} p-4 rounded-xl`}>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Wheat className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span>Carbohidratos</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={meal.carbohidratos}
                    onChange={(e) => {
                      const value = e.target.value.replace(',', '.');
                      setMeal({ ...meal, carbohidratos: Number(value) || 0 });
                    }}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-blue-700 text-gray-100 focus:ring-blue-600 focus:border-blue-600' : 'bg-white border-blue-200 focus:ring-blue-500 focus:border-blue-500'} border rounded-xl transition-all`}
                    placeholder="gramos"
                    required
                    min="0"
                  />
                </div>

                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/30' : 'bg-gradient-to-br from-purple-50 to-purple-100/50'} p-4 rounded-xl`}>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'} mb-2`}>
                    <div className="flex items-center space-x-2">
                      <Droplet className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <span>Grasas</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={meal.grasas}
                    onChange={(e) => {
                      const value = e.target.value.replace(',', '.');
                      setMeal({ ...meal, grasas: Number(value) || 0 });
                    }}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-purple-700 text-gray-100 focus:ring-purple-600 focus:border-purple-600' : 'bg-white border-purple-200 focus:ring-purple-500 focus:border-purple-500'} border rounded-xl transition-all`}
                    placeholder="gramos"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Ingredientes */}
              <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                  <Apple className="w-5 h-5 text-green-600" />
                  Ingredientes
                </h3>

                {/* Lista de ingredientes actuales */}
                {meal.ingredientes.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {meal.ingredientes.map((ingrediente, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-800'} p-3 rounded-lg`}
                      >
                        <div>
                          <p className="font-medium">{ingrediente.nombre}</p>
                          <div className={`flex gap-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            <span>{ingrediente.calorias} kcal</span>
                            <span>•</span>
                            <span>{ingrediente.proteinas}g prot</span>
                            <span>•</span>
                            <span>{ingrediente.carbohidratos}g carbs</span>
                            <span>•</span>
                            <span>{ingrediente.grasas}g grasas</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className={`p-2 ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'} rounded-full transition-colors`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario para añadir un nuevo ingrediente */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-xl`}>
                  <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Añadir nuevo ingrediente
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={currentIngredient.nombre}
                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, nombre: e.target.value })}
                        className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'} rounded-lg text-sm`}
                        placeholder="Ej: Arroz, Pollo, etc."
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          Calorías
                        </label>
                        <input
                          type="text"
                          value={currentIngredient.calorias}
                          onChange={(e) => {
                            const value = e.target.value.replace(',', '.');
                            setCurrentIngredient({ ...currentIngredient, calorias: Number(value) || 0 });
                          }}
                          className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'} rounded-lg text-sm`}
                          placeholder="kcal"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          Proteínas
                        </label>
                        <input
                          type="text"
                          value={currentIngredient.proteinas}
                          onChange={(e) => {
                            const value = e.target.value.replace(',', '.');
                            setCurrentIngredient({ ...currentIngredient, proteinas: Number(value) || 0 });
                          }}
                          className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'} rounded-lg text-sm`}
                          placeholder="g"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          Carbos
                        </label>
                        <input
                          type="text"
                          value={currentIngredient.carbohidratos}
                          onChange={(e) => {
                            const value = e.target.value.replace(',', '.');
                            setCurrentIngredient({ ...currentIngredient, carbohidratos: Number(value) || 0 });
                          }}
                          className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'} rounded-lg text-sm`}
                          placeholder="g"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          Grasas
                        </label>
                        <input
                          type="text"
                          value={currentIngredient.grasas}
                          onChange={(e) => {
                            const value = e.target.value.replace(',', '.');
                            setCurrentIngredient({ ...currentIngredient, grasas: Number(value) || 0 });
                          }}
                          className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'} rounded-lg text-sm`}
                          placeholder="g"
                          min="0"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className={`w-full mt-2 ${theme === 'dark' ? 'bg-green-900/30 text-green-400 border-green-800 hover:bg-green-800/40' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'} border px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors`}
                    >
                      <Plus className="w-4 h-4" />
                      Añadir Ingrediente
                    </button>
                  </div>
                </div>
              </div>

              <div className={`flex space-x-3 pt-4 sticky bottom-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} pb-2`}>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isEdit ? 'Guardar Cambios' : 'Añadir Comida'}
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} rounded-xl font-medium transition-all duration-200`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MealModal;