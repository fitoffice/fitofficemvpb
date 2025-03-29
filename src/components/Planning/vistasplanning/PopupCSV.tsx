import React, { useState, useRef } from 'react';
import { FileUp, X, ArrowLeft, Check, AlertCircle, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface PopupCSVProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any, importType: 'day' | 'week' | 'multiweek') => void;
}

const PopupCSV: React.FC<PopupCSVProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'select-type' | 'select-file' | 'preview'>('select-type');
  const [importType, setImportType] = useState<'day' | 'week' | 'multiweek' | null>(null);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [useSameCategories, setUseSameCategories] = useState(true);

  const parseCSV = (text: string): CSVData => {
    const lines = text.split('\n').map(line => 
      line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    ).filter(line => line.some(cell => cell !== ''));
    
    return {
      headers: lines[0] || [],
      rows: lines.slice(1)
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const parsedData = parseCSV(text);
          if (parsedData.headers.length === 0) {
            setError('El archivo CSV está vacío o tiene un formato incorrecto');
            return;
          }
          setCsvData(parsedData);
          setStep('preview');
        } catch (err) {
          setError('Error al procesar el archivo CSV');
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setError('Por favor, selecciona un archivo CSV válido');
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!csvData || !importType) {
      setError('No hay datos para importar');
      return;
    }

    onImport({
      type: importType,
      headers: csvData.headers,
      rows: csvData.rows,
      useSameCategories
    }, importType);
    onClose();
  };

  const handleTypeSelect = (type: 'day' | 'week' | 'multiweek') => {
    setImportType(type);
    setStep('select-file');
  };

  const handleBack = () => {
    if (step === 'preview') {
      setStep('select-file');
      setFile(null);
      setCsvData(null);
    } else if (step === 'select-file') {
      setStep('select-type');
      setFile(null);
      setCsvData(null);
    }
    setError('');
  };

  const resetState = () => {
    setStep('select-type');
    setFile(null);
    setError('');
    setImportType(null);
    setCsvData(null);
  };

  const handleCloseComplete = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseComplete}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${
              step === 'preview' ? 'w-[85vw] max-w-6xl' : 'w-[450px]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center">
                <FileUp className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                <h2 className="text-xl font-bold">Importar CSV</h2>
              </div>
              <button 
                onClick={handleCloseComplete}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {step === 'select-type' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                    ¿Qué tipo de datos quieres importar?
                  </p>

                  <div className="space-y-3">
                    {[
                      { type: 'day', label: 'Un día', icon: Calendar },
                      { type: 'week', label: 'Una semana completa', icon: CalendarDays },
                      { type: 'multiweek', label: 'Varias semanas', icon: CalendarRange }
                    ].map((option) => (
                      <motion.button
                        key={option.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTypeSelect(option.type as 'day' | 'week' | 'multiweek')}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                      >
                        <option.icon className="w-6 h-6 mr-3 text-white" />
                        <span className="font-medium">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                            )}

              {step === 'select-file' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="mb-6">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <div className="flex flex-col gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 text-center">
                          Importando datos para: <span className="font-semibold">{
                            importType === 'day' ? 'un día' :
                            importType === 'week' ? 'una semana completa' :
                            'varias semanas'
                          }</span>
                        </p>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <FileUp className="w-10 h-10 text-blue-500 dark:text-blue-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Arrastra tu archivo CSV aquí o
                        </p>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                        >
                          <span>Seleccionar archivo</span>
                        </button>
                      </div>
                    </div>
                    
                    {file && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <p className="text-green-700 dark:text-green-300">
                          Archivo seleccionado: <span className="font-medium">{file.name}</span>
                        </p>
                      </div>
                    )}
                    
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between gap-3 mt-6">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </button>
                    <button
                      onClick={handleCloseComplete}
                      className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'preview' && csvData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        Vista previa de los datos a importar:
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto max-h-[50vh] custom-scrollbar border border-gray-200 dark:border-gray-700 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                          <tr>
                            {csvData.headers.map((header, index) => (
                              <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {csvData.rows.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {csvData.rows.length > 10 && (
                        <div className="py-3 px-6 bg-gray-50 dark:bg-gray-700 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
                          Mostrando 10 de {csvData.rows.length} filas
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Categorías individuales</span>
                      <div className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer" onClick={() => setUseSameCategories(!useSameCategories)}>
                        <input 
                          type="checkbox"
                          checked={useSameCategories}
                          onChange={(e) => setUseSameCategories(e.target.checked)}
                          className="peer sr-only"
                        />
                                                <span 
                          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-md transition-all duration-200 ${
                            useSameCategories ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                        <span className={`absolute inset-0 rounded-full ${useSameCategories ? 'bg-blue-500' : ''} transition-colors`}></span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Mismas categorías</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-3 mt-6">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCloseComplete}
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleImport}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-md"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirmar Importación
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add global styles for custom scrollbar
const globalStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
`;

// Add the styles to the document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = globalStyles;
  document.head.appendChild(styleElement);
}

export default PopupCSV;