import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "./PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

export default function PropertyCarousel() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Property[] }>({
    queryKey: ["/api/properties/featured"],
  });
  
  const isMobile = useIsMobile();
  
  const properties = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load properties</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No featured properties available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Featured Properties</h2>
        <Button 
          variant="outline" 
          className="border-primary text-primary hover:bg-primary hover:text-white"
          asChild
        >
          <a href="/properties">View All Properties</a>
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {properties.map((property) => (
            <CarouselItem 
              key={property.id} 
              className={`pl-4 ${isMobile ? 'basis-full' : 'basis-1/2 md:basis-1/3 lg:basis-1/4'}`}
            >
              <div className="h-full">
                <PropertyCard property={property} carouselStyle={true} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4 gap-2">
          <CarouselPrevious className="relative static translate-y-0 left-0" />
          <CarouselNext className="relative static translate-y-0 right-0" />
        </div>
      </Carousel>
    </div>
  );
}