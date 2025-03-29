import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ToolCardProps {
  tool: {
    id: string;
    chatId: number;
    name: string;
    icon: React.ElementType;
    description: string;
    gradient: string;
    features: string[];
    comingSoon?: boolean;
  };
  onClick: () => void;
  theme: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, theme }) => {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
      layoutId={tool.id}
      className={`h-[350px] p-8 rounded-2xl ${
        theme === 'dark' ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white'
      } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden group flex flex-col border border-gray-200/20`}
      onClick={() => !tool.comingSoon && onClick()}
    >
      {tool.comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
            Próximamente
          </span>
        </div>
      )}
      
      <div className="flex-shrink-0">
        <div className={`p-5 rounded-2xl bg-gradient-to-r ${tool.gradient} w-20 h-20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${
          theme === 'dark' 
            ? 'text-[#E5E4E2]' 
            : 'bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'
        }`}>
          {tool.name}
        </h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6 line-clamp-2 text-sm`}>
          {tool.description}
        </p>
      </div>
      
      <div className="flex-shrink-0 space-y-3">
        {tool.features.map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-3 group">
            <Star className={`w-4 h-4 text-yellow-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
              theme === 'dark' ? 'drop-shadow-glow-yellow' : ''
            }`} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-1 font-medium`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Efecto de hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
};

export default ToolCard;