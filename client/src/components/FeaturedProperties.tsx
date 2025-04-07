import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import PropertyCard from "./PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FeaturedProperties() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Property[] }>({
    queryKey: ['/api/properties/featured'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const properties = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600">Failed to load featured properties.</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600">No featured properties available at the moment.</p>
      </div>
    );
  }

  return (
    <section id="featured-properties" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary">Featured Properties</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mt-2 mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties that represent the best value
            and potential for investment.
          </p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {properties.map((property) => (
              <CarouselItem key={property.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <PropertyCard property={property} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex justify-center gap-2">
            <CarouselPrevious className="relative static transform-none" />
            <CarouselNext className="relative static transform-none" />
          </div>
        </Carousel>
        
        <div className="text-center mt-10">
          <Link href="/properties">
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors">
              View All Properties
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}