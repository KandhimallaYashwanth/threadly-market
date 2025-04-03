
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, UserRole } from '@/lib/types';
import ConversationsList from '@/components/dashboard/ConversationsList';
import ChatSection from '@/components/dashboard/ChatSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define the expected props for ChatSection to match the component's requirements
interface ChatSectionProps {
  currentUser: User;
  receiver: User;
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedWeaver, setSelectedWeaver] = useState<User | null>(null);
  
  // Update selectedWeaver from URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const weaverId = urlParams.get('weaver');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (weaverId && tabParam === 'messages') {
      // Fetch weaver data by ID
      const fetchWeaver = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', weaverId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Convert to User type
            const weaverData: User = {
              id: data.id,
              name: data.name || '',
              email: data.email || '',
              role: data.role as UserRole,
              avatar_url: data.avatar_url,
              bio: data.bio,
              isVerified: data.is_verified,
              createdAt: new Date(data.created_at)
            };
            
            setSelectedWeaver(weaverData);
          }
        } catch (error) {
          console.error('Error fetching weaver:', error);
        }
      };
      
      fetchWeaver();
    }
  }, []);
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const handleSelectWeaver = (weaver: User) => {
    setSelectedWeaver(weaver);
  };
  
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="bg-secondary rounded-md">
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Home className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-6">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Your Orders</h2>
              <p className="text-muted-foreground">
                Here you can track and manage your orders.
              </p>
              <div className="mt-4">
                <p>No orders yet.</p>
                <Button asChild>
                  <Link to="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <div className="rounded-md border">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">Conversations</h2>
                  <p className="text-muted-foreground">
                    Select a weaver to view your conversation.
                  </p>
                  <div className="mt-4">
                    <ConversationsList 
                      currentUser={user}
                      onSelectWeaver={handleSelectWeaver}
                      selectedWeaverId={selectedWeaver?.id}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <div className="rounded-md border">
                <div className="p-4">
                  {selectedWeaver ? (
                    <ChatSection 
                      currentUser={user} 
                      receiver={selectedWeaver} 
                    />
                  ) : (
                    <div className="text-center py-24">
                      <h3 className="text-xl font-medium mb-2">Select a Weaver to start a conversation</h3>
                      <p className="text-muted-foreground">
                        Choose from the list of weavers on the left to view your messages.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
