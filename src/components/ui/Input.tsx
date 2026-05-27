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
            "rounded-lg border border-slate-200 dark:border-[#20201F] bg-slate-50 dark:bg-[#0E0E0E] px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#131313] placeholder:text-slate-400",
            error && "border-danger focus:border-danger",
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
