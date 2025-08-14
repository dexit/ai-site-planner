
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} AI Site Planner. Powered by Generative AI.
        </p>
        <p className="text-xs mt-1">
          This is a demo application. API Key for Gemini API must be configured in environment variables. See README.md.
        </p>
      </div>
    </footer>
  );
};
