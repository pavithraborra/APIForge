import React from 'react';
import { cn } from './Button';

const Skeleton = ({ className, variant = 'text', width, height, count = 1 }) => {
  const skeletonClass = cn(
    'animate-pulse bg-borders rounded-md',
    {
      'rounded-full': variant === 'circle',
      'rounded-2xl': variant === 'card',
    },
    className
  );

  const style = { width, height };

  const skeletons = Array(count).fill(0).map((_, i) => (
    <div key={i} className={skeletonClass} style={style}>
      {variant === 'text' && !height && <div className="h-4" />}
    </div>
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-2">{skeletons}</div>;
};

export default Skeleton;
