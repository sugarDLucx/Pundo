import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label className="text-label-md font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface transition-colors focus:outline-none focus:border-primary focus:bg-surface-container-lowest placeholder:text-outline",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
