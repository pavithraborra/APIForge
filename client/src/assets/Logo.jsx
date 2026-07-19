import React from 'react';

const Logo = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E78F81" />
          <stop offset="50%" stopColor="#D47E70" />
          <stop offset="100%" stopColor="#2F2A28" />
        </linearGradient>
      </defs>
      
      {/* Outer Hexagon / Forge shape */}
      <path 
        d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" 
        stroke="url(#logoGrad)" 
        strokeWidth="6" 
        strokeLinejoin="round" 
        fill="transparent"
      />
      
      {/* Inner Node Network */}
      <circle cx="50" cy="50" r="8" fill="#E78F81" />
      <circle cx="30" cy="38" r="5" fill="#2F2A28" />
      <circle cx="70" cy="38" r="5" fill="#2F2A28" />
      <circle cx="50" cy="75" r="5" fill="#2F2A28" />
      
      {/* Connections */}
      <path d="M50 50 L30 38" stroke="#E78F81" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 50 L70 38" stroke="#E78F81" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 50 L50 75" stroke="#E78F81" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;
