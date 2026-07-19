import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("border-b border-borders", className)}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto hide-scrollbar" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'group relative py-3 px-1 text-sm font-medium flex items-center whitespace-nowrap outline-none',
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-hover rounded-t-lg'
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'mr-2 h-4 w-4 transition-colors',
                    isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
                  )}
                  aria-hidden="true"
                />
              )}
              {tab.label}
              
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
