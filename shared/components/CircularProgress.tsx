import React from 'react';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  value, 
  max, 
  size = 128,
  label = 'days left'
}) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / max);
  const daysLeft = max - value;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-emerald-400 transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-emerald-400">{daysLeft}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
};