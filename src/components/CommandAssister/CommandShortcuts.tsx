import React, { useState } from 'react';
import { Search, Plus, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { commandOptions } from './commandOptions';

interface CommandShortcutsProps {
  searchTerm: string;
  currentContext: string;
  navigate: (path: string) => void;
}

const CommandShortcuts: React.FC<CommandShortcutsProps> = ({
  searchTerm: initialSearchTerm,
  currentContext,
  navigate,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const filteredOptions = commandOptions.filter(option => 
    (!option.context || option.context.includes(currentContext)) &&
    (option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOptionClick = (optionId: string, action: any) => {
    if (optionId === 'new') {
      setSelectedOption(optionId);
    } else {
      action(navigate);
      setSelectedOption(null);
      setNewItemName('');
    }
  };

  const handleCreateNewItem = () => {
    if (newItemName.trim()) {
      console.log(`Creating new ${currentContext} item: ${newItemName}`);
      // Aquí iría la lógica para crear el nuevo elemento
      setSelectedOption(null);
      setNewItemName('');
    }
  };

  const getContextLabel = () => {
    switch (currentContext) {
      case 'clients': return 'cliente';
      case 'routines': return 'rutina';
      case 'diets': return 'plan nutricional';
      case 'economics': return 'registro económico';
      default: return 'elemento';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-2">
        <div className="relative">
          <Search className={`
            absolute left-4 top-1/2 transform -translate-y-1/2 
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
            transition-colors duration-300
          `} />
          <input
            type="text"
            placeholder="Buscar atajo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full pl-12 pr-4 py-3.5 rounded-xl
              ${theme === 'dark' 
                ? 'bg-gray-800 focus:bg-gray-750 text-white placeholder-gray-400' 
                : 'bg-gray-100 focus:bg-gray-50 text-gray-900 placeholder-gray-500'
              }
              outline-none
              transition-all duration-300
              focus:ring-2 focus:ring-blue-500/50
              border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
              hover:border-blue-500/30
            `}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <div className="space-y-3">
          {selectedOption === 'new' ? (
            <div className={`
              p-4 rounded-xl
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}
              border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
              transition-all duration-300
            `}>
              <div className="flex flex-col space-y-3">
                <label className={`
                  text-sm font-medium
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Nombre del nuevo {getContextLabel()}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={`Ingrese el nombre...`}
                    className={`
                      flex-1 px-4 py-2 rounded-lg
                      ${theme === 'dark'
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-white text-gray-900 placeholder-gray-500'
                      }
                      border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                      transition-all duration-300
                    `}
                    autoFocus
                  />
                  <button
                    onClick={handleCreateNewItem}
                    disabled={!newItemName.trim()}
                    className={`
                      px-4 py-2 rounded-lg
                      ${newItemName.trim()
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : theme === 'dark'
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-gray-200 cursor-not-allowed'
                      }
                      text-white
                      transition-all duration-300
                      flex items-center space-x-2
                    `}
                  >
                    <Plus size={18} />
                    <span>Crear</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id, option.action)}
                className={`
                  w-full text-left p-4 rounded-xl
                  ${theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-750'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                  transition-all duration-300 
                  transform hover:scale-[1.02] 
                  hover:shadow-lg
                  group
                  relative
                  border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                  hover:border-blue-500/30
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`
                      p-2.5 rounded-lg
                      ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}
                      group-hover:scale-110 group-hover:rotate-6
                      transition-all duration-300
                      border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    `}>
                      {option.icon}
                    </div>
                    <div>
                      <div className={`
                        font-medium text-base
                        ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        group-hover:text-blue-500
                        transition-colors duration-300
                      `}>
                        {option.title}
                      </div>
                      <div className={`
                        text-sm
                        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        group-hover:text-gray-600 dark:group-hover:text-gray-300
                        transition-colors duration-300
                      `}>
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {option.shortcut ? (
                    <div className="flex space-x-2">
                      {option.shortcut.map((key, index) => (
                        <span
                          key={index}
                          className={`
                            px-2.5 py-1.5 rounded-lg text-xs font-medium
                            ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-white text-gray-700'
                            }
                            border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                            group-hover:bg-blue-500/10
                            group-hover:border-blue-500/30
                            group-hover:text-blue-500
                            transition-all duration-300
                          `}
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <ArrowRight className={`
                      w-5 h-5
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                      group-hover:text-blue-500
                      transition-all duration-300
                      transform group-hover:translate-x-1
                    `} />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandShortcuts;