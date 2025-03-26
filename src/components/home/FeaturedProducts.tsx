
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { productsWithWeavers } from '@/lib/data';

const FeaturedProducts = () => {
  // Get first 4 products for featured section
  const featuredProducts = productsWithWeavers.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our handpicked selection of exquisite handloom fabrics, each piece telling a unique story of craftsmanship and heritage.
            </p>
          </div>
          <Button 
            asChild 
            variant="link" 
            className="mt-4 md:mt-0 group no-underline"
          >
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              className="animate-scale-in"
            />
          ))}
        </div>
        
        {/* Categories Quick Links */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Sarees & Stoles",
              image: "https://images.unsplash.com/photo-1610261041212-363b2a424c22?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              link: "/products?category=saree"
            },
            {
              title: "Home Textiles",
              image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              link: "/products?category=home"
            },
            {
              title: "Dress Materials",
              image: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=1415&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              link: "/products?category=dress"
            },
            {
              title: "Accessories",
              image: "https://images.unsplash.com/photo-1607779097040-29ca8111839e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              link: "/products?category=accessory"
            },
          ].map((category, index) => (
            <Link 
              key={index} 
              to={category.link} 
              className="relative overflow-hidden rounded-lg h-60 group hover-lift"
            >
              <img 
                src={category.image} 
                alt={category.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-xl font-medium mb-1">{category.title}</h3>
                  <span className="text-white/80 text-sm flex items-center">
                    Explore Collection
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
