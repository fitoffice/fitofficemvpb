import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Move,
  Image as ImageIcon,
  Download,
  Sliders,
  Square,
  Maximize
} from 'react-feather';

interface ImageToolbarProps {
  onRotateRight: () => void;
  onRotateLeft: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDelete: () => void;
  onUploadNew: () => void;
  onDownload: () => void;
  onOpenFilters: () => void;
  onOpenFrames: () => void;
  onOpenCanvasSize: () => void;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({
  onRotateRight,
  onRotateLeft,
  onZoomIn,
  onZoomOut,
  onDelete,
  onUploadNew,
  onDownload,
  onOpenFilters,
  onOpenFrames,
  onOpenCanvasSize
}) => {
  const { theme } = useTheme();

  const tools = [
    { icon: Move, label: 'Mover', disabled: true, className: 'text-purple-500' },
    { icon: RotateCw, label: 'Rotar derecha', onClick: onRotateRight },
    { icon: RotateCcw, label: 'Rotar izquierda', onClick: onRotateLeft },
    { icon: ZoomIn, label: 'Acercar', onClick: onZoomIn },
    { icon: ZoomOut, label: 'Alejar', onClick: onZoomOut },
    { icon: Sliders, label: 'Filtros', onClick: onOpenFilters, className: 'text-blue-500' },
    { icon: Square, label: 'Marcos', onClick: onOpenFrames, className: 'text-green-500' },
    { icon: Maximize, label: 'Tamaño del canvas', onClick: onOpenCanvasSize, className: 'text-yellow-500' },
    { icon: ImageIcon, label: 'Nueva imagen', onClick: onUploadNew },
    { icon: Download, label: 'Descargar', onClick: onDownload },
    { icon: Trash2, label: 'Eliminar', onClick: onDelete, className: 'text-red-500' }
  ];

  return (
    <div
      className={`p-2 rounded-lg flex items-center gap-2 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
      }`}
    >
      {tools.map((tool, index) => (
        <button
          key={tool.label}
          onClick={tool.onClick}
          disabled={tool.disabled}
          className={`p-2 rounded-lg transition-colors ${
            tool.disabled
              ? tool.className || (theme === 'dark' ? 'text-purple-500' : 'text-purple-600')
              : `hover:bg-gray-100 ${
                  tool.className ||
                  (theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900')
                }`
          } ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}
          title={tool.label}
        >
          <tool.icon size={20} />
        </button>
      ))}
    </div>
  );
};

export default ImageToolbar;
