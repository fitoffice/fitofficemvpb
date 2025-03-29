import React, { useState } from 'react';
import { emailService } from '../../services/emailService';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  subject: string;
  recipients: string;
  content: {
    html: string;
    text: string;
  };
  scheduledDate: string;
}

export function EmailCampaignForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    subject: '',
    recipients: '',
    content: {
      html: '',
      text: ''
    },
    scheduledDate: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recipientList = formData.recipients.split(',').map(email => email.trim());
      
      const payload = {
        name: formData.name,
        subject: formData.subject,
        recipients: recipientList,
        content: {
          html: formData.content.html,
          text: formData.content.text
        },
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined
      };

      await emailService.createCampaign(payload);
      toast.success("La campaña de email se ha creado exitosamente.");
      
      // Limpiar el formulario
      setFormData({
        name: '',
        subject: '',
        recipients: '',
        content: {
          html: '',
          text: ''
        },
        scheduledDate: ''
      });
    } catch (error) {
      toast.error("No se pudo crear la campaña. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre de la campaña
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
            Destinatarios (separados por comas)
          </label>
          <input
            type="text"
            id="recipients"
            name="recipients"
            value={formData.recipients}
            onChange={handleChange}
            required
            placeholder="email1@ejemplo.com, email2@ejemplo.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content.html" className="block text-sm font-medium text-gray-700">
            Contenido HTML
          </label>
          <textarea
            id="content.html"
            name="content.html"
            value={formData.content.html}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content.text" className="block text-sm font-medium text-gray-700">
            Contenido texto plano
          </label>
          <textarea
            id="content.text"
            name="content.text"
            value={formData.content.text}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
            Fecha programada (opcional)
          </label>
          <input
            type="datetime-local"
            id="scheduledDate"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        variant="create"
        className="w-full"
      >
        {loading ? 'Creando campaña...' : 'Crear campaña'}
      </Button>
    </form>
  );
}
