import React from 'react';

interface PlantHealthIconProps {
  className?: string;
  size?: number;
}

export const PlantHealthIcon: React.FC<PlantHealthIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Plant stem */}
      <path d="M12 2v8" stroke="currentColor" strokeWidth="2" />
      
      {/* Leaf on the left */}
      <path 
        d="M4.5 9.5c0-2.5 2-4.5 4.5-4.5 2.5 0 4.5 2 4.5 4.5S11.5 14 9 14c-2.5 0-4.5-2-4.5-4.5z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      />
      
      {/* Leaf on the right */}
      <path 
        d="M19.5 9.5c0-2.5-2-4.5-4.5-4.5-2.5 0-4.5 2-4.5 4.5S12.5 14 15 14c2.5 0 4.5-2 4.5-4.5z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      />
      
      {/* Heartbeat/health line */}
      <path 
        d="M3 18h3l2-3 4 6 2-3h7" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlantHealthIcon; 