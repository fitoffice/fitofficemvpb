import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface GenerateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateStoryModal: React.FC<GenerateStoryModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [storyTopic, setStoryTopic] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'preview'>('chat');

  if (!isOpen) return null;

  const handleGenerateStory = () => {
    // Aquí iría la lógica para generar la historia con IA
    const aiGeneratedStory = `Esta es una historia generada por IA sobre el tema: ${storyTopic}`;
    setGeneratedStory(aiGeneratedStory);
    setActiveTab('preview');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl w-full max-w-4xl`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Generar Historia</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'chat' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'preview' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Vista Previa
            </button>
          </div>
        </div>
        {activeTab === 'chat' ? (
          <div>
            <input
              type="text"
              value={storyTopic}
              onChange={(e) => setStoryTopic(e.target.value)}
              className={`w-full p-2 mb-4 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ingresa un tema para tu historia"
            />
            <Button variant="success" onClick={handleGenerateStory} className="w-full">
              Generar
            </Button>
          </div>
        ) : (
          <div className={`p-4 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            {generatedStory || 'Haz clic en una imagen en la pestaña "Chat" para previsualizarla aquí.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateStoryModal;