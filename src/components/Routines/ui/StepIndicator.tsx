import React from 'react';
import { Check } from 'lucide-react';
import { Step } from '../FormulasPopup';

interface StepIndicatorProps {
  steps: { id: Step; label: string }[];
  currentStep: Step;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const getStepStatus = (stepId: Step) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  getStepStatus(step.id) === 'completed'
                    ? 'bg-green-500 text-white'
                    : getStepStatus(step.id) === 'current'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {getStepStatus(step.id) === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  getStepStatus(step.id) === 'completed'
                    ? 'text-green-500'
                    : getStepStatus(step.id) === 'current'
                    ? 'text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  getStepStatus(steps[index + 1].id) === 'completed'
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;