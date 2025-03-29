import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Image as ImageIcon, MessageSquare, X, Mic, Share2, 
  TrendingUp, Target, Users, Globe, Instagram, Facebook,
  Video, Wand2, Zap, Brain, Rocket, BarChart, Mail, Search,
  Home, Briefcase, Copy, Edit, Languages
} from 'lucide-react';
import Button from '../components/Common/Button';
import AIChat from '../components/ContentPublishing/AIChat';
import ToolCard from '../components/ContentPublishing/ToolCard';
import AICreator from '../components/VideoTools/AICreator';
import AITwin from '../components/VideoTools/AITwin';
import AIEdit from '../components/VideoTools/AIEdit';
import AITranslate from '../components/VideoTools/AITranslate';
import ContentPlanner from '../components/VideoTools/ContentPlanner';
import { chatService } from '../services/chatService';
import {
  mainTools,
  fitnessTools,
  performanceTools,
  engagementTools,
  specializedTools,
  groupTools,
  videoTools
} from '../data/tools';
import ExpressPlansGenerator from '../components/ExpressPlans/ExpressPlansGenerator';
import InjuryDiagnosisAnalyzer from '../components/InjuryDiagnosis/InjuryDiagnosisAnalyzer';
import LifestyleGuideAnalyzer from '../components/LifestyleGuide/LifestyleGuideAnalyzer';
import PlateauStrategiesPlanner from '../components/PlateauStrategies/PlateauStrategiesPlanner';
import ContentStrategy from '../components/ContentStrategy/ContentStrategy';
import SmartGoalsBuilder from '../components/SmartGoals/SmartGoalsBuilder';
import SocialContentCreator from '../components/SocialContent/SocialContentCreator';
import ChallengesCreator from '../components/Challenges/ChallengesCreator';
import ProgressSimulator from '../components/ProgressSimulator/ProgressSimulator';
import HomeEquipmentAdvisor from '../components/HomeEquipment/HomeEquipmentAdvisor';
import OfficeBreaksDesigner from '../components/OfficeBreaks/OfficeBreaksDesigner';
import PersonalMarketingGenerator from '../components/PersonalMarketing/PersonalMarketingGenerator';
import TravelTrainingChat from '../components/TravelTraining/TravelTrainingChat';
import GroupClassesManager from '../components/GroupClasses/GroupClassesManager';
import MicroHabitsBuilder from '../components/MicroHabits/MicroHabitsBuilder';
import AudienceAnalyzer from '../components/AudienceAnalyzer/AudienceAnalyzer';
import InjuryDiagnosis from '../components/InjuryDiagnosis/InjuryDiagnosis';
import ExpressPlans from '../components/ExpressPlans/ExpressPlans';
import LifestyleGuide from '../components/LifestyleGuide/LifestyleGuide';

interface Tool {
  id: string;
  chatId: number;
  name: string;
  icon: any;
  description: string;
  gradient: string;
  features: string[];
  component?: React.ComponentType<any>;
  path?: string;
}

const toolsConfig: { [key: string]: { component?: React.ComponentType<any>, path?: string } } = {
  'posts': { path: '/aipostcreator' },
  'stories': { path: '/aistory' },
  'express-plans': { component: ExpressPlansGenerator },
  'injury-diagnosis': { component: InjuryDiagnosisAnalyzer },
  'lifestyle-guide': { component: LifestyleGuideAnalyzer },
  'plateau-strategies': { component: PlateauStrategiesPlanner },
  'content-strategy': { component: ContentStrategy },
  'smart-goals': { component: SmartGoalsBuilder },
  'social-content': { component: SocialContentCreator },
  'challenges': { component: ChallengesCreator },
  'progress-simulator': { component: ProgressSimulator },
  'home-equipment': { component: HomeEquipmentAdvisor },
  'office-breaks': { component: OfficeBreaksDesigner },
  'personal-marketing': { component: PersonalMarketingGenerator },
  'travel-training': { component: TravelTrainingChat },
  'group-classes': { component: GroupClassesManager },
  'micro-habits': { component: MicroHabitsBuilder },
  'audience-analyzer': { component: AudienceAnalyzer },
  'ai-creator': { component: AICreator },
  'ai-edit': { component: AIEdit },
  'ai-translate': { component: AITranslate },
  'ai-twin': { component: AITwin },
  'content-planner': { component: ContentPlanner }
};

const ContentPublishingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExpressPlans, setShowExpressPlans] = useState(false);
  const [showInjuryDiagnosis, setShowInjuryDiagnosis] = useState(false);
  const [showLifestyleGuide, setShowLifestyleGuide] = useState(false);
  const [showPlateauStrategies, setShowPlateauStrategies] = useState(false);
  const [showContentStrategy, setShowContentStrategy] = useState(false);
  const [showSmartGoals, setShowSmartGoals] = useState(false);
  const [showSocialContent, setShowSocialContent] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showProgressSimulator, setShowProgressSimulator] = useState(false);
  const [showHomeEquipment, setShowHomeEquipment] = useState(false);
  const [showOfficeBreaks, setShowOfficeBreaks] = useState(false);
  const [showPersonalMarketing, setShowPersonalMarketing] = useState(false);
  const [showTravelTraining, setShowTravelTraining] = useState(false);
  const [showGroupClasses, setShowGroupClasses] = useState(false);
  const [showMicroHabits, setShowMicroHabits] = useState(false);
  const [showAudienceAnalyzer, setShowAudienceAnalyzer] = useState(false);
  const [isAICreatorOpen, setIsAICreatorOpen] = useState(false);
  const [isAIEditOpen, setIsAIEditOpen] = useState(false);
  const [isAITranslateOpen, setIsAITranslateOpen] = useState(false);
  const [isAITwinOpen, setIsAITwinOpen] = useState(false);
  const [isContentPlannerOpen, setIsContentPlannerOpen] = useState(false);
  const { theme } = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number>(0);

  // Base styles
  const styles = {
    container: `min-h-screen p-8 relative ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-gray-50 to-white text-gray-800'
    }`,
    title: 'text-5xl font-bold mb-4 flex items-center justify-center gap-4',
    titleGradient: theme === 'dark'
      ? 'bg-gradient-to-r from-blue-400 to-purple-400'
      : 'bg-gradient-to-r from-blue-600 to-purple-600',
    toolCard: `transform transition-all duration-300 hover:scale-105 ${
      theme === 'dark' 
        ? 'hover:shadow-lg hover:shadow-purple-500/20' 
        : 'hover:shadow-lg hover:shadow-blue-500/20'
    }`,
    sectionTitle: 'text-3xl font-bold mb-8 flex items-center',
    toolsContainer: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    toolsRow: 'mb-12', // Añadido para separación entre filas
    pageContainer: 'max-w-7xl mx-auto px-4 py-8'
  };

  useEffect(() => {
    const stylesAnimation = `
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
      
      .animate-fall {
        animation: fall linear infinite;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = stylesAnimation;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Wrap tool icons with animation
  const wrapToolWithAnimation = (tool: any) => ({
    ...tool,
    icon: (props: any) => (
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {React.createElement(tool.icon, props)}
      </motion.div>
    )
  });

  // Aplicar animaciones a todas las herramientas
  const animatedMainTools = mainTools.map(wrapToolWithAnimation);
  const animatedFitnessTools = fitnessTools.map(wrapToolWithAnimation);
  const animatedPerformanceTools = performanceTools.map(wrapToolWithAnimation);
  const animatedEngagementTools = engagementTools.map(wrapToolWithAnimation);
  const animatedSpecializedTools = specializedTools.map(wrapToolWithAnimation);
  const animatedGroupTools = groupTools.map(wrapToolWithAnimation);
  const animatedVideoTools = videoTools.map(wrapToolWithAnimation);

  // ---------------------------
  // NUEVA SECCIÓN: Filtrar solo las herramientas deseadas
  // ---------------------------
  const allowedToolIds = ['posts', 'stories', 'content-strategy', 'social-content', 'audience-analyzer'];
  const allAnimatedTools = [
    ...animatedMainTools,
    ...animatedFitnessTools,
    ...animatedPerformanceTools,
    ...animatedEngagementTools,
    ...animatedSpecializedTools,
    ...animatedGroupTools,
    ...animatedVideoTools
  ];
  const filteredTools = allAnimatedTools.filter(tool => allowedToolIds.includes(tool.id));
  // ---------------------------

  const handleToolClick = (tool: Tool) => {
    console.log('ContentPublishingPage - handleToolClick llamado con tool:', tool);
    
    const config = toolsConfig[tool.id];
    
    if (!config) {
      console.error(`No se encontró configuración para la herramienta: ${tool.id}`);
      return;
    }

    // Si tiene una ruta definida, navegar a ella
    if (config.path) {
      navigate(config.path);
      return;
    }

    // Si tiene un componente definido, mostrar el componente
    if (config.component) {
      const stateSetter = {
        'express-plans': setShowExpressPlans,
        'injury-diagnosis': setShowInjuryDiagnosis,
        'lifestyle-guide': setShowLifestyleGuide,
        'plateau-strategies': setShowPlateauStrategies,
        'content-strategy': setShowContentStrategy,
        'smart-goals': setShowSmartGoals,
        'social-content': setShowSocialContent,
        'challenges': setShowChallenges,
        'progress-simulator': setShowProgressSimulator,
        'home-equipment': setShowHomeEquipment,
        'office-breaks': setShowOfficeBreaks,
        'personal-marketing': setShowPersonalMarketing,
        'travel-training': setShowTravelTraining,
        'group-classes': setShowGroupClasses,
        'micro-habits': setShowMicroHabits,
        'audience-analyzer': setShowAudienceAnalyzer,
        'ai-creator': setIsAICreatorOpen,
        'ai-edit': setIsAIEditOpen,
        'ai-translate': setIsAITranslateOpen,
        'ai-twin': setIsAITwinOpen,
        'content-planner': setIsContentPlannerOpen
      }[tool.id];

      if (stateSetter) {
        stateSetter(true);
        return;
      }
    }

    // Si no tiene configuración específica, mostrar el modal genérico
    setSelectedTool(tool);
    setIsModalOpen(true);
    setSelectedChat(tool.chatId);
  };

  const handleCloseModal = () => {
    console.log('ContentPublishingPage - Cerrando modal');
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleSendMessage = async (message: string) => {
    console.log('ContentPublishingPage - handleSendMessage llamado con mensaje:', message);
    console.log('ContentPublishingPage - selectedTool actual:', selectedTool);
    
    if (!selectedTool) {
      console.error('ContentPublishingPage - No hay herramienta seleccionada');
      return;
    }

    try {
      const response = await chatService.sendMessage(selectedTool.chatId, message);
      console.log('ContentPublishingPage - Respuesta del servidor:', response);
      return response;
    } catch (error) {
      console.error('ContentPublishingPage - Error al enviar mensaje:', error);
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageContainer}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={styles.title}>
            <Sparkles className="w-10 h-10 text-blue-500" />
            <span className={`${styles.titleGradient} bg-clip-text text-transparent`}>
              Centro de Creación de Contenido
            </span>
            <Wand2 className="w-10 h-10 text-purple-500" />
          </h1>
          <p className={`text-xl mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Crea contenido increíble para tu audiencia
          </p>
        </motion.div>

        {/* Tools Section */}
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.sectionTitle}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="mr-4"
            >
              <Sparkles className="w-8 h-8 text-blue-500" />
            </motion.div>
            <span className={`${styles.titleGradient} bg-clip-text text-transparent`}>
              Herramientas Disponibles
            </span>
          </motion.h2>
          
          {/* Dividir las herramientas en filas para mejor organización */}
          {(() => {
            // Dividir herramientas en filas de 3 (para pantallas grandes)
            const rows = [];
            const itemsPerRow = 3;
            
            for (let i = 0; i < filteredTools.length; i += itemsPerRow) {
              const rowTools = filteredTools.slice(i, i + itemsPerRow);
              rows.push(
                <div key={`row-${i}`} className={styles.toolsRow}>
                  <div className={styles.toolsContainer}>
                    {rowTools.map((tool) => (
                      <motion.div
                        key={tool.id}
                        className={`${styles.toolCard} h-[360px] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700`} // Aumentado de h-[300px] a h-[360px]
                        whileHover={{ scale: 1.05, boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.04)' }} // Sombra más pronunciada
                        whileTap={{ scale: 0.95 }}
                      >
                        <ToolCard 
                          key={tool.id}
                          tool={tool}
                          onClick={() => handleToolClick(tool)}
                          theme={theme}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            }
            
            return rows;
          })()}
        </div>

        {/* ----------------------- */}
        {/* Resto de los modales y componentes */}
        {/* ----------------------- */}
        
        {/* Modales de las herramientas de video */}
        <AnimatePresence>
          {isAICreatorOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <AICreator 
                  isOpen={isAICreatorOpen}
                  onClose={() => setIsAICreatorOpen(false)}
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAIEditOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <AIEdit 
                  isOpen={isAIEditOpen}
                  onClose={() => setIsAIEditOpen(false)}
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAITranslateOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <AITranslate 
                  isOpen={isAITranslateOpen}
                  onClose={() => setIsAITranslateOpen(false)}
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAITwinOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <AITwin 
                  isOpen={isAITwinOpen}
                  onClose={() => setIsAITwinOpen(false)}
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isContentPlannerOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      onClick={() => setIsContentPlannerOpen(false)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <ContentPlanner />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Express Plans Generator Modal */}
        <AnimatePresence>
          {showExpressPlans && (
            <ExpressPlansGenerator
              isVisible={showExpressPlans}
              onClose={() => setShowExpressPlans(false)}
            />
          )}
        </AnimatePresence>

        {/* Injury Diagnosis Analyzer Modal */}
        <AnimatePresence>
          {showInjuryDiagnosis && (
            <InjuryDiagnosisAnalyzer
              isVisible={showInjuryDiagnosis}
              onClose={() => setShowInjuryDiagnosis(false)}
            />
          )}
        </AnimatePresence>

        {/* Lifestyle Guide Analyzer Modal */}
        <AnimatePresence>
          {showLifestyleGuide && (
            <LifestyleGuideAnalyzer
              isVisible={showLifestyleGuide}
              onClose={() => setShowLifestyleGuide(false)}
            />
          )}
        </AnimatePresence>

        {/* Plateau Strategies Planner Modal */}
        <AnimatePresence>
          {showPlateauStrategies && (
            <PlateauStrategiesPlanner
              isVisible={showPlateauStrategies}
              onClose={() => setShowPlateauStrategies(false)}
            />
          )}
        </AnimatePresence>

        {/* Content Strategy Modal */}
        <AnimatePresence>
          {showContentStrategy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <ContentStrategy 
                  isVisible={showContentStrategy}
                  onClose={() => setShowContentStrategy(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smart Goals Modal */}
        <AnimatePresence>
          {showSmartGoals && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <SmartGoalsBuilder 
                  isVisible={showSmartGoals}
                  onClose={() => setShowSmartGoals(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Content Modal */}
        <AnimatePresence>
          {showSocialContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <SocialContentCreator 
                  isVisible={showSocialContent}
                  onClose={() => setShowSocialContent(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenges Modal */}
        <AnimatePresence>
          {showChallenges && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <ChallengesCreator 
                  isVisible={showChallenges}
                  onClose={() => setShowChallenges(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Simulator Modal */}
        <AnimatePresence>
          {showProgressSimulator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <ProgressSimulator 
                  isVisible={showProgressSimulator}
                  onClose={() => setShowProgressSimulator(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home Equipment Modal */}
        <AnimatePresence>
          {showHomeEquipment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <HomeEquipmentAdvisor 
                  isVisible={showHomeEquipment}
                  onClose={() => setShowHomeEquipment(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Office Breaks Modal */}
        <AnimatePresence>
          {showOfficeBreaks && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <OfficeBreaksDesigner 
                  isVisible={showOfficeBreaks}
                  onClose={() => setShowOfficeBreaks(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personal Marketing Modal */}
        <AnimatePresence>
          {showPersonalMarketing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <PersonalMarketingGenerator 
                  isVisible={showPersonalMarketing}
                  onClose={() => setShowPersonalMarketing(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Travel Training Modal */}
        <AnimatePresence>
          {showTravelTraining && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <TravelTrainingChat 
                  isVisible={showTravelTraining}
                  onClose={() => setShowTravelTraining(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Group Classes Modal */}
        <AnimatePresence>
          {showGroupClasses && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <GroupClassesManager 
                  isVisible={showGroupClasses}
                  onClose={() => setShowGroupClasses(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Micro Habits Modal */}
        <AnimatePresence>
          {showMicroHabits && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <MicroHabitsBuilder 
                  isVisible={showMicroHabits}
                  onClose={() => setShowMicroHabits(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audience Analyzer Modal */}
        <AnimatePresence>
          {showAudienceAnalyzer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <AudienceAnalyzer 
                  onClose={() => setShowAudienceAnalyzer(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Injury Diagnosis Modal */}
        <AnimatePresence>
          {showInjuryDiagnosis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <InjuryDiagnosis 
                  isVisible={showInjuryDiagnosis}
                  onClose={() => setShowInjuryDiagnosis(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Express Plans Modal */}
        <AnimatePresence>
          {showExpressPlans && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <ExpressPlans 
                  isVisible={showExpressPlans}
                  onClose={() => setShowExpressPlans(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-4xl h-[80vh] rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <AIChat
                  onSendMessage={handleSendMessage}
                  chatDescription={selectedTool ? chatService.getChatDescription(selectedTool.chatId) : ''}
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentPublishingPage;
