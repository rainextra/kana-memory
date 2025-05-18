import React, { useEffect, useState } from 'react';
import { formatTime } from '../../utils';

interface TimerProps {
  initialSeconds: number;
  isActive: boolean;
  onTimeout: () => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ 
  initialSeconds, 
  isActive, 
  onTimeout,
  className = ''
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(!isActive);
  
  // Reset timer when initial seconds change
  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);
  
  // Update pause state when isActive changes
  useEffect(() => {
    setIsPaused(!isActive);
  }, [isActive]);
  
  // Timer countdown
  useEffect(() => {
    let interval: number | null = null;
    
    if (!isPaused && seconds > 0) {
      interval = window.setInterval(() => {
        setSeconds(seconds => {
          if (seconds <= 1) {
            if (interval) clearInterval(interval);
            onTimeout();
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    } else if (isPaused && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, seconds, onTimeout]);
  
  // Calculate percentage for visual indicator
  const timePercentage = Math.max(0, (seconds / initialSeconds) * 100);
  
  // Color logic for visual indicator
  let timerColor = 'bg-green-500';
  if (timePercentage < 50) timerColor = 'bg-yellow-500';
  if (timePercentage < 25) timerColor = 'bg-red-500';
  
  return (
    <div className={`timer-container ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        <span className="text-sm font-mono">{formatTime(seconds)}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${timerColor} transition-all duration-1000 ease-linear`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;