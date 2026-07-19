import React from 'react';
import { cn } from './Button';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

const Spinner = ({ size = 'md', className }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          'animate-spin rounded-full border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/10',
          sizes[size],
          className
        )}
      />
    </div>
  );
};

export default Spinner;
