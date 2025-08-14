
import React from 'react';
import { Icon } from './common/Icon'; // Placeholder for Icon component

const FeatureCard: React.FC<{ title: string; description: string; iconName: string }> = ({ title, description, iconName }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-4">
      <Icon name={iconName} className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Generate Site Plan in Minutes',
      description: 'Simply start your AI-led chat and describe your ideal website. Our AI uses industry best practices to map out your key pages.',
      iconName: 'MapIcon', // Example icon name
    },
    {
      title: 'Instant Wireframes',
      description: 'Get professional-grade wireframes based on proven design principles. Fine-tune sections, or regenerate layouts—all in just seconds.',
      iconName: 'LayoutIcon', // Example icon name
    },
    {
      title: 'Your Website in Progress',
      description: 'Polish your AI-generated wireframes and use them as a solid foundation to create your pixel-perfect website.',
      iconName: 'RocketIcon', // Example icon name
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Build Smarter, Not Harder</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Leverage AI to streamline your website planning process from concept to blueprint.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
    