"use client";

import { useEffect } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  threshold?: number; // milliseconds
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  componentName, 
  threshold = 100 
}) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > threshold) {
        console.warn(
          `Performance Warning: ${componentName} took ${renderTime.toFixed(2)}ms to render (threshold: ${threshold}ms)`
        );
      }
    };
  }, [componentName, threshold]);

  return null;
};

export default PerformanceMonitor;
