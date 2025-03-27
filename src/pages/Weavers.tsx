
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WeaverCard from '@/components/ui/WeaverCard';
import { weavers, products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Weavers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get product counts for each weaver
  const weaversWithStats = weavers.map(weaver => {
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

  // Filter weavers based on search query
  const filteredWeavers = weaversWithStats.filter(weaver => 
    weaver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (weaver.bio && weaver.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-medium tracking-tight mb-3">Our Artisan Community</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with skilled weavers dedicated to preserving traditional craftsmanship while creating exquisite handloom products.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-12">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search weavers by name or expertise..." 
                className="pl-10 py-6 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>

            {/* Weavers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredWeavers.map((weaver, index) => (
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

            {filteredWeavers.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl mb-2">No weavers found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-20 max-w-4xl mx-auto bg-primary/5 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-medium mb-4">Are you a handloom weaver?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join our community of artisans to showcase your work, connect with customers, and grow your handloom business.
            </p>
            <Button size="lg">
              Apply to Join
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Weavers;
