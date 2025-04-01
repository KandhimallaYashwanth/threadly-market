
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, BadgeCheck, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Register form schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum([UserRole.CUSTOMER, UserRole.WEAVER]),
  bio: z.string().optional(),
  terms: z.boolean().refine(val => val === true, { message: "You must agree to the terms" }),
});

const Auth = () => {
  const { toast: shadowToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<UserRole>(UserRole.CUSTOMER);
  
  // Setup form hooks
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.CUSTOMER,
      bio: "",
      terms: false,
    },
  });
  
  // Check if user was redirected from another page
  const from = location.state?.from || '/';
  const redirectReason = location.state?.reason || '';

  useEffect(() => {
    // Display message if redirected for a specific reason
    if (redirectReason === 'auth-required') {
      toast.info('Please log in to continue');
    }
    
    // If user is already logged in, redirect them
    if (user) {
      if (user.role === UserRole.WEAVER) {
        navigate('/dashboard/weaver');
      } else {
        navigate(from === '/auth' ? '/dashboard/customer' : from);
      }
    }
  }, [redirectReason, user, navigate, from]);
  
  // Update role in form when account type changes
  useEffect(() => {
    registerForm.setValue('role', accountType);
  }, [accountType, registerForm]);
  
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login error:", error);
    }
  };
  
  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      await signUp(
        values.email, 
        values.password, 
        values.name, 
        values.role,
        values.bio
      );
    } catch (error) {
      // Error is handled in the auth context
      console.error("Registration error:", error);
    }
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
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                    <h2 className="text-2xl font-medium mb-6 text-center">Welcome Back</h2>
                    
                    <div className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="your@email.com" 
                                  className="pl-10" 
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                Forgot password?
                              </Link>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="********" 
                                  className="pl-10" 
                                />
                              </FormControl>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
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
                </Form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="p-6">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)}>
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
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="John Doe" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="your@email.com" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Create a strong password" 
                                />
                              </FormControl>
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
                              Must be at least 6 characters.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {accountType === UserRole.WEAVER && (
                        <FormField
                          control={registerForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brief Introduction</FormLabel>
                              <FormControl>
                                <textarea 
                                  {...field} 
                                  placeholder="Describe your weaving expertise, techniques, and experience..." 
                                  className="w-full p-2 border border-border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={registerForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-2">
                            <FormControl>
                              <input 
                                type="checkbox" 
                                className="mt-1 mr-2" 
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-muted-foreground">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary hover:underline">
                                  Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-primary hover:underline">
                                  Privacy Policy
                                </Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
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
                </Form>
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
