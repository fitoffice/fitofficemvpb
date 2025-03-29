import React from 'react';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showNext?: boolean;
}

export function NavigationButtons({ 
  onBack, 
  onNext, 
  nextLabel = "Siguiente", 
  showNext = true 
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={onBack}
        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        ← Atrás
      </button>
      {showNext && (
        <button
          onClick={onNext}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          {nextLabel} →
        </button>
      )}
    </div>
  );
}