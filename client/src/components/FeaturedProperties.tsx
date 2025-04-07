import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedProperties() {
  const { data, isLoading } = useQuery<{ success: boolean; data: Property[] }>({
    queryKey: ["/api/properties/featured"],
  });

  const properties = data?.data || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              <Building className="inline-block mr-2 h-8 w-8" />
              Featured Properties
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Explore our handpicked selection of premium land offerings
            </p>
          </div>
          
          <div className="flex flex-wrap -mx-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
                <Card className="h-full">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48 rounded-t-lg" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-4/5 mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
            <Building className="inline-block mr-2 h-8 w-8" />
            Featured Properties
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Explore our handpicked selection of premium land offerings
          </p>
        </div>

        {properties.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {properties.map((property) => (
                <CarouselItem key={property.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1">
                    <PropertyCard property={property} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-center mt-8">
              <CarouselPrevious className="mr-2" />
              <CarouselNext className="ml-2" />
            </div>
          </Carousel>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No featured properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}