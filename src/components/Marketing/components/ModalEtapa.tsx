import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Wand2, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const VARIABLES_DISPONIBLES = [
  { nombre: 'nombre', valor: '{{nombre}}' },
  { nombre: 'apellido', valor: '{{apellido}}' },
  { nombre: 'correo', valor: '{{correo}}' },
  { nombre: 'edad', valor: '{{edad}}' }
];

interface Variante {
  nombre: string;
  valor: string;
}

interface Segmento {
  _id: string;
  name: string;
  variables?: { [key: string]: any };
}

interface ModalEtapaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (emailData: {
    asunto: string;
    contenido: string;
    variantes: Variante[];
  }) => void;
  segmentosSeleccionados: Segmento[];
}

export function ModalEtapa({ isOpen, onClose, onSave, segmentosSeleccionados }: ModalEtapaProps) {
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [variablesSeleccionadas, setVariablesSeleccionadas] = useState<Variante[]>([]);
  const [erroresVariables, setErroresVariables] = useState<string[]>([]);
  
  // Estados para la generación de contenido
  const [tematica, setTematica] = useState('');
  const [tono, setTono] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Estados para controlar los desplegables
  const [showGeneracionContenido, setShowGeneracionContenido] = useState(false);
  const [showVariablesGuide, setShowVariablesGuide] = useState(false);

  const verificarVariables = (nombreVariable: string) => {
    const errores: string[] = [];
    segmentosSeleccionados.forEach(segmento => {
      if (!segmento.variables || !segmento.variables[nombreVariable]) {
        errores.push(`El segmento "${segmento.name}" no contiene información sobre la variable "${nombreVariable}"`);
      }
    });
    return errores;
  };

  const toggleVariable = (variable: Variante) => {
    const errores = verificarVariables(variable.nombre);
    setErroresVariables(errores);
    
    if (errores.length === 0) {
      const isSelected = variablesSeleccionadas.some(v => v.nombre === variable.nombre);
      if (isSelected) {
        setVariablesSeleccionadas(variablesSeleccionadas.filter(v => v.nombre !== variable.nombre));
      } else {
        setVariablesSeleccionadas([...variablesSeleccionadas, variable]);
      }
    }
  };

  const handleGenerarContenido = async () => {
    setIsGenerating(true);
    try {
      // Log the data being sent to the API
      console.log('Enviando datos a la API:', { 
        tematica,
        tono,
        instrucciones
      });
      
      // Send the three inputs as separate fields to the specified endpoint
      const response = await axios.post('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campanas-correo/generar-correo-ia', { 
        tematica,
        tono,
        instrucciones
      });
      
      // Log the response from the API
      console.log('Respuesta de la API:', response.data);
      
      setContenido(response.data.contenido);
    } catch (error) {
      console.error('Error al generar contenido:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGuardar = () => {
    onSave({
      asunto,
      contenido,
      variantes: variablesSeleccionadas
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Crear Nuevo Correo</h2>
          <button onClick={onClose} className="text-white hover:bg-blue-600 rounded-full p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Campos de Email - Ahora primero */}
            <div className="space-y-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Información del Email</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto del Email
                </label>
                <input
                  type="text"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Hola \{\{nombre\}\}, tenemos una oferta para ti"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido del Email
                </label>
                <textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-48"
                  placeholder={"Estimado/a {{nombre}} {{apellido}},\n\nEsperamos que te encuentres bien. Hemos preparado una oferta especial pensando en ti...\n\nTe enviaremos más detalles a {{correo}}.\n\n¡Gracias por tu preferencia!"}
                />
              </div>
            </div>

            {/* Sección de Variables */}
            <div className="space-y-4 bg-white p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Variables Disponibles</h3>
                <button 
                  onClick={() => setShowVariablesGuide(!showVariablesGuide)}
                  className="text-blue-600 hover:bg-blue-50 rounded-full p-1"
                  aria-label="Mostrar guía de variables"
                >
                  <Info className="h-5 w-5" />
                </button>
              </div>
              
              {showVariablesGuide && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-2">
                  <h4 className="font-medium text-blue-800 mb-2">Cómo usar las variables</h4>
                  <p className="text-blue-700 mb-3 text-sm">
                    Para personalizar tu correo, puedes usar las variables seleccionadas en cualquier parte del asunto o contenido.
                    Simplemente escribe el nombre de la variable entre dobles llaves.
                  </p>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ejemplo de uso:</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>{"Asunto: \"Hola {{nombre}}, tenemos una oferta especial para ti\""}</p>
                      <p>{"Contenido: \"Estimado/a {{nombre}} {{apellido}}\""}</p>
                      <p>{"Hemos visto que tienes {{edad}} años y queremos ofrecerte..."}</p>
                      <p>{"Te enviaremos los detalles a {{correo}}."}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-blue-700">Variables disponibles:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {VARIABLES_DISPONIBLES.map((variable) => (
                        <code key={variable.nombre} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {variable.valor}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {VARIABLES_DISPONIBLES.map((variable) => {
                  const isSelected = variablesSeleccionadas.some(v => v.nombre === variable.nombre);
                  return (
                    <button
                      key={variable.nombre}
                      onClick={() => toggleVariable(variable)}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-500 text-blue-700' 
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      <span className="font-medium">{variable.nombre}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                    </button>
                  );
                })}
              </div>

              {erroresVariables.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Errores de Variables</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {erroresVariables.map((error, index) => (
                      <li key={index} className="text-red-600 text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sección de Generación de Contenido - Ahora desplegable */}
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <button 
                onClick={() => setShowGeneracionContenido(!showGeneracionContenido)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-800">Generación de Contenido</h3>
                {showGeneracionContenido ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              
              {showGeneracionContenido && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temática del Email
                      </label>
                      <input
                        type="text"
                        value={tematica}
                        onChange={(e) => setTematica(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="Ej: Promoción de productos fitness"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tono del Email
                      </label>
                      <input
                        type="text"
                        value={tono}
                        onChange={(e) => setTono(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="Ej: Profesional y amigable"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrucciones Específicas
                    </label>
                    <textarea
                      value={instrucciones}
                      onChange={(e) => setInstrucciones(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
                      placeholder="Ej: Email conciso, máximo 150 palabras, mencionar 3 ventajas principales"
                    />
                  </div>
                  <button
                    onClick={handleGenerarContenido}
                    disabled={isGenerating}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    {isGenerating ? 'Generando...' : 'Generar Contenido'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}