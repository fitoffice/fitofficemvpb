import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface PopupReutilizableProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const PopupReutilizable: React.FC<PopupReutilizableProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all duration-500 animate-slideUp"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl">
            <div className="absolute inset-0 bg-white/10 rounded-t-2xl"></div>
            <h2 className="relative text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Cerrar"
            >
              <X size={20} className="transform hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="bg-gradient-to-b from-gray-50 to-white px-6 py-6 rounded-b-2xl">
            <div className="relative">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupReutilizable;