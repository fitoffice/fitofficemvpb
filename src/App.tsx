 import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes, 
  Navigate,
  useLocation,
} from 'react-router-dom';
import Header from './components/Common/Header';
import Sidebar from './components/Common/Sidebar';
import ClientsPage from './pages/paginascliente/ClientsPage';
import RoutinesPage from './pages/paginasentrenamiento/RoutinesPage';
import DietsPage from './pages/DietsPage';
import EconomicsPage from './pages/paginaseconomia/EconomicsPage';
import MarketingCampaignsPage from './pages/MarketingCampaignsPage';
import MarketingAnalyticsPage from './pages/MarketingAnalyticsPage';
import ContentPublishingPage from './pages/ContentPublishingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AjustesPage from './pages/AjustesPage';
import Publications from './pages/Publications';
import EditPlanningPage from './pages/paginasentrenamiento/EditPlanningPage';
import PlantillaPage from './components/Routines/plantillas/PlantillaPage';
import ClassesPage from './pages/ClassesPage';
import PageEdicionDieta from './pages/PageEdicionDieta';
import LoginPage from './pages/LoginPage';
import ServiciosPage from './pages/ServiciosPage';
import CommandAssister from './components/CommandAssister/CommandAssister';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Reportesweb from './pages/Reportesweb';
import AIPostCreator from './pages/AIPostCreator';
import AIStoryCreator from './pages/AIStoryCreator';
import AgentesPage from './pages/AgentesPage';
import NutritionAgentPage from './pages/NutritionAgentPage';
import { LicenciaModalProvider } from './contexts/LicenciaModalContext';
import { LicenciaEditModalProvider } from './contexts/LicenciaEditModalContext';
import { ContratoModalProvider } from './contexts/ContratoModalContext';
import { DocumentoModalProvider } from './contexts/DocumentoModalContext';
import { ModalProvider } from './context/ModalContext';
import AddLicenciaModal from './components/Economics/Documentos/AddLicenciaModal';
import AddContratoModal from './components/Economics/Documentos/AddContratoModal';
import AddDocumentoModal from './components/Economics/Documentos/AddDocumentoModal';
import PaymentPlanPage from './pages/PaymentPlanPage';
import AIRoutinePage from './pages/AIRoutinePage';
import { CheckinProvider, useCheckin } from './contexts/CheckinContext';
import CheckinPage from './pages/paginascliente/CheckinPage';
import { AIRoutineModalProvider } from './contexts/AIRoutineModalContext';
import { PlanificacionModalProvider } from './contexts/PlanificacionModalContext';
// Add this import near the top with other page imports
import { PlanningProvider } from './contexts/PlanningContext'; // Import the PlanningProvider
import EmailMarketingPage from './pages/EmailMarketingPage';
import { ClientProvider } from './contexts/ClientContext';
import { ExerciseProvider } from './contexts/ExerciseContext';
import { useExercise } from './contexts/ExerciseContext';
import { AlertProvider } from './contexts/AlertContext';

import EditExercisePopup from './components/modals/EditExercisePopup';
import { CsvProvider } from './contexts/CsvContext';
import { AutomationProvider } from './contexts/AutomationContext';
import { EmailCampaignProvider } from './contexts/EmailCampaignContext';
import { GastosProvider } from './contexts/GastosContext';
import { GastoEditModalProvider } from './contexts/GastoEditModalContext';
import GastoEditModal from './components/Economics/GastoEditModal';
import { LicenciasProvider } from './contexts/LicenciasContext';
import { ContratosProvider } from './contexts/ContratosContext';
import { RoutineProvider } from './contexts/RoutineContext';
import { AddLicenciaModalProvider } from './contexts/AddLicenciaModalContext';
import { DietProvider } from './components/contexts/DietContext'; // Import the DietProvider
import { RoutineCreationProvider } from './contexts/RoutineCreationContext';
import { FilterProvider } from './contexts/FilterContext';
import { NotesProvider } from './contexts/NotesContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { selectedCheckin, setSelectedCheckin } = useCheckin();
  const [isCommandAssisterOpen, setIsCommandAssisterOpen] = useState(false);
  const location = useLocation();
  
  // Add this to use the ExerciseContext
  const { 
    selectedExercise, 
    isExerciseModalOpen, 
    closeExerciseModal, 
    currentPeriodIndex,
    currentPeriodId,
    currentPlanningId
  } = useExercise();
  console.log('Exercise Details:', {
    exerciseId: selectedExercise?.id || 'No exercise selected',
    exerciseName: selectedExercise?.nombre || 'N/A',
    periodId: currentPeriodId || 'No period ID',
    planningId: currentPlanningId || 'No planning ID',
    periodIndex: currentPeriodIndex !== undefined ? currentPeriodIndex : 'No period index'
  });


  // Si no hay usuario, mostrar la página de login
  if (location.pathname !== '/login' && !user) {
    return <Navigate to="/login" />;
  }

  // Si estamos en la ruta de login y hay usuario, redirigir al dashboard
  if (location.pathname === '/login' && user) {
    return <Navigate to="/" />;
  }

  // Si estamos en la ruta de login, mostrar solo el componente de login
  if (location.pathname === '/login') {
    return <LoginPage />;
  }

  // Determinar si estamos en la ruta "/edit-planning/:id"
  const isOnEditPlanningPage = location.pathname.startsWith('/edit-planning/');

  // Determinar si debemos ocultar el layout
  const shouldHideLayout = isCommandAssisterOpen && isOnEditPlanningPage;

  return (
    <div
      className={`flex ${shouldHideLayout ? '' : 'flex-col'} min-h-screen ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      {!shouldHideLayout && <Header />}
      <div className={`flex flex-1 ${shouldHideLayout ? '' : ''} relative`}>
        {!shouldHideLayout && <Sidebar />}
        
        <main className={`flex-1 ${shouldHideLayout ? '' : 'p-6'} overflow-y-auto`}>
          <Routes>
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/clients" element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
            <Route path="/routines" element={<PrivateRoute><RoutinesPage /></PrivateRoute>} />
            <Route path="/ai-routine" element={<PrivateRoute><AIRoutinePage /></PrivateRoute>} />
            <Route path="/diets" element={<PrivateRoute><DietsPage /></PrivateRoute>} />
            <Route path="/edicion-dieta/:id" element={<PrivateRoute><PageEdicionDieta /></PrivateRoute>} />
            <Route path="/economics" element={<PrivateRoute><EconomicsPage /></PrivateRoute>} />
            <Route path="/economics/cashflow" element={<PrivateRoute><EconomicsPage initialSection="cashflow" /></PrivateRoute>} />
            <Route path="/economics/servicios" element={<PrivateRoute><EconomicsPage initialSection="planes" /></PrivateRoute>} />
            <Route path="/economics/documentos" element={<PrivateRoute><EconomicsPage initialSection="documentos" /></PrivateRoute>} />
            <Route path="/economics/facturas" element={<PrivateRoute><EconomicsPage initialSection="facturas" /></PrivateRoute>} />
            <Route path="/economics/reportes" element={<PrivateRoute><EconomicsPage initialSection="reportes" /></PrivateRoute>} />
            <Route
                  path="/marketing/campaigns"
                  element={
                    <PrivateRoute>
                      <MarketingCampaignsPage />
                    </PrivateRoute>
                  }
                />
            <Route path="/email-marketing" element={<PrivateRoute><EmailMarketingPage /></PrivateRoute>} />
            <Route path="/marketing-campaigns" element={<PrivateRoute><MarketingCampaignsPage /></PrivateRoute>} />
            <Route path="/marketing-analytics" element={<PrivateRoute><MarketingAnalyticsPage /></PrivateRoute>} />
            <Route path="/content-publishing" element={<PrivateRoute><ContentPublishingPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/ajustes" element={<PrivateRoute><AjustesPage /></PrivateRoute>} />
            <Route path="/publications" element={<PrivateRoute><Publications /></PrivateRoute>} />
            <Route path="/edit-planning/:id" element={<PrivateRoute><EditPlanningPage /></PrivateRoute>} />
            <Route path="/plantilla/:id" element={<PrivateRoute><PlantillaPage /></PrivateRoute>} />
            <Route path="/classes" element={<PrivateRoute><ClassesPage /></PrivateRoute>} />
            <Route path="/servicios" element={<PrivateRoute><ServiciosPage /></PrivateRoute>} />
            <Route path="/reportes-web" element={<PrivateRoute><Reportesweb /></PrivateRoute>} />
            <Route path="/aipostcreator" element={<PrivateRoute><AIPostCreator /></PrivateRoute>} />
            <Route path="/aistory" element={<PrivateRoute><AIStoryCreator /></PrivateRoute>} />
            <Route path="/agentes" element={<PrivateRoute><AgentesPage /></PrivateRoute>} />
            <Route path="/nutrition-agent" element={<PrivateRoute><NutritionAgentPage /></PrivateRoute>} />
            <Route path="/payment-plan/:servicioId" element={<PrivateRoute><PaymentPlanPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Checkin Modal */}
        {selectedCheckin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <CheckinPage
                checkin={selectedCheckin}
                onClose={() => setSelectedCheckin(null)}
              />
            </div>
          </div>
        )}
        
        {/* Exercise Edit Modal */}
        {isExerciseModalOpen && selectedExercise && (
    <EditExercisePopup
      open={isExerciseModalOpen}
      onClose={closeExerciseModal}
      exercise={selectedExercise}
      onSave={(updatedExercise) => {
        // Store the updated exercise information before closing the modal
        console.log('Exercise updated:', updatedExercise);
        // Pass the updated exercise to closeExerciseModal to maintain state
        closeExerciseModal(updatedExercise);
      }}
      periodIndex={currentPeriodIndex}
      planningId={currentPlanningId}
      periodoId={currentPeriodId}
    />
  )}
      </div>
      <AddLicenciaModal />
      <AddContratoModal />
      <AddDocumentoModal />

      <div className={`fixed bottom-4 right-4 z-50 ${isCommandAssisterOpen ? 'w-96' : 'w-auto'}`}>
        <CommandAssister
          isExpanded={isCommandAssisterOpen}
          setIsExpanded={setIsCommandAssisterOpen}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CheckinProvider>
            <PlanningProvider>
              <LicenciaModalProvider>
                <LicenciaEditModalProvider>
                  <ContratoModalProvider>
                    <DocumentoModalProvider>
                      <ModalProvider>
                        <AIRoutineModalProvider>
                          <PlanificacionModalProvider>
                            <ExerciseProvider>
                              <CsvProvider>
                                <AutomationProvider>
                                  <EmailCampaignProvider>
                                    <ClientProvider>
                                      <GastosProvider>
                                        <GastoEditModalProvider>
                                          <LicenciasProvider>
                                            <ContratosProvider>
                                              <RoutineProvider>
                                                <AddLicenciaModalProvider>
                                                  <DietProvider>
                                                    <RoutineCreationProvider>
                                                      <AlertProvider>
                                                          <FilterProvider>
                                                            <NotesProvider>
                                                                <AppContent />
                                                            </NotesProvider>
                                                          </FilterProvider>
                                                      </AlertProvider>
                                                    </RoutineCreationProvider>
                                                  </DietProvider>
                                                </AddLicenciaModalProvider>
                                              </RoutineProvider>                      
                                            </ContratosProvider>
                                          </LicenciasProvider>
                                        </GastoEditModalProvider>
                                      </GastosProvider>
                                    </ClientProvider>
                                  </EmailCampaignProvider>
                                </AutomationProvider>
                              </CsvProvider>
                            </ExerciseProvider>
                          </PlanificacionModalProvider>
                        </AIRoutineModalProvider>
                      </ModalProvider>
                    </DocumentoModalProvider>
                  </ContratoModalProvider>
                </LicenciaEditModalProvider>
              </LicenciaModalProvider>
            </PlanningProvider>
          </CheckinProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
export default App;