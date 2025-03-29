import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, X, Save, List, Edit3, Trash2 } from 'lucide-react';
import Button from '../../Common/Button';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Importar jwt-decode

interface PreguntaPredefinida {
  id: string;
  texto: string;
  categoria: string;
  tipo: string;
  opciones?: { texto: string; valor: string }[]; // Added opciones field for selection types
}

const preguntasPredefinidas: PreguntaPredefinida[] = [
  {
    id: '1',
    texto: 'Especifica tu edad en años',
    categoria: 'Datos Personales',
    tipo: 'numero'
  },
  { 
    id: '2', 
    texto: 'Selecciona tu género', 
    categoria: 'Datos Personales',
    tipo: 'seleccion'
  },
  {
    id: '3',
    texto: 'Especifica tu peso actual en kilogramos',
    categoria: 'Datos Corporales',
    tipo: 'numero'
  },
  {
    id: '4',
    texto: 'Especifica tu altura en centímetros',
    categoria: 'Datos Corporales',
    tipo: 'numero'
  },
  {
    id: '5',
    texto:
      'Detalla cualquier lesión o condición médica que pueda afectar tu entrenamiento',
    categoria: 'Salud',
    tipo: 'texto'
  },
  {
    id: '6',
    texto: 'Selecciona tu nivel de experiencia en entrenamiento físico',
    categoria: 'Experiencia',
    tipo: 'seleccion'
  },
  {
    id: '7',
    texto:
      'Selecciona tu nivel de actividad física fuera de las sesiones de entrenamiento',
    categoria: 'Actividad Diaria',
    tipo: 'seleccion'
  },
  {
    id: '8',
    texto:
      '¿Cuántas horas por semana puedes dedicar al entrenamiento? ¿Cuántas sesiones por semana?',
    categoria: 'Disponibilidad',
    tipo: 'numero'
  },
  {
    id: '9',
    texto:
      'Selecciona el equipamiento con el que cuentas para tus entrenamientos',
    categoria: 'Equipamiento',
    tipo: 'multiple'
  },
  {
    id: '10',
    texto: 'Especifica los deportes que has practicado previamente',
    categoria: 'Experiencia',
    tipo: 'multiple'
  },
  {
    id: '11',
    texto: 'Selecciona tu principal objetivo de entrenamiento',
    categoria: 'Objetivo',
    tipo: 'seleccion'
  },
  {
    id: '12',
    texto:
      'Si tienes experiencia en el gimnasio, selecciona tus ejercicios favoritos',
    categoria: 'Preferencias',
    tipo: 'multiple'
  },
  {
    id: '13',
    texto:
      'Indica el peso máximo que puedes levantar en una repetición para ejercicios como sentadilla, press de banca y peso muerto (si lo sabes)',
    categoria: 'Rendimiento',
    tipo: 'numero'
  },
  {
    id: '14',
    texto:
      'Si lo prefieres, proporciona tus medidas (circunferencia de cintura, cadera, brazos, etc.) o sube una foto de progreso (opcional)',
    categoria: 'Datos Corporales',
    tipo: 'texto'
  },
  {
    id: '15',
    texto: 'Si conoces tu porcentaje de grasa corporal, por favor indícalo',
    categoria: 'Datos Corporales',
    tipo: 'numero'
  },
  {
    id: '16',
    texto:
      'En una escala del 1 al 10, ¿cómo describirías tu nivel de estrés actual?',
    categoria: 'Bienestar',
    tipo: 'rango'
  },
  {
    id: '17',
    texto:
      'En una escala del 1 al 10, ¿qué tan motivado te sientes para entrenar?',
    categoria: 'Motivación',
    tipo: 'rango'
  },
  {
    id: '18',
    texto:
      'Deja cualquier comentario adicional o información que creas que deberíamos saber para personalizar mejor tu entrenamiento',
    categoria: 'Comentarios',
    tipo: 'texto'
  },
];

interface CuestionarioPlantilla {
  id: string;
  titulo: string;
  preguntas: PreguntaPredefinida[];
}

const cuestionariosPlantilla: CuestionarioPlantilla[] = [
  {
    id: 'pre-entrenamiento',
    titulo: 'Cuestionario Pre-entrenamiento',
    preguntas: [
      {
        id: 'p1',
        texto: '¿Cómo de fatigado te sientes el día de hoy? (escala del 1 a 5)',
        categoria: 'Fatiga',
        tipo: 'rango'
      },
      {
        id: 'p2',
        texto: '¿Cómo te sientes el día de hoy/ Como de motivado te sientes (escala 1/5)',
        categoria: 'Motivación',
        tipo: 'rango'
      },
      {
        id: 'p3',
        texto: '¿Cómo de bien te has alimentado hoy? (escala 1/5)',
        categoria: 'Nutrición',
        tipo: 'rango'
      },
    ],
  },
  {
    id: 'post-entrenamiento',
    titulo: 'Cuestionario Post-entrenamiento',
    preguntas: [
      {
        id: 'p4',
        texto: '¿Cómo de intenso has percibido esta sesión de entrenamiento?',
        categoria: 'Intensidad',
        tipo: 'rango'
      },
    ],
  },
];

interface CrearCuestionarioProps {
  onClose: () => void;
  onSave: (cuestionario: any) => void;
}

interface DecodedToken {
  id: string; // Asegúrate de que este campo coincide con el que contiene el ID del entrenador en tu token
  // Otros campos que puedas tener en el token
}

const TIPOS_PREGUNTA = [
  { value: 'rango', label: 'Rango (1-5)' },
  { value: 'numero', label: 'Número' },
  { value: 'texto', label: 'Texto libre' },
  { value: 'seleccion', label: 'Selección única' },
  { value: 'multiple', label: 'Selección múltiple' },
  { value: 'opciones', label: 'Opciones personalizadas' }, // New type
  { value: 'boolean', label: 'Sí/No' } // New type
];

const CrearCuestionario: React.FC<CrearCuestionarioProps> = ({
  onClose,
  onSave,
}) => {
  // Modify the theme usage to provide a fallback
  let theme = 'light'; // Default theme
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch (error) {
    console.warn('ThemeContext not available, using default theme');
  }
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState('semanal');
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<PreguntaPredefinida[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [categoriaNuevaPregunta, setCategoriaNuevaPregunta] = useState('');
  const [tipoNuevaPregunta, setTipoNuevaPregunta] = useState('');
  const [opcionesPregunta, setOpcionesPregunta] = useState<{ texto: string; valor: string }[]>([]);
  const [nuevaOpcion, setNuevaOpcion] = useState({ texto: '', valor: '' });
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<CuestionarioPlantilla | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar la solicitud de guardar el cuestionario
  const handleGuardar = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Obtener el token desde localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }

      // Decodificar el token para obtener el ID del entrenador
      const decoded: DecodedToken = jwtDecode(token);
      const entrenadorId = decoded.id;

      if (!entrenadorId) {
        throw new Error('No se pudo extraer el ID del entrenador del token.');
      }

      // Construir el objeto del cuestionario
      const cuestionario = {
        titulo,
        descripcion,
        frecuencia,
        preguntas: preguntasSeleccionadas.map(p => ({
          texto: p.texto,
          categoria: p.categoria,
          tipo: p.tipo,
          opciones: p.opciones // Include options if they exist
        })),
        entrenador: entrenadorId,
      };

      // Realizar la solicitud POST al backend
      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/cuestionarios/',
        cuestionario,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Manejar la respuesta exitosa
      onSave(response.data);
      onClose();
    } catch (err: any) {
      console.error('Error al crear el cuestionario:', err);
      setError(err.response?.data?.mensaje || err.message || 'Error al crear el cuestionario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funciones para manejar preguntas y plantillas (sin cambios)
  const handleAgregarPreguntaPredefinida = (pregunta: PreguntaPredefinida) => {
    if (!preguntasSeleccionadas.find((p) => p.id === pregunta.id)) {
      setPreguntasSeleccionadas([...preguntasSeleccionadas, pregunta]);
    }
  };

  const handleAgregarPreguntaPersonalizada = () => {
    if (nuevaPregunta.trim() && categoriaNuevaPregunta.trim() && tipoNuevaPregunta.trim()) {
      const nuevaPreguntaObj = {
        id: `custom-${Date.now()}`,
        texto: nuevaPregunta,
        categoria: categoriaNuevaPregunta,
        tipo: tipoNuevaPregunta,
        opciones: tipoNuevaPregunta === 'opciones' ? [...opcionesPregunta] : undefined
      };
      setPreguntasSeleccionadas([...preguntasSeleccionadas, nuevaPreguntaObj]);
      setNuevaPregunta('');
      setCategoriaNuevaPregunta('');
      setTipoNuevaPregunta('');
      setOpcionesPregunta([]);
    }
  };

  const handleRemoverPregunta = (id: string) => {
    setPreguntasSeleccionadas(
      preguntasSeleccionadas.filter((p) => p.id !== id)
    );
  };

  const handleSeleccionarPlantilla = (plantilla: CuestionarioPlantilla) => {
    setPlantillaSeleccionada(plantilla);
    setTitulo(plantilla.titulo);
    setPreguntasSeleccionadas(plantilla.preguntas);
  };
  const handleAgregarOpcion = () => {
    if (nuevaOpcion.texto.trim() && nuevaOpcion.valor.trim()) {
      setOpcionesPregunta([...opcionesPregunta, { ...nuevaOpcion }]);
      setNuevaOpcion({ texto: '', valor: '' });
    }
  };

  // Add this function to handle removing options
  const handleRemoverOpcion = (index: number) => {
    setOpcionesPregunta(opcionesPregunta.filter((_, i) => i !== index));
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${
          theme === 'dark' ? 'bg-gray-800/95' : 'bg-white'
        } rounded-2xl shadow-2xl w-full max-w-4xl max-h-[98vh] overflow-hidden border-2 ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        } backdrop-blur-xl backdrop-saturate-150`}
      >
        {/* Header with enhanced gradient */}
        <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20 flex justify-between items-center bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-pink-500/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Crear Nuevo Cuestionario
          </h2>
          <Button 
            variant="normal" 
            onClick={onClose}
            className="hover:rotate-90 transition-transform duration-300 hover:bg-gray-100/10 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content with enhanced scrollbar and sections */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70">
          <div className="space-y-8">
            {/* Información básica with glass effect */}
            <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold flex items-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                <Edit3 className="w-5 h-5 mr-2" />
                Información Básica
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título del Cuestionario</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Evaluación Inicial de Fitness"
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe el propósito de este cuestionario..."
                    rows={3}
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Frecuencia</label>
                  <select
                    value={frecuencia}
                    onChange={(e) => setFrecuencia(e.target.value)}
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="diaria">Diaria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="unica">Única vez</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Selección de plantilla with enhanced hover effects */}
            <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5 border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold flex items-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                <List className="w-5 h-5 mr-2" />
                Seleccionar Plantilla
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cuestionariosPlantilla.map((plantilla) => (
                  <motion.div
                    key={plantilla.id}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/80'
                    } cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 border border-transparent hover:border-blue-500/20 backdrop-blur-sm`}
                    onClick={() => handleSeleccionarPlantilla(plantilla)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        {plantilla.titulo}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Preguntas predefinidas */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <List className="w-5 h-5 mr-2" />
                Preguntas Predefinidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preguntasPredefinidas.map((pregunta) => (
                  <motion.div
                    key={pregunta.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    } cursor-pointer transition-all duration-300`}
                    onClick={() => handleAgregarPreguntaPredefinida(pregunta)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="flex-1">{pregunta.texto}</p>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        {pregunta.categoria}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Nueva pregunta personalizada */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Edit3 className="w-5 h-5 mr-2" />
                Agregar Pregunta Personalizada
              </h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={nuevaPregunta}
                  onChange={(e) => setNuevaPregunta(e.target.value)}
                  placeholder="Escribe tu pregunta"
                  className={`flex-1 p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  type="text"
                  value={categoriaNuevaPregunta}
                  onChange={(e) => setCategoriaNuevaPregunta(e.target.value)}
                  placeholder="Categoría"
                  className={`w-40 p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <select
                  value={tipoNuevaPregunta}
                  onChange={(e) => setTipoNuevaPregunta(e.target.value)}
                  className={`w-40 p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Seleccionar tipo</option>
                  {TIPOS_PREGUNTA.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="create"
                  onClick={handleAgregarPreguntaPersonalizada}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Opciones para preguntas de tipo 'opciones' */}
              {tipoNuevaPregunta === 'opciones' && (
                <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <h4 className="text-md font-medium mb-2">Opciones de respuesta</h4>
                  
                  {/* Lista de opciones ya agregadas */}
                  {opcionesPregunta.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {opcionesPregunta.map((opcion, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-600">
                          <div>
                            <span className="font-medium">{opcion.texto}</span>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({opcion.valor})</span>
                          </div>
                          <Button
                            variant="danger"
                            onClick={() => handleRemoverOpcion(index)}
                            className="ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Formulario para agregar nueva opción */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={nuevaOpcion.texto}
                      onChange={(e) => setNuevaOpcion({...nuevaOpcion, texto: e.target.value})}
                      placeholder="Texto de la opción"
                      className={`flex-1 p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                    <input
                      type="text"
                      value={nuevaOpcion.valor}
                      onChange={(e) => setNuevaOpcion({...nuevaOpcion, valor: e.target.value})}
                      placeholder="Valor"
                      className={`w-32 p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                    <Button
                      variant="create"
                      onClick={handleAgregarOpcion}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Preguntas seleccionadas */}
            {preguntasSeleccionadas.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Preguntas Seleccionadas
                </h3>
                <div className="space-y-2">
                  {preguntasSeleccionadas.map((pregunta, index) => (
                    <motion.div
                      key={pregunta.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <span className="mr-4">{index + 1}.</span>
                      <div className="flex-1">
                        <p>{pregunta.texto}</p>
                        {pregunta.opciones && pregunta.opciones.length > 0 && (
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <p>Opciones: {pregunta.opciones.map(o => o.texto).join(', ')}</p>
                          </div>
                        )}
                      </div>
                      <span
                        className={`mx-2 px-2 py-1 rounded-full text-xs ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        {pregunta.categoria}
                      </span>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoverPregunta(pregunta.id)}
                        className="ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar mensaje de error si existe */}
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer with enhanced gradient and button effects */}
        <div className="p-6 border-t border-gray-200/20 dark:border-gray-700/20 flex justify-end space-x-4 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
          <Button 
            variant="normal" 
            onClick={onClose}
            className="hover:bg-gray-200/20 dark:hover:bg-gray-700/30 transition-all duration-300 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            variant="create"
            onClick={handleGuardar}
            disabled={!titulo || preguntasSeleccionadas.length === 0 || isSubmitting}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-blue-500/20"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cuestionario'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CrearCuestionario;
