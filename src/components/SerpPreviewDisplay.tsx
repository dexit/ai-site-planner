import React from 'react';
import { SerpPreviewContent } from '../types';
import { Icon } from './common/Icon';

interface SerpPreviewDisplayProps {
  content: SerpPreviewContent;
}

export const SerpPreviewDisplay: React.FC<SerpPreviewDisplayProps> = ({ content }) => {
  const { title, description, url } = content;
  const displayUrl = url.replace(/^https?:\/\//, '');

  return (
    <div className="space-y-6">
      {/* Desktop Preview */}
      <div>
        <h5 className="text-sm font-semibold text-slate-600 mb-2">Desktop SERP Preview:</h5>
        <div className="p-3 border border-slate-300 rounded-md bg-white shadow">
          <p className="text-xs text-slate-500 truncate">{displayUrl}</p>
          <h6 className="text-blue-700 text-lg hover:underline truncate">{title}</h6>
          <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{description}</p>
        </div>
      </div>

      {/* Mobile Preview */}
      <div>
        <h5 className="text-sm font-semibold text-slate-600 mb-2">Mobile SERP Preview:</h5>
        <div className="p-3 border border-slate-300 rounded-md bg-white shadow max-w-sm mx-auto">
          <div className="flex items-center mb-1">
            <Icon name="SearchIcon" className="w-4 h-4 text-slate-400 mr-1.5" />
            <p className="text-xs text-slate-500 truncate">{displayUrl}</p>
          </div>
          <h6 className="text-blue-700 text-md hover:underline truncate leading-tight">{title}</h6>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-3">{description}</p>
        </div>
      </div>
    </div>
  );
};
