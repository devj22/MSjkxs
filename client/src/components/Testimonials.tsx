import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Property Investor",
    testimonial:
      "Nainaland Deals exceeded my expectations. Their transparent process and deep market knowledge helped me find the perfect investment opportunity. I highly recommend their services to anyone looking for land in the region.",
    rating: 5,
    initials: "RK",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "First-time Buyer",
    testimonial:
      "As a first-time land buyer, I was very nervous about the process. The team at Nainaland Deals guided me through every step with patience and expertise. They found me a beautiful plot that perfectly matched my budget and requirements.",
    rating: 5,
    initials: "PS",
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Business Owner",
    testimonial:
      "I was searching for the right commercial plot for my new venture, and Nainaland Deals made it happen. Their knowledge of zoning regulations and future development plans in the area was invaluable. Excellent service!",
    rating: 4,
    initials: "AP",
  },
  {
    id: 4,
    name: "Sunita Verma",
    role: "Residential Homebuilder",
    testimonial:
      "Working with Nainaland Deals was a great experience. They understood exactly what I was looking for in a residential plot and presented me with excellent options. Their after-sale support has also been outstanding.",
    rating: 5,
    initials: "SV",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied clients
          </p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4 md:pl-6">
                <Card className="border rounded-lg shadow-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.testimonial}"</p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 bg-primary text-white">
                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex justify-center mt-8">
            <CarouselPrevious className="mr-2" />
            <CarouselNext className="ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}