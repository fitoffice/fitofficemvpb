import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { StickyNote, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}

interface NotesProps {
  notes: Note[];
  onAddNote?: (note: Omit<Note, '_id'>) => void;
  onEditNote?: (id: string, note: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
}

const categoryColors = {
  general: 'bg-gray-500',
  training: 'bg-blue-500',
  diet: 'bg-green-500',
  medical: 'bg-red-500'
};

const categoryLabels = {
  general: 'General',
  training: 'Entrenamiento',
  diet: 'Nutrición',
  medical: 'Médico'
};

const Notes: React.FC<NotesProps> = ({ notes = [], onAddNote, onEditNote, onDeleteNote }) => {
  const { theme } = useTheme();
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Note['categoria']>('general');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);

  // Update localNotes when props notes change
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      const newNoteData = {
        texto: newNote,
        fechaCreacion: new Date().toISOString(),
        version: 1,
        categoria: selectedCategory
      };
      onAddNote(newNoteData);
      // Add to local state with a temporary ID
      setLocalNotes([...localNotes, { ...newNoteData, _id: Date.now().toString() }]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id: string) => {
    if (onDeleteNote) {
      onDeleteNote(id);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note._id);
    setEditContent(note.texto);
  };

  const handleSaveEdit = (id: string) => {
    if (onEditNote) {
      onEditNote(id, { texto: editContent });
      setEditingNote(null);
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }

      // Ajustar la fecha a la zona horaria local
      const fechaLocal = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      
      return fechaLocal.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Notas</h3>
        </div>
      </div>

      {/* Input para nueva nota */}
      <div className="mb-6 space-y-2">
        <div className="flex space-x-2">
        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Note['categoria'])}
            className={`
              px-3 py-2 rounded-lg
              ${theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-gray-100 text-gray-900 border-gray-200'
              }
              border focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors duration-200
            `}
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value} className={
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }>
                {label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nueva nota..."
            className={`
              flex-1 p-2 rounded-lg
              ${theme === 'dark'
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          />
          <Button
            variant="normal"
            onClick={handleAddNote}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryLabels).map(([category, label]) => (
            <span
              key={category}
              onClick={() => setSelectedCategory(category as Note['categoria'])}
              className={`
                px-2 py-1 rounded-full text-xs cursor-pointer
                transition-colors duration-200
                ${selectedCategory === category
                  ? `${categoryColors[category as keyof typeof categoryColors]} text-white`
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Lista de notas */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {localNotes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`
                p-4 rounded-lg
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {editingNote === note._id ? (
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={`
                        w-full p-2 rounded
                        ${theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                        }
                      `}
                    />
                  ) : (
                    <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                      {note.texto}
                    </p>
                  )}
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatearFecha(note.fechaCreacion)}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded ${categoryColors[note.categoria]} text-white`}>
                      {categoryLabels[note.categoria]}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {editingNote === note._id ? (
                    <>
                      <Button
                        variant="normal"
                        onClick={() => handleSaveEdit(note._id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="normal"
                        onClick={() => setEditingNote(null)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="normal"
                        onClick={() => handleEditNote(note)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="normal"
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notes;