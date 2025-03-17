import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@/hooks/use-search";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const { search, searchResults, isSearching } = useSearch<Property>();
  
  // Fetch all properties
  const { 
    data: properties,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['/api/properties'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      search(`/api/properties/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Display either search results or all properties
  const displayProperties = searchResults?.data.length ? searchResults.data : properties?.data || [];

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Browse our extensive collection of premium properties in the most desirable locations. 
              Use the search and filters to find your perfect match.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search by location, property type, etc."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Button type="submit" disabled={isSearching} className="bg-primary hover:bg-primary/90">
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching
                  </>
                ) : (
                  "Search"
                )}
              </Button>
              {searchResults && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm("")}
                  className="border-gray-300"
                >
                  Clear
                </Button>
              )}
            </form>
          </div>

          {/* Filters */}
          <PropertyFilters />

          {/* Properties Grid */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">Error loading properties. Please try again later.</p>
              </div>
            ) : displayProperties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your search or filters to find more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProperties.map((property: Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}