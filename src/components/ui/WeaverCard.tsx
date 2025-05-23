
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WeaverCardProps {
  weaver: User;
  productCount?: number;
  averageRating?: number;
  className?: string;
  style?: React.CSSProperties;
}

const WeaverCard = ({ weaver, productCount = 0, averageRating = 0, className, style }: WeaverCardProps) => {
  const navigate = useNavigate();
  
  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      toast("Please sign in to send messages");
      navigate('/auth');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role === 'weaver') {
      toast("Weavers cannot message other weavers");
      return;
    }
    
    // Redirect to dashboard with chat section opened for this weaver
    navigate(`/dashboard/customer?tab=messages&weaver=${weaver.id}`);
  };
  
  return (
    <div 
      className={cn(
        "glass rounded-xl p-6 flex flex-col hover-lift transition-all-300",
        className
      )}
      style={style}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img 
            src={weaver.avatar_url || weaver.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
            alt={weaver.name} 
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <Link to={`/weavers/${weaver.id}`}>
              <h3 className="font-medium text-lg hover:text-primary/80 transition-colors">{weaver.name}</h3>
            </Link>
          </div>
          
          <div className="mt-1 flex items-center text-sm">
            {averageRating > 0 && (
              <>
                <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="mx-2">•</span>
              </>
            )}
            <span>{productCount} Products</span>
          </div>
          
          {weaver.bio && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{weaver.bio}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link to={`/weavers/${weaver.id}`}>View Profile</Link>
        </Button>
        <Button size="sm" className="flex-1" onClick={handleMessageClick}>
          Message
        </Button>
      </div>
    </div>
  );
};

export default WeaverCard;
