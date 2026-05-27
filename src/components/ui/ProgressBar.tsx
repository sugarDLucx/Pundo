import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  variant?: 'primary' | 'danger' | 'success';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary',
      danger: 'bg-error',
      success: 'bg-tertiary',
    };

    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-container-high", className)}
        {...props}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", variants[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
