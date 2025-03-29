import { useState } from 'react';
import { Period } from '../types';

interface UsePeriodNameHandlerProps {
  selectedWeeks: Period[];
  setSelectedWeeks: React.Dispatch<React.SetStateAction<Period[]>>;
  onPeriodsChange: (periods: Period[]) => void;
}

export const usePeriodNameHandler = ({
  selectedWeeks,
  setSelectedWeeks,
  onPeriodsChange
}: UsePeriodNameHandlerProps) => {
  const [editingPeriodIndex, setEditingPeriodIndex] = useState<number | null>(null);
  const [editingPeriodName, setEditingPeriodName] = useState<string>('');

  const handlePeriodNameChange = (index: number, newName: string) => {
    console.log('VistaEstadisticas - Cambiando nombre de periodo:', {
      index,
      oldName: selectedWeeks[index]?.name,
      newName
    });
    const newPeriods = selectedWeeks.map((period, i) => 
      i === index ? { ...period, name: newName } : period
    );
    setSelectedWeeks(newPeriods);
    onPeriodsChange(newPeriods);
  };

  const handleStartEditingPeriod = (index: number, currentName: string) => {
    setEditingPeriodIndex(index);
    setEditingPeriodName(currentName);
  };

  const handleSavePeriodName = () => {
    if (editingPeriodIndex !== null && editingPeriodName.trim()) {
      handlePeriodNameChange(editingPeriodIndex, editingPeriodName.trim());
      setEditingPeriodIndex(null);
      setEditingPeriodName('');
    }
  };

  const handleCancelEditPeriod = () => {
    setEditingPeriodIndex(null);
    setEditingPeriodName('');
  };

  return {
    editingPeriodIndex,
    editingPeriodName,
    handlePeriodNameChange,
    handleStartEditingPeriod,
    handleSavePeriodName,
    handleCancelEditPeriod
  };
};