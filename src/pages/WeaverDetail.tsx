
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Share2, Star } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product, User, UserRole } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

const WeaverDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [weaver, setWeaver] = useState<User | null>(null);
  const [weaverProducts, setWeaverProducts] = useState<Product[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  
  // Fetch weaver and their products
  useEffect(() => {
    const fetchWeaverData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch weaver profile
        const { data: weaverData, error: weaverError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (weaverError) throw weaverError;
        
        if (weaverData) {
          const mappedWeaver: User = {
            id: weaverData.id,
            name: weaverData.name || '',
            email: weaverData.email || '',
            role: weaverData.role as UserRole,
            avatar_url: weaverData.avatar_url,
            bio: weaverData.bio,
            isVerified: weaverData.is_verified,
            isPublic: true, // We can see this weaver, so must be public
            createdAt: new Date(weaverData.created_at)
          };
          
          setWeaver(mappedWeaver);
          
          // Fetch weaver's products
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('weaver_id', id);
          
          if (productsError) throw productsError;
          
          if (productsData) {
            const mappedProducts: Product[] = productsData.map((product: any) => ({
              id: product.id,
              name: product.name,
              description: product.description || '',
              images: product.images || [],
              price: product.price,
              discount: product.discount,
              fabricType: product.fabric_type,
              weaverId: product.weaver_id,
              weaver: mappedWeaver,
              inStock: product.in_stock,
              rating: product.rating,
              reviewCount: product.review_count,
              tags: product.tags || [],
              createdAt: new Date(product.created_at),
              codAvailable: product.cod_available,
              upiEnabled: product.upi_enabled,
              cardEnabled: product.card_enabled
            }));
            
            setWeaverProducts(mappedProducts);
            
            // Calculate average rating
            const ratings = mappedProducts.filter(p => p.rating).map(p => p.rating || 0);
            const totalRatingsCount = ratings.length;
            const avgRating = totalRatingsCount 
              ? ratings.reduce((sum, rating) => sum + rating, 0) / totalRatingsCount 
              : 0;
            
            setAverageRating(avgRating);
            setTotalRatings(totalRatingsCount);
          }
        }
      } catch (error) {
        console.error('Error fetching weaver data:', error);
        toast.error('Failed to load weaver data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeaverData();
  }, [id]);
  
  const handleMessageClick = () => {
    if (!user) {
      toast.info("Please sign in to send messages");
      navigate('/auth', { state: { from: `/weavers/${id}` } });
      return;
    }
    
    if (user.role === UserRole.WEAVER) {
      toast.info("Weavers cannot message other weavers");
      return;
    }
    
    // Redirect to dashboard with chat section opened for this weaver
    navigate(`/dashboard/customer?tab=messages&weaver=${id}`);
  };
  
  // Handle if weaver not found or still loading
  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl font-medium mb-4">Loading Weaver Profile...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!weaver) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl font-medium mb-4">Weaver Not Found</h1>
            <p className="text-muted-foreground mb-8">The weaver you are looking for does not exist or has been removed.</p>
            <Button asChild>
              <Link to="/weavers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Weavers
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${weaver.name} - Threadly Artisan`,
        text: `Check out ${weaver.name}'s handloom creations on Threadly`,
        url: window.location.href,
      }).catch(err => {
        toast.error('Something went wrong while sharing');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {/* Weaver Profile Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="relative">
                <img 
                  src={weaver.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                  alt={weaver.name} 
                  className="w-full aspect-square object-cover rounded-xl"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center flex-wrap gap-3">
                    <h1 className="text-3xl font-medium">{weaver.name}</h1>
                  </div>
                  
                  <div className="flex items-center mt-3 text-muted-foreground">
                    {averageRating > 0 && (
                      <div className="flex items-center mr-4">
                        <Star className="w-5 h-5 fill-amber-500 text-amber-500 mr-1" />
                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                        <span className="mx-1">•</span>
                        <span>{totalRatings} reviews</span>
                      </div>
                    )}
                    <div>{weaverProducts.length} Products</div>
                  </div>
                  
                  {weaver.bio && (
                    <p className="mt-6 text-lg">{weaver.bio}</p>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(weaverProducts.map(p => p.fabricType))).map((fabric, idx) => (
                        <span key={idx} className="bg-secondary px-3 py-1 rounded-full text-sm">
                          {fabric.charAt(0).toUpperCase() + fabric.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  <Button onClick={handleMessageClick} className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Weaver's Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-medium mb-8">Products by {weaver.name}</h2>
            
            {weaverProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {weaverProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    className={cn("hover-lift animate-scale-in")}
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/50 rounded-xl">
                <p className="text-lg mb-2">No products available at the moment</p>
                <p className="text-muted-foreground">Check back soon for new creations</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default WeaverDetail;
