
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Heart, Share, ShoppingCart, Minus, Plus, Star, MessageCircle,
  ArrowLeft, Truck, BadgeCheck, RotateCcw, ChevronRight 
} from 'lucide-react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { productsWithWeavers } from '@/lib/data';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = productsWithWeavers.find(p => p.id === id);
  
  // Similar products (same fabric type, different product)
  const similarProducts = productsWithWeavers
    .filter(p => p.id !== id && p.fabricType === product?.fabricType)
    .slice(0, 4);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  // Handle quantity changes
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  
  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4 md:px-6 text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Calculate final price with discount
  const finalPrice = product.discount 
    ? Math.round(product.price - (product.price * product.discount / 100))
    : product.price;
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </div>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Product Images */}
            <div>
              <div className="rounded-lg overflow-hidden mb-4 h-[500px] bg-secondary/30">
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "rounded-md overflow-hidden w-20 h-20 flex-shrink-0 transition-all",
                      activeImage === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm bg-secondary px-2 py-0.5 rounded capitalize">{product.fabricType}</span>
                  {product.rating && (
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                      <span>{product.rating.toFixed(1)}</span>
                      {product.reviewCount && (
                        <span className="text-muted-foreground ml-1">({product.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-medium mb-2">{product.name}</h1>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-semibold">₹{finalPrice.toLocaleString()}</span>
                  {product.discount && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                      <span className="text-sm font-medium text-red-600">Save {product.discount}%</span>
                    </>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-6">{product.description}</p>
                
                {/* Weaver Info */}
                {product.weaver && (
                  <div className="flex items-center gap-3 mb-6 p-4 bg-secondary/50 rounded-lg">
                    <img 
                      src={product.weaver.avatar} 
                      alt={product.weaver.name} 
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{product.weaver.name}</span>
                        {product.weaver.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-blue-500 ml-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Artisan Weaver</p>
                      <Button 
                        asChild 
                        variant="link" 
                        className="text-xs p-0 h-auto mt-1" 
                      >
                        <Link to={`/weavers/${product.weaver.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                    <div className="ml-auto">
                      <Button asChild size="sm">
                        <Link to={`/chat/${product.weaver.id}`}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat with Weaver
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Add to Cart Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border border-border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-r-none h-10 w-10"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div className="w-12 text-center">{quantity}</div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-l-none h-10 w-10"
                        onClick={increaseQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.inStock ? (
                        <span className="text-green-600 flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="flex-1 min-w-[200px]"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Product Services */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹1000" },
                    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
                  ].map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                      <service.icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">{service.title}</h3>
                        <p className="text-xs text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map((tag, index) => (
                    <Link 
                      key={index} 
                      to={`/products?search=${tag}`} 
                      className="bg-secondary rounded-full px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/80 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full grid grid-cols-3 max-w-md mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-2">
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <p className="text-muted-foreground">
                    Each handloom product is uniquely crafted, and there may be slight variations in colors, textures, and patterns compared to the images displayed. These variations are an inherent characteristic of handwoven fabrics and reflect the individual artisan's touch.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium capitalize">{product.fabricType}</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Handcrafted by</span>
                        <span className="font-medium">{product.weaver?.name || "Artisan Weaver"}</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Item Code</span>
                        <span className="font-medium">{product.id.toUpperCase()}</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-border">
                        <span className="text-muted-foreground">Care Instructions</span>
                        <span className="font-medium">Dry Clean Only</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                    <p className="text-muted-foreground mb-4">
                      Delivery typically takes 5-7 business days as each product is carefully checked for quality before dispatch.
                    </p>
                    <h4 className="font-medium mb-2">Processing Time</h4>
                    <p className="text-muted-foreground mb-4">
                      For in-stock items: 2-3 business days<br />
                      For made-to-order: 10-15 business days
                    </p>
                    <p className="text-sm bg-secondary/50 p-3 rounded-lg">
                      Note: For custom orders or design modifications, please message the weaver directly to discuss requirements and timeframes.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-2">
                <div className="flex flex-col items-center p-10 text-center border border-border rounded-lg">
                  <Star className="w-12 h-12 fill-amber-400 text-amber-400 mb-3" />
                  <h3 className="text-xl font-medium mb-1">
                    {product.rating ? product.rating.toFixed(1) : "0"}/5
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Based on {product.reviewCount || 0} reviews
                  </p>
                  <Button>
                    Write a Review
                  </Button>
                </div>
                
                {/* Here you would typically render a list of reviews */}
                <p className="text-center text-muted-foreground mt-6">
                  Review functionality will be implemented in the next phase.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium">Similar Products</h2>
                <Button asChild variant="link">
                  <Link to="/products">
                    View More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
