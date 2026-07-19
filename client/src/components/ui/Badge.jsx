import React from 'react';
import { cn } from './Button';

const variants = {
  default: 'bg-secondary-bg text-text-secondary border-borders',
  primary: 'bg-accent3 text-primary border-accent2',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
};

const methodColors = {
  GET: 'bg-method-get/10 text-method-get border-method-get/20',
  POST: 'bg-method-post/10 text-method-post border-method-post/20',
  PUT: 'bg-method-put/10 text-method-put border-method-put/20',
  PATCH: 'bg-method-patch/10 text-method-patch border-method-patch/20',
  DELETE: 'bg-method-delete/10 text-method-delete border-method-delete/20',
  OPTIONS: 'bg-method-options/10 text-method-options border-method-options/20',
  HEAD: 'bg-method-head/10 text-method-head border-method-head/20',
};

const Badge = ({
  children,
  variant = 'default',
  method,
  className,
  ...props
}) => {
  const appliedClass = method ? methodColors[method] : variants[variant];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        appliedClass,
        className
      )}
      {...props}
    >
      {method || children}
    </span>
  );
};

export default Badge;
