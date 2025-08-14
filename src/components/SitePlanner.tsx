
import React, { useState, useRef, useEffect, useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import { AppStep, SitemapPage, PageWireframe, SavedSitePlan, WireframeSection, SerpPreviewContent, SeoStrategyInsight } from '../types';
import { 
  generateSitemap, 
  generateWireframesForPage,
  generateLdJsonSchema,
  generateSiteSuggestions,
  generateChecklist,
  generateSerpPreviewContent,
  generateSeoStrategyInsights
} from '../services/geminiService';
import { Button } from './common/Button';
import { Loader } from './common/Loader';
import { Icon } from './common/Icon';
import { ChecklistDisplay } from './ChecklistDisplay';
import { seoChecklistData } from './checklists/seoChecklistData';
import { StepNavigator } from './StepNavigator';
import { SkeletonWireframeSection } from './SkeletonWireframeSection';
import { SerpPreviewDisplay } from './SerpPreviewDisplay';


interface SitePlannerProps {
  companyDescription: string;
  setCompanyDescription: React.Dispatch<React.SetStateAction<string>>;
  sitemap: SitemapPage[] | null;
  setSitemap: React.Dispatch<React.SetStateAction<SitemapPage[] | null>>;
  pageWireframes: PageWireframe[] | null;
  setPageWireframes: React.Dispatch<React.SetStateAction<PageWireframe[] | null>>;
  currentStep: AppStep;
  setCurrentStep: React.Dispatch<React.SetStateAction<AppStep>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const API_KEY_CONFIGURED = !!import.meta.env.VITE_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';
const LOCAL_STORAGE_KEY = 'aiSitePlannerData';

const SitemapReviewChecklist: React.FC = () => {
  const checklistItems = [
    "Does the sitemap include a clear Homepage?",
    "Is there an \"About Us\" or equivalent page?",
    "Is a \"Contact Us\" page present and easily accessible?",
    "Are key services, products, or core offerings represented as pages?",
    "If applicable, are pages for Blog/News, FAQ, Testimonials, or Portfolio included?",
    "Is the overall structure logical and user-friendly?",
    "Does it cover the primary goals of the website described?"
  ];

  return (
    <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow">
      <div className="flex items-center mb-3">
        <Icon name="ClipboardCheckIcon" className="w-6 h-6 text-indigo-600 mr-2" />
        <h4 className="text-md font-semibold text-indigo-700">Sitemap Review Checklist</h4>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
        {checklistItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p className="text-xs text-slate-500 mt-3 italic">Use this checklist to evaluate the generated sitemap against common best practices and your specific needs.</p>
    </div>
  );
};


export const SitePlanner: React.FC<SitePlannerProps> = ({
  companyDescription, setCompanyDescription,
  sitemap, setSitemap,
  pageWireframes, setPageWireframes,
  currentStep, setCurrentStep,
  isLoading, setIsLoading,
  error, setError
}) => {
  const [temperature, setTemperature] = useState<number>(0.7);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const sitePlanContentRef = useRef<HTMLDivElement>(null); // For PDF export
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  // State for enhancements & checklists
  const [ldJsonSchema, setLdJsonSchema] = useState<Array<Record<string, any>> | null>(null); // Updated type
  const [isLoadingLdJson, setIsLoadingLdJson] = useState<boolean>(false);
  const [errorLdJson, setErrorLdJson] = useState<string | null>(null);

  const [siteSuggestions, setSiteSuggestions] = useState<string[] | null>(null);
  const [isLoadingSiteSuggestions, setIsLoadingSiteSuggestions] = useState<boolean>(false);
  const [errorSiteSuggestions, setErrorSiteSuggestions] = useState<string | null>(null);
  
  const [goLiveChecklist, setGoLiveChecklist] = useState<string[] | null>(null);
  const [isLoadingGoLiveChecklist, setIsLoadingGoLiveChecklist] = useState<boolean>(false);
  const [errorGoLiveChecklist, setErrorGoLiveChecklist] = useState<string | null>(null);

  const [webDevChecklist, setWebDevChecklist] = useState<string[] | null>(null);
  const [isLoadingWebDevChecklist, setIsLoadingWebDevChecklist] = useState<boolean>(false);
  const [errorWebDevChecklist, setErrorWebDevChecklist] = useState<string | null>(null);
  
  const [serpPreview, setSerpPreview] = useState<SerpPreviewContent | null>(null);
  const [isLoadingSerpPreview, setIsLoadingSerpPreview] = useState<boolean>(false);
  const [errorSerpPreview, setErrorSerpPreview] = useState<string | null>(null);

  const [seoStrategy, setSeoStrategy] = useState<SeoStrategyInsight[] | null>(null);
  const [isLoadingSeoStrategy, setIsLoadingSeoStrategy] = useState<boolean>(false);
  const [errorSeoStrategy, setErrorSeoStrategy] = useState<string | null>(null);


  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };
  
  const resetEnhancementsState = (preserveLoaded: boolean = false) => {
    if (!preserveLoaded || !ldJsonSchema) { setLdJsonSchema(null); setIsLoadingLdJson(false); setErrorLdJson(null); }
    if (!preserveLoaded || !siteSuggestions) { setSiteSuggestions(null); setIsLoadingSiteSuggestions(false); setErrorSiteSuggestions(null); }
    if (!preserveLoaded || !goLiveChecklist) { setGoLiveChecklist(null); setIsLoadingGoLiveChecklist(false); setErrorGoLiveChecklist(null); }
    if (!preserveLoaded || !webDevChecklist) { setWebDevChecklist(null); setIsLoadingWebDevChecklist(false); setErrorWebDevChecklist(null); }
    if (!preserveLoaded || !serpPreview) { setSerpPreview(null); setIsLoadingSerpPreview(false); setErrorSerpPreview(null); }
    if (!preserveLoaded || !seoStrategy) { setSeoStrategy(null); setIsLoadingSeoStrategy(false); setErrorSeoStrategy(null); }
  };

  const handleStartOver = useCallback(() => {
    setSitemap(null);
    setPageWireframes(null);
    setCurrentStep(AppStep.DESCRIPTION_INPUT);
    setError(null);
    // setCompanyDescription(''); // Company description is cleared by the button calling this, if needed
    setIsSettingsOpen(false);
    setProgressMessage(null);
    resetEnhancementsState();
  }, [setCurrentStep, setError, setSitemap, setPageWireframes]);


  useEffect(() => {
    const savedDataJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDataJson) {
      try {
        const parsedData: SavedSitePlan = JSON.parse(savedDataJson);
        if (parsedData.companyDescription) setCompanyDescription(parsedData.companyDescription);
        if (parsedData.sitemap) setSitemap(parsedData.sitemap);
        if (parsedData.pageWireframes) {
            setPageWireframes(parsedData.pageWireframes.map(pw => ({ ...pw, isLoading: false })));
        }
        if (typeof parsedData.temperature === 'number') setTemperature(parsedData.temperature);
        
        if (parsedData.ldJsonSchema) setLdJsonSchema(parsedData.ldJsonSchema);
        if (parsedData.siteSuggestions) setSiteSuggestions(parsedData.siteSuggestions);
        if (parsedData.goLiveChecklist) setGoLiveChecklist(parsedData.goLiveChecklist);
        if (parsedData.webDevChecklist) setWebDevChecklist(parsedData.webDevChecklist);
        if (parsedData.serpPreview) setSerpPreview(parsedData.serpPreview);
        if (parsedData.seoStrategy) setSeoStrategy(parsedData.seoStrategy);

        if (parsedData.pageWireframes && parsedData.pageWireframes.length > 0 && parsedData.pageWireframes.every(pw => pw.sections && pw.sections.length > 0 && !pw.isLoading && !pw.sections.some(s => s.id.startsWith('error-')))) {
            setCurrentStep(AppStep.ENHANCEMENTS_DISPLAY); 
        } else if (parsedData.sitemap && parsedData.sitemap.length > 0) {
            setCurrentStep(AppStep.SITEMAP_DISPLAY);
        } else {
            setCurrentStep(AppStep.DESCRIPTION_INPUT);
        }
        showFeedback("Loaded saved plan.");
      } catch (e) {
        console.error("Failed to load saved site plan data:", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY); 
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSavePlan = () => {
    const planToSave: SavedSitePlan = {
      companyDescription,
      sitemap,
      pageWireframes: pageWireframes ? pageWireframes.map(pw => ({...pw, isLoading: undefined })) : null,
      temperature,
      progressMessage,
      ldJsonSchema,
      siteSuggestions,
      goLiveChecklist,
      webDevChecklist,
      serpPreview,
      seoStrategy,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(planToSave));
    showFeedback("Plan saved successfully!");
    setIsSettingsOpen(false);
  };
  
  const handleDownloadPlan = () => {
    const planData: SavedSitePlan = {
      companyDescription,
      sitemap,
      pageWireframes: pageWireframes ? pageWireframes.map(pw => ({...pw, isLoading: undefined })) : null,
      temperature,
      ldJsonSchema: ldJsonSchema || undefined,
      siteSuggestions: siteSuggestions || undefined,
      goLiveChecklist: goLiveChecklist || undefined,
      webDevChecklist: webDevChecklist || undefined,
      serpPreview: serpPreview || undefined,
      seoStrategy: seoStrategy || undefined,
    };
    const jsonString = JSON.stringify(planData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-site-plan-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showFeedback("Site plan JSON downloaded!");
    setIsSettingsOpen(false);
  };

  const handleExportToPdf = () => {
    const element = sitePlanContentRef.current;
    if (!element) {
      showFeedback("Error: Content to print not found.");
      return;
    }
    const opt = {
      margin:       0.5,
      filename:     `ai-site-plan-${new Date().toISOString().slice(0,10)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: -window.scrollY }, // Added scrollY
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
    showFeedback("Generating PDF...");
    setIsSettingsOpen(false);
  };

  const handleLoadPlan = () => {
     const savedDataJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDataJson) {
      try {
        const parsedData: SavedSitePlan = JSON.parse(savedDataJson);
        setCompanyDescription(parsedData.companyDescription || '');
        setSitemap(parsedData.sitemap || null);
        setPageWireframes(parsedData.pageWireframes ? parsedData.pageWireframes.map(pw => ({ ...pw, isLoading: false })) : null);
        setTemperature(parsedData.temperature ?? 0.7);
        setProgressMessage(parsedData.progressMessage || null);
        
        setLdJsonSchema(parsedData.ldJsonSchema || null);
        setSiteSuggestions(parsedData.siteSuggestions || null);
        setGoLiveChecklist(parsedData.goLiveChecklist || null);
        setWebDevChecklist(parsedData.webDevChecklist || null);
        setSerpPreview(parsedData.serpPreview || null);
        setSeoStrategy(parsedData.seoStrategy || null);

        if (parsedData.pageWireframes && parsedData.pageWireframes.length > 0 && parsedData.pageWireframes.every(pw => pw.sections && pw.sections.length > 0 && !pw.isLoading && !pw.sections.some(s => s.id.startsWith('error-')))) {
            setCurrentStep(AppStep.ENHANCEMENTS_DISPLAY);
        } else if (parsedData.sitemap && parsedData.sitemap.length > 0) {
            setCurrentStep(AppStep.SITEMAP_DISPLAY); 
        } else {
            setCurrentStep(AppStep.DESCRIPTION_INPUT);
        }
        setIsLoading(false);
        setError(null);
        showFeedback("Plan loaded successfully!");
      } catch (e) {
        console.error("Failed to parse saved data:", e);
        setError("Failed to load plan: data might be corrupted.");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } else {
      showFeedback("No saved plan found.");
    }
    setIsSettingsOpen(false);
  };

  const handleResetAllData = () => {
    if (window.confirm("Are you sure you want to reset all data? This will clear your company description, any saved plan, and start over.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCompanyDescription(''); 
      handleStartOver(); 
      setTemperature(0.7); 
      resetEnhancementsState();
      showFeedback("All data has been reset.");
      setIsSettingsOpen(false);
    }
  };

  const handleDescriptionSubmit = async () => {
    if (!companyDescription.trim()) {
      setError("Please describe your company or website idea.");
      return;
    }
    if (!API_KEY_CONFIGURED) {
        setError("API Key is not configured. Please set VITE_API_KEY in your .env file. See README.md.");
        setCurrentStep(AppStep.ERROR);
        return;
    }
    setError(null);
    setIsLoading(true);
    setProgressMessage("Generating your sitemap...");
    setCurrentStep(AppStep.SITEMAP_GENERATION_LOADING);
    resetEnhancementsState(); 

    try {
      const generatedSitemap = await generateSitemap(companyDescription, temperature);
      setSitemap(generatedSitemap);
      setPageWireframes(null); 
      if (generatedSitemap && generatedSitemap.length > 0) {
        setCurrentStep(AppStep.SITEMAP_DISPLAY); 
        setPageWireframes(generatedSitemap.map(p => ({ pageId: p.id, pageName: p.pageName, sections: [], isLoading: true })));
        await triggerWireframeGeneration(generatedSitemap, companyDescription, temperature); 
      } else {
        setError("Sitemap generation resulted in no pages. Please try a different description or adjust temperature.");
        setCurrentStep(AppStep.ERROR);
        setIsLoading(false);
        setProgressMessage(null);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown error occurred during sitemap generation.");
      setCurrentStep(AppStep.ERROR);
      setIsLoading(false);
      setProgressMessage(null);
    }
  };

  const triggerWireframeGeneration = async (currentSitemap: SitemapPage[], currentCompanyDescription: string, currentTemperature: number) => {
     if (!API_KEY_CONFIGURED) {
        setError("API Key is not configured for wireframe generation. Check VITE_API_KEY in your .env file.");
        setCurrentStep(AppStep.ERROR); 
        setIsLoading(false);
        setProgressMessage("API Key error for wireframes.");
        setPageWireframes(currentSitemap.map(p => ({ pageId: p.id, pageName: p.pageName, sections: [{id: 'api-key-error-section', sectionName: 'API Key Error', sectionPurpose: 'Cannot generate wireframe due to API key issue.'}], isLoading: false })));
        return;
    }
    if (!currentSitemap || currentSitemap.length === 0) {
      setError("Cannot generate wireframes without a valid sitemap.");
      setCurrentStep(AppStep.SITEMAP_DISPLAY); 
      setIsLoading(false);
      setProgressMessage("Sitemap error for wireframes.");
      return;
    }
    
    setIsLoading(true); 
    setCurrentStep(AppStep.WIREFRAME_GENERATION_LOADING); 
    setError(null); 
    resetEnhancementsState(true); 
    
    const builtPageWireframes: PageWireframe[] = [];

    for (let i = 0; i < currentSitemap.length; i++) {
      const page = currentSitemap[i];
      setProgressMessage(`Generating wireframe for "${page.pageName}" (${i + 1}/${currentSitemap.length})...`);
      
      setPageWireframes(prevPws => (prevPws || currentSitemap.map(p_init => ({ pageId: p_init.id, pageName: p_init.pageName, sections: [], isLoading: true }))).map(pw => pw.pageId === page.id ? {...pw, isLoading: true} : pw ));

      try {
        const sections: WireframeSection[] = await generateWireframesForPage(page.pageName, page.pageDescription, currentCompanyDescription, currentTemperature);
        builtPageWireframes.push({
          pageId: page.id,
          pageName: page.pageName,
          sections: sections,
          isLoading: false,
        });
      } catch (e) {
        console.error(`Error generating wireframe for page ${page.pageName}:`, e);
        builtPageWireframes.push({
          pageId: page.id,
          pageName: page.pageName,
          sections: [{id: `error-${page.id}-${Date.now()}`, sectionName: 'Error Generating Wireframe', sectionPurpose: `Could not generate wireframe sections for this page. ${e instanceof Error ? e.message : 'Unknown error.'}`}],
          isLoading: false,
        });
      }
      setPageWireframes(currentSitemap.map(sitemapPage => {
        const foundWireframe = builtPageWireframes.find(bw => bw.pageId === sitemapPage.id);
        if (foundWireframe) return foundWireframe;
        const existingOrInitial = (pageWireframes || currentSitemap.map(p_init => ({ pageId: p_init.id, pageName: p_init.pageName, sections: [], isLoading: true })))
                                  .find(opw => opw.pageId === sitemapPage.id);
        return existingOrInitial || { pageId: sitemapPage.id, pageName: sitemapPage.pageName, sections: [], isLoading: true };
      }));
    }
    
    setCurrentStep(AppStep.ENHANCEMENTS_DISPLAY); 
    setIsLoading(false); 
    setProgressMessage("Site plan complete!");
    setTimeout(() => setProgressMessage(null), 3000); 
  };
  
  const handleRegenerateFullPlan = () => {
     if (!companyDescription.trim()) {
      setError("Please describe your company or website idea to regenerate the plan.");
      return;
    }
    setSitemap(null);
    setPageWireframes(null);
    setIsSettingsOpen(false);
    resetEnhancementsState();
    handleDescriptionSubmit(); 
  }

  // Enhancement Generation Handlers
  const handleGenerateLdJson = async () => {
    if (!sitemap || !companyDescription) return;
    setIsLoadingLdJson(true); setErrorLdJson(null); setLdJsonSchema(null);
    try {
      const schemaArray = await generateLdJsonSchema(companyDescription, sitemap, temperature);
      setLdJsonSchema(schemaArray);
    } catch (e) {
      setErrorLdJson(e instanceof Error ? e.message : "Failed to generate LD+JSON");
    } finally {
      setIsLoadingLdJson(false);
    }
  };

  const handleGenerateSiteSuggestions = async () => {
    if (!sitemap || !companyDescription) return;
    setIsLoadingSiteSuggestions(true); setErrorSiteSuggestions(null); setSiteSuggestions(null);
    try {
      const suggestions = await generateSiteSuggestions(companyDescription, sitemap, temperature);
      setSiteSuggestions(suggestions);
    } catch (e) {
      setErrorSiteSuggestions(e instanceof Error ? e.message : "Failed to generate suggestions");
    } finally {
      setIsLoadingSiteSuggestions(false);
    }
  };

  const handleGenerateChecklistData = async (type: 'Go-Live' | 'Web Development') => {
    if (!sitemap || !companyDescription) return;
    if (type === 'Go-Live') {
      setIsLoadingGoLiveChecklist(true); setErrorGoLiveChecklist(null); setGoLiveChecklist(null);
    } else {
      setIsLoadingWebDevChecklist(true); setErrorWebDevChecklist(null); setWebDevChecklist(null);
    }
    try {
      const checklist = await generateChecklist(type, companyDescription, sitemap, temperature);
      if (type === 'Go-Live') setGoLiveChecklist(checklist);
      else setWebDevChecklist(checklist);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : `Failed to generate ${type} checklist`;
      if (type === 'Go-Live') setErrorGoLiveChecklist(errorMsg);
      else setErrorWebDevChecklist(errorMsg);
    } finally {
      if (type === 'Go-Live') setIsLoadingGoLiveChecklist(false);
      else setIsLoadingWebDevChecklist(false);
    }
  };
  
  const handleGenerateSerpPreview = async () => {
    if (!sitemap || !companyDescription) return;
    setIsLoadingSerpPreview(true); setErrorSerpPreview(null); setSerpPreview(null);
    try {
      const homepageData = sitemap.find(p => p.pageName.toLowerCase().includes('home') || p.id === sitemap[0].id);
      const preview = await generateSerpPreviewContent(companyDescription, homepageData, temperature);
      setSerpPreview(preview);
    } catch (e) {
      setErrorSerpPreview(e instanceof Error ? e.message : "Failed to generate SERP Preview");
    } finally {
      setIsLoadingSerpPreview(false);
    }
  };

  const handleGenerateSeoStrategy = async () => {
    if (!sitemap || !companyDescription) return;
    setIsLoadingSeoStrategy(true); setErrorSeoStrategy(null); setSeoStrategy(null);
    try {
      const strategy = await generateSeoStrategyInsights(companyDescription, sitemap, ldJsonSchema, temperature);
      setSeoStrategy(strategy);
    } catch (e) {
      setErrorSeoStrategy(e instanceof Error ? e.message : "Failed to generate SEO Strategy");
    } finally {
      setIsLoadingSeoStrategy(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsPanelRef.current && !settingsPanelRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl max-w-4xl mx-auto">
        <StepNavigator currentAppStep={currentStep} />

        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Let's Plan Your Website!
          </h2>
          <div className="relative">
            <Button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-slate-600 hover:text-indigo-600"
                aria-label="AI Settings"
                aria-expanded={isSettingsOpen}
                aria-controls="ai-settings-panel"
            >
                <Icon name="CogIcon" className="w-5 h-5 mr-1" /> AI Settings
            </Button>
            {isSettingsOpen && (
              <div 
                id="ai-settings-panel"
                ref={settingsPanelRef}
                className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-4 z-30 space-y-4" 
                role="dialog"
                aria-modal="true"
                aria-labelledby="ai-settings-title"
              >
                <div className="flex justify-between items-center">
                  <h3 id="ai-settings-title" className="text-md font-semibold text-slate-700">AI Configuration & Data</h3>
                  <Button onClick={() => setIsSettingsOpen(false)} variant="ghost" size="sm" aria-label="Close settings">
                    <Icon name="XMarkIcon" className="w-5 h-5" />
                  </Button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">API Key Status</label>
                  <p className={`text-xs p-2 rounded-md ${API_KEY_CONFIGURED ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {API_KEY_CONFIGURED ? "Configured (VITE_API_KEY)" : "Not Configured"}
                  </p>
                   {!API_KEY_CONFIGURED && <p className="text-xs text-red-600 mt-1">Set <code>VITE_API_KEY</code> in <code>.env</code> file. See README.</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">AI Model</label>
                  <p className="text-xs p-2 rounded-md bg-slate-100 text-slate-700">{MODEL_NAME}</p>
                </div>
                <div>
                  <label htmlFor="temperature-modal" className="block text-sm font-medium text-slate-700 mb-1">
                    AI Creativity: <span className="font-normal text-indigo-600">{temperature.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    id="temperature-modal"
                    name="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    disabled={isLoading || !API_KEY_CONFIGURED}
                    aria-describedby="temperature-description-modal"
                  />
                  <div id="temperature-description-modal" className="flex justify-between text-xs text-slate-500 mt-1 px-1">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-3 space-y-2">
                   <Button onClick={handleSavePlan} size="sm" className="w-full flex items-center justify-center" variant="outline">
                     <Icon name="SaveIcon" className="w-4 h-4 mr-2"/> Save Current Plan
                   </Button>
                   <Button onClick={handleLoadPlan} size="sm" className="w-full flex items-center justify-center" variant="outline">
                     <Icon name="FolderOpenIcon" className="w-4 h-4 mr-2"/> Load Saved Plan
                   </Button>
                   <Button onClick={handleDownloadPlan} size="sm" className="w-full flex items-center justify-center" variant="outline" disabled={!sitemap}>
                     <Icon name="DownloadIcon" className="w-4 h-4 mr-2"/> Export Plan (JSON)
                   </Button>
                   <Button onClick={handleExportToPdf} size="sm" className="w-full flex items-center justify-center" variant="outline" disabled={!sitemap || isLoading}>
                     <Icon name="FileTextIcon" className="w-4 h-4 mr-2"/> Export Plan (PDF)
                   </Button>
                   <Button onClick={handleResetAllData} size="sm" className="w-full flex items-center justify-center text-red-600 border-red-500 hover:bg-red-50" variant="outline">
                     <Icon name="TrashIcon" className="w-4 h-4 mr-2"/> Reset All Data
                   </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {feedbackMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm animate-pulse" role="status">
            {feedbackMessage}
          </div>
        )}

        {!API_KEY_CONFIGURED && currentStep !== AppStep.ERROR && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md" role="alert">
                <p className="font-bold">API Key Not Configured</p>
                <p>The AI Site Planner requires an API Key to function. Please ensure <code>VITE_API_KEY</code> is set in your <code>.env</code> file. See "AI Settings" or README.md for more info.</p>
            </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md" role="alert">
            <p className="font-bold">An Error Occurred:</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && <Loader message={
            progressMessage || 
            (currentStep === AppStep.SITEMAP_GENERATION_LOADING ? "Generating your sitemap..." : 
            currentStep === AppStep.WIREFRAME_GENERATION_LOADING ? "Crafting your wireframes..." : "Loading...")
            } />
        }
        
        <div id="site-plan-content-to-export" ref={sitePlanContentRef}> 
          {(currentStep === AppStep.DESCRIPTION_INPUT || (currentStep === AppStep.ERROR && !sitemap) || sitemap) && !isLoading && (
              <div className="space-y-6 mb-8">
                  <div>
                    <label htmlFor="companyDescription" className="block text-sm font-medium text-slate-700 mb-1">
                      Describe your company or website idea:
                    </label>
                    <textarea
                      id="companyDescription"
                      name="companyDescription"
                      rows={5}
                      className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                      placeholder="e.g., A local bakery specializing in custom cakes and pastries, offering online ordering and delivery."
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      disabled={isLoading || !API_KEY_CONFIGURED || currentStep !== AppStep.DESCRIPTION_INPUT}
                      aria-required="true"
                    />
                  </div>
                  
                  {currentStep === AppStep.DESCRIPTION_INPUT || (currentStep === AppStep.ERROR && !sitemap) ? (
                      <Button onClick={handleDescriptionSubmit} disabled={isLoading || !companyDescription.trim() || !API_KEY_CONFIGURED} className="w-full">
                          Generate Site Plan
                      </Button>
                  ) : (
                    sitemap && ( 
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleRegenerateFullPlan} variant="outline" className="w-full" disabled={isLoading || !companyDescription.trim() || !API_KEY_CONFIGURED}>
                            Regenerate Full Plan (Uses AI Settings)
                        </Button>
                      </div>
                    )
                  )}
                  {sitemap && sitemap.length > 0 && (currentStep === AppStep.SITEMAP_DISPLAY || currentStep === AppStep.WIREFRAME_GENERATION_LOADING || currentStep === AppStep.ENHANCEMENTS_DISPLAY || (currentStep === AppStep.ERROR && sitemap)) && <SitemapReviewChecklist />}
              </div>
          )}

          {sitemap && (currentStep === AppStep.SITEMAP_DISPLAY || currentStep === AppStep.WIREFRAME_GENERATION_LOADING || currentStep === AppStep.ENHANCEMENTS_DISPLAY || (currentStep === AppStep.ERROR && sitemap)) && !isLoading && (
            <div className="mt-2 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-2 sm:mb-0">Generated Site Plan:</h3>
                <Button onClick={() => { setCompanyDescription(''); handleStartOver();}} variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" disabled={isLoading}>
                    Start Over (New Idea & Description)
                </Button>
              </div>
              <div className="space-y-8" aria-live="polite" aria-atomic="true">
                {sitemap.map((page, pageIndex) => {
                  const wireframeForPage = pageWireframes?.find(pf => pf.pageId === page.id);
                  const isLoadingWireframe = wireframeForPage?.isLoading;
                  const hasWireframeError = wireframeForPage?.sections.some(s => s.id.startsWith('error-'));

                  return (
                    <div key={page.id} className="page-flow-item-container bg-slate-50 p-1 rounded-lg shadow-md">
                      <details className="group" open={pageIndex === 0 || !!wireframeForPage?.sections.length || hasWireframeError || isLoadingWireframe }>
                          <summary className="p-4 bg-indigo-100 rounded-t-lg border-2 border-indigo-200 shadow cursor-pointer hover:bg-indigo-200 transition-colors list-none">
                              <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                      <span className="bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full mr-3 shadow-sm">
                                      Page {pageIndex + 1}
                                      </span>
                                      <h4 className="text-md sm:text-lg font-semibold text-indigo-800">{page.pageName}</h4>
                                  </div>
                                  <Icon name="ChevronDownIcon" className="w-5 h-5 text-indigo-500 group-open:rotate-180 transform transition-transform duration-200" />
                              </div>
                              <p className="text-sm text-slate-600 mt-2 pl-10">{page.pageDescription}</p>
                          </summary>
                          <div className="bg-white rounded-b-lg border-x-2 border-b-2 border-indigo-200 p-1">
                          {isLoadingWireframe && (
                              <div className="p-4 text-sm text-slate-500 flex items-center justify-center">
                                  <Loader message={`Loading sections for ${page.pageName}...`} />
                              </div>
                          )}
                          {!isLoadingWireframe && wireframeForPage && wireframeForPage.sections.length > 0 && (
                              <div className={`mt-1 p-4 ${hasWireframeError ? 'bg-red-50' : 'bg-sky-50/50'}`}>
                                <h5 className={`text-sm font-semibold ${hasWireframeError ? 'text-red-700' : 'text-sky-800'} mb-3 flex items-center`}>
                                    <Icon name={hasWireframeError ? "ExclamationTriangleIcon" : "SquaresIcon"} className="w-4 h-4 mr-2" />
                                    {hasWireframeError ? 'Wireframe Generation Issue:' : 'Visual Skeleton Wireframe:'}
                                </h5>
                                <div className="space-y-3">
                                    {wireframeForPage.sections.map(section => (
                                      <SkeletonWireframeSection key={section.id} section={section} hasError={section.id.startsWith('error-')} />
                                    ))}
                                </div>
                              </div>
                          )}
                          {!isLoadingWireframe && wireframeForPage && wireframeForPage.sections.length === 0 && !hasWireframeError &&(
                              <div className="p-4 text-sm text-slate-500">No wireframe sections were generated for this page.</div>
                          )}
                          </div>
                      </details>
                      {pageIndex < sitemap.length - 1 && (
                          <div className="flex justify-center my-4" aria-hidden="true">
                            <Icon name="ArrowDownIcon" className="w-5 h-5 text-indigo-400"/>
                          </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div> 

        {currentStep === AppStep.ENHANCEMENTS_DISPLAY && !isLoading && sitemap && pageWireframes && API_KEY_CONFIGURED && (
          <div className="mt-12 pt-8 border-t-2 border-indigo-200">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Enhancements & Checklists</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-50 p-5 rounded-lg shadow">
                <div className="flex items-center mb-3">
                  <Icon name="SchemaIcon" className="w-6 h-6 text-indigo-600 mr-2" />
                  <h4 className="text-lg font-semibold text-slate-700">LD+JSON Schemas</h4>
                </div>
                {errorLdJson && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">{errorLdJson}</p>}
                {isLoadingLdJson && <Loader message="Generating LD+JSON..." />}
                {!isLoadingLdJson && ldJsonSchema && ldJsonSchema.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto p-1 bg-slate-200/50 rounded-md">
                    {ldJsonSchema.map((schema, index) => (
                      <details key={index} className="bg-slate-100 rounded-md">
                        <summary className="text-xs font-semibold text-slate-600 p-2 cursor-pointer">Schema {index + 1}: <span className="font-bold text-indigo-700">{schema['@type'] || 'Unknown Type'}</span></summary>
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all p-2 border-t border-slate-200 bg-white">
                          <code>{JSON.stringify(schema, null, 2)}</code>
                        </pre>
                      </details>
                    ))}
                  </div>
                )}
                {!isLoadingLdJson && (!ldJsonSchema || ldJsonSchema.length === 0) && (
                    <p className="text-sm text-slate-500 mb-3">Generate a rich set of LD+JSON schemas for your website to improve SEO visibility.</p>
                )}
                <Button onClick={handleGenerateLdJson} disabled={isLoadingLdJson || !API_KEY_CONFIGURED} size="sm" className="mt-3 w-full">
                  {ldJsonSchema && ldJsonSchema.length > 0 ? "Regenerate LD+JSON" : "Generate LD+JSON"}
                </Button>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg shadow">
                <div className="flex items-center mb-3">
                   <Icon name="LightBulbIcon" className="w-6 h-6 text-yellow-500 mr-2" />
                  <h4 className="text-lg font-semibold text-slate-700">AI Site Suggestions</h4>
                </div>
                {errorSiteSuggestions && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">{errorSiteSuggestions}</p>}
                {isLoadingSiteSuggestions && <Loader message="Generating suggestions..." />}
                {!isLoadingSiteSuggestions && siteSuggestions && (
                  <ChecklistDisplay data={siteSuggestions} type="simple" />
                )}
                 {!isLoadingSiteSuggestions && !siteSuggestions && (
                    <p className="text-sm text-slate-500 mb-3">Get AI-powered suggestions to enhance your website.</p>
                )}
                <Button onClick={handleGenerateSiteSuggestions} disabled={isLoadingSiteSuggestions || !API_KEY_CONFIGURED} size="sm" className="mt-3 w-full">
                  {siteSuggestions ? "Regenerate Suggestions" : "Get Suggestions"}
                </Button>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-lg shadow">
                <div className="flex items-center mb-3">
                    <Icon name="SearchIcon" className="w-6 h-6 text-blue-500 mr-2" />
                    <h4 className="text-lg font-semibold text-slate-700">SERP Preview</h4>
                </div>
                {errorSerpPreview && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">{errorSerpPreview}</p>}
                {isLoadingSerpPreview && <Loader message="Generating SERP Preview..." />}
                {!isLoadingSerpPreview && serpPreview && (
                  <SerpPreviewDisplay content={serpPreview} />
                )}
                {!isLoadingSerpPreview && !serpPreview && (
                    <p className="text-sm text-slate-500 mb-3">Generate an AI-powered SERP preview for your homepage.</p>
                )}
                <Button onClick={handleGenerateSerpPreview} disabled={isLoadingSerpPreview || !API_KEY_CONFIGURED} size="sm" className="mt-3 w-full">
                  {serpPreview ? "Regenerate SERP Preview" : "Generate SERP Preview"}
                </Button>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg shadow">
                <div className="flex items-center mb-3">
                   <Icon name="BrainIcon" className="w-6 h-6 text-purple-500 mr-2" />
                  <h4 className="text-lg font-semibold text-slate-700">AI SEO Strategy</h4>
                </div>
                {errorSeoStrategy && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">{errorSeoStrategy}</p>}
                {isLoadingSeoStrategy && <Loader message="Generating SEO Strategy..." />}
                {!isLoadingSeoStrategy && seoStrategy && (
                   <div className="space-y-3 max-h-80 overflow-y-auto p-1">
                    {seoStrategy.map(item => (
                      <div key={item.id} className="p-2 bg-slate-100 rounded">
                        <h6 className="text-sm font-medium text-slate-700">{item.title}</h6>
                        <p className="text-xs text-slate-600 mt-0.5">{item.explanation}</p>
                        {item.actionableTips && item.actionableTips.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-slate-500 mt-1 pl-2">
                            {item.actionableTips.map((tip, i) => <li key={i}>{tip}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                 {!isLoadingSeoStrategy && !seoStrategy && (
                    <p className="text-sm text-slate-500 mb-3">Get AI insights on SEO strategy linking structure, content, and schema.</p>
                )}
                <Button onClick={handleGenerateSeoStrategy} disabled={isLoadingSeoStrategy || !API_KEY_CONFIGURED} size="sm" className="mt-3 w-full">
                  {seoStrategy ? "Regenerate SEO Strategy" : "Get SEO Strategy"}
                </Button>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg shadow">
                 <div className="flex items-center mb-3">
                    <Icon name="ClipboardListIcon" className="w-6 h-6 text-green-600 mr-2" />
                    <h4 className="text-lg font-semibold text-slate-700">AI Go-Live Checklist</h4>
                </div>
                {errorGoLiveChecklist && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">{errorGoLiveChecklist}</p>}
                {isLoadingGoLiveChecklist && <Loader message="Generating Go-Live Checklist..." />}
                {!isLoadingGoLiveChecklist && goLiveChecklist && (
                  <ChecklistDisplay data={goLiveChecklist} type="simple" />
                )}
                 {!isLoadingGoLiveChecklist && !goLiveChecklist && (
                    <p className="text-sm text-slate-500 mb-3">Generate an AI-curated checklist for pre-launch verifications.</p>
                )}
                <Button onClick={() => handleGenerateChecklistData('Go-Live')} disabled={isLoadingGoLiveChecklist || !API_KEY_CONFIGURED} size="sm" className="mt-3 w-full">
                  {goLiveChecklist ? "Regenerate Go-Live Checklist" : "Generate Go-Live Checklist"}
                </Button>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-lg shadow">
                <div className="flex items-center mb-3">
                    <Icon name="ClipboardListIcon" className="w-6 h-6 text-sky-600 mr-2" />
                    <h4 className="text-lg font-semibold text-slate-700">AI Web Dev Checklist</h4>
                </div>
                {errorWebDevChecklist && <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">{errorWebDevChecklist}</p>}
                {isLoadingWebDevChecklist && <Loader message="Generating Web Dev Checklist..." />}
                {!isLoadingWebDevChecklist && webDevChecklist && (
                  <ChecklistDisplay data={webDevChecklist} type="simple" />
                )}
                {!isLoadingWebDevChecklist && !webDevChecklist && (
                    <p className="text-sm text-slate-500 mb-3">Get an AI-generated list of key tasks for web development.</p>
                )}
                <Button onClick={() => handleGenerateChecklistData('Web Development')} disabled={isLoadingWebDevChecklist || !API_KEY_CONFIGURED} size="sm" className="mt-3 w-full">
                  {webDevChecklist ? "Regenerate Web Dev Checklist" : "Generate Web Dev Checklist"}
                </Button>
              </div>
            </div>

            <div className="mt-8 col-span-1 md:col-span-2">
               <ChecklistDisplay 
                title="Comprehensive SEO Checklist" 
                data={seoChecklistData} 
                type="structured"
                iconName="ClipboardCheckIcon"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
