import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Check, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Button from '../Common/Button';
import './EventoPopup.css'; // Crearemos este archivo después

interface Evento {
  id: string;
  fecha: Date;
  hora: string;
  tipo: 'entrenamiento' | 'nutricion' | 'finanzas' | 'otro';
  titulo: string;
  descripcion?: string;
  esDelEntrenador: boolean;
}

interface EventoPopupProps {
  onClose: () => void;
  onSave: (evento: Evento) => void;
  fechaSeleccionada: Date;
}

const EventoPopup: React.FC<EventoPopupProps> = ({ onClose, onSave, fechaSeleccionada }) => {
  const [nuevoEvento, setNuevoEvento] = useState<Partial<Evento>>({
    fecha: fechaSeleccionada,
    hora: '',
    tipo: 'entrenamiento',
    titulo: '',
    descripcion: '',
    esDelEntrenador: false,
  });

  const handleGuardar = () => {
    if (nuevoEvento.titulo && nuevoEvento.hora) {
      const eventoCompleto: Evento = {
        id: Date.now().toString(),
        fecha: nuevoEvento.fecha || new Date(),
        hora: nuevoEvento.hora,
        tipo: nuevoEvento.tipo || 'otro',
        titulo: nuevoEvento.titulo,
        descripcion: nuevoEvento.descripcion,
        esDelEntrenador: nuevoEvento.esDelEntrenador || false,
      };
      onSave(eventoCompleto);
    }
  };

  // Create the popup content
  const popupContent = (
    <div className="evento-popup-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="evento-popup"
      >
        <div className="evento-popup-header">
          <h3>Añadir Nuevo Evento</h3>
          <button className="btn-cerrar" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="evento-popup-content">
          <div className="campo-formulario">
            <label>
              <CalendarIcon size={16} />
              Fecha
            </label>
            <input
              type="date"
              value={nuevoEvento.fecha?.toISOString().split('T')[0] || ''}
              onChange={(e) => {
                const fecha = new Date(e.target.value);
                setNuevoEvento({ ...nuevoEvento, fecha });
              }}
            />
          </div>

          <div className="campo-formulario">
            <label>
              <Clock size={16} />
              Hora
            </label>
            <input
              type="time"
              value={nuevoEvento.hora || ''}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
            />
          </div>

          <div className="campo-formulario">
            <label>Título</label>
            <input
              type="text"
              placeholder="Título del evento"
              value={nuevoEvento.titulo || ''}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
            />
          </div>

          <div className="campo-formulario">
            <label>Tipo de evento</label>
            <select
              value={nuevoEvento.tipo || 'entrenamiento'}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value as any })}
            >
              <option value="entrenamiento">Entrenamiento</option>
              <option value="nutricion">Nutrición</option>
              <option value="finanzas">Finanzas</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="campo-formulario">
            <label>Descripción</label>
            <textarea
              placeholder="Descripción (opcional)"
              value={nuevoEvento.descripcion || ''}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
            />
          </div>

          <div className="campo-formulario checkbox">
            <label>
              <input
                type="checkbox"
                checked={nuevoEvento.esDelEntrenador || false}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, esDelEntrenador: e.target.checked })}
              />
              Evento del entrenador
            </label>
          </div>
        </div>

        <div className="evento-popup-actions">
          <Button onClick={handleGuardar} className="btn-guardar">
            <Check size={18} />
            Guardar
          </Button>
          <Button onClick={onClose} className="btn-cancelar">
            <X size={18} />
            Cancelar
          </Button>
        </div>
      </motion.div>
    </div>
  );

  // Use createPortal to render at the highest level
  return createPortal(
    popupContent,
    document.body // This renders the popup directly in the body element
  );
};

export default EventoPopup;