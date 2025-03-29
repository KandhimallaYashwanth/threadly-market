
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, ShoppingCart, User, Bell, LogIn 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [cartCount, setCartCount] = useState(0);

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for cart items in localStorage
  useEffect(() => {
    const getCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    getCartItems();
    window.addEventListener('storage', getCartItems);
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', getCartItems);
    
    return () => {
      window.removeEventListener('storage', getCartItems);
      window.removeEventListener('cartUpdated', getCartItems);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Weavers', href: '/weavers' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.querySelector('input') as HTMLInputElement;
    
    if (searchInput.value.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.value.trim())}`);
      searchInput.value = '';
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };
  
  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isHomePage
          ? 'glass py-3 shadow-sm'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-medium tracking-tight transition-opacity hover:opacity-80"
          >
            Thread<span className="text-primary">ly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors relative',
                  'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full',
                  location.pathname === link.href 
                    ? 'text-primary after:w-full'
                    : 'text-foreground hover:text-primary/90'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden md:block relative flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search products, weavers..." 
                className="w-full pl-10 bg-background/80 border-none" 
              />
            </form>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <User className="w-5 h-5" />
            </Button>
            <Button asChild size="sm" className="ml-2">
              <Link to="/auth">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="pt-4 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'block px-3 py-2 text-base font-medium transition-colors',
                    location.pathname === link.href 
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary/90'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="py-4 border-t border-border">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search products, weavers..." 
                  className="w-full pl-10" 
                />
              </form>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/cart');
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth');
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
