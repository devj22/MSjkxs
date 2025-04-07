import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Bed, Bath, Ruler, MapPin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/property/${property.id}`}>
        <div className="relative aspect-[4/3] cursor-pointer">
          <img 
            src={property.imageUrls[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.featured && (
            <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
              Featured
            </Badge>
          )}
          <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700">
            {property.forSale ? 'For Sale' : 'For Rent'}
          </Badge>
          {property.youtubeUrl && (
            <div className="absolute bottom-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-red-600 text-white p-1.5 rounded-full">
                      <Youtube className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Video tour available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-primary line-clamp-1">{property.title}</h3>
          <p className="text-lg font-bold text-primary whitespace-nowrap ml-2">
            {formatPrice(property.price)}
          </p>
        </div>
        
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-red-500" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center text-gray-700">
            <Bed className="h-4 w-4 mr-1 text-primary" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Bath className="h-4 w-4 mr-1 text-primary" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Ruler className="h-4 w-4 mr-1 text-primary" />
            <span>{property.area.toLocaleString()} sqft</span>
          </div>
        </div>
        
        <Link href={`/property/${property.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}