
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WeaverCard from '@/components/ui/WeaverCard';
import { UserRole } from '@/lib/types';

const FeaturedWeavers = () => {
  // Create the same weavers data from the Weavers page
  const weavers = [
    {
      id: 'w1',
      name: 'Aruna Patel',
      email: 'aruna@example.com',
      role: UserRole.WEAVER,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Third-generation silk weaver specializing in traditional Banarasi designs with 15 years of experience.',
      isVerified: true,
      createdAt: new Date('2022-01-10'),
      productCount: 2,
      averageRating: 4.7
    },
    {
      id: 'w2',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      role: UserRole.WEAVER,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Specializing in cotton handloom with natural dyes, creating sustainable and eco-friendly fabrics.',
      isVerified: true,
      createdAt: new Date('2022-03-15'),
      productCount: 2,
      averageRating: 4.5
    },
    {
      id: 'w3',
      name: 'Lakshmi Devi',
      email: 'lakshmi@example.com',
      role: UserRole.WEAVER,
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Award-winning master weaver known for intricate jute and linen blends with contemporary designs.',
      isVerified: true,
      createdAt: new Date('2022-05-20'),
      productCount: 2,
      averageRating: 4.8
    },
    {
      id: 'w4',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      role: UserRole.WEAVER,
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Specializing in woolen shawls and blankets using traditional hill station techniques passed down generations.',
      isVerified: false,
      createdAt: new Date('2022-08-05'),
      productCount: 2,
      averageRating: 4.7
    }
  ];

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
            <Link to="/weavers" className="flex items-center">
              <span>View All Weavers</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weavers.slice(0, 4).map((weaver, index) => (
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
        <div className="mt-20 bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-medium mb-4">The Craft & Heritage</h3>
              <p className="text-muted-foreground mb-6">
                Each thread tells a story of tradition passed down through generations. Our platform preserves these ancient techniques while providing sustainable livelihoods to artisan communities across the country.
              </p>
              <Button asChild className="w-fit group">
                <Link to="/about" className="flex items-center">
                  Our Story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
