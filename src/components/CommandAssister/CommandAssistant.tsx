import React from 'react';
import { 
  Sparkles, DollarSign, Share2, Bell, Salad, Users
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CommandAssistantProps {
  currentContext: string;
}

const CommandAssistant: React.FC<CommandAssistantProps> = ({ currentContext }) => {
  const { theme } = useTheme();

  const quickAssistantActions = [
    { 
      id: '1', 
      text: '¿Cómo crear una rutina personalizada?', 
      icon: React.createElement(Sparkles, { size: 16 }), 
      context: ['routines'] 
    },
    { 
      id: '2', 
      text: '¿Cómo gestionar los pagos?', 
      icon: React.createElement(DollarSign, { size: 16 }), 
      context: ['economics'] 
    },
    { 
      id: '3', 
      text: '¿Cómo exportar datos?', 
      icon: React.createElement(Share2, { size: 16 }) 
    },
    { 
      id: '4', 
      text: '¿Cómo configurar notificaciones?', 
      icon: React.createElement(Bell, { size: 16 }) 
    },
    { 
      id: '5', 
      text: '¿Cómo crear un plan nutricional?', 
      icon: React.createElement(Salad, { size: 16 }), 
      context: ['diets'] 
    },
    { 
      id: '6', 
      text: '¿Cómo hacer seguimiento de clientes?', 
      icon: React.createElement(Users, { size: 16 }), 
      context: ['clients'] 
    },
  ].filter(action => !action.context || action.context.includes(currentContext));

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid gap-4">
        {quickAssistantActions.map((action) => (
          <button
            key={action.id}
            className={`p-4 rounded-xl ${
              theme === 'dark'
                ? 'bg-gray-700/50 hover:bg-gray-600/50'
                : 'bg-gray-50 hover:bg-gray-100'
            } transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm flex items-center space-x-3`}
          >
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-white'
            }`}>
              {action.icon}
            </div>
            <span>{action.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandAssistant;