import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Command, X, Wand2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import CommandShortcuts from './CommandShortcuts';
import CommandMessages from './CommandMessages';
import CommandAssistant from './CommandAssistant';
import { CommandModeSelector } from './CommandModeSelector';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'shortcuts' | 'messages' | 'assistant';

interface CommandAssisterProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const CommandAssister: React.FC<CommandAssisterProps> = ({
  isExpanded,
  setIsExpanded,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMode, setCurrentMode] = useState<Mode>('shortcuts');
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentContext = location.pathname.split('/')[1] || 'dashboard';

  // Determinar si estamos en la ruta "/edit-planning/:id"
  const isOnEditPlanningPage = location.pathname.startsWith('/edit-planning/');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      // Reiniciar el modo al valor por defecto cuando se cierra
      setCurrentMode('shortcuts');
    }, 400);
  };

  useEffect(() => {
    console.log('CommandAssister expanded state changed:', isExpanded);
    // Emitir evento cuando cambia el estado
    const event = new CustomEvent('commandAssisterStateChange', {
      detail: { isOpen: isExpanded }
    });
    window.dispatchEvent(event);
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      // Emitir el evento después de un pequeño retraso para asegurar que el componente está montado
      setTimeout(() => {
        const event = new CustomEvent('commandAssisterOpen', {
          detail: { timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      }, 100);
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Efecto para cambiar el modo al abrirse según la ruta
  useEffect(() => {
    if (isExpanded) {
      if (isOnEditPlanningPage) {
        setCurrentMode('messages');
      } else {
        setCurrentMode('shortcuts');
      }
    }
  }, [isExpanded, isOnEditPlanningPage]);

  const renderContent = () => {
    switch (currentMode) {
      case 'shortcuts':
        return (
          <CommandShortcuts
            searchTerm={searchTerm}
            currentContext={currentContext}
            navigate={navigate}
          />
        );
      case 'messages':
        return <CommandMessages />;
      case 'assistant':
        return <CommandAssistant currentContext={currentContext} />;
      default:
        return null;
    }
  };

  // Clases de posición para el botón y el asistente
  const buttonPositionClasses = 'fixed bottom-5 right-4 z-50';
  const assistantPositionClasses = isExpanded
    ? isOnEditPlanningPage
      ? 'fixed inset-0 left-0 z-50 h-screen w-1/3 border-r'
      : 'fixed bottom-4 right-4 w-[400px] h-[500px] z-50'
    : '';

  const handleExpand = () => {
    console.log('CommandAssister button clicked');
    if (!isExpanded) {
      setIsExpanded(true);
      // Emitir el evento con un pequeño retraso para asegurar que el estado se ha actualizado
      setTimeout(() => {
        console.log('Emitting commandAssisterOpen event');
        const event = new CustomEvent('commandAssisterOpen');
        window.dispatchEvent(event);
      }, 100);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleExpand();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {!isExpanded && (
        <button
          id="command-assister-button"
          onClick={handleExpand}
          className={`${buttonPositionClasses} ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700'
              : 'bg-white hover:bg-gray-50'
          } p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative`}
        >
          <Command className="w-6 h-6" />
        </button>
      )}
      {isExpanded && (
        <div className={`${assistantPositionClasses}`}>
          <AnimatePresence>
            <motion.div
              key="assistant"
              initial={{
                opacity: 0,
                x: isOnEditPlanningPage ? -50 : 0,
                y: isOnEditPlanningPage ? 0 : 50,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                x: isOnEditPlanningPage ? -50 : 0,
                y: isOnEditPlanningPage ? 0 : 50,
              }}
              transition={{ duration: 0.5 }}
              className={`${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              } relative ${
                isOnEditPlanningPage ? '' : 'rounded-3xl'
              } shadow-2xl flex flex-col transition-all duration-500 ease-out transform border ${
                isClosing ? 'animate-slideDown' : 'animate-slideUp'
              } ${
                isOnEditPlanningPage ? 'w-full h-full' : 'w-96 h-[32rem]'
              } overflow-hidden`}
            >
              {/* Contenido del Command Assister */}
              <div className={`flex flex-col h-full relative z-10`}>
                <div className={`flex items-center justify-between p-4 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <CommandModeSelector currentMode={currentMode} setCurrentMode={setCurrentMode} />
                  </div>
                  <button
                    onClick={handleClose}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-red-900/30 text-gray-400 hover:text-white'
                        : 'hover:bg-red-100 text-gray-500 hover:text-red-700'
                    } group`}
                  >
                    <X className="w-5 h-5 group-hover:hidden" />
                  </button>
                </div>
                {/* Ajustes para evitar scroll y ocupar todo el alto */}
                <div
                  className={`flex-1 ${
                    isOnEditPlanningPage ? 'overflow-hidden' : 'overflow-auto'
                  } p-4`}
                >
                  {renderContent()}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default CommandAssister;
