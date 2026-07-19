import React from 'react';
import { cn } from './Button';

const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  helperText,
  icon: Icon,
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
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-muted" aria-hidden="true" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-borders bg-white px-3 py-2 text-sm text-text-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            Icon && 'pl-10',
            error && 'border-danger focus-visible:ring-danger focus-visible:border-danger',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={cn('mt-1 text-sm', error ? 'text-danger' : 'text-text-secondary')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
