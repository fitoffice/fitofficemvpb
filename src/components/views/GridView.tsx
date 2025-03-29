import React from 'react';
import { Instagram, Youtube, Music, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Publication {
  id: number;
  title: string;
  date: string;
  status: string;
  platform: string;
}

interface GridViewProps {
  publications: Publication[];
  getStatusBadge: (status: string) => JSX.Element;
}

const GridView: React.FC<GridViewProps> = ({ publications, getStatusBadge }) => {
  const { theme } = useTheme();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram size={20} className="text-pink-500" />;
      case 'youtube':
        return <Youtube size={20} className="text-red-500" />;
      case 'tiktok':
        return <Music size={20} className="text-black dark:text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {publications.map((pub) => (
        <div 
          key={pub.id} 
          className={`rounded-xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
          } shadow-sm hover:shadow-md transition-all`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              {getStatusBadge(pub.status)}
            </div>
            
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {pub.title}
            </h3>
            
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {pub.date}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {getPlatformIcon(pub.platform)}
              </div>
              <button 
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Plus size={20} className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;