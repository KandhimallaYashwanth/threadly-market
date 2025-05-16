
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, X, ChevronDown, ArrowUpDown, Check 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { productsWithWeavers } from '@/lib/data';
import { FabricType } from '@/lib/types';
import { cn } from '@/lib/utils';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    fabricTypes: [] as FabricType[],
    priceRange: { min: 0, max: 15000 },
    inStock: true,
  });

  // Filter products based on search term and filters
  const filteredProducts = productsWithWeavers.filter(product => {
    // Search term filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(product.weaver && product.weaver.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Fabric type filter
    if (filters.fabricTypes.length > 0 && !filters.fabricTypes.includes(product.fabricType)) {
      return false;
    }
    
    // Price range filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }
    
    // In stock filter
    if (filters.inStock && !product.inStock) {
      return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'popular':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Toggle fabric type in filters
  const toggleFabricType = (type: FabricType) => {
    setFilters(prev => {
      const newTypes = prev.fabricTypes.includes(type)
        ? prev.fabricTypes.filter(t => t !== type)
        : [...prev.fabricTypes, type];
      
      return { ...prev, fabricTypes: newTypes };
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      fabricTypes: [],
      priceRange: { min: 0, max: 15000 },
      inStock: true,
    });
    setSearchTerm('');
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium mb-2">Handloom Products</h1>
            <div className="flex items-center text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span>Products</span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search products, weavers..." 
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filterOpen ? "default" : "outline"}
                className={cn("flex items-center gap-2", filterOpen && "bg-primary text-primary-foreground")}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="w-4 h-4" />
                Filters
                {filters.fabricTypes.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-secondary-foreground text-secondary text-xs flex items-center justify-center">
                    {filters.fabricTypes.length}
                  </span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort By
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuRadioItem value="newest">
                      <div className="flex items-center justify-between w-full">
                        Newest <Check className={cn("w-4 h-4 ml-2", sortBy !== "newest" && "opacity-0")} />
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="popular">
                      <div className="flex items-center justify-between w-full">
                        Most Popular <Check className={cn("w-4 h-4 ml-2", sortBy !== "popular" && "opacity-0")} />
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priceLow">
                      <div className="flex items-center justify-between w-full">
                        Price: Low to High <Check className={cn("w-4 h-4 ml-2", sortBy !== "priceLow" && "opacity-0")} />
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priceHigh">
                      <div className="flex items-center justify-between w-full">
                        Price: High to Low <Check className={cn("w-4 h-4 ml-2", sortBy !== "priceHigh" && "opacity-0")} />
                      </div>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="bg-secondary/50 rounded-lg p-6 mb-8 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium">Filter Products</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fabric Type Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Fabric Type</h4>
                  <div className="space-y-2">
                    {Object.values(FabricType).map((type) => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary focus:ring-primary mr-2"
                          checked={filters.fabricTypes.includes(type)}
                          onChange={() => toggleFabricType(type)} 
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Min</label>
                        <Input 
                          type="number" 
                          value={filters.priceRange.min}
                          onChange={(e) => setFilters(prev => ({
                            ...prev, 
                            priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                          }))} 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Max</label>
                        <Input 
                          type="number" 
                          value={filters.priceRange.max}
                          onChange={(e) => setFilters(prev => ({
                            ...prev, 
                            priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                          }))} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Availability Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Availability</h4>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={filters.inStock}
                      onChange={() => setFilters(prev => ({ ...prev, inStock: !prev.inStock }))} 
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 text-muted-foreground">
            Showing {sortedProducts.length} of {productsWithWeavers.length} products
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  className="animate-scale-in"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">😕</div>
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={resetFilters}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
