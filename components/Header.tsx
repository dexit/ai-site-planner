
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              AI Site Planner
            </a>
          </div>
          <nav className="hidden md:flex space-x-8">
            {/* <a href="#" className="text-gray-500 hover:text-gray-900">Features</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">How It Works</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Pricing</a> */}
          </nav>
        </div>
      </div>
    </header>
  );
};
    