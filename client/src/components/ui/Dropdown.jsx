import React, { useState, useRef, useEffect } from 'react';
import { cn } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ trigger, items, align = 'right', className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-40 mt-2 w-56 rounded-xl bg-white shadow-card border border-borders outline-none py-1',
              align === 'right' ? 'origin-top-right right-0' : 'origin-top-left left-0',
              className
            )}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={`div-${index}`} className="my-1 border-t border-borders" />;
              }
              
              const Icon = item.icon;
              
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    setIsOpen(false);
                    if (item.onClick) item.onClick(e);
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm flex items-center transition-colors',
                    item.danger 
                      ? 'text-danger hover:bg-danger/5' 
                      : 'text-text-primary hover:bg-hover hover:text-primary',
                    item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                  )}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
