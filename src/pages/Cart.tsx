
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { requireAuth } from '@/lib/auth';

// Mock cart item interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weaverId: string;
  weaverName: string;
}

// Mock address interface
interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

// Mock payment method interface
interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'cod';
  name: string;
}

const Cart = () => {
  const navigate = useNavigate();
  
  // Check authentication
  useEffect(() => {
    requireAuth(navigate);
  }, [navigate]);
  
  // Mock cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'item1',
      name: 'Handwoven Silk Saree',
      price: 5600,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1617383543739-0524e8926dca?auto=format&fit=crop&q=80&w=2264&ixlib=rb-4.0.3',
      weaverId: '1',
      weaverName: 'Anita Sharma'
    },
    {
      id: 'item2',
      name: 'Cotton Table Runner',
      price: 1200,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1606753930828-fdbb5cb8ccbc?auto=format&fit=crop&q=80&w=2264&ixlib=rb-4.0.3',
      weaverId: '2',
      weaverName: 'Rajesh Kumar'
    }
  ]);
  
  // Checkout states
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Address state
  const [address, setAddress] = useState<Address>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  
  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 'pm1', type: 'card', name: 'Credit/Debit Card' },
    { id: 'pm2', type: 'upi', name: 'UPI Payment' },
    { id: 'pm3', type: 'cod', name: 'Cash on Delivery' }
  ];
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(paymentMethods[0].id);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 5000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + deliveryFee + tax;
  
  // Remove item from cart
  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success("Item removed from cart");
  };
  
  // Update item quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Handle address form change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };
  
  // Process payment
  const processPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Order placed successfully!");
      navigate('/dashboard/customer', { state: { newOrder: true } });
    }, 2000);
  };
  
  // Check if cart is empty
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-16 min-h-screen">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
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
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart items and checkout form */}
            <div className="lg:w-2/3">
              <div className="flex items-center mb-6">
                <Button 
                  variant="ghost" 
                  className="mr-2" 
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
                <h1 className="text-2xl font-bold">Your Cart</h1>
              </div>
              
              {/* Checkout Steps */}
              <Tabs 
                value={checkoutStep.toString()} 
                onValueChange={(value) => setCheckoutStep(parseInt(value))}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="0">Cart</TabsTrigger>
                  <TabsTrigger value="1" disabled={cartItems.length === 0}>Shipping</TabsTrigger>
                  <TabsTrigger value="2" disabled={!address.fullName || !address.addressLine1 || !address.city || !address.pincode || !address.phone}>Payment</TabsTrigger>
                </TabsList>
                
                {/* Cart Tab */}
                <TabsContent value="0">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-4 border-b">
                            <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-secondary rounded-md overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    By {item.weaverName}
                                  </p>
                                </div>
                                <div className="mt-2 sm:mt-0 flex justify-between sm:flex-col sm:items-end">
                                  <p className="font-medium">₹{item.price.toLocaleString()}</p>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 p-0"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex items-center">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <span>-</span>
                                </Button>
                                <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <span>+</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/products')}
                      >
                        Continue Shopping
                      </Button>
                      <Button onClick={() => setCheckoutStep(1)}>
                        Proceed to Shipping
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                {/* Shipping Tab */}
                <TabsContent value="1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                      <CardDescription>Enter your shipping details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            name="fullName" 
                            value={address.fullName} 
                            onChange={handleAddressChange} 
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={address.phone} 
                            onChange={handleAddressChange} 
                            placeholder="9876543210"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input 
                          id="addressLine1" 
                          name="addressLine1" 
                          value={address.addressLine1} 
                          onChange={handleAddressChange} 
                          placeholder="House No., Street Name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                        <Input 
                          id="addressLine2" 
                          name="addressLine2" 
                          value={address.addressLine2} 
                          onChange={handleAddressChange} 
                          placeholder="Apartment, Suite, Building, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={address.city} 
                            onChange={handleAddressChange} 
                            placeholder="City"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={address.state} 
                            onChange={handleAddressChange} 
                            placeholder="State"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">PIN Code</Label>
                          <Input 
                            id="pincode" 
                            name="pincode" 
                            value={address.pincode} 
                            onChange={handleAddressChange} 
                            placeholder="Pincode"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCheckoutStep(0)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Button>
                      <Button 
                        onClick={() => setCheckoutStep(2)}
                        disabled={!address.fullName || !address.addressLine1 || !address.city || !address.pincode || !address.phone}
                      >
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                {/* Payment Tab */}
                <TabsContent value="2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Choose your preferred payment method</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup 
                        value={selectedPaymentMethod} 
                        onValueChange={setSelectedPaymentMethod}
                        className="space-y-4"
                      >
                        {paymentMethods.map((method) => (
                          <div 
                            key={method.id} 
                            className="flex items-center space-x-2 border rounded-md p-4"
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                              {method.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCheckoutStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shipping
                      </Button>
                      <Button 
                        onClick={processPayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Place Order
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping & Handling</span>
                    <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  
                  {deliveryFee === 0 && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mt-4">
                      You've qualified for free shipping!
                    </div>
                  )}
                  
                  {deliveryFee > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Add ₹{(5000 - subtotal).toLocaleString()} more to qualify for free shipping.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
