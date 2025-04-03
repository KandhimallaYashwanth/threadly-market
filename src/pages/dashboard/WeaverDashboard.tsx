import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, ShoppingBag, MessageSquare, Store, Users, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole, FabricType, Product, Order } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import ProfileVisibilityToggle from "@/components/profile/ProfileVisibilityToggle";
import ImageUpload from "@/components/product/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getInitials } from "@/lib/utils";
import { X } from 'lucide-react';

// Product form schema
const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  discount: z.coerce.number().min(0, { message: "Discount must be 0 or positive" }).max(100, { message: "Discount cannot exceed 100%" }).optional(),
  fabricType: z.nativeEnum(FabricType, { message: "Please select a fabric type" }),
  inStock: z.boolean().default(true),
  codAvailable: z.boolean().default(true),
  upiEnabled: z.boolean().default(true),
  cardEnabled: z.boolean().default(true),
  tags: z.string().optional(),
});

const WeaverDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState<string[]>([]);
  
  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount: 0,
      fabricType: FabricType.COTTON,
      inStock: true,
      codAvailable: true,
      upiEnabled: true,
      cardEnabled: true,
      tags: "",
    },
  });
  
  // Fetch weaver's products
  useEffect(() => {
    if (!user) return;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('weaver_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          const mappedProducts: Product[] = data.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description || '',
            images: product.images || [],
            price: product.price,
            discount: product.discount,
            fabricType: product.fabric_type,
            weaverId: product.weaver_id,
            inStock: product.in_stock,
            rating: product.rating,
            reviewCount: product.review_count,
            tags: product.tags || [],
            createdAt: new Date(product.created_at),
            codAvailable: product.cod_available,
            upiEnabled: product.upi_enabled,
            cardEnabled: product.card_enabled
          }));
          
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [user]);
  
  // Fetch weaver's orders
  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*)
          `)
          .eq('weaver_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          // Convert to our Order type
          const processedOrders: Order[] = data.map((order: any) => ({
            id: order.id,
            customerId: order.customer_id,
            weaverId: order.weaver_id,
            items: order.items.map((item: any) => ({
              productId: item.product_id,
              quantity: item.quantity,
              price: item.price
            })),
            status: order.status,
            total: order.total,
            paymentMethod: order.payment_method,
            createdAt: new Date(order.created_at),
            updatedAt: new Date(order.updated_at)
          }));
          
          setOrders(processedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  const handleProductSubmit = async (values: z.infer<typeof productSchema>) => {
    if (!user) return;
    
    try {
      // Transform tags string to array
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      // Create the product
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: values.name,
          description: values.description,
          price: values.price,
          discount: values.discount || 0,
          fabric_type: values.fabricType,
          weaver_id: user.id,
          in_stock: values.inStock,
          images: productImages,
          tags: tagsArray,
          cod_available: values.codAvailable,
          upi_enabled: values.upiEnabled,
          card_enabled: values.cardEnabled
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add new product to state
      if (data) {
        const newProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          images: data.images || [],
          price: data.price,
          discount: data.discount,
          fabricType: data.fabric_type,
          weaverId: data.weaver_id,
          inStock: data.inStock,
          rating: data.rating,
          reviewCount: data.review_count,
          tags: data.tags || [],
          createdAt: new Date(data.created_at),
          codAvailable: data.cod_available,
          upiEnabled: data.upi_enabled,
          cardEnabled: data.card_enabled
        };
        
        setProducts(prev => [...prev, newProduct]);
        
        // Reset form
        productForm.reset();
        setProductImages([]);
        
        toast.success('Product added successfully');
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product', {
        description: error.message
      });
    }
  };
  
  const handleImageUpload = (url: string) => {
    setProductImages(prev => [...prev, url]);
  };
  
  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">Weaver Dashboard</p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <ProfileVisibilityToggle isPublic={user.isPublic || false} />
            
            {/* Profile form would go here */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Update your public profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Profile editing functionality is in the main profile section.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Add new product card */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>
                  Create a new product listing for your handloom items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...productForm}>
                  <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
                    <FormField
                      control={productForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Traditional Cotton Saree" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Describe your product in detail..." 
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={productForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="0" step="0.01" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount (%)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="0" max="100" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={productForm.control}
                      name="fabricType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fabric Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fabric type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(FabricType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="traditional, festive, wedding" />
                          </FormControl>
                          <FormDescription>
                            Separate tags with commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={productForm.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mr-2"
                              />
                            </FormControl>
                            <FormLabel>In Stock</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="codAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mr-2"
                              />
                            </FormControl>
                            <FormLabel>COD Available</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="upiEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mr-2"
                              />
                            </FormControl>
                            <FormLabel>UPI Enabled</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="cardEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mr-2"
                              />
                            </FormControl>
                            <FormLabel>Card Enabled</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <Label>Product Images</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {productImages.map((url, index) => (
                          <div key={index} className="relative">
                            <img src={url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        {productImages.length < 5 && (
                          <ImageUpload 
                            onUpload={handleImageUpload}
                            bucketName="product_images"
                            folderPath={user.id}
                          />
                        )}
                      </div>
                      {productImages.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Please add at least one product image
                        </p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={productImages.length === 0}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Existing products */}
            {products.map(product => (
              <Card key={product.id}>
                <div className="aspect-square relative">
                  <img 
                    src={product.images[0] || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">₹{product.price}</p>
                      {product.discount && product.discount > 0 && (
                        <p className="text-sm text-muted-foreground line-through">
                          ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className={product.inStock ? "text-green-500" : "text-red-500"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-secondary px-2 py-0.5 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </CardFooter>
              </Card>
            ))}
            
            {loading && <p>Loading products...</p>}
            
            {!loading && products.length === 0 && (
              <Card className="col-span-3 py-10">
                <div className="text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Products Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your first product to start selling on Threadly.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>
                Manage and track all orders from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
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
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Orders Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your orders will appear here once customers start purchasing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Chat with customers interested in your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Messages functionality is handled by the chat components.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeaverDashboard;
