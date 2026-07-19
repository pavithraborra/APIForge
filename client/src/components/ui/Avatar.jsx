import React, { useState } from 'react';
import { cn } from './Button';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Avatar = ({ src, name, size = 'md', className, ...props }) => {
  const [imgError, setImgError] = useState(false);

  // Use deterministic color based on name length
  const colors = [
    'bg-[#E78F81] text-white',
    'bg-[#F6B89E] text-white',
    'bg-[#88C9A1] text-white',
    'bg-[#F2B880] text-white',
    'bg-[#E97A7A] text-white',
  ];
  const colorClass = colors[(name ? name.length : 0) % colors.length];

  const showImage = src && src.trim() !== '' && !imgError;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm',
        sizes[size],
        !showImage && colorClass,
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-medium tracking-wider">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
