import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, X, Plus, Settings, Users } from 'lucide-react';
import PipelineStages from './PipelineStages';
import { useTheme } from '../../contexts/ThemeContext';

interface PipelineStage {
  name: string;
  count: number;
  percentage: number;
  emails: any[];
  _id?: string;
}

interface SeccionPipelineProps {
  customPipeline: PipelineStage[];
  isCustomizingPipeline: boolean;
  editingStage: { index: number; name: string } | null;
  expandedStages: Record<number, boolean>;
  saveMessage: {type: 'success' | 'error', text: string} | null;
  segmentosLength: number;
  setCustomPipeline: React.Dispatch<React.SetStateAction<PipelineStage[]>>;
  setEditingStage: React.Dispatch<React.SetStateAction<{ index: number; name: string } | null>>;
  setExpandedStages: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  setSelectedStageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setShowManageStagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCustomizingPipeline: React.Dispatch<React.SetStateAction<boolean>>;
  setSaveMessage: React.Dispatch<React.SetStateAction<{type: 'success' | 'error', text: string} | null>>;
  handleUpdateStageName: (index: number, newName: string) => Promise<void>;
  handleAddStage: () => void;
  handleSegmentClick: () => void;
  campaignPipeline: PipelineStage[];
}

const SeccionPipeline: React.FC<SeccionPipelineProps> = ({
  customPipeline,
  isCustomizingPipeline,
  editingStage,
  expandedStages,
  saveMessage,
  segmentosLength,
  setCustomPipeline,
  setEditingStage,
  setExpandedStages,
  setSelectedStageIndex,
  setShowManageStagePopup,
  setIsCustomizingPipeline,
  setSaveMessage,
  handleUpdateStageName,
  handleAddStage,
  handleSegmentClick,
  campaignPipeline
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-8">
      <div className={`flex justify-between items-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 shadow-gray-900/20' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/50 shadow-gray-200/20'
      } p-6 rounded-2xl border shadow-lg`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <BarChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${
              theme === 'dark'
                ? 'text-gray-100'
                : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
            }`}>
              Pipeline de Conversión
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Gestiona y monitoriza las etapas de tu campaña
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm px-4 py-2 rounded-xl font-medium ${
                saveMessage.type === 'success' 
                  ? theme === 'dark' 
                    ? 'bg-green-900/30 text-green-400 border-green-800' 
                    : 'bg-green-50 text-green-600 border-green-200'
                  : theme === 'dark'
                    ? 'bg-red-900/30 text-red-400 border-red-800'
                    : 'bg-red-50 text-red-600 border-red-200'
              } border`}
            >
              {saveMessage.text}
            </motion.span>
          )}
          {isCustomizingPipeline ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsCustomizingPipeline(false);
                  setCustomPipeline(campaignPipeline);
                  setSaveMessage(null);
                }}
                className={`px-4 py-2 text-sm font-medium ${
                  theme === 'dark'
                    ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-gray-600'
                    : 'text-gray-600 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                } rounded-xl border transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2`}
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={handleAddStage}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Añadir Etapa
              </button>
            </div>
          ) : (
            <div className="flex space-x-4 items-center">
              <button
                onClick={handleSegmentClick}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Users size={20} />
                <span>Gestión de Segmento ({segmentosLength})</span>
              </button>
              <button
                onClick={() => setIsCustomizingPipeline(true)}
                className={`px-4 py-2 text-sm font-medium ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-800/40 border-blue-800 hover:border-blue-700'
                    : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-100 hover:border-blue-200'
                } rounded-xl transition-all duration-300 flex items-center gap-2 border`}
              >
                <Settings className="w-4 h-4" />
                Personalizar Pipeline
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Pipeline Stages */}
      <PipelineStages 
        customPipeline={customPipeline}
        isCustomizingPipeline={isCustomizingPipeline}
        editingStage={editingStage}
        expandedStages={expandedStages}
        setCustomPipeline={setCustomPipeline}
        setEditingStage={setEditingStage}
        setExpandedStages={setExpandedStages}
        setSelectedStageIndex={setSelectedStageIndex}
        setShowManageStagePopup={setShowManageStagePopup}
        handleUpdateStageName={handleUpdateStageName}
      />
    </div>
  );
};

export default SeccionPipeline;