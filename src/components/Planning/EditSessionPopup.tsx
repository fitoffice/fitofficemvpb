import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Save, Clock, Calendar } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Session {
  id: string;
  name: string;
  startTime?: string;
  endTime?: string;
  exercises: any[];
}

interface EditSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  onSave: (updatedSession: Session) => void;
}

const EditSessionPopup: React.FC<EditSessionPopupProps> = ({
  isOpen,
  onClose,
  session,
  onSave,
}) => {
  const { theme } = useTheme();
  const [editedSession, setEditedSession] = useState<Session>({ ...session });

  const handleSave = () => {
    onSave(editedSession);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl p-6 rounded-xl shadow-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Editar Sesión
              </h2>
              <Button
                variant="normal"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de la Sesión
                </label>
                <input
                  type="text"
                  value={editedSession.name}
                  onChange={(e) =>
                    setEditedSession({ ...editedSession, name: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline-block mr-2" />
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={editedSession.startTime || ''}
                    onChange={(e) =>
                      setEditedSession({
                        ...editedSession,
                        startTime: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline-block mr-2" />
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    value={editedSession.endTime || ''}
                    onChange={(e) =>
                      setEditedSession({
                        ...editedSession,
                        endTime: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <Button variant="normal" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  variant="create"
                  onClick={handleSave}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditSessionPopup;
