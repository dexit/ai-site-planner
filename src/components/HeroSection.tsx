import React from 'react';
import { Button } from './common/Button';

interface HeroSectionProps {
  onStartPlanning: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning }) => {
  return (
    <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Site Planner <span className="text-indigo-300">by AI</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-4 max-w-3xl mx-auto">
          Generate Professional Sitemaps & Wireframes in Minutes
        </p>
        <p className="text-md sm:text-lg text-indigo-200 mb-10 max-w-2xl mx-auto">
          Build with confidence and deliver quality results governed by industry-wide best practices. Describe your company & get an AI-powered wireframe in minutes...
        </p>
        <Button 
          onClick={onStartPlanning} 
          size="lg" 
          variant="secondary"
          className="text-indigo-700 bg-white hover:bg-indigo-50"
        >
          Start Planning Your Website
        </Button>
      </div>
    </section>
  );
};