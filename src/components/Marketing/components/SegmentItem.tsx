import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Edit2, Trash2, Users, Filter } from 'lucide-react';
import { Client, Lead, Segment } from '../types';

interface SegmentItemProps {
  segment: Segment;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (segment: Segment) => void;
  onDelete: (id: string) => void;
}

export function SegmentItem({ segment, isExpanded, onToggleExpand, onEdit, onDelete }: SegmentItemProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onToggleExpand(segment._id)}
              className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {segment.name}
              </h3>
            </button>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm">
              {segment.clients.length + segment.leads.length} miembros
            </span>
          </div>
          <p className="text-gray-600 mb-4">{segment.description}</p>

          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <div className="py-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Detalles del Segmento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de creación:</p>
                    <p className="text-sm font-medium">{new Date(segment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última actualización:</p>
                    <p className="text-sm font-medium">{new Date(segment.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Miembros del Segmento</h4>
                <div className="space-y-2">
                  {segment.clients.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Clientes ({segment.clients.length})</h5>
                      <div className="flex flex-wrap gap-2">
                        {segment.clients.map((client) => (
                          <div
                            key={`member-${client._id}`}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-2"
                          >
                            <Users className="h-3 w-3" />
                            {client.email}
                            {client.planningActivo && 
                              <span className="text-emerald-600">
                                ({client.planningActivo.nombre})
                              </span>
                            }
                            {client.dietaActiva && 
                              <span className="text-emerald-600">
                                ({client.dietaActiva.nombre})
                              </span>
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {segment.leads.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Leads ({segment.leads.length})</h5>
                      <div className="flex flex-wrap gap-2">
                        {segment.leads.map((lead) => (
                          <div
                            key={`member-${lead._id}`}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-2"
                          >
                            <Filter className="h-3 w-3" />
                            {lead.email}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(segment)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(segment._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
