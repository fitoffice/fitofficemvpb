import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ToolCardProps {
  title: string;
  description: string;
  features: string[];
  color: 'emerald' | 'red' | 'teal' | 'blue' | 'purple' | 'pink';
  icon: React.ReactNode;
  onOpen: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  features,
  color,
  icon,
  onOpen
}) => {
  const { theme } = useTheme();

  const getColorClasses = (color: string) => ({
    bg: `from-${color}-400 to-${color}-600`,
    text: `text-${color}-500`,
    hover: `hover:text-${color}-500`,
    shadow: `shadow-${color}-500/20`,
    overlay: `from-${color}-500/10 via-${color}-500/5 to-transparent`,
    button: {
      bg: `bg-${color}-500/20`,
      hoverBg: `hover:bg-${color}-500`,
      text: `text-${color}-500`,
      lightBg: `bg-${color}-500/10`,
      lightText: `text-${color}-600`,
    }
  });

  const colors = getColorClasses(color);

  return (
    <div className={`p-8 rounded-3xl ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-900/90' 
        : 'bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95'
    } hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] 
    hover:-translate-y-1 transition-all duration-300 border-2 ${
      theme === 'dark' ? 'border-gray-700/50' : 'border-gray-100'
    } backdrop-blur-xl relative group overflow-hidden`}>
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out`} />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
        <div className={`absolute top-10 right-10 w-20 h-20 ${colors.bg} rounded-full blur-3xl`} />
        <div className={`absolute bottom-10 left-10 w-20 h-20 ${colors.bg} rounded-full blur-3xl`} />
      </div>
      
      {/* Icon container with enhanced effects */}
      <div className={`relative bg-gradient-to-br ${colors.bg} w-16 h-16 rounded-2xl mb-6 
        flex items-center justify-center shadow-lg ${colors.shadow} 
        transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 
        transition-all duration-300 ease-out`}>
        {icon}
      </div>

      {/* Content with enhanced typography */}
      <h3 className={`text-2xl font-bold mb-4 group-hover:${colors.text} 
        transition-colors duration-300 relative`}>
        {title}
      </h3>
      <p className={`${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      } mb-6 text-lg leading-relaxed`}>
        {description}
      </p>
      
      {/* Features list with enhanced spacing and animations */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} 
            className={`flex items-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } transform hover:translate-x-2 transition-transform duration-200`}>
            <span className={`mr-3 ${colors.text} text-lg`}>★</span>
            <span className={`group-hover:${colors.text} transition-colors duration-300`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Enhanced button with animations */}
      <button 
        onClick={onOpen}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg
          transition-all duration-300 transform hover:scale-[1.02]
          ${theme === 'dark' 
            ? `${colors.button.bg} ${colors.button.hoverBg} ${colors.button.text} hover:text-white` 
            : `${colors.button.lightBg} ${colors.button.hoverBg} ${colors.button.lightText} hover:text-white`
          } flex items-center justify-center gap-3 group relative overflow-hidden`}>
        <span className="relative z-10">Abrir herramienta</span>
        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform relative z-10" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 ease-out`} />
      </button>
    </div>
  );
};

export default ToolCard;