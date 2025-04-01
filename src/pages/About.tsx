
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const About = () => {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold mb-6">About Threadly</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connecting artisanal weavers with conscious consumers, 
              preserving traditional handloom craftsmanship across India.
            </p>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-medium mb-6">Our Story</h2>
                <p className="text-lg mb-4">
                  Threadly was born from a passion to preserve India's rich handloom heritage and empower the artisans who keep these traditions alive. Our journey began when we witnessed firsthand the challenges faced by talented weavers in rural communities.
                </p>
                <p className="text-lg mb-4">
                  Despite creating exquisite textiles, many weavers struggled to reach markets beyond their villages and earn fair compensation for their craft. Middlemen often capitalized on this gap, leaving artisans with minimal profits for their labor-intensive work.
                </p>
                <p className="text-lg">
                  We envisioned a platform that would bridge this divide—connecting these skilled artisans directly with customers who appreciate authentic handcrafted textiles. Threadly is the realization of that vision, a marketplace where tradition meets technology.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1583922146233-a68aeff383e3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Traditional handloom weaving" 
                  className="w-full object-cover h-[600px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <p className="font-medium text-lg">Handloom weaving in Southern India</p>
                    <p className="text-white/80">A craft passed down through generations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-medium mb-6">Our Mission</h2>
              <p className="text-xl mb-10">
                To preserve India's rich textile heritage by creating sustainable livelihoods for handloom artisans through direct market access and fair trade practices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 p-8 rounded-xl">
                <h3 className="text-xl font-medium mb-4">Preserve Traditions</h3>
                <p className="text-primary-foreground/80">
                  Support and document traditional weaving techniques that are at risk of being lost in the age of mass production.
                </p>
              </div>
              
              <div className="bg-white/10 p-8 rounded-xl">
                <h3 className="text-xl font-medium mb-4">Empower Artisans</h3>
                <p className="text-primary-foreground/80">
                  Provide weavers with fair compensation, business training, and direct market access to ensure sustainable livelihoods.
                </p>
              </div>
              
              <div className="bg-white/10 p-8 rounded-xl">
                <h3 className="text-xl font-medium mb-4">Promote Sustainability</h3>
                <p className="text-primary-foreground/80">
                  Champion eco-friendly production methods and natural materials that minimize environmental impact.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Impact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Handloom weaver at work" 
                  className="rounded-lg h-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1519308579906-2d69a78a10fa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Handcrafted textile" 
                  className="rounded-lg h-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1623625434462-e5e42318ae49?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Handloom textiles" 
                  className="rounded-lg h-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1598030304671-5aa1d6f13fde?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Artisan community" 
                  className="rounded-lg h-full object-cover"
                />
              </div>
              
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-medium mb-6">Our Impact</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">500+ Artisans</h3>
                    <p className="text-muted-foreground">
                      Connected to global markets, earning sustainable income through our platform.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">25+ Weaving Clusters</h3>
                    <p className="text-muted-foreground">
                      Across different regions of India, preserving unique regional techniques.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">10,000+ Customers</h3>
                    <p className="text-muted-foreground">
                      Joined our movement to support ethical, handcrafted textiles.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">40% Income Increase</h3>
                    <p className="text-muted-foreground">
                      Average income increase for artisans who join our platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-medium mb-12 text-center">Voices from our Community</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="italic mb-4">
                  "Being part of Threadly has transformed my life. I can now share my family's weaving traditions with people across the world and earn a fair income."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Rajesh Kumar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Rajesh Kumar</p>
                    <p className="text-sm text-muted-foreground">Cotton Weaver, Gujarat</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="italic mb-4">
                  "The quality and story behind each piece I've purchased from Threadly is incomparable. I love knowing my purchase directly supports skilled artisans."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Priya Sharma" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-sm text-muted-foreground">Customer, Bangalore</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="italic mb-4">
                  "Threadly is helping preserve our village's weaving traditions that were dying out. Now even younger generations see a future in this craft."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Lakshmi Devi" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Lakshmi Devi</p>
                    <p className="text-sm text-muted-foreground">Master Weaver, Tamil Nadu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-medium mb-6">Join Our Movement</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Whether you're an artisan looking to showcase your craft or a customer passionate about authentic handmade textiles, become part of our growing community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/auth?applyToJoin=true" 
                className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Apply as an Artisan
              </a>
              <a 
                href="/auth" 
                className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/20 transition-colors"
              >
                Create Customer Account
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
