import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit2, ChevronDown, Send, 
  ArrowRight, Users, Mail, PlusCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface EmailItem {
  id: string;
  recipient: string;
  email: string;
  status: 'sent' | 'received' | 'opened' | 'clicked' | 'converted';
  date: string;
}

interface PipelineStage {
  name: string;
  count: number;
  percentage: number;
  emails: EmailItem[];
  _id?: string;
}

interface PipelineStagesProps {
  customPipeline: PipelineStage[];
  isCustomizingPipeline: boolean;
  editingStage: { index: number; name: string } | null;
  expandedStages: Record<number, boolean>;
  setCustomPipeline: (pipeline: PipelineStage[]) => void;
  setEditingStage: (stage: { index: number; name: string } | null) => void;
  setExpandedStages: (stages: Record<number, boolean>) => void;
  setSelectedStageIndex: (index: number | null) => void;
  setShowManageStagePopup: (show: boolean) => void;
  handleUpdateStageName: (index: number, newName: string) => void;
}

const PipelineStages: React.FC<PipelineStagesProps> = ({
  customPipeline,
  isCustomizingPipeline,
  editingStage,
  expandedStages,
  setCustomPipeline,
  setEditingStage,
  setExpandedStages,
  setSelectedStageIndex,
  setShowManageStagePopup,
  handleUpdateStageName
}) => {
  const { theme } = useTheme();
  return (
    <div className="relative w-full overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max px-2">
        {(customPipeline || []).map((stage, index) => (
          <React.Fragment key={index}>
            {isCustomizingPipeline && index > 0 && (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    const newStage = {
                      name: 'Nueva Etapa',
                      count: 0,
                      percentage: 0,
                      emails: [],
                      _id: `temp-${Date.now()}`
                    };
                    const updatedPipeline = [...customPipeline];
                    updatedPipeline.splice(index, 0, newStage);
                    setCustomPipeline(updatedPipeline);
                  }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-110"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className={`${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 hover:border-blue-700/50 shadow-gray-900/20 hover:shadow-blue-900/10' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/50 hover:border-blue-300/50 shadow-gray-200/20 hover:shadow-blue-500/10'
            } rounded-2xl p-6 border transition-all duration-300 shadow-lg w-[420px] group/stage`}>
              <div 
                onClick={() => setExpandedStages(prev => ({
                  ...prev,
                  [index]: !prev[index]
                }))}
                className="flex justify-between items-start mb-6 cursor-pointer"
              >
                <div className="flex-1">
                  {editingStage?.index === index ? (
                    <input
                      type="text"
                      value={editingStage.name}
                      onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                      onBlur={() => handleUpdateStageName(index, editingStage.name)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateStageName(index, editingStage.name)}
                      className={`w-full px-4 py-2.5 text-lg font-semibold border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-700/50 text-white' 
                          : 'bg-white/50 text-gray-800'
                      } backdrop-blur-sm`}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <h4 className={`text-xl font-bold ${
                        theme === 'dark'
                          ? 'text-gray-100 group-hover/stage:text-blue-300'
                          : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover/stage:from-blue-600 group-hover/stage:to-blue-800'
                      } transition-all duration-300`}>
                        {stage.name}
                      </h4>
                      {isCustomizingPipeline && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStage({ index, name: stage.name });
                          }}
                          className={`p-2 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                          } rounded-xl transition-all duration-300`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <div className={`h-3 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800'
                        : 'bg-gradient-to-r from-blue-100 to-blue-50'
                    } rounded-full flex-1 overflow-hidden`}>
                      <div
                        className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 group-hover/stage:from-blue-600 group-hover/stage:to-blue-700"
                        style={{ width: `${stage.percentage || 0}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold ${
                      theme === 'dark'
                        ? 'text-blue-400 bg-blue-900/30'
                        : 'text-blue-600 bg-blue-50'
                    } px-2.5 py-0.5 rounded-full`}>
                      {(stage.percentage || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button 
                      className={`p-2 rounded-full ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                      } transition-all duration-300`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStages(prev => ({
                          ...prev,
                          [index]: !prev[index]
                        }));
                      }}
                    >
                      <ChevronDown 
                        className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                        } transition-transform duration-300 ${expandedStages[index] ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenido desplegable */}
              {expandedStages[index] && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`space-y-4 mt-4 border-t ${
                    theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
                  } pt-6`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 shadow-gray-900/20'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-100/50 shadow-gray-200/20'
                    } p-4 rounded-xl shadow-lg border`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                          <Send className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Enviados</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark'
                          ? 'text-blue-400'
                          : 'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'
                      }`}>
                        {stage.emails?.length || 0}
                      </p>
                    </div>
                    <div className={`${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 shadow-gray-900/20'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-100/50 shadow-gray-200/20'
                    } p-4 rounded-xl shadow-lg border`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg shadow-green-500/20">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Recibidos</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark'
                          ? 'text-green-400'
                          : 'bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent'
                      }`}>
                        {stage.emails?.filter(e => e.status === 'received').length || 0}
                      </p>
                    </div>
                    <div className={`${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 shadow-gray-900/20'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-100/50 shadow-gray-200/20'
                    } p-4 rounded-xl shadow-lg border`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Clientes</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark'
                          ? 'text-purple-400'
                          : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
                      }`}>
                        {stage.count || 0}
                      </p>
                    </div>
                    <div className={`${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 shadow-gray-900/20'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-100/50 shadow-gray-200/20'
                    } p-4 rounded-xl shadow-lg border`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Tasa de apertura</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark'
                          ? 'text-orange-400'
                          : 'bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent'
                      }`}>
                        {stage.emails && stage.emails.length > 0 
                          ? ((stage.emails.filter(e => e.status === 'opened').length / stage.emails.length) * 100).toFixed(1)
                          : '0.0'}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStageIndex(index);
                      setShowManageStagePopup(true);
                    }}
                    className="w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Gestionar etapa
                  </button>
                </motion.div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Scroll Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      } rounded-full`}>
        <div className="h-full bg-blue-500 rounded-full" style={{ width: '33%' }}></div>
      </div>
    </div>
  );
};

export default PipelineStages;