import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Trash2, Mail } from 'lucide-react';
import axios from 'axios';

interface Contact {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
}

interface GestionContactosProps {
  campaignId: string;
  stageId: string;
  onClose: () => void;
}

export function GestionContactos({ campaignId, stageId, onClose }: GestionContactosProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({ email: '', name: '', phone: '' });

  useEffect(() => {
    fetchContacts();
  }, [campaignId, stageId]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campaign/${campaignId}/stage/${stageId}/contacts`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setContacts(response.data);
    } catch (error) {
      console.error('Error al cargar los contactos:', error);
      setError('Error al cargar los contactos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.email) {
      setError('El email es obligatorio');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campaign/${campaignId}/stage/${stageId}/contacts`,
        newContact,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setNewContact({ email: '', name: '', phone: '' });
      fetchContacts();
    } catch (error) {
      console.error('Error al añadir el contacto:', error);
      setError('Error al añadir el contacto');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/campaign/${campaignId}/stage/${stageId}/contacts/${contactId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchContacts();
    } catch (error) {
      console.error('Error al eliminar el contacto:', error);
      setError('Error al eliminar el contacto');
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Gestión de Contactos</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search and Add Contact */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar contactos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Add New Contact Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Añadir nuevo contacto</h3>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="email"
                placeholder="Email *"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nombre"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddContact}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Añadir Contacto
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Contacts List */}
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      Cargando contactos...
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron contactos
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          {contact.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">{contact.name || '-'}</td>
                      <td className="px-6 py-4">{contact.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
