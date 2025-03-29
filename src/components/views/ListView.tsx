import React from 'react';
import { Instagram, Youtube, Music, Pencil, Trash2 } from 'lucide-react';

interface Publication {
  id: number;
  title: string;
  date: string;
  status: string;
  platform: string;
}

interface ListViewProps {
  publications: Publication[];
  getStatusBadge: (status: string) => JSX.Element;
}

const ListView: React.FC<ListViewProps> = ({ publications, getStatusBadge }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {publications.map((pub, index) => (
        <div
          key={pub.id}
          className={`p-4 flex items-center justify-between ${
            index !== publications.length - 1 ? 'border-b dark:border-gray-700' : ''
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="text-2xl">
              {pub.platform === 'instagram' && <Instagram className="text-pink-500 dark:text-pink-400" />}
              {pub.platform === 'youtube' && <Youtube className="text-red-500 dark:text-red-400" />}
              {pub.platform === 'tiktok' && <Music className="text-gray-900 dark:text-white" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{pub.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{pub.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {getStatusBadge(pub.status)}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Pencil size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Trash2 size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;