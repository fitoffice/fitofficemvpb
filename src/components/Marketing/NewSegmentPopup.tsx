import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface NewSegmentPopupProps {
  onClose: () => void;
  onCreateSegment: (segmentData: {
    name: string;
    description: string;
    filterOptions: FilterOptions;
  }) => void;
}

interface FilterOptions {
  minAge: string;
  maxAge: string;
  region: string;
  gender: string[];
  interests: string[];
  source: string[];
}

const NewSegmentPopup: React.FC<NewSegmentPopupProps> = ({ onClose, onCreateSegment }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minAge: '',
    maxAge: '',
    region: '',
    gender: [],
    interests: [],
    source: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSegment({
      name,
      description,
      filterOptions
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Segmento</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Segmento
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Filtros</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad Mínima
                </label>
                <input
                  type="number"
                  value={filterOptions.minAge}
                  onChange={(e) => setFilterOptions({...filterOptions, minAge: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  min="0"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad Máxima
                </label>
                <input
                  type="number"
                  value={filterOptions.maxAge}
                  onChange={(e) => setFilterOptions({...filterOptions, maxAge: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  min="0"
                  max="120"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Región
              </label>
              <input
                type="text"
                value={filterOptions.region}
                onChange={(e) => setFilterOptions({...filterOptions, region: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                placeholder="Ej: Madrid"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <div className="space-y-2">
                {['Masculino', 'Femenino', 'Otro'].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                      checked={filterOptions.gender.includes(gender)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilterOptions({
                            ...filterOptions,
                            gender: [...filterOptions.gender, gender]
                          });
                        } else {
                          setFilterOptions({
                            ...filterOptions,
                            gender: filterOptions.gender.filter(g => g !== gender)
                          });
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intereses
              </label>
              <div className="space-y-2">
                {['Fitness', 'Nutrición', 'Yoga', 'Pilates', 'Entrenamiento personal'].map((interest) => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                      checked={filterOptions.interests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilterOptions({
                            ...filterOptions,
                            interests: [...filterOptions.interests, interest]
                          });
                        } else {
                          setFilterOptions({
                            ...filterOptions,
                            interests: filterOptions.interests.filter(i => i !== interest)
                          });
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Crear Segmento
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default NewSegmentPopup;
