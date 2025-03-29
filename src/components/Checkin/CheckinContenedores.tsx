import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckSquare, Dumbbell, Utensils, ThumbsUp, ThumbsDown, AlertTriangle, Eye, BarChart2 } from 'lucide-react';
import CheckinDetailPopup from './CheckinDetailPopup';
import CompareRoutinePopup from './CompareRoutinePopup';

interface CheckinContenedoresProps {
  theme: string;
  itemVariants: any;
  filteredCheckIns: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    notes: string;
    type?: string;
    status?: 'success' | 'warning' | 'danger';
  }>;
  getCheckInTypeBadgeStyle: (type: string) => string;
  onCheckInClick?: (checkIn: any) => void;
}

const CheckinContenedores: React.FC<CheckinContenedoresProps> = ({
  theme,
  itemVariants,
  filteredCheckIns,
  getCheckInTypeBadgeStyle,
  onCheckInClick
}) => {
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isComparePopupOpen, setIsComparePopupOpen] = useState(false);

  const handleViewCheckIn = (checkIn: any) => {
    setSelectedCheckIn(checkIn);
    setIsDetailPopupOpen(true);
    if (onCheckInClick) onCheckInClick(checkIn);
  };
  
  const handleCompareWithRoutine = (checkIn: any) => {
    setSelectedCheckIn(checkIn);
    setIsComparePopupOpen(true);
  };
  
  // Group check-ins by type
  const trainingCheckIns = filteredCheckIns.filter(checkIn => 
    checkIn.type === 'Entrenamiento');
  
  const dietCheckIns = filteredCheckIns.filter(checkIn => 
    checkIn.type === 'Dieta');
  
  const otherCheckIns = filteredCheckIns.filter(checkIn => 
    !checkIn.type || (checkIn.type !== 'Entrenamiento' && checkIn.type !== 'Dieta'));

  // Get status icon and color
  const getStatusIndicator = (status?: string) => {
    switch(status) {
      case 'success':
        return {
          icon: <ThumbsUp className="w-4 h-4" />,
          color: theme === 'dark' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: theme === 'dark' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
        };
      case 'danger':
        return {
          icon: <ThumbsDown className="w-4 h-4" />,
          color: theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
        };
      default:
        return {
          icon: null,
          color: ''
        };
    }
  };

  // Render check-in card
  const renderCheckInCard = (checkIn: any) => {
    const statusInfo = getStatusIndicator(checkIn.status);
    const isTraining = checkIn.type === 'Entrenamiento';
    
    return (
      <motion.div
        key={checkIn.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border ${
          theme === 'dark'
            ? 'bg-gray-700/50 border-gray-600'
            : 'bg-gray-50 border-gray-200'
        } ${checkIn.status ? `border-l-4 ${
          checkIn.status === 'success' 
            ? theme === 'dark' ? 'border-l-green-500' : 'border-l-green-500'
            : checkIn.status === 'warning'
              ? theme === 'dark' ? 'border-l-yellow-500' : 'border-l-yellow-500'
              : theme === 'dark' ? 'border-l-red-500' : 'border-l-red-500'
        }` : ''}`}
      >
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {checkIn.name}
          </h3>
          <div className="flex items-center gap-2">
            {statusInfo.icon && (
              <div className={`p-1.5 rounded-full ${statusInfo.color}`}>
                {statusInfo.icon}
              </div>
            )}
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              checkIn.type 
                ? getCheckInTypeBadgeStyle(checkIn.type)
                : theme === 'dark'
                  ? 'bg-teal-500/20 text-teal-300'
                  : 'bg-teal-100 text-teal-800'
            }`}>
              {checkIn.type || "Registrado"}
            </div>
          </div>
        </div>
        <div className={`flex gap-4 mt-2 text-sm ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {checkIn.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {checkIn.time}
          </div>
        </div>
        {checkIn.notes && (
          <p className={`mt-2 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {checkIn.notes}
          </p>
        )}
        
        {isTraining && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => handleViewCheckIn(checkIn)}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } transition-colors`}
            >
              <Eye className="w-3.5 h-3.5" />
              Ver Check-in
            </button>
            <button 
              onClick={() => handleCompareWithRoutine(checkIn)}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              } transition-colors`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Comparar con rutina
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  // Render section for a specific type of check-in
  const renderCheckInSection = (title: string, icon: JSX.Element, checkIns: any[], iconBgClass: string, iconTextClass: string) => {
    if (checkIns.length === 0) return null;
    
    return (
      <div className="mb-8 last:mb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${iconBgClass}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${iconTextClass}` })}
          </div>
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {title}
          </h2>
        </div>
        <div className="space-y-4">
          {checkIns.map(renderCheckInCard)}
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div 
        variants={itemVariants}
        className={`${
          theme === 'dark' 
            ? 'bg-gray-800/90 border-gray-700/50' 
            : 'bg-white/90 border-gray-200/50'
        } p-6 rounded-xl shadow-lg border backdrop-blur-xl`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${
            theme === 'dark'
              ? 'bg-cyan-500/20'
              : 'bg-cyan-100'
          }`}>
            <Calendar className={`w-6 h-6 ${
              theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'
            }`} />
          </div>
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Historial de Check-Ins
          </h2>
        </div>
        
        <div className="overflow-y-auto max-h-[400px] pr-2">
          {filteredCheckIns.length === 0 ? (
            <div className={`text-center py-10 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No hay registros de check-in para este cliente</p>
            </div>
          ) : (
            <div>
              {renderCheckInSection(
                "Entrenamiento", 
                <Dumbbell />, 
                trainingCheckIns,
                theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              )}
              
              {renderCheckInSection(
                "Dieta", 
                <Utensils />, 
                dietCheckIns,
                theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
                theme === 'dark' ? 'text-green-300' : 'text-green-600'
              )}
              
              {otherCheckIns.length > 0 && renderCheckInSection(
                "Otros Check-ins", 
                <CheckSquare />, 
                otherCheckIns,
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
                theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      <CheckinDetailPopup 
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        checkIn={selectedCheckIn}
        theme={theme}
      />
      
      <CompareRoutinePopup 
        isOpen={isComparePopupOpen}
        onClose={() => setIsComparePopupOpen(false)}
        checkIn={selectedCheckIn}
        theme={theme}
      />
    </>
  );
};

export default CheckinContenedores;