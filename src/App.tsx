
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
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
import { UserRole } from "./lib/types";

const queryClient = new QueryClient();

// Protected route component for role-based access control
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: UserRole[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Still loading
    return <div>Loading...</div>;
  }
  
  if (!user) {
    // Not authenticated
    return <Navigate to="/auth" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Not authorized
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
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
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
