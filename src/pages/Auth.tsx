
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, BadgeCheck, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

const Auth = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<UserRole>(UserRole.CUSTOMER);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulating a successful login
    toast({
      title: "Login successful",
      description: "Welcome back to Threadly!",
    });
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulating a successful registration
    toast({
      title: "Registration successful",
      description: "Your account has been created. Welcome to Threadly!",
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none">
                  <User className="w-4 h-4 mr-2" />
                  Register
                </TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login" className="p-6">
                <form onSubmit={handleLogin}>
                  <h2 className="text-2xl font-medium mb-6 text-center">Welcome Back</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          className="pl-10" 
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium">
                          Password
                        </label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="********" 
                          className="pl-10" 
                          required
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account yet?{' '}
                    <button 
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => document.querySelector('[value="register"]')?.dispatchEvent(new MouseEvent('click'))}
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="p-6">
                <form onSubmit={handleRegister}>
                  <h2 className="text-2xl font-medium mb-6 text-center">Create Your Account</h2>
                  
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-3">I am registering as:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: UserRole.CUSTOMER, label: "Customer", icon: User },
                        { value: UserRole.WEAVER, label: "Weaver", icon: BadgeCheck }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          className={cn(
                            "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                            accountType === type.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/30"
                          )}
                          onClick={() => setAccountType(type.value)}
                        >
                          <type.icon className={cn(
                            "w-5 h-5",
                            accountType === type.value ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="reg-name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input 
                        id="reg-name" 
                        type="text" 
                        placeholder="John Doe" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="reg-email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="reg-password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input 
                          id="reg-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a strong password" 
                          required
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters with a mix of letters, numbers, and symbols.
                      </p>
                    </div>
                    
                    {accountType === UserRole.WEAVER && (
                      <div className="space-y-2">
                        <label htmlFor="weaver-bio" className="text-sm font-medium">
                          Brief Introduction
                        </label>
                        <textarea 
                          id="weaver-bio" 
                          placeholder="Describe your weaving expertise, techniques, and experience..." 
                          className="w-full p-2 border border-border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    )}
                    
                    <div className="flex items-start pt-2">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="mt-1 mr-2" 
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => document.querySelector('[value="login"]')?.dispatchEvent(new MouseEvent('click'))}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
