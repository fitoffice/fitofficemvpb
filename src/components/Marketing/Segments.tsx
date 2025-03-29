import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SegmentHeader } from './components/SegmentHeader';
import { SegmentItem } from './components/SegmentItem';
import { SegmentModal } from './components/SegmentModal';
import { Client, Lead, Segment, FilterState } from './types';

interface SegmentsProps {
  onClose: () => void;
}

export function Segments({ onClose }: SegmentsProps) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [expandedSegments, setExpandedSegments] = useState<string[]>([]);
  const [showNewSegment, setShowNewSegment] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clientFilterState, setClientFilterState] = useState<FilterState>({
    isOpen: false,
    options: {
      minAge: '',
      maxAge: '',
      gender: [],
      region: '',
      interests: [],
      source: []
    }
  });
  const [leadFilterState, setLeadFilterState] = useState<FilterState>({
    isOpen: false,
    options: {
      minAge: '',
      maxAge: '',
      gender: [],
      region: '',
      interests: [],
      source: []
    }
  });
  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    region: '',
    interests: [] as string[],
    source: '',
    selectedClients: [] as string[],
    selectedLeads: [] as string[],
  });

  useEffect(() => {
    fetchClientsAndLeads();
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments', {
        headers
      });
      const data = await response.json();
      setSegments(data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const fetchClientsAndLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch clients
      const clientsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
        headers
      });
      const clientsData = await clientsResponse.json();
      setClients(clientsData);

      // Fetch leads
      const leadsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads', {
        headers
      });
      const leadsData = await leadsResponse.json();
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateSegment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const segmentData = {
        name: newSegment.name,
        description: newSegment.description,
        region: newSegment.region,
        interests: newSegment.interests,
        source: newSegment.source,
        clientIds: newSegment.selectedClients,
        leadIds: newSegment.selectedLeads
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/segments', {
        method: 'POST',
        headers,
        body: JSON.stringify(segmentData)
      });

      if (!response.ok) {
        throw new Error(`Error creating segment: ${response.statusText}`);
      }

      await fetchSegments();
      
      setShowNewSegment(false);
      setNewSegment({
        name: '',
        description: '',
        region: '',
        interests: [],
        source: '',
        selectedClients: [],
        selectedLeads: [],
      });
    } catch (error) {
      console.error('Error creating segment:', error);
    }
  };

  const deleteSegment = (id: string) => {
    setSegments(prev => prev.filter(seg => seg._id !== id));
  };

  const toggleSegmentExpansion = (segmentId: string) => {
    setExpandedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        <SegmentHeader onClose={onClose} />

        <div className="p-6">
        <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowNewSegment(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Segmento
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {segments.map((segment) => (
              <SegmentItem
                key={segment._id}
                segment={segment}
                isExpanded={expandedSegments.includes(segment._id)}
                onToggleExpand={toggleSegmentExpansion}
                onEdit={setEditingSegment}
                onDelete={deleteSegment}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>

      {(showNewSegment || editingSegment) && (
        <SegmentModal
          isEditing={!!editingSegment}
          segment={newSegment}
          onSegmentChange={updates => setNewSegment(prev => ({ ...prev, ...updates }))}
          clientFilterState={clientFilterState}
          onClientFilterStateChange={setClientFilterState}
          leadFilterState={leadFilterState}
          onLeadFilterStateChange={setLeadFilterState}
          onClose={() => {
            setShowNewSegment(false);
            setEditingSegment(null);
          }}
          onSave={handleCreateSegment}
        />
      )}
    </motion.div>
  );
}

<style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }
`}</style>
