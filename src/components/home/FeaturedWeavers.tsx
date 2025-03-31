
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WeaverCard from '@/components/ui/WeaverCard';
import { weavers, products } from '@/lib/data';

const FeaturedWeavers = () => {
  // Get product counts for each weaver
  const weaverProductCounts = weavers.map(weaver => {
    const count = products.filter(p => p.weaverId === weaver.id).length;
    const ratings = products
      .filter(p => p.weaverId === weaver.id && p.rating)
      .map(p => p.rating || 0);
    
    const avgRating = ratings.length 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;
    
    return {
      ...weaver,
      productCount: count,
      averageRating: avgRating
    };
  });

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">Meet Our Artisans</h2>
            <p className="text-muted-foreground max-w-2xl">
              Connect directly with master weavers who bring generations of expertise and passion to every thread they weave.
            </p>
          </div>
          <Button 
            asChild 
            variant="link" 
            className="mt-4 md:mt-0 group no-underline text-primary"
          >
            <Link to="/weavers">
              View All Weavers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weaverProductCounts.slice(0, 4).map((weaver, index) => (
            <WeaverCard 
              key={weaver.id} 
              weaver={weaver} 
              productCount={weaver.productCount} 
              averageRating={weaver.averageRating}
              className="animate-scale-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
        
        {/* Artisan story section */}
        <div className="mt-20 bg-white rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-medium mb-4">The Craft & Heritage</h3>
              <p className="text-muted-foreground mb-6">
                Each thread tells a story of tradition passed down through generations. Our platform preserves these ancient techniques while providing sustainable livelihoods to artisan communities across the country.
              </p>
              <Button asChild className="w-fit">
                <Link to="/about">
                  Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="h-64 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Weaver working on loom" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWeavers;
