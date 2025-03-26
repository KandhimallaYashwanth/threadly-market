
import React, { useState } from 'react';
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
  Bell, 
  Settings, 
  LogOut, 
  ChevronDown,
  MessageSquare,
  BarChart3
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  weavers, 
  orderStatusData, 
  monthlySalesData, 
  fabricTypeSalesData, 
  productsWithWeavers 
} from '@/lib/data';
import { OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

const Dashboard = () => {
  // Mock data for the current weaver (first from the array)
  const currentWeaver = weavers[0];
  
  // Get products for this weaver
  const weaverProducts = productsWithWeavers.filter(
    p => p.weaverId === currentWeaver.id
  );
  
  // State for active tab and sidebar
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
                  { icon: Package, label: 'Products', value: 'products' },
                  { icon: Users, label: 'Customers', value: 'customers' },
                  { icon: Inbox, label: 'Orders', value: 'orders' },
                  { icon: MessageSquare, label: 'Messages', value: 'messages' },
                  { icon: DollarSign, label: 'Sales', value: 'sales' },
                  { icon: Settings, label: 'Settings', value: 'settings' }
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
                  Welcome back, {currentWeaver.name}
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
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
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
                        <p className="text-xs text-muted-foreground truncate">{currentWeaver.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div>
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
                  <Card key={index} className="hover-lift transition-all-300">
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
              
              {/* Latest Activity Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
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
                
                {/* Recent Products */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Products</CardTitle>
                      <CardDescription>Latest products added</CardDescription>
                    </div>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weaverProducts.slice(0, 5).map((product) => (
                        <div 
                          key={product.id} 
                          className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ₹{product.price.toLocaleString()}
                            </div>
                          </div>
                          <div className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            product.inStock 
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
