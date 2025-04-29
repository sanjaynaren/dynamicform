import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  sectionTitles: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, sectionTitles }) => {
  
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Section {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          
        ></div>
      </div>
      
      <div className="relative mt-2">
        {sectionTitles.map((title, index) => {
          const stepPosition = ((index + 1) / totalSteps) * 100;
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${stepPosition}%` }}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  isCompleted
                    ? 'bg-blue-600'
                    : isCurrent
                    ? 'border-2 border-blue-600 bg-white'
                    : 'bg-gray-300'
                }`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;