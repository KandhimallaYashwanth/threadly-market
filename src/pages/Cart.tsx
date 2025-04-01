
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Truck, 
  Wallet, Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product, UserRole } from '@/lib/types';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

const Cart = () => {
  const { toast: shadowToast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiId, setUpiId] = useState('');
  
  // Load cart items from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);
  
  // Calculate total price
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.discount 
      ? Math.round(item.price - (item.price * item.discount / 100))
      : item.price;
    return total + (price * item.quantity);
  }, 0);
  
  const shippingCost = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shippingCost;
  
  // Check if COD is available for all products
  const isCodAvailable = cartItems.length > 0 && cartItems.every(item => item.codAvailable);
  
  // Update localStorage whenever cart changes
  const updateCart = (newCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  // Increase quantity
  const increaseQuantity = (productId: string) => {
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };
  
  // Decrease quantity
  const decreaseQuantity = (productId: string) => {
    const updatedCart = cartItems.map(item => 
      item.id === productId && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    );
    updateCart(updatedCart);
  };
  
  // Remove item from cart
  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    updateCart(updatedCart);
    
    toast("The item has been removed from your cart.");
  };
  
  // Handle checkout
  const handleCheckout = () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    
    if (!user) {
      toast("You need to be signed in to proceed to checkout.");
      
      // Redirect to auth page with return URL
      navigate('/auth');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role === UserRole.WEAVER) {
      toast("Weavers cannot place orders. Please login as a customer.");
      navigate('/auth');
      return;
    }
    
    if (cartItems.length === 0) {
      toast("Please add items to your cart before checking out.");
      return;
    }
    
    setIsCheckout(true);
  };
  
  // Process payment
  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate UPI ID if UPI is selected
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Create a new order and save it to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const newOrder = {
        id: `ORD-${Date.now()}`,
        customerId: user.id,
        customer: user,
        items: cartItems,
        status: 'pending',
        paymentMethod,
        total,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success("Your order has been placed successfully!");
      
      // Redirect to customer dashboard
      navigate('/dashboard/customer?tab=orders');
    }, 2000);
  };
  
  // If cart is empty
  if (cartItems.length === 0 && !isCheckout) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h1 className="text-3xl font-medium mb-4">Your Cart</h1>
            <div className="bg-white rounded-xl p-8 border border-border text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button asChild>
                <Link to="/products">
                  Continue Shopping
                </Link>
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
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h1 className="text-3xl font-medium mb-6">
            {isCheckout ? 'Checkout' : 'Your Cart'}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items / Shipping Details */}
            <div className="lg:col-span-2">
              {!isCheckout ? (
                // Cart Items
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="p-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center py-4 border-b border-border last:border-0">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <Link 
                            to={`/products/${item.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.fabricType}
                          </p>
                        </div>
                        <div className="flex items-center ml-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="ml-6 text-right">
                          <div className="font-medium">
                            ₹{(item.discount 
                              ? Math.round(item.price - (item.price * item.discount / 100))
                              : item.price
                            ) * item.quantity}
                          </div>
                          {item.discount && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{item.price * item.quantity}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Shipping Details Form
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                            First Name
                          </label>
                          <Input id="firstName" required />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                            Last Name
                          </label>
                          <Input id="lastName" required />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium mb-1">
                          Street Address
                        </label>
                        <Input id="address" required />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium mb-1">
                            City
                          </label>
                          <Input id="city" required />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium mb-1">
                            State
                          </label>
                          <Input id="state" required />
                        </div>
                        <div>
                          <label htmlFor="pincode" className="block text-sm font-medium mb-1">
                            PIN Code
                          </label>
                          <Input id="pincode" required />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone Number
                        </label>
                        <Input id="phone" type="tel" required />
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                        <div className="space-y-3">
                          {/* Card Payment */}
                          <div className="flex items-center border rounded-lg p-3">
                            <input 
                              type="radio" 
                              id="card" 
                              name="paymentMethod" 
                              checked={paymentMethod === 'card'} 
                              onChange={() => setPaymentMethod('card')}
                              className="mr-2" 
                            />
                            <label htmlFor="card" className="flex items-center cursor-pointer flex-grow">
                              <CreditCard className="w-5 h-5 mr-2" />
                              Credit / Debit Card
                            </label>
                          </div>
                          
                          {/* UPI Payment */}
                          <div className="flex items-center border rounded-lg p-3">
                            <input 
                              type="radio" 
                              id="upi" 
                              name="paymentMethod" 
                              checked={paymentMethod === 'upi'} 
                              onChange={() => setPaymentMethod('upi')}
                              className="mr-2" 
                            />
                            <label htmlFor="upi" className="flex items-center cursor-pointer flex-grow">
                              <Wallet className="w-5 h-5 mr-2" />
                              UPI Payment
                            </label>
                          </div>
                          
                          {/* COD Option - Only if available */}
                          {isCodAvailable && (
                            <div className="flex items-center border rounded-lg p-3">
                              <input 
                                type="radio" 
                                id="cod" 
                                name="paymentMethod" 
                                checked={paymentMethod === 'cod'} 
                                onChange={() => setPaymentMethod('cod')}
                                className="mr-2" 
                              />
                              <label htmlFor="cod" className="flex items-center cursor-pointer flex-grow">
                                <Home className="w-5 h-5 mr-2" />
                                Cash on Delivery
                              </label>
                            </div>
                          )}
                          
                          {/* Payment Details based on method */}
                          {paymentMethod === 'card' && (
                            <div className="border rounded-lg p-4">
                              <div className="space-y-4">
                                <div>
                                  <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                                    Card Number
                                  </label>
                                  <Input 
                                    id="cardNumber" 
                                    placeholder="1234 5678 9012 3456" 
                                    required 
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label htmlFor="expiry" className="block text-sm font-medium mb-1">
                                      Expiry Date
                                    </label>
                                    <Input 
                                      id="expiry" 
                                      placeholder="MM/YY" 
                                      required 
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                                      CVV
                                    </label>
                                    <Input 
                                      id="cvv" 
                                      placeholder="123" 
                                      type="password" 
                                      required 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {paymentMethod === 'upi' && (
                            <div className="border rounded-lg p-4">
                              <div>
                                <label htmlFor="upiId" className="block text-sm font-medium mb-1">
                                  UPI ID
                                </label>
                                <Input 
                                  id="upiId" 
                                  placeholder="yourname@upi" 
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  required 
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Example: username@okbank or username@okhdfcbank
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {paymentMethod === 'cod' && (
                            <div className="border rounded-lg p-4 bg-green-50">
                              <p className="text-sm">
                                Pay in cash when your order is delivered. A convenience fee may apply.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground text-right mt-1">
                        Including GST
                      </div>
                    </div>
                  </div>
                  
                  {isCheckout ? (
                    <Button 
                      className="w-full"
                      onClick={processPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        "Processing Payment..."
                      ) : (
                        <>
                          Complete Order
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={handleCheckout}>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                  
                  {!isCheckout && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      By proceeding, you agree to our terms and conditions.
                    </p>
                  )}
                  
                  {isCheckout && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-3"
                      onClick={() => setIsCheckout(false)}
                    >
                      Back to Cart
                    </Button>
                  )}
                  
                  {!isCheckout && (
                    <div className="mt-6 flex items-center justify-center text-sm">
                      <Truck className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Free shipping on orders above ₹1,000
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
