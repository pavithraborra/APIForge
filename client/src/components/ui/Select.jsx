import React from 'react';
import { cn } from './Button';
import { HiChevronDown } from 'react-icons/hi';

const Select = React.forwardRef(({
  className,
  label,
  error,
  helperText,
  options = [],
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-lg border border-borders bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-danger focus-visible:ring-danger focus-visible:border-danger',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
          <HiChevronDown className="h-4 w-4" />
        </div>
      </div>
      {(error || helperText) && (
        <p className={cn('mt-1 text-sm', error ? 'text-danger' : 'text-text-secondary')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
