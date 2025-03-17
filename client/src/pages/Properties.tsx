import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@shared/schema";
import { 
  Loader2, 
  Search, 
  SlidersHorizontal, 
  X,
  ChevronDown,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Properties() {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [forSaleOnly, setForSaleOnly] = useState(false);
  const [forRentOnly, setForRentOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  // Fetch all properties
  const { 
    data: propertiesData,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['/api/properties'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const properties: Property[] = propertiesData?.data || [];
  
  // Apply filters
  useEffect(() => {
    if (!properties.length) return;
    
    let results = [...properties];
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(property => 
        property.title.toLowerCase().includes(term) ||
        property.description.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        property.propertyType.toLowerCase().includes(term)
      );
    }
    
    // Property type filter
    if (propertyType) {
      results = results.filter(property => property.propertyType === propertyType);
    }
    
    // Price range filter
    results = results.filter(property => 
      property.price >= minPrice && property.price <= maxPrice
    );
    
    // Bedrooms filter
    if (minBedrooms > 0) {
      results = results.filter(property => property.bedrooms >= minBedrooms);
    }
    
    // For sale/rent filters
    if (forSaleOnly && !forRentOnly) {
      results = results.filter(property => property.forSale);
    } else if (!forSaleOnly && forRentOnly) {
      results = results.filter(property => !property.forSale);
    }
    
    // Featured property filter
    if (featuredOnly) {
      results = results.filter(property => property.featured);
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "bedrooms-desc":
        results.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case "area-desc":
        results.sort((a, b) => b.area - a.area);
        break;
      case "newest":
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    setFilteredProperties(results);
  }, [
    properties, 
    searchTerm, 
    propertyType, 
    minPrice, 
    maxPrice, 
    minBedrooms, 
    forSaleOnly, 
    forRentOnly, 
    featuredOnly,
    sortOrder
  ]);
  
  // Get unique property types
  const propertyTypes = properties ? 
    Array.from(new Set(properties.map(property => property.propertyType))) : 
    [];
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setPropertyType(null);
    setMinPrice(0);
    setMaxPrice(5000000);
    setMinBedrooms(0);
    setForSaleOnly(false);
    setForRentOnly(false);
    setFeaturedOnly(false);
    setSortOrder("newest");
  };
  
  // Toggle filter visibility on mobile
  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  // Display properties based on filters
  const displayProperties = filteredProperties.length > 0 ? filteredProperties : properties;

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Properties
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Discover your dream property from our exclusive listings. Use the filters to find the perfect match for your needs.
            </p>
          </div>

          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4">
            <Button 
              onClick={toggleFilter}
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {isFilterVisible ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Filters - Desktop always visible, Mobile conditionally visible */}
            <div className={`md:col-span-3 ${isFilterVisible ? 'block' : 'hidden md:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-primary hover:text-primary/90"
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <Label htmlFor="search" className="mb-2 block text-sm font-medium">
                      Search
                    </Label>
                    <div className="relative">
                      <Input
                        id="search"
                        type="text"
                        placeholder="Search properties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-primary" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible defaultValue="price">
                    {/* Property Type */}
                    <AccordionItem value="propertyType">
                      <AccordionTrigger className="text-sm font-medium">
                        Property Type
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {propertyTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`type-${type}`}
                                checked={propertyType === type}
                                onCheckedChange={(checked) => 
                                  setPropertyType(checked ? type : null)
                                }
                              />
                              <Label
                                htmlFor={`type-${type}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Price Range */}
                    <AccordionItem value="price">
                      <AccordionTrigger className="text-sm font-medium">
                        Price Range
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="flex justify-between">
                            <span className="text-sm">{formatPrice(minPrice)}</span>
                            <span className="text-sm">{formatPrice(maxPrice)}</span>
                          </div>
                          <Slider
                            value={[minPrice, maxPrice]}
                            min={0}
                            max={5000000}
                            step={50000}
                            onValueChange={(value) => {
                              setMinPrice(value[0]);
                              setMaxPrice(value[1]);
                            }}
                            className="mt-2"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Bedrooms */}
                    <AccordionItem value="bedrooms">
                      <AccordionTrigger className="text-sm font-medium">
                        Bedrooms
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`bedrooms-${num}`}
                                checked={minBedrooms === num}
                                onCheckedChange={(checked) => 
                                  setMinBedrooms(checked ? num : 0)
                                }
                              />
                              <Label
                                htmlFor={`bedrooms-${num}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {num === 0 ? 'Any' : num === 5 ? '5+' : num}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Property Status */}
                    <AccordionItem value="status">
                      <AccordionTrigger className="text-sm font-medium">
                        Property Status
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="for-sale"
                              checked={forSaleOnly}
                              onCheckedChange={(checked) => {
                                setForSaleOnly(!!checked);
                                if (checked) setForRentOnly(false);
                              }}
                            />
                            <Label
                              htmlFor="for-sale"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              For Sale
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="for-rent"
                              checked={forRentOnly}
                              onCheckedChange={(checked) => {
                                setForRentOnly(!!checked);
                                if (checked) setForSaleOnly(false);
                              }}
                            />
                            <Label
                              htmlFor="for-rent"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              For Rent
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="featured"
                              checked={featuredOnly}
                              onCheckedChange={(checked) => 
                                setFeaturedOnly(!!checked)
                              }
                            />
                            <Label
                              htmlFor="featured"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Featured Only
                            </Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
            
            {/* Properties Grid */}
            <div className="md:col-span-9">
              {/* Sort and Results Count */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{displayProperties.length}</span> properties found
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort" className="text-sm whitespace-nowrap">
                    Sort by:
                  </Label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                      <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                      <SelectItem value="bedrooms-desc">Most Bedrooms</SelectItem>
                      <SelectItem value="area-desc">Largest Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Loading, Error and Empty states */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                  <p className="text-red-500 text-lg">Error loading properties. Please try again later.</p>
                </div>
              ) : displayProperties.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                  <CheckSquare className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
                  <Button onClick={resetFilters} className="bg-primary hover:bg-primary/90">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                /* Properties Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}