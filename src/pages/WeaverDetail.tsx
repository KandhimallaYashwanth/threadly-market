
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { weavers, products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Share2, Star } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const WeaverDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the weaver by ID
  const weaver = weavers.find(w => w.id === id);
  
  // Get weaver's products
  const weaverProducts = products.filter(p => p.weaverId === id);
  
  // Calculate average rating
  const ratings = weaverProducts
    .filter(p => p.rating)
    .map(p => p.rating || 0);
  
  const averageRating = ratings.length 
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
    : 0;
  
  const handleMessageClick = () => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth');
      return;
    }
    // Redirect to dashboard with chat section opened for this weaver
    navigate(`/dashboard/customer?tab=messages&weaver=${id}`);
  };
  
  // Handle if weaver not found
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
                  src={weaver.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
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
                        <span>{ratings.length} reviews</span>
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
                    product={{...product, weaver}} 
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
