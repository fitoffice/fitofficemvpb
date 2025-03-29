import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, FileUp, Check, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface CSVRoutinePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

interface CSVPreviewData {
  headers: string[];
  rows: string[][];
}

const CSVRoutinePopup: React.FC<CSVRoutinePopupProps> = ({ isOpen, onClose, onImport }) => {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [previewData, setPreviewData] = useState<CSVPreviewData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [fieldMapping, setFieldMapping] = useState<{[key: string]: string}>({});
  const [mappingErrors, setMappingErrors] = useState<string[]>([]);

  // Crear el elemento del portal cuando el componente se monta
  useEffect(() => {
    const element = document.getElementById('csv-popup-portal') || document.createElement('div');
    if (!document.getElementById('csv-popup-portal')) {
      element.id = 'csv-popup-portal';
      document.body.appendChild(element);
    }
    setPortalElement(element);

    // Limpiar el elemento del portal cuando el componente se desmonta
    return () => {
      if (element.parentNode && !document.getElementById('csv-popup-portal')) {
        document.body.removeChild(element);
      }
    };
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
        parseCSVFile(droppedFile);
      } else {
        setError('El archivo debe ser de tipo CSV');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        parseCSVFile(selectedFile);
      } else {
        setError('El archivo debe ser de tipo CSV');
      }
    }
  };

  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => 
          row.split(',').map(cell => cell.trim())
        );
        
        if (rows.length < 2) {
          setError('El archivo CSV debe contener al menos una fila de encabezados y una fila de datos');
          return;
        }
        
        const headers = rows[0];
        const dataRows = rows.slice(1).filter(row => row.length === headers.length && row.some(cell => cell !== ''));
        
        if (dataRows.length === 0) {
          setError('No se encontraron datos válidos en el archivo CSV');
          return;
        }
        
        setPreviewData({
          headers,
          rows: dataRows.slice(0, 5) // Mostrar solo las primeras 5 filas para la vista previa
        });
        
        // Configurar el mapeo de campos predeterminado
        const defaultMapping: {[key: string]: string} = {};
        headers.forEach((header, index) => {
          const headerLower = header.toLowerCase();
          if (headerLower.includes('ejercicio') || headerLower.includes('exercise')) {
            defaultMapping[index.toString()] = 'ejercicios';
          } else if (headerLower.includes('serie') || headerLower.includes('set')) {
            defaultMapping[index.toString()] = 'series';
          } else if (headerLower.includes('repeticion') || headerLower.includes('rep')) {
            defaultMapping[index.toString()] = 'repeticiones';
          } else if (headerLower.includes('peso') || headerLower.includes('weight')) {
            defaultMapping[index.toString()] = 'peso';
          } else if (headerLower.includes('descanso') || headerLower.includes('rest')) {
            defaultMapping[index.toString()] = 'descanso';
          } else if (headerLower.includes('ritmo') || headerLower.includes('pace')) {
            defaultMapping[index.toString()] = 'ritmo';
          } else if (headerLower.includes('rpe')) {
            defaultMapping[index.toString()] = 'rpe';
          } else if (headerLower.includes('rpm')) {
            defaultMapping[index.toString()] = 'rpm';
          } else if (headerLower.includes('rir')) {
            defaultMapping[index.toString()] = 'rir';
          } else if (headerLower.includes('velocidad') || headerLower.includes('speed')) {
            defaultMapping[index.toString()] = 'speed';
          } else if (headerLower.includes('cadencia') || headerLower.includes('cadence')) {
            defaultMapping[index.toString()] = 'cadence';
          } else if (headerLower.includes('distancia') || headerLower.includes('distance')) {
            defaultMapping[index.toString()] = 'distance';
          } else if (headerLower.includes('altura') || headerLower.includes('height')) {
            defaultMapping[index.toString()] = 'height';
          } else if (headerLower.includes('caloria') || headerLower.includes('calorie')) {
            defaultMapping[index.toString()] = 'calories';
          } else if (headerLower.includes('ronda') || headerLower.includes('round')) {
            defaultMapping[index.toString()] = 'round';
          } else if ((headerLower.includes('serie') || headerLower.includes('set')) && 
                     (headerLower.includes('repeticion') || headerLower.includes('rep'))) {
            defaultMapping[index.toString()] = 'series+reps';
          } else {
            defaultMapping[index.toString()] = '';
          }
        });
        
        setFieldMapping(defaultMapping);
      } catch (err) {
        setError('Error al analizar el archivo CSV');
        console.error(err);
      }
    };
    
    reader.onerror = () => {
      setError('Error al leer el archivo CSV');
    };
    
    reader.readAsText(file);
  };

  const handleFieldMappingChange = (headerIndex: string, value: string) => {
    setFieldMapping(prev => {
      // If trying to add a new mapping (not just changing or removing)
      if (value !== '' && !prev[headerIndex]) {
        const currentMappedCount = Object.values(prev).filter(v => v !== '').length;
        
        // If already at 5 mappings and trying to add another one
        if (currentMappedCount >= 5) {
          setError('Solo puedes mapear un máximo de 5 campos');
          return prev; // Don't allow the change
        }
      }
      
      const newMapping = {
        ...prev,
        [headerIndex]: value
      };
      
      // Validate mapping when changed
      validateMapping(newMapping);
      
      return newMapping;
    });
  };
  const validateMapping = (mapping: {[key: string]: string}) => {
    const errors: string[] = [];
    const mappedValues = Object.values(mapping).filter(value => value !== '');
    const hasExerciseField = mappedValues.includes('ejercicios');
    
    if (!hasExerciseField) {
      errors.push('El campo "Ejercicios" es obligatorio');
    }
    
    if (mappedValues.length < 3) {
      errors.push('Debes mapear al menos 3 campos');
    }
    
    if (mappedValues.length > 5) {
      errors.push('Solo puedes mapear un máximo de 5 campos');
    }
    
    setMappingErrors(errors);
    return errors;
  };

  const handlePreview = () => {
    if (!file) {
      setError('Por favor selecciona un archivo CSV');
      return;
    }
    
    setShowPreview(true);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo CSV');
      return;
    }
    
    // Validate mapping before import
    validateMapping(fieldMapping);
    
    if (mappingErrors.length > 0) {
      setError(mappingErrors.join('. '));
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await onImport(file);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setFile(null);
        setSuccess(false);
        setShowPreview(false);
        setPreviewData(null);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar el archivo');
    } finally {
      setIsLoading(false);
    }
  };
  const handleBackToUpload = () => {
    setShowPreview(false);
  };

  if (!isOpen || !portalElement) return null;

  // Usar ReactDOM.createPortal para renderizar el componente en el portal
  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-3xl p-6 rounded-xl max-h-[80vh] flex flex-col ${
          theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        } shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {showPreview ? 'Validar Campos CSV' : 'Importar Rutinas desde CSV'}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 pr-2">

        {!showPreview ? (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-8 mb-4 border-2 border-dashed rounded-lg text-center transition-colors ${
                isDragging
                  ? theme === 'dark'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-blue-500 bg-blue-100/50'
                  : theme === 'dark'
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <Check className={`w-12 h-12 mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {file.name}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className={`mt-2 text-sm ${
                      theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
                    }`}
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FileUp className={`w-12 h-12 mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Arrastra y suelta tu archivo CSV aquí
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    o
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Seleccionar archivo
                  </button>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className={`p-3 mb-4 rounded-lg flex items-center ${
                theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                <AlertCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className={`p-3 mb-4 rounded-lg flex items-center ${
                theme === 'dark' ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                <Check className="w-5 h-5 mr-2" />
                <p className="text-sm">¡Archivo importado con éxito!</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                onClick={onClose}
                variant="secondary"
                className={`${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePreview}
                disabled={!file || isLoading}
                className={`flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } ${(!file || isLoading) && 'opacity-50 cursor-not-allowed'}`}
              >
                <Eye className="w-4 h-4" />
                Previsualizar
              </Button>
            </div>
          </>
        ) : (
          <>
            {previewData && (
                            <div className={`mb-4 p-5 rounded-xl ${
                              theme === 'dark' ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <h3 className={`text-lg font-semibold mb-4 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-800'
                              }`}>
                                Información de la Rutina
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex flex-col">
                                  <label className={`text-sm font-medium mb-1 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    Nombre de la Rutina
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Ej: Rutina de Fuerza Semanal"
                                    className={`p-2.5 rounded-lg border ${
                                      theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className={`text-sm font-medium mb-1 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    Tags/Categorías
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Ej: fuerza, hipertrofia, principiante"
                                    className={`p-2.5 rounded-lg border ${
                                      theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                  />
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                  <label className={`text-sm font-medium mb-1 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    Descripción
                                  </label>
                                  <textarea
                                    placeholder="Breve descripción de la rutina..."
                                    rows={2}
                                    className={`p-2.5 rounded-lg border resize-none ${
                                      theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                  />
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                  <label className={`text-sm font-medium mb-1 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    Notas Adicionales
                                  </label>
                                  <textarea
                                    placeholder="Cualquier información adicional sobre la rutina..."
                                    rows={2}
                                    className={`p-2.5 rounded-lg border resize-none ${
                                      theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                  />
                                </div>
                              </div>
              
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                  <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
                                </div>
                                <div className="relative flex justify-center">
                                  <span className={`px-3 ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                                    Configuración de Campos
                                  </span>
                                </div>
                              </div>
              
                              <h3 className={`text-lg font-semibold my-4 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-800'
                              }`}>
                                Mapeo de Campos
                              </h3>
                              <p className={`text-sm mb-4 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                Asigna cada columna del CSV a un campo correspondiente de la rutina:
                              </p>
                              <div className={`mb-6 p-4 rounded-xl border ${
                                theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : 'bg-gray-50 border-gray-200'
                              } shadow-sm`}>
                                <h4 className={`text-base font-semibold mb-3 flex items-center ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                                }`}>
                                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19" stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z" stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 17H15" stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 13H15" stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Formato de CSV
                                </h4>
                                <p className={`text-xs mb-4 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Selecciona cómo se interpretarán los datos de tu archivo CSV:
                                </p>
                                <div className="space-y-3">
                                  <label className={`flex items-start p-3 rounded-lg border transition-colors cursor-pointer ${
                                    theme === 'dark' 
                                      ? 'border-gray-700 hover:bg-gray-700/30' 
                                      : 'border-gray-200 hover:bg-gray-100/50'
                                  }`}>
                                    <input 
                                      type="radio" 
                                      name="csvFormat" 
                                      value="commaDelimited" 
                                      defaultChecked 
                                      className={`mt-0.5 mr-3 ${
                                        theme === 'dark' ? 'accent-blue-500' : 'accent-blue-600'
                                      }`}
                                    />
                                    <div>
                                      <span className={`text-sm font-medium block ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                                      }`}>
                                        Cada set estará dividido por comas
                                      </span>
                                      <span className={`text-xs ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                      }`}>
                                        Ideal para archivos donde cada fila representa un ejercicio con múltiples sets.
                                      </span>
                                    </div>
                                  </label>
                                  
                                  <label className={`flex items-start p-3 rounded-lg border transition-colors cursor-pointer ${
                                    theme === 'dark' 
                                      ? 'border-gray-700 hover:bg-gray-700/30' 
                                      : 'border-gray-200 hover:bg-gray-100/50'
                                  }`}>
                                    <input 
                                      type="radio" 
                                      name="csvFormat" 
                                      value="sameVariable" 
                                      className={`mt-0.5 mr-3 ${
                                        theme === 'dark' ? 'accent-blue-500' : 'accent-blue-600'
                                      }`}
                                    />
                                    <div>
                                      <span className={`text-sm font-medium block ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                                      }`}>
                                        Misma variable para todos los sets
                                      </span>
                                      <span className={`text-xs ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                      }`}>
                                        Útil cuando todos los sets de un ejercicio tienen los mismos valores.
                                      </span>
                                    </div>
                                  </label>
                                  
                                  <label className={`flex items-start p-3 rounded-lg border transition-colors cursor-pointer ${
                                    theme === 'dark' 
                                      ? 'border-gray-700 hover:bg-gray-700/30' 
                                      : 'border-gray-200 hover:bg-gray-100/50'
                                  }`}>
                                    <input 
                                      type="radio" 
                                      name="csvFormat" 
                                      value="exercisePerSet" 
                                      className={`mt-0.5 mr-3 ${
                                        theme === 'dark' ? 'accent-blue-500' : 'accent-blue-600'
                                      }`}
                                    />
                                    <div>
                                      <span className={`text-sm font-medium block ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                                      }`}>
                                        Cada vez que se nombra el ejercicio es un set
                                      </span>
                                      <span className={`text-xs ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                      }`}>
                                        Para archivos donde cada fila representa un set individual.
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {previewData.headers.map((header, index) => (
                                  <div key={index} className={`flex flex-col p-3 rounded-lg ${
                                    fieldMapping[index.toString()] 
                                      ? theme === 'dark' 
                                        ? 'bg-blue-900/20 border border-blue-800/30' 
                                        : 'bg-blue-50 border border-blue-200'
                                      : theme === 'dark'
                                        ? 'bg-gray-800/50 border border-gray-700'
                                        : 'bg-white border border-gray-200'
                                  }`}>
                                                       <label className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {header}
                      {fieldMapping[index.toString()] === 'ejercicios' && (
                        <span className={`ml-2 text-xs font-normal ${
                          theme === 'dark' ? 'text-green-300' : 'text-green-600'
                        }`}>
                          (Obligatorio)
                        </span>
                      )}
                    </label>

                                    <select
                      value={fieldMapping[index.toString()] || ''}
                      onChange={(e) => handleFieldMappingChange(index.toString(), e.target.value)}
                      className={`p-2 rounded-md border ${
                        fieldMapping[index.toString()] === 'ejercicios'
                          ? theme === 'dark'
                            ? 'bg-green-800/30 border-green-600 text-white focus:ring-green-500 focus:border-green-500'
                            : 'bg-green-50 border-green-300 text-gray-800 focus:ring-green-500 focus:border-green-500'
                          : theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    >

                                      <option value="">No mapear</option>
                                      <option value="ejercicios">Ejercicios</option>
                                      <option value="series">Series</option>
                                      <option value="repeticiones">Repeticiones</option>
                                      <option value="peso">Peso</option>
                                      <option value="descanso">Descanso</option>
                                      <option value="ritmo">Ritmo</option>
                                      <option value="rpe">RPE</option>
                                      <option value="rpm">RPM</option>
                                      <option value="rir">RIR</option>
                                      <option value="speed">Velocidad</option>
                                      <option value="cadence">Cadencia</option>
                                      <option value="distance">Distancia</option>
                                      <option value="height">Altura</option>
                                      <option value="calories">Calorías</option>
                                      <option value="round">Ronda</option>
                                      <option value="series+reps">Series+Repeticiones</option>
                                    </select>
                                  </div>
                                ))}
                              </div>
              
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                  <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
                                </div>
                                <div className="relative flex justify-center">
                                  <span className={`px-3 ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                                    Previsualización
                                  </span>
                                </div>
                              </div>
              
                              <h3 className={`text-lg font-semibold my-4 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-800'
                              }`}>
                                Vista Previa de Datos
                              </h3>
                              
                              <div className={`overflow-x-auto rounded-lg border shadow-sm ${
                                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                              }`}>
                                <table className={`min-w-full divide-y ${
                                  theme === 'dark' ? 'divide-gray-600' : 'divide-gray-200'
                                }`}>
                                  <thead className={`${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                                  }`}>
                                    <tr>
                                      {previewData.headers.map((header, index) => (
                                        <th 
                                          key={index}
                                          className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                          } ${fieldMapping[index.toString()] 
                                              ? theme === 'dark' 
                                                ? 'bg-blue-900/30' 
                                                : 'bg-blue-100'
                                              : ''
                                            }`}
                                        >
                                          {header}
                                          {fieldMapping[index.toString()] && (
                                            <span className={`ml-2 text-xs font-normal ${
                                              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                                            }`}>
                                              → {fieldMapping[index.toString()]}
                                            </span>
                                          )}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className={`divide-y ${
                                    theme === 'dark' ? 'divide-gray-600' : 'divide-gray-200'
                                  }`}>
                                    {previewData.rows.map((row, rowIndex) => (
                                      <tr key={rowIndex} className={`${
                                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                      } ${rowIndex % 2 === 0 ? '' : theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'} hover:${
                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                      }`}>
                                        {row.map((cell, cellIndex) => (
                                          <td 
                                            key={cellIndex}
                                            className={`px-4 py-2.5 text-sm ${
                                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            } ${fieldMapping[cellIndex.toString()] 
                                                ? theme === 'dark' 
                                                  ? 'bg-blue-900/20' 
                                                  : 'bg-blue-50'
                                                : ''
                                              }`}
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className={`mt-5 p-4 rounded-lg flex items-start ${
                theme === 'dark' ? 'bg-blue-900/20 text-blue-200 border border-blue-800/30' : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                <div className="flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    <strong>Nota:</strong> El campo "Ejercicios" es obligatorio y debes mapear entre 3 y 5 campos en total. Los campos no mapeados serán ignorados durante la importación.
                  </p>
                </div>
              </div>
            </div>
            )}

            {error && (
              <div className={`p-3 mb-4 rounded-lg flex items-center ${
                theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                <AlertCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className={`p-3 mb-4 rounded-lg flex items-center ${
                theme === 'dark' ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                <Check className="w-5 h-5 mr-2" />
                <p className="text-sm">¡Archivo importado con éxito!</p>
              </div>
            )}

            <div className="flex justify-between gap-2">
              <Button
                onClick={handleBackToUpload}
                variant="secondary"
                className={`flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Volver
              </Button>
              <Button
                onClick={handleImport}
                disabled={isLoading}
                className={`flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-500 hover:bg-green-600'
                } ${isLoading && 'opacity-50 cursor-not-allowed'}`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Importando...
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    Importar
                  </>
                )}
              </Button>
            </div>
          </>
        )}
        </div>
      </motion.div>
    </motion.div>,
    portalElement
  );
};

export default CSVRoutinePopup;