import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Image as FabricImage, IText, Rect, Circle } from 'fabric';
import Button from '../Common/Button';
import { 
  Bold, Italic, Type, Image as ImageIcon, 
  Move, Square, Circle as CircleIcon, Minus, 
  RotateCcw, Download, Save
} from 'lucide-react';

interface FabricEditorProps {
  initialImage?: string;
  onSave: (dataUrl: string) => void;
  theme: 'dark' | 'light';
  onClose?: () => void;
}

const FabricEditor: React.FC<FabricEditorProps> = ({
  initialImage,
  onSave,
  theme,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Inicializar el canvas de Fabric
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: theme === 'dark' ? '#1F2937' : '#F3F4F6'
    });

    fabricCanvasRef.current = canvas;

    // Cargar la imagen inicial si existe
    if (initialImage) {
      FabricImage.fromURL(initialImage, (img) => {
        // Ajustar la imagen al tamaño del canvas manteniendo la proporción
        const scale = Math.min(
          canvas.getWidth() / (img.width ?? 1),
          canvas.getHeight() / (img.height ?? 1)
        );
        img.scale(scale);
        canvas.centerObject(img);
        canvas.add(img);
        canvas.renderAll();
      });
    }

    // Event listeners
    canvas.on('selection:created', () => {
      setActiveObject(canvas.getActiveObject());
    });

    canvas.on('selection:cleared', () => {
      setActiveObject(null);
    });

    return () => {
      canvas.dispose();
    };
  }, [initialImage, theme]);

  const addText = () => {
    if (!fabricCanvasRef.current) return;
    const text = new IText('Doble clic para editar', {
      left: 100,
      top: 100,
      fill: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontFamily: 'Arial'
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const addShape = (type: 'rect' | 'circle') => {
    if (!fabricCanvasRef.current) return;
    
    const commonProps = {
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'rgba(255, 99, 71, 0.5)',
      stroke: theme === 'dark' ? '#FFFFFF' : '#000000',
      strokeWidth: 2
    };

    const shape = type === 'rect'
      ? new Rect(commonProps)
      : new Circle({
          ...commonProps,
          radius: 50
        });

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
  };

  const handleStyleChange = (style: 'bold' | 'italic') => {
    if (!fabricCanvasRef.current || !activeObject || !activeObject.isType('i-text')) return;
    
    if (style === 'bold') {
      activeObject.set('fontWeight', activeObject.get('fontWeight') === 'bold' ? 'normal' : 'bold');
    } else {
      activeObject.set('fontStyle', activeObject.get('fontStyle') === 'italic' ? 'normal' : 'italic');
    }
    
    fabricCanvasRef.current.renderAll();
  };

  const handleDelete = () => {
    if (!fabricCanvasRef.current || !activeObject) return;
    fabricCanvasRef.current.remove(activeObject);
    setActiveObject(null);
  };

  const handleSave = () => {
    if (!fabricCanvasRef.current) return;
    const dataUrl = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    });
    onSave(dataUrl);
  };

  const handleDownload = () => {
    if (!fabricCanvasRef.current) return;
    const dataUrl = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    });
    const link = document.createElement('a');
    link.download = 'imagen-editada.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <Button
            onClick={addText}
            variant="outline"
            className="flex items-center gap-2"
            title="Agregar texto"
          >
            <Type size={20} />
          </Button>
          <Button
            onClick={() => addShape('rect')}
            variant="outline"
            className="flex items-center gap-2"
            title="Agregar rectángulo"
          >
            <Square size={20} />
          </Button>
          <Button
            onClick={() => addShape('circle')}
            variant="outline"
            className="flex items-center gap-2"
            title="Agregar círculo"
          >
            <CircleIcon size={20} />
          </Button>
          {activeObject && activeObject.isType('i-text') && (
            <>
              <Button
                onClick={() => handleStyleChange('bold')}
                variant="outline"
                className="flex items-center gap-2"
                title="Negrita"
              >
                <Bold size={20} />
              </Button>
              <Button
                onClick={() => handleStyleChange('italic')}
                variant="outline"
                className="flex items-center gap-2"
                title="Cursiva"
              >
                <Italic size={20} />
              </Button>
            </>
          )}
          {activeObject && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="flex items-center gap-2 text-red-500"
              title="Eliminar elemento"
            >
              <Minus size={20} />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
            title="Descargar imagen"
          >
            <Download size={20} />
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Save size={20} />
            Guardar
          </Button>
          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="flex items-center gap-2"
            >
              Cerrar
            </Button>
          )}
        </div>
      </div>

      <div className={`border-2 rounded-lg ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default FabricEditor;
