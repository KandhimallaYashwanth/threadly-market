
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ThreadlyLogoProps {
  className?: string;
  linkTo?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const ThreadlyLogo: React.FC<ThreadlyLogoProps> = ({ 
  className, 
  linkTo = '/', 
  size = 'md',
  onClick
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };

  const Logo = (
    <div className={cn("flex items-center font-medium", className)}>
      <span className={cn("tracking-tight", sizeClasses[size])}>
        Thread<span className="text-primary">ly</span>
      </span>
    </div>
  );

  if (linkTo && !onClick) {
    return (
      <Link to={linkTo} className="hover:opacity-90 transition-opacity">
        {Logo}
      </Link>
    );
  }
  
  if (onClick) {
    return (
      <button onClick={onClick} className="hover:opacity-90 transition-opacity">
        {Logo}
      </button>
    );
  }

  return Logo;
};

export default ThreadlyLogo;
