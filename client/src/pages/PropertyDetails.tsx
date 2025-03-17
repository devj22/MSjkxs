import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Property } from "@shared/schema";
import { 
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui";
import { 
  Bed, 
  Bath, 
  Home, 
  MapPin, 
  Ruler, 
  DollarSign, 
  Tag, 
  Calendar, 
  ArrowLeft,
  Loader2,
  Share2
} from "lucide-react";
import { ask_secrets } from "@/lib/googleMapsConfig";

// Default map configuration
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 32.7767,
  lng: -96.7970, // Dallas, TX
};

export default function PropertyDetails() {
  const [match, params] = useRoute<{ id: string }>('/property/:id');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  
  const { 
    data: propertyData,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['/api/properties', params?.id],
    enabled: !!params?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const property: Property | undefined = propertyData?.data;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            Back to All Properties
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
          {/* Navigation and Share */}
          <div className="flex justify-between items-center mb-6">
            <Link href="/properties">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Properties
              </Button>
            </Link>
            <Button variant="ghost" className="text-gray-600">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          {/* Property Images Carousel */}
          <div className="mb-8 bg-white rounded-lg overflow-hidden shadow-sm">
            <Carousel className="w-full">
              <CarouselContent>
                {property.imageUrls.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full">
                      <img 
                        src={imageUrl} 
                        alt={`${property.title} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          {/* Property Header */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {property.forSale ? 'For Sale' : 'For Rent'}
              </span>
              {property.featured && (
                <span className="ml-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
              <span className="ml-2 text-gray-500 text-sm">
                Listed on {formatDate(property.createdAt)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">{property.title}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="h-5 w-5 mr-1 text-red-500" />
              <span>{property.address}</span>
            </div>
            <div className="mt-4 flex items-center text-3xl font-bold text-primary">
              <DollarSign className="h-7 w-7" />
              {formatPrice(property.price)}
            </div>
          </div>
          
          {/* Property Details and Map Tabs */}
          <Tabs defaultValue="details" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="details">Property Details</TabsTrigger>
              <TabsTrigger value="map">Location & Map</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="bg-white rounded-lg shadow-sm p-6">
              {/* Property Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center p-3">
                  <Bed className="h-6 w-6 text-primary mb-2" />
                  <span className="text-2xl font-bold">{property.bedrooms}</span>
                  <span className="text-gray-500 text-sm">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <Bath className="h-6 w-6 text-primary mb-2" />
                  <span className="text-2xl font-bold">{property.bathrooms}</span>
                  <span className="text-gray-500 text-sm">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <Ruler className="h-6 w-6 text-primary mb-2" />
                  <span className="text-2xl font-bold">{property.area.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">Square Feet</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <Home className="h-6 w-6 text-primary mb-2" />
                  <span className="text-lg font-medium">{property.propertyType}</span>
                  <span className="text-gray-500 text-sm">Property Type</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
              
              {/* Contact Agent Button */}
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-1">Interested in this property?</h3>
                  <p className="text-gray-600">Contact our agent for more information or to schedule a viewing.</p>
                </div>
                <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 px-6">
                  Contact Agent
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="map" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <p className="mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-500" />
                {property.address}
              </p>
              
              {/* Google Maps */}
              <div className="h-[400px] rounded-lg overflow-hidden">
                <LoadScript
                  googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ""}
                  onLoad={() => setMapLoaded(true)}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{
                      lat: property.latitude,
                      lng: property.longitude
                    }}
                    zoom={15}
                  >
                    <Marker
                      position={{
                        lat: property.latitude,
                        lng: property.longitude
                      }}
                      onClick={() => setShowInfoWindow(true)}
                    >
                      {showInfoWindow && (
                        <InfoWindow
                          position={{
                            lat: property.latitude,
                            lng: property.longitude
                          }}
                          onCloseClick={() => setShowInfoWindow(false)}
                        >
                          <div className="p-2 max-w-[200px]">
                            <h3 className="font-bold text-sm">{property.title}</h3>
                            <p className="text-xs text-gray-600 mt-1">{property.address}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  </GoogleMap>
                </LoadScript>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Neighborhood: {property.location}</h3>
                <p className="text-gray-700">
                  This property is located in the {property.location} area, known for its 
                  excellent amenities and convenient location.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}