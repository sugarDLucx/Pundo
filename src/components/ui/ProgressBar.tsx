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
      danger: 'bg-danger',
      success: 'bg-emerald-500',
    };

    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#20201F]", className)}
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
