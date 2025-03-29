import React, { useState, useEffect } from 'react';
import { X, Mail, Users, PlusCircle, Send, ArrowRight, UserCheck, MousePointerClick, ArrowUpRight } from 'lucide-react';
import { GestionContactos } from './GestionContactos';
import { useTheme } from '../../contexts/ThemeContext';

interface EmailItem {
  id: string;
  recipient: string;
  email: string;
  status: 'sent' | 'received' | 'opened' | 'clicked' | 'converted';
  date: string;
}

interface EmailStats {
  totalSent: number;
  received: number;
  opened: number;
  clicked: number;
  converted: number;
}

interface ManageStagePopupProps {
  onClose: () => void;
  campaignId: string;
  stageIndex: number;
  stageName: string;
  stageEmails: EmailItem[];
  onEmailsUpdated: (newEmails: EmailItem[]) => void;
}

interface EmailCardProps {
  email: EmailItem; // Changed from email._id: number
  stats: EmailStats;
  onDelete: () => void;
}


function EmailCard({ email, stats, onDelete }: EmailCardProps) {
  const { theme } = useTheme();

  const calculatePercentage = (value: number) => {
    if (stats.totalSent === 0) return 0;
    return ((value / stats.totalSent) * 100).toFixed(1);
  };

  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState<string>(email.asunto || "");
  const [emailBody, setEmailBody] = useState<string>(email.contenido || "");
  const [isExpanded, setIsExpanded] = useState<boolean>(email.expanded || false);
  // Add new state for schedule popup
  const [showSchedulePopup, setShowSchedulePopup] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [scheduleTime, setScheduleTime] = useState<string>("");
   // Add new state for contacts popup
   const [showContactsPopup, setShowContactsPopup] = useState<boolean>(false);
   const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
   const handleContactSelection = (contactId: string) => {
     if (selectedContacts.includes(contactId)) {
       setSelectedContacts(selectedContacts.filter(id => id !== contactId));
     } else {
       setSelectedContacts([...selectedContacts, contactId]);
     }
   };
 
 
 
  const handleSchedule = () => {
    if (scheduleDate && scheduleTime) {
      const formattedDate = new Date(`${scheduleDate}T${scheduleTime}`);
      const formattedDateString = `${formattedDate.toLocaleDateString()} ${formattedDate.getHours()}:${formattedDate.getMinutes().toString().padStart(2, '0')}`;
      setScheduledDate(formattedDateString);
      setShowSchedulePopup(false);
    }
  };

  return (
    <div className={`group ${
      theme === 'dark' 
        ? 'bg-gray-800 shadow-gray-900/5 hover:shadow-blue-900/10 border-gray-700/50' 
        : 'bg-white shadow-blue-500/5 hover:shadow-blue-500/10 border-gray-100/50'
    } rounded-2xl shadow-lg border overflow-hidden transition-all duration-300`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg text-white font-semibold">Correo {email._id}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-white/10 rounded-lg transition-colors duration-200 hover:bg-white/20"
          >
            {isExpanded ? 
              <ArrowUpRight className="w-4 h-4 text-white" /> : 
              <ArrowRight className="w-4 h-4 text-white" />
            }
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 bg-white/10 rounded-lg transition-colors duration-200 hover:bg-white/20"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Quick Status Section - Always visible */}
        <div className={`flex items-center justify-between mb-4 p-3 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        } rounded-xl`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${scheduledDate ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {scheduledDate ? 'Programado' : 'Sin programar'}
            </span>
          </div>
          <span className={`text-xs font-medium px-2 py-1 ${
            theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
          } rounded-full`}>
            {scheduledDate || "No programado"}
          </span>
        </div>
        
        {/* Expanded Content */}
        {isExpanded && (
          <>
            {/* Email Content Section */}
            <div className={`mb-4 p-3 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            } rounded-xl border`}>
              <div className="mb-3">
                <label htmlFor={`subject-${email._id}`} className={`block text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Asunto:
                </label>
                <input
                  id={`subject-${email._id}`}
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Ingrese el asunto del correo"
                  className={`w-full p-2 text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-gray-200 focus:ring-blue-600'
                      : 'border-gray-300 text-gray-700 focus:ring-blue-500'
                  } border rounded-lg focus:ring-2 focus:border-blue-500 transition-all`}
                />
              </div>
              
              <div>
                <label htmlFor={`body-${email._id}`} className={`block text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Contenido:
                </label>
                <textarea
                  id={`body-${email._id}`}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Ingrese el contenido del correo"
                  rows={3}
                  className={`w-full p-2 text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-gray-200 focus:ring-blue-600'
                      : 'border-gray-300 text-gray-700 focus:ring-blue-500'
                  } border rounded-lg focus:ring-2 focus:border-blue-500 transition-all resize-none`}
                ></textarea>
              </div>
            </div>
          </>
        )}
            
        <div className="mb-8 space-y-8">
          <div className="relative">
            <label 
              htmlFor={`subject-${email._id}`} 
              className={`absolute -top-2.5 left-3 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } px-2 text-xs font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Asunto del correo
            </label>
            <input
              id={`subject-${email._id}`}
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Ej: Oferta especial para ti"
              className={`w-full p-3 text-sm border-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500'
                  : 'border-gray-200 placeholder-gray-400'
              } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            />
          </div>

          <div className="relative">
            <label 
              htmlFor={`body-${email._id}`} 
              className={`absolute -top-2.5 left-3 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } px-2 text-xs font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Contenido del correo
            </label>
            <div className="relative">
              <textarea
                id={`body-${email._id}`}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Escribe el contenido de tu correo aquí..."
                rows={6}
                className={`w-full p-4 text-sm border-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500'
                    : 'border-gray-200 placeholder-gray-400'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none`}
              />
              <div className={`absolute bottom-3 right-3 flex items-center gap-2 text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span>{emailBody.length}</span>
                <span className={`w-px h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                <span>caracteres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Redesigned Layout */}
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setShowSchedulePopup(true)}
            className="py-2 px-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 text-xs font-medium"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Programar
          </button>

          {showSchedulePopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-lg p-6 w-full max-w-md`}>
                <h2 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>Programar Correo</h2>
                <div className="mb-4">
                  <label htmlFor="scheduleDate" className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } mb-1`}>Fecha</label>
                  <input
                    type="date"
                    id="scheduleDate"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className={`w-full p-2 text-sm border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'border-gray-300 text-gray-700'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="scheduleTime" className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } mb-1`}>Hora</label>
                  <input
                    type="time"
                    id="scheduleTime"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className={`w-full p-2 text-sm border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'border-gray-300 text-gray-700'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setShowSchedulePopup(false)} 
                    className={`py-2 px-4 ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } rounded-lg transition-colors duration-200`}
                  >
                    Cancelar
                  </button>
                  <button onClick={handleSchedule} className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200">
                    Programar
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <button className="py-2 px-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 text-xs font-medium">
            <Mail className="w-3.5 h-3.5" />
            Editar
          </button>
          
          <button 
            onClick={() => setShowContactsPopup(true)}
            className="py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 text-xs font-medium col-span-2"
          >
            <Users className="w-3.5 h-3.5" />
            Asignar Contactos
          </button>

          {showContactsPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-lg p-6 w-full max-w-md`}>
                <h2 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>Asignar Contactos</h2>
                <GestionContactos
                  onClose={() => setShowContactsPopup(false)}
                  selectedContacts={selectedContacts}
                  onContactSelection={handleContactSelection}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Stats Section - Compact */}
        {isExpanded && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-xs text-blue-700 mb-1">Enviados</div>
              <div className="text-sm font-bold">{stats.totalSent}</div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <div className="text-xs text-green-700 mb-1">Abiertos</div>
              <div className="text-sm font-bold">{stats.opened}</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <div className="text-xs text-purple-700 mb-1">Clicks</div>
              <div className="text-sm font-bold">{stats.clicked}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// Actualizar la interfaz EmailItem para que coincida con la estructura de datos que recibimos
interface EmailItem {
  _id: string;
  asunto: string;
  contenido: string;
  status: string;
  emailContacts: any[];
  leadContacts: any[];
  expanded?: boolean;
  variantes: any[];
}

// Actualizar ManageStagePopup para usar los emails recibidos
export function ManageStagePopup({ 
  onClose, 
  campaignId, 
  stageIndex, 
  stageName,
  stageEmails,
  onEmailsUpdated 
}: ManageStagePopupProps) {
  const { theme } = useTheme();
  // Reemplazar el estado de emails con los datos reales
  const [emails, setEmails] = useState<EmailItem[]>(stageEmails || []);
  const [showGestionContactos, setShowGestionContactos] = useState(false);

  // Actualizar emails cuando cambian los stageEmails
  useEffect(() => {
    if (stageEmails && stageEmails.length > 0) {
      setEmails(stageEmails);
    }
    
    console.log("Stage data received in ManageStagePopup:", {
      campaignId,
      stageIndex,
      stageName,
      stageEmails
    });
  }, [campaignId, stageIndex, stageName, stageEmails]);

  const calculateStats = (emailIndex: number): EmailStats => ({
    totalSent: emailIndex === 0 ? 100 : 150,
    received: emailIndex === 0 ? 95 : 140,
    opened: emailIndex === 0 ? 75 : 100,
    clicked: emailIndex === 0 ? 45 : 60,
    converted: emailIndex === 0 ? 20 : 25
  });
  const calculateTotalStats = (): EmailStats => {
    return {
      totalSent: 250,
      received: 235,
      opened: 175,
      clicked: 105,
      converted: 45
    };
  };

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  const handleAddNewEmail = () => {
    const newEmail: EmailItem = {
      _id: `temp-${Date.now()}`,
      asunto: "",
      contenido: "",
      status: "draft",
      emailContacts: [],
      leadContacts: [],
      expanded: false,
      variantes: []
    };
    const updatedEmails = [...emails, newEmail];
    setEmails(updatedEmails);
    
    // Notify parent component about the change
    if (onEmailsUpdated) {
      onEmailsUpdated(updatedEmails);
    }
  };
  const handleDeleteEmail = (index: number) => {
    setEmails(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
      <div className={`${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/30'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/30'
      } rounded-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border transform transition-all duration-500 animate-slideIn`}>
        <div className="flex justify-between items-center mb-6">
         
          <button
            onClick={onClose}
            className={`p-2.5 ${
              theme === 'dark'
                ? 'hover:bg-gray-700/80 text-gray-300'
                : 'hover:bg-white/80 text-gray-500'
            } rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110 active:scale-95`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          <div className={`group ${
            theme === 'dark'
              ? 'bg-gray-800 shadow-gray-900/5 hover:shadow-blue-900/10 border-gray-700/50 hover:bg-gradient-to-br hover:from-blue-900/30 hover:to-gray-800'
              : 'bg-white shadow-blue-500/5 hover:shadow-blue-500/10 border-gray-100/50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white'
          } p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Enviados</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'text-blue-400'
                  : 'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'
              }`}>{calculateTotalStats().totalSent}</span>
              <span className={`text-sm font-medium px-3 py-1 ${
                theme === 'dark'
                  ? 'bg-blue-900/30 text-blue-400'
                  : 'bg-blue-100 text-blue-700'
              } rounded-full`}>100%</span>
            </div>
          </div>

          <div className={`group ${
            theme === 'dark'
              ? 'bg-gray-800 shadow-gray-900/5 hover:shadow-green-900/10 border-gray-700/50 hover:bg-gradient-to-br hover:from-green-900/30 hover:to-gray-800'
              : 'bg-white shadow-green-500/5 hover:shadow-green-500/10 border-gray-100/50 hover:bg-gradient-to-br hover:from-green-50 hover:to-white'
          } p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Recibidos</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'text-green-400'
                  : 'bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent'
              }`}>{calculateTotalStats().received}</span>
              <span className={`text-sm font-medium px-3 py-1 ${
                theme === 'dark'
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-green-100 text-green-700'
              } rounded-full`}>
                {calculatePercentage(calculateTotalStats().received, calculateTotalStats().totalSent)}%
              </span>
            </div>
          </div>

          <div className={`group ${
            theme === 'dark'
              ? 'bg-gray-800 shadow-gray-900/5 hover:shadow-purple-900/10 border-gray-700/50 hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-gray-800'
              : 'bg-white shadow-purple-500/5 hover:shadow-purple-500/10 border-gray-100/50 hover:bg-gradient-to-br hover:from-purple-50 hover:to-white'
          } p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Abiertos</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'text-purple-400'
                  : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
              }`}>{calculateTotalStats().opened}</span>
              <span className={`text-sm font-medium px-3 py-1 ${
                theme === 'dark'
                  ? 'bg-purple-900/30 text-purple-400'
                  : 'bg-purple-100 text-purple-700'
              } rounded-full`}>
                {calculatePercentage(calculateTotalStats().opened, calculateTotalStats().totalSent)}%
              </span>
            </div>
          </div>

          <div className={`group ${
            theme === 'dark'
              ? 'bg-gray-800 shadow-gray-900/5 hover:shadow-orange-900/10 border-gray-700/50 hover:bg-gradient-to-br hover:from-orange-900/30 hover:to-gray-800'
              : 'bg-white shadow-orange-500/5 hover:shadow-orange-500/10 border-gray-100/50 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white'
          } p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <MousePointerClick className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Clicks</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'text-orange-400'
                  : 'bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent'
              }`}>{calculateTotalStats().clicked}</span>
              <span className={`text-sm font-medium px-3 py-1 ${
                theme === 'dark'
                  ? 'bg-orange-900/30 text-orange-400'
                  : 'bg-orange-100 text-orange-700'
              } rounded-full`}>
                {calculatePercentage(calculateTotalStats().clicked, calculateTotalStats().totalSent)}%
              </span>
            </div>
          </div>

          <div className={`group ${
            theme === 'dark'
              ? 'bg-gray-800 shadow-gray-900/5 hover:shadow-pink-900/10 border-gray-700/50 hover:bg-gradient-to-br hover:from-pink-900/30 hover:to-gray-800'
              : 'bg-white shadow-pink-500/5 hover:shadow-pink-500/10 border-gray-100/50 hover:bg-gradient-to-br hover:from-pink-50 hover:to-white'
          } p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Conversiones</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'text-pink-400'
                  : 'bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent'
              }`}>{calculateTotalStats().converted}</span>
              <span className={`text-sm font-medium px-3 py-1 ${
                theme === 'dark'
                  ? 'bg-pink-900/30 text-pink-400'
                  : 'bg-pink-100 text-pink-700'
              } rounded-full`}>
                {calculatePercentage(calculateTotalStats().converted, calculateTotalStats().totalSent)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-6 mb-6">
            <div className={`h-px ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent'
                : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'
            } flex-grow`}></div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark'
                ? 'text-gray-200 flex items-center gap-3'
                : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3'
            }`}>
              <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              Sección de correos de etapa
            </h3>
            <div className={`h-px ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent'
                : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'
            } flex-grow`}></div>
          </div>          <div className="flex justify-end">
            <button
              onClick={handleAddNewEmail}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Crear nuevo correo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {emails.length > 0 ? (
    emails.map((email, index) => (
      <EmailCard
        key={email._id}
        email={email} // Pass the entire email object
        stats={calculateStats(index)}
        onDelete={() => handleDeleteEmail(index)}
      />
    ))
  ) : (
    <div className={`col-span-3 p-8 text-center ${
      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    }`}>
      No hay correos en esta etapa. Crea uno nuevo para comenzar.
    </div>
  )}
</div>
      </div>
      {/* Modal de Gestión de Contactos */}
      {showGestionContactos && (
        <GestionContactos
          campaignId={campaignId}
          stageId={stageIndex}
          onClose={() => setShowGestionContactos(false)}
        />
      )}
    </div>
  );
}
