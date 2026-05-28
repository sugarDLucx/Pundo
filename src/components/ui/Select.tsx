import React, { useId } from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    const defaultId = useId();
    const selectId = props.id || props.name || defaultId;
    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label htmlFor={selectId} className="text-label-md font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface transition-colors focus:outline-none focus:border-primary focus:bg-surface-container-lowest",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-danger">{error}</span>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
