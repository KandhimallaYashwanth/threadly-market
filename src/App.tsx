
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Weavers from "@/pages/Weavers";
import WeaverDetail from "@/pages/WeaverDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CustomerDashboard from "@/pages/dashboard/CustomerDashboard";
import WeaverDashboard from "@/pages/dashboard/WeaverDashboard";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/NotFound";
import { User, UserRole, DEFAULT_USERS } from "./lib/types";

const queryClient = new QueryClient();

// Initialize default users if not already in localStorage
const initializeDefaultUsers = () => {
  // Check if users already exist
  if (!localStorage.getItem('usersInitialized')) {
    // Store default users in localStorage
    DEFAULT_USERS.forEach(user => {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.some((u: User) => u.email === user.email);
      
      if (!userExists) {
        existingUsers.push(user);
        localStorage.setItem('users', JSON.stringify(existingUsers));
      }
    });
    
    localStorage.setItem('usersInitialized', 'true');
  }
};

// Protected route component for role-based access control
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: UserRole[] }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setIsAuthorized(false);
        return;
      }

      try {
        const user: User = JSON.parse(userData);
        setIsAuthorized(allowedRoles.includes(user.role));
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (isAuthorized === null) {
    // Still loading
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  useEffect(() => {
    // Initialize default users when the app loads
    initializeDefaultUsers();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/weavers" element={<Weavers />} />
            <Route path="/weavers/:id" element={<WeaverDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/dashboard/customer" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.CUSTOMER, UserRole.ADMIN]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/weaver" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.WEAVER, UserRole.ADMIN]}>
                  <WeaverDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
