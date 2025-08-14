import React from 'react';
import { Icon } from './common/Icon';

const StepCard: React.FC<{ number: string; title: string; description: string; imageName: string; iconName: string }> = ({ number, title, description, imageName, iconName }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative mb-6">
      <img 
        src={`https://picsum.photos/seed/${imageName}/300/200`} 
        alt={title} 
        className="rounded-lg shadow-xl w-full max-w-xs aspect-[3/2] object-cover"
      />
      <div className="absolute -top-5 -right-5 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
        {number}
      </div>
    </div>
    <div className="p-1">
      <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full mb-3 mx-auto">
         <Icon name={iconName} className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  </div>
);

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Start',
      description: 'Describe your site during an AI-led chat conversation.',
      imageName: 'AI_Planner_Start',
      iconName: 'ChatBubbleIcon'
    },
    {
      number: '2',
      title: 'Visualize',
      description: 'AI will generate a sitemap, brief, and wireframe, pre-filled with relevant initial copy.',
      imageName: 'AI_Planner_Visualize',
      iconName: 'EyeIcon'
    },
    {
      number: '3',
      title: 'Perfect It',
      description: 'Fine-tune layouts and edit content to create a prototype that’s uniquely yours and on-brand.',
      imageName: 'AI_Planner_Perfect',
      iconName: 'SparklesIcon'
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Get Your Site Plan in 3 Simple Steps</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From idea to a structured plan, effortlessly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};