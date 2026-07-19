import React from 'react';
import { clsx } from 'clsx';

import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const variants = {
  primary: 'bg-primary text-white hover:bg-[#D47E70] border-transparent shadow-sm',
  secondary: 'bg-secondary text-white hover:bg-[#E5A88E] border-transparent shadow-sm',
  outline: 'bg-transparent text-text-primary border-primary hover:bg-primary hover:text-white',
  danger: 'bg-danger text-white hover:bg-[#D56B6B] border-transparent shadow-sm',
  ghost: 'bg-transparent text-text-secondary hover:bg-hover border-transparent',
  success: 'bg-success text-white hover:bg-[#78B48F] border-transparent shadow-sm',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-8 text-base',
};

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && Icon && <Icon className={cn('mr-2 h-4 w-4', children ? '' : 'mr-0')} />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
