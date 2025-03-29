import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Mail, 
  Send, 
  Save, 
  AlertCircle,
  Gift,
  UserPlus,
  CalendarDays,
  Bell,
  MessageCircle,
  Target,
  Star,
  Award,
  Cake,
  Heart,
  ThumbsUp,
  PartyPopper,
  Trophy,
  Sparkles,
  Hourglass
} from 'lucide-react';

interface EmailEditorPopupProps {
  emailNumber: number;
  isEditing: boolean;
  onClose: () => void;
  onSave: (emailContent: string) => void;
}

export function EmailEditorPopup({ emailNumber, isEditing, onClose, onSave }: EmailEditorPopupProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showAIWriter, setShowAIWriter] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [tone, setTone] = useState('profesional');
  const [theme, setTheme] = useState('');
  const [showVariables, setShowVariables] = useState(false);

  const availableVariables = [
    { name: 'nombre', description: 'Nombre del cliente' },
    { name: 'edad', description: 'Edad del cliente' },
    { name: 'email', description: 'Correo electrónico del cliente' },
  ];

  const availableThemes = [
    { id: 'promocion', label: 'Promoción', icon: Gift },
    { id: 'bienvenida', label: 'Bienvenida', icon: UserPlus },
    { id: 'evento', label: 'Evento', icon: CalendarDays },
    { id: 'recordatorio', label: 'Recordatorio', icon: Bell },
    { id: 'informativo', label: 'Informativo', icon: MessageCircle },
    { id: 'seguimiento', label: 'Seguimiento', icon: Target },
    { id: 'vip', label: 'Cliente VIP', icon: Star },
    { id: 'premiacion', label: 'Premiación', icon: Award },
    { id: 'cumpleanos', label: 'Cumpleaños', icon: Cake },
    { id: 'agradecimiento', label: 'Agradecimiento', icon: Heart },
    { id: 'satisfaccion', label: 'Satisfacción', icon: ThumbsUp },
    { id: 'aniversario', label: 'Aniversario', icon: PartyPopper },
    { id: 'logro', label: 'Logro', icon: Trophy },
    { id: 'novedad', label: 'Novedad', icon: Sparkles },
    { id: 'urgente', label: 'Urgente', icon: Hourglass }
  ];

  const insertVariable = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    const textArea = document.getElementById('content') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const newContent = content.substring(0, start) + variable + content.substring(end);
      setContent(newContent);
      // Restaurar el foco y la posición del cursor
      textArea.focus();
      const newCursorPos = start + variable.length;
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify({ subject, content }));
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden border border-gray-100"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Mail className="text-white/90" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? `Editar Correo ${emailNumber}` : `Crear Correo ${emailNumber}`}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Personaliza tu mensaje para llegar a tu audiencia
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto scrollbar-custom">
          <style jsx global>{`
            .scrollbar-custom::-webkit-scrollbar {
              width: 8px;
            }
            .scrollbar-custom::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background: #666;
            }
          `}</style>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
                  Asunto
                </label>
                <button
                  type="button"
                  onClick={() => setShowAIWriter(!showAIWriter)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Escribir con IA
                </button>
              </div>
              
              {showAIWriter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                          Tono del mensaje
                        </label>
                        <select
                          id="tone"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                        >
                          <option value="profesional">Profesional</option>
                          <option value="casual">Casual</option>
                          <option value="amigable">Amigable</option>
                          <option value="formal">Formal</option>
                          <option value="entusiasta">Entusiasta</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                          Tema principal
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto scrollbar-custom">
                          {availableThemes.map((themeOption) => {
                            const IconComponent = themeOption.icon;
                            return (
                              <button
                                key={themeOption.id}
                                type="button"
                                onClick={() => setTheme(themeOption.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                  theme === themeOption.id
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <IconComponent size={20} className={theme === themeOption.id ? 'text-indigo-600' : 'text-gray-500'} />
                                <span className="text-sm font-medium">{themeOption.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción general
                      </label>
                      <textarea
                        id="aiPrompt"
                        value={aiPrompt}
                        onChange={(e) => setAIPrompt(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                        placeholder="Describe sobre qué quieres que sea el correo..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAIWriter(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const generateExampleContent = (prompt: string, tone: string, theme: string) => {
                            // Determinar el estilo basado en el tono
                            const toneStyles = {
                              profesional: {
                                greeting: 'Estimado/a',
                                closing: 'Atentamente',
                                style: 'formal y directo'
                              },
                              casual: {
                                greeting: '¡Hola!',
                                closing: '¡Saludos!',
                                style: 'relajado y cercano'
                              },
                              amigable: {
                                greeting: '¡Hola! 👋',
                                closing: '¡Un abrazo!',
                                style: 'cercano y personal'
                              },
                              formal: {
                                greeting: 'Distinguido/a',
                                closing: 'Cordialmente',
                                style: 'muy formal y respetuoso'
                              },
                              entusiasta: {
                                greeting: '¡Hola! 🎉',
                                closing: '¡Con energía!',
                                style: 'dinámico y motivador'
                              }
                            };

                            const selectedTone = toneStyles[tone as keyof typeof toneStyles];

                            // Usar el tema proporcionado o detectarlo del prompt
                            const emailTheme = theme || 
                              (prompt.toLowerCase().includes('promoción') ? 'promoción' :
                               prompt.toLowerCase().includes('bienvenida') ? 'bienvenida' : 'general');

                            // Generar el asunto basado en el tema y tono
                            let subject = '';
                            switch(emailTheme.toLowerCase()) {
                              case 'promoción':
                                subject = tone === 'formal' ? 
                                  'Oferta Exclusiva - FitOffice' : 
                                  '🎉 ¡Oferta Especial! 30% de descuento en tu próxima clase';
                                break;
                              case 'bienvenida':
                                subject = tone === 'formal' ? 
                                  'Bienvenido a FitOffice - Información Importante' : 
                                  '🌟 ¡Bienvenido a la familia FitOffice!';
                                break;
                              default:
                                subject = '💪 Descubre tu mejor versión en FitOffice';
                            }

                            // Generar el contenido base
                            let content = `${selectedTone.greeting},

${prompt}

`;

                            // Añadir contenido específico basado en el tema
                            if (emailTheme.toLowerCase() === 'promoción') {
                              content += `Te presentamos una oferta exclusiva diseñada especialmente para ti:

• 30% de descuento en tu próxima clase
• Acceso prioritario a nuevos horarios
• Sesión personalizada con instructor

`;
                            } else if (emailTheme.toLowerCase() === 'bienvenida') {
                              content += `Como parte de nuestra comunidad, tendrás acceso a:

• Clases personalizadas
• Instructores certificados
• Ambiente motivador
• Comunidad comprometida

`;
                            }

                            // Cerrar el correo
                            content += `${selectedTone.closing},
El equipo de FitOffice`;

                            setSubject(subject);
                            setContent(content);
                          };

                          generateExampleContent(aiPrompt, tone, theme);
                          setShowAIWriter(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                      >
                        Generar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="relative group">
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-gray-300"
                  placeholder="Ingrese el asunto del correo"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-sm text-gray-400">{subject.length}/100</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
                Contenido del correo
              </label>
              <div className="relative group">
                <textarea
                  id="content"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-gray-300"
                  placeholder="Escriba el contenido del correo aquí..."
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVariables(!showVariables)}
                    className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                  >
                    Insertar Variable
                  </button>
                  <span className="text-sm text-gray-400 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm">
                    {content.length} caracteres
                  </span>
                </div>
                {showVariables && (
                  <div className="absolute bottom-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                    <div className="text-sm font-medium text-gray-700 mb-2 px-2">Variables disponibles:</div>
                    {availableVariables.map((variable) => (
                      <button
                        key={variable.name}
                        onClick={() => {
                          insertVariable(variable.name);
                          setShowVariables(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        <span className="font-medium">{`{{${variable.name}}}`}</span>
                        <span className="text-gray-500 ml-2">- {variable.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle className="text-blue-500 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Consejos para un mejor correo</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Usa un asunto claro y conciso
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Personaliza el contenido para tu audiencia
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Incluye una llamada a la acción clara
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Revisa la ortografía antes de enviar
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 hover:scale-105"
              >
                <Mail size={18} />
                {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
              </button>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="group px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <span className="relative">
                    {isEditing ? <Save size={18} /> : <Send size={18} />}
                  </span>
                  <span className="relative">{isEditing ? 'Guardar cambios' : 'Crear correo'}</span>
                </button>
              </div>
            </div>
          </form>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 border-2 border-gray-200 rounded-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Vista previa del correo</h3>
              </div>
              <div className="p-6 bg-white">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <span className="text-sm text-gray-500 block mb-1">Asunto:</span>
                  <p className="text-gray-900 font-medium">{subject || '(Sin asunto)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-2">Contenido:</span>
                  <div className="mt-2 text-gray-700 whitespace-pre-wrap rounded-lg bg-gray-50 p-4">
                    {content || '(Sin contenido)'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
