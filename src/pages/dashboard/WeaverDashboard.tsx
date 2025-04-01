
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Package, 
  Users, 
  DollarSign, 
  Inbox, 
  PlusCircle, 
  Search, 
  LogOut, 
  ChevronDown,
  MessageSquare,
  BarChart3,
  Upload,
  Image,
  FileText,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  weavers, 
  orderStatusData, 
  monthlySalesData, 
  fabricTypeSalesData, 
  productsWithWeavers 
} from '@/lib/data';
import { OrderStatus, FabricType, UserRole } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

// Mock conversations data
const mockConversations = [
  {
    id: 'conv-001',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastMessage: 'I wanted to ask about the silk saree',
    timestamp: new Date(2023, 8, 25),
    unread: true
  },
  {
    id: 'conv-002',
    customerId: 'c2',
    customerName: 'Amit Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastMessage: 'Thank you for the quick delivery!',
    timestamp: new Date(2023, 8, 20),
    unread: false
  }
];

const WeaverDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    fabricType: FabricType.COTTON,
    inStock: true,
    images: [] as string[]
  });
  
  // For demo purposes, we'll use the first weaver from the data
  const currentWeaver = weavers[0];
  
  // Get products for this weaver
  const weaverProducts = productsWithWeavers.filter(
    p => p.weaverId === currentWeaver.id
  );
  
  // Check authentication
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Verify user role
      if (parsedUser.role !== UserRole.WEAVER) {
        toast.error("Unauthorized access", {
          description: "This dashboard is for weavers only."
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
      navigate('/auth', { state: { from: '/dashboard/weaver', reason: 'auth-required' } });
    }
    
    setLoading(false);
  }, [navigate]);
  
  // Render the status color for order statuses
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

  // Handle product submission
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.images.length) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Simulate product creation
    toast.success("Product created successfully", {
      description: "Your item has been posted and is now available for purchase."
    });
    
    // Reset form
    setNewProduct({
      name: '',
      description: '',
      price: '',
      fabricType: FabricType.COTTON,
      inStock: true,
      images: []
    });
    
    // Switch to products tab to show the "new" product
    setActiveTab('products');
  };
  
  // Handle image upload
  const handleImageUpload = () => {
    // Simulate image upload with placeholder images
    const placeholderImages = [
      'https://images.unsplash.com/photo-1561849954-d28ad922814b?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1617383543739-0524e8926dca?auto=format&fit=crop&q=80&w=2264&ixlib=rb-4.0.3'
    ];
    
    // Randomly select one of the placeholder images
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, randomImage]
    });
    
    toast.success("Image uploaded successfully");
  };
  
  // Handle logout
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

  // Calculate total orders and revenue
  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.count, 0);
  const totalRevenue = monthlySalesData.reduce((sum, item) => sum + item.sales, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-16">
        <div className="flex">
          {/* Sidebar */}
          <aside 
            className={cn(
              "bg-primary text-primary-foreground h-[calc(100vh-64px)] sticky top-16 transition-all",
              sidebarOpen ? "w-64" : "w-20"
            )}
          >
            <div className="p-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Dashboard</span>}
              </Button>
              
              <nav className="space-y-1 mt-6">
                {[
                  { icon: BarChart3, label: 'Overview', value: 'overview' },
                  { icon: Package, label: 'Products', value: 'products' },
                  { icon: Inbox, label: 'Orders', value: 'orders' },
                  { icon: MessageSquare, label: 'Messages', value: 'messages' },
                  { icon: PlusCircle, label: 'Add Product', value: 'add-product' },
                  { icon: DollarSign, label: 'Sales', value: 'sales' },
                  { icon: Users, label: 'Customers', value: 'customers' },
                ].map((item) => (
                  <Button 
                    key={item.value}
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10",
                      activeTab === item.value && "bg-white/10 text-primary-foreground"
                    )}
                    onClick={() => setActiveTab(item.value)}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Button>
                ))}
              </nav>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Logout</span>}
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-medium">Weaver Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user.name}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-10 w-60"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={currentWeaver.avatar} 
                          alt={currentWeaver.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-2 p-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={currentWeaver.avatar} 
                          alt={currentWeaver.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">{currentWeaver.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab('add-product')}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Add New Product</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { 
                        title: 'Total Products', 
                        value: weaverProducts.length, 
                        icon: Package, 
                        change: '+2 this week',
                        color: 'bg-blue-100 text-blue-600'
                      },
                      { 
                        title: 'Total Orders', 
                        value: totalOrders, 
                        icon: Inbox, 
                        change: '+5 this week',
                        color: 'bg-purple-100 text-purple-600'
                      },
                      { 
                        title: 'Total Revenue', 
                        value: `₹${(totalRevenue/1000).toFixed(0)}K`, 
                        icon: DollarSign, 
                        change: '+10% this month',
                        color: 'bg-green-100 text-green-600'
                      },
                      { 
                        title: 'Total Customers', 
                        value: '120', 
                        icon: Users, 
                        change: '+12 this month',
                        color: 'bg-amber-100 text-amber-600'
                      }
                    ].map((card, index) => (
                      <Card key={index} className="hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            {card.title}
                          </CardTitle>
                          <div className={cn("p-2 rounded-full", card.color)}>
                            <card.icon className="h-4 w-4" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{card.value}</div>
                          <p className="text-xs text-muted-foreground">{card.change}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Monthly Sales</CardTitle>
                        <CardDescription>
                          Sales performance over the past 12 months
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={monthlySalesData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip 
                                formatter={(value) => [`₹${value}`, 'Revenue']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                              />
                              <Bar 
                                dataKey="sales" 
                                fill="#8884d8"
                                radius={[4, 4, 0, 0]} 
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Sales by Fabric Type</CardTitle>
                        <CardDescription>
                          Distribution of sales across fabric types
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={fabricTypeSalesData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                fill="#8884d8"
                                dataKey="value"
                                label
                              >
                                {fabricTypeSalesData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Recent Orders</CardTitle>
                          <CardDescription>Latest customer orders</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {orderStatusData.slice(0, 5).map((order, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  getStatusColor(order.status)
                                )} />
                                <div>
                                  <div className="font-medium">Order #{1000 + index}</div>
                                  <div className="text-sm text-muted-foreground capitalize">
                                    {order.status}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">2h ago</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Recent Messages */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Recent Messages</CardTitle>
                          <CardDescription>Customer communications</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockConversations.map((conversation) => (
                            <div 
                              key={conversation.id} 
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors",
                                conversation.unread 
                                  ? "bg-primary/5 hover:bg-primary/10" 
                                  : "bg-secondary/30 hover:bg-secondary/50"
                              )}
                              onClick={() => navigate(`/chat/${conversation.customerId}`)}
                            >
                              <Avatar>
                                <AvatarImage src={conversation.customerAvatar} />
                                <AvatarFallback>{conversation.customerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                  <h4 className="font-medium">{conversation.customerName}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(conversation.timestamp)}
                                  </span>
                                </div>
                                <p className={cn(
                                  "text-sm truncate",
                                  conversation.unread ? "text-foreground" : "text-muted-foreground"
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
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {/* Products Tab */}
              {activeTab === 'products' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Products</CardTitle>
                      <CardDescription>Manage your handcrafted items</CardDescription>
                    </div>
                    <Button onClick={() => setActiveTab('add-product')}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weaverProducts.map((product) => (
                        <div 
                          key={product.id} 
                          className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="w-full md:w-24 h-24 rounded-md overflow-hidden">
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm font-medium">₹{product.price.toLocaleString()}</span>
                              <span className="text-xs px-2 py-0.5 bg-secondary rounded-full capitalize">{product.fabricType}</span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                product.inStock 
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              )}>
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Add Product Tab */}
              {activeTab === 'add-product' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                    <CardDescription>Create a new handcrafted item to sell</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProductSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="product-name">Product Name</Label>
                          <Input 
                            id="product-name" 
                            placeholder="e.g., Handwoven Silk Saree" 
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="product-price">Price (₹)</Label>
                          <Input 
                            id="product-price" 
                            type="number" 
                            placeholder="e.g., 4999" 
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="product-description">Description</Label>
                        <Textarea 
                          id="product-description" 
                          placeholder="Describe your product in detail..." 
                          className="min-h-[100px]"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fabric-type">Fabric Type</Label>
                          <Select 
                            value={newProduct.fabricType}
                            onValueChange={(value) => setNewProduct({...newProduct, fabricType: value as FabricType})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fabric type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(FabricType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Availability</Label>
                          <div className="flex gap-4 pt-2">
                            <Button 
                              type="button"
                              variant={newProduct.inStock ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setNewProduct({...newProduct, inStock: true})}
                            >
                              In Stock
                            </Button>
                            <Button 
                              type="button"
                              variant={!newProduct.inStock ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setNewProduct({...newProduct, inStock: false})}
                            >
                              Out of Stock
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Product Images</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <div className="space-y-2">
                            <div className="flex justify-center">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Drag and drop files here, or click to select files
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handleImageUpload}
                            >
                              <Image className="h-4 w-4 mr-2" />
                              Select Images
                            </Button>
                          </div>
                        </div>
                        
                        {/* Preview of uploaded images */}
                        {newProduct.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {newProduct.images.map((image, index) => (
                              <div key={index} className="relative rounded-md overflow-hidden h-24">
                                <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                <Button 
                                  type="button"
                                  variant="destructive" 
                                  size="icon" 
                                  className="absolute top-1 right-1 h-6 w-6" 
                                  onClick={() => setNewProduct({
                                    ...newProduct, 
                                    images: newProduct.images.filter((_, i) => i !== index)
                                  })}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button type="submit" className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Product
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Customer Messages</CardTitle>
                      <CardDescription>Chat with your customers</CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="Search messages..." className="pl-10" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockConversations.map((conversation) => (
                        <div 
                          key={conversation.id} 
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors",
                            conversation.unread 
                              ? "bg-primary/5 hover:bg-primary/10" 
                              : "hover:bg-secondary"
                          )}
                          onClick={() => navigate(`/chat/${conversation.customerId}`)}
                        >
                          <Avatar>
                            <AvatarImage src={conversation.customerAvatar} />
                            <AvatarFallback>{conversation.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-medium">{conversation.customerName}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(conversation.timestamp)}
                              </span>
                            </div>
                            <p className={cn(
                              "text-sm truncate",
                              conversation.unread ? "text-foreground" : "text-muted-foreground"
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
                  </CardContent>
                </Card>
              )}
              
              {/* Other tabs can be implemented as needed */}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WeaverDashboard;
