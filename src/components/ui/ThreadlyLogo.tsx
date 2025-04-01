
import React from 'react';
import { cn } from '@/lib/utils';

interface ThreadlyLogoProps {
  className?: string;
}

const ThreadlyLogo: React.FC<ThreadlyLogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center font-medium", className)}>
      <span className="text-2xl tracking-tight">
        Thread<span className="text-primary">ly</span>
      </span>
    </div>
  );
};

export default ThreadlyLogo;
