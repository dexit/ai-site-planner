import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-6 bg-slate-50 rounded-lg">
      <div className="w-12 h-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-indigo-600 border-slate-200 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  );
};