import React, { useRef, useState } from 'react';
import { Upload, Edit2, Layout, ChevronDown, ChevronRight, Download, Trash2 } from 'lucide-react';
import Button from '../Common/Button';
import FabricEditor from './FabricEditor';

interface CarouselCreatorProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  theme: 'dark' | 'light';
  isLoading?: boolean;
}

interface FrameTemplate {
  id: string;
  name: string;
  className: string;
  overlayClass: string;
}

interface CarouselFrame {
  id: string;
  name: string;
  wrapperClass: string;
  innerClass: string;
}

interface ImageFilter {
  id: string;
  name: string;
  className: string;
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
    hueRotate?: string;
    blur?: string;
  };
}

const frameTemplates: FrameTemplate[] = [
  {
    id: 'simple',
    name: 'Simple',
    className: 'rounded-lg',
    overlayClass: ''
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    className: 'rounded-sm p-2 bg-white dark:bg-gray-800 shadow-lg transform rotate-1',
    overlayClass: 'p-4 bg-white'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    className: 'rounded-sm sepia border-8 border-amber-900',
    overlayClass: 'bg-amber-50/20'
  },
  {
    id: 'modern',
    name: 'Moderno',
    className: 'rounded-xl shadow-2xl',
    overlayClass: 'bg-gradient-to-b from-transparent to-black/50'
  },
  {
    id: 'circle',
    name: 'Círculo',
    className: 'rounded-full',
    overlayClass: ''
  },
  {
    id: 'neon',
    name: 'Neón',
    className: 'rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.5)] border-2 border-cyan-400',
    overlayClass: 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20'
  },
  {
    id: 'film',
    name: 'Película',
    className: 'rounded-sm border-[16px] border-black relative after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-4 after:bg-black',
    overlayClass: 'grayscale'
  },
  {
    id: 'watercolor',
    name: 'Acuarela',
    className: 'rounded-lg [mask-image:url("/masks/watercolor.png")] overflow-hidden',
    overlayClass: 'bg-gradient-to-br from-purple-200/30 to-pink-200/30'
  },
  {
    id: 'torn',
    name: 'Papel Roto',
    className: 'rounded-none [mask-image:url("/masks/torn-paper.png")] transform -rotate-1',
    overlayClass: 'bg-gradient-to-t from-gray-100/40 to-transparent'
  },
  {
    id: 'diamond',
    name: 'Diamante',
    className: 'rounded-none transform rotate-45 overflow-hidden',
    overlayClass: 'bg-gradient-to-br from-blue-400/20 to-purple-400/20'
  },
  {
    id: 'gothic',
    name: 'Gótico',
    className: 'rounded-lg border-8 border-double border-gray-800 dark:border-gray-200 shadow-inner',
    overlayClass: 'bg-gradient-to-b from-gray-900/30 to-gray-900/60'
  },
  {
    id: 'tropical',
    name: 'Tropical',
    className: 'rounded-lg border-4 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)]',
    overlayClass: 'bg-gradient-to-r from-teal-400/20 to-yellow-400/20'
  }
];

const carouselFrames: CarouselFrame[] = [
  {
    id: 'none',
    name: 'Sin marco',
    wrapperClass: '',
    innerClass: ''
  },
  {
    id: 'classic',
    name: 'Marco Clásico',
    wrapperClass: 'p-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl',
    innerClass: 'border-8 border-amber-100 dark:border-amber-900'
  },
  {
    id: 'modern',
    name: 'Moderno',
    wrapperClass: 'p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg',
    innerClass: 'backdrop-blur-sm bg-white/10 dark:bg-black/10'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    wrapperClass: 'p-4 bg-gray-50 dark:bg-gray-900 shadow-sm rounded-lg',
    innerClass: 'border border-gray-200 dark:border-gray-700'
  },
  {
    id: 'fancy',
    name: 'Elegante',
    wrapperClass: 'p-8 bg-gradient-to-br from-rose-100 to-teal-100 dark:from-rose-900 dark:to-teal-900 rounded-xl shadow-2xl',
    innerClass: 'border-4 border-white/50 dark:border-black/50 backdrop-blur'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    wrapperClass: 'p-6 bg-amber-50 dark:bg-amber-900 shadow-inner',
    innerClass: 'border-[12px] border-double border-amber-900/30 dark:border-amber-100/30'
  },
  {
    id: 'neon-glow',
    name: 'Neón Brillante',
    wrapperClass: 'p-6 bg-gray-900 rounded-lg shadow-[0_0_30px_rgba(94,234,212,0.3)]',
    innerClass: 'border-2 border-teal-400 bg-gradient-to-br from-purple-900/50 to-teal-900/50'
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    wrapperClass: 'p-8 bg-black rounded-lg',
    innerClass: 'border-8 border-double border-yellow-500 bg-gradient-to-r from-yellow-100/10 to-yellow-900/10'
  },
  {
    id: 'paper',
    name: 'Papel Antiguo',
    wrapperClass: 'p-6 bg-amber-50 dark:bg-amber-900 shadow-md transform rotate-1',
    innerClass: 'border-4 border-dashed border-amber-900/30 dark:border-amber-100/30 -rotate-1'
  },
  {
    id: 'futuristic',
    name: 'Futurista',
    wrapperClass: 'p-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-lg shadow-lg',
    innerClass: 'border border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-transparent backdrop-blur-sm'
  },
  {
    id: 'watercolor',
    name: 'Acuarela',
    wrapperClass: 'p-8 bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900 dark:to-blue-900 rounded-xl',
    innerClass: 'border-4 border-white/30 dark:border-black/30 shadow-inner'
  },
  {
    id: 'botanical',
    name: 'Botánico',
    wrapperClass: 'p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg',
    innerClass: 'border-8 border-double border-green-700/30 dark:border-green-300/30'
  },
  {
    id: 'geometric',
    name: 'Geométrico',
    wrapperClass: 'p-6 bg-white dark:bg-gray-800 rounded-lg transform rotate-2',
    innerClass: 'border-4 border-indigo-500 [clip-path:polygon(5%_0,95%_0,100%_5%,100%_95%,95%_100%,5%_100%,0_95%,0_5%)] -rotate-2'
  },
  {
    id: 'cosmic',
    name: 'Cósmico',
    wrapperClass: 'p-8 bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 rounded-xl',
    innerClass: 'border-2 border-purple-500/50 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_rgba(0,0,0,0)_70%)]'
  },
  {
    id: 'retro-tech',
    name: 'Retro Tech',
    wrapperClass: 'p-6 bg-gradient-to-r from-cyan-900 to-blue-900 rounded-sm',
    innerClass: 'border-t-4 border-l-4 border-cyan-400 border-r-4 border-b-4 border-r-cyan-600 border-b-cyan-600'
  }
];

const imageFilters: ImageFilter[] = [
  {
    id: 'none',
    name: 'Normal',
    className: ''
  },
  {
    id: 'vintage',
    name: 'Vintage',
    className: 'sepia brightness-90 contrast-110'
  },
  {
    id: 'dramatic',
    name: 'Dramático',
    className: 'contrast-125 saturate-150'
  },
  {
    id: 'bw',
    name: 'Blanco y Negro',
    className: 'grayscale'
  },
  {
    id: 'fade',
    name: 'Desvanecido',
    className: 'brightness-110 contrast-90 saturate-75'
  },
  {
    id: 'cold',
    name: 'Frío',
    className: 'brightness-100 contrast-100 saturate-100 hue-rotate-180'
  },
  {
    id: 'warm',
    name: 'Cálido',
    className: 'brightness-105 saturate-125 sepia-[.25]'
  },
  {
    id: 'retro',
    name: 'Retro',
    className: 'sepia brightness-95 contrast-105'
  },
  {
    id: 'cinema',
    name: 'Cinema',
    className: 'contrast-125 saturate-85 brightness-95'
  },
  {
    id: 'mist',
    name: 'Neblina',
    className: 'brightness-105 contrast-90 saturate-90 backdrop-blur-sm'
  },
  {
    id: 'vivid',
    name: 'Vívido',
    className: 'brightness-105 contrast-110 saturate-150'
  },
  {
    id: 'dream',
    name: 'Soñador',
    className: 'brightness-110 contrast-95 saturate-90 blur-[0.5px]'
  },
  {
    id: 'neon',
    name: 'Neón',
    className: 'brightness-110 contrast-125 saturate-200 hue-rotate-[330deg]'
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    className: 'brightness-105 contrast-105 saturate-125 sepia-[.35] hue-rotate-[330deg]'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    className: 'brightness-110 contrast-150 saturate-150 hue-rotate-[270deg]'
  }
];

const layoutTemplates = [
  {
    id: 'single',
    name: 'Individual',
    gridClass: 'grid-cols-1',
    imageClass: 'aspect-square'
  },
  {
    id: 'grid2',
    name: '2 Columnas',
    gridClass: 'grid-cols-2',
    imageClass: 'aspect-square'
  },
  {
    id: 'grid3',
    name: '3 Columnas',
    gridClass: 'grid-cols-3',
    imageClass: 'aspect-square'
  },
  {
    id: 'masonry',
    name: 'Mosaico',
    gridClass: 'grid-cols-2 md:grid-cols-3',
    imageClass: 'aspect-[3/4] first:col-span-2 first:row-span-2'
  },
  {
    id: 'diagonal',
    name: 'Diagonal',
    gridClass: 'grid-cols-3',
    imageClass: 'aspect-square odd:translate-y-8 transition-transform hover:translate-y-0'
  },
  {
    id: 'pyramid',
    name: 'Pirámide',
    gridClass: 'grid-cols-3',
    imageClass: 'aspect-square first:col-span-3 nth-2:col-span-2 nth-3:col-span-2'
  },
  {
    id: 'staggered',
    name: 'Escalonado',
    gridClass: 'grid-cols-4',
    imageClass: 'aspect-[3/4] odd:translate-y-12 even:-translate-y-12 transition-transform hover:translate-y-0'
  },
  {
    id: 'panoramic',
    name: 'Panorámico',
    gridClass: 'grid-cols-1 md:grid-cols-3',
    imageClass: 'aspect-[16/9] first:col-span-3 hover:scale-105 transition-transform'
  },
  {
    id: 'dynamic',
    name: 'Dinámico',
    gridClass: 'grid-cols-3 auto-rows-min',
    imageClass: 'aspect-square hover:scale-110 transition-transform odd:rotate-2 even:-rotate-2 hover:rotate-0'
  },
  {
    id: 'gallery',
    name: 'Galería',
    gridClass: 'grid-cols-4',
    imageClass: 'aspect-square first:col-span-2 first:row-span-2 nth-2:col-span-2'
  },
  {
    id: 'mosaic',
    name: 'Mosaico Moderno',
    gridClass: 'grid-cols-3',
    imageClass: 'aspect-square first:col-span-2 first:row-span-2 hover:z-10 hover:scale-105 transition-all'
  },
  {
    id: 'cascade',
    name: 'Cascada',
    gridClass: 'grid-cols-3 gap-y-8',
    imageClass: 'aspect-[3/4] transform transition-transform hover:-translate-y-4'
  }
];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  theme: 'dark' | 'light';
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  theme
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${
      theme === 'dark' 
        ? 'border-gray-700 bg-gray-800/50 backdrop-blur-sm' 
        : 'border-gray-200 bg-white/50 backdrop-blur-sm'
    } ${isHovered ? 'shadow-lg transform scale-[1.01]' : 'shadow-md'}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-5 flex items-center justify-between ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-gray-800/80 hover:from-gray-700 hover:to-gray-700/80' 
            : 'bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50'
        } transition-all duration-300`}
      >
        <h5 className="font-medium flex items-center gap-3 text-lg">
          <span className={`transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}>
            <ChevronDown size={24} className={`transition-colors duration-300 ${
              isHovered ? 'text-blue-500' : ''
            }`} />
          </span>
          <span className={`transition-colors duration-300 ${
            isHovered ? 'text-blue-500' : ''
          }`}>{title}</span>
        </h5>
        <div className={`px-3 py-1 rounded-full text-xs ${
          theme === 'dark'
            ? 'bg-gray-700'
            : 'bg-gray-100'
        } transition-colors duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}>
          Click para expandir
        </div>
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen 
            ? 'max-h-[800px] opacity-100 transform translate-y-0' 
            : 'max-h-0 opacity-0 transform -translate-y-4'
        } overflow-hidden`}
      >
        <div className={`p-6 border-t transition-colors duration-300 ${
          theme === 'dark' 
            ? 'border-gray-700 bg-gradient-to-b from-gray-800/50 to-transparent' 
            : 'border-gray-100 bg-gradient-to-b from-gray-50/50 to-transparent'
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const CarouselCreator: React.FC<CarouselCreatorProps> = ({
  images,
  onImagesChange,
  theme,
  isLoading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFrame, setSelectedFrame] = useState<string>('simple');
  const [selectedLayout, setSelectedLayout] = useState<string>('single');
  const [selectedCarouselFrame, setSelectedCarouselFrame] = useState<string>('none');
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    onImagesChange([...images, ...Array.from(files)]);
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    onImagesChange(newImages);
  };

  const handleSaveEdit = async (dataUrl: string) => {
    if (editingImageIndex === null) return;

    // Convertir el dataUrl a File
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `edited-image-${editingImageIndex}.png`, { type: 'image/png' });

    // Actualizar la imagen en el array
    const newImages = [...images];
    newImages[editingImageIndex] = file;
    onImagesChange(newImages);
    setEditingImageIndex(null);
  };

  const handleDownloadAllImages = async () => {
    if (images.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cargar todas las imágenes
    const loadedImages = await Promise.all(
      images.map(
        (image) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(image);
            img.onload = () => {
              URL.revokeObjectURL(img.src);
              resolve(img);
            };
          })
      )
    );

    // Calcular dimensiones basadas en las imágenes
    const maxWidth = Math.max(...loadedImages.map(img => img.width));
    const maxHeight = Math.max(...loadedImages.map(img => img.height));

    // Configurar el tamaño del canvas basado en el layout de Galería
    const imageWidth = maxWidth * 0.8;
    const imageHeight = maxHeight * 0.8;
    const padding = 40;
    const columns = 4; // Layout de Galería
    const rows = Math.ceil(images.length / columns);

    canvas.width = (imageWidth * columns) + (padding * (columns + 1));
    canvas.height = (imageHeight * rows) + (padding * (rows + 1));

    // Aplicar el fondo del marco del carrusel
    if (currentCarouselFrame.wrapperClass.includes('bg-gradient-to-r')) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (theme === 'dark') {
        gradient.addColorStop(0, '#1f2937');
        gradient.addColorStop(1, '#111827');
      } else {
        gradient.addColorStop(0, '#f3f4f6');
        gradient.addColorStop(1, '#ffffff');
      }
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = theme === 'dark' ? '#1f2937' : '#ffffff';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar sombra al marco del carrusel
    if (currentCarouselFrame.wrapperClass.includes('shadow')) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
    }

    // Dibujar el fondo interno del carrusel
    ctx.fillStyle = theme === 'dark' ? '#111827' : '#ffffff';
    if (currentCarouselFrame.innerClass.includes('rounded')) {
      roundRect(ctx, padding, padding, 
               canvas.width - (padding * 2), 
               canvas.height - (padding * 2), 12);
    } else {
      ctx.fillRect(padding, padding, 
                  canvas.width - (padding * 2), 
                  canvas.height - (padding * 2));
    }

    // Función auxiliar para dibujar rectángulos redondeados
    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    }

    // Dibujar cada imagen en el layout de Galería
    loadedImages.forEach((img, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;

      // Calcular posición en el grid
      const x = padding * (col + 1) + imageWidth * col;
      const y = padding * (row + 1) + imageHeight * row;

      ctx.save();

      // Aplicar sombra a la imagen individual
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Dibujar el marco individual
      if (currentFrame.className.includes('rounded')) {
        ctx.beginPath();
        roundRect(ctx, x, y, imageWidth, imageHeight, 8);
        ctx.clip();
      }

      // Dibujar la imagen
      ctx.drawImage(img, x, y, imageWidth, imageHeight);

      // Aplicar filtros
      if (currentFilter.className) {
        const imageData = ctx.getImageData(x, y, imageWidth, imageHeight);
        const data = imageData.data;

        if (currentFilter.className.includes('grayscale')) {
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
        }

        if (currentFilter.className.includes('sepia')) {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          }
        }

        ctx.putImageData(imageData, x, y);
      }

      // Dibujar borde del marco individual si está especificado
      if (currentFrame.className.includes('border')) {
        ctx.strokeStyle = theme === 'dark' ? '#374151' : '#e5e7eb';
        ctx.lineWidth = 2;
        if (currentFrame.className.includes('rounded')) {
          ctx.beginPath();
          roundRect(ctx, x, y, imageWidth, imageHeight, 8);
          ctx.stroke();
        } else {
          ctx.strokeRect(x, y, imageWidth, imageHeight);
        }
      }

      ctx.restore();
    });

    // Convertir el canvas a una imagen y descargarla
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'carrusel_galeria.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);
  };

  const currentLayout = layoutTemplates.find(l => l.id === selectedLayout) || layoutTemplates[0];
  const currentFrame = frameTemplates.find(f => f.id === selectedFrame) || frameTemplates[0];
  const currentCarouselFrame = carouselFrames.find(f => f.id === selectedCarouselFrame) || carouselFrames[0];
  const currentFilter = imageFilters.find(f => f.id === selectedFilter) || imageFilters[0];

  return (
    <div className="space-y-6">
      <div className={`flex flex-col gap-4 p-6 rounded-xl ${
        theme === 'dark'
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
          : 'bg-white/50 backdrop-blur-sm border border-gray-200'
      } transition-all duration-300 shadow-lg`}>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xl flex items-center gap-3">
            <Upload size={24} className="text-blue-500" />
            <span>Subir imágenes para el carrusel</span>
          </h4>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
            </span>
            {images.length > 0 && (
              <Button
                onClick={handleDownloadAllImages}
                variant="outline"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'hover:bg-blue-500/20 hover:border-blue-500'
                    : 'hover:bg-blue-50 hover:border-blue-500'
                }`}
              >
                <Download size={20} />
                Descargar {images.length > 1 ? 'todas' : ''} {images.length === 1 ? 'la imagen' : 'las imágenes'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              theme === 'dark'
                ? 'hover:bg-blue-500/20 hover:border-blue-500'
                : 'hover:bg-blue-50 hover:border-blue-500'
            }`}
            disabled={isLoading}
          >
            <Upload size={20} />
            Subir imágenes
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <CollapsibleSection
            title="Marco del Carrusel"
            theme={theme}
            defaultOpen={true}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {carouselFrames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedCarouselFrame(frame.id)}
                  className={`group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedCarouselFrame === frame.id
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                        : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-blue-400 hover:bg-blue-500/10'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/50'
                  }`}
                >
                  <div className={`w-full aspect-video mb-2 overflow-hidden rounded ${frame.wrapperClass}`}>
                    <div className={`w-full h-full bg-gray-200 dark:bg-gray-700 ${frame.innerClass}`} />
                  </div>
                  <span className="block text-center text-sm">{frame.name}</span>
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Filtros de Imagen"
            theme={theme}
            defaultOpen={false}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imageFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFilter === filter.id
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-blue-500 bg-blue-50'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-blue-400'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="relative w-full aspect-square mb-2 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                    <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 ${filter.className}`} />
                  </div>
                  <span className="block text-center text-sm">{filter.name}</span>
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Marco Individual"
            theme={theme}
            defaultOpen={false}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {frameTemplates.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFrame === frame.id
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-blue-500 bg-blue-50'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-blue-400'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className={`w-full aspect-square mb-2 overflow-hidden ${frame.className}`}>
                    <div className="w-full h-full bg-gray-300" />
                  </div>
                  <span className="block text-center text-sm">{frame.name}</span>
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Diseño del Carrusel"
            theme={theme}
            defaultOpen={false}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {layoutTemplates.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedLayout === layout.id
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-blue-500 bg-blue-50'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-blue-400'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="relative w-full aspect-video mb-2 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                    <div className={`absolute inset-0 grid ${layout.gridClass} gap-1 p-1`}>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`bg-gray-300 dark:bg-gray-600 rounded ${
                            layout.imageClass.split(' ')[0]
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="block text-center text-sm">{layout.name}</span>
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <div className={`mt-8 p-4 rounded-xl ${currentCarouselFrame.wrapperClass} transition-all duration-500 overflow-hidden backdrop-blur-sm ${
            theme === 'dark' ? 'shadow-xl' : 'shadow-lg'
          }`}>
            <div className={currentCarouselFrame.innerClass}>
              <div className={`grid ${currentLayout.gridClass} gap-4`}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group ${currentLayout.imageClass}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className={`relative h-full overflow-hidden ${currentFrame.className}`}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Imagen ${index + 1}`}
                        className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${currentFilter.className}`}
                      />
                      <div className={`absolute inset-0 ${currentFrame.overlayClass}`} />
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => setEditingImageIndex(index)}
                            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                            title="Editar imagen"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => {
                              const newImages = [...images];
                              newImages.splice(index, 1);
                              onImagesChange(newImages);
                            }}
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                            title="Eliminar imagen"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <FabricEditor
              initialImage={URL.createObjectURL(images[editingImageIndex])}
              onSave={handleSaveEdit}
              theme={theme}
              onClose={() => setEditingImageIndex(null)}
            />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className={`mt-6 p-4 rounded-xl ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-gray-50/50 border border-gray-200'
        } backdrop-blur-sm`}>
          <p className="text-sm text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Puedes arrastrar las imágenes para reordenarlas
          </p>
        </div>
      )}
    </div>
  );
};

export default CarouselCreator;
