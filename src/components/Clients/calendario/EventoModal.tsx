import React from 'react';
import { X, Clock, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Evento {
  id: number;
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  color?: string;
  categoria?: string;
}

interface EventoModalProps {
  evento: Evento;
  onClose: () => void;
}

export default function EventoModal({ evento, onClose }: EventoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="relative p-6" style={{ borderTop: `4px solid ${evento.color}` }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-semibold text-gray-900 pr-8 mb-4">
            {evento.title}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(evento.start, "EEEE, d 'de' MMMM", { locale: es })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(evento.start, 'HH:mm', { locale: es })} - {format(evento.end, 'HH:mm', { locale: es })}
                </p>
              </div>
            </div>

            {evento.categoria && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Tag className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex items-center">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${evento.color}20`,
                      color: evento.color 
                    }}
                  >
                    {evento.categoria}
                  </span>
                </div>
              </div>
            )}
            
            {evento.descripcion && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {evento.descripcion}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}