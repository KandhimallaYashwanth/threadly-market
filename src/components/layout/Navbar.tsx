import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, ShoppingCart, User, Bell, LogIn, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import ThreadlyLogo from '@/components/ui/ThreadlyLogo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast: shadowToast } = useToast();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const getCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    getCartItems();
    window.addEventListener('storage', getCartItems);
    
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
  
  const handleDashboardClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (user.role === UserRole.WEAVER) {
      navigate('/dashboard/weaver');
    } else {
      navigate('/dashboard/customer');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/');
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
          <Link 
            to="/" 
            className="transition-opacity hover:opacity-80"
          >
            <ThreadlyLogo />
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors relative',
                  'hover:text-primary/90',
                  location.pathname === link.href 
                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
                    : 'text-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block relative flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search products, weavers..." 
                className="w-full pl-10 bg-background/80 border-none" 
              />
            </form>
          </div>

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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 overflow-hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                        alt={user.name} 
                      />
                      <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                        alt={user.name} 
                      />
                      <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

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
                
                {user ? (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDashboardClick();
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                ) : (
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
                )}
              </div>
              
              {user && (
                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
