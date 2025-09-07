import React from "react";

import { useState, useEffect } from "react";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  animated?: boolean;
}

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#0071E3",
  animated = true,
}: ProgressRingProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    if (!animated) {
      setDisplayProgress(progress);
      return;
    }
    
    const start = 0;
    const animationDuration = 1500; // ms
    const startTime = Date.now();
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(progress * (elapsed / animationDuration), progress);
      
      setDisplayProgress(nextProgress);
      
      if (elapsed < animationDuration) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);
  }, [progress, animated]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke="#E5E7EB"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-medium">{Math.round(displayProgress)}%</span>
        <span className="text-xs text-gray-500">Completado</span>
      </div>
    </div>
  );
};

export default ProgressRing;
