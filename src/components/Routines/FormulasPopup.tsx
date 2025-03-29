import React, { useState } from 'react';
import { Dumbbell, HelpCircle } from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import Questionnaire from './steps/Questionnaire';
import PeriodSelection from './steps/PeriodSelection';
import ExerciseSelection from './steps/ExerciseSelection';
import StepIndicator from './ui/StepIndicator';
import Button from './ui/Button';

export type Step = 'questionnaire' | 'periods' | 'exercises';

export interface Period {
  start: number;
  end: number;
}

export interface Exercise {
  name: string;
  isConditional: boolean;
  isEnabled: boolean;
}

export interface ClientData {
  height: [number, number];
  weight: [number, number];
  objective: string;
}

const FormulasPopup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('questionnaire');
  const [clientData, setClientData] = useState<ClientData>({
    height: [150, 200],
    weight: [50, 100],
    objective: ''
  });
  const [selectedPeriods, setSelectedPeriods] = useState<Period[]>([]);
  const [exercises, setExercises] = useState<Record<number, Exercise[]>>({});

  const handleNext = () => {
    if (currentStep === 'questionnaire') setCurrentStep('periods');
    else if (currentStep === 'periods') setCurrentStep('exercises');
  };

  const steps = [
    { id: 'questionnaire', label: 'Información' },
    { id: 'periods', label: 'Períodos' },
    { id: 'exercises', label: 'Ejercicios' }
  ];

  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      steps: [
        {
          element: '#tutorial-header',
          popover: {
            title: 'Bienvenido al Creador de Fórmulas',
            description: 'Esta herramienta te ayudará a crear planes de entrenamiento personalizados.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tutorial-steps',
          popover: {
            title: 'Proceso en 3 Pasos',
            description: 'El proceso se divide en tres etapas: información del cliente, selección de períodos y configuración de ejercicios.',
            side: 'bottom'
          }
        },
        {
          element: '#tutorial-client-info',
          popover: {
            title: 'Información del Cliente',
            description: 'Aquí ingresarás los datos básicos del cliente, como altura, peso y objetivo principal.',
            side: 'right'
          }
        },
        {
          element: '#tutorial-recommendations',
          popover: {
            title: 'Recomendaciones',
            description: 'Encuentra consejos útiles para completar cada sección correctamente.',
            side: 'left'
          }
        },
        {
          element: '#tutorial-next',
          popover: {
            title: 'Navegación',
            description: 'Usa este botón para avanzar al siguiente paso cuando hayas completado la información.',
            side: 'left'
          }
        }
      ]
    });

    driverObj.drive();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-indigo-100">
        <div id="tutorial-header" className="border-b bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Dumbbell className="w-6 h-6" />
            </div>
            Creador de Fórmulas para Entrenadores Personales
          </h1>
          <Button
            variant="secondary"
            onClick={startTutorial}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Tutorial
          </Button>
        </div>

        <div id="tutorial-steps">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-12rem)] custom-scrollbar">
          {currentStep === 'questionnaire' && (
            <Questionnaire
              clientData={clientData}
              setClientData={setClientData}
              onNext={handleNext}
            />
          )}
          {currentStep === 'periods' && (
            <PeriodSelection
              selectedPeriods={selectedPeriods}
              setSelectedPeriods={setSelectedPeriods}
              onNext={handleNext}
            />
          )}
          {currentStep === 'exercises' && (
            <ExerciseSelection
              selectedPeriods={selectedPeriods}
              exercises={exercises}
              setExercises={setExercises}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulasPopup;