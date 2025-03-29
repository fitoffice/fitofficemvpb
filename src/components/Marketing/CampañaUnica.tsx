import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CampaignOverview.css';
import { Mail, MousePointerClick, UserCheck, Send, Plus, Edit, Users, ChevronRight } from 'lucide-react';
import { EmailEditorPopup } from './EmailEditorPopup';
import { AssignClientsPopup } from './AssignClientsPopup';

interface EmailContent {
  subject?: string;
  content?: string;
}

interface EmailStats {
  enviados: number;
  recibidos: number;
  abiertos: number;
  clicks: number;
  conversion: number;
  content?: EmailContent;
}

interface CampañaUnicaProps {
  campaign: {
    id: string;
    name: string;
    description: string;
    sentDate: string;
    recipients: number;
    openRate: number;
    clickRate: number;
    pipeline: {
      name: string;
      count: number;
      percentage: number;
      emails: any[];
      _id: string;
    }[];
  };
  onClose: () => void;
}

export function CampañaUnica({ campaign, onClose }: CampañaUnicaProps) {
  const [emails, setEmails] = useState([1, 2, 3]);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [showAssignClients, setShowAssignClients] = useState(false);
  const [selectedEmailNumber, setSelectedEmailNumber] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Datos de ejemplo para las estadísticas de cada correo
  const emailStats: { [key: number]: EmailStats } = {
    1: {
      enviados: 100,
      recibidos: 95,
      abiertos: 75,
      clicks: 45,
      conversion: 20
    },
    2: {
      enviados: 150,
      recibidos: 140,
      abiertos: 100,
      clicks: 60,
      conversion: 25
    },
    3: {
      enviados: 200,
      recibidos: 185,
      abiertos: 130,
      clicks: 80,
      conversion: 35
    }
  };

  const handleEditEmail = (emailNumber: number) => {
    setSelectedEmailNumber(emailNumber);
    setIsEditing(true);
    setShowEmailEditor(true);
  };

  const handleCreateEmail = (emailNumber: number) => {
    setSelectedEmailNumber(emailNumber);
    setIsEditing(false);
    setShowEmailEditor(true);
  };

  const handleSaveEmail = (content: string) => {
    if (selectedEmailNumber) {
      // Aquí guardarías el contenido del correo en tu estado o backend
      console.log(`Guardando contenido para correo ${selectedEmailNumber}:`, content);
    }
  };

  const handleSendEmail = (emailNumber: number) => {
    console.log(`Enviando correo ${emailNumber}`);
    // Aquí iría la lógica para enviar el correo
  };

  const handleAddEmail = () => {
    const nextEmailNumber = Math.max(...emails) + 1;
    setEmails([...emails, nextEmailNumber]);
    // Añadir estadísticas iniciales para el nuevo correo
    emailStats[nextEmailNumber] = {
      enviados: 0,
      recibidos: 0,
      abiertos: 0,
      clicks: 0,
      conversion: 0
    };
  };

  const handleAssignClients = (emailNumber: number) => {
    setSelectedEmailNumber(emailNumber);
    setShowAssignClients(true);
  };

  const handleClientsAssigned = (clientIds: string[]) => {
    if (selectedEmailNumber) {
      console.log(`Asignando clientes ${clientIds.join(', ')} al correo ${selectedEmailNumber}`);
      // Aquí implementarías la lógica para asignar los clientes al correo
    }
  };

  const renderStatsRow = (label: string, value: number, total: number, icon: React.ReactNode) => {
    const percentage = ((value / total) * 100).toFixed(1);
    return (
      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50">
            {icon}
          </div>
          <span className="text-gray-700 font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <div className="px-2 py-1 bg-blue-50 rounded-full">
            <span className="text-blue-600 text-sm font-medium">{percentage}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-50 rounded-xl p-8 w-full max-w-7xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{campaign.name}</h2>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={handleAddEmail}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span className="font-medium">Crear otro correo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {emails.map((emailNumber) => {
            const stats = emailStats[emailNumber] || {
              enviados: 0,
              recibidos: 0,
              abiertos: 0,
              clicks: 0,
              conversion: 0
            };
            
            const hasContent = stats.content !== undefined;

            return (
              <motion.div
                key={emailNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: emailNumber * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Mail className="text-white/90" />
                    Correo {emailNumber}
                  </h3>
                </div>
                
                <div className="p-6">
                  {hasContent ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Asunto
                        </h4>
                        <p className="text-gray-600">{stats.content?.subject}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Contenido
                        </h4>
                        <p className="text-gray-600">{stats.content?.content}</p>
                      </div>
                      <button
                        onClick={() => handleEditEmail(emailNumber)}
                        className="flex items-center gap-2 w-full justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                        Editar correo
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCreateEmail(emailNumber)}
                      className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Plus size={20} />
                      <span className="font-medium">Crear correo</span>
                    </button>
                  )}

                  <div className="mt-6 space-y-3">
                    {renderStatsRow("Enviados", stats.enviados, stats.enviados || 1, <Send size={18} className="text-blue-600" />)}
                    {renderStatsRow("Recibidos", stats.recibidos, stats.enviados || 1, <Mail size={18} className="text-green-600" />)}
                    {renderStatsRow("Abiertos", stats.abiertos, stats.enviados || 1, <UserCheck size={18} className="text-purple-600" />)}
                    {renderStatsRow("Clicks", stats.clicks, stats.enviados || 1, <MousePointerClick size={18} className="text-orange-600" />)}
                    {renderStatsRow("Conversión", stats.conversion, stats.enviados || 1, <ChevronRight size={18} className="text-indigo-600" />)}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => handleAssignClients(emailNumber)}
                      className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Users size={18} />
                      <span className="font-medium">Asignar Contactos</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {showEmailEditor && selectedEmailNumber && (
          <EmailEditorPopup
            emailNumber={selectedEmailNumber}
            isEditing={isEditing}
            onClose={() => {
              setShowEmailEditor(false);
              setSelectedEmailNumber(null);
            }}
            onSave={handleSaveEmail}
          />
        )}

        {showAssignClients && selectedEmailNumber && (
          <AssignClientsPopup
            emailNumber={selectedEmailNumber}
            onClose={() => {
              setShowAssignClients(false);
              setSelectedEmailNumber(null);
            }}
            onAssign={handleClientsAssigned}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
