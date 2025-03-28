
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import WeaverCard from '@/components/ui/WeaverCard';
import { weavers } from '@/lib/data';

const FeaturedWeavers = () => {
  // Only show first 3 weavers on homepage
  const displayedWeavers = weavers.slice(0, 3);
  
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Meet Our Weavers</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover the skilled artisans behind our handcrafted products, each with their own unique expertise and heritage.
            </p>
          </div>
          <Button 
            asChild 
            variant="ghost" 
            className="mt-4 md:mt-0 group relative overflow-hidden"
          >
            <Link to="/weavers" className="border-none">
              View All Weavers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedWeavers.map((weaver) => (
            <Card key={weaver.id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-0">
                <WeaverCard weaver={weaver} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWeavers;
