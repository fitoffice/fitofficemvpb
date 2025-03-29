import React from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface AIRoutineButtonProps {
  onClick: () => void;
}

const AIRoutineButton: React.FC<AIRoutineButtonProps> = ({ onClick }) => {
  const { theme } = useTheme();

  return (
    <Button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
      } text-white transition-colors`}
    >
      <Sparkles size={20} />
      <span>Crear Rutina con IA</span>
    </Button>
  );
};

export default AIRoutineButton;
