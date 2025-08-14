
import React from 'react';
import { AppStep } from '../types';
import { Icon } from './common/Icon';

interface StepNavigatorProps {
  currentAppStep: AppStep;
}

interface StepConfig {
  key: string; 
  label: string;
  icon: string;
  relevantSteps: AppStep[];
}

const stepsConfig: StepConfig[] = [
  { key: "describe", label: "Describe", icon: "ChatBubbleIcon", relevantSteps: [AppStep.DESCRIPTION_INPUT, AppStep.SITEMAP_GENERATION_LOADING] },
  { key: "plan", label: "Plan & Wireframe", icon: "LayoutIcon", relevantSteps: [AppStep.SITEMAP_DISPLAY, AppStep.WIREFRAME_GENERATION_LOADING] },
  { key: "enhance", label: "Enhance", icon: "SparklesIcon", relevantSteps: [AppStep.ENHANCEMENTS_DISPLAY] },
];

const getStepIndexForState = (step: AppStep): number => {
  const index = stepsConfig.findIndex(config => config.relevantSteps.includes(step));
  if (index !== -1) return index;

  // Fallback logic for states that might not be explicitly in a step, but imply a completed step
  if (step === AppStep.SITEMAP_DISPLAY || step === AppStep.WIREFRAME_GENERATION_LOADING) return 1;
  if (step === AppStep.ENHANCEMENTS_DISPLAY) return 2;
  return 0; // Default to first step
};


export const StepNavigator: React.FC<StepNavigatorProps> = ({ currentAppStep }) => {
  // On error, show the step where the process was initiated
  const activeStepOnPage = (currentAppStep === AppStep.ERROR) 
    ? getStepIndexForState(AppStep.DESCRIPTION_INPUT) // Or could be derived from previous state
    : getStepIndexForState(currentAppStep);
  
  const currentStepIndex = getStepIndexForState(currentAppStep);

  return (
    <nav aria-label="Progress" className="mb-8 p-2 sm:p-4 bg-slate-50 rounded-lg ">
      <ol role="list" className="flex items-center justify-around space-x-2 sm:space-x-4">
        {stepsConfig.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isActive = currentStepIndex === index;
          const isError = isActive && currentAppStep === AppStep.ERROR;

          return (
            <li key={step.label} className="relative flex-1">
              <div className="flex items-center text-sm font-medium">
                <span className={`flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300
                  ${isError ? 'bg-red-500 text-white' :
                    isActive ? 'bg-indigo-600 text-white' : 
                    isCompleted ? 'bg-indigo-500 text-white' : 
                    'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}
                >
                  <Icon name={isError ? 'ExclamationTriangleIcon' : step.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                <span className={`ml-2 hidden sm:block font-semibold 
                  ${isError ? 'text-red-600' :
                    isActive ? 'text-indigo-600' : 
                    isCompleted ? 'text-slate-700' : 
                    'text-slate-500'}`}
                >
                  {step.label}
                </span>
              </div>
              {index < stepsConfig.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(50%-1px)] w-[calc(100%-2.5rem)] sm:w-[calc(100%-3rem)] h-0.5 bg-slate-300" aria-hidden="true">
                  <div className={`h-0.5 rounded-full bg-indigo-500 transition-all duration-500 ${isCompleted || isActive ? 'w-full' : 'w-0'}`}></div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
