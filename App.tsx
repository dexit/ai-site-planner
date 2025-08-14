
import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { DetailedStepsSection } from './components/DetailedStepsSection';
import { SitePlanner } from './components/SitePlanner';
import { Footer } from './components/Footer';
import { AppStep, SitemapPage, PageWireframe } from './types';

const App: React.FC = () => {
  const [companyDescription, setCompanyDescription] = useState<string>('');
  const [sitemap, setSitemap] = useState<SitemapPage[] | null>(null);
  const [pageWireframes, setPageWireframes] = useState<PageWireframe[] | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.DESCRIPTION_INPUT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sitePlannerRef = useRef<HTMLDivElement>(null);

  const handleStartPlanning = () => {
    sitePlannerRef.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentStep(AppStep.DESCRIPTION_INPUT);
    setSitemap(null);
    setPageWireframes(null);
    setError(null);
    setCompanyDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection onStartPlanning={handleStartPlanning} />
        <FeaturesSection />
        <HowItWorksSection />
        <DetailedStepsSection />
        
        <div ref={sitePlannerRef} className="py-12 md:py-20 scroll-mt-20">
          <SitePlanner
            companyDescription={companyDescription}
            setCompanyDescription={setCompanyDescription}
            sitemap={sitemap}
            setSitemap={setSitemap}
            pageWireframes={pageWireframes}
            setPageWireframes={setPageWireframes}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
    