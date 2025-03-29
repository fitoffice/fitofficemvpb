import React from 'react';
import { X } from 'lucide-react';

interface TikTokModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TikTokModal: React.FC<TikTokModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] rounded-lg p-6 w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <img src="https://www.tiktok.com/favicon.ico" alt="TikTok" className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Subir Video a TikTok</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Seleccionar Video</label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-[#1F1F1F] text-gray-400 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:bg-[#2A2A2A]">
                <span className="text-sm">Ningún archivo seleccionado</span>
                <input type="file" className="hidden" accept="video/*" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
            <input
              type="text"
              className="w-full p-2 bg-[#1F1F1F] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FE2C55] focus:border-transparent text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
            <textarea
              rows={4}
              placeholder="Describe el contenido..."
              className="w-full p-2 bg-[#1F1F1F] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FE2C55] focus:border-transparent text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-[#2A2A2A] rounded-lg hover:bg-[#3A3A3A]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[#FE2C55] rounded-lg hover:bg-[#FF1F4C]"
            >
              Subir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TikTokModal;