import React from 'react';
import { WireframeSection } from '../types';

interface SkeletonWireframeSectionProps {
  section: WireframeSection;
  hasError?: boolean;
}

const SkeletonLine: React.FC<{ widthClass?: string; heightClass?: string; className?: string }> = ({ widthClass = 'w-full', heightClass = 'h-2.5', className = '' }) => (
  <div className={`${heightClass} bg-slate-300 rounded ${widthClass} ${className} animate-pulse`}></div>
);

const SkeletonBlock: React.FC<{ widthClass?: string; heightClass?: string; className?: string }> = ({ widthClass = 'w-full', heightClass = 'h-20', className = '' }) => (
  <div className={`${heightClass} bg-slate-300 rounded ${widthClass} ${className} animate-pulse`}></div>
);

const SkeletonCard: React.FC = () => (
  <div className="p-3 border border-slate-200 rounded-md bg-slate-50 space-y-2">
    <SkeletonBlock heightClass="h-16" />
    <SkeletonLine widthClass="w-3/4" />
    <SkeletonLine widthClass="w-1/2" heightClass="h-2" />
  </div>
);


export const SkeletonWireframeSection: React.FC<SkeletonWireframeSectionProps> = ({ section, hasError }) => {
  const name = section.sectionName.toLowerCase();

  let content;

  if (hasError) {
    content = (
      <div className="p-3 text-sm text-red-500">
        <p className="font-medium">{section.sectionName}</p>
        <p className="text-xs italic">{section.sectionPurpose}</p>
      </div>
    );
  } else if (name.includes('hero') || name.includes('banner') || name.includes('header image') || name.includes('welcome')) {
    content = (
      <div className="space-y-3 p-3">
        <SkeletonBlock heightClass="h-32 md:h-48" />
        <SkeletonLine widthClass="w-1/2" heightClass="h-4" />
        <SkeletonLine widthClass="w-3/4" />
        <SkeletonLine widthClass="w-2/3" />
      </div>
    );
  } else if (name.includes('navigation') || name.includes('header menu') || name.includes('main menu')) {
     content = (
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-center">
          <SkeletonBlock widthClass="w-24" heightClass="h-8" />
          <div className="flex space-x-3">
            <SkeletonLine widthClass="w-12" heightClass="h-3" />
            <SkeletonLine widthClass="w-12" heightClass="h-3" />
            <SkeletonLine widthClass="w-12" heightClass="h-3" />
          </div>
        </div>
      </div>
    );
  } else if (name.includes('footer')) {
    content = (
      <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonLine widthClass="w-3/4" heightClass="h-3" />
            <SkeletonLine widthClass="w-full" heightClass="h-2" />
            <SkeletonLine widthClass="w-5/6" heightClass="h-2" />
            <SkeletonLine widthClass="w-2/3" heightClass="h-2" />
          </div>
        ))}
      </div>
    );
  } else if (name.includes('card') || name.includes('feature') || name.includes('service') || name.includes('product') || name.includes('portfolio') || name.includes('team') || name.includes('benefit') || name.includes('testimonial')) {
    content = (
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(name.includes('testimonial') ? 2:3)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  } else if (name.includes('image and text') || name.includes('about section') || name.includes('content with image')) {
     content = (
      <div className="p-3 grid md:grid-cols-2 gap-3 items-center">
        <SkeletonBlock heightClass="h-32" />
        <div className="space-y-2">
          <SkeletonLine widthClass="w-3/4" heightClass="h-4" />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine widthClass="w-5/6" />
        </div>
      </div>
    );
  } else if (name.includes('call to action') || name.includes('cta') || name.includes('contact form') || name.includes('sign up') || name.includes('subscribe') || name.includes('form')) {
    content = (
      <div className="p-3 space-y-3">
        <SkeletonLine widthClass="w-1/2" heightClass="h-4" className="mx-auto" />
        <SkeletonLine widthClass="w-3/4" className="mx-auto" />
        <SkeletonBlock heightClass="h-8" widthClass="w-full sm:w-3/4 mx-auto" />
        <SkeletonBlock heightClass="h-8" widthClass="w-full sm:w-3/4 mx-auto" />
        <SkeletonBlock heightClass="h-10" widthClass="w-1/2 sm:w-1/3 mx-auto" />
      </div>
    );
  } else if (name.includes('gallery') || name.includes('image grid')) {
     content = (
      <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => <SkeletonBlock key={i} heightClass="h-20" />)}
      </div>
    );
  }
  else { // Default text block
    content = (
      <div className="space-y-2 p-3">
        <SkeletonLine widthClass="w-5/6" />
        <SkeletonLine />
        <SkeletonLine widthClass="w-3/4" />
        <SkeletonLine widthClass="w-5/6" />
        <SkeletonLine widthClass="w-2/3" />
      </div>
    );
  }


  const baseClasses = "rounded-md border shadow-sm";
  const errorContainerClasses = "bg-red-100 border-red-300";
  const normalContainerClasses = "bg-slate-100 border-slate-300 hover:shadow-md transition-shadow";

  const textErrorClasses = "text-red-600";
  const textNormalClasses = "text-slate-700";
  const purposeErrorClasses = "text-red-500";
  const purposeNormalClasses = "text-slate-500";

  return (
    <div className={`${baseClasses} ${hasError ? errorContainerClasses : normalContainerClasses}`}>
      <div className={`p-3 border-b ${hasError ? 'border-red-200' : 'border-slate-200'}`}>
        <p className={`text-sm font-medium ${hasError ? textErrorClasses : textNormalClasses}`}>
          {section.sectionName}
        </p>
        <p className={`text-xs ${hasError ? purposeErrorClasses : purposeNormalClasses} mt-1 italic`}>
          {section.sectionPurpose}
        </p>
      </div>
      <div className={`${hasError ? '' : 'bg-white rounded-b-md'}`}>
        {content}
      </div>
    </div>
  );
};