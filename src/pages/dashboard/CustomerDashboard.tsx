import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, UserRole, Order, OrderStatus, PaymentMethod } from '@/lib/types';
import ConversationsList from '@/components/dashboard/ConversationsList';
import ChatSection from '@/components/dashboard/ChatSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ChatSectionProps {
  currentUser: User;
  receiver: User;
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedWeaver, setSelectedWeaver] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const weaverId = urlParams.get('weaver');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (weaverId && tabParam === 'messages') {
      const fetchWeaver = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', weaverId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            const weaverData: User = {
              id: data.id,
              name: data.name || '',
              email: data.email || '',
              role: data.role as UserRole,
              avatar_url: data.avatar_url,
              bio: data.bio,
              isVerified: data.is_verified,
              isPublic: data.is_public,
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

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(*)
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const processedOrders: Order[] = data.map((order: any) => ({
            id: order.id,
            customerId: order.customer_id,
            weaverId: order.weaver_id,
            items: order.order_items.map((item: any) => ({
              productId: item.product_id,
              quantity: item.quantity,
              price: item.price
            })),
            status: order.status as OrderStatus,
            total: order.total,
            paymentMethod: order.payment_method as PaymentMethod,
            createdAt: new Date(order.created_at),
            updatedAt: new Date(order.updated_at)
          }));

          setOrders(processedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const handleSelectWeaver = (weaver: User) => {
    setSelectedWeaver(weaver);
  };
  
  return (
    <div className="container mx-auto mt-10 px-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="bg-secondary rounded-md">
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingBag className="w-4 h-4 mr-2" />
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
              
              {loading ? (
                <p className="text-center py-4">Loading orders...</p>
              ) : orders.length > 0 ? (
                <div className="divide-y">
                  {orders.map(order => (
                    <div key={order.id} className="py-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium">Order #{order.id.substring(0, 8)}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {order.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • 
                          Total: ₹{order.total.toFixed(2)} • 
                          Paid via {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No orders yet.</p>
                  <Button asChild className="mt-4">
                    <Link to="/products">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              )}
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
