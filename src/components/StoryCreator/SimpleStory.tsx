import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ImageUploader from './ImageUploader';
import ImageToolbar from './ImageToolbar';
import { fabric } from 'fabric-pure-browser';
import { Loader, RefreshCw, Zap } from 'react-feather';
import { FaImage } from 'react-icons/fa';

interface SimpleStoryProps {
  onImageSelect: (file: File) => void;
  onGenerateIdeas?: () => void;
  loading?: boolean;
}

const SimpleStory: React.FC<SimpleStoryProps> = ({ onImageSelect, onGenerateIdeas, loading }) => {
  const { theme } = useTheme();
  const [dragOver, setDragOver] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showFramesModal, setShowFramesModal] = useState(false);
  const [showCanvasSizeModal, setShowCanvasSizeModal] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = {
    normal: [],
    grayscale: [new fabric.Image.filters.Grayscale()],
    sepia: [new fabric.Image.filters.Sepia()],
    invert: [new fabric.Image.filters.Invert()],
    blur: [new fabric.Image.filters.Blur({ blur: 0.5 })],
    sharpen: [new fabric.Image.filters.Convolute({
      matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
    })]
  };

  const frames = {
    none: null,
    simple: {
      stroke: '#000000',
      strokeWidth: 10,
      fill: null
    },
    double: {
      stroke: '#000000',
      strokeWidth: 20,
      fill: null,
      strokeDashArray: [10, 5]
    },
    rounded: {
      stroke: '#000000',
      strokeWidth: 10,
      fill: null,
      rx: 20,
      ry: 20
    }
  };

  useEffect(() => {
    let canvas: fabric.Canvas | null = null;
    
    const initCanvas = () => {
      if (canvasRef.current && !fabricCanvasRef.current) {
        canvas = new fabric.Canvas(canvasRef.current, {
          width: 800,
          height: 600,
          backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
          preserveObjectStacking: true
        });
        fabricCanvasRef.current = canvas;
      }
    };

    const timeoutId = setTimeout(initCanvas, 100);

    return () => {
      clearTimeout(timeoutId);
      try {
        if (fabricCanvasRef.current) {
          // First remove all event listeners
          fabricCanvasRef.current.off();
          // Remove all objects without animations
          fabricCanvasRef.current.getObjects().forEach(obj => {
            fabricCanvasRef.current?.remove(obj);
          });
          // Clear the canvas
          fabricCanvasRef.current.clear();
          // Remove the canvas element from DOM
          const canvasEl = fabricCanvasRef.current.getElement();
          canvasEl?.parentNode?.removeChild(canvasEl);
          // Set reference to null
          fabricCanvasRef.current = null;
        }
      } catch (error) {
        console.warn('Error during canvas cleanup:', error);
      }
    };
  }, [theme]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && fabricCanvasRef.current) {
        fabric.Image.fromURL(event.target.result as string, (img) => {
          const canvas = fabricCanvasRef.current!;
          const scale = Math.min(
            canvas.width! / img.width!,
            canvas.height! / img.height!
          ) * 0.8;

          img.scale(scale);
          img.set({
            left: (canvas.width! - img.width! * scale) / 2,
            top: (canvas.height! - img.height! * scale) / 2
          });

          canvas.clear();
          canvas.add(img);
          canvas.renderAll();

          img.set({
            cornerSize: 10,
            cornerColor: theme === 'dark' ? 'white' : 'black',
            cornerStrokeColor: theme === 'dark' ? 'white' : 'black',
            transparentCorners: false,
            borderColor: theme === 'dark' ? 'white' : 'black',
            borderScaleFactor: 2
          });

          canvas.setActiveObject(img);
          setHasImage(true);
          onImageSelect(file);
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRotateRight = () => {
    const activeObject = fabricCanvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 90);
      fabricCanvasRef.current?.renderAll();
    }
  };

  const handleRotateLeft = () => {
    const activeObject = fabricCanvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) - 90);
      fabricCanvasRef.current?.renderAll();
    }
  };

  const handleZoomIn = () => {
    const activeObject = fabricCanvasRef.current?.getActiveObject();
    if (activeObject) {
      const currentScale = activeObject.scaleX || 1;
      activeObject.scale(currentScale * 1.1);
      fabricCanvasRef.current?.renderAll();
    }
  };

  const handleZoomOut = () => {
    const activeObject = fabricCanvasRef.current?.getActiveObject();
    if (activeObject) {
      const currentScale = activeObject.scaleX || 1;
      activeObject.scale(currentScale * 0.9);
      fabricCanvasRef.current?.renderAll();
    }
  };

  const handleDelete = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      setHasImage(false);
    }
  };

  const handleUploadNew = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    if (fabricCanvasRef.current) {
      // Desactivar temporalmente la selección para que no se muestre en la descarga
      const activeObject = fabricCanvasRef.current.getActiveObject();
      if (activeObject) {
        fabricCanvasRef.current.discardActiveObject();
        fabricCanvasRef.current.renderAll();
      }

      // Configurar opciones de exportación para incluir el fondo y mantener la calidad
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        width: fabricCanvasRef.current.width,
        height: fabricCanvasRef.current.height,
        multiplier: 2, // Mayor calidad
        enableRetinaScaling: true,
        withoutTransform: false, // Mantener transformaciones
        withoutShadow: false, // Mantener sombras
        backgroundColor: fabricCanvasRef.current.backgroundColor
      });

      // Crear el enlace de descarga
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas_completo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Restaurar la selección después de la descarga
      if (activeObject) {
        fabricCanvasRef.current.setActiveObject(activeObject);
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  const handleApplyFilter = (filterName: keyof typeof filters) => {
    const activeObject = fabricCanvasRef.current?.getActiveObject() as fabric.Image;
    if (activeObject && activeObject.filters) {
      activeObject.filters = filters[filterName];
      activeObject.applyFilters();
      fabricCanvasRef.current?.renderAll();
    }
    setShowFiltersModal(false);
  };

  const handleApplyFrame = (frameName: keyof typeof frames) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Eliminar marco anterior si existe
    const existingFrame = canvas.getObjects().find(obj => obj.data?.isFrame);
    if (existingFrame) {
      canvas.remove(existingFrame);
    }

    if (frameName === 'none') {
      canvas.renderAll();
      setShowFramesModal(false);
      return;
    }

    const frameStyle = frames[frameName];
    const frame = new fabric.Rect({
      width: canvas.width! - frameStyle.strokeWidth,
      height: canvas.height! - frameStyle.strokeWidth,
      left: frameStyle.strokeWidth / 2,
      top: frameStyle.strokeWidth / 2,
      ...frameStyle,
      data: { isFrame: true },
      selectable: false,
      evented: false
    });

    canvas.add(frame);
    frame.sendToBack();
    canvas.renderAll();
    setShowFramesModal(false);
  };

  const handleCanvasResize = (width: number, height: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const currentObjects = canvas.getObjects();
    const scaleFactor = Math.min(width / canvas.width!, height / canvas.height!);

    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.setBackgroundColor(theme === 'dark' ? '#1f2937' : '#f3f4f6', () => {});

    currentObjects.forEach(obj => {
      obj.scaleX = obj.scaleX! * scaleFactor;
      obj.scaleY = obj.scaleY! * scaleFactor;
      obj.left = obj.left! * (width / canvas.width!);
      obj.top = obj.top! * (height / canvas.height!);
      obj.setCoords();
    });

    canvas.renderAll();
    setShowCanvasSizeModal(false);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('Enviando petición a la API de imágenes:', {
        descripcion: prompt
      });

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/posts/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: prompt
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error de la API:', errorText);
        throw new Error('Error al generar la imageen');
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);

      if (data.imageUrl) {
        console.log('URL de la imagen generada:', data.imageUrl);
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = data.imageUrl;
        
        img.onload = () => {
          console.log('Imagen cargada exitosamente');
          const fabricImage = new fabric.Image(img);
          
          // Ajustar tamaño de la imagen si es necesario
          const maxSize = 500;
          if (fabricImage.width && fabricImage.height) {
            if (fabricImage.width > maxSize || fabricImage.height > maxSize) {
              const scale = Math.min(maxSize / fabricImage.width, maxSize / fabricImage.height);
              fabricImage.scale(scale);
            }
          }

          // Centrar la imagen en el canvas
          if (fabricCanvasRef.current) {
            fabricImage.center();
            fabricCanvasRef.current.add(fabricImage);
            fabricCanvasRef.current.renderAll();
          }
          
          setPrompt('');
        };

        img.onerror = (error) => {
          console.error('Error al cargar la imagen:', error);
          setError('Error al cargar la imagen generadaa');
        };
      } else {
        console.error('Respuesta sin URL de imagen:', data);
        throw new Error('No se pudo obtener la imagen generada');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(err instanceof Error ? err.message : 'Error al generar la imagen');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Historia Simple
          </h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAIMode(!isAIMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isAIMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Zap className={`w-4 h-4 ${isAIMode ? 'text-white' : 'text-gray-500'}`} />
              {isAIMode ? 'Usando IA' : 'Imagen Propia'}
            </button>
          </div>
        </div>

        {!hasImage && (
          <div className="space-y-4">
            {isAIMode ? (
              <div className={`flex flex-col gap-4 p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe la imagen que quieres generar..."
                    className={`flex-1 p-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateImage()}
                  />
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isGenerating || !prompt.trim()
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="animate-spin" size={20} />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Loader size={20} />
                        Generar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Sube una imagen para empezar a crear tu historia.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-4">
          {!hasImage && !isAIMode && (
            <div
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
                dragOver
                  ? theme === 'dark'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-purple-500 bg-purple-50'
                  : theme === 'dark'
                  ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                  handleImageUpload(file);
                }
              }}
            >
              <ImageUploader onImageSelect={handleImageUpload} loading={loading}>
                <div className="flex flex-col items-center gap-4">
                  <FaImage
                    className={`w-12 h-12 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <div className="text-center">
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Arrastra y suelta una imagen o
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}
                    >
                      Haz clic para buscar
                    </p>
                  </div>
                </div>
              </ImageUploader>
            </div>
          )}
          {hasImage && (
            <>
              <ImageToolbar
                onRotateRight={handleRotateRight}
                onRotateLeft={handleRotateLeft}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onDelete={handleDelete}
                onUploadNew={handleUploadNew}
                onDownload={handleDownload}
                onOpenFilters={() => setShowFiltersModal(true)}
                onOpenFrames={() => setShowFramesModal(true)}
                onOpenCanvasSize={() => setShowCanvasSizeModal(true)}
              />
              {/* Modal de Filtros */}
              {showFiltersModal && (
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
                  <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4`}>
                    <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(filters).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => handleApplyFilter(filter as keyof typeof filters)}
                          className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowFiltersModal(false)}
                      className="mt-4 w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              {/* Modal de Marcos */}
              {showFramesModal && (
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
                  <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4`}>
                    <h3 className="text-lg font-semibold mb-4">Marcos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(frames).map((frame) => (
                        <button
                          key={frame}
                          onClick={() => handleApplyFrame(frame as keyof typeof frames)}
                          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          {frame.charAt(0).toUpperCase() + frame.slice(1)}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowFramesModal(false)}
                      className="mt-4 w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              {/* Modal de Tamaño del Canvas */}
              {showCanvasSizeModal && (
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
                  <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4`}>
                    <h3 className="text-lg font-semibold mb-4">Tamaño del Canvas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleCanvasResize(800, 600)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        800 x 600
                      </button>
                      <button
                        onClick={() => handleCanvasResize(1024, 768)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        1024 x 768
                      </button>
                      <button
                        onClick={() => handleCanvasResize(1280, 720)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        1280 x 720 (HD)
                      </button>
                      <button
                        onClick={() => handleCanvasResize(1920, 1080)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        1920 x 1080 (Full HD)
                      </button>
                    </div>
                    <button
                      onClick={() => setShowCanvasSizeModal(false)}
                      className="mt-4 w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div
            className={`w-full border rounded-xl overflow-hidden ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
            style={{ minHeight: '600px' }}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>

        {!hasImage && (
          <div
            className={`flex flex-col gap-4 p-6 rounded-xl ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Instrucciones
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Sube una imagen para comenzar</li>
              <li>Puedes arrastrar, rotar y redimensionar la imagen</li>
              <li>La imagen debe estar en formato PNG, JPG o JPEG</li>
              <li>Tamaño máximo recomendado: 5MB</li>
              <li>Resolución mínima recomendada: 800x600px</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleStory;
