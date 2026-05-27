import React from 'react';
import { cn } from '../../lib/utils';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  fill?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, fill = false, className, ...props }) => {
  return (
    <span 
      className={cn("material-symbols-outlined", fill && "fill", className)} 
      {...props}
    >
      {name}
    </span>
  );
};
