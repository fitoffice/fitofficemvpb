import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { ArrowRight, Edit2, Trash2, ChevronDown, ChevronRight, Mail, Paperclip, UserPlus, Users, ArrowLeftRight, Plus, Send } from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

interface Email {
  id: string;
  asunto: string;
  contenido: string;
  remitente: string;
  destinatario: string;
  fecha: string;
  tieneAdjuntos: boolean;
  etiquetas: string[];
}

interface PipelineStage {
  id: string;
  nombre: string;
  descripcion: string;
  contactos: number;
  estado: 'Nuevo' | 'Contactado' | 'Cualificado' | 'Propuesta' | 'Negociación' | 'Cerrado';
  etapa: number;
  numProductos: number;
  emails: Email[];
}

interface Contact {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  origen: string;
}

const getEtapasKanban = (numEtapas: number) => {
  const etapas = [];
  for (let i = 1; i <= numEtapas; i++) {
    etapas.push({
      id: i.toString(),
      nombre: `Etapa ${i}`
    });
  }
  return etapas;
};

const pipelineEjemplo: PipelineStage[] = [
  {
    id: '1',
    nombre: 'Campaña Email Q1',
    descripcion: 'Leads de campaña email Q1',
    contactos: 45,
    estado: 'Nuevo',
    etapa: 3,
    numProductos: 3,
    emails: [
      {
        id: 'email1',
        asunto: 'Propuesta Inicial de Servicios',
        contenido: 'Estimado cliente, adjunto encontrará nuestra propuesta detallada...',
        remitente: 'ana.garcia@empresa.com',
        destinatario: 'cliente@empresa.com',
        fecha: '2024-01-15',
        tieneAdjuntos: true,
        etiquetas: ['propuesta', 'importante']
      },
      {
        id: 'email2',
        asunto: 'Seguimiento de Reunión',
        contenido: 'Gracias por su tiempo en la reunión de hoy. Como acordamos...',
        remitente: 'carlos.lopez@empresa.com',
        destinatario: 'cliente@empresa.com',
        fecha: '2024-01-20',
        tieneAdjuntos: false,
        etiquetas: ['seguimiento']
      }
    ]
  },
  {
    id: '2',
    nombre: 'Referidos Premium',
    descripcion: 'Leads de programa de referidos',
    contactos: 28,
    estado: 'Contactado',
    etapa: 2,
    numProductos: 5,
    emails: [
      {
        id: 'email3',
        asunto: 'Documentación Requerida',
        contenido: 'Para proceder con la siguiente fase, necesitamos...',
        remitente: 'maria.sanchez@empresa.com',
        destinatario: 'cliente@empresa.com',
        fecha: '2024-01-18',
        tieneAdjuntos: true,
        etiquetas: ['documentación']
      }
    ]
  },
  {
    id: '3',
    nombre: 'Webinar Fitness',
    descripcion: 'Asistentes al webinar de fitness',
    contactos: 15,
    estado: 'Cualificado',
    etapa: 3,
    numProductos: 2,
    emails: [
      {
        id: 'email4',
        asunto: 'Confirmación Demo Personalizada',
        contenido: 'Confirmamos la sesión de demostración para...',
        remitente: 'juan.perez@empresa.com',
        destinatario: 'cliente@empresa.com',
        fecha: '2024-01-25',
        tieneAdjuntos: false,
        etiquetas: ['demo', 'agenda']
      }
    ]
  },
];

const estadoColors = {
  'Nuevo': 'bg-blue-100 text-blue-800',
  'Contactado': 'bg-purple-100 text-purple-800',
  'Cualificado': 'bg-green-100 text-green-800',
  'Propuesta': 'bg-yellow-100 text-yellow-800',
  'Negociación': 'bg-orange-100 text-orange-800',
  'Cerrado': 'bg-gray-100 text-gray-800',
};

const contactosEjemplo: Contact[] = [
  {
    id: 'c1',
    nombre: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    telefono: '+34 666 777 888',
    empresa: 'Tech Solutions',
    origen: 'LinkedIn'
  },
  {
    id: 'c2',
    nombre: 'María García',
    email: 'maria.garcia@empresa.com',
    telefono: '+34 666 999 000',
    empresa: 'Digital Services',
    origen: 'Referido'
  },
  {
    id: 'c3',
    nombre: 'Carlos López',
    email: 'carlos.lopez@empresa.com',
    telefono: '+34 666 111 222',
    empresa: 'Marketing Pro',
    origen: 'Webinar'
  }
];

export function Pipeline() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedOpportunity, setSelectedOpportunity] = useState<PipelineStage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedContactForEmail, setSelectedContactForEmail] = useState<Contact | null>(null);
  const [pipelineContacts, setPipelineContacts] = useState<Contact[]>([]);
  const [otherContacts, setOtherContacts] = useState<Contact[]>(contactosEjemplo);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [emailData, setEmailData] = useState({
    asunto: '',
    contenido: '',
    adjuntos: [] as File[]
  });

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const toggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContacts);
    if (selectedContacts.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  const moveSelectedToPipeline = () => {
    const contactsToMove = otherContacts.filter(contact => selectedContacts.has(contact.id));
    setPipelineContacts([...pipelineContacts, ...contactsToMove]);
    setOtherContacts(otherContacts.filter(contact => !selectedContacts.has(contact.id)));
    setSelectedContacts(new Set());
  };

  const moveSelectedFromPipeline = () => {
    const contactsToMove = pipelineContacts.filter(contact => selectedContacts.has(contact.id));
    setOtherContacts([...otherContacts, ...contactsToMove]);
    setPipelineContacts(pipelineContacts.filter(contact => !selectedContacts.has(contact.id)));
    setSelectedContacts(new Set());
  };

  const ContactsDialog = ({ opportunity }: { opportunity: PipelineStage }) => (
    <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogHeader>
        <DialogTitle>Gestión de Contactos - {opportunity.nombre}</DialogTitle>
        <DialogDescription>
          Selecciona los contactos y usa los botones para moverlos entre las listas
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6 grid grid-cols-1 gap-6">
        {/* Tabla de Contactos en Pipeline */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contactos en Pipeline
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={moveSelectedFromPipeline}
              disabled={![...selectedContacts].some(id => pipelineContacts.some(c => c.id === id))}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Quitar seleccionados
            </Button>
          </div>
          <div className="bg-white rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Origen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineContacts.map((contacto) => (
                  <TableRow 
                    key={contacto.id}
                    className={selectedContacts.has(contacto.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contacto.id)}
                        onChange={() => toggleContactSelection(contacto.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell>{contacto.nombre}</TableCell>
                    <TableCell>{contacto.email}</TableCell>
                    <TableCell>{contacto.telefono}</TableCell>
                    <TableCell>{contacto.empresa}</TableCell>
                    <TableCell>{contacto.origen}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Controles centrales */}
        <div className="flex justify-center items-center gap-4">
          <ArrowLeftRight className="h-6 w-6 text-gray-400" />
        </div>

        {/* Tabla de Otros Contactos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Otros Contactos
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={moveSelectedToPipeline}
              disabled={![...selectedContacts].some(id => otherContacts.some(c => c.id === id))}
              className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Añadir seleccionados
            </Button>
          </div>
          <div className="bg-white rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Origen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherContacts.map((contacto) => (
                  <TableRow 
                    key={contacto.id}
                    className={selectedContacts.has(contacto.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contacto.id)}
                        onChange={() => toggleContactSelection(contacto.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell>{contacto.nombre}</TableCell>
                    <TableCell>{contacto.email}</TableCell>
                    <TableCell>{contacto.telefono}</TableCell>
                    <TableCell>{contacto.empresa}</TableCell>
                    <TableCell>{contacto.origen}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Dialog>
  );

  const EmailDialog = () => (
    <Dialog isOpen={isEmailDialogOpen} onClose={() => setIsEmailDialogOpen(false)}>
      <DialogHeader>
        <DialogTitle>Enviar Correo Electrónico</DialogTitle>
        <DialogDescription>
          Redacta y envía un correo electrónico a {selectedContactForEmail?.nombre}
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6 space-y-4">
        {/* Lista de destinatarios */}
        <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-800">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destinatario:</h4>
          <div className="flex flex-wrap gap-2">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {selectedContactForEmail?.email}
            </span>
          </div>
        </div>

        {/* Formulario del correo */}
        <div className="space-y-4">
          <div>
            <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Asunto
            </label>
            <input
              type="text"
              id="asunto"
              value={emailData.asunto}
              onChange={(e) => setEmailData(prev => ({ ...prev, asunto: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contenido
            </label>
            <textarea
              id="contenido"
              rows={6}
              value={emailData.contenido}
              onChange={(e) => setEmailData(prev => ({ ...prev, contenido: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Adjuntos
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
              <div className="space-y-1 text-center">
                <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:text-blue-400"
                  >
                    <span>Subir archivos</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setEmailData(prev => ({
                          ...prev,
                          adjuntos: [...prev.adjuntos, ...files]
                        }));
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, PDF hasta 10MB
                </p>
              </div>
            </div>
            {/* Lista de archivos adjuntos */}
            {emailData.adjuntos.length > 0 && (
              <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                {emailData.adjuntos.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailData(prev => ({
                          ...prev,
                          adjuntos: prev.adjuntos.filter((_, i) => i !== index)
                        }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsEmailDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              // Aquí iría la lógica para enviar el correo
              console.log('Enviando correo:', {
                destinatario: selectedContactForEmail?.email,
                ...emailData
              });
              setIsEmailDialogOpen(false);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </div>
      </div>
    </Dialog>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Pipeline de Ventas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona tus oportunidades de venta
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => {
              if (selectedContacts.size > 0) {
                setIsEmailDialogOpen(true);
              }
            }}
            disabled={selectedContacts.size === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Contactos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipelineEjemplo.map((oportunidad) => (
              <React.Fragment key={oportunidad.id}>
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleRow(oportunidad.id)}
                    >
                      {expandedRows.has(oportunidad.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{oportunidad.nombre}</TableCell>
                  <TableCell>{oportunidad.descripcion}</TableCell>
                  <TableCell>{oportunidad.contactos}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColors[oportunidad.estado]}`}>
                      {oportunidad.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                    {oportunidad.etapa}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {oportunidad.numProductos} {oportunidad.numProductos === 1 ? 'producto' : 'productos'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-600 hover:text-gray-700"
                        onClick={() => {
                          setSelectedOpportunity(oportunidad);
                          setIsDialogOpen(true);
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-700">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-green-600 hover:text-green-700"
                        onClick={() => {
                          setSelectedContactForEmail(contactosEjemplo[0]);
                          setIsEmailDialogOpen(true);
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRows.has(oportunidad.id) && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div 
                          className="grid gap-4"
                          style={{ 
                            gridTemplateColumns: `repeat(${oportunidad.etapa}, minmax(0, 1fr))` 
                          }}
                        >
                          {getEtapasKanban(oportunidad.etapa).map((etapa) => (
                            <div key={etapa.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {etapa.nombre}
                              </h4>
                              <div className="space-y-3">
                                {oportunidad.emails
                                  .filter(email => email.id.startsWith(`email${etapa.id}`))
                                  .map((email) => (
                                    <div
                                      key={email.id}
                                      className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-medium text-gray-900 dark:text-white">
                                          {email.asunto}
                                        </h5>
                                        {email.tieneAdjuntos && (
                                          <Paperclip className="h-4 w-4 text-gray-500" />
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                        {email.contenido}
                                      </p>
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {email.etiquetas.map((etiqueta, index) => (
                                          <span
                                            key={index}
                                            className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                          >
                                            {etiqueta}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                        <span>{email.remitente}</span>
                                        <span>{new Date(email.fecha).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  ))}
                                <Button
                                  variant="ghost"
                                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                                >
                                  + Nuevo Email
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedOpportunity && <ContactsDialog opportunity={selectedOpportunity} />}
      <EmailDialog />
    </div>
  );
}