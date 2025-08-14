import React from 'react';
import { AppStep, SavedSitePlan, PageWireframe } from '../types';
import { Icon } from './common/Icon';

interface StepNavigatorProps {
  currentAppStep: AppStep;
}

interface StepConfig {
  key: AppStep | string; // Can use a more general key if needed
  label: string;
  icon: string;
  relevantSteps: AppStep[];
}

const stepsConfig: StepConfig[] = [
  { key: "describe", label: "Describe", icon: "ChatBubbleIcon", relevantSteps: [AppStep.DESCRIPTION_INPUT, AppStep.SITEMAP_GENERATION_LOADING] },
  { key: "plan", label: "Plan & Wireframe", icon: "LayoutIcon", relevantSteps: [AppStep.SITEMAP_DISPLAY, AppStep.WIREFRAME_GENERATION_LOADING, AppStep.WIREFRAME_DISPLAY] },
  { key: "enhance", label: "Enhance", icon: "SparklesIcon", relevantSteps: [AppStep.ENHANCEMENTS_DISPLAY] },
];

// Helper to determine at which step an error likely occurred
const getErrorStepIndex = (): number => {
    const sitePlanDataString = localStorage.getItem('aiSitePlannerData');
    let sitemapGenerated = false;
    let allWireframesGeneratedAndValid = false;

    if (sitePlanDataString) {
        try {
            const parsedData: SavedSitePlan = JSON.parse(sitePlanDataString);
            sitemapGenerated = !!(parsedData.sitemap && parsedData.sitemap.length > 0);
            if (sitemapGenerated && parsedData.pageWireframes && parsedData.sitemap && parsedData.pageWireframes.length === parsedData.sitemap.length) {
                // All wireframes are considered generated and valid if every page has sections 
                // and none of those sections indicate an error from generation.
                allWireframesGeneratedAndValid = parsedData.pageWireframes.every(
                    (pw: PageWireframe) =>
                        pw.sections &&
                        pw.sections.length > 0 &&
                        !pw.sections.some(s => s.id.startsWith('error-')) && // Check for explicit error sections
                        !pw.isLoading // Ensure it's not still loading
                );
            }
        } catch (e) {
            console.error("Error parsing localStorage data in StepNavigator", e);
            // Defaults (sitemapGenerated = false, allWireframesGeneratedAndValid = false) will apply
        }
    }

    if (!sitemapGenerated) return 0; // Error in Describe step (or before sitemap saved)
    if (!allWireframesGeneratedAndValid) return 1; // Error in Plan step (sitemap exists, but wireframes incomplete/error)
    return 2; // Error in Enhance step (sitemap and wireframes seem okay, error likely in enhancements)
};


export const StepNavigator: React.FC<StepNavigatorProps> = ({ currentAppStep }) => {
  
  const isActive = (stepConfig: StepConfig, currentIndex: number): boolean => {
    if (currentAppStep === AppStep.ERROR) {
      const errorStepIndex = getErrorStepIndex();
      return currentIndex === errorStepIndex;
    }
    return stepConfig.relevantSteps.includes(currentAppStep);
  };
  
  const isCompleted = (stepConfig: StepConfig, currentIndex: number): boolean => {
    if (currentAppStep === AppStep.ERROR) {
      const errorStepIndex = getErrorStepIndex();
      return currentIndex < errorStepIndex;
    }
    // For non-error states, find the index of the config that matches the currentAppStep
    const currentMainStepIndex = stepsConfig.findIndex(s => s.relevantSteps.includes(currentAppStep));
    
    if (currentMainStepIndex === -1) { 
      // Fallback if currentAppStep isn't directly in any main step's relevantSteps
      // This could happen if AppStep enum has more granular states not explicitly listed
      // We can try to infer completion based on common progression if needed, or assume nothing further is completed.
      // For now, if currentAppStep is not found in any relevantSteps, assume no further steps are completed beyond what's explicitly passed.
      // This case should ideally be minimal if relevantSteps are comprehensive.
      if (currentAppStep === AppStep.SITEMAP_GENERATION_LOADING) return currentIndex < 0; // Describe not yet complete
      if (currentAppStep === AppStep.WIREFRAME_GENERATION_LOADING && currentIndex < 1) return true; // Describe completed
      return false;
    }
    return currentIndex < currentMainStepIndex;
  };


  return (
    <nav aria-label="Progress" className="mb-8 p-4 bg-slate-100 rounded-lg shadow">
      <ol role="list" className="flex items-center justify-around space-x-2 sm:space-x-4">
        {stepsConfig.map((step, index) => {
          const active = isActive(step, index);
          const completed = isCompleted(step, index);
          return (
            <li key={step.label} className="relative flex-1">
              <div className="flex items-center text-sm font-medium">
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full 
                  ${active ? 'bg-indigo-600 text-white' : completed ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}
                >
                  <Icon name={step.icon} className="w-5 h-5" />
                </span>
                <span className={`ml-2 hidden sm:block ${active ? 'text-indigo-600' : completed ? 'text-slate-700' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
              {index < stepsConfig.length - 1 && (
                <div className="absolute inset-0 top-4 left-auto right-0 hidden w-full sm:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-slate-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
