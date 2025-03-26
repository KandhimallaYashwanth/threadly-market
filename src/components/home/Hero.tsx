
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center py-20">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1605028241606-ca03388e0df2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Handloom weaving" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6">
            Handcrafted Traditions, <br />
            <span className="text-white/90">Modern Connections</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
            Direct from loom to home. Explore unique handloom fabrics crafted by artisans preserving generations of tradition.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/products')} 
              size="lg" 
              className={cn(
                "text-base group transition-all hover:pr-10",
                "bg-white text-black hover:bg-white/90"
              )}
            >
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Button>
            <Button 
              onClick={() => navigate('/weavers')} 
              variant="outline" 
              size="lg" 
              className="text-base border-white text-white hover:bg-white/10"
            >
              Meet Our Weavers
            </Button>
          </div>
          
          <div className="flex items-center space-x-8 mt-16">
            <div className="text-white">
              <div className="text-3xl font-medium">1200+</div>
              <div className="text-white/70">Unique Products</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-white">
              <div className="text-3xl font-medium">300+</div>
              <div className="text-white/70">Master Weavers</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-white">
              <div className="text-3xl font-medium">50+</div>
              <div className="text-white/70">Weaving Techniques</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="text-white/70 text-sm mb-2">Scroll to explore</div>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
