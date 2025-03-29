import React from 'react';
import { Calendar, Edit2, Trash2, ChevronRight } from 'lucide-react';
import Button from '../Button';
import { Period } from '../utils/estadisticasUtils';

interface PeriodHeaderProps {
  periodo: Period;
  index: number;
  editingPeriodIndex: number | null;
  editingPeriodName: string;
  setEditingPeriodName: (name: string) => void;
  handleEditPeriodName: (index: number, currentName: string) => void;
  handleSavePeriodName: () => void;
  handleDeletePeriod: (index: number) => void;
  handleApplyPeriod: (periodId: string) => void;
  toggleAccordion: (index: number) => void;
  isActive: boolean;
}

const PeriodHeader: React.FC<PeriodHeaderProps> = ({
  periodo,
  index,
  editingPeriodIndex,
  editingPeriodName,
  setEditingPeriodName,
  handleEditPeriodName,
  handleSavePeriodName,
  handleDeletePeriod,
  handleApplyPeriod,
  toggleAccordion,
  isActive
}) => {
  return (
    <div 
      className="flex items-center justify-between mb-5 cursor-pointer group"
      onClick={() => toggleAccordion(index)}
    >
      <div className="flex items-center gap-3">
        {editingPeriodIndex === index ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editingPeriodName}
              onChange={(e) => setEditingPeriodName(e.target.value)}
              className="border border-indigo-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSavePeriodName();
              }}
            >
              Guardar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditPeriodName(-1, '');
              }}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {index + 1}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{periodo.name}</h3>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyPeriod(periodo.id);
          }}
          className="flex items-center gap-1"
        >
          <Calendar className="w-4 h-4" />
          Aplicar Periodo
        </Button>
        {editingPeriodIndex !== index && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditPeriodName(index, periodo.name);
            }}
            className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeletePeriod(index);
          }}
          className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
          <ChevronRight className={`w-5 h-5 text-gray-600 transform ${isActive ? 'rotate-90' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default PeriodHeader;