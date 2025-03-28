
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  ShoppingCart, 
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { isAuthenticated, getCurrentUser, redirectBasedOnRole } from '@/lib/auth';
import { UserRole } from '@/lib/types';

const Navbar = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const userFromStorage = getCurrentUser();
    setUser(userFromStorage);
  }, []);

  // Handle navigation based on authentication and user role
  const handleNavigateRequiringAuth = (path: string) => {
    if (isAuthenticated()) {
      navigate(path);
    } else {
      toast.error("Authentication required", {
        description: "Please log in to continue."
      });
      navigate('/auth', { state: { from: path } });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">तंतु</span>
            <span className="text-sm ml-2 text-primary">TANTU</span>
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/weavers" className="text-foreground hover:text-primary transition-colors">
                Weavers
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          )}
          
          {/* Desktop Right Menu */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <div className="relative mr-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-1 w-44 rounded-full"
                />
              </div>
              
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate('/cart')}
                    className="relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-4 h-4 rounded-full text-xs flex items-center justify-center">
                      2
                    </span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {user.name}
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => redirectBasedOnRole(navigate)}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/cart')}>
                        Cart
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="flex items-center"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          )}
          
          {/* Mobile Menu */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => user ? navigate('/cart') : handleNavigateRequiringAuth('/cart')}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {user && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-4 h-4 rounded-full text-xs flex items-center justify-center">
                    2
                  </span>
                )}
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between py-4 border-b">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">तंतु</span>
                        <span className="text-sm ml-2 text-primary">TANTU</span>
                      </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                    
                    <div className="relative my-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="Search..." className="pl-10" />
                    </div>
                    
                    <nav className="flex flex-col space-y-4 py-4">
                      <SheetClose asChild>
                        <Link to="/" className="flex items-center p-2 hover:bg-secondary rounded-md">
                          Home
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/products" className="flex items-center p-2 hover:bg-secondary rounded-md">
                          Products
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/weavers" className="flex items-center p-2 hover:bg-secondary rounded-md">
                          Weavers
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/about" className="flex items-center p-2 hover:bg-secondary rounded-md">
                          About
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/contact" className="flex items-center p-2 hover:bg-secondary rounded-md">
                          Contact
                        </Link>
                      </SheetClose>
                    </nav>
                    
                    <div className="mt-auto border-t pt-4">
                      {user ? (
                        <div className="space-y-2">
                          <div className="flex items-center p-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          
                          <SheetClose asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start" 
                              onClick={() => redirectBasedOnRole(navigate)}
                            >
                              Dashboard
                            </Button>
                          </SheetClose>
                          
                          <SheetClose asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start" 
                              onClick={() => navigate('/cart')}
                            >
                              Cart
                            </Button>
                          </SheetClose>
                          
                          <SheetClose asChild>
                            <Button 
                              variant="destructive" 
                              className="w-full mt-2" 
                              onClick={handleLogout}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Logout
                            </Button>
                          </SheetClose>
                        </div>
                      ) : (
                        <SheetClose asChild>
                          <Button 
                            className="w-full" 
                            onClick={() => navigate('/auth')}
                          >
                            <LogIn className="mr-2 h-4 w-4" />
                            Login / Register
                          </Button>
                        </SheetClose>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
