import React from 'react';
import { Keyboard, MessageSquare, HelpCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type Mode = 'shortcuts' | 'messages' | 'assistant';

interface CommandModeSelectorProps {
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
}

export const CommandModeSelector: React.FC<CommandModeSelectorProps> = ({
  currentMode,
  setCurrentMode,
}) => {
  const { theme } = useTheme();

  const getModeButtonClass = (mode: Mode) => `
    flex-1 py-3 px-4 rounded-xl transition-all duration-300 
    ${currentMode === mode
      ? theme === 'dark'
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
        : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
      : theme === 'dark'
      ? 'bg-gray-700 hover:bg-gray-600'
      : 'bg-gray-100 hover:bg-gray-200'
    } transform hover:scale-105
  `;

  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => setCurrentMode('shortcuts')}
        className={getModeButtonClass('shortcuts')}
      >
        <Keyboard className="w-5 h-5 mx-auto" />
      </button>
      <button
        onClick={() => setCurrentMode('messages')}
        className={getModeButtonClass('messages')}
      >
        <MessageSquare className="w-5 h-5 mx-auto" />
      </button>
      <button
        onClick={() => setCurrentMode('assistant')}
        className={getModeButtonClass('assistant')}
      >
        <HelpCircle className="w-5 h-5 mx-auto" />
      </button>
    </div>
  );
};