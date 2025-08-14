
import React, { useState, Fragment } from 'react';
import { ChecklistSection, ChecklistItem as ChecklistItemType } from '../types';
import { Icon } from './common/Icon';

interface ChecklistDisplayProps {
  title?: string;
  data: ChecklistSection[] | string[]; // SEO data is ChecklistSection[], AI lists are string[]
  type: 'structured' | 'simple'; // To differentiate handling
  iconName?: string;
}

const ChecklistItemComponent: React.FC<{ item: ChecklistItemType, level: number }> = ({ item, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 1); // Auto-expand top-level items or items with few sub-items

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const paddingLeft = `${level * 1.5}rem`; // Indentation for nesting

  return (
    <li className={`py-1 ${level > 0 ? 'border-t border-slate-200' : ''}`}>
      <div 
        className={`flex items-start justify-between ${hasSubItems ? 'cursor-pointer hover:bg-slate-50' : ''} py-1.5 rounded`} 
        style={{ paddingLeft }}
        onClick={hasSubItems ? () => setIsExpanded(!isExpanded) : undefined}
        role={hasSubItems ? "button" : undefined}
        aria-expanded={hasSubItems ? isExpanded : undefined}
        tabIndex={hasSubItems ? 0 : undefined}
        onKeyDown={hasSubItems ? (e) => (e.key === 'Enter' || e.key === ' ') && setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-start">
          <Icon name="CheckCircleIcon" className={`w-4 h-4 ${level > 0 ? 'text-slate-400' : 'text-indigo-500'} mr-2 mt-1 flex-shrink-0`} />
          <span className={`text-sm ${level > 0 ? 'text-slate-600' : 'text-slate-700 font-medium'}`}>{item.text}</span>
        </div>
        {hasSubItems && (
          <Icon name={isExpanded ? "ChevronDownIcon" : "ChevronRightIcon"} className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
        )}
      </div>
      {item.details && (
        <p className="text-xs text-slate-500 mt-0.5" style={{ paddingLeft: `calc(${paddingLeft} + 1.25rem)` }}>{item.details}</p>
      )}
      {hasSubItems && isExpanded && (
        <ul className="mt-1">
          {item.subItems?.map(subItem => (
            <ChecklistItemComponent key={subItem.id} item={subItem} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};


export const ChecklistDisplay: React.FC<ChecklistDisplayProps> = ({ title, data, type, iconName }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    if (type === 'structured') {
      const initial: Record<string, boolean> = {};
      (data as ChecklistSection[]).forEach(section => {
        initial[section.id] = section.isInitiallyExpanded || false;
      });
      return initial;
    }
    return {};
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <div className="my-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
      {title && (
        <div className="flex items-center mb-3 text-indigo-700">
          {iconName && <Icon name={iconName} className="w-5 h-5 mr-2"/>}
          <h4 className="text-md font-semibold">{title}</h4>
        </div>
      )}
      
      {type === 'structured' && (data as ChecklistSection[]).map(section => (
        <div key={section.id} className="mb-3 last:mb-0">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex justify-between items-center text-left py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            aria-expanded={expandedSections[section.id]}
            aria-controls={`section-content-${section.id}`}
          >
            <span className="font-medium text-sm text-slate-700">{section.title}</span>
            <Icon name={expandedSections[section.id] ? "ChevronDownIcon" : "ChevronRightIcon"} className="w-5 h-5 text-slate-500" />
          </button>
          {expandedSections[section.id] && (
            <ul id={`section-content-${section.id}`} className="mt-2 pl-2 space-y-1 border-l-2 border-indigo-100 ml-1">
              {(section.items as ChecklistItemType[]).map(item => (
                <ChecklistItemComponent key={item.id} item={item} level={0} />
              ))}
            </ul>
          )}
        </div>
      ))}

      {type === 'simple' && (
        <ul className="space-y-2">
          {(data as string[]).map((itemText, index) => (
            <li key={index} className="flex items-start text-sm text-slate-700 py-1.5 px-2 rounded bg-slate-50 border border-slate-200">
              <Icon name="CheckCircleIcon" className="w-4 h-4 text-indigo-500 mr-2.5 mt-0.5 flex-shrink-0" />
              {itemText}
            </li>
          ))}
           {(data as string[]).length === 0 && <p className="text-sm text-slate-500">No items in this checklist yet.</p>}
        </ul>
      )}
    </div>
  );
};
