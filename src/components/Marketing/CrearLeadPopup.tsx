import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  shortDescription?: string;
  birthDate?: string;
  gender: 'male' | 'female' | 'other' | '';
  address: string;
  interests: string[];
  origen: string;
}

interface CrearLeadPopupProps {
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  selectedInterests: string[];
  handleInterestToggle: (interest: string) => void;
  interestCategories: string[];
  origenOptions: string[];
}

export function CrearLeadPopup({
  onClose,
  onSubmit,
  selectedInterests,
  handleInterestToggle,
  interestCategories,
  origenOptions
}: CrearLeadPopupProps) {
  const { register, handleSubmit } = useForm<LeadFormData>();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Lead</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Grid de 2 columnas para campos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Teléfono<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('phone', { required: true })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Género */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Género<span className="text-red-500">*</span>
              </label>
              <select
                {...register('gender', { required: true })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Seleccionar género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>

          {/* Campos de una columna */}
          <div className="space-y-6">
            {/* Descripción breve */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción breve
              </label>
              <textarea
                {...register('shortDescription')}
                rows={3}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Escribe una breve descripción..."
              />
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Dirección<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('address', { required: true })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                {...register('birthDate')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Intereses */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Intereses
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestCategories.map((interest) => (
                <div
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${selectedInterests.includes(interest)
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors duration-200
                      ${selectedInterests.includes(interest)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {selectedInterests.includes(interest) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{interest}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Origen */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Origen<span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {origenOptions.map((origen) => (
                <label
                  key={origen}
                  className="relative flex items-center p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                >
                  <input
                    type="radio"
                    {...register('origen', { required: true })}
                    value={origen}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">{origen}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Crear Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}