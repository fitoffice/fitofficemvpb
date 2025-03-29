import React, { useState } from 'react';
import { StickyNote, Plus, X, Calendar } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import Button from '../../Common/Button';
import Notes from '../Notes';

interface Nota {
  contenido: string;
  fecha: string;
}

interface NotasSectionProps {
  notas: any[];
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onAddNote?: (note: any) => void;
  onEditNote?: (id: string, note: any) => void;
  onDeleteNote?: (id: string) => void;
  onChange: (notas: any[]) => void;
}

const NotasSection: React.FC<NotasSectionProps> = ({
  notas,
  editMode,
  theme,
  onAddNote,
  onEditNote,
  onDeleteNote
}) => {
  if (!editMode) {
    return (
      <div className="space-y-4">
        {notas.map(nota => (
          <div 
            key={nota._id}
            className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <p>{nota.texto}</p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(nota.fechaCreacion).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Notes
      notes={notas}
      onAddNote={onAddNote}
      onEditNote={onEditNote}
      onDeleteNote={onDeleteNote}
    />
  );
};

export default NotasSection;