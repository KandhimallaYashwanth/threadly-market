import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WeaverCard from '@/components/ui/WeaverCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserRole, User } from '@/lib/types';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { useRealtimeSubscription } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';

// Extended user interface for weaver with stats
interface WeaverWithStats extends User {
  productCount: number;
  averageRating: number;
}

const Weavers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weavers, setWeavers] = useState<WeaverWithStats[]>([]);
  
  // Fetch weavers from Supabase using a direct query instead of useSupabaseQuery
  useEffect(() => {
    const fetchWeavers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', UserRole.WEAVER);
          
        if (error) throw error;
        
        if (data) {
          // Convert data to User objects
          const mappedWeavers = data.map(mapSupabaseProfileToUser);
          
          // Enrich weavers with product stats
          const weaversWithStats = await fetchWeaverStats(mappedWeavers);
          setWeavers(weaversWithStats);
        }
      } catch (error) {
        console.error('Error fetching weavers:', error);
      }
    };
    
    fetchWeavers();
  }, []);
  
  // Setup realtime subscription for weaver profiles
  useEffect(() => {
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'profiles',
        filter: `role=eq.${UserRole.WEAVER}`
      }, (payload) => {
        // If it's a new weaver, add them to the list
        if (payload.new) {
          const newWeaver = mapSupabaseProfileToUser(payload.new as any);
          
          // Fetch stats for the new weaver
          fetchWeaverStats([newWeaver]).then(enrichedWeavers => {
            setWeavers(prev => [...prev, enrichedWeavers[0]]);
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `role=eq.${UserRole.WEAVER}`
      }, (payload) => {
        // If a weaver is updated, update them in the list
        if (payload.new) {
          const updatedWeaver = mapSupabaseProfileToUser(payload.new as any);
          
          setWeavers(prev => 
            prev.map(w => {
              if (w.id === updatedWeaver.id) {
                // Preserve stats when updating
                return { 
                  ...updatedWeaver, 
                  productCount: w.productCount, 
                  averageRating: w.averageRating 
                };
              }
              return w;
            })
          );
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Helper function to map Supabase profile to User type
  const mapSupabaseProfileToUser = (profile: any): User => {
    return {
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role as UserRole,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      isVerified: profile.is_verified,
      createdAt: new Date(profile.created_at)
    };
  };
  
  // Fetch products for each weaver to get product counts and average ratings
  const fetchWeaverStats = async (weavers: User[]): Promise<WeaverWithStats[]> => {
    if (!weavers || weavers.length === 0) return [];
    
    // Create a map of weaver IDs to their stats
    const weaverStats = new Map<string, { productCount: number, totalRating: number, ratingCount: number }>();
    
    // Initialize stats for each weaver
    weavers.forEach(weaver => {
      weaverStats.set(weaver.id, { productCount: 0, totalRating: 0, ratingCount: 0 });
    });
    
    try {
      // Fetch all products
      const { data: products, error } = await supabase
        .from('products')
        .select('weaver_id, rating');
      
      if (error) throw error;
      
      if (products) {
        // Calculate stats for each weaver
        products.forEach((product: any) => {
          const stats = weaverStats.get(product.weaver_id);
          if (stats) {
            stats.productCount += 1;
            if (product.rating) {
              stats.totalRating += product.rating;
              stats.ratingCount += 1;
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    
    // Add stats to weavers
    return weavers.map(weaver => {
      const stats = weaverStats.get(weaver.id);
      const averageRating = stats && stats.ratingCount > 0 
        ? stats.totalRating / stats.ratingCount 
        : 0;
      
      return {
        ...weaver,
        productCount: stats?.productCount || 0,
        averageRating
      };
    });
  };

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
