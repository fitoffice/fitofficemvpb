import React from 'react';

interface WizardProgressProps {
  steps: {
    id: number;
    label: string;
  }[];
  currentStep: number;
  className?: string;
}

const WizardProgress: React.FC<WizardProgressProps> = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center justify-between">
        {/* Progress Bar Background */}
        <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 -translate-y-1/2 z-0"></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 top-1/2 -translate-y-1/2 z-0 transition-all duration-300 ease-out"
          style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {/* Step Circles */}
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`relative z-10 flex flex-col items-center`}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.id <= currentStep + 1
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <span className="font-bold">{step.id}</span>
            </div>
            <span 
              className={`mt-2 text-sm font-medium transition-all duration-300 ${
                step.id <= currentStep + 1 ? 'text-gray-800' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardProgress;