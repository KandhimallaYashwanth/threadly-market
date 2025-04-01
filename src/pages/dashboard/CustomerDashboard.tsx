
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  MessageSquare, 
  User, 
  Settings, 
  Clock, 
  LogOut,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { UserRole, OrderStatus } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock order data
const mockOrders = [
  {
    id: 'ord-001',
    date: new Date(2023, 6, 15),
    items: [{ name: 'Handwoven Silk Saree', price: 5600 }],
    total: 5600,
    status: OrderStatus.DELIVERED
  },
  {
    id: 'ord-002',
    date: new Date(2023, 7, 3),
    items: [{ name: 'Cotton Table Runner', price: 1200 }],
    total: 1200,
    status: OrderStatus.SHIPPED
  },
  {
    id: 'ord-003',
    date: new Date(2023, 8, 10),
    items: [{ name: 'Jute Wall Hanging', price: 1800 }],
    total: 1800,
    status: OrderStatus.WEAVING
  }
];

// Mock conversations data
const mockConversations = [
  {
    id: 'conv-001',
    weaverId: '1',
    weaverName: 'Anita Sharma',
    weaverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    lastMessage: 'Your order is being prepared',
    timestamp: new Date(2023, 8, 25),
    unread: true
  },
  {
    id: 'conv-002',
    weaverId: '2',
    weaverName: 'Rajesh Kumar',
    weaverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    lastMessage: 'Thank you for your order!',
    timestamp: new Date(2023, 8, 20),
    unread: false
  }
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get status color based on order status
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-500';
      case OrderStatus.PROCESSING:
        return 'bg-blue-500';
      case OrderStatus.WEAVING:
        return 'bg-purple-500';
      case OrderStatus.SHIPPED:
        return 'bg-green-500';
      case OrderStatus.DELIVERED:
        return 'bg-green-700';
      case OrderStatus.CANCELLED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Verify user role
      if (parsedUser.role !== UserRole.CUSTOMER) {
        toast.error("Unauthorized access", {
          description: "This dashboard is for customers only."
        });
        navigate('/auth');
      } else {
        setUser(parsedUser);
      }
    } else {
      // Redirect to login if not logged in
      toast.error("Authentication required", {
        description: "Please log in to access your dashboard."
      });
      navigate('/auth', { state: { from: '/dashboard/customer', reason: 'auth-required' } });
    }
    
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/');
  };

  // If loading or no user, show loading state
  if (loading || !user) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Customer Dashboard</CardTitle>
                  <CardDescription>Welcome, {user.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
                      className="justify-start"
                      onClick={() => setActiveTab('orders')}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Button>
                    <Button 
                      variant={activeTab === 'messages' ? 'secondary' : 'ghost'} 
                      className="justify-start"
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                    <Button 
                      variant={activeTab === 'profile' ? 'secondary' : 'ghost'} 
                      className="justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button 
                      variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
                      className="justify-start"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mt-4"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Track your past and current orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                        <Button className="mt-4" onClick={() => navigate('/products')}>
                          Browse Products
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mockOrders.map((order) => (
                          <div 
                            key={order.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex gap-2 items-center">
                                  <h3 className="font-semibold">Order #{order.id}</h3>
                                  <span className={cn(
                                    "inline-block w-2 h-2 rounded-full",
                                    getStatusColor(order.status)
                                  )}></span>
                                  <span className="text-sm text-muted-foreground capitalize">
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  <Clock className="inline h-3 w-3 mr-1" />
                                  {formatDate(order.date)}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
                                <p className="font-medium">₹{order.total.toLocaleString()}</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary p-0 h-auto"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm font-medium">Items:</p>
                              <ul className="text-sm text-muted-foreground">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>{item.name} - ₹{item.price.toLocaleString()}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Messages</CardTitle>
                      <CardDescription>Your conversations with artisans</CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="Search messages..." className="pl-10" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {mockConversations.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You don't have any messages yet.</p>
                        <Button className="mt-4" onClick={() => navigate('/weavers')}>
                          Find Artisans
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mockConversations.map((conversation) => (
                          <div 
                            key={conversation.id} 
                            className={cn(
                              "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
                              conversation.unread 
                                ? "bg-primary/5 hover:bg-primary/10" 
                                : "hover:bg-secondary/80"
                            )}
                            onClick={() => navigate(`/chat/${conversation.weaverId}`)}
                          >
                            <Avatar>
                              <AvatarImage src={conversation.weaverAvatar} />
                              <AvatarFallback>{conversation.weaverName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline">
                                <h4 className="font-medium truncate">{conversation.weaverName}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(conversation.timestamp)}
                                </span>
                              </div>
                              <p className={cn(
                                "text-sm truncate",
                                conversation.unread ? "font-medium text-foreground" : "text-muted-foreground"
                              )}>
                                {conversation.lastMessage}
                              </p>
                            </div>
                            {conversation.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{user.name}</h3>
                          <p className="text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 mt-6">
                        <div>
                          <label className="text-sm font-medium">Display Name</label>
                          <Input defaultValue={user.name} className="mt-1" />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Email Address</label>
                          <Input defaultValue={user.email} className="mt-1" />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Shipping Address</label>
                          <Input placeholder="Enter your address" className="mt-1" />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Phone Number</label>
                          <Input placeholder="Enter your phone number" className="mt-1" />
                        </div>
                        
                        <Button className="w-full md:w-auto mt-4">Save Changes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your preferences and security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="notifications">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                      </TabsList>
                      <TabsContent value="notifications" className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">Get notified about order updates</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">Enable</Button>
                              <Button variant="ghost" size="sm">Disable</Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Mobile Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive notifications on your mobile</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">Enable</Button>
                              <Button variant="ghost" size="sm">Disable</Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="privacy" className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Profile Visibility</p>
                              <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                            </div>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Data Sharing</p>
                              <p className="text-sm text-muted-foreground">Manage how your data is used</p>
                            </div>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="password" className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Current Password</label>
                            <Input type="password" className="mt-1" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">New Password</label>
                            <Input type="password" className="mt-1" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <Input type="password" className="mt-1" />
                          </div>
                          <Button>Update Password</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CustomerDashboard;
