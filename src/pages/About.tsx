
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, User } from 'lucide-react';

const About = () => {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                Our Mission: Preserving Heritage Through Connection
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Threadly bridges the gap between artisanal weavers and conscious consumers, creating a marketplace where tradition meets modern needs. We're dedicated to preserving ancient craftsmanship while providing sustainable livelihoods.
              </p>
              <Button asChild size="lg">
                <Link to="/weavers">
                  Meet Our Artisans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582903222084-5708d5f6c8a5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Handloom weaving" 
                className="w-full h-auto rounded-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary/10 w-full h-full rounded-xl -z-10"></div>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-medium mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                Founded in 2023 by a team passionate about preserving cultural heritage, Threadly began with a simple idea: connect consumers directly with weavers to create transparent, ethical relationships.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  year: "2023",
                  title: "The Beginning",
                  description: "Threadly was conceived after visiting rural weaving communities and realizing their struggle to reach fair markets."
                },
                {
                  year: "2024",
                  title: "Growth & Impact",
                  description: "Expanded to support 300+ weavers across multiple regions, helping increase their income by an average of 40%."
                },
                {
                  year: "2025",
                  title: "The Future",
                  description: "Building educational programs to ensure weaving techniques are passed to the next generation while expanding global reach."
                }
              ].map((milestone, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-8 hover-lift transition-all-300"
                >
                  <div className="text-primary font-medium mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-medium mb-3">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Values */}
        <section className="container mx-auto px-4 md:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1590421958459-071ca4271af6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Handloom weaving process" 
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-medium mb-6">Our Values</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Preservation of Craft",
                    description: "Supporting traditional techniques that have been passed down through generations."
                  },
                  {
                    title: "Fair Compensation",
                    description: "Ensuring artisans receive proper payment for their skilled work and time."
                  },
                  {
                    title: "Sustainability",
                    description: "Promoting eco-friendly practices and materials in all aspects of production."
                  },
                  {
                    title: "Community Development",
                    description: "Investing in the growth and well-being of weaving communities."
                  }
                ].map((value, index) => (
                  <div key={index} className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-1">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Team */}
        <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-medium mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A dedicated group of individuals committed to bridging the gap between tradition and modern commerce.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  name: "Yashwanth",
                  role: "Founder & CEO"
                },
                {
                  name: "Devendhar",
                  role: "Head of Artisan Relations"
                },
                {
                  name: "Varnika",
                  role: "Creative Director"
                },
                {
                  name: "Manasa",
                  role: "Technology Lead"
                }
              ].map((member, index) => (
                <div key={index} className="text-center bg-white p-6 rounded-xl hover-lift transition-all-300">
                  <div className="mb-4 bg-primary/5 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="container mx-auto px-4 md:px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-medium mb-4">Join Our Movement</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a conscious consumer or a skilled artisan, become part of our community dedicated to preserving handloom traditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/products">
                  Shop Handloom Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
