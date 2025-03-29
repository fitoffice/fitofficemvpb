import { 
    Users, Dumbbell, Salad, DollarSign, Megaphone, 
    Settings, PlusCircle, Save, Trash2, Edit
  } from 'lucide-react';
  import { NavigateFunction } from 'react-router-dom';
  import React from 'react';
  
  interface CommandOption {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: (navigate: NavigateFunction) => void;
    shortcut?: string[];
    context?: string[];
  }
  
  const handleNewItem = () => {
    console.log('Creating new item');
  };
  
  const handleSave = () => {
    console.log('Saving changes');
  };
  
  const handleDelete = () => {
    console.log('Deleting item');
  };
  
  const handleEdit = () => {
    console.log('Editing item');
  };

  export const commandOptions: CommandOption[] = [
    {
      id: 'clients',
      title: 'Gestionar Clientes',
      description: 'Administra la información de tus clientes',
      icon: React.createElement(Users, { size: 20 }),
      action: (navigate) => navigate('/clients'),
      shortcut: ['f', 'c']
    },
    {
      id: 'routines',
      title: 'Rutinas',
      description: 'Gestiona las rutinas de entrenamiento',
      icon: React.createElement(Dumbbell, { size: 20 }),
      action: (navigate) => navigate('/routines'),
      shortcut: ['f', 'r']
    },
    {
      id: 'diets',
      title: 'Dietas',
      description: 'Planes nutricionales personalizados',
      icon: React.createElement(Salad, { size: 20 }),
      action: (navigate) => navigate('/diets'),
      shortcut: ['f', 'd']
    },
    {
      id: 'economics',
      title: 'Economía',
      description: 'Gestiona tus finanzas',
      icon: React.createElement(DollarSign, { size: 20 }),
      action: (navigate) => navigate('/economics'),
      shortcut: ['f', 'e']
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Gestiona tus campañas',
      icon: React.createElement(Megaphone, { size: 20 }),
      action: (navigate) => navigate('/marketing/campaigns'),
      shortcut: ['f', 'm']
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Personaliza tu experiencia',
      icon: React.createElement(Settings, { size: 20 }),
      action: (navigate) => navigate('/settings'),
      shortcut: ['f', 's']
    },
    {
      id: 'new',
      title: 'Crear Nuevo',
      description: 'Añade un nuevo elemento',
      icon: React.createElement(PlusCircle, { size: 20 }),
      action: () => handleNewItem(),
      shortcut: ['f', 'n'],
      context: ['clients', 'routines', 'diets', 'economics']
    },
    {
      id: 'save',
      title: 'Guardar',
      description: 'Guarda los cambios',
      icon: React.createElement(Save, { size: 20 }),
      action: () => handleSave(),
      shortcut: ['f', 'g'],
      context: ['routines', 'diets', 'economics']
    },
    {
      id: 'delete',
      title: 'Eliminar',
      description: 'Elimina un elemento',
      icon: React.createElement(Trash2, { size: 20 }),
      action: () => handleDelete(),
      shortcut: ['f', 'x'],
      context: ['clients', 'routines', 'diets']
    },
    {
      id: 'edit',
      title: 'Editar',
      description: 'Edita un elemento',
      icon: React.createElement(Edit, { size: 20 }),
      action: () => handleEdit(),
      shortcut: ['f', 't'],
      context: ['clients', 'routines', 'diets']
    }
  ];