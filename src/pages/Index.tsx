
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FeaturedWeavers from '@/components/home/FeaturedWeavers';

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <FeaturedWeavers />
        
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
