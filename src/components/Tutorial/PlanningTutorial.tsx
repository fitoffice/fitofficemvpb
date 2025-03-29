import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface PlanningTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanningTutorial: React.FC<PlanningTutorialProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [driverObj, setDriverObj] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Estilos personalizados para el tutorial
    const style = document.createElement('style');
    style.textContent = `
      .driver-popover {
        ${theme === 'dark' ? `
          background-color: #1f2937;
          color: #fff;
        ` : `
          background-color: #ffffff;
          color: #111827;
        `}
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      }
      .driver-popover-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        ${theme === 'dark' ? `
          color: #fff;
        ` : `
          color: #111827;
        `}
      }
      .driver-popover-description {
        font-size: 1rem;
        line-height: 1.5;
        ${theme === 'dark' ? `
          color: #d1d5db;
        ` : `
          color: #4b5563;
        `}
      }
      .driver-popover-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
      }
      .driver-popover-btn-next {
        ${theme === 'dark' ? `
          background-color: #3b82f6;
          color: #fff;
        ` : `
          background-color: #2563eb;
          color: #fff;
        `}
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: all 0.2s;
      }
      .driver-popover-btn-next:hover {
        opacity: 0.9;
      }
      .driver-popover-btn-prev {
        ${theme === 'dark' ? `
          background-color: #374151;
          color: #fff;
        ` : `
          background-color: #e5e7eb;
          color: #374151;
        `}
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: all 0.2s;
      }
      .driver-popover-btn-prev:hover {
        opacity: 0.9;
      }
      .driver-popover-progress-text {
        ${theme === 'dark' ? `
          color: #9ca3af;
        ` : `
          color: #6b7280;
        `}
      }
    `;
    document.head.appendChild(style);

    const driverInstance = driver({
      showProgress: true,
      allowClose: false,
      overlayClickNext: false,
      onDeactivated: () => {
        console.log('Tutorial deactivated');
        setCurrentStep(0);
        setIsMoving(false);
        onClose();
      },
      onHighlightStarted: (element) => {
        console.log('Highlight started for:', element?.id);
      },
      onNext: (element, step) => {
        console.log('Next clicked, current step:', step);
        if (step === 0) {
          return false;
        }
        if (!isMoving) {
          setCurrentStep(step + 1);
        }
        return true;
      },
      onPrevious: (element, step) => {
        console.log('Previous clicked, current step:', step);
        if (!isMoving) {
          setCurrentStep(step - 1);
        }
        return true;
      },
      steps: [
        {
          element: '#command-assister-button',
          popover: {
            title: 'Asistente de Comandos',
            description: 'Para empezar, presiona Ctrl + K o haz clic aquí para abrir el asistente de comandos.',
            side: "left",
            align: 'start',
            nextBtnText: '',
            doneBtnText: '',
            showButtons: ['close'],
          },
          onNext: () => {
            console.log('First step onNext called');
            return false;
          },
        },
        {
          element: '#command-input',
          popover: {
            title: 'Entrada de Comandos',
            description: 'En este campo podrás escribir mensajes y comandos. Por ejemplo, escribe "siguiente semana" o "semana anterior" para navegar entre semanas.',
            side: "left",
            align: 'start',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
          }
        },
        {
          element: '#week-navigation',
          popover: {
            title: 'Navegación entre Semanas',
            description: 'Prueba escribiendo "siguiente semana" o "semana siguiente" para avanzar a la siguiente semana. También puedes usar "semana anterior" para retroceder.',
            side: "bottom",
            align: 'start',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
          }
        },
        {
          element: '#content-area',
          popover: {
            title: 'Desplazamiento',
            description: 'Para moverte por la página, escribe "baja la pantalla" o "bajar pantalla". También puedes usar "sube la pantalla" para subir.',
            side: "left",
            align: 'start',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
          }
        },
        {
          element: '#vista-selector',
          popover: {
            title: 'Cambiar Vista',
            description: 'Escribe "ir a la vista compleja" para cambiar a la vista detallada donde podrás gestionar las sesiones.',
            side: "bottom",
            align: 'start',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
          }
        },
        {
          element: '#add-session-area',
          popover: {
            title: 'Añadir Sesión',
            description: 'Una vez en la vista compleja, escribe "añadir sesion" para crear una nueva sesión de entrenamiento.',
            side: "bottom",
            align: 'start',
            nextBtnText: 'Finalizar',
            prevBtnText: 'Anterior',
          }
        }
      ],
      onDestroy: () => {
        onClose();
        style.remove();
        setCurrentStep(0);
        setIsMoving(false);
      },
      onNextClick: (element) => {
        if (element?.id === 'command-assister-button') {
          return false; // No avanzar en el primer paso
        }
        return true;
      },
      onActivate: (element) => {
        if (element?.id === 'add-session-area') {
          // Asegurarse de que estamos en la vista compleja antes de mostrar este paso
          const event = new CustomEvent('changeView', { 
            detail: { view: 'compleja' } 
          });
          window.dispatchEvent(event);
        }
      },
      padding: 10,
      animate: true,
      stagePadding: 10,
      popoverClass: 'custom-tutorial-popover',
    });

    setDriverObj(driverInstance);

    return () => {
      style.remove();
      setCurrentStep(0);
      setIsMoving(false);
    };
  }, [onClose, theme]);

  useEffect(() => {
    const handleCommandAssisterOpen = () => {
      console.log('CommandAssister open event received');
      console.log('Current step:', currentStep);
      console.log('Is moving:', isMoving);
      
      if (driverObj && currentStep === 0 && !isMoving) {
        console.log('Moving to next step...');
        setIsMoving(true);
        setTimeout(() => {
          driverObj.moveNext();
          setCurrentStep(1);
          setIsMoving(false);
        }, 500);
      }
    };

    window.addEventListener('commandAssisterOpen', handleCommandAssisterOpen);
    
    return () => {
      window.removeEventListener('commandAssisterOpen', handleCommandAssisterOpen);
    };
  }, [driverObj, currentStep, isMoving]);

  useEffect(() => {
    if (isOpen && driverObj) {
      console.log('Starting tutorial, current step:', currentStep);
      driverObj.drive();
    }
  }, [isOpen, driverObj]);

  return null;
};

export default PlanningTutorial;
