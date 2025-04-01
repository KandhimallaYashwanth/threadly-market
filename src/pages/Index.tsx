
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FeaturedWeavers from '@/components/home/FeaturedWeavers';
import { initializeDefaultData } from '@/lib/data';

const Index = () => {
  // Initialize default data when landing on home page
  React.useEffect(() => {
    initializeDefaultData();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <FeaturedWeavers />
        
        {/* About Our Mission Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-medium mb-6">
                  Empowering Artisans, Preserving Traditions
                </h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  At Threadly, we're committed to connecting traditional handloom weavers directly with customers who value authentic, handcrafted textiles. Through our platform, we're preserving ancient weaving techniques while providing sustainable livelihood for artisans.
                </p>
                <p className="text-lg text-muted-foreground">
                  Each product tells a story of cultural heritage and skilled craftsmanship. By supporting these artisans, you become part of a movement to sustain India's rich textile traditions and empower rural communities.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1599631388028-8daa733a038d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Indian artisan weaving traditional textiles on a handloom" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <p className="font-medium text-lg">Traditional handloom weaving in rural India</p>
                    <p className="text-white/80">Preserving craftsmanship passed down through generations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-medium mb-6 max-w-2xl mx-auto">
              Join our community of conscious consumers and artisanal creators
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Sign up to receive updates on new collections, artisan stories, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-lg bg-primary-foreground text-primary w-full focus:outline-none"
              />
              <button className="px-6 py-3 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
