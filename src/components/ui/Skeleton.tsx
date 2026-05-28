import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, style }) => {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-surface-container-high", 
        className
      )} 
      style={style}
    />
  );
};
