
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

const ProductCard = ({ product, className, style }: ProductCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) {
      toast({
        title: "Product unavailable",
        description: "Sorry, this product is currently out of stock.",
        variant: "destructive"
      });
      return;
    }
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product is already in cart
    const isInCart = existingCart.some((item: any) => item.id === product.id);
    
    if (isInCart) {
      toast({
        title: "Already in cart",
        description: `${product.name} is already in your cart.`,
      });
      return;
    }
    
    // Add product to cart with quantity 1
    const newCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Dispatch storage event for navbar to detect cart changes
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden bg-white h-full flex flex-col hover-lift transition-all-300",
        className
      )}
      style={style}
    >
      <Link to={`/products/${product.id}`} className="block overflow-hidden h-64 relative">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-destructive text-white text-xs font-medium px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-medium text-lg tracking-wide">Out of Stock</span>
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{product.fabricType.toUpperCase()}</span>
          {product.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              {product.reviewCount && (
                <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>
        <Link to={`/products/${product.id}`} className="group">
          <h3 className="font-medium text-lg mb-1 group-hover:text-primary/80 transition-colors">{product.name}</h3>
        </Link>
        {product.weaver && (
          <Link to={`/weavers/${product.weaverId}`} className="text-sm text-muted-foreground hover:text-primary/70 transition-colors mb-2">
            by {product.weaver.name} 
            {product.weaver.isVerified && (
              <span className="inline-block ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Verified</span>
            )}
          </Link>
        )}
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div className="flex items-baseline">
            <span className="text-xl font-semibold">₹{product.discount 
              ? Math.round(product.price - (product.price * product.discount / 100)).toLocaleString() 
              : product.price.toLocaleString()
            }</span>
            {product.discount && (
              <span className="text-sm text-muted-foreground line-through ml-2">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-2 rounded-full w-10 h-10 p-0"
            disabled={!product.inStock}
            onClick={addToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
