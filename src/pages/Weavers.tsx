
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WeaverCard from '@/components/ui/WeaverCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserRole, User } from '@/lib/types';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';

// Extended user interface for weaver with stats
interface WeaverWithStats extends User {
  productCount: number;
  averageRating: number;
}

const Weavers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weavers, setWeavers] = useState<WeaverWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use predefined weavers instead of fetching from Supabase
  useEffect(() => {
    const hardcodedWeavers: WeaverWithStats[] = [
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

    setWeavers(hardcodedWeavers);
  }, []);

  // Filter weavers based on search query
  const filteredWeavers = weavers.filter(weaver => 
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

            {filteredWeavers.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-xl mb-2">No weavers found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <h3 className="text-xl mb-2">Loading weavers...</h3>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-20 max-w-4xl mx-auto bg-primary/5 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-medium mb-4">Are you a handloom weaver?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join our community of artisans to showcase your work, connect with customers, and grow your handloom business.
            </p>
            <Button size="lg" onClick={() => {
              // Redirect to registration page with weaver role pre-selected
              const registrationUrl = new URL('/auth', window.location.origin);
              const searchParams = new URLSearchParams();
              searchParams.set('tab', 'register');
              searchParams.set('role', 'weaver');
              registrationUrl.search = searchParams.toString();
              window.location.href = registrationUrl.toString();
            }}>
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
