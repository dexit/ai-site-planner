import React from 'react';
import { Icon } from './common/Icon';

interface DetailStepProps {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  imageName: string;
  iconName: string;
  imageAlignment?: 'left' | 'right';
}

const DetailStep: React.FC<DetailStepProps> = ({ stepNumber, title, subtitle, description, imageName, iconName, imageAlignment = 'left' }) => {
  const textOrder = imageAlignment === 'left' ? 'md:order-last' : 'md:order-first';
  const imageOrder = imageAlignment === 'left' ? 'md:order-first' : 'md:order-last';

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center py-8">
      <div className={`flex justify-center ${imageOrder}`}>
        <img 
          src={`https://picsum.photos/seed/${imageName}/500/350`} 
          alt={title} 
          className="rounded-lg shadow-xl object-cover w-full max-w-md aspect-video"
        />
      </div>
      <div className={textOrder}>
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-3">
            {stepNumber}
          </div>
          <Icon name={iconName} className="w-8 h-8 text-indigo-600 mr-2" />
          <h3 className="text-2xl font-semibold text-slate-800">{title}</h3>
        </div>
        <p className="text-lg font-medium text-indigo-500 mb-3">{subtitle}</p>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const DetailedStepsSection: React.FC = () => {
  const steps = [
    {
      stepNumber: '1',
      title: 'From Vision to Brief',
      subtitle: 'Start an AI-led conversation',
      description: 'Watch your ideas, descriptions, and notes transform before your eyes into a proper website brief. The AI helps articulate your vision clearly.',
      imageName: 'VisionToBrief',
      iconName: 'LightBulbIcon',
      imageAlignment: 'left' as 'left' | 'right'
    },
    {
      stepNumber: '2',
      title: 'From Brief to Sitemap',
      subtitle: 'AI Site Planner instantly maps out all your key pages',
      description: 'Creates a complete sitemap in minutes, not hours. Easily review and understand the proposed structure, ensuring all critical areas of your site are covered.',
      imageName: 'BriefToSitemap',
      iconName: 'ListBulletIcon',
      imageAlignment: 'right' as 'left' | 'right'
    },
    {
      stepNumber: '3',
      title: 'From Sitemap to Wireframe',
      subtitle: 'Get your first draft in minutes',
      description: 'Watch AI turn your sitemap into content-filled wireframes in a click. Visualize the layout and flow of each page, providing a tangible blueprint for design and development.',
      imageName: 'SitemapToWireframe',
      iconName: 'PencilSquareIcon',
      imageAlignment: 'left' as 'left' | 'right'
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Your Blueprint, AI-Powered</h2>
           <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Follow a clear, AI-assisted path from initial concept to a detailed website plan.
          </p>
        </div>
        <div className="space-y-12 md:space-y-16">
          {steps.map((step, index) => (
            <DetailStep key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};