
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Weavers from "@/pages/Weavers";
import WeaverDetail from "@/pages/WeaverDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Chat from "@/pages/Chat";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CustomerDashboard from "@/pages/dashboard/CustomerDashboard";
import WeaverDashboard from "@/pages/dashboard/WeaverDashboard";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/weaver" element={<WeaverDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
