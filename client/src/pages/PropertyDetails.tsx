import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Property } from "@shared/schema";
import { 
  Loader2, 
  ArrowLeft, 
  Bed, 
  Bath, 
  Ruler, 
  MapPin, 
  Home, 
  Phone, 
  Mail,
  Calendar,
  Tag,
  Share2,
  Heart,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GoogleMap, Marker } from '@react-google-maps/api';

// Placeholder for Google Maps API key - this would come from env variables in production
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";

// Default map center (will be overridden by property coords)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

export default function PropertyDetails() {
  const [match, params] = useRoute<{ id: string }>('/property/:id');
  const [showMap, setShowMap] = useState(false);
  
  const { 
    data: propertyData,
    isLoading,
    error 
  } = useQuery<{ success: boolean; data: Property }>({
    queryKey: ['/api/properties', params?.id],
    enabled: !!params?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const property: Property | undefined = propertyData?.data;
  
  const formatPrice = (price: number | undefined) => {
    if (!price && price !== 0) return "Price on request";
    
    const numericValue = price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
    
    // Convert to words for land pricing (Indian style)
    const inWords = convertToIndianWords(price);
    
    return `${numericValue} (${inWords})`;
  };
  
  // Function to convert numbers to Indian style words (lakhs, crores)
  const convertToIndianWords = (num: number): string => {
    if (num >= 10000000) { // 1 crore
      const crores = (num / 10000000);
      return `${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Crore`;
    } else if (num >= 100000) { // 1 lakh
      const lakhs = (num / 100000);
      return `${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} Lakh`;
    } else if (num >= 1000) { // 1 thousand
      const thousands = (num / 1000);
      return `${thousands.toFixed(thousands % 1 === 0 ? 0 : 2)} Thousand`;
    } else {
      return num.toString();
    }
  };

  // Load Google Maps when tab is selected
  const handleMapTabSelect = () => {
    setShowMap(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/properties">
          <Button className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Navigation */}
          <div className="mb-6">
            <Link href="/properties">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Properties
              </Button>
            </Link>
          </div>
          
          {/* Property Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Tag className="h-4 w-4 mr-1" />
                {property.propertyType || 'Land'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Calendar className="h-4 w-4 mr-1" />
                {property.forSale ? 'For Sale' : 'For Rent'}
              </span>
              {property.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  <Calendar className="h-4 w-4 mr-1" />
                  Featured
                </span>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-red-500" />
                  <span>{property.location || 'Location not available'}</span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  {formatPrice(property.price)}
                </h2>
                {!property.forSale && (
                  <p className="text-gray-600">/month</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Property Images Carousel */}
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {property.imageUrls && property.imageUrls.length > 0 ? (
                  property.imageUrls.map((imageUrl, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                        <img 
                          src={imageUrl} 
                          alt={`${property.title} - Image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                <CarouselPrevious className="pointer-events-auto" />
                <CarouselNext className="pointer-events-auto" />
              </div>
            </Carousel>
          </div>
          
          {/* Property Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Main Content - 2/3 width on large screens */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Features */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                    <Bed className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">{property.bedrooms || 'N/A'}</span>
                    <span className="text-gray-600 text-sm">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                    <Bath className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">{property.bathrooms || 'N/A'}</span>
                    <span className="text-gray-600 text-sm">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                    <Ruler className="h-8 w-8 text-primary mb-2" />
                    <span className="text-2xl font-bold">{property.area ? property.area.toLocaleString() : 'N/A'}</span>
                    <span className="text-gray-600 text-sm">Square Feet</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                    <Home className="h-8 w-8 text-primary mb-2" />
                    <span className="text-lg font-bold">{property.propertyType || 'Land'}</span>
                    <span className="text-gray-600 text-sm">Property Type</span>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p>{property.description || 'Property description not available.'}</p>
                </div>
              </div>
              
              {/* Tabs for Additional Information */}
              <div className="bg-white rounded-lg shadow-sm">
                <Tabs defaultValue="address">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="address">Address</TabsTrigger>
                    <TabsTrigger value="map" onClick={handleMapTabSelect}>Map</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    {property.youtubeUrl && (
                      <TabsTrigger value="video">Video</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="address" className="p-6">
                    <h3 className="text-xl font-bold mb-4">Property Address</h3>
                    <p className="mb-2">
                      <span className="font-medium">Full Address:</span> {property.address || 'Address not available'}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Location:</span> {property.location || 'Location not available'}
                    </p>
                  </TabsContent>
                  <TabsContent value="map" className="p-6">
                    <h3 className="text-xl font-bold mb-4">Property Location</h3>
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
                      {showMap ? (
                        <GoogleMap
                          mapContainerStyle={{
                            width: '100%',
                            height: '100%',
                          }}
                          center={{
                            lat: property.latitude || defaultCenter.lat,
                            lng: property.longitude || defaultCenter.lng
                          }}
                          zoom={15}
                        >
                          <Marker
                            position={{
                              lat: property.latitude || defaultCenter.lat,
                              lng: property.longitude || defaultCenter.lng
                            }}
                          />
                        </GoogleMap>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="features" className="p-6">
                    <h3 className="text-xl font-bold mb-4">Property Features</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                          ✓
                        </div>
                        <span>Air Conditioning</span>
                      </div>
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                          ✓
                        </div>
                        <span>Heating System</span>
                      </div>
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                          ✓
                        </div>
                        <span>Parking</span>
                      </div>
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                          ✓
                        </div>
                        <span>Garden</span>
                      </div>
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                          ✓
                        </div>
                        <span>Security System</span>
                      </div>
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                          ✓
                        </div>
                        <span>High-Speed Internet</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {property.youtubeUrl && (
                    <TabsContent value="video" className="p-6">
                      <h3 className="text-xl font-bold mb-4">Property Video</h3>
                      <div className="mb-4">
                        <p className="text-gray-600 mb-4">
                          Click the link below to view a video tour of this property:
                        </p>
                        <a 
                          href={property.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        >
                          <div className="flex items-center">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            Watch Video on YouTube
                          </div>
                        </a>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-md mt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Note:</span> This link will open YouTube in a new tab. The video showcases the property features and surrounding area.
                        </p>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>
            
            {/* Sidebar - 1/3 width on large screens */}
            <div className="space-y-6">
              {/* Contact Agent Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                    <img 
                      src="https://ui-avatars.com/api/?name=John+Doe&background=random" 
                      alt="John Doe"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">John Doe</h4>
                    <p className="text-gray-600 text-sm">Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-2" />
                    <span>(123) 456-7890</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-2" />
                    <span>agent@nainalanddeals.com</span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue={`I'm interested in ${property.title}.`}
                  ></textarea>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center justify-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center col-span-2">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Details
                  </Button>
                </div>
              </div>
              
              {/* Similar Properties Teaser */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Similar Properties</h3>
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">
                    More properties like this will be available soon!
                  </p>
                  <Link href="/properties">
                    <Button variant="outline">
                      Browse All Properties
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}